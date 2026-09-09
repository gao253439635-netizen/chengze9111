import React, { useState, useEffect } from "react";
import HeroSection from "./components/HeroSection";
import MarqueeSection from "./components/MarqueeSection";
import ResumeAchievementsSection from "./components/ResumeAchievementsSection";
import ServicesSection from "./components/ServicesSection";
import ContactModal from "./components/ContactModal";
import { useLanguage } from "./context/LanguageContext";
import { useSiteConfig, pick } from "./config/SiteConfigContext";
import { navLabel, goNavLink } from "./config/siteConfig";
import {
  Github,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Dribbble,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  ArrowUp,
  Sparkles,
} from "lucide-react";

export default function App() {
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  // Set page title & track scroll height for Back to Top trigger
  useEffect(() => {
    document.title = `${config.brand.nameZh} · ${config.brand.titleZh} — ${pick(config.footer.desc, language)}`;

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [language, config]);

  // Simple clock logic for UTC time in the footer (humble, literal labeling)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, "0");
      const minutes = String(now.getUTCMinutes()).padStart(2, "0");
      const seconds = String(now.getUTCSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-[var(--c-ink)] font-sans selection:bg-[var(--c-accent)] selection:text-white overflow-x-clip">

      {/* SECTION 1: GSAP Pinned Video Hero */}
      <HeroSection />

      {/* SECTION 2: Horizontal Scrolling GIF Portfolio Marquee */}
      <MarqueeSection />

      {/* SECTION 3: 接单服务（人+AI 接单类目） */}
      <ServicesSection onContactClick={() => setIsContactOpen(true)} />

      {/* SECTION 4: Resume & Major Achievements List */}
      <ResumeAchievementsSection />

      {/* FOOTER: White clean editorial treatment */}
      <footer className="w-full bg-white border-t border-gray-100 py-16 px-5 sm:px-8 md:px-10 z-20 relative">
        {(() => {
          const sitemap =
            config.footer?.sitemap && config.footer.sitemap.length > 0
              ? config.footer.sitemap
              : [
                  { label: { zh: "回到顶部", en: "Back to Top" }, link: "#hero-section" },
                  ...(config.navOrder || ["works", "services", "about"])
                    .filter((k) => config.nav[k])
                    .map((k) => ({ label: config.nav[k].label, link: config.nav[k].link })),
                ];
          const contacts =
            config.footer?.contacts && config.footer.contacts.length > 0
              ? config.footer.contacts
              : [
                  ...(config.contact?.wechat ? [{ type: "wechat" as const, label: { zh: "微信", en: "WeChat" }, value: config.contact.wechat, qrImage: "" }] : []),
                  ...(config.contact?.email ? [{ type: "email" as const, label: { zh: "邮箱", en: "Email" }, value: config.contact.email, qrImage: "" }] : []),
                  ...(config.contact?.phone ? [{ type: "phone" as const, label: { zh: "电话", en: "Phone" }, value: config.contact.phone, qrImage: "" }] : []),
                ];
          const socials =
            config.footer?.socials && config.footer.socials.length > 0
              ? config.footer.socials
              : [
                  ...(config.social?.github ? [{ platform: "github", url: config.social.github }] : []),
                  ...(config.social?.twitter ? [{ platform: "twitter", url: config.social.twitter }] : []),
                  ...(config.social?.linkedin ? [{ platform: "linkedin", url: config.social.linkedin }] : []),
                ];
          const socialIcon = (platform: string) => {
            const map: Record<string, React.ComponentType<{ size?: number }>> = {
              github: Github,
              twitter: Twitter,
              x: Twitter,
              linkedin: Linkedin,
              instagram: Instagram,
              youtube: Youtube,
              dribbble: Dribbble,
            };
            return map[platform.toLowerCase()] || Globe;
          };
          const contactIcon = (type: string) => {
            const map: Record<string, React.ComponentType<{ size?: number }>> = {
              email: Mail,
              phone: Phone,
              wechat: MessageCircle,
              custom: Globe,
            };
            return map[type] || Globe;
          };
          const contactHref = (type: string, value: string) => {
            if (type === "email") return `mailto:${value}`;
            if (type === "phone") return `tel:${value}`;
            return undefined;
          };
          return (
            <div className="max-w-7xl mx-auto">

              {/* Top: three balanced columns with dividers */}
              <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-100">

                {/* Branding */}
                <div className="flex flex-col gap-4 md:pr-12 pb-10 md:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl tracking-wider uppercase text-[var(--c-ink)]">
                      {config.brand.nameZh} · {config.brand.titleZh}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[var(--c-dot)]"></span>
                  </div>
                  <p className="text-sm font-light leading-relaxed text-[var(--c-ink)]/60 tracking-wide max-w-xs">
                    {pick(config.footer?.desc, language)}
                  </p>
                </div>

                {/* Sitemap */}
                <div className="flex flex-col gap-4 md:px-12 pb-10 md:pb-0">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--c-accent)]">
                    {pick(config.footer?.sitemapTitle, language) || t.platformMap}
                  </span>
                  <ul className="grid grid-cols-3 gap-x-8 gap-y-2 text-left">
                    {sitemap.map((it, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => goNavLink(it.link)}
                          className="text-[13px] font-medium text-[var(--c-ink)]/70 hover:text-[var(--c-accent)] transition-colors"
                        >
                          {pick(it.label, language)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-4 md:pl-12">
                  <div className="flex items-start gap-5">
                    {(() => {
                      const qr = contacts.find((c) => c.type === "wechat" && c.qrImage)?.qrImage;
                      return qr ? (
                        <div className="flex flex-col items-center gap-1.5 shrink-0">
                          <img
                            src={qr}
                            alt="WeChat QR"
                            className="w-28 h-28 object-contain rounded-lg border border-gray-200 bg-white shadow-sm"
                          />
                          <span className="text-[10px] text-[var(--c-ink)]/45">扫码加微信</span>
                        </div>
                      ) : null;
                    })()}
                    <div className="flex flex-col gap-4">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--c-accent)]">
                        {pick(config.footer?.contactTitle, language) || "联系我"}
                      </span>
                      <ul className="flex flex-col gap-2.5">
                        {contacts.map((c, idx) => {
                          const Icon = contactIcon(c.type);
                          const href = contactHref(c.type, c.value);
                          const body = (
                            <span className="inline-flex items-center gap-2 text-[13px] text-[var(--c-ink)]/65">
                              <Icon size={15} className="text-[var(--c-ink)]/45 shrink-0" />
                              <span>
                                {pick(c.label, language)}：<span className="text-[var(--c-ink)]/80">{c.value}</span>
                              </span>
                            </span>
                          );
                          return (
                            <li key={idx}>
                              {href ? (
                                <a href={href} className="hover:text-[var(--c-accent)] transition-colors">
                                  {body}
                                </a>
                              ) : (
                                body
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom metabar */}
              <div className="mt-12 border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <span className="text-[11px] font-light text-[var(--c-ink)]/45 uppercase tracking-widest text-center sm:text-left">
                  © {new Date().getFullYear()} {config.brand.nameZh} · {config.brand.titleZh}. {pick(config.footer.copyright, language)}
                </span>
                <div className="flex items-center gap-5">
                  {socials.length > 0 && (
                    <div className="flex items-center gap-4 text-[var(--c-ink)]/55">
                      {socials.map((s, idx) => {
                        const Icon = socialIcon(s.platform);
                        return (
                          <a
                            key={idx}
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[var(--c-accent)] transition-colors"
                            aria-label={s.platform}
                          >
                            <Icon size={17} />
                          </a>
                        );
                      })}
                    </div>
                  )}
                  <div className={`flex items-center gap-2 font-mono text-[11px] text-[var(--c-ink)]/50 ${socials.length > 0 ? "border-l border-gray-200 pl-5" : ""}`}>
                    <Globe size={12} className="text-[var(--c-accent)]" />
                    <span>{currentTime || "00:00:00 UTC"}</span>
                  </div>
                </div>
              </div>
            </div>
      )
      })()}
      </footer>

      {/* Float Actions: Back to Top */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--c-ink)] text-white border border-[var(--c-ink)] shadow-lg hover:bg-white hover:text-[var(--c-ink)] hover:shadow-xl transition-all z-40 group"
          aria-label="Scroll to top"
        >
          <ArrowUp size={18} className="transition-transform duration-300 group-hover:-translate-y-1" />
        </button>
      )}

      {/* Global Interactive Modals */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </div>
  );
}
