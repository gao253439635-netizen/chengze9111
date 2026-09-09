import re, sys

def extract_wal_info(path, label):
    with open(path, 'rb') as f:
        data = f.read()
    text = data.decode('utf-8', errors='replace')
    print(f'\n=== {label} (WAL size: {len(data)} bytes) ===')

    # serviceCats
    sc_match = re.search(r'"serviceCats":\[([\s\S]{0,4000})\]', text)
    if sc_match:
        sc_str = sc_match.group(1)
        cats = re.findall(r'"name":\{"zh":"([^"]+)"', sc_str)
        imgs = re.findall(r'"image":"([^"]+)"', sc_str)
        descs = re.findall(r'"desc":\{"zh":"([^"]*)"', sc_str)
        links = re.findall(r'"link":"([^"]+)"', sc_str)
        print(f'serviceCats: {len(cats)} 个')
        for i in range(max(len(cats), len(imgs))):
            c = cats[i] if i < len(cats) else '?'
            img = imgs[i].split('/')[-1][:35] if i < len(imgs) else '无图'
            d = descs[i] if i < len(descs) else '(空)'
            l = links[i] if i < len(links) else ''
            print(f'  {i+1}. {c} | {img} | desc="{d}" | link="{l}"')

    # worksGallery
    wg_match = re.search(r'"worksGallery":\[([^\]]+)\]', text)
    if wg_match:
        wg_str = wg_match.group(1)
        urls = re.findall(r'https?://[^\"]+', wg_str)
        uploads = re.findall(r'/uploads/[^"]+', wg_str)
        print(f'\nworksGallery: {len(urls)} 外部 + {len(uploads)} uploads = {len(urls)+len(uploads)} total')
        all_urls = urls + uploads
        for u in all_urls[:15]:
            print(f'  {u[:90]}')
        if len(all_urls) > 15:
            print(f'  ... 还有 {len(all_urls)-15} 张')

extract_wal_info(r'F:\高祥BOSS优化_（简历）\ai-archmage\data\app.db-wal', '当前 DB WAL')
extract_wal_info(r'F:\高祥BOSS优化_（简历）\ai-archmage\data\backup_20260909_094933\app.db-wal', '备份 DB WAL')
