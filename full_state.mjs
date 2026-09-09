import { DatabaseSync } from 'node:sqlite';
const db = new DatabaseSync('data/app.db');
const row = db.prepare('SELECT data FROM site_config WHERE id=1').get();
const c = JSON.parse(row.data);

console.log('=== 完整配置状态 ===\n');

// Nav
console.log('【导航 nav】');
console.log('navOrder:', JSON.stringify(c.navOrder));
for (const key of (c.navOrder || [])) {
  const item = c.nav[key];
  console.log(`  ${key}: label.zh="${item?.label?.zh}" label.en="${item?.label?.en}" link="${item?.link}"`);
}

// Sections
console.log('\n【区块标题 sections】');
for (const [k, v] of Object.entries(c.sections || {})) {
  console.log(`  ${k}: zh="${v.zh}" en="${v.en}"`);
}

// Hero
console.log('\n【首屏 hero】');
console.log(`  subtitle.zh: "${c.hero?.subtitle?.zh}"`);
console.log(`  ctaText.zh: "${c.hero?.ctaText?.zh}"`);
console.log(`  poster: "${c.hero?.poster}"`);
console.log(`  video: "${c.hero?.video}"`);
console.log(`  videoScrub.mode: "${c.hero?.videoScrub?.mode}"`);

// ServiceCats
console.log('\n【服务类目 serviceCats】');
(c.serviceCats || []).forEach((s, i) => {
  console.log(`  ${i+1}. ${s.name.zh} [en: ${s.name.en}] img=${s.image ? '有' : '无'} desc="${s.desc?.zh?.substring(0,30)}..."`);
});

// Contact
console.log('\n【联系方式 contact】');
console.log(`  wechat: "${c.contact?.wechat}"`);
console.log(`  email: "${c.contact?.email}"`);
console.log(`  phone: "${c.contact?.phone}"`);

// Footer
console.log('\n【页脚 footer】');
console.log(`  desc.zh: "${c.footer?.desc?.zh}"`);
console.log(`  contacts: ${(c.footer?.contacts || []).length}个`);
(c.footer?.contacts || []).forEach((fc, i) => {
  console.log(`    ${i+1}. type=${fc.type} value=${fc.value} qr=${fc.qrImage || '无'}`);
});
console.log(`  sitemap: ${(c.footer?.sitemap || []).length}个`);

// Resume
console.log('\n【简历 resume】');
console.log(`  共${(c.resume || []).length}条`);
(c.resume || []).slice(0, 3).forEach((r, i) => {
  console.log(`  ${i+1}. [${r.num}] ${r.period} | ${r.company.zh} | ${r.title.zh}`);
});

// WorksGallery
console.log('\n【作品图 worksGallery】');
console.log(`  共${(c.worksGallery || []).length}张`);
if ((c.worksGallery || []).length > 0) {
  console.log(`  第1张: ${(c.worksGallery[0] || '').substring(0, 60)}...`);
}

// Theme
console.log('\n【主题 theme】');
console.log(`  ink=${c.theme?.ink} accent=${c.theme?.accent} dot=${c.theme?.dot}`);

// About
console.log('\n【关于我 about】');
console.log(`  bio.zh: "${(c.aboutBio?.zh || '').substring(0, 50)}..."`);
console.log(`  meta.zh: "${c.aboutMeta?.zh}"`);

// SectionTitleFont
console.log('\n【区块标题字体】');
console.log(`  family=${c.sectionTitleFont?.family} weight=${c.sectionTitleFont?.weight} scale=${c.sectionTitleFont?.scale} letterSpacing=${c.sectionTitleFont?.letterSpacing}`);

// AdminNav
console.log('\n【后台导航 adminNav】');
console.log(`  order: ${(c.adminNavOrder || []).join(' -> ')}`);
(c.adminNav?.groups || []).forEach(g => {
  console.log(`  group[${g.id}]: ${g.label?.zh} (${g.items?.length} items)`);
});

db.close();
