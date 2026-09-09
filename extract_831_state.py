import re, json, sys, shutil
sys.stdout.reconfigure(encoding='utf-8')

# 读取 WAL
with open(r'F:\高祥BOSS优化_（简历）\ai-archmage\data\app.db-wal', 'rb') as f:
    data = f.read()
text = data.decode('utf-8', errors='replace')

# 提取状态 #5 的完整 serviceCats JSON（位置 55376 附近）
# 找到这个片段的完整 JSON 对象
sc_match = re.search(r'"serviceCats":\[([\s\S]{0,4000})\]', text[50000:70000])
if not sc_match:
    print('未找到状态 #5 的 serviceCats')
    sys.exit(1)

sc_fragment = sc_match.group(1)
# 提取每个类目
cats_raw = re.findall(r'\{"name":\{"zh":"([^"]+)","en":"([^"]*)"\},"image":"([^"]+)","link":"([^"]*)","desc":\{"zh":"([^"]*)"[^}]*\},"imageRatio":"([^"]+)"\}', sc_fragment)

cats = []
for cat in cats_raw:
    zh, en, img, link, desc, ratio = cat
    cats.append({
        "name": {"zh": zh, "en": en},
        "image": img,
        "link": link,
        "desc": {"zh": desc, "en": ""},
        "imageRatio": ratio
    })

print(f'提取到 {len(cats)} 个 serviceCats:')
for i, c in enumerate(cats):
    print(f'  {i+1}. {c["name"]["zh"]} | {c["image"].split("/")[-1][:30]} | desc="{c["desc"]["zh"]}"')

# 提取 worksGallery（位置 52329 附近，16 张上传作品）
wg_match = re.search(r'"worksGallery":\[([^\]]+)\]', text[45000:60000])
if wg_match:
    wg_str = wg_match.group(1)
    uploads = re.findall(r'/uploads/[^"]+', wg_str)
    print(f'\n提取到 {len(uploads)} 张 worksGallery:')
    for u in uploads:
        print(f'  {u}')

# 也提取其他字段（brand, hero, nav, sections 等）
# 从同一个片段附近提取
context_start = max(0, 50000 - 5000)
context_end = min(len(text), 70000 + 5000)
context = text[context_start:context_end]

# 提取 brand
brand_match = re.search(r'"brand":\{[^}]+"nameZh":"([^"]+)"[^}]+"titleZh":"([^"]+)"', context)
if brand_match:
    print(f'\nbrand: {brand_match.group(1)} / {brand_match.group(2)}')

# 提取 hero.heading
heading_match = re.search(r'"heading":\{"zh":"([^"]+)"', context)
if heading_match:
    print(f'hero.heading.zh: {heading_match.group(1)}')

# 提取 nav
nav_match = re.search(r'"nav":\{[^}]+"works":\{"label":\{"zh":"([^"]+)"', context)
if nav_match:
    print(f'nav.works.label.zh: {nav_match.group(1)}')

# 提取 footer
footer_match = re.search(r'"footer":\{[^}]+"companyName":"([^"]*)"', context)
if footer_match:
    print(f'footer.companyName: "{footer_match.group(1)}"')
