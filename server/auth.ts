import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import type { Request, Response, NextFunction } from 'express';
import { config } from './config';

export const SESSION_COOKIE = 'admin_session';
const SESSION_TTL_MS = 15 * 60 * 1000;
const FIXED_SALT = 'ai-archmage-local-dev-salt-v1';

const HASH_PATH = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'admin_password.hash');

function scryptHash(password: string): string {
  return crypto.scryptSync(password, FIXED_SALT, 64).toString('hex');
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

export function computePasswordHash(password: string): string {
  return scryptHash(password);
}

export function verifyPassword(password: string, stored: string): boolean {
  const calc = scryptHash(password);
  const a = Buffer.from(calc, 'hex');
  const b = Buffer.from(stored, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
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
  if (!config.authEnabled) return next();
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

