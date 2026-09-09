import { db, hashContact } from '../db';

export interface LeadRow {
  id: number;
  name: string | null;
  contact: string | null;
  project: string | null;
  budget: string | null;
  message: string | null;
  source: string;
  category: string | null;
  intent: string | null;
  status: string;
  created_at: string;
  contact_hash: string | null;
}

export interface LeadInput {
  name?: string;
  contact?: string;
  project?: string;
  budget?: string;
  message?: string;
  source?: string;
  category?: string;
  intent?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost' | 'duplicate';
export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'won', 'lost', 'duplicate'];

/** 同一联系方式近 10 分钟内的重复提交标记为 duplicate，不计入新线索。 */
const DEDUP_WINDOW_MS = 10 * 60 * 1000;

export function createLead(input: LeadInput): LeadRow {
  const contact = input.contact ? String(input.contact) : '';
  const hash = contact ? hashContact(contact) : null;
  const now = new Date().toISOString();

  let status: LeadStatus = 'new';
  if (hash) {
    const recent = db
      .prepare(
        `SELECT id FROM leads WHERE contact_hash = ? AND status != 'duplicate'
         AND datetime(created_at) >= datetime(?, '-10 minutes') LIMIT 1`,
      )
      .get(hash, now) as any;
    if (recent) status = 'duplicate';
  }

  const info = db
    .prepare(
      `INSERT INTO leads(name, contact, project, budget, message, source, category, intent, status, created_at, contact_hash)
       VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
    )
    .run(
      input.name ?? null,
      contact || null,
      input.project ?? null,
      input.budget ?? null,
      input.message ?? null,
      input.source || 'contact_form',
      input.category ?? null,
      input.intent ?? null,
      status,
      now,
      hash,
    );
  return getLead(Number(info.lastInsertRowid))!;
}

export function listLeads(opts: { limit?: number; offset?: number; status?: string }) {
  const limit = Math.min(Math.max(opts.limit ?? 50, 1), 200);
  const offset = Math.max(opts.offset ?? 0, 0);
  const params: any[] = [];
  let where = '';
  if (opts.status) {
    where = 'WHERE status = ?';
    params.push(opts.status);
  }
  const rows = db
    .prepare(`SELECT * FROM leads ${where} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`)
    .all(...params, limit, offset) as unknown as LeadRow[];
  const totalRow = db.prepare(`SELECT COUNT(*) AS c FROM leads ${where}`).get(...params) as any;
  return { rows, total: totalRow.c };
}

export function getLead(id: number): LeadRow | null {
  return (db.prepare('SELECT * FROM leads WHERE id = ?').get(id) as unknown as LeadRow) || null;
}

export function updateStatus(id: number, status: string): LeadRow | null {
  if (!LEAD_STATUSES.includes(status as LeadStatus)) return null;
  db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
  return getLead(id);
}

/**
 * 渠道归因统计：按来源(source)与意向类目(category)聚合，供后台看板与运营决策。
 * source 取值示例：contact_form / lead_magnet / homepage / portfolio / ref_xxx
 */
export function getLeadStats() {
  const bySource = db
    .prepare(
      `SELECT COALESCE(NULLIF(source, ''), '未标记') AS key, COUNT(*) AS count
       FROM leads GROUP BY source ORDER BY count DESC`,
    )
    .all() as any[];
  const byCategory = db
    .prepare(
      `SELECT COALESCE(NULLIF(category, ''), '未分类') AS key, COUNT(*) AS count
       FROM leads GROUP BY category ORDER BY count DESC`,
    )
    .all() as any[];
  const totals = db
    .prepare(
      `SELECT COUNT(*) AS total,
              SUM(CASE WHEN status = 'won' THEN 1 ELSE 0 END) AS won,
              SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS fresh
       FROM leads`,
    )
    .get() as any;
  return {
    total: totals.total,
    won: totals.won,
    fresh: totals.fresh,
    bySource,
    byCategory,
  };
}
