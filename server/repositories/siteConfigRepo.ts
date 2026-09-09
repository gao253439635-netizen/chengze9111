import { db } from '../db';

export function getConfig(): any {
  const row = db.prepare('SELECT data FROM site_config WHERE id = 1').get() as any;
  if (!row) return {};
  try {
    return JSON.parse(row.data);
  } catch {
    return {};
  }
}

function changedKeys(prev: any, next: any): string[] {
  const keys = new Set([...Object.keys(prev || {}), ...Object.keys(next || {})]);
  const out: string[] = [];
  for (const k of keys) {
    if (JSON.stringify(prev?.[k]) !== JSON.stringify(next?.[k])) out.push(k);
  }
  return out;
}

/** 保存站点配置（单行表，幂等 upsert），并写一条审计记录。 */
export function saveConfig(data: any, actor = 'admin'): any {
  const prev = getConfig();
  const now = new Date().toISOString();
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO site_config(id, data, updated_at) VALUES(1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    ).run(JSON.stringify(data), now);
    const diff = changedKeys(prev, data);
    db.prepare('INSERT INTO audit_log(actor, action, detail, created_at) VALUES(?,?,?,?)').run(
      actor,
      'update_site_config',
      diff.length ? `fields: ${diff.join(',')}` : 'no-change',
      now,
    );
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return data;
}
