# 高祥 · AI设计魔法师 — 服务封面提示词 v8
## 方向：纯网页 UI 框架图（框内骨架，无内容、无显示器外框、浅色底）

> 参考图风格：一张网页/界面的线框框架图本身（轻微倾斜），浅色背景、紫色 header、卡片网格占位。
> 每张封面 = 一个行业的典型网页框架结构，只展示布局骨架，不填内容、不放文字。
> 没有显示器外框、没有桌面、没有人和环境。

---

## 统一风格锚（第 1 张：电商设计，先发这条定调）

```
A clean UI framework / website wireframe mockup shown as a slightly angled flat illustration (no monitor bezel, no device frame, no environment). Light neutral background (#F4F4F7). The page has a purple header bar (#7621B0) with a few simple nav-dot placeholders and a green search/accent button (#1FD66E). Body uses flat minimal wireframe blocks: placeholder image boxes with soft diagonal hatching, thin title-line placeholders, simple rounded rectangles. No real photos, no illustrations, no icons with meaning, no readable text, no letters, no numbers, no logos, no watermarks — only abstract layout blocks and lines. Premium product-design wireframe aesthetic, generous spacing. 16:9 service cover; first of a cohesive six-piece series; keep this exact light wireframe style, purple/green color logic, and slight angle for all follow-ups.
```

---

## 六类目 · 静态提示词（Nano Banana / Midjourney / Flux）

### ① 电商设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is an e-commerce website framework: top nav bar with search box, a wide hero banner placeholder, then a responsive grid of product-card blocks — each card = small image box + two thin title lines + one price-line placeholder, plus a green "cart" button block. Clean flat wireframe, abstract layout only.
```

### ② 平面设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is a graphic-design portfolio website framework: a large hero headline block, a masonry/grid gallery of rectangular project-thumbnail placeholders, a left sidebar with small color-swatch tiles, and a few text-line placeholders. Clean flat wireframe, abstract layout only.
```

### ③ 前端设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is a front-end web application framework: a left sidebar navigation with menu-item blocks, a top toolbar, a main area with a grid of stat-card rectangles, a line-chart placeholder, and a list of row placeholders. Clean flat wireframe, abstract layout only.
```

### ④ 景观设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is a landscape-design studio website framework: a large hero image placeholder (site plan / garden view), a row of two project-card rectangles below, a thin info sidebar with line placeholders, and a green "View Project" button block. Clean flat wireframe, abstract layout only.
```

### ⑤ 建模设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is a 3D-modeling software interface framework: a large central viewport rectangle, a left vertical toolbar strip with small square tool-icon placeholders, a right properties panel with slider and input-box placeholders, a top menu bar. Clean flat wireframe, abstract layout only.
```

### ⑥ 视频设计
```
Same light UI-framework style as the previous image (light background, purple #7621B0 header, green #1FD66E accents, no text, no real content, no device frame). The page now is a video-editing platform framework: a wide video-preview rectangle, a horizontal multi-track timeline strip with clip blocks, a waveform/levels placeholder, and a clip-list sidebar. Clean flat wireframe, abstract layout only.
```

---

## 六类目 · 动态提示词（可灵 / Veo / Runway）

### ① 电商设计（动态）
```
A gentle slow zoom on a flat light e-commerce website wireframe (slight angle, no device frame). Purple header, green button accents, product-card grid placeholders. Subtle motion: the green cart button gently pulses, image boxes softly fade between light grays. Light background, no readable text, no real content, loop-friendly.
```

### ② 平面设计（动态）
```
A slow orbit around a flat light graphic-design portfolio wireframe (slight angle, no device frame). Hero block, masonry thumbnail grid, color-swatch sidebar. Subtle motion: thumbnail placeholders scale up one by one, green accent glows softly. Light background, no readable text, no real content, loop-friendly.
```

### ③ 前端设计（动态）
```
A gentle dolly toward a flat light front-end dashboard wireframe (slight angle, no device frame). Sidebar, stat cards, line-chart placeholder, list rows. Subtle motion: the chart line draws itself, list rows slide in, green active indicator pulses. Light background, no readable text, no real content, loop-friendly.
```

### ④ 景观设计（动态）
```
A slow zoom into a flat light landscape-studio website wireframe (slight angle, no device frame). Hero plan placeholder, project cards, info sidebar. Subtle motion: hero placeholder slowly pans, green button pulses, cards fade in. Light background, no readable text, no real content, loop-friendly.
```

### ⑤ 建模设计（动态）
```
A slow push-in on a flat light 3D-modeling software wireframe (slight angle, no device frame). Central viewport, left toolbar, right properties panel. Subtle motion: a wireframe shape in the viewport slowly rotates, tool icons highlight in sequence, green axis indicator pulses. Light background, no readable text, no real content, loop-friendly.
```

### ⑥ 视频设计（动态）
```
A slow lateral drift past a flat light video-editing platform wireframe (slight angle, no device frame). Preview rectangle, timeline strips, waveform placeholder. Subtle motion: playhead moves across the timeline, clip blocks highlight in sequence, waveform undulates. Light background, no readable text, no real content, loop-friendly.
```

---

## 统一负面提示词（可追加到每条后面）

```
No text, no letters, no numbers, no words, no typography, no readable content, no logos, no watermarks, no real photographs, no realistic illustrations, no icons with specific meaning, no people, no hands, no desk, no monitor bezel, no device frame, no room, no office environment, no dark background, no outdoor scene, no magical effects, no floating 3D shapes.
```

---

## 使用建议

1. 先跑第一条「统一风格锚」，把浅色网页框架风格锁死。
2. 后面 5 张用 `Same light UI-framework style as the previous image` 开头，只换页面类型结构。
3. 如果模型加了文字，把 `no text, no letters, no words, no typography` 重复两遍。
4. 动态版给视频模型时，保留 `loop-friendly` 让动作轻柔循环。
