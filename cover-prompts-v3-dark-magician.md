# AI 设计魔法师 · 6 张服务封面提示词 v4（无人物 / 无外景版）

> 风格：官网 Hero 深色电影感 — 纯深色背景 + 悬浮全息作品窗口 + 紫/绿魔法光流。
> 只展示**屏幕窗口内的作品内容**，不出现真人、办公场所或外景环境。
> 适用于 Nano Banana (Gemini 图像) / Midjourney / Flux / Stable Diffusion / 可灵 / Veo 等。

## 官网颜色锚点

| 用途 | HEX |
|---|---|
| 背景/暗部 | `#0C0C0C` |
| 强调紫（魔法主色） | `#7621B0` |
| 点缀绿 | `#1FD66E` |
| 辅助魔法色 | 琥珀金 `#F59E0B` / 洋红 `#D946EF` |

## 统一风格锚（第 1 张静态，定调用）

```
Cinematic 16:9 service cover on a pure dark background (#0C0C0C). Three to five floating semi-transparent glass holographic screens arranged in a dynamic, asymmetric composition, each screen displaying real design work samples for one service category. Soft ribbons of magical light in violet (#7621B0) and electric green (#1FD66E) weave between and around the screens, with gentle glow, drifting particles and faint volumetric haze. Premium, futuristic "AI Design Magician" mood. No people, no office, no outdoor scene, no real-world location, no hands, no face. Photorealistic rendering of the screens and light, shallow depth of field, no readable text or logos on the screens, 8K quality. This is the first of a cohesive six-piece series; keep the same dark background, same light-color logic and floating-screen composition for all follow-ups.
```

---

## 静态提示词（Nano Banana / Gemini / Midjourney / Flux 出图）

### 01 电商设计

```
Same floating-screen "AI Design Magician" style as the previous image (dark #0C0C0C background, violet #7621B0 + green #1FD66E light ribbons, no people or location). Three to five floating glass screens show real e-commerce design work: skincare product hero shots, Taobao-style detail-page layouts, cosmetic packaging on white seamless, product photo sets. Light ribbons weave between the screens, soft glow and drifting particles. Premium cinematic, no readable text or logos, 16:9 service cover.
```

### 02 平面设计

```
Same style as previous (dark background, violet/green light ribbons, no people or location). The floating glass screens show real graphic design work: bold brand posters, logo grids, typography specimens, VI manual spreads, color swatches. Violet-green light ribbons connect the screens. Cinematic, no readable text, 16:9 cover.
```

### 03 前端设计

```
Same style as previous (dark background, violet/green light ribbons, no people or location). The floating glass screens show real front-end work: responsive website UI mockups, browser windows with clean component layouts, mobile and tablet previews, a code editor with blurred syntax. Light ribbons flow between the screens. Cinematic, no readable text, 16:9 cover.
```

### 04 景观设计

```
Same style as previous (dark background, violet/green light ribbons, no people or location). The floating glass screens show real landscape design work: 3D garden renderings, outdoor pavilion visualizations, terrain cross-sections, water features and planting plans. Fresh green and violet light ribbons. Cinematic, no readable text, 16:9 cover.
```

### 05 建模设计

```
Same style as previous (dark background, violet/green light ribbons, no people or location). The floating glass screens show real 3D modeling work: Blender/C4D wireframe viewport of a product, polished final render of a gadget, material nodes editor, a rotating abstract 3D form. Cyan-violet light ribbons. Cinematic, no readable text, 16:9 cover.
```

### 06 视频设计

```
Same style as previous (dark background, violet/green light ribbons, no people or location). The floating glass screens show real video design work: video-editing timeline with color clips, waveform audio, cinematic landscape footage thumbnails, a film strip. Warm violet-amber light ribbons. Cinematic, no readable text, 16:9 cover.
```

---

## 动态提示词（可灵 / Veo / Runway / Pika 出动态封面）

> 若用 Nano Banana 出"动感静态图"，把 motion 描述替换为 "motion blur, light streaks, frozen action"。

### 01 电商设计 · 动态

```
Cinematic motion version on a dark background. The floating glass screens orbit slowly while showing e-commerce product photos and detail-page layouts that subtly shift and update. Violet (#7621B0) and amber light ribbons continuously flow between the screens; particles drift in faint haze. Slow camera drift, photorealistic, no readable text, 16:9, loop-friendly.
```

### 02 平面设计 · 动态

```
Cinematic motion version. The floating glass screens rotate slowly, showing posters, logos and typography layouts that transition from sketch to finished design. Violet-green light ribbons weave between them, gentle particles and light leaks. Slow orbit camera, no readable text, 16:9, loop-friendly.
```

### 03 前端设计 · 动态

```
Cinematic motion version. Floating browser-window screens resize responsively from desktop to tablet to phone; a blurred code editor scrolls behind. Violet light ribbons split into threads connecting the screens. Slow camera move, photorealistic, no readable text, 16:9, loop-friendly.
```

### 04 景观设计 · 动态

```
Cinematic motion version. Floating screens show a garden rendering where the camera glides through trees and water; plant silhouettes sway. Violet-green light ribbons unfurl into vines of light. Slow poetic camera move, photorealistic, no readable text, 16:9, loop-friendly.
```

### 05 建模设计 · 动态

```
Cinematic motion version. A wireframe product spins in mid-air between the screens, showing wireframe to clay to glossy-render transitions. Cyan-violet light ribbons pulse with the geometry. Slow camera push-in, photorealistic, no readable text, 16:9, loop-friendly.
```

### 06 视频设计 · 动态

```
Cinematic motion version. A timeline screen shows a playhead advancing, waveforms animating, landscape footage playing. Violet-amber light ribbons stretch like a film strip. Light streaks suggest camera movement. Slow cinematic camera, photorealistic, no readable text, 16:9, loop-friendly.
```

---

## 负面提示词（必加）

```
no text, no letters, no words, no typography, no logo, no watermark, no signature, no UI labels, no readable characters, no people, no human, no hands, no face, no office, no indoor workspace, no outdoor scene, no real-world location, no cartoon, no flat vector illustration, no clipart, no white background, no bright daylight
```

## 使用建议

1. **先跑风格锚**：第一张先出"通用悬浮作品屏 + 紫绿光流"样图，确认深色背景、光色、屏幕质感 OK。
2. **同轮续图**：后续 5 张用 `Same style as previous...` 开头，保持深色背景与光效不变，只替换屏幕上展示的作品类型。
3. **只展示屏幕内作品**：不写人物、不写办公桌/影棚/外景；所有类目信息都靠"屏幕里的内容"表达（产品图、海报、UI、效果图、模型、时间轴）。
4. **构图防官方感**：让 3–5 个屏幕呈不规则、有层次的悬浮分布，光流穿插其间，避免整齐网格排列。
