# AI 设计魔法师 · 6 张服务封面提示词 v6（纯屏幕内容·无环境）

> 风格：封面就是**一张电脑显示屏里展示的内容图**，屏幕以外（桌面、手、房间、环境）一律不要。
> 只保留屏幕画面本身（可带极细显示器边框），屏幕内展示该类目的真实作品 / 软件界面。
> 适用于 Nano Banana / Gemini / Midjourney / Flux / 可灵 / Veo 等。

## 风格要点

- **画面 = 电脑屏幕内容**，填满画幅；无桌面、无手、无房间、无环境。
- **屏幕内一眼看出类目**：产品图库 / 海报 / 网页 UI / 景观渲染 / 3D 模型 / 时间轴。
- **屏幕内容无文字、无 logo、无水印**，但要有该类目典型视觉特征。
- 官网紫 `#7621B0` / 绿 `#1FD66E` 作为屏幕内 UI 高亮点缀。

## 颜色锚点

| 用途 | HEX |
|---|---|
| 屏幕背景 | 软件/界面的深色或浅色工作区 |
| 强调紫（UI 点缀） | `#7621B0` |
| 点缀绿（UI 点缀） | `#1FD66E` |

## 统一风格锚（第 1 张静态，定调用）

```
A 16:9 image that is purely a computer screen display filling the frame edge to edge (a thin modern monitor bezel is allowed; no desk, no hands, no room, no environment). The screen shows real design work for one service category, rendered as a photorealistic software interface or design canvas. Completely free of readable text, logos, or watermarks. Clean, premium "AI Design Magician" portfolio style, with subtle violet (#7621B0) and green (#1FD66E) UI accent highlights. This is the first of a cohesive six-piece series; keep the same screen-only framing and UI aesthetic for all follow-ups, only change the on-screen category content.
```

---

## 静态提示词（Nano Banana / Gemini / Midjourney / Flux 出图）

### 01 电商设计

```
Same pure-screen style as the previous image (screen fills frame, thin bezel, no text, violet/green UI accents). The screen displays an e-commerce product gallery and a Taobao-style product detail-page layout: skincare/cosmetic product hero shots, a grid of image thumbnails, clean product UI cards and price blocks — all as blurred UI, no readable text. Premium software-interface look, 16:9 cover.
```

### 02 平面设计

```
Same pure-screen style as previous (screen fills frame, thin bezel, no text, violet/green accents). The screen displays a graphic design file: bold brand posters, a logo grid, typography specimens, layout spreads, and a color palette panel — blurred design-app UI, no readable text. Clean premium look, 16:9 cover.
```

### 03 前端设计

```
Same pure-screen style as previous (screen fills frame, thin bezel, no text, violet/green accents). The screen displays front-end work: a responsive website UI mockup on one side, a live browser preview on the other, plus a small mobile/tablet mirror showing the same page; a code editor visible but blurred with no readable syntax. Clean premium UI, 16:9 cover.
```

### 04 景观设计

```
Same pure-screen style as previous (screen fills frame, thin bezel, no text, violet/green accents). The screen displays a 3D landscape rendering: a garden with trees, a pavilion, water feature, terrain and planting plan; a small side panel shows a cross-section sketch. Photorealistic render, no readable text, 16:9 cover.
```

### 05 建模设计

```
Same pure-screen style as previous (screen fills frame, thin bezel, no text, violet/green accents). The screen shows a 3D modeling workspace: a wireframe viewport of a product on the left, a polished final render on the right, material/geometry panels — Blender/C4D-style interface, blurred, no readable text. Technical yet clean, 16:9 cover.
```

### 06 视频设计

```
Same pure-screen style as previous (screen fills frame, thin bezel, no text, violet/green accents). The screen displays a video editing software interface: a timeline with color clips, an audio waveform, a preview window, and color-grading panels — blurred UI, no readable text. Cinematic software look, 16:9 cover.
```

---

## 动态提示词（可灵 / Veo / Runway / Pika 出动态封面）

> 若用 Nano Banana 出"动感静态图"，把 motion 描述替换为 "subtle screen UI glow pulse, frozen motion".

### 01 电商设计 · 动态

```
Cinematic screen-only motion. The e-commerce product gallery scrolls gently; thumbnails and a detail-page layout update in place. Subtle violet/green UI accents pulse. No readable text, no desk, no hands, 16:9, loop-friendly.
```

### 02 平面设计 · 动态

```
Cinematic screen-only motion. The graphic design canvas cycles through posters, logos and typography layouts; a color palette panel updates. Soft UI glow. No readable text, no desk, no hands, 16:9, loop-friendly.
```

### 03 前端设计 · 动态

```
Cinematic screen-only motion. A responsive website UI resizes from desktop to tablet to phone inside the frame; a blurred code editor scrolls in the background. No readable text, no desk, no hands, 16:9, loop-friendly.
```

### 04 景观设计 · 动态

```
Cinematic screen-only motion. A 3D landscape rendering plays as the camera glides through a garden, past trees and water; the cross-section panel stays at the side. No readable text, no desk, no hands, 16:9, loop-friendly.
```

### 05 建模设计 · 动态

```
Cinematic screen-only motion. A 3D product rotates in the wireframe viewport while the right panel smoothly transitions from clay render to glossy final. UI panels pulse subtly. No readable text, no desk, no hands, 16:9, loop-friendly.
```

### 06 视频设计 · 动态

```
Cinematic screen-only motion. A video timeline plays with the playhead advancing, the audio waveform animating, and a preview window showing soft footage. Color panels glow. No readable text, no desk, no hands, 16:9, loop-friendly.
```

---

## 负面提示词（必加）

```
no text, no letters, no words, no typography, no logo, no watermark, no readable characters, no desk, no table, no hands, no arms, no person, no face, no room, no environment, no floating holographic screens, no magical energy, no purple-green gradient background, no cartoon, no flat vector illustration, no clipart
```

## 使用建议

1. **先跑风格锚**：第一张确认"满幅屏幕 + 细边框 + 屏幕内作品"基调。
2. **续图统一**：后面 5 张用 `Same pure-screen style as previous...` 开头，保持屏幕满幅与 UI 质感不变，只换屏幕内类目内容。
3. **屏幕内要典型**：每类让屏幕出现一眼可辨的代表元素（时间轴=视频，3D 模型=建模，网页 UI=前端，产品图库=电商，海报/Logo=平面，景观渲染=景观）。
4. **无文字但有内容**：提示里强调 `blurred UI, no readable text`，避免 AI 在屏幕写乱码假字。
