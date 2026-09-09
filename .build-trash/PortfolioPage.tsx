import React, { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";

export default function PortfolioPage() {
  const { language } = useLanguage();
  const { config } = useSiteConfig();
  const pf = config.portfolio;

  // 支持 ?cat=<id> 深链预选：服务卡点击后直达对应分类
  const validIds = ["all", ...pf.categories.map((c) => c.id)];
  const initialCat = (() => {
    const q = new URLSearchParams(window.location.search).get("cat");
    return q && validIds.includes(q) ? q : "all";
  })();
  const [active, setActive] = useState<string>(initialCat);

  const tabs = [{ id: "all", name: { zh: "全部", en: "All" } }, ...pf.categories.map((c) => ({ id: c.id, name: c.name }))];

  const goHome = () => {
    window.location.href = "/";
  };

  // 当前要展示的类目
  const visibleCats =
    active === "all" ? pf.categories : pf.categories.filter((c) => c.id === active);

  return (
    <div className="relative min-h-screen w-full bg-white text-[var(--c-ink)] font-sans selection:bg-[var(--c-accent)] selection:text-white overflow-x-clip">
      {/* 顶栏 */}
      <header className="sticky top-0 z-30 w-full bg-white/85 backdrop-blur-xl border-b border-[var(--c-ink)]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="font-black text-lg tracking-wider uppercase truncate">
              {config.brand.nameZh} · {config.brand.titleZh}
            </span>
            <span className="w-2 h-2 rounded-full bg-[var(--c-dot)] shrink-0" />
          </div>
          <button
            onClick={goHome}
            className="inline-flex items-center gap-1.5 rounded-full border border-[var(--c-ink)]/15 px-4 py-2 text-sm font-medium text-[var(--c-ink)]/80 hover:bg-[var(--c-ink)] hover:text-white transition-colors shrink-0"
          >
            ← {language === "zh" ? "返回首页" : "Back to Site"}
          </button>
        </div>
      </header>

      {/* 头图区 */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 pt-14 sm:pt-20 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--c-accent)] mb-3">
          PORTFOLIO
        </p>
        <h1 className="text-[var(--c-ink)] font-black tracking-tight text-5xl md:text-6xl lg:text-7xl">
          {pick(pf.title, language)}
        </h1>
        <p className="mt-5 text-base md:text-lg font-light leading-relaxed text-[var(--c-ink)]/65 max-w-2xl">
          {pick(pf.subtitle, language)}
        </p>
      </section>

      {/* 筛选 tabs */}
      <div className="sticky top-16 z-20 bg-white/85 backdrop-blur-xl border-b border-[var(--c-ink)]/10">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-3 flex flex-wrap gap-2">
          {tabs.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={
                  "px-4 py-2 rounded-full text-sm font-medium transition-all " +
                  (isActive
                    ? "bg-[var(--c-accent)] text-white shadow-lg shadow-[var(--c-accent)]/25"
                    : "bg-[var(--c-ink)]/[0.04] text-[var(--c-ink)]/70 hover:bg-[var(--c-ink)]/10")
                }
              >
                {pick(t.name, language)}
              </button>
            );
          })}
        </div>
      </div>

      {/* 作品网格 */}
      <main className="max-w-7xl mx-auto px-5 sm:px-8 md:px-10 py-10 sm:py-14">
        {visibleCats.map((cat) => (
          <div key={cat.id} className="mb-12 last:mb-0">
            {active === "all" && (
              <div className="mb-7">
                <div className="flex items-end justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--c-ink)]">
                    {pick(cat.name, language)}
                  </h2>
                  <span className="text-xs font-medium text-[var(--c-ink)]/40 tabular-nums shrink-0">
                    {cat.items.length} 张
                  </span>
                </div>
                <p className="mt-2 text-sm md:text-[15px] font-light leading-relaxed text-[var(--c-ink)]/60 max-w-2xl">
                  {pick(cat.desc, language)}
                </p>
                <span className="mt-4 block h-px w-full bg-[var(--c-ink)]/10" />
              </div>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {cat.items.map((it, i) => (
                <figure
                  key={i}
                  className="group relative overflow-hidden rounded-2xl border border-[var(--c-ink)]/10 bg-[var(--c-ink)]/[0.02] aspect-[4/3] transition-all duration-300 hover:shadow-[0_22px_55px_rgba(12,12,12,0.10)]"
                >
                  {it.src ? (
                    <img
                      src={it.src}
                      alt={pick(it.title, language)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[var(--c-accent)]/[0.06] to-[var(--c-dot)]/[0.06] text-[var(--c-ink)]/30">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} className="w-9 h-9">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <path d="M21 15l-5-5L5 21" />
                      </svg>
                      <span className="text-[11px] tracking-wide">待上传</span>
                    </div>
                  )}
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2.5 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {pick(it.title, language)}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}

        {visibleCats.length === 0 && (
          <p className="text-center text-[var(--c-ink)]/40 py-20">暂无作品，请在后台「作品集」页上传。</p>
        )}
      </main>

      <footer className="w-full border-t border-[var(--c-ink)]/10 py-10 px-5 sm:px-8 md:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="font-black text-base tracking-wider uppercase">
            {config.brand.nameZh} · {config.brand.titleZh}
          </span>
          <span className="text-[11px] font-light text-[var(--c-ink)]/40 uppercase tracking-widest">
            © {new Date().getFullYear()} {config.brand.nameZh} · {pick(config.footer.copyright, language)}
          </span>
        </div>
      </footer>
    </div>
  );
}
