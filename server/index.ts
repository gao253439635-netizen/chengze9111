import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { config } from './config';
import { logger } from './logger';
import { db } from './db';
import { getConfig, saveConfig } from './repositories/siteConfigRepo';
import {
  createLead,
  listLeads,
  getLead,
  updateStatus,
  getLeadStats,
  LEAD_STATUSES,
} from './repositories/leadsRepo';
import { saveUpload } from './repositories/uploadRepo';
import { requireAuth, loginHandler, authStatusHandler, changePasswordHandler } from './auth';
import { AppError, asyncHandler, errorHandler } from './lib/errors';
import { leadCreateSchema, uploadSchema } from './lib/validation';
import { notifyLead } from './lib/notify';

// ---------- 限流（按真实对端 IP，60s 窗口；带清理避免内存泄漏） ----------
const hits = new Map<string, number[]>();
setInterval(() => {
  const now = Date.now();
  for (const [ip, arr] of hits) {
    const kept = arr.filter((t) => now - t < 60_000);
    if (kept.length) hits.set(ip, kept);
    else hits.delete(ip);
  }
}, 60_000).unref();

function getClientIp(req: express.Request): string {
  if (!config.trustProxy) return req.socket?.remoteAddress || 'unknown';
  return (req.ip || req.socket?.remoteAddress || 'unknown') as string;
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  if (arr.length >= config.leadsMaxPerMin) {
    hits.set(ip, arr);
    return true;
  }
  arr.push(now);
  hits.set(ip, arr);
  return false;
}

function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = getClientIp(req);
  if (rateLimited(ip)) {
    res.setHeader('Retry-After', '60');
    return res
      .status(429)
      .json({ error: { code: 'RATE_LIMITED', message: '提交过于频繁，请稍后再试' } });
  }
  next();
}

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', config.trustProxy);
  app.use(express.json({ limit: config.bodyLimit }));

  // 请求 ID + 基础安全头
  app.use((req, res, next) => {
    const id = crypto.randomUUID();
    (req as any).id = id;
    res.setHeader('X-Request-Id', id);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'",
    );
    next();
  });

  // CORS（显式 origins；默认 * 仅本机）
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (config.corsOrigins.includes('*')) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
    } else if (origin && config.corsOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  });

  // 探针
  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.get(
    '/ready',
    asyncHandler(async (_req, res) => {
      try {
        db.prepare('SELECT 1').get();
        res.json({ status: 'ok', checks: { db: 'ok' } });
      } catch {
        res.status(503).json({ status: 'degraded', checks: { db: 'unavailable' } });
      }
    }),
  );

  // 站点配置（前台读取公开；后台保存才需认证）
  app.get(
    '/api/config',
    asyncHandler(async (_req, res) => {
      res.json(getConfig());
    }),
  );
  app.get('/api/v1/auth/status', authStatusHandler);
  app.post(
    '/api/config',
    requireAuth,
    asyncHandler(async (req, res) => {
      const body = (req.body || {}) as any;
      const data = body.config !== undefined ? body.config : body;
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new AppError(400, 'INVALID_CONFIG', '配置必须是对象');
      }
      saveConfig(data, 'admin');
      res.json({ ok: true });
    }),
  );

  // 图片上传（受保护 + 安全校验）
  app.post(
    '/api/upload',
    requireAuth,
    asyncHandler(async (req, res) => {
      const parsed = uploadSchema.safeParse(req.body || {});
      if (!parsed.success) throw new AppError(400, 'VALIDATION_ERROR', '参数非法');
      const result = saveUpload(parsed.data.filename, parsed.data.data);
      res.json(result);
    }),
  );

  // 登录（仅 AUTH_ENABLED）
  app.post('/api/v1/auth/login', (req, res) => loginHandler(req, res));

  // 登出
  app.post('/api/v1/auth/logout', (req, res) => {
    res.clearCookie('admin_session');
    res.json({ ok: true });
  });

  // 修改密码（需登录）
  app.post('/api/v1/auth/change-password', requireAuth, (req, res) => changePasswordHandler(req, res));

  // 接单线索：公开提交（限流 + 校验 + 去重 + 通知）
  app.post(
    '/api/v1/leads',
    rateLimit,
    asyncHandler(async (req, res) => {
      const parsed = leadCreateSchema.safeParse(req.body || {});
      if (!parsed.success) {
        throw new AppError(422, 'VALIDATION_ERROR', '联系方式必填或字段超长');
      }
      const lead = createLead(parsed.data);
      notifyLead(lead);
      res.status(201).json({ id: lead.id, status: lead.status });
    }),
  );

  // 接单线索：受保护查看（分页 + 可选状态过滤）
  app.get(
    '/api/v1/leads',
    requireAuth,
    asyncHandler(async (req, res) => {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const status = typeof req.query.status === 'string' ? req.query.status : undefined;
      const { rows, total } = listLeads({ limit, offset, status });
      res.json({ data: rows, total, count: rows.length });
    }),
  );

  // 渠道归因统计：受保护（后台看板用）
  app.get(
    '/api/v1/leads/stats',
    requireAuth,
    asyncHandler(async (_req, res) => {
      res.json(getLeadStats());
    }),
  );

  // 接单线索：受保护更新状态（生命周期 new/contacted/won/lost/duplicate）
  app.patch(
    '/api/v1/leads/:id',
    requireAuth,
    asyncHandler(async (req, res) => {
      const id = Number(req.params.id);
      const status = (req.body as any)?.status;
      if (!LEAD_STATUSES.includes(status)) {
        throw new AppError(422, 'VALIDATION_ERROR', '非法的线索状态');
      }
      const updated = updateStatus(id, status);
      if (!updated) throw new AppError(404, 'NOT_FOUND', '线索不存在');
      res.json(updated);
    }),
  );

  // 静态托管 + SPA 回退（仅当 dist 存在：生产 start / preview 场景）
  const distDir = path.resolve(config.root, config.distDir);
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    // 托管后台上传的图片（public/uploads），避免上线后 /uploads/* 404
    const uploadDir = path.resolve(config.root, config.uploadDir);
    if (fs.existsSync(uploadDir)) {
      app.use('/uploads', express.static(uploadDir));
    }
    app.get(/^\/(?!api).*/, (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    logger.warn('dist/ 不存在，静态资源未托管（开发期由 vite 提供）');
  }

  // 404 + 统一错误处理
  app.use((_req, res) => {
    res.status(404).json({ error: { code: 'NOT_FOUND', message: '资源不存在' } });
  });
  app.use(errorHandler);

  return app;
}

// 仅作为进程入口时监听（测试通过 supertest 调用 createApp，不在此监听）
if (process.env.NODE_ENV !== 'test') {
  const app = createApp();
  const server = app.listen(config.port, config.host, () => {
    logger.info('server listening', {
      port: config.port,
      authEnabled: config.authEnabled,
      cors: config.corsOrigins,
    });
  });

  const shutdown = (sig: string) => {
    logger.info('shutting down', { sig });
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 5000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
