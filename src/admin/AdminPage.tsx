import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSiteConfig } from "../config/SiteConfigContext";
import { SiteConfig, Bilingual, ServiceCat, FooterLink, FooterContact, FooterSocial, AdminNavGroupConfig, AdminNavItemConfig, pick } from "../config/siteConfig";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x));

/* ============================================================
 * 设计令牌（Design Tokens）—— 后台暗色体系，统一规范
 * ========================================================== */
const C = {
  shell: "#0a0b0e",
  panel: "#11141b",
  panel2: "#161a22",
  input: "#0f1117",
  purple: "#7621B0",
  purpleSoft: "#a459e6",
  green: "#1FD66E",
};

// 统一输入框样式（一致的圆角 / 边框 / 聚焦光环）
const inputBase =
  "w-full px-3.5 py-2.5 rounded-xl bg-[#0f1117] border border-white/10 text-sm text-white placeholder:text-white/25 outline-none transition-all duration-200 hover:border-white/20 focus:border-[#7621B0] focus:ring-4 focus:ring-[#7621B0]/15 focus:bg-[#12151d]";

const btnPrimary =
  "inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#7621B0] hover:bg-[#8a2bd0] text-white text-sm font-semibold shadow-lg shadow-[#7621B0]/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";

const btnGhost =
  "inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-white/12 text-white/80 text-sm font-medium hover:border-white/25 hover:text-white hover:bg-white/5 transition-all";

/* ============================================================
 * 图标（内联 SVG，线性风格，统一 18px）
 * ========================================================== */
function Icon({ name, className = "w-[18px] h-[18px]" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    spark: (
      <>
        <path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z" />
        <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14z" />
      </>
    ),
    hero: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </>
    ),
    tag: (
      <>
        <path d="M20.6 13.4l-7.2 7.2a2 2 0 01-2.8 0l-7-7A2 2 0 013 12.2V5a2 2 0 012-2h7.2a2 2 0 011.4.6l7 7a2 2 0 010 2.8z" />
        <circle cx="7.5" cy="7.5" r="1.2" />
      </>
    ),
    heading: <path d="M4 6h16M4 12h11M4 18h16" />,
    contact: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </>
    ),
    swatch: (
      <>
        <path d="M12 3a9 9 0 100 18c1 0 1.5-.8 1.5-1.5 0-1.5 1-2.5 2.5-2.5H19a3 3 0 003-3 9 9 0 00-10-8z" />
        <circle cx="7.5" cy="10.5" r="1" />
        <circle cx="12" cy="7.5" r="1" />
        <circle cx="16.5" cy="10.5" r="1" />
      </>
    ),
    photo: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </>
    ),
    folder: <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />,
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20a8 8 0 0116 0" />
      </>
    ),
    flag: <path d="M4 22V4M4 4h13l-2 4 2 4H4" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
      </>
    ),
    inbox: <path d="M3 13l3-8h12l3 8M3 13v6a1 1 0 001 1h16a1 1 0 001-1v-6M3 13h5l1 2h6l1-2h5" />,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {paths[name] ?? null}
    </svg>
  );
}

/* ============================================================
 * 侧边栏导航（分组 + 页码 + 图标 + 说明）
 * 分页模式：点击切换「页码」，整页不滚动
 * ========================================================== */
const NAV_GROUPS: AdminNavGroupConfig[] = [
  {
    id: "content",
    label: { zh: "内容管理", en: "Content" },
    items: [
      { id: "brand", label: { zh: "导航区域", en: "Navigation" }, icon: "compass" },
      { id: "hero", label: { zh: "首屏文案", en: "Hero Text" }, icon: "hero" },
      { id: "cats", label: { zh: "接单类目", en: "Services" }, icon: "tag" },
      { id: "sections", label: { zh: "区块标题", en: "Section Titles" }, icon: "heading" },
      { id: "gallery", label: { zh: "作品图", en: "Gallery" }, icon: "photo" },
      { id: "resume", label: { zh: "关于我", en: "About" }, icon: "user" },
      { id: "footer", label: { zh: "页脚", en: "Footer" }, icon: "flag" },
    ],
  },
  { id: "appearance", label: { zh: "外观", en: "Appearance" }, items: [{ id: "theme", label: { zh: "配色", en: "Theme" }, icon: "swatch" }] },
  { id: "data", label: { zh: "数据", en: "Data" }, items: [{ id: "leads", label: { zh: "接单线索", en: "Leads" }, icon: "inbox" }] },
];
const NAV_FLAT = NAV_GROUPS.flatMap((g) => g.items);
const sortItemsByOrder = (items: AdminNavItemConfig[], order: string[]) => {
  const idx = new Map(order.map((id, i) => [id, i]));
  return [...items].sort((a, b) => (idx.get(a.id) ?? Infinity) - (idx.get(b.id) ?? Infinity));
};

// 合并后台保存的菜单文案与代码默认结构：文案可被编辑，id/icon 由代码固定兜底
const mergeAdminNav = (draftNav?: { groups: AdminNavGroupConfig[] }): AdminNavGroupConfig[] => {
  if (!draftNav?.groups?.length) return NAV_GROUPS;
  return draftNav.groups.map((g, i) => {
    const def = NAV_GROUPS[i] || g;
    return {
      ...def,
      label: g.label || def.label,
      items: (def.items || []).map((defItem) => {
        const saved = g.items?.find((it) => it.id === defItem.id);
        return saved ? { ...defItem, label: saved.label || defItem.label } : defItem;
      }),
    };
  });
};

// 接单线索（与 server/store.ts 的 Lead 对齐）
interface LeadView {
  id: number;
  name?: string;
  contact?: string;
  project?: string;
  category?: string;
  budget?: string;
  message?: string;
  source: string;
  status: string;
  created_at: string;
}

const STATUS_META: Record<string, { label: string; color: string }> = {
  new: { label: "新线索", color: "#3b82f6" },
  contacted: { label: "已联系", color: "#f59e0b" },
  won: { label: "已成交", color: "#1FD66E" },
  lost: { label: "已流失", color: "#ef4444" },
  duplicate: { label: "重复", color: "#6b7280" },
};

/* ============================================================
 * 表单字段组件（统一规范 + 说明文字）
 * ========================================================== */
function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <span className="block">
      <span className="block text-[12px] font-semibold text-white/75 mb-1.5">{children}</span>
      {hint && <span className="block -mt-1 mb-1.5 text-[11px] text-white/35 leading-snug">{hint}</span>}
    </span>
  );
}

function TextField({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <input value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputBase} />
    </div>
  );
}

function BilingualField({ label, value, onChange, hint }: { label: string; value: Bilingual | undefined; onChange: (v: Bilingual) => void; hint?: string }) {
  const v = value ?? { zh: "", en: "" };
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex flex-col gap-2">
        <input value={v.zh} placeholder="中文" onChange={(e) => onChange({ ...v, zh: e.target.value })} className={inputBase} />
        <input value={v.en} placeholder="English" onChange={(e) => onChange({ ...v, en: e.target.value })} className={inputBase} />
      </div>
    </div>
  );
}

function TextArea({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <textarea value={value} rows={3} onChange={(e) => onChange(e.target.value)} className={inputBase + " resize-y leading-relaxed"} />
    </div>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [inputVal, setInputVal] = useState(value);
  const isValidHex = (v: string) => /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v);
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={value} onChange={(e) => { onChange(e.target.value); setInputVal(e.target.value); }} className="w-11 h-10 rounded-lg bg-transparent border border-white/10 cursor-pointer p-0.5" />
        <input value={inputVal} onChange={(e) => { setInputVal(e.target.value); if (isValidHex(e.target.value)) onChange(e.target.value); }} className={inputBase + " font-mono"} placeholder="#7621B0" />
      </div>
      {!isValidHex(value) && <p className="mt-1 text-[11px] text-red-400">请输入有效的十六进制颜色值，如 #7621B0</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, hint }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; t: string }[]; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputBase + " appearance-none cursor-pointer"}>
        {options.map((o) => (
          <option key={o.v} value={o.v} className="bg-[#0f1117] text-white">{o.t}</option>
        ))}
      </select>
    </div>
  );
}

