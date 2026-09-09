import React, { useState, useEffect } from "react";
import { X, Check, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { useSiteConfig, pick } from "../config/SiteConfigContext";
import { getRefSource } from "../lib/attribution";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { t, language } = useLanguage();
  const { config } = useSiteConfig();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("");
  const [brief, setBrief] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // 意向类目：动态取自后台可编辑的接单类目（serviceCats），缺省回退
  const fallbackCats =
    language === "zh"
      ? ["电商设计", "包装设计", "品牌全案", "AI 视频", "空间效果"]
      : ["E-commerce", "Packaging", "Brand", "AI Video", "Spatial"];
  const cats =
    config.serviceCats && config.serviceCats.length
      ? config.serviceCats.map((c) => pick(c.name, language))
      : fallbackCats;
  const activeCat = category || cats[0] || "";

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact) return;
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact, // 联系方式（微信/手机/邮箱，不再强制邮箱格式）
          project: activeCat, // 兼容旧字段
          category: activeCat, // 私域打标：意向类目
          intent: "medium", // 咨询表单意向度=中
          message: brief, // 需求描述
          source: getRefSource("contact_form"),
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

  const resetForm = () => {
    setName("");
    setContact("");
    setCategory("");
    setBrief("");
    setIsSubmitted(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-white border-2 border-[#0C0C0C] rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_30px_100px_rgba(12,12,12,0.15)] z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors text-[#0C0C0C]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                  <h3 className="text-2xl font-black uppercase text-[#0C0C0C] tracking-tight">
                    {t.contactTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#7621B0]">
                      {t.contactTerminal}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1FD66E]"></span>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#0C0C0C]/60">
                      {t.userIdentity}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.identityPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-[#0C0C0C]/15 focus:border-[#7621B0] focus:ring-1 focus:ring-[#7621B0] bg-transparent outline-none text-sm transition-all text-[#0C0C0C]"
                    />
                  </div>

                  {/* Contact Input（微信/手机/邮箱，不做邮箱格式强制校验） */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#0C0C0C]/60">
                      {t.responseChannel}
                    </label>
                    <input
                      type="text"
                      required
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="微信 / 手机 / 邮箱"
                      className="w-full px-4 py-3 rounded-xl border border-[#0C0C0C]/15 focus:border-[#7621B0] focus:ring-1 focus:ring-[#7621B0] bg-transparent outline-none text-sm transition-all text-[#0C0C0C]"
                    />
                  </div>

                  {/* Category Select（动态取自接单类目，移动优先响应式网格） */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#0C0C0C]/60">
                      {t.categoryLabel}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {cats.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCategory(c)}
                          aria-pressed={activeCat === c}
                          className={`py-2 px-3 text-[10px] sm:text-xs rounded-xl font-bold uppercase tracking-wider border transition-all ${
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

                  {/* Brief textarea */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs uppercase font-bold tracking-wider text-[#0C0C0C]/60">
                      {t.contextBrief}
                    </label>
                    <textarea
                      value={brief}
                      onChange={(e) => setBrief(e.target.value)}
                      rows={4}
                      placeholder={t.contextPlaceholder}
                      className="w-full px-4 py-3 rounded-xl border border-[#0C0C0C]/15 focus:border-[#7621B0] focus:ring-1 focus:ring-[#7621B0] bg-transparent outline-none text-sm resize-none transition-all text-[#0C0C0C]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-[#0C0C0C] text-white py-3.5 uppercase font-bold tracking-widest text-xs sm:text-sm border border-[#0C0C0C] transition-all hover:bg-transparent hover:text-[#0C0C0C] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>{t.transmitting}</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>{t.transcribeBtn}</span>
                    </>
                  )}
                </button>

                {error && (
                  <p className="text-xs text-red-500 text-center font-medium">{error}</p>
                )}
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
                  {t.transmissionSecure}
                </h4>
                <p className="text-xs text-[#7621B0] font-mono mt-1 uppercase tracking-widest">
                  {t.decryptedIndexed}
                </p>
                <p className="text-sm text-[#0C0C0C]/60 mt-4 max-w-sm">
                  {t.transmissionDesc}
                </p>
                <button
                  onClick={resetForm}
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
