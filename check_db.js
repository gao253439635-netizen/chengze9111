const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(process.cwd(), 'data', 'app.db');
try {
  const db = new Database(dbPath);
  console.log('=== Tables ===');
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  tables.forEach(t => {
    const count = db.prepare(`SELECT COUNT(*) as c FROM ${t.name}`).get();
    console.log(`${t.name}: ${count.c} rows`);
  });
  console.log('\n=== site_config (first 300 chars) ===');
  const sc = db.prepare('SELECT substr(data,1,500) as d FROM site_config LIMIT 1').get();
  console.log(sc ? sc.d : '(empty)');
  console.log('\n=== leads sample ===');
  const leads = db.prepare('SELECT id, name, contact, status, created_at FROM leads ORDER BY id DESC LIMIT 5').all();
  leads.forEach(l => console.log(JSON.stringify(l)));
  db.close();
} catch(e) {
  console.error('Error:', e.message);
  process.exit(1);
}
