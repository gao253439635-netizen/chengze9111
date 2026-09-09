import React, { useRef, useEffect, useState } from "react";
import SectionTitle from "./SectionTitle";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";

export default function MarqueeSection() {
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  const images = (config.worksGallery || []).map((it) => (typeof it === "string" ? it : it.url)).filter(Boolean);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;

      // Exact scroll offset formula requested
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial state

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const half = Math.ceil(images.length / 2);
  const row1Images = images.slice(0, half);
  const row2Images = images.slice(half);

  // Tripled lists for seamless scrolling coverage
  const tripledRow1 = [...row1Images, ...row1Images, ...row1Images];
  const tripledRow2 = [...row2Images, ...row2Images, ...row2Images];

  return (
    <section
      ref={sectionRef}
      id="marquee-section"
      className="relative w-full bg-white pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden z-20"
    >
      {/* Optional Large Branding Heading（统一区块标题组件） */}
      <div className="px-5 sm:px-8 md:px-10">
        <SectionTitle
          title={config.sections.works}
          eyebrow={language === "zh" ? "精选作品" : "SELECTED WORKS"}
          language={language}
        />
      </div>

      {/* Marquee Rows Container */}
      <div className="flex flex-col gap-3 w-full">
        {/* Row 1: Moves RIGHT on scroll */}
        <div className="w-full overflow-hidden select-none">
          <div
            style={{
              transform: `translateX(${scrollOffset - 300}px)`,
              willChange: "transform",
            }}
            className="flex gap-3 transition-transform duration-75 ease-out"
          >
            {tripledRow1.map((url, index) => (
              <div
                key={`r1-${index}`}
                className="flex-shrink-0 w-[78vw] max-w-[420px] aspect-[420/270] md:w-[420px] md:h-[270px] rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Marquee item ${index}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Moves LEFT on scroll */}
        <div className="w-full overflow-hidden select-none">
          <div
            style={{
              transform: `translateX(${-(scrollOffset - 300)}px)`,
              willChange: "transform",
            }}
            className="flex gap-3 transition-transform duration-75 ease-out"
          >
            {tripledRow2.map((url, index) => (
              <div
                key={`r2-${index}`}
                className="flex-shrink-0 w-[78vw] max-w-[420px] aspect-[420/270] md:w-[420px] md:h-[270px] rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] bg-gray-50"
              >
                <img
                  src={url}
                  alt={`Marquee item ${index}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
