import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { config } from './config';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 15 * 60 * 1000; // 15 分钟滑动会话

// ---------- 密码哈希（scrypt，内置、加盐、恒定时间比对，零原生依赖） ----------
function scryptHash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  return `${salt}:${scryptHash(password, salt)}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const calc = scryptHash(password, salt);
  const a = Buffer.from(calc, 'hex');
  const b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ---------- 会话 Cookie（HMAC 签名，防篡改） ----------
function signSession(secret: string): string {
  const payload = { a: 1, exp: Date.now() + SESSION_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function verifySession(token: string | undefined, secret: string): boolean {
  if (!token) return false;
  const [body, sig] = token.split('.');
  if (!body || !sig) return false;
  const expect = crypto.createHmac('sha256', secret).update(body).digest('base64url');
  if (expect !== sig) return false;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString());
    return payload.a === 1 && payload.exp > Date.now();
  } catch {
    return false;
  }
}

function getCookie(req: Request, name: string): string | undefined {
  const h = req.headers.cookie;
  if (!h) return undefined;
  for (const part of h.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k === name) return decodeURIComponent(v);
  }
  return undefined;
}

/** 鉴权中间件：本机免密（AUTH_ENABLED=false）直接放行；否则校验会话 Cookie。 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!config.authEnabled) return next();
  const token =
    getCookie(req, SESSION_COOKIE) ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined);
  if (verifySession(token, config.sessionSecret)) return next();
  return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: '未授权' } });
}

/** 登录：仅当 AUTH_ENABLED 时可用；成功下发签名会话 Cookie。 */
export function loginHandler(req: Request, res: Response) {
  if (!config.authEnabled) {
    return res.status(400).json({ error: { code: 'AUTH_DISABLED', message: '当前未启用鉴权' } });
  }
  const password = (req.body as any)?.password || '';
  const expected = hashPassword(config.adminPassword);
  if (!verifyPassword(password, expected)) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '密码错误' } });
  }
  const token = signSession(config.sessionSecret);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !!config.trustProxy,
    maxAge: SESSION_TTL_MS,
  });
  return res.json({ ok: true });
}
