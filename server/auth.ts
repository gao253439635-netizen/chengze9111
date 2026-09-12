import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { config } from './config';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 15 * 60 * 1000;
const FIXED_SALT = 'ai-archmage-local-dev-salt-v1'; // 仅用于兼容升级前的旧哈希

const HASH_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'admin_password.hash');
const SALT_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'admin_password.salt');

function scryptHash(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

export function getStoredHash(): string | null {
  try {
    if (fs.existsSync(HASH_PATH)) {
      return fs.readFileSync(HASH_PATH, 'utf8').trim();
    }
  } catch { /* ignore */ }
  return null;
}

export function saveHash(hash: string): void {
  try {
    const dir = path.dirname(HASH_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(HASH_PATH, hash);
  } catch { /* ignore */ }
}

function getStoredSalt(): string | null {
  try {
    if (fs.existsSync(SALT_PATH)) {
      return fs.readFileSync(SALT_PATH, 'utf8').trim();
    }
  } catch { /* ignore */ }
  return null;
}

function saveSalt(salt: string): void {
  try {
    const dir = path.dirname(SALT_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SALT_PATH, salt);
  } catch { /* ignore */ }
}

// 每实例随机盐：首次运行时生成并持久化，避免全局固定盐被针对性预计算爆破。
// 与旧哈希保持兼容（verifyPassword 会回退到 FIXED_SALT，不会锁死已有密码）。
function ensureSalt(): string {
  let s = getStoredSalt();
  if (!s) {
    s = crypto.randomBytes(16).toString('hex');
    saveSalt(s);
  }
  return s;
}

export function computePasswordHash(password: string): string {
  return scryptHash(password, ensureSalt());
}

export function verifyPassword(password: string, stored: string): boolean {
  const match = (calc: string): boolean => {
    const a = Buffer.from(calc, 'hex');
    const b = Buffer.from(stored, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  };
  if (match(scryptHash(password, ensureSalt()))) return true;
  return match(scryptHash(password, FIXED_SALT)); // 兼容升级前用固定盐生成的哈希
}

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

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!config.authEnabled) {
    // 免密模式仅允许本机回环地址访问写接口；非本机请求一律拒绝，
    // 防止 AUTH_ENABLED 未开启时整站配置 / 上传 / 线索在公网裸奔。
    const raw = (req.socket?.remoteAddress || '') as string;
    const ip = raw.replace(/^::ffff:/, '');
    if (ip === '127.0.0.1' || ip === '::1') return next();
    return res.status(403).json({ error: { code: 'AUTH_REQUIRED', message: '公网访问需开启 AUTH_ENABLED' } });
  }
  const token =
    getCookie(req, SESSION_COOKIE) ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined);
  if (verifySession(token, config.sessionSecret)) return next();
  return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
}

export function loginHandler(req: Request, res: Response) {
  if (!config.authEnabled) {
    const token = signSession(config.sessionSecret);
    res.cookie(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: !!config.trustProxy,
      maxAge: SESSION_TTL_MS,
    });
    return res.json({ ok: true });
  }

  const password = (req.body as any)?.password || '';
  let storedHash = getStoredHash();
  if (!storedHash) {
    storedHash = computePasswordHash(config.adminPassword);
    saveHash(storedHash);
  }
  if (!verifyPassword(password, storedHash)) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect password' } });
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

/**
 * 公开认证状态探测：不强制登录，只告诉前端「是否需要密码 + 当前是否已登录」。
 * 前台页面（游客）也能正常读取，后台据此决定是否显示登录表单。
 */
export function authStatusHandler(req: Request, res: Response) {
  if (!config.authEnabled) {
    return res.json({ authEnabled: false, loggedIn: true });
  }
  const token =
    getCookie(req, SESSION_COOKIE) ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : undefined);
  return res.json({ authEnabled: true, loggedIn: verifySession(token, config.sessionSecret) });
}

/**
 * 修改后台登录密码：需已登录（requireAuth 守卫）。
 * 校验当前密码 → 写入新 scrypt 哈希到 data/admin_password.hash（覆盖原值，持久化）。
 */
export function changePasswordHandler(req: Request, res: Response) {
  if (!config.authEnabled) {
    return res.status(400).json({ error: { code: 'AUTH_DISABLED', message: '当前未启用密码认证，无需修改' } });
  }
  const body = (req.body || {}) as any;
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: { code: 'WEAK_PASSWORD', message: '新密码至少 6 位' } });
  }
  const storedHash = getStoredHash() || computePasswordHash(config.adminPassword);
  if (!verifyPassword(currentPassword, storedHash)) {
    return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: '当前密码错误' } });
  }
  saveHash(computePasswordHash(newPassword));
  return res.json({ ok: true });
}

