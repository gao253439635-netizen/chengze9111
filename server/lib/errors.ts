import type { Request, Response, NextFunction } from 'express';

/** 业务错误：携带 HTTP 状态码与机器可读 code。 */
export class AppError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** 包装 async 路由，自动把 reject 转给错误中间件。 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/** 统一错误响应：信封 { error: { code, message, requestId } }。 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err?.status || 500;
  const code = err?.code || 'INTERNAL_ERROR';
  const message = status >= 500 ? '服务器内部错误' : err?.message || '请求失败';
  if (status >= 500) console.error('[error]', err);
  res.status(status).json({ error: { code, message, requestId: (req as any).id || null } });
}
