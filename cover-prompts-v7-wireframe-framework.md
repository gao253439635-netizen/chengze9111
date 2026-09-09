# 高祥 · AI设计魔法师 — 服务封面提示词 v7
## 方向：纯屏幕内网页/UI 框架骨架（无内容、无文字）

> 参考图风格：倾斜屏幕视角 + 紫色 header + 卡片/按钮占位 + 简洁线框感。
> 每张封面只展示屏幕内的界面框架，不显示桌面、人手、房间环境。

---

## 统一风格锚（第 1 张：电商设计，先发这条定调）

```
A clean close-up of a modern computer monitor displaying a website wireframe/mockup skeleton. The screen is shown at a slight isometric angle against a very dark charcoal background (#0C0C0C). The UI uses a flat, minimal wireframe style: clean rectangular blocks, placeholder image boxes with soft diagonal hatching, simple rounded buttons, and generous white/gray negative space. Header bar in accent purple (#7621B0). Primary buttons and active elements in accent green (#1FD66E). No photographs, no illustrations, no icons with meaning, no readable text, no letters, no numbers, no logos, no watermarks, no real content — only abstract layout blocks and lines. Soft screen glow, subtle reflection, premium tech aesthetic. 16:9 horizontal service cover, this is the first image of a cohesive six-piece brand series; keep this exact wireframe style, color logic, and isometric monitor angle for all follow-ups.
```

---

## 六类目 · 静态提示词（Nano Banana / Midjourney / Flux）

### ① 电商设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E buttons, no text, no real content). The screen now shows an e-commerce website skeleton: a top navigation bar, a wide hero banner placeholder, a grid of product-card rectangles (each with a small image box + title line + price line placeholders), and a prominent green "Add to Cart" button block. Clean flat wireframe, generous spacing, abstract layout only.
```

### ② 平面设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E accents, no text, no real content). The screen now shows a graphic-design portfolio skeleton: a bold hero block, a masonry/grid gallery of rectangular project thumbnails, a sidebar with color-swatch placeholders, and a few text-line placeholders. Clean flat wireframe, abstract layout only.
```

### ③ 前端设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E accents, no text, no real content). The screen now shows a front-end web-app skeleton: a responsive layout with a sidebar navigation, a top toolbar, a dashboard grid of stat cards, a line-chart placeholder, and a content area with list rows. Clean flat wireframe, abstract layout only.
```

### ④ 景观设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E accents, no text, no real content). The screen now shows a landscape/spatial design project skeleton: a large hero image placeholder for a site plan, two smaller project-card rectangles below, a thin project-info sidebar, and a green "View Project" button block. Clean flat wireframe, abstract layout only.
```

### ⑤ 建模设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E accents, no text, no real content). The screen now shows a 3D-modeling software interface skeleton: a large central viewport rectangle, a left toolbar strip with small square tool icons (abstract, no meaning), a right properties panel with sliders and input boxes, and a top menu bar. Clean flat wireframe, abstract layout only.
```

### ⑥ 视频设计
```
Same wireframe framework style as the previous image (isometric monitor, dark background, purple #7621B0 header, green #1FD66E accents, no text, no real content). The screen now shows a video-editing platform skeleton: a wide video-preview rectangle, a horizontal timeline strip with clip blocks, a waveform/levels placeholder, and a track-list sidebar. Clean flat wireframe, abstract layout only.
```

---

## 六类目 · 动态提示词（可灵 / Veo / Runway）

### ① 电商设计（动态）
```
A slow, smooth camera push-in on a computer monitor at a slight isometric angle. The screen displays a minimal e-commerce website wireframe skeleton: purple header, green button accents, product-card grid placeholders. Subtle animation: the green button gently pulses, placeholder image boxes softly fade between light and dark gray. Dark background, no readable text, no real content, no environment, loop-friendly gentle motion.
```

### ② 平面设计（动态）
```
A slow orbit around a computer monitor at a slight isometric angle. The screen displays a graphic-design portfolio wireframe skeleton: hero block, masonry thumbnail grid, color-swatch sidebar. Subtle animation: thumbnail placeholders scale up one by one in sequence, the green accent element glows softly. Dark background, no readable text, no real content, no environment, loop-friendly.
```

### ③ 前端设计（动态）
```
A gentle dolly shot toward a computer monitor at a slight isometric angle. The screen displays a front-end dashboard wireframe skeleton: sidebar, stat cards, line-chart placeholder, list rows. Subtle animation: chart line draws itself, list rows slide in gently, green active indicator pulses. Dark background, no readable text, no real content, no environment, loop-friendly.
```

### ④ 景观设计（动态）
```
A slow zoom into a computer monitor at a slight isometric angle. The screen displays a landscape-design project wireframe skeleton: large hero plan placeholder, project cards, info sidebar. Subtle animation: the hero placeholder slowly pans, a green button pulses, cards fade in. Dark background, no readable text, no real content, no environment, loop-friendly.
```

### ⑤ 建模设计（动态）
```
A slow push-in on a computer monitor at a slight isometric angle. The screen displays a 3D-modeling software wireframe skeleton: central viewport, left toolbar, right properties panel. Subtle animation: a wireframe cube in the viewport slowly rotates, tool icons highlight in sequence, green axis indicator pulses. Dark background, no readable text, no real content, no environment, loop-friendly.
```

### ⑥ 视频设计（动态）
```
A slow lateral drift past a computer monitor at a slight isometric angle. The screen displays a video-editing platform wireframe skeleton: preview rectangle, timeline strips, waveform placeholder. Subtle animation: playhead moves across the timeline, clip blocks highlight in sequence, waveform undulates gently. Dark background, no readable text, no real content, no environment, loop-friendly.
```

---

## 统一负面提示词（可追加到每条后面）

```
No text, no letters, no numbers, no words, no typography, no readable content, no logos, no watermarks, no real photographs, no realistic illustrations, no icons with specific meaning, no people, no hands, no desk, no room, no office environment, no outdoor scene, no abstract 3D shapes floating outside the screen, no glassmorphism magic effects.
```

---

## 使用建议

1. 先跑第一条「统一风格锚」，让 Nano Banana / Gemini 把框架风格锁死。
2. 后面 5 张都用 `Same wireframe framework style as the previous image` 开头，只换屏幕里的页面结构。
3. 如果模型还是加了文字，把 `no text, no letters, no words, no typography` 加粗重复两遍。
4. 动态版给视频模型时，把 `loop-friendly gentle motion` 放最后，避免动作过大。
