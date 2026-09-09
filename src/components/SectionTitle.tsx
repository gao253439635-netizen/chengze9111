import React from "react";
import FadeIn from "./FadeIn";
import { pick, useSiteConfig } from "../config/SiteConfigContext";
import type { Bilingual } from "../config/siteConfig";
import type { Language } from "../context/LanguageContext";

// 字体风格 → 实际 font-family 栈（中文环境优先本地字体）
const FAMILY: Record<string, string> = {
  sans: '-apple-system, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", system-ui, sans-serif',
  serif: '"Songti SC", "SimSun", "Noto Serif SC", Georgia, serif',
  rounded: '"Yuanti SC", "Hiragino Sans GB", "PingFang SC", "Microsoft YaHei", sans-serif',
  mono: '"JetBrains Mono", "SFMono-Regular", Menlo, Consolas, monospace',
};

// 响应式字号：以 base(vw) 为基准、按 scale 整体缩放，clamp 限制上下限（移动端不过大、桌面不过小）
const sizeClamp = (base: number, scale: number) =>
  `clamp(${(base * 0.36 * scale).toFixed(2)}rem, ${(base * scale).toFixed(2)}vw, ${(base * 0.78 * scale).toFixed(2)}rem)`;

interface SectionTitleProps {
  title: Bilingual;
  /** 强调色小标签文字（接单服务风） */
  eyebrow: string;
  language: Language;
  /** 右侧描述（可选，接单服务屏使用） */
  desc?: string;
}

/**
 * 统一的区块标题（接单服务风）：
 * 强调色 eyebrow + 超大标题(vw 响应式) + 斜杠/圆点点缀 + 可选右侧描述。
 * 字体（风格/字重/大小/字间距）由后台「区块标题」配置驱动，全站即时同步。
 */
export default function SectionTitle({ title, eyebrow, language, desc }: SectionTitleProps) {
  const { config } = useSiteConfig();
  const f = config.sectionTitleFont ?? { family: "sans", weight: 900, scale: 1, letterSpacing: -0.02 };
  const fontFamily = FAMILY[f.family] || FAMILY.sans;

  const titleStyle: React.CSSProperties = {
    fontFamily,
    fontWeight: f.weight || 900,
    letterSpacing: `${f.letterSpacing ?? -0.02}em`,
    fontSize: sizeClamp(7, f.scale ?? 1),
    lineHeight: 1.0,
  };
  const accentStyle: React.CSSProperties = {
    fontFamily,
    fontWeight: f.weight || 900,
    color: "var(--c-accent)",
    fontSize: sizeClamp(3, f.scale ?? 1),
  };

  return (
    <div className="mb-12 sm:mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <FadeIn delay={0.1} y={40}>
        <div className="flex flex-col gap-4">
          <span
            className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--c-accent)]"
            style={{ fontFamily }}
          >
            {eyebrow}
          </span>
          <div className="flex items-center gap-3">
            <h2 className="text-[var(--c-ink)] uppercase" style={titleStyle}>
              {pick(title, language)}
            </h2>
            <span className="font-light -ml-2 hidden sm:inline" style={accentStyle}>/</span>
            <span className="w-3 h-3 rounded-full bg-[var(--c-dot)] shadow-[0_0_8px_var(--c-dot)] mb-1 hidden sm:inline-block" />
          </div>
        </div>
      </FadeIn>
      {desc && (
        <FadeIn delay={0.2} y={20}>
          <p className="text-[var(--c-ink)]/50 text-sm font-light max-w-sm md:text-right leading-relaxed">
            {desc}
          </p>
        </FadeIn>
      )}
    </div>
  );
}
