import React from "react";
import FadeIn from "./FadeIn";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";

export default function ResumeAchievementsSection() {
  const { language } = useLanguage();
  const { config } = useSiteConfig();

  const RESUME_DATA = config.resume;

  return (
    <section
      id="resume-section"
      className="relative w-full bg-white py-20 sm:py-24 md:py-28 px-5 sm:px-8 md:px-10 z-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Section heading（统一区块标题组件） */}
        <SectionTitle
          title={config.sections.about}
          eyebrow={language === "zh" ? "关于我" : "ABOUT"}
          language={language}
        />

        {/* Top band: 个人简介 + 核心能力 / 学历（两栏等高对称卡片） */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6 mb-14 md:mb-16 items-stretch">
          <div className="md:col-span-7 h-full rounded-2xl border border-[var(--c-ink)]/10 bg-white p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)] mb-4">个人简介</p>
            <p className="text-base md:text-lg font-light leading-relaxed text-[var(--c-ink)]/75">
              {pick(config.aboutBio, language)}
            </p>
          </div>
          <div className="md:col-span-5 h-full rounded-2xl border border-[var(--c-ink)]/10 bg-white p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)] mb-4">核心能力</p>
              <div className="flex flex-wrap gap-2">
                {config.serviceCats.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-[13px] font-medium bg-[var(--c-accent)]/10 text-[var(--c-accent)]"
                  >
                    {pick(c.name, language)}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)] mt-4 md:mt-0 mb-4">学历 / 证书</p>
              <p className="text-sm md:text-base font-light leading-relaxed text-[var(--c-ink)]/70">
                {pick(config.aboutMeta, language)}
              </p>
            </div>
          </div>
        </div>

        {/* Work experience grid heading */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--c-accent)] mb-2">WORK EXPERIENCE</p>
            <h3 className="text-3xl md:text-4xl font-black text-[var(--c-ink)] tracking-tight">工作经历</h3>
          </div>
          <span className="text-sm text-[var(--c-ink)]/40 tabular-nums">{RESUME_DATA.length} 段经历</span>
        </div>

        {/* Symmetric 12-card grid: 1 / 2 / 3 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {RESUME_DATA.map((item, idx) => (
            <React.Fragment key={item.num}>
              <FadeIn delay={Math.min(idx * 0.04, 0.4)} y={16}>
                <div className="group relative flex h-full flex-col rounded-2xl border border-[var(--c-ink)]/10 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--c-accent)]/40 hover:shadow-[0_22px_55px_rgba(12,12,12,0.07)]">
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold text-[var(--c-ink)]/30 tabular-nums">{item.num}</span>
                    <span className="rounded-full bg-[var(--c-accent)]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--c-accent)]">
                      {pick(item.label, language)}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] font-medium text-[var(--c-ink)]/55 tabular-nums">{item.period}</p>
                  <h3 className="mt-1 text-lg font-bold leading-snug tracking-tight text-[var(--c-ink)]">
                    {pick(item.company, language)}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--c-ink)]/60">{pick(item.title, language)}</p>
                  <p className="mt-3 text-[13.5px] font-light leading-relaxed text-[var(--c-ink)]/70">
                    {pick(item.description, language)}
                  </p>
                </div>
              </FadeIn>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
