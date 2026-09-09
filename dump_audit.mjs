import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('data/app.db');
const logs = db.prepare('SELECT id, action, detail, created_at FROM audit_log ORDER BY id').all();
logs.forEach(l => {
  const d = (l.detail || '').substring(0, 150);
  console.log(`${l.id} | ${l.created_at} | ${l.action} | ${d}`);
});
db.close();
