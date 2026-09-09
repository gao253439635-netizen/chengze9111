import fs from 'fs';
import { validateImageDataUrl, buildUploadFileName, resolveUploadPath } from '../upload';
import { config } from '../config';
import { AppError } from '../lib/errors';

/** 落盘一个已通过安全校验的图片上传，返回可访问 URL。 */
export function saveUpload(filename: unknown, dataUrl: unknown): { url: string } {
  const v = validateImageDataUrl(dataUrl);
  if (!v.ok || !v.buffer || !v.ext) {
    throw new AppError(400, 'UPLOAD_REJECTED', v.error || '上传校验失败');
  }
  if (!fs.existsSync(config.uploadDir)) fs.mkdirSync(config.uploadDir, { recursive: true });
  const finalName = buildUploadFileName(filename, v.ext);
  const full = resolveUploadPath(config.uploadDir, finalName);
  fs.writeFileSync(full, v.buffer);
  return { url: '/uploads/' + finalName };
}