function SliderField({ label, value, onChange, min, max, step, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-[#7621B0] cursor-pointer"
        />
        <span className="text-sm font-mono text-white/80 tabular-nums w-14 text-right">{value}</span>
      </div>
    </div>
  );
}

function ToggleField({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={"relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 " + (value ? "bg-[#7621B0]" : "bg-white/15")}
      >
        <span className={"inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 " + (value ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}

// 区块标题字体可选风格 / 字重（后台「区块标题」用）
const FONT_OPTIONS = [
  { v: "sans", t: "现代黑体（默认）" },
  { v: "serif", t: "经典衬线（宋体）" },
  { v: "rounded", t: "圆润体（柔和）" },
  { v: "mono", t: "等宽（科技感）" },
];
const WEIGHT_OPTIONS = [
  { v: "400", t: "常规 400" },
  { v: "600", t: "中粗 600" },
  { v: "700", t: "加粗 700" },
  { v: "900", t: "特粗 900" },
];

function StringListField({ label, value, onChange, placeholder, hint }: { label?: string; value: string[]; onChange: (v: string[]) => void; placeholder?: string; hint?: string }) {
  return (
    <div>
      {(label || hint) && <Label hint={hint}>{label || " "}</Label>}
      <textarea
        value={value.join("\n")}
        rows={Math.max(3, value.length)}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
        className={inputBase + " resize-y font-mono text-[13px] leading-relaxed"}
      />
    </div>
  );
}

/** 把图片文件压缩到最长边 maxEdge 的 JPEG base64，降低上传体积、避免 413 被拒。 */
function fileToCompressedDataUrl(file: File, maxEdge = 1600, quality = 0.9): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("文件读取失败"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("图片解码失败（请选图片文件）"));
      img.onload = () => {
        const ow = img.naturalWidth || img.width;
        const oh = img.naturalHeight || img.height;
        const scale = Math.min(1, maxEdge / Math.max(ow, oh));
        const w = Math.max(1, Math.round(ow * scale));
        const h = Math.max(1, Math.round(oh * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("浏览器不支持画布"));
        ctx.drawImage(img, 0, 0, w, h);
        // 透明相关格式（png/webp/gif）按 PNG 输出以保留透明，避免变黑底；
        // 其余（jpeg 等）按 JPEG 压缩。编码失败则回退 JPEG。
        const orig = (file.type || "").toLowerCase();
        const mime = orig === "image/png" || orig === "image/webp" || orig === "image/gif" ? "image/png" : "image/jpeg";
        try {
          resolve(canvas.toDataURL(mime, quality));
        } catch {
          resolve(canvas.toDataURL("image/jpeg", quality));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function ImageField({ label, value, onChange, hint }: { label: string; value: string; onChange: (v: string) => void; hint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); // BUG-02: 替代 alert

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      let dataUrl: string;
      try {
        dataUrl = await fileToCompressedDataUrl(file);
      } catch {
        // 压缩失败时回退为原图直传，保证上传可用
        dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onerror = () => rej(new Error("文件读取失败"));
          r.onload = () => res(r.result as string);
          r.readAsDataURL(file);
        });
      }
      const res = await fetch("/api/upload", { credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, data: dataUrl }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({} as any));
        setError("上传失败：" + (err?.error?.message || String(res.status))); // BUG-02
        return;
      }
      const json = await res.json();
      if (json.url) {
        setError("");
        onChange(json.url);
      } else {
        setError("上传失败：服务端未返回图片地址"); // BUG-02
      }
    } catch (err) {
      setError("上传失败：" + (err instanceof Error ? err.message : "未知错误")); // BUG-02
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex gap-2">
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/uploads/xxx.png 或 外链 URL" className={inputBase + " font-mono text-[13px]"} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className={btnPrimary + " shrink-0"}>
          {busy ? "上传中…" : "上传图片"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
      </div>
      {value && <img src={value} alt="preview" className="mt-2 h-20 w-auto max-w-full rounded-lg border border-white/10 object-cover" />}
      {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>} // BUG-02
    </div>
  );
}

/* ---------- 页脚：链接 / 联系方式 / 社交 列表编辑器 ---------- */
function FooterLinkEditor({ value, onChange }: { value: FooterLink[]; onChange: (v: FooterLink[]) => void }) {
  const update = (idx: number, patch: Partial<FooterLink>) => onChange(value.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= value.length) return;
    const next = [...value];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  };
  const moveEdge = (idx: number, edge: "top" | "bottom") => {
    const next = [...value];
    const [it] = next.splice(idx, 1);
    next[edge === "top" ? 0 : next.length] = it;
    onChange(next);
  };
  const add = () => onChange([...value, { label: { zh: "", en: "" }, link: "#" }]);
  const remove = (idx: number) => { if (confirm('确定删除这条链接？')) onChange(value.filter((_, i) => i !== idx)); };
  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <Label hint="站点地图链接：# 锚点 / / 站内页 / 外链；可排序、增删">站点地图链接</Label>
      {value.map((it, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white/80">链接 {String(idx + 1).padStart(2, "0")} / {String(value.length).padStart(2, "0")}</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={idx === 0} onClick={() => moveEdge(idx, "top")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤒</button>
              <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↑</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↓</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => moveEdge(idx, "bottom")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤓</button>
              <button type="button" onClick={() => remove(idx)} className="inline-flex items-center justify-center px-2 py-1 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-[11px] transition-all">删除</button>
            </div>
          </div>
          <BilingualField label="显示文字" value={it.label} onChange={(v) => update(idx, { label: v })} />
          <TextField label="链接" value={it.link} onChange={(v) => update(idx, { link: v })} hint="#hero-section / /portfolio / https://..." />
        </div>
      ))}
      <button type="button" onClick={add} className={btnGhost + " !justify-center"}>＋ 添加链接</button>
    </div>
  );
}

function FooterContactEditor({ value, onChange }: { value: FooterContact[]; onChange: (v: FooterContact[]) => void }) {
  const update = (idx: number, patch: Partial<FooterContact>) => onChange(value.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= value.length) return;
    const next = [...value];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  };
  const moveEdge = (idx: number, edge: "top" | "bottom") => {
    const next = [...value];
    const [it] = next.splice(idx, 1);
    next[edge === "top" ? 0 : next.length] = it;
    onChange(next);
  };
  const add = () => onChange([...value, { type: "custom", label: { zh: "", en: "" }, value: "", qrImage: "" }]);
  const remove = (idx: number) => { if (confirm('确定删除这条联系方式？')) onChange(value.filter((_, i) => i !== idx)); };
  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <Label hint="联系方式：微信可上传二维码图片；邮箱/电话会自动生成可点击链接；可排序、增删">联系方式</Label>
      {value.map((it, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white/80">联系方式 {String(idx + 1).padStart(2, "0")} / {String(value.length).padStart(2, "0")}</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={idx === 0} onClick={() => moveEdge(idx, "top")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤒</button>
              <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↑</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↓</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => moveEdge(idx, "bottom")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤓</button>
              <button type="button" onClick={() => remove(idx)} className="inline-flex items-center justify-center px-2 py-1 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-[11px] transition-all">删除</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SelectField
              label="类型"
              value={it.type}
              onChange={(v) => update(idx, { type: v as FooterContact["type"] })}
              options={[
                { v: "wechat", t: "微信" },
                { v: "email", t: "邮箱" },
                { v: "phone", t: "电话" },
                { v: "custom", t: "自定义" },
              ]}
            />
            <BilingualField label="显示名称" value={it.label} onChange={(v) => update(idx, { label: v })} />
          </div>
          <TextField label="内容（微信号 / 邮箱 / 电话 / 自定义文案）" value={it.value} onChange={(v) => update(idx, { value: v })} />
          {it.type === "wechat" && (
            <div className="sm:col-span-2">
              <ImageField label="微信二维码" value={it.qrImage || ""} onChange={(v) => update(idx, { qrImage: v })} hint="上传二维码图片，前台会在微信项下方展示" />
              {it.qrImage && (
                <div className="mt-2">
                  <button type="button" onClick={() => update(idx, { qrImage: "" })} className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-[11px] transition-all">删除二维码</button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={add} className={btnGhost + " !justify-center"}>＋ 添加联系方式</button>
    </div>
  );
}

function FooterSocialEditor({ value, onChange }: { value: FooterSocial[]; onChange: (v: FooterSocial[]) => void }) {
  const update = (idx: number, patch: Partial<FooterSocial>) => onChange(value.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  const move = (idx: number, dir: -1 | 1) => {
    if (idx + dir < 0 || idx + dir >= value.length) return;
    const next = [...value];
    [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
    onChange(next);
  };
  const moveEdge = (idx: number, edge: "top" | "bottom") => {
    const next = [...value];
    const [it] = next.splice(idx, 1);
    next[edge === "top" ? 0 : next.length] = it;
    onChange(next);
  };
  const add = () => onChange([...value, { platform: "github", url: "" }]);
  const remove = (idx: number) => { if (confirm('确定删除这个社交链接？')) onChange(value.filter((_, i) => i !== idx)); };
  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <Label hint="底部社交图标：支持 github / twitter / x / linkedin / instagram / youtube / dribbble 等，其余显示地球图标；可排序、增删">社交链接</Label>
      {value.map((it, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-white/80">社交 {String(idx + 1).padStart(2, "0")} / {String(value.length).padStart(2, "0")}</span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={idx === 0} onClick={() => moveEdge(idx, "top")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤒</button>
              <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↑</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↓</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => moveEdge(idx, "bottom")} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>⤓</button>
              <button type="button" onClick={() => remove(idx)} className="inline-flex items-center justify-center px-2 py-1 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-[11px] transition-all">删除</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="平台名称" value={it.platform} onChange={(v) => update(idx, { platform: v })} hint="如 github / twitter / linkedin" />
            <TextField label="链接" value={it.url} onChange={(v) => update(idx, { url: v })} />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className={btnGhost + " !justify-center"}>＋ 添加社交链接</button>
    </div>
  );
}

/* ---------- 接单类目对象数组编辑 ---------- */
function ServiceCatField({ label, value, onChange }: { label: string; value: ServiceCat[]; onChange: (v: ServiceCat[]) => void }) {
  const update = (idx: number, patch: Partial<ServiceCat>) => onChange(value.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  const add = () => onChange([...value, { name: { zh: "", en: "" }, image: "", link: "", desc: { zh: "", en: "" } }]);
  const remove = (idx: number) => { if (confirm('确定删除这个服务类目？')) onChange(value.filter((_, i) => i !== idx)); };
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...value];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <Label hint={label}>接单类目清单</Label>
      {value.map((cat, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/80">
              <span className="grid place-items-center w-5 h-5 rounded-md bg-[#7621B0]/20 text-[#a459e6] text-[10px]">{idx + 1}</span>
              类目卡片
            </span>
            <div className="flex items-center gap-1">
              <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↑</button>
              <button type="button" disabled={idx === value.length - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↓</button>
              <button type="button" onClick={() => remove(idx)} className="text-[11px] text-red-400/80 hover:text-red-300 transition-colors">删除</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <TextField label="名称（中文）" value={cat.name?.zh ?? ""} onChange={(v) => update(idx, { name: { ...(cat.name ?? { zh: "", en: "" }), zh: v } })} />
            <TextField label="名称（英文）" value={cat.name?.en ?? ""} onChange={(v) => update(idx, { name: { ...(cat.name ?? { zh: "", en: "" }), en: v } })} />
            <TextField label="跳转链接" value={cat.link} onChange={(v) => update(idx, { link: v })} hint="留空 = 点击卡片弹「咨询」；填了 = 点卡片打开该链接" />
            <ImageField label="配图" value={cat.image} onChange={(v) => update(idx, { image: v })} hint="建议 800×600 以上，展示在接单服务屏" />
            <SelectField
              label="配图比例"
              value={cat.imageRatio || "16:9"}
              onChange={(v) => update(idx, { imageRatio: v as "16:9" | "4:3" | "5:4" })}
              options={[{ v: "16:9", t: "16:9 宽屏" }, { v: "4:3", t: "4:3 标准" }, { v: "5:4", t: "5:4 近方" }]}
              hint="接单服务屏图片展示框比例，保存后前台即时生效"
            />
            <div className="sm:col-span-2">
              <TextArea label="说明（中文）" value={cat.desc?.zh ?? ""} onChange={(v) => update(idx, { desc: { ...(cat.desc ?? { zh: "", en: "" }), zh: v } })} />
            </div>
            <div className="sm:col-span-2">
              <TextArea label="说明（英文）" value={cat.desc?.en ?? ""} onChange={(v) => update(idx, { desc: { ...(cat.desc ?? { zh: "", en: "" }), en: v } })} />
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className={btnGhost + " self-start"}>
        + 添加类目
      </button>
    </div>
  );
}

/* ---------- 导航菜单顺序 / 文字 / 链接编辑（后台「导航区域」用） ---------- */
const BUILTIN_NAV_KEYS = new Set<string>(["works", "services", "about"]);
function NavOrderEditor({
  order,
  nav,
  onReorder,
  onLabel,
  onLink,
  onAdd,
  onRemove,
}: {
  order: string[];
  nav: Record<string, { label: Bilingual; link: string }>;
  onReorder: (next: string[]) => void;
  onLabel: (key: string, v: Bilingual) => void;
  onLink: (key: string, v: string) => void;
  onAdd: () => void;
  onRemove: (key: string) => void;
}) {
  // 显示顺序：order 中存在的项按存储顺序；nav 里存在但漏写进 order 的补在末尾（防御）
  const safeOrder = [
    ...order.filter((k) => nav[k]),
    ...Object.keys(nav).filter((k) => !order.includes(k)),
  ];
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...safeOrder];
    const j = idx + dir;
    if (j < 0 || j >= next.length) return;
    [next[idx], next[j]] = [next[j], next[idx]];
    onReorder(next);
  };
  return (
    <div className="sm:col-span-2 flex flex-col gap-3">
      <Label hint="「↑ 上移 / ↓ 下移」调整顺序；每个菜单项可填写「链接」决定点击去向（#本页锚点 / 内部路由 / 外链）；可「+ 添加菜单项」新增，自定义项可「删除」。前台顶栏与页脚同步。">导航菜单</Label>
      {safeOrder.map((key, idx) => (
        <div key={key} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/80">
              <span className="grid place-items-center w-5 h-5 rounded-md bg-[#7621B0]/20 text-[#a459e6] text-[10px]">{idx + 1}</span>
              {nav[key]?.label?.zh || "自定义菜单项"}
              {!BUILTIN_NAV_KEYS.has(key) && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50">自定义</span>
              )}
            </span>
            <div className="flex items-center gap-1.5">
              <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2.5 text-xs disabled:opacity-30"}>↑ 上移</button>
              <button type="button" disabled={idx === safeOrder.length - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2.5 text-xs disabled:opacity-30"}>↓ 下移</button>
              {!BUILTIN_NAV_KEYS.has(key) && (
                <button type="button" onClick={() => onRemove(key)} className="!py-1 !px-2.5 text-xs rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/15 transition-all">删除</button>
              )}
            </div>
          </div>
          <BilingualField label="菜单文字（中 / 英）" value={nav[key]?.label} onChange={(v) => onLabel(key, v)} />
          <TextField
            label="链接"
            value={nav[key]?.link || ""}
            placeholder="#services-section 或 /portfolio 或 https://..."
            hint="以 # 开头 = 本页锚点平滑滚动（如 #services-section）；以 / 开头 = 站内页面（如 /portfolio）；其他 = 外部链接（新标签打开）"
            onChange={(v) => onLink(key, v)}
          />
        </div>
      ))}
      <button type="button" onClick={onAdd} className={btnGhost + " w-full !py-3 text-sm border-dashed border-white/20 hover:border-[#7621B0] hover:text-[#a459e6]"}>
        ＋ 添加菜单项
      </button>
    </div>
  );
}

// 后台 /admin 左侧边栏菜单文案编辑器（分组名、菜单项名称可编辑；id/icon 由代码固定）
function AdminNavEditor({
  adminNav,
  onChange,
}: {
  adminNav?: { groups: AdminNavGroupConfig[] };
  onChange: (v: { groups: AdminNavGroupConfig[] }) => void;
}) {
  const groups = adminNav?.groups?.length ? adminNav.groups : NAV_GROUPS;
  const setGroupLabel = (gi: number, v: Bilingual) => {
    onChange({ groups: groups.map((g, i) => (i === gi ? { ...g, label: v } : g)) });
  };
  const setItemLabel = (gi: number, ii: number, v: Bilingual) => {
    onChange({
      groups: groups.map((g, i) =>
        i === gi ? { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, label: v } : it)) } : g
      ),
    });
  };
  return (
    <div className="sm:col-span-2 flex flex-col gap-5">
      {groups.map((g, gi) => (
        <div key={g.id} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[12px] font-semibold text-white/80">
            <span className="grid place-items-center w-5 h-5 rounded-md bg-[#7621B0]/20 text-[#a459e6] text-[10px]">G</span>
            <span>分组：{g.id}</span>
          </div>
          <BilingualField label="分组名称（中 / 英）" value={g.label} onChange={(v) => setGroupLabel(gi, v)} />
          <div className="pl-3 border-l border-white/10 flex flex-col gap-3">
            {g.items.map((it, ii) => (
              <div key={it.id} className="flex items-start gap-3">
                <span className="mt-2 text-white/40 shrink-0">
                  <Icon name={it.icon} className="w-4 h-4" />
                </span>
                <span className="mt-2.5 text-[11px] text-white/50 w-16 shrink-0">{it.id}</span>
                <div className="flex-1 min-w-0">
                  <BilingualField label="菜单文字（中 / 英）" value={it.label} onChange={(v) => setItemLabel(gi, ii, v)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )      )}
    </div>
  );
}

// 侧边栏就地编辑菜单文字弹窗（中 / 英双输入）
function NavLabelEditModal({
  title,
  value,
  onSave,
  onClose,
}: {
  title: string;
  value: Bilingual;
  onSave: (v: Bilingual) => void;
  onClose: () => void;
}) {
  const [zh, setZh] = useState(value?.zh || "");
  const [en, setEn] = useState(value?.en || "");
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#11141b] shadow-2xl shadow-black/50 p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">{title}</h3>
          <button type="button" onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none">✕</button>
        </div>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-white/55">中文标题</span>
          <input
            value={zh}
            onChange={(e) => setZh(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#0c0e12] border border-white/10 text-white text-sm outline-none focus:border-[#7621B0]"
            placeholder="如：作品集"
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px] text-white/55">英文标题</span>
          <input
            value={en}
            onChange={(e) => setEn(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#0c0e12] border border-white/10 text-white text-sm outline-none focus:border-[#7621B0]"
            placeholder="如：Portfolio"
          />
        </label>
        <div className="flex items-center justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className={btnGhost}>取消</button>
          <button
            type="button"
            onClick={() => onSave({ zh, en })}
            className={btnPrimary}
          >
            保存文字
          </button>
        </div>
      </div>
    </div>
  );
}
function Card({ title, desc, icon, actions, children }: { title: string; desc?: string; icon?: string; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="admin-fade-up rounded-2xl border border-white/[0.07] bg-[#11141b] overflow-hidden shadow-xl shadow-black/30">
      <div
        className="relative flex items-start gap-3.5 px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.06]"
        style={{ background: "linear-gradient(to right, color-mix(in srgb, var(--c-accent) 8%, transparent), transparent)" }}
      >
        {/* 左侧强调色竖条：强化「区块」分隔感，与前台强调色统一（--c-accent 随「配色」同步） */}
        <span className="absolute left-0 top-3.5 bottom-3.5 w-[3px] rounded-r-full bg-[var(--c-accent)]" aria-hidden />
        {icon && (
          <span className="mt-0.5 grid place-items-center w-10 h-10 rounded-xl bg-[var(--c-accent)]/15 text-[var(--c-accent)] ring-1 ring-[var(--c-accent)]/25 shrink-0">
            <Icon name={icon} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-[16px] font-bold text-white tracking-tight leading-tight">{title}</h2>
          {desc && <p className="text-[12px] text-white/50 mt-1 leading-snug">{desc}</p>}
        </div>
        {actions && <div className="shrink-0 ml-auto pl-3">{actions}</div>}
      </div>
      <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">{children}</div>
    </section>
  );
}

/* ============================================================
 * 主组件（分页式后台：点击侧边栏换页，整页不滚动）
 * ========================================================== */
export default function AdminPage() {
  const { config, loaded, save, authEnabled, loggedIn, login, logout } = useSiteConfig();
  // 登录状态
  const [loginPwd, setLoginPwd] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    if (!loginPwd.trim()) return;
    setLoggingIn(true);
    setLoginErr('');
    const ok = await login(loginPwd);
    setLoggingIn(false);
    if (!ok) setLoginErr('密码错误，请重试');
  };

  // 登录表单
  if (authEnabled && !loggedIn) {
    return (
      <div className='h-screen overflow-hidden bg-[#0a0b0e] text-white flex items-center justify-center'>
        <div className='w-full max-w-sm mx-4'>
          <div className='text-center mb-8'>
            <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7621B0] to-[#1FD66E] grid place-items-center font-black text-white text-2xl shadow-lg shadow-[#7621B0]/30 mx-auto mb-4'>G</div>
            <h1 className='text-xl font-bold text-white'>管理后台</h1>
            <p className='text-sm text-white/40 mt-1'>请输入密码继续</p>
          </div>
          <div className='rounded-2xl border border-white/[0.07] bg-[#11141b] p-6 shadow-xl shadow-black/30'>
            <div className='flex gap-2'>
              <input
                type='password'
                value={loginPwd}
                onChange={(e) => { setLoginPwd(e.target.value); setLoginErr(''); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                placeholder='密码'
                autoComplete='current-password'
                className='flex-1 px-4 py-2.5 rounded-xl bg-[#0f1117] border border-white/10 text-sm text-white placeholder:text-white/25 outline-none focus:border-[#7621B0] focus:ring-4 focus:ring-[#7621B0]/15 transition-all'
                autoFocus
              />
              <button
                type='button'
                onClick={handleLogin}
                disabled={loggingIn || !loginPwd.trim()}
                className='px-5 py-2.5 rounded-xl bg-[#7621B0] hover:bg-[#8a2bd0] text-white text-sm font-semibold shadow-lg shadow-[#7621B0]/25 transition-all disabled:opacity-50 disabled:active:scale-100'
              >
                {loggingIn ? '验证中…' : '登录'}
              </button>
            </div>
            {loginErr && <p className='mt-3 text-[12px] text-red-400'>{loginErr}</p>}
          </div>
        </div>
      </div>
    );
  }
  const [draft, setDraft] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [dirty, setDirty] = useState(false);
  const [active, setActive] = useState("brand");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const toggleGroup = (name: string) =>
    setCollapsed((c) => ({ ...c, [name]: !c[name] }));

  // 侧边栏就地编辑菜单文案（分组标题 + 菜单项文字）
  const [navEditMode, setNavEditMode] = useState(false);
  const [editingNav, setEditingNav] = useState<{ kind: "group" | "item"; gi: number; ii?: number } | null>(null);
  const updateAdminNavLabel = (gi: number, ii: number | null, v: Bilingual) => {
    const base = draft?.adminNav?.groups?.length ? draft.adminNav.groups : NAV_GROUPS;
    const next = base.map((g, i) => {
      if (i !== gi) return g;
      if (ii === null) return { ...g, label: v };
      return { ...g, items: g.items.map((it, j) => (j === ii ? { ...it, label: v } : it)) };
    });
    set({ adminNav: { groups: next } });
  };

  const language: "zh" | "en" = "zh"; // 后台编辑界面固定中文

  const adminNavOrder = draft?.adminNavOrder || NAV_FLAT.map((n) => n.id);
  const navGroups = useMemo(() => mergeAdminNav(draft?.adminNav), [draft?.adminNav]);
  const sortedNavGroups = useMemo(
    () => navGroups.map((g) => ({ ...g, items: sortItemsByOrder(g.items, adminNavOrder) })),
    [navGroups, adminNavOrder]
  );
  const sortedNavFlat = useMemo(() => sortedNavGroups.flatMap((g) => g.items), [sortedNavGroups]);

  const [leads, setLeads] = useState<LeadView[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [leadsError, setLeadsError] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [leadPage, setLeadPage] = useState(0);
  const [leadTotal, setLeadTotal] = useState(0);
  const LEAD_PAGE_SIZE = 20;

  const loadLeads = useCallback((page = leadPage, filter = leadFilter) => {
    setLeadsLoading(true);
    const params = new URLSearchParams({
      limit: String(LEAD_PAGE_SIZE),
      offset: String(page * LEAD_PAGE_SIZE),
      ...(filter !== "all" ? { status: filter } : {}),
    });
    fetch(`/api/v1/leads?${params}`, { cache: "no-store", credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("读取失败"))))
      .then((json: any) => {
        // 后端返回 { data: LeadView[], total: number, count: number }
        setLeads(json.data || []);
        if (json.total !== undefined) setLeadTotal(json.total);
      })
      .catch((e: any) => setLeadsError(e?.message || "读取失败"))
      .finally(() => setLeadsLoading(false));
  }, [leadPage, leadFilter]);

  useEffect(() => {
    loadLeads(leadPage, leadFilter);
    const t = setInterval(() => loadLeads(leadPage, leadFilter), 60_000);
    return () => clearInterval(t);
  }, [loadLeads, leadPage, leadFilter]);

  const updateLeadStatus = useCallback((id: number, status: string) => {
    return fetch(`/api/v1/leads/${id}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) })
      .then((r) => {
        if (!r.ok) throw new Error("更新失败");
        setLeads((prev) => prev.map((x) => (x.id === id ? { ...x, status } : x)));
      });
  }, []);

  useEffect(() => {
    if (loaded && !draft) setDraft(clone(config));
  }, [loaded, config, draft]);

  // BUG-01: dirty 时拦截关闭/刷新
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const set = (patch: Partial<SiteConfig>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
    setDirty(true);
  };

  const onSave = async () => {
    if (!draft || saving) return; // BUG-07: 防重复点击
    // 自动剔除「中英文都没填名」的空类目（避免前台出残缺卡片），其余照常保存，不再硬拦截
    const namedCats = draft.serviceCats.filter(
      (c) => (c.name?.zh || "").trim() || (c.name?.en || "").trim()
    );
    const removed = draft.serviceCats.length - namedCats.length;
    const nextDraft = { ...draft, serviceCats: namedCats };
    setSaving(true);
    setMsg("");
    try {
      await save(nextDraft);
      if (removed > 0) set({ serviceCats: namedCats }); // 表单同步反映已剔除，避免再次保存时重复提示
      setDirty(false);
      setMsg(
        removed > 0
          ? `✅ 已保存，并自动移除了 ${removed} 个未命名类目（其余 ${namedCats.length} 个已保留）`
          : "✅ 已保存，刷新前台网页即可看到更新"
      );
      setTimeout(() => setMsg(""), 4000); // BUG-04: 4秒后自动清除
    } catch (e: any) {
      setMsg("❌ " + (e?.message || "保存失败"));
    } finally {
      setSaving(false);
    }
  };

  // BUG-05: Ctrl+S / Cmd+S 快捷键保存（放在 onSave 之后，避免 TDZ 问题）
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (dirty) onSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dirty, onSave]);

  const activeLabel = pick(sortedNavFlat.find((n) => n.id === active)?.label, language) || "后台";

  if (!draft) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0a0b0e]">
        <div className="flex flex-col items-center gap-3 text-white/50">
          <span className="w-8 h-8 rounded-full border-2 border-white/15 border-t-[#7621B0] animate-spin" />
          <span className="text-sm">后台加载中…</span>
        </div>
      </div>
    );
  }

  const filteredLeads = leadFilter === "all" ? leads : leads.filter((l) => l.status === leadFilter);

  /* ---------- 按页码渲染当前页内容（整页不滚动，仅本区内部滚动） ---------- */
  const renderSection = (id: string) => {
    switch (id) {
      case "brand":
        return (
          <Card title="导航区域" icon="compass" desc="网站名称、头衔、个人 IP 标识，以及顶部导航栏与页脚的菜单文字与顺序">
            <TextField label="名字（中文）" value={draft.brand?.nameZh ?? ""} onChange={(v) => set({ brand: { ...draft.brand, nameZh: v } })} />
            <TextField label="头衔 / IP 名（中文）" value={draft.brand?.titleZh ?? ""} onChange={(v) => set({ brand: { ...draft.brand, titleZh: v } })} />
            <TextField label="名字（英文）" value={draft.brand?.nameEn ?? ""} onChange={(v) => set({ brand: { ...draft.brand, nameEn: v } })} />
            <TextField label="头衔（英文）" value={draft.brand?.titleEn ?? ""} onChange={(v) => set({ brand: { ...draft.brand, titleEn: v } })} />
            <div className="sm:col-span-2">
              <BilingualField label="品牌副标语" value={draft.brand?.tagline} onChange={(v) => set({ brand: { ...draft.brand, tagline: v } })} />
            </div>

            <div className="sm:col-span-2 mt-2 pt-4 border-t border-white/[0.07]">
              <p className="text-[11px] font-semibold text-[#a459e6] uppercase tracking-[0.2em] mb-1">导航菜单</p>
              <p className="text-[11px] text-white/35 leading-snug">导航栏展示的菜单文字与顺序，前台顶栏、页脚同步生效。（首屏视频等互动设置在「首屏文案」页，不混入此处。）</p>
            </div>
            <NavOrderEditor
              order={draft.navOrder && draft.navOrder.length ? draft.navOrder : ["works", "services", "about"]}
              nav={draft.nav}
              onReorder={(next) => set({ navOrder: next })}
              onLabel={(key, v) => set({ nav: { ...draft.nav, [key]: { ...(draft.nav[key] || { label: { zh: "", en: "" }, link: "" }), label: v } } })}
              onLink={(key, v) => set({ nav: { ...draft.nav, [key]: { ...(draft.nav[key] || { label: { zh: "", en: "" }, link: "" }), link: v } } })}
              onAdd={() => {
                const key = "menu_" + Date.now();
                set({
                  nav: { ...draft.nav, [key]: { label: { zh: "新菜单", en: "New Menu" }, link: "#" } },
                  navOrder: [...(draft.navOrder || []), key],
                });
              }}
              onRemove={(key) => {
                const nextNav = { ...draft.nav };
                delete nextNav[key];
                set({ nav: nextNav, navOrder: (draft.navOrder || []).filter((k) => k !== key) });
              }}
            />

            <div className="sm:col-span-2 mt-4 pt-4 border-t border-white/[0.07]">
              <p className="text-[11px] font-semibold text-[#a459e6] uppercase tracking-[0.2em] mb-1">后台侧边栏菜单文案</p>
              <p className="text-[11px] text-white/35 leading-snug mb-3">修改后台 /admin 左侧菜单的分组标题与每个菜单项显示文字。图标与菜单项 ID 由系统固定，只改文案。</p>
            </div>
            <AdminNavEditor adminNav={draft.adminNav} onChange={(v) => set({ adminNav: v })} />
          </Card>
        );
      case "hero":
        return (
          <Card title="首屏文案" icon="hero" desc="网站第一屏的主视觉、按钮文字与背景视频互动">
            <div className="sm:col-span-2">
              <BilingualField label="首屏大标题" value={draft.hero.heading} onChange={(v) => set({ hero: { ...draft.hero, heading: v } })} hint="首屏超大标题，默认同品牌名；可改成一句标语，与导航 logo 区分（导航 logo 在「导航区域」设置，并随语言切换）" />
            </div>
            <div className="sm:col-span-2">
              <BilingualField label="主标题下方说明" value={draft.hero.subtitle} onChange={(v) => set({ hero: { ...draft.hero, subtitle: v } })} />
            </div>
            <BilingualField label="主按钮文字" value={draft.hero.ctaText} onChange={(v) => set({ hero: { ...draft.hero, ctaText: v } })} />
            <TextField label="背景视频地址" value={draft.hero.video} onChange={(v) => set({ hero: { ...draft.hero, video: v } })} hint="mp4 链接，如 /hero/hero-particles.mp4" />
            <TextField label="视频兜底图（poster）" value={draft.hero.poster} onChange={(v) => set({ hero: { ...draft.hero, poster: v } })} hint="视频加载前 / 失败显示，默认 /hero/portfolio.png" />

            <div className="sm:col-span-2 mt-2 pt-4 border-t border-white/[0.07]">
              <p className="text-[11px] font-semibold text-[#a459e6] uppercase tracking-[0.2em] mb-1">首屏视频互动</p>
              <p className="text-[11px] text-white/35 leading-snug">开启后，鼠标在首屏操作可让背景视频「按帧」跟随，呈现人机交互效果。手机 / 触屏自动回退为循环播放。</p>
            </div>
            <ToggleField
              label="启用视频互动"
              value={draft.hero.videoScrub.enabled}
              onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, enabled: v } } })}
              hint="关 = 纯循环播放；开 = 随鼠标操作按帧动"
            />
            <SelectField
              label="互动模式"
              value={draft.hero.videoScrub.mode ?? "move"}
              onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, mode: v as "move" | "wheel" | "loop" } } })}
              options={[
                { v: "loop", t: "循环播放（自动循环，老版本）" },
                { v: "wheel", t: "滚轮逐帧（滚轮上下滑动）" },
                { v: "move", t: "鼠标跟随（鼠标位置）" },
              ]}
              hint="循环播放：背景视频自动循环（老版本效果）；滚轮逐帧：滚一下动一帧；鼠标跟随：按鼠标位置映射进度"
            />
            {draft.hero.videoScrub.mode === "loop" ? (
              <p className="text-[11px] text-white/35 leading-snug col-span-2">循环播放模式：背景视频自动循环，无需额外参数。如需换成「滚轮逐帧 / 鼠标跟随」，把上方「互动模式」切回即可。</p>
            ) : draft.hero.videoScrub.mode === "wheel" ? (
              <SliderField
                label="每格步进"
                value={draft.hero.videoScrub.step ?? 0.05}
                onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, step: v } } })}
                min={0.01}
                max={0.2}
                step={0.01}
                hint="滚轮每滑动一格，视频前进的秒数（约一帧，可微调快慢）"
              />
            ) : (
              <>
                <SelectField
                  label="滑动轴"
                  value={draft.hero.videoScrub.axis}
                  onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, axis: v as "x" | "y" | "xy" } } })}
                  options={[
                    { v: "y", t: "仅纵向（上下滑动）" },
                    { v: "x", t: "仅横向（左右滑动）" },
                    { v: "xy", t: "横纵双轴（上下+左右）" },
                  ]}
                  hint="鼠标纵向位置映射到视频进度，上下滑动即可逐帧推进"
                />
                <ToggleField
                  label="缓动跟随"
                  value={draft.hero.videoScrub.smooth}
                  onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, smooth: v } } })}
                  hint="平滑过渡更顺滑（关 = 瞬切帧）"
                />
                <ToggleField
                  label="离开恢复播放"
                  value={draft.hero.videoScrub.autoResume}
                  onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, autoResume: v } } })}
                  hint="鼠标移出首屏后自动循环播放"
                />
              </>
            )}
            <ToggleField
              label="显示互动提示"
              value={draft.hero.videoScrub.hint}
              onChange={(v) => set({ hero: { ...draft.hero, videoScrub: { ...draft.hero.videoScrub, hint: v } } })}
              hint="首屏居中显示互动提示"
            />
          </Card>
        );
      case "cats":
        return (
          <Card title="接单类目" icon="tag" desc="首页「接单服务」卡片：可配图、配链接、配说明">
            <ServiceCatField label="每个类目：名称 / 配图 / 跳转链接 / 一句话说明" value={draft.serviceCats} onChange={(v) => set({ serviceCats: v })} />
          </Card>
        );
      case "sections":
        return (
          <Card title="区块标题" icon="heading" desc="各内容区块的中英文大标题（作品预览 / 接单服务 / 关于我）；导航栏菜单文字在「导航区域」页设置">
            <BilingualField label="作品预览" value={draft.sections.works} onChange={(v) => set({ sections: { ...draft.sections, works: v } })} />
            <BilingualField label="接单服务" value={draft.sections.services} onChange={(v) => set({ sections: { ...draft.sections, services: v } })} />
            <BilingualField label="关于我" value={draft.sections.about} onChange={(v) => set({ sections: { ...draft.sections, about: v } })} />

            <div className="sm:col-span-2 mt-2 pt-4 border-t border-white/[0.07]">
              <p className="text-[11px] font-semibold text-[#a459e6] uppercase tracking-[0.2em] mb-1">标题字体</p>
              <p className="text-[11px] text-white/35 leading-snug">前台各区块大标题的字体，手动调节后保存、刷新前台即可生效（全站统一）。</p>
            </div>
            <SelectField
              label="字体风格"
              value={draft.sectionTitleFont.family}
              onChange={(v) => set({ sectionTitleFont: { ...draft.sectionTitleFont, family: v } })}
              options={FONT_OPTIONS}
              hint="黑体现代 / 衬线经典 / 圆润柔和 / 等宽科技"
            />
            <SelectField
              label="字重"
              value={String(draft.sectionTitleFont.weight)}
              onChange={(v) => set({ sectionTitleFont: { ...draft.sectionTitleFont, weight: Number(v) } })}
              options={WEIGHT_OPTIONS}
              hint="标题粗细"
            />
            <SliderField
              label="标题大小"
              value={draft.sectionTitleFont.scale}
              min={0.5}
              max={2}
              step={0.05}
              onChange={(v) => set({ sectionTitleFont: { ...draft.sectionTitleFont, scale: v } })}
              hint="相对默认大小的倍率，1 = 原样"
            />
            <SliderField
              label="字间距"
              value={draft.sectionTitleFont.letterSpacing}
              min={-0.1}
              max={0.4}
              step={0.01}
              onChange={(v) => set({ sectionTitleFont: { ...draft.sectionTitleFont, letterSpacing: v } })}
              hint="字母间距（em），负=紧凑，正=宽松"
            />
          </Card>
        );
      case "theme":
        return (
          <Card title="配色" icon="swatch" desc="修改后前台即时变色（改完记得看效果，谨慎调整）">
            <ColorField label="主文字色 ink" value={draft.theme.ink} onChange={(v) => set({ theme: { ...draft.theme, ink: v } })} />
            <ColorField label="强调色 accent" value={draft.theme.accent} onChange={(v) => set({ theme: { ...draft.theme, accent: v } })} />
            <ColorField label="点缀色 dot" value={draft.theme.dot} onChange={(v) => set({ theme: { ...draft.theme, dot: v } })} />
          </Card>
        );
      case "gallery":
        return (
          <Card title="作品图" icon="photo" desc="首屏下方滚动展示的作品图：支持上传、图注、移动顺序、删除">
            <div className="sm:col-span-2 flex flex-col gap-3">
              <Label hint="每张图可上传或填外链 URL，可写图注，可上下移动排序、可删除">作品图清单（{draft.worksGallery.length} 张）</Label>
              {draft.worksGallery.map((it, idx) => (
                <div key={idx} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-[12px] font-semibold text-white/80">
                      <span className="grid place-items-center w-5 h-5 rounded-md bg-[#7621B0]/20 text-[#a459e6] text-[10px]">{idx + 1}</span>
                      作品图
                    </span>
                    <div className="flex items-center gap-1">
                      <button type="button" disabled={idx === 0} onClick={() => { const a = [...draft.worksGallery]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; set({ worksGallery: a }); }} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↑</button>
                      <button type="button" disabled={idx === draft.worksGallery.length - 1} onClick={() => { const a = [...draft.worksGallery]; [a[idx + 1], a[idx]] = [a[idx], a[idx + 1]]; set({ worksGallery: a }); }} className={btnGhost + " !py-1 !px-2 text-[11px] disabled:opacity-30"}>↓</button>
                      <button type="button" onClick={() => { if (confirm('确定删除这张作品图？删除后需重新上传。')) set({ worksGallery: draft.worksGallery.filter((_, i) => i !== idx) }); }} className="inline-flex items-center justify-center px-2 py-1 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/15 text-[11px] transition-all">删除</button>
                    </div>
                  </div>
                  <ImageField
                    label="配图"
                    value={typeof it === "string" ? it : it.url}
                    onChange={(v) => { const a = [...draft.worksGallery]; if (typeof a[idx] === "string") a[idx] = { url: v }; else a[idx] = { ...a[idx], url: v }; set({ worksGallery: a }); }}
                    hint="上传或外链，建议统一尺寸保证走马灯整齐"
                  />
                  <TextField
                    label="图注（可选）"
                    value={typeof it === "string" ? "" : it.caption || ""}
                    onChange={(v) => { const a = [...draft.worksGallery]; if (typeof a[idx] === "string") a[idx] = { url: a[idx], caption: v }; else a[idx] = { ...a[idx], caption: v }; set({ worksGallery: a }); }}
                    placeholder="如：电商主图案例 / 包装设计"
                  />
                </div>
              ))}
              <button type="button" onClick={() => set({ worksGallery: [...draft.worksGallery, { url: "" }] })} className={btnGhost + " self-start"}>+ 添加作品图</button>
              <div className="flex flex-wrap gap-2 mt-1">
                {draft.worksGallery.map((it, i) => {
                  const u = typeof it === "string" ? it : it.url;
                  return u ? <img key={i} src={u} alt="" className="h-16 w-28 object-cover rounded-lg border border-white/10" referrerPolicy="no-referrer" /> : null;
                })}
              </div>
            </div>
          </Card>
        );
      case "resume":
        return (
          <div className="flex flex-col gap-5">
            <Card title="关于我 · 基础信息" icon="user" desc="个人简介与学历证书，显示在「关于我」屏左侧">
              <div className="sm:col-span-2">
                <BilingualField label="个人简介" value={draft.aboutBio} onChange={(v) => set({ aboutBio: v })} hint="一段式自我介绍，建议 2-3 句" />
              </div>
              <div className="sm:col-span-2">
                <BilingualField label="学历 / 证书" value={draft.aboutMeta} onChange={(v) => set({ aboutMeta: v })} hint="一行式，如：学校 · 专业 | 证书" />
              </div>
            </Card>

            {(() => {
              // 工作经历排序工具：移动/置顶置底后整体重排序号（num 01/02...），保证前台时间轴连续
              const renum = (arr: typeof draft.resume) =>
                arr.map((it, i) => ({ ...it, num: String(i + 1).padStart(2, "0") }));
              const move = (idx: number, dir: -1 | 1) => {
                const arr = [...draft.resume];
                const j = idx + dir;
                if (j < 0 || j >= arr.length) return;
                [arr[idx], arr[j]] = [arr[j], arr[idx]];
                set({ resume: renum(arr) });
              };
              const moveEdge = (idx: number, top: boolean) => {
                const arr = [...draft.resume];
                const [it] = arr.splice(idx, 1);
                if (top) arr.unshift(it);
                else arr.push(it);
                set({ resume: renum(arr) });
              };
              const remove = (idx: number) => {
                if (!confirm('确定删除这条工作经历？删除后无法撤销。')) return;
                set({ resume: renum(draft.resume.filter((_, i) => i !== idx)) });
              };
              const total = draft.resume.length;
              return draft.resume.map((r, idx) => (
                <React.Fragment key={r.num}>
                <Card
                  title={`工作经历 ${r.num} / ${total}`}
                  icon="user"
                  desc="一段真实工作经历，显示在「关于我」屏时间轴（可上下移动 / 置顶置底排序）"
                  actions={
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"} title="上移一位">↑ 上移</button>
                      <button type="button" disabled={idx === total - 1} onClick={() => move(idx, 1)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"} title="下移一位">↓ 下移</button>
                      <button type="button" disabled={idx === 0} onClick={() => moveEdge(idx, true)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"} title="移到最前">⤒ 置顶</button>
                      <button type="button" disabled={idx === total - 1} onClick={() => moveEdge(idx, false)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"} title="移到最后">⤓ 置底</button>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="!py-1 !px-2.5 text-xs rounded-xl border border-red-500/40 text-red-300 hover:bg-red-500/15 transition-all"
                      >
                        删除
                      </button>
                    </div>
                  }
                >
                  <TextField label="时间段" value={r.period} onChange={(v) => { const arr = [...draft.resume]; arr[idx] = { ...r, period: v }; set({ resume: arr }); }} hint="如 2024 – 2025" />
                  <BilingualField label="公司 / 单位" value={r.company} onChange={(v) => { const arr = [...draft.resume]; arr[idx] = { ...r, company: v }; set({ resume: arr }); }} />
                  <BilingualField label="职位 / 角色" value={r.title} onChange={(v) => { const arr = [...draft.resume]; arr[idx] = { ...r, title: v }; set({ resume: arr }); }} />
                  <BilingualField label="领域标签" value={r.label} onChange={(v) => { const arr = [...draft.resume]; arr[idx] = { ...r, label: v }; set({ resume: arr }); }} hint="如 电商视觉 / 空间设计" />
                  <div className="sm:col-span-2">
                    <BilingualField label="职责与成果" value={r.description} onChange={(v) => { const arr = [...draft.resume]; arr[idx] = { ...r, description: v }; set({ resume: arr }); }} />
                  </div>
                </Card>
                </React.Fragment>
              ));
            })()}
            <button
              type="button"
              onClick={() => {
                const arr = [
                  ...draft.resume,
                  {
                    num: "",
                    period: "",
                    company: { zh: "", en: "" },
                    title: { zh: "", en: "" },
                    label: { zh: "", en: "" },
                    description: { zh: "", en: "" },
                  },
                ].map((it, i) => ({ ...it, num: String(i + 1).padStart(2, "0") }));
                set({ resume: arr });
              }}
              className={btnGhost + " w-full !py-3 text-sm border-dashed border-white/20 hover:border-[#7621B0] hover:text-[#a459e6]"}
            >
              ＋ 添加工作经历
            </button>
          </div>
        );
      case "footer":
        return (
          <Card title="页脚" icon="flag" desc="网站底部品牌介绍、站点地图、联系方式、社交链接与版权，全部可编辑">
            <BilingualField label="一句话介绍" value={draft.footer.desc} onChange={(v) => set({ footer: { ...draft.footer, desc: v } })} />
            <BilingualField label="版权后缀" value={draft.footer.copyright} onChange={(v) => set({ footer: { ...draft.footer, copyright: v } })} />
            <BilingualField label="回到顶部文案" value={draft.footer.backToTopLabel || { zh: "回到顶部", en: "Back to Top" }} onChange={(v) => set({ footer: { ...draft.footer, backToTopLabel: v } })} />
            <BilingualField label="站点地图标题" value={draft.footer.sitemapTitle || { zh: "站点地图", en: "Sitemap" }} onChange={(v) => set({ footer: { ...draft.footer, sitemapTitle: v } })} />
            <FooterLinkEditor
              value={draft.footer.sitemap || []}
              onChange={(v) => set({ footer: { ...draft.footer, sitemap: v } })}
            />
            <BilingualField label="联系方式标题" value={draft.footer.contactTitle || { zh: "联系我", en: "Contact" }} onChange={(v) => set({ footer: { ...draft.footer, contactTitle: v } })} />
            <FooterContactEditor
              value={draft.footer.contacts || []}
              onChange={(v) => set({ footer: { ...draft.footer, contacts: v } })}
            />
            <BilingualField label="社交平台标题" value={draft.footer.socialTitle || { zh: "社交平台", en: "Social" }} onChange={(v) => set({ footer: { ...draft.footer, socialTitle: v } })} />
            <FooterSocialEditor
              value={draft.footer.socials || []}
              onChange={(v) => set({ footer: { ...draft.footer, socials: v } })}
            />
          </Card>
        );
      case "leads":
        return (
          <Card title="接单线索" icon="inbox" desc="前台「咨询」表单自动收集的客户意向，可标记跟进状态">
            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { k: "all", t: "全部" },
                    { k: "new", t: "新线索" },
                    { k: "contacted", t: "已联系" },
                    { k: "won", t: "已成交" },
                    { k: "lost", t: "已流失" },
                    { k: "duplicate", t: "重复" },
                  ].map((f) => (
                    <button
                      key={f.k}
                      type="button"
                      onClick={() => { setLeadFilter(f.k); setLeadPage(0); }}
                      className={
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all " +
                        (leadFilter === f.k ? "bg-[#7621B0] text-white" : "bg-white/5 text-white/55 hover:text-white hover:bg-white/10")
                      }
                    >
                      {f.t}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={loadLeads} disabled={leadsLoading} className={btnGhost + " !py-1.5 !px-3 text-xs"}>
                  {leadsLoading ? "刷新中…" : "立即刷新"}
                </button>
              </div>

              {leadsLoading && <p className="text-sm text-white/45">加载中…</p>}
              {leadsError && <p className="text-sm text-red-400">{leadsError}</p>}
              {!leadsLoading && !leadsError && leads.length === 0 && <p className="text-sm text-white/45">暂无线索。前台「咨询」按钮弹出的表单提交后会出现在这里。</p>}

              {!leadsLoading && filteredLeads.length > 0 && (
                <div className="flex flex-col gap-3">
                  {filteredLeads.map((l) => {
                    const st = STATUS_META[l.status] || STATUS_META.new;
                    return (
                      <div key={l.id} className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 hover:border-white/20 transition-colors">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5 text-sm min-w-0">
                            <span className="font-bold text-white truncate">{l.name || "匿名访客"}</span>
                            <span className="font-mono text-[#a459e6] truncate">{l.contact}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ color: st.color, background: st.color + "22" }}>
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: st.color }} />
                              {st.label}
                            </span>
                            <select
                              value={l.status}
                              onChange={(e) => updateLeadStatus(l.id, e.target.value).catch(() => loadLeads())}
                              className="px-2 py-1 rounded-lg text-[11px] bg-[#161a22] border border-white/15 text-white outline-none focus:border-[#7621B0]"
                              title="更新线索状态"
                            >
                              <option value="new">新线索</option>
                              <option value="contacted">已联系</option>
                              <option value="won">已成交</option>
                              <option value="lost">已流失</option>
                              <option value="duplicate">重复</option>
                            </select>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px]">
                          <span className="text-white/40">类目：<span className="text-white/85">{l.category || "—"}</span></span>
                          <span className="text-white/40">意向：<span className="text-white/85">{l.project || "—"}</span></span>
                          <span className="text-white/40">预算：<span className="text-white/85">{l.budget || "—"}</span></span>
                          <span className="text-white/40">来源：<span className="text-white/85">{l.source}</span></span>
                          <span className="text-white/40 ml-auto">{new Date(l.created_at).toLocaleString("zh-CN")}</span>
                        </div>
                        {l.message && <p className="mt-3 text-xs text-white/70 whitespace-pre-wrap break-words bg-white/[0.03] rounded-xl p-3 border border-white/5">{l.message}</p>}
                      </div>
                    );
                  })}
                </div>
              )}
              {/* 分页控件 */}
              {!leadsLoading && leadTotal > LEAD_PAGE_SIZE && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.07] text-[12px] text-white/50">
                  <span>共 {leadTotal} 条线索，第 {leadPage + 1} / {Math.ceil(leadTotal / LEAD_PAGE_SIZE)} 页</span>
                  <div className="flex gap-1.5">
                    <button type="button" disabled={leadPage === 0} onClick={() => setLeadPage((p) => p - 1)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"}>上一页</button>
                    <button type="button" disabled={leadPage * LEAD_PAGE_SIZE + LEAD_PAGE_SIZE >= leadTotal} onClick={() => setLeadPage((p) => p + 1)} className={btnGhost + " !py-1 !px-2 text-xs disabled:opacity-30"}>下一页</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0a0b0e] text-white flex">
      {/* ============ 左侧分组导航（页码式） ============ */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col h-full bg-[#0c0e12] border-r border-white/[0.07]">
        <div className="px-5 py-5 border-b border-white/[0.07] bg-gradient-to-b from-[#7621B0]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7621B0] to-[#1FD66E] grid place-items-center font-black text-white text-lg shadow-lg shadow-[#7621B0]/30">G</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white leading-tight truncate">{draft.brand?.nameZh} · {draft.brand?.titleZh}</p>
              <p className="text-[10px] text-white/45 leading-tight">内容管理后台</p>
            </div>
          </div>
        </div>

        <nav className="admin-scroll flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-5">
          {/* 侧边栏就地编辑菜单文字开关 */}
          <button
            type="button"
            onClick={() => { setNavEditMode((v) => !v); setEditingNav(null); }}
            className={
              "flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all " +
              (navEditMode
                ? "bg-[#7621B0]/20 text-white border-[#7621B0]/50"
                : "text-white/45 border-white/10 hover:text-white hover:bg-white/5")
            }
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            {navEditMode ? "完成编辑" : "编辑菜单文字"}
          </button>

          {sortedNavGroups.map((g) => {
            const moveItem = (itemId: string, dir: -1 | 1) => {
              const currentItems = g.items;
              const idx = currentItems.findIndex((n) => n.id === itemId);
              const j = idx + dir;
              if (idx < 0 || j < 0 || j >= currentItems.length) return;
              const nextGroupItems = [...currentItems];
              [nextGroupItems[idx], nextGroupItems[j]] = [nextGroupItems[j], nextGroupItems[idx]];
              const nextOrder: string[] = [];
              sortedNavGroups.forEach((sg) => {
                if (sg.id === g.id) {
                  nextOrder.push(...nextGroupItems.map((n) => n.id));
                } else {
                  nextOrder.push(...sg.items.map((n) => n.id));
                }
              });
              set({ adminNavOrder: nextOrder });
            };
            return (
              <div key={g.id}>
                <button
                  type="button"
                  onClick={() => toggleGroup(g.id)}
                  className="w-full flex items-center justify-between px-3 mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-[var(--c-accent)] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--c-accent)]/70" />
                    {pick(g.label, language)}
                  </span>
                  <span className="flex items-center gap-1">
                    {navEditMode && (
                      <span
                        title="编辑分组标题"
                        onClick={(e) => { e.stopPropagation(); const gi = sortedNavGroups.findIndex((sg) => sg.id === g.id); setEditingNav({ kind: "group", gi }); }}
                        className="grid place-items-center w-5 h-5 rounded-md text-[#a459e6] hover:text-white hover:bg-[#7621B0]/40"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                      </span>
                    )}
                    <svg viewBox="0 0 24 24" className={"w-3.5 h-3.5 transition-transform " + (collapsed[g.id] ? "-rotate-90" : "")} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </span>
                </button>
                {!collapsed[g.id] && (
                  <div className="flex flex-col gap-0.5">
                    {g.items.map((n, idx) => {
                      const isActive = active === n.id;
                      const canUp = idx > 0;
                      const canDown = idx < g.items.length - 1;
                      return (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => setActive(n.id)}
                          className={
                            "group flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all text-left " +
                            (isActive ? "bg-[#7621B0]/15 text-white" : "text-white/55 hover:text-white hover:bg-white/5")
                          }
                        >
                          <span className={"transition-colors " + (isActive ? "text-[#a459e6]" : "text-white/35 group-hover:text-white/70")}>
                            <Icon name={n.icon} className="w-[18px] h-[18px]" />
                          </span>
                          <span className="font-medium flex-1 truncate">{pick(n.label, language)}</span>
                          <span className="flex items-center gap-0.5">
                            {navEditMode && (
                              <span
                                title="编辑菜单文字"
                                onClick={(e) => { e.stopPropagation(); const gi = sortedNavGroups.findIndex((sg) => sg.id === g.id); const ii = g.items.findIndex((it) => it.id === n.id); setEditingNav({ kind: "item", gi, ii }); }}
                                className="grid place-items-center w-5 h-5 rounded-md text-[#a459e6] hover:text-white hover:bg-[#7621B0]/40 cursor-pointer"
                              >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                              </span>
                            )}
                            <span className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span
                              title="上移"
                              onClick={(e) => { e.stopPropagation(); moveItem(n.id, -1); }}
                              className={"grid place-items-center w-5 h-5 rounded-md text-white/50 hover:text-white hover:bg-white/10 " + (canUp ? "cursor-pointer" : "opacity-20 pointer-events-none")}
                            >
                              ↑
                            </span>
                            <span
                              title="下移"
                              onClick={(e) => { e.stopPropagation(); moveItem(n.id, 1); }}
                              className={"grid place-items-center w-5 h-5 rounded-md text-white/50 hover:text-white hover:bg-white/10 " + (canDown ? "cursor-pointer" : "opacity-20 pointer-events-none")}
                            >
                              ↓
                            </span>
                            </span>
                          </span>
                          {isActive && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-[#1FD66E]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="px-5 py-4 border-t border-white/[0.07] text-[10px] text-white/35 leading-relaxed">
          修改即写回网站 · 刷新前台即可见
          <br />
          无需代码 · 一人即可维护
        </div>
      </aside>

      {/* ============ 右侧主区（整页不滚动，仅内部滚动） ============ */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* 顶栏：页码 + 面包屑 + 查看前台 + 保存 */}
        <header className="shrink-0 bg-[#0a0b0e]/80 backdrop-blur-xl border-b border-white/[0.07] px-5 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-white/40 tabular-nums">
              第 <span className="text-[#a459e6]">{String(sortedNavFlat.findIndex((n) => n.id === active) + 1).padStart(2, "0")}</span> / {String(sortedNavFlat.length).padStart(2, "0")} 页
            </span>
            <span className="text-white/20 hidden sm:block">|</span>
            <span className="font-bold text-sm text-white truncate">{activeLabel}</span>
            {dirty && (
              <span className="flex items-center gap-1.5 text-[11px] text-amber-400 shrink-0 px-2 py-0.5 rounded-full bg-amber-400/10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                有未保存修改
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a href="/" target="_blank" rel="noreferrer" className={btnGhost}>
              查看前台 ↗
            </a>
            {msg && <span className={"text-xs max-w-[38vw] truncate " + (msg.startsWith("✅") ? "text-[#1FD66E]" : "text-red-400")}>{msg}</span>}
            <button onClick={onSave} disabled={saving} className={btnPrimary}>
              {saving ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  保存中…
                </>
              ) : (
                "保存全部"
              )}
            </button>
          </div>
        </header>

        {/* 移动端：横向滚动页码导航 */}
        <div className="md:hidden shrink-0 bg-[#0a0b0e]/90 backdrop-blur border-b border-white/[0.07] px-3 py-2 flex gap-2 overflow-x-auto admin-scroll">
          {sortedNavFlat.map((n) => {
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => setActive(n.id)}
                className={
                  "whitespace-nowrap text-xs px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 " +
                  (active === n.id ? "bg-[#7621B0] text-white border-[#7621B0]" : "border-white/10 text-white/55")
                }
              >
                {pick(n.label, language)}
              </button>
            );
          })}
        </div>

        {/* 当前页内容（内部滚动，整页不下拉） */}
        <main className="flex-1 overflow-y-auto admin-scroll">
          <div className="max-w-5xl mx-auto w-full px-5 py-6">
            {renderSection(active)}
            <div className="h-10" />
          </div>
        </main>

        {/* 侧边栏菜单文字就地编辑弹窗 */}
        {editingNav && (
          <NavLabelEditModal
            title={editingNav.kind === "group" ? `编辑分组标题：${pick(sortedNavGroups[editingNav.gi]?.label, language)}` : `编辑菜单文字：${pick(sortedNavGroups[editingNav.gi]?.items[editingNav.ii ?? 0]?.label, language)}`}
            value={
              editingNav.kind === "group"
                ? sortedNavGroups[editingNav.gi]?.label || { zh: "", en: "" }
                : sortedNavGroups[editingNav.gi]?.items[editingNav.ii ?? 0]?.label || { zh: "", en: "" }
            }
            onSave={(v) => {
              updateAdminNavLabel(editingNav.gi, editingNav.kind === "group" ? null : editingNav.ii ?? 0, v);
              setEditingNav(null);
            }}
            onClose={() => setEditingNav(null)}
          />
        )}
      </div>
    </div>
  );
}

// hotfix-rebuild-trigger
