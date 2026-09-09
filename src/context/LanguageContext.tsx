import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "zh";

interface TranslationDict {
  brand: string;
  brandSub: string;
  serviceCats: string[];
  testedInterfaces: string;
  whatIDecode: string;
  fieldWork: string;
  initiateContact: string;
  workWithMe: string;
  fieldNoteArchive: string;
  heroSub: string;
  channels: string;
  verifiedField: string;
  resumeSummary: string;
  fieldRecord: string;
  viewCase: string;
  fieldTelemetry: string;
  systemTime: string;
  copyright: string;
  footerDesc: string;
  platformMap: string;
  officialChannels: string;
  footerContactDesc: string;
  secureInquiry: string;
  returnToArchive: string;

  // Contact Modal
  contactTitle: string;
  contactTerminal: string;
  userIdentity: string;
  identityPlaceholder: string;
  responseChannel: string;
  inquiryFocus: string;
  optReviews: string;
  optSponsorship: string;
  optWorkflow: string;
  contextBrief: string;
  contextPlaceholder: string;
  transmitting: string;
  transcribeBtn: string;
  transmissionSecure: string;
  decryptedIndexed: string;
  transmissionDesc: string;

  // Lead Magnet（免费资料包钩子）
  categoryLabel: string;
  magnetTitle: string;
  magnetDesc: string;
  magnetPerk1: string;
  magnetPerk2: string;
  magnetPerk3: string;
  magnetCta: string;
  magnetSuccess: string;
  magnetSuccessDesc: string;

  // Case Study Modal
  caseStudyRecon: string;
  systemChallenge: string;
  evaluationMethod: string;
  telemetryTitle: string;
  reproducibleWarning: string;
  systemPromptBlueprint: string;
  copiedBlueprint: string;
  copyScript: string;

  // Resume Items
  res01Label: string;
  res01Title: string;
  res01Desc: string;

  res02Label: string;
  res02Title: string;
  res02Desc: string;

  res03Label: string;
  res03Title: string;
  res03Desc: string;

  res04Label: string;
  res04Title: string;
  res04Desc: string;

  res05Label: string;
  res05Title: string;
  res05Desc: string;

  // Projects
  proj01Cat: string;
  proj01Name: string;
  proj01Title: string;
  proj01Desc: string;

  proj02Cat: string;
  proj02Name: string;
  proj02Title: string;
  proj02Desc: string;

  proj03Cat: string;
  proj03Name: string;
  proj03Title: string;
  proj03Desc: string;
}

