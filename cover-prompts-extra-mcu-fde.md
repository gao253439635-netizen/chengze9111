# 高祥 · AI设计魔法师 — 新增首屏封面提示词：MCU + FDE
## 风格：参考图紫绿渐变卡片 / 首屏横版封面，干净现代，无文字

> 参考图风格：紫→绿渐变背景、圆角卡片、白色文字区域、干净专业科技感。
> 用于首屏/封面时改为 16:9 横版，主体居中，顶部底部留白，只保留紫绿渐变与抽象符号。

---

## 统一风格锚（第 1 张：MCU，先发这条定调）

```
A clean horizontal service cover (16:9) in a modern tech aesthetic. Smooth purple-to-green gradient background transitioning from deep violet (#7621B0) on the left to electric teal-green (#1FD66E) on the right. Centered abstract isometric 3D subject rendered in soft glassmorphism and matte tech materials. Soft diffused studio lighting, subtle glow, generous negative space on top and bottom. No text, no letters, no numbers, no words, no typography, no logos, no watermarks, no people, no faces, no hands, no realistic photography. Premium product-design render, crisp and clean. This is the first of a two-piece cohesive series; keep this exact color gradient, lighting, and abstract 3D style for the second image.
```

---

## 静态提示词

### ① MCU · 嵌入式单片机开发
```
Same purple-to-green gradient tech style as the previous image (16:9, no text, no people). Centered subject: an abstract isometric embedded-system / microcontroller scene. A stylized MCU chip at the center, surrounded by floating circuit-board traces, GPIO pins, a small LED indicator, a USB connector, a soldering pad symbol, and a soft oscilloscope waveform. Clean glassmorphism materials, soft tech glow, matte metal accents. Premium 3D render, balanced composition.
```

### ② FDE · 前线部署工程师
```
Same purple-to-green gradient tech style as the previous image (16:9, no text, no people). Centered subject: an abstract isometric frontline deployment / field engineering scene. A laptop with a stylized terminal window, connected to floating cloud/server nodes and deployment arrows, a small status dashboard, a location-pin node, and flowing data lines. Clean glassmorphism materials, soft tech glow, matte dark accents. Premium 3D render, balanced composition.
```

---

## 动态提示词（可灵 / Veo / Runway）

### ① MCU · 嵌入式单片机开发（动态）
```
Cinematic slow push-in on a clean purple-to-green gradient tech cover. Centered abstract isometric microcontroller scene: stylized MCU chip, circuit traces, GPIO pins, LED, USB connector, soldering pad symbol, oscilloscope waveform. Subtle motion: LED gently pulses, waveform flows, data lines light up in sequence. No text, no people, loop-friendly gentle motion, 16:9.
```

### ② FDE · 前线部署工程师（动态）
```
Cinematic slow orbit around a clean purple-to-green gradient tech cover. Centered abstract isometric deployment scene: laptop with terminal window, floating cloud/server nodes, deployment arrows, status dashboard, location-pin node, flowing data lines. Subtle motion: arrows pulse and move, nodes blink, terminal cursor gently flickers. No text, no people, loop-friendly gentle motion, 16:9.
```

---

## 统一负面提示词（可追加）

```
No text, no letters, no numbers, no words, no typography, no logos, no watermarks, no people, no faces, no hands, no realistic photography, no cluttered background, no dark gloomy lighting.
```

---

## 使用建议

1. 先跑「统一风格锚」定调，让 Nano Banana / Gemini 把紫绿渐变和科技 3D 风格锁死。
2. 第二张用 `Same purple-to-green gradient tech style as the previous image` 开头，只换主体。
3. 如果模型加了文字，把 `no text, no letters, no words, no typography` 重复两遍。
4. 动态版给视频模型时保留 `loop-friendly` 让动作轻柔循环。
