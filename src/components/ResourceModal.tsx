import React, { useState, useEffect } from "react";
import { X, Check, Gift, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";
import { getRefSource } from "../lib/attribution";

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 免费资料包钩子弹窗：用「价值换联系方式」，是私域引流的核心杠杆。
 * 提交即记一条 intent=high、source=lead_magnet 的线索，便于后续归因。
 */
export default function ResourceModal({ isOpen, onClose }: ResourceModalProps) {
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const fallbackCats =
    language === "zh"
      ? ["电商设计", "包装设计", "品牌全案", "AI 视频", "空间效果"]
      : ["E-commerce", "Packaging", "Brand", "AI Video", "Spatial"];
  const cats =
    config.serviceCats && config.serviceCats.length
      ? config.serviceCats.map((c) => pick(c.name, language))
      : fallbackCats;
  const activeCat = category || cats[0] || "resource";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "资料包领取",
          contact,
          category: activeCat,
          intent: "high", // 主动领资料 = 高意向
          message: "领取免费设计资料包",
          source: getRefSource("lead_magnet"),
        }),
      });
      if (!res.ok) throw new Error("提交失败");
      setIsSubmitted(true);
    } catch {
      setError("提交失败，请稍后重试或通过微信联系");
    } finally {
      setIsSubmitting(false);
    }
  };

  const reset = () => {
    setName("");
    setContact("");
    setCategory("");
    setIsSubmitted(false);
    onClose();
  };

  const perks = [t.magnetPerk1, t.magnetPerk2, t.magnetPerk3];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0C0C0C]/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white border-2 border-[#0C0C0C] rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_rgba(12,12,12,0.25)] z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-[#0C0C0C]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#7621B0]/10 flex items-center justify-center text-[#7621B0] shrink-0">
                    <Gift size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-[#0C0C0C] tracking-tight">
                      {t.magnetTitle}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#7621B0]">
                      Free Resource
                    </span>
                  </div>
                </div>

                <p className="text-sm text-[#0C0C0C]/60">{t.magnetDesc}</p>

                <ul className="flex flex-col gap-2">
                  {perks.map((p, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[#0C0C0C]">
                      <span className="w-5 h-5 rounded-full bg-[#1FD66E]/15 flex items-center justify-center text-[#1FD66E] shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.userIdentity}
                    className="w-full px-4 py-3 rounded-xl border border-[#0C0C0C]/15 focus:border-[#7621B0] focus:ring-1 focus:ring-[#7621B0] outline-none text-sm text-[#0C0C0C]"
                  />
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="微信 / 手机（领取用）"
                    className="w-full px-4 py-3 rounded-xl border border-[#0C0C0C]/15 focus:border-[#7621B0] focus:ring-1 focus:ring-[#7621B0] outline-none text-sm text-[#0C0C0C]"
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {cats.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCategory(c)}
                        aria-pressed={activeCat === c}
                        className={`py-2 px-2 text-[10px] sm:text-xs rounded-xl font-bold uppercase tracking-wider border transition-all ${
                          activeCat === c
                            ? "bg-[#0C0C0C] text-white border-[#0C0C0C]"
                            : "bg-white text-[#0C0C0C]/60 border-gray-200 hover:border-[#0C0C0C]/30"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#7621B0] text-white py-3.5 uppercase font-bold tracking-widest text-xs sm:text-sm border border-[#7621B0] transition-all hover:bg-transparent hover:text-[#7621B0] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{t.transmitting}</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{t.magnetCta}</span>
                    </>
                  )}
                </button>

                {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-[#1FD66E]/10 flex items-center justify-center text-[#1FD66E] mb-6 shadow-[0_0_20px_rgba(31,214,110,0.2)]">
                  <Check size={32} strokeWidth={3} className="animate-bounce" />
                </div>
                <h4 className="text-xl font-black uppercase text-[#0C0C0C] tracking-tight">
                  {t.magnetSuccess}
                </h4>
                <p className="text-sm text-[#0C0C0C]/60 mt-4 max-w-sm">{t.magnetSuccessDesc}</p>
                <button
                  onClick={reset}
                  className="mt-8 px-8 py-2.5 rounded-full border border-[#0C0C0C]/15 font-bold uppercase tracking-widest text-xs hover:border-[#0C0C0C] text-[#0C0C0C] transition-all"
                >
                  {t.returnToArchive}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
