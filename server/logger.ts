type Level = 'info' | 'warn' | 'error' | 'debug';

function emit(level: Level, msg: string, meta: Record<string, unknown> = {}) {
  const entry = { level, msg, time: new Date().toISOString(), ...meta };
  if (level === 'error') console.error(JSON.stringify(entry));
  else console.log(JSON.stringify(entry));
}

// 结构化 JSON 日志（Phase 2 可替换为 pino，输出格式保持一致）
export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => emit('info', msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => emit('warn', msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => emit('error', msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => emit('debug', msg, meta),
};
