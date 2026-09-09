import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { DatabaseSync } from 'node:sqlite';
import dotenv from 'dotenv';

// 确保 .env 在读取 DB_PATH 之前已加载（与 config.ts 幂等，无所谓谁先执行）
dotenv.config();

const DB_PATH = process.env.DB_PATH || path.resolve(process.cwd(), 'data', 'app.db');
const dbDir = path.dirname(DB_PATH);

if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

export const db = new DatabaseSync(DB_PATH);

// WAL 提升并发读写能力；:memory:/临时库忽略失败
try {
  db.exec('PRAGMA journal_mode = WAL;');
} catch {
  /* ignore */
}
db.exec('PRAGMA foreign_keys = ON;');

db.exec(`
  CREATE TABLE IF NOT EXISTS site_config (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    contact TEXT,
    project TEXT,
    budget TEXT,
    message TEXT,
    source TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL,
    contact_hash TEXT
  );
  CREATE TABLE IF NOT EXISTS audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    detail TEXT,
    created_at TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_leads_contact_hash ON leads(contact_hash);
  CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
  CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
`);

/** 联系方式的归一化哈希（小写、去空格），用于去重。 */
export function hashContact(contact: string): string {
  return crypto.createHash('sha256').update(contact.trim().toLowerCase()).digest('hex');
}

/**
 * 一次性迁移：仅当库位于真实 data/ 目录且表为空时，从旧 JSON 文件导入。
 * - 测试用的临时库（temp dir）不会触发，避免污染/重命名真实数据。
 */
function migrateFromJson() {
  const isRealDataDir = path.resolve(dbDir) === path.resolve(process.cwd(), 'data');
  if (!isRealDataDir) return;

  const root = process.cwd();

  // site_config 种子
  const cfgPath = path.resolve(root, 'siteConfig.json');
  const cfgRow = db.prepare('SELECT id FROM site_config WHERE id = 1').get();
  if (!cfgRow && fs.existsSync(cfgPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
      db.prepare('INSERT INTO site_config(id, data, updated_at) VALUES(1, ?, ?)').run(
        JSON.stringify(data),
        new Date().toISOString(),
      );
      console.log('[db] 已从 siteConfig.json 种子导入 site_config');
    } catch (e) {
      console.warn('[db] siteConfig.json 导入失败（已跳过）:', (e as Error).message);
    }
  }

  // leads 迁移
  const leadsPath = path.resolve(root, 'data', 'leads.json');
  const leadsCount = (db.prepare('SELECT COUNT(*) AS c FROM leads').get() as any).c;
  if (leadsCount === 0 && fs.existsSync(leadsPath)) {
    try {
      const arr = JSON.parse(fs.readFileSync(leadsPath, 'utf-8'));
      if (Array.isArray(arr) && arr.length) {
        const insert = db.prepare(
          `INSERT INTO leads(name, contact, project, budget, message, source, status, created_at, contact_hash)
           VALUES(?,?,?,?,?,?,?,?,?)`,
        );
        db.exec('BEGIN');
        try {
          for (const l of arr) {
            const contact = l.contact ? String(l.contact) : '';
            insert.run(
              l.name ?? null,
              contact || null,
              l.project ?? null,
              l.budget ?? null,
              l.message ?? null,
              l.source || 'contact_form',
              l.status || 'new',
              l.created_at || new Date().toISOString(),
              contact ? hashContact(contact) : null,
            );
          }
          db.exec('COMMIT');
        } catch (err) {
          db.exec('ROLLBACK');
          throw err;
        }
        fs.renameSync(leadsPath, leadsPath + '.bak');
        console.log(`[db] 已从 data/leads.json 导入 ${arr.length} 条线索（原文件备份为 .bak）`);
      }
    } catch (e) {
      console.warn('[db] leads.json 导入失败（已跳过）:', (e as Error).message);
    }
  }
}

// 字段迁移：为存量库补足 category / intent 列（新库 CREATE 已含，这里幂等补齐）
function ensureLeadColumns() {
  try {
    const cols = (db.prepare('PRAGMA table_info(leads)').all() as any[]).map((c) => c.name);
    if (!cols.includes('category')) db.exec('ALTER TABLE leads ADD COLUMN category TEXT');
    if (!cols.includes('intent')) db.exec('ALTER TABLE leads ADD COLUMN intent TEXT');
  } catch (e) {
    console.warn('[db] leads 列迁移跳过:', (e as Error).message);
  }
}

ensureLeadColumns();
migrateFromJson();