const translations: Record<Language, TranslationDict> = {
  en: {
    brand: "AI DESIGN ARCHMAGE",
    brandSub: "DESIGN PORTFOLIO · SOLO STUDIO",
    serviceCats: ["E-commerce Design", "Packaging Design", "Brand Identity", "AI Video", "Spatial Design"],
    testedInterfaces: "WORKS",
    whatIDecode: "SERVICES",
    fieldWork: "ABOUT",
    initiateContact: "INQUIRE",
    workWithMe: "START A PROJECT",
    fieldNoteArchive: "FIELD NOTE ARCHIVE",
    heroSub: "Human + AI delivery for e-commerce, packaging, brand identity and AI video — fast turnaround, solid taste, stress-free revisions.",
    channels: "SERVICES",
    verifiedField: "Verified Field Builds",
    resumeSummary: "AI Archmage turns fast-moving AI products into clear reviews, practical tutorials, product breakdowns, and responsible technology judgment.",
    fieldRecord: "FIELD RECORD",
    viewCase: "VIEW CASE",
    fieldTelemetry: "Field Telemetry",
    systemTime: "Current System Time (UTC):",
    copyright: "All Rights Reserved.",
    footerDesc: "A field-tested content repository for artificial intelligence reviews, actionable workflow blueprints, and technology trends.",
    platformMap: "Platform Map",
    officialChannels: "Official Channels",
    footerContactDesc: "For sponsorship, validation blueprints, or strategic consultation requests:",
    secureInquiry: "Initiate Secure Inquiry",
    returnToArchive: "Return to Archive",

    // Contact Modal
    contactTitle: "Initiate Connection",
    contactTerminal: "AI Archmage Terminal",
    userIdentity: "Your Identity / Name",
    identityPlaceholder: "e.g. Lead Engineer / Creator",
    responseChannel: "Response Channel / Email",
    inquiryFocus: "Inquiry Focus",
    optReviews: "Reviews",
    optSponsorship: "Sponsorship",
    optWorkflow: "Workflow Automation",
    contextBrief: "Context / Project Brief",
    contextPlaceholder: "Specify your system constraints, target outputs, or product review timelines...",
    transmitting: "Transmitting...",
    transcribeBtn: "Transcribe Blueprint",
    transmissionSecure: "Transmission Secure",
    decryptedIndexed: "DECRYPTED AND INDEXED",
    transmissionDesc: "Your specifications have been logged inside the AI Archmage's active buffer. Expect responsive tactical analysis within 24 hours.",

    // Lead Magnet
    categoryLabel: "Service Category",
    magnetTitle: "Free Design Resource Pack",
    magnetDesc: "Grab our curated starter kit — leave your WeChat and we'll send it over.",
    magnetPerk1: "30 e-commerce hero templates",
    magnetPerk2: "AI design prompt cheat sheet",
    magnetPerk3: "Packaging / brand spec checklist",
    magnetCta: "Get the free pack",
    magnetSuccess: "Request received",
    magnetSuccessDesc: "We've sent the resource pack to your WeChat. Expect it within a few minutes.",

    // Case Study Modal
    caseStudyRecon: "CASE STUDY RECON // CH.",
    systemChallenge: "System Challenge",
    evaluationMethod: "Evaluation Methodology",
    telemetryTitle: "SYSTEM TELEMETRY",
    reproducibleWarning: "ALL METRICS ARE FULLY REPRODUCIBLE AND DERIVED FROM RAW LOCAL SANDBOX EVALUATIONS.",
    systemPromptBlueprint: "System Prompt Blueprint",
    copiedBlueprint: "Copied Blueprint",
    copyScript: "Copy Script",

    // Resume Items
    res01Label: "AI Product Reviews",
    res01Title: "Real testing before loud conclusions",
    res01Desc: "Hands-on reviews of AI assistants, search tools, writing tools, image and video models, coding tools, agents, knowledge bases, and productivity systems, focused on who each product is for, what problem it solves, where it works, and where it breaks.",

    res02Label: "Practical Tutorials",
    res02Title: "Workflows people can actually repeat",
    res02Desc: "Step-by-step AI tutorials for scripting, topic research, knowledge management, prompt rewriting, short-video planning, data analysis, and tool-to-tool automation, built around copyable steps and verifiable results.",

    res03Label: "Technology Trends",
    res03Title: "Separating signal from product-launch noise",
    res03Desc: "Long-term observations on how large models, AI search, agents, and video generation are changing creators, product teams, knowledge work, and the value of human judgment.",

    res04Label: "Creator Methods",
    res04Title: "AI as a creative accelerator, not a replacement",
    res04Desc: "Content methods for ideation, titles, scripts, materials, research, audience insight, account positioning, short-form video, long-form writing, and editorial systems, always anchored in taste, perspective, and lived experience.",

    res05Label: "Responsible AI",
    res05Title: "Clear eyes on risk, limits, and misuse",
    res05Desc: "A grounded view of AI ethics, privacy, copyright, bias, fabricated content, overdependence, and the boundary between useful technology and exaggerated claims.",

    // Projects
    proj01Cat: "Field Test",
    proj01Name: "AI Tool Reviews",
    proj01Title: "Systematic Review Framework",
    proj01Desc: "Hands-on, clear telemetry and evaluation of frontier commercial models and specialized workspace agents.",

    proj02Cat: "Method",
    proj02Name: "Reproducible Tutorials",
    proj02Title: "Verifiable Step-by-Step",
    proj02Desc: "Complete walkthrough blueprints, code scripts, and execution records crafted for automation enthusiasts.",

    proj03Cat: "Insight",
    proj03Name: "Trend Breakdowns",
    proj03Title: "Product-Market Telemetry",
    proj03Desc: "In-depth research on tech vector shifts, macro AI investment channels, and societal paradigm re-alignment.",
  },
  zh: {
    brand: "高祥 · AI设计魔法师",
    brandSub: "设计作品集 · 一人公司接单",
    serviceCats: ["电商设计", "包装设计", "品牌全案", "AI 视频", "空间效果"],
    testedInterfaces: "作品案例",
    whatIDecode: "接单服务",
    fieldWork: "关于我",
    initiateContact: "发起咨询",
    workWithMe: "立即咨询接单",
    fieldNoteArchive: "实战手记存档",
    heroSub: "人 + AI 承接电商设计 / 包装 / 品牌全案 / AI 视频，交付快、审美稳、改稿不慌。",
    channels: "接单类目",
    verifiedField: "经验证的实战构建",
    resumeSummary: "AI 大魔导师将日新月异的AI产品转化为清晰的评测、实用的手把手教程、详尽的产品拆解以及负责任的技术研判。",
    fieldRecord: "实战记录",
    viewCase: "查看案例",
    fieldTelemetry: "实战遥测",
    systemTime: "当前系统时间 (UTC):",
    copyright: "保留所有权利。",
    footerDesc: "一个经受实战检验的 AI 产品深度评测、可执行自动化工作流蓝图与前沿技术趋势研判的内容库。",
    platformMap: "站点地图",
    officialChannels: "官方联络通道",
    footerContactDesc: "寻求商务赞助、验证蓝图或战略咨询服务：",
    secureInquiry: "发起安全联络",
    returnToArchive: "返回主页",

    // Contact Modal
    contactTitle: "发起联络",
    contactTerminal: "AI 大魔导师控制台",
    userIdentity: "您的身份 / 姓名",
    identityPlaceholder: "例如：首席工程师 / 创作者",
    responseChannel: "回复通道 / 电子邮箱",
    inquiryFocus: "咨询方向",
    optReviews: "产品评测",
    optSponsorship: "商务赞助",
    optWorkflow: "工作流自动化",
    contextBrief: "合作背景 / 项目简述",
    contextPlaceholder: "请说明您的系统限制、期望产出或产品评测时间线...",
    transmitting: "正在传输...",
    transcribeBtn: "记录合作蓝图",
    transmissionSecure: "传输安全完成",
    decryptedIndexed: "已成功解密并归档",
    transmissionDesc: "您的合作规格已记入 AI 大魔导师的活动缓冲区。将在24小时内为您提供专业的策略响应。",

    // Lead Magnet
    categoryLabel: "咨询类目",
    magnetTitle: "免费设计资料包",
    magnetDesc: "留下微信，立即领取我们整理的设计干货礼包。",
    magnetPerk1: "电商主图爆款模板 30 套",
    magnetPerk2: "AI 设计提示词速查手册",
    magnetPerk3: "包装 / 品牌规范自查清单",
    magnetCta: "免费领取资料包",
    magnetSuccess: "已收到你的请求",
    magnetSuccessDesc: "资料包已发送到你填写的微信，请留意查收（几分钟内到账）。",

    // Case Study Modal
    caseStudyRecon: "案例实战侦察 // CH.",
    systemChallenge: "系统挑战",
    evaluationMethod: "评估方法论",
    telemetryTitle: "系统实测数据",
    reproducibleWarning: "所有测量指标均完全可复现，且衍生自本地沙盒环境的真实运行测试。",
    systemPromptBlueprint: "系统提示词蓝图",
    copiedBlueprint: "已复制提示词蓝图",
    copyScript: "复制脚本",

    // Resume Items
    res01Label: "AI 产品评测",
    res01Title: "拒绝空谈，真机实测",
    res01Desc: "针对AI助手、AI搜索、写作工具、音视频模型、编程辅助、智能体、知识库和生产力系统的上手深度评测，直击谁最适用、解决什么痛点、哪里好用、哪里有坑。",

    res02Label: "实用指南教程",
    res02Title: "人人可复现的实操工作流",
    res02Desc: "涵盖脚本编写、选题研究、知识管理、提示词重写、短视频策划、数据分析及跨工具自动化的手把手AI教程，提供可复用步骤与可验证结果。",

    res03Label: "技术趋势观察",
    res03Title: "拨开产品发布狂欢的迷雾，甄别真实信号",
    res03Desc: "长期关注大语言模型、AI搜索、智能体与视频生成如何重塑创作者、产品团队、知识工作以及人类判断力的独特价值。",

    res04Label: "创作者核心方法",
    res04Title: "AI是创作加速器，而非人类替代品",
    res04Desc: "涵盖灵感生成、标题打磨、脚本编排、研究积累、受众洞察、账号定位、短视频及深度写作的内容方法论，始终立足于审美、视角与亲身经历。",

    res05Label: "负责任的AI观",
    res05Title: "清醒审视风险、局限与滥用",
    res05Desc: "对AI伦理、隐私安全、版权问题、算法偏见、幻觉虚构、过度依赖及实用技术与夸大宣传之间的界限，保持脚踏实地的审视态度。",

    // Projects
    proj01Cat: "实地测试",
    proj01Name: "AI 工具深度评测",
    proj01Title: "系统化评测框架",
    proj01Desc: "对前沿商业模型与垂直领域工作区智能体进行真机实测、遥测分析与清晰评估。",

    proj02Cat: "实践方法",
    proj02Name: "可复现技术教程",
    proj02Title: "可验证的手把手指南",
    proj02Desc: "为自动化和极客爱好者量身定制的完整实操蓝图、代码脚本与执行记录。",

    proj03Cat: "深度洞察",
    proj03Name: "前沿趋势拆解",
    proj03Title: "产品与市场遥测",
    proj03Desc: "深入探究技术向量演进、宏观AI投资动向及社会范式重构。",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("ai_archmage_lang");
    if (saved === "en" || saved === "zh") return saved;
    // detect browser language
    if (navigator.language.startsWith("zh")) return "zh";
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("ai_archmage_lang", language);
  }, [language]);

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
