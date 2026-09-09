import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Magnet from "./Magnet";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";
import { navLabel, goNavLink } from "../config/siteConfig";
import { useMagnet } from "../context/MagnetContext";

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const { language, setLanguage } = useLanguage();
  const { config } = useSiteConfig();
  const { open: openMagnet } = useMagnet();
  const scrubCfg = config.hero.videoScrub;
  const scrubMode = scrubCfg?.mode ?? "move"; // 缺省回退 move，兼容旧配置
  const isWheelMode = scrubMode === "wheel";
  const isLoopMode = scrubMode === "loop";
  const [hintVisible, setHintVisible] = useState(true);
  // 仅在「支持悬停的鼠标设备」且未开启「减弱动效」时启用鼠标互动；手机/触屏回退自动循环
  const scrubActive =
    !!scrubCfg?.enabled &&
    typeof window !== "undefined" &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const containerRef = useRef<HTMLDivElement>(null);

  // 循环播放条件：明确选 loop，或（非滚轮模式 且 未启用鼠标互动回退）——手机 / 触屏 / 减弱动效时回退循环
  const useVideoLoop = isLoopMode || (!isWheelMode && !scrubActive);

  // 互动提示文案 / 图标：滚轮模式与鼠标跟随模式不同
  const scrubAxis = scrubCfg?.axis ?? "y";
  const hintText = isWheelMode
    ? "滚动鼠标滚轮，逐帧探索"
    : scrubAxis === "x"
    ? "左右滑动鼠标，画面随你而动"
    : scrubAxis === "y"
    ? "上下滑动鼠标，画面随你而动"
    : "滑动鼠标，画面随你而动";
  const hintIconPath = isWheelMode
    ? "M9 3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z M12 7v3"
    : scrubAxis === "x"
    ? "M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4"
    : scrubAxis === "y"
    ? "M12 3v18M8 7l4-4 4-4M8 17l4 4 4-4"
    : "M12 3v18M3 12h18";
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const videoBgRef = useRef<HTMLVideoElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accentGroupRef = useRef<HTMLDivElement>(null);

  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => scrollToSection("services-section");

  useEffect(() => {
    // 背景视频淡入
    if (videoBgRef.current) {
      gsap.fromTo(
        videoBgRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isWheelMode) {
      // 滚轮逐帧模式下不做页面滚动驱动的 pin 动画，改由滚轮直接控制视频
      return;
    }

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const pinSpacerHeight = isMobile ? "+=150%" : "+=180%";

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: pinSpacerHeight,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 1. At progress 0 to 0.25: h1 slides up & fades in（标题为空时不渲染，跳过动画）
      if (headingRef.current) {
        tl.fromTo(
          headingRef.current,
          { yPercent: 35, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: "none", duration: 0.25 },
          0
        );
      }

      // 2. At progress 0.45 to 0.75: thin purple vertical accent and tiny green dot appear near paragraph
      tl.fromTo(
        accentGroupRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, ease: "none", duration: 0.3 },
        0.45
      );

      // 3. At progress 0.75 to 1: the entire hero content slides upward yPercent -100 for clean transition
      tl.to(
        contentWrapperRef.current,
        {
          yPercent: -100,
          ease: "none",
          duration: 0.25,
        },
        0.75
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

    // 鼠标滑动 → 背景视频按帧 scrub（move 模式）
  useEffect(() => {
    const video = videoBgRef.current;
    const hero = containerRef.current;
    if (!video || !hero || !scrubActive) return;
    // 仅「鼠标跟随(move)」模式绑定鼠标逻辑；滚轮 / 循环模式不绑定
    if (scrubMode !== "move") return;
    const cfg = config.hero.videoScrub;
    if (!cfg) return;

    let raf = 0;
    let following = false;
    let target = 0;
    let interacted = false;

    const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

    // 缓动把当前帧逼近目标帧，避免逐像素瞬跳带来的卡顿感
    const tick = () => {
      if (!following) return;
      const cur = video.currentTime;
      if (cfg.smooth) {
        const next = cur + (target - cur) * 0.18;
        video.currentTime = next;
        if (Math.abs(target - next) > 0.004) {
          raf = requestAnimationFrame(tick);
        } else {
          video.currentTime = target;
          following = false;
        }
      } else {
        video.currentTime = target;
        following = false;
      }
    };

    const onMove = (e: MouseEvent) => {
      if (!interacted) {
        interacted = true;
        setHintVisible(false);
      }
      const rect = hero.getBoundingClientRect();
      // 首屏不在视口内时不处理
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
      const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      let ratio: number;
      if (cfg.axis === "x") {
        ratio = x;
      } else if (cfg.axis === "y") {
        ratio = y;
      } else {
        ratio = (x + y) / 2;
      }
      if (!video.duration || isNaN(video.duration)) return;
      target = ratio * Math.max(0, video.duration - 0.05);
      if (!following) {
        following = true;
        video.pause(); // 暂停自动循环，改由鼠标驱动
        tick();
      }
    };

    const onLeave = () => {
      following = false;
      cancelAnimationFrame(raf);
      if (cfg.autoResume) video.play().catch(() => {}); // 离开后恢复自动循环
    };

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("mousemove", onMove);
      hero.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
      following = false;
    };
  }, [scrubActive, config.hero.videoScrub]);

  // 滚轮模式：滑动鼠标滚轮 = 视频前进/后退一帧（逐帧交互）
  useEffect(() => {
    const video = videoBgRef.current;
    const hero = containerRef.current;
    if (!video || !hero || !scrubActive || !isWheelMode) return;
    const cfg = config.hero.videoScrub;
    let interacted = false;

    const onWheel = (e: WheelEvent) => {
      const dur = video.duration;
      if (!isFinite(dur) || dur <= 0) return;
      const dir = e.deltaY > 0 ? 1 : -1; // 下滚前进，上滚后退
      const step = Math.max(0.005, cfg?.step ?? 0.05); // 每格步进秒数，约一帧
      const next = video.currentTime + dir * step;
      // 到达视频首尾时释放滚轮，让其恢复普通页面滚动（可离开首屏）
      if (next < 0 || next > dur) return;
      e.preventDefault();
      if (!video.paused) video.pause();
      video.currentTime = Math.min(dur, Math.max(0, next));
      if (!interacted) {
        interacted = true;
        setHintVisible(false);
      }
    };

    hero.addEventListener("wheel", onWheel, { passive: false });
    return () => hero.removeEventListener("wheel", onWheel);
  }, [scrubActive, isWheelMode, config.hero.videoScrub]);

  // 循环播放模式：确保视频处于 play + loop（从滚轮/鼠标暂停态切回时，autoplay 不会自动重启）
  useEffect(() => {
    const video = videoBgRef.current;
    if (!video) return;
    if (useVideoLoop) {
      video.loop = true;
      if (video.paused) video.play().catch(() => {});
    }
  }, [useVideoLoop]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen min-h-[620px] sm:min-h-[640px] md:min-h-[720px] bg-black overflow-hidden z-20"
      id="hero-section"
    >
      {/* Full-screen background video (1920x1080, object-cover, no letterbox) */}
      <video
        ref={videoBgRef}
        src={config.hero.video}
        poster={config.hero.poster}
        autoPlay={useVideoLoop}
        muted
        loop={useVideoLoop}
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 鼠标互动提示：首次滑动后淡出（循环模式不显示） */}
      {scrubActive && scrubCfg?.hint && hintVisible && !isLoopMode && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[60%] z-30 transition-opacity duration-700">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white/80 text-[11px] tracking-[0.15em] border border-white/15">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d={hintIconPath} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {hintText}
          </span>
        </div>
      )}

      {/* Darkening overlay for text legibility (heavier at bottom for CTA) */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/25 to-black/60"></div>

      {/* Editorial Header Navigation */}
      <header className="absolute top-0 left-0 w-full z-40 px-5 sm:px-8 md:px-10 py-6 flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection("hero-section")}>
          <span className="font-black text-lg tracking-wider uppercase text-white drop-shadow">
            {language === "zh"
              ? `${config.brand.nameZh} · ${config.brand.titleZh}`
              : `${config.brand.nameEn} · ${config.brand.titleEn}`}
          </span>
          <span className="w-2 h-2 rounded-full bg-[var(--c-dot)] inline-block animate-pulse"></span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {(() => {
            const order = config.navOrder && config.navOrder.length
              ? config.navOrder
              : ["works", "services", "about"];
            return order
              .filter((k) => config.nav[k])
              .map((k) => (
                <button
                  key={k}
                  onClick={() => goNavLink(config.nav[k]?.link)}
                  className="text-xs uppercase font-medium tracking-widest text-white/70 hover:text-white transition-colors drop-shadow"
                >
                  {navLabel(config.nav[k], language)}
                </button>
              ));
          })()}
        </nav>
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Elegant Language Segmented Control */}
          <div className="flex items-center rounded-full border border-white/25 p-0.5 bg-white/10 backdrop-blur-md">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase ${
                language === "en"
                  ? "bg-white text-[var(--c-ink)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("zh")}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all uppercase ${
                language === "zh"
                  ? "bg-white text-[var(--c-ink)]"
                  : "text-white/60 hover:text-white"
              }`}
            >
              中
            </button>
          </div>
        </div>
      </header>

      {/* Hero Animated Content Wrapper */}
      <div ref={contentWrapperRef} className="relative w-full h-full flex flex-col justify-between pt-24 pb-12 px-5 sm:px-8 md:px-10 z-10">
        {/* Main Composition */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 items-center gap-8 relative">

          {/* Left Area: Display Heading and Subtext */}
          <div className="md:col-span-8 flex flex-col justify-center z-20 pointer-events-none select-none">
            {(() => {
              const heroHeading = (config.hero.heading?.[language] || "").trim();
              // 清空首屏大标题时不渲染该标题（不再 fallback 品牌名，避免与导航 logo 名称重复）
              if (!heroHeading) return null;
              return (
                <h1
                  ref={headingRef}
                  className="hero-heading text-[12vw] sm:text-[9vw] md:text-[8vw] lg:text-[7.5vw] xl:text-[7vw] leading-[0.85] tracking-tighter text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
                >
                  {heroHeading}
                  <span className="text-white font-light">.</span>
                </h1>
              );
            })()}

            {/* Accent group with description details (animated on scroll) */}
            <div
              ref={accentGroupRef}
              className="mt-6 sm:mt-8 md:mt-12 flex flex-col max-w-xl pointer-events-auto"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-white/90 mb-2 drop-shadow">
                {pick(config.brand.tagline, language)}
              </span>
              <p className="text-sm sm:text-base text-white/80 uppercase font-light tracking-wide leading-relaxed drop-shadow">
                {pick(config.hero.subtitle, language)}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Area of Hero Viewport */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-t border-white/15 pt-6 mt-4">

          {/* Service Category Chips (human + AI deliverables) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold text-white/50">
                {navLabel(config.nav.services, language)}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/80"></span>
            </div>
            <div className="flex flex-wrap gap-2">
            {config.serviceCats.map((cat) => (
              <button
                key={pick(cat.name, language)}
                onClick={scrollToServices}
                className="px-3 py-1.5 rounded-md text-xs font-medium border border-white/20 bg-white/10 backdrop-blur-md text-white/80 hover:border-white hover:text-white transition-all"
              >
                {pick(cat.name, language)}
              </button>
            ))}
            </div>
          </div>

          {/* Contact Button wrapped in magnet physics */}
          <Magnet padding={150} strength={3}>
            <button
              onClick={openMagnet}
              className="group relative rounded-full bg-white text-[var(--c-ink)] border border-white px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {/* Hover accent glowing border and green dot */}
              <div className="absolute inset-0 rounded-full border border-transparent group-hover:border-[var(--c-accent)] group-hover:shadow-[0_0_15px_var(--c-accent)] transition-all pointer-events-none duration-300"></div>

              <div className="flex items-center justify-center gap-3">
                <span>{pick(config.hero.ctaText, language)}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[var(--c-dot)] group-hover:scale-125 transition-all duration-300"></span>
              </div>
            </button>
          </Magnet>
        </div>
      </div>
    </div>
  );
}
