import re, sys, json
sys.stdout.reconfigure(encoding='utf-8')

# 读取当前 DB WAL（包含所有历史事务帧）
with open(r'F:\高祥BOSS优化_（简历）\ai-archmage\data\app.db-wal', 'rb') as f:
    data = f.read()
text = data.decode('utf-8', errors='replace')
print(f'WAL size: {len(data)} bytes, 找到 {text.count("serviceCats")} 个 serviceCats 片段\n')

# 按出现顺序提取每个完整的 serviceCats JSON 块
# 每个块代表一个历史状态
states = []
for m in re.finditer(r'"serviceCats":\[([\s\S]{0,6000})\]', text):
    s = m.group(1)
    # 尝试提取完整 JSON 对象
    cats = re.findall(r'\{"name":\{"zh":"([^"]+)","en":"([^"]*)"\},"image":"([^"]+)","link":"([^"]*)","desc":\{"zh":"([^"]*)"[^}]*\},"imageRatio":"([^"]+)"\}', s)
    if len(cats) >= 5:
        states.append({
            'pos': m.start(),
            'count': len(cats),
            'cats': cats,
            'raw': s[:300]
        })

print(f'找到 {len(states)} 个有效状态（>=5 类目）\n')
for i, st in enumerate(states):
    print(f'=== 状态 #{i+1} ({st["count"]} 类目, 位置 {st["pos"]}) ===')
    for j, cat in enumerate(st['cats']):
        zh, en, img, link, desc, ratio = cat
        img_name = img.split('/')[-1][:35] if img else '(无)'
        print(f'  {j+1}. {zh} | {img_name} | link={link} | desc="{desc}"')
    print()

# 找 worksGallery 状态
print('\n=== worksGallery 状态 ===')
for m in re.finditer(r'"worksGallery":\[([^\]]+)\]', text):
    w = m.group(1)
    urls = re.findall(r'https?://[^\"]+', w)
    ups = re.findall(r'/uploads/[^"]+', w)
    total = urls + ups
    print(f'位置 {m.start()}: {len(urls)} 外部 + {len(ups)} uploads = {len(total)} 张')
    if ups:
        for u in ups[:8]:
            print(f'  {u}')
