import React, { Fragment } from "react";
import FadeIn from "./FadeIn";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";

/**
 * 接单服务屏（人 + AI 接单类目）
 * 设计目标：统一等宽等高网格，任意数量（3/4/5/6…）都整齐对称、满屏舒服。
 * 每个类目卡片结构一致（图块 + 编号 + 名称 + 说明 + 查看案例），点击跳对应作品集分类。
 */
export default function ServicesSection({ onContactClick }: { onContactClick?: () => void }) {
  const { language } = useLanguage();
  const { config } = useSiteConfig();
  const cats = config.serviceCats || [];

  const goTo = (link?: string) => {
    if (link) {
      window.location.href = link;
    } else {
      onContactClick?.();
    }
  };

  return (
    <section
      id="services-section"
      className="relative w-full bg-white py-20 sm:py-24 md:py-32 px-5 sm:px-8 md:px-10 z-20"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Header Block（统一区块标题组件） */}
        <SectionTitle
          title={config.sections.services}
          eyebrow={language === "zh" ? "我能接的单" : "WHAT I OFFER"}
          desc={
            language === "zh"
              ? "人 + AI 双引擎交付。点开任意类目看作品预览，满意再发需求。"
              : "Human + AI dual-engine delivery. Tap any category to preview the work, then send your brief."
          }
          language={language}
        />

        {/* 接单服务：统一等宽等高网格，任意数量都整齐对称 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {cats.map((cat, i) => {
            const name = pick(cat.name, language) || (language === "zh" ? "新类目" : "New Category");
            const desc = pick(cat.desc, language);
            const num = String(i + 1).padStart(2, "0");
            const ratioClass = cat.imageRatio === "4:3" ? "aspect-[4/3]" : cat.imageRatio === "5:4" ? "aspect-[5/4]" : "aspect-video";
            return (
              <Fragment key={i}>
                <FadeIn delay={0.05 * i} y={30} className="h-full">
                  <button
                    type="button"
                    onClick={() => goTo(cat.link)}
                    className="group relative w-full h-full text-left overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-2xl hover:border-[var(--c-accent)]/40 transition-all duration-300 flex flex-col"
                  >
                    {/* 图块（固定高度，保证同行卡片视觉一致） */}
                    <div className={"relative overflow-hidden bg-gradient-to-br from-[var(--c-accent)] to-[var(--c-dot)] " + ratioClass + " w-full shrink-0"}>
                      {cat.image ? (
                        <img
                          src={cat.image}
                          alt={name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white/90 font-black text-3xl sm:text-4xl tracking-wider drop-shadow transition-transform duration-500 group-hover:scale-105">
                            {name}
                          </span>
                        </div>
                      )}
                      {/* 编号徽章 */}
                      <span className="absolute top-4 left-4 text-white/80 font-black text-2xl tracking-wider drop-shadow">
                        {num}
                      </span>
                    </div>

                    {/* 内容块（flex-1 + mt-auto 让「查看案例」底部对齐，长短不一也整齐） */}
                    <div className="flex flex-col p-6 sm:p-7 flex-1">
                      <h3 className="text-[var(--c-ink)] font-bold text-xl sm:text-2xl leading-tight">
                        {name}
                      </h3>
                      <p className="mt-3 text-sm text-[var(--c-ink)]/60 leading-relaxed">
                        {desc}
                      </p>
                      <div className="mt-auto pt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--c-accent)]">
                        {language === "zh" ? "查看案例" : "View Cases"}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </div>
                    </div>
                  </button>
                </FadeIn>
              </Fragment>
            );
          })}
        </div>
      </div>
    </section>
  );
}
