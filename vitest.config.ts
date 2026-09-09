import { defineConfig } from 'vitest/config';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

// 隔离的临时数据库：迁移逻辑只在真实 data/ 目录触发，测试库不会读取/重命名真实数据。
const dbPath = path.join(os.tmpdir(), 'ai-archmage-test', `app-${process.pid}.db`);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

export default defineConfig({
  test: {
    environment: 'node',
    include: ['server/__tests__/**/*.test.ts'],
    // 顺序执行，避免共享限流计数/DB 的用例相互干扰
    sequence: { concurrent: false },
    env: {
      NODE_ENV: 'test',
      DB_PATH: dbPath,
      AUTH_ENABLED: 'false',
      LEADS_MAX_PER_MIN: '5',
    },
  },
});
