import path from 'path';

/**
 * 图片上传安全校验（server 与 vite 中间件共用）。
 *
 * 目标：防止存储型 XSS / 恶意文件托管。
 *  - 仅接受 data:image/<mime>;base64,<...> 格式，且 mime 在白名单内；
 *  - 解码后校验文件头 magic bytes，内容必须与声明的类型一致（防伪装）；
 *  - 畸形 data URL（无逗号 / 空 base64）直接拒绝，不再写出 0 字节文件。
 */

interface ImageKind {
  ext: string;
  /** 校验二进制文件头 */
  sig: (b: Buffer) => boolean;
}

const ALLOWED: Record<string, ImageKind> = {
  'image/png': {
    ext: 'png',
    sig: (b) => b.length >= 4 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47,
  },
  'image/jpeg': {
    ext: 'jpg',
    sig: (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  'image/webp': {
    ext: 'webp',
    sig: (b) =>
      b.length >= 12 &&
      b.toString('ascii', 0, 4) === 'RIFF' &&
      b.toString('ascii', 8, 12) === 'WEBP',
  },
  'image/gif': {
    ext: 'gif',
    sig: (b) => b.length >= 6 && b.toString('ascii', 0, 6).startsWith('GIF8'),
  },
};

export interface UploadValidation {
  ok: boolean;
  buffer?: Buffer;
  ext?: string;
  error?: string;
}

export function validateImageDataUrl(dataUrl: unknown): UploadValidation {
  if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
    return { ok: false, error: '缺少文件数据' };
  }
  const m = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/s.exec(dataUrl);
  if (!m) {
    return { ok: false, error: '数据格式非法（需 data:image/...;base64,）' };
  }
  const mime = m[1];
  const def = ALLOWED[mime];
  if (!def) {
    return { ok: false, error: `不支持的图片类型：${mime}` };
  }
  const base64 = m[2];
  if (!base64) {
    return { ok: false, error: '文件内容为空' };
  }
  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, 'base64');
  } catch {
    return { ok: false, error: '编码解码失败' };
  }
  if (!buffer.length) {
    return { ok: false, error: '文件内容为空' };
  }
  if (!def.sig(buffer)) {
    return { ok: false, error: '文件内容与声明的类型不符（疑似伪造）' };
  }
  return { ok: true, buffer, ext: def.ext };
}

/**
 * 由客户端文件名派生安全的基础名（去掉扩展名 + 危险字符），
 * 最终落盘文件名 = base + 校验得到的真实扩展名。
 * 注意：base 仅作为「可读前缀」，真实唯一性由 buildUploadFileName 的时间戳+随机串保证，
 * 避免不同类目上传同名图片（如 image.png / 未命名.png）互相覆盖。
 */
export function safeBaseName(filename: unknown): string {
  const raw = String(filename || '')
    .replace(/\.[^.]+$/, '') // 去掉客户端扩展名（以内容为准）
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 40);
  return raw;
}

/** 拼出最终落盘文件名（含内容校验得到的扩展名）。 */
export function buildUploadFileName(filename: unknown, ext: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  const base = safeBaseName(filename) || 'img';
  return `${base}_${ts}${rand}.${ext}`;
}

/** 规范化上传目录，避免 ../ 穿越。 */
export function resolveUploadPath(uploadDir: string, fileName: string): string {
  const base = path.resolve(uploadDir);
  const full = path.resolve(base, fileName);
  if (!full.startsWith(base + path.sep) && full !== base) {
    throw new Error('非法路径');
  }
  return full;
}
