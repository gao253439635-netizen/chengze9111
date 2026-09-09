import dotenv from 'dotenv';
dotenv.config();

function boolEnv(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return v === 'true' || v === '1';
}

function intEnv(name: string, fallback: number): number {
  const v = parseInt(process.env[name] || '', 10);
  return Number.isFinite(v) ? v : fallback;
}

const DEFAULT_JWT_SECRET = 'dev-insecure-secret-change-me';
const DEFAULT_ADMIN_PASSWORD = 'gaoxiang2026';

// 端口策略（零额外依赖）：
// - 生产 `npm run start`（npm_lifecycle_event==='start'）默认 9111，全托管静态+API；
// - 开发 `npm run server`（dev:all 中的 api）默认 9112，供 vite 代理转发；
// - 可用 PORT 环境变量覆盖。
const event = process.env.npm_lifecycle_event || '';
const defaultPort = event === 'start' ? 9111 : 9112;

export const config = {
  port: intEnv('PORT', defaultPort),
  host: process.env.HOST || '0.0.0.0',
  distDir: 'dist',
  root: process.cwd(),
  uploadDir: 'public/uploads',
  dataDir: 'data',
  dbPath: process.env.DB_PATH || 'data/app.db',
  authEnabled: boolEnv('AUTH_ENABLED', false),
  adminPassword: process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET || DEFAULT_JWT_SECRET,
  sessionSecret: process.env.SESSION_SECRET || DEFAULT_JWT_SECRET,
  notifyWebhookUrl: process.env.NOTIFY_WEBHOOK_URL || '',
  trustProxy: boolEnv('TRUST_PROXY', false),
  leadsMaxPerMin: intEnv('LEADS_MAX_PER_MIN', 10),
  corsOrigins: (process.env.CORS_ORIGINS || '*').split(',').map((s) => s.trim()).filter(Boolean),
  bodyLimit: '12mb',
};

// fail-closed：公网开启鉴权却仍用默认密钥/密码 → 拒绝启动，避免"开着门没锁"。
if (config.authEnabled) {
  const weak =
    config.jwtSecret === DEFAULT_JWT_SECRET ||
    config.sessionSecret === DEFAULT_JWT_SECRET ||
    config.adminPassword === DEFAULT_ADMIN_PASSWORD;
  if (weak) {
    throw new Error(
      '[config] AUTH_ENABLED=true 但仍在用默认密钥/密码，请在 .env 设置 JWT_SECRET / SESSION_SECRET / ADMIN_PASSWORD 后启动。',
    );
  }
}
