// =============================================================
//  站点内容配置（单一数据源）
//  - defaultSiteConfig 是默认值（编译进包，作为兜底）。
//  - 运行时会被 public/api 读取的 siteConfig.json 覆盖（后台保存写回）。
//  - 后台 /admin 编辑的就是这份结构。
//  说明：所有面向访客展示的内容都放这里，UI 文案（按钮/表单标签）仍在
//  LanguageContext。改完在后台保存即可，无需动代码。
// =============================================================

export type Bilingual = { zh: string; en: string };

// 后台 /admin 左侧边栏菜单项（id/icon 由代码固定，label 可编辑）
export interface AdminNavItemConfig {
  id: string;
  label: Bilingual;
  icon: string;
}

// 后台 /admin 左侧边栏菜单分组（id 由代码固定，label 与 items 可编辑）
export interface AdminNavGroupConfig {
  id: string;
  label: Bilingual;
  items: AdminNavItemConfig[];
}

// 接单类目：每个类目可配图、跳转链接、一句话说明（后台可逐项编辑）
export interface ServiceCat {
  name: Bilingual;
  image: string; // 配图（上传或外链），留空则不显示图
  imageRatio?: "16:9" | "4:3" | "5:4"; // 配图展示比例，默认 16:9
  link: string; // 跳转链接，留空则点击触发「咨询」弹窗
  desc: Bilingual; // 一句话说明
}


/** 作品图（首屏下方滚动展示）：支持上传 + 图注 + 移动 + 删除 */
export interface WorksImage {
  url: string;
  caption?: string;
}

export interface ResumeItemConfig {
  num: string;
  period: string; // 时间段，如 "2024 – 2025"
  company: Bilingual; // 公司 / 单位
  title: Bilingual; // 职位 / 角色
  label: Bilingual; // 领域标签（电商视觉 / 空间设计 …）
  description: Bilingual; // 职责与成果
}

// 作品集：按类目分组展示图片（电商美工 / 平面包装广告 …）

// 页脚：站点地图链接
export interface FooterLink {
  label: Bilingual;
  link: string; // #锚点 / /站内路由 / 外链
}

// 页脚：联系方式（微信/邮箱/电话/自定义），微信可上传二维码
export interface FooterContact {
  type: "wechat" | "email" | "phone" | "custom";
  label: Bilingual;
  value: string; // 微信号 / 邮箱 / 电话 / 自定义文案
  qrImage?: string; // 二维码图片（仅 wechat 常用）
}

// 页脚：社交链接
export interface FooterSocial {
  platform: string; // github / twitter / linkedin / instagram / dribbble / behance / weibo / wechat / x / youtube 等
  url: string;
}

export interface SiteConfig {
  brand: {
    nameZh: string;
    titleZh: string;
    nameEn: string;
    titleEn: string;
    tagline: Bilingual;
  };
  hero: {
    subtitle: Bilingual;
    ctaText: Bilingual;
    /** 首屏大标题：独立于品牌名，可在后台「首屏文案」单独编辑；默认同品牌名，可改成一句标语与 logo 区分 */
    heading: Bilingual;
    video: string; // 背景视频地址（mp4，如 /hero/xxx.mp4）
    poster: string; // 视频加载前 / 失败兜底图
    videoScrub: {
      enabled: boolean; // 视频互动总开关
      mode: "move" | "wheel" | "loop"; // 互动模式：move=鼠标位置按帧跟随；wheel=滚轮逐帧；loop=自动循环播放（老版本效果）
      axis: "x" | "y" | "xy"; // 滑动轴（move 模式）：x=仅横向，y=仅纵向（上下滑动），xy=横纵双轴
      step: number; // 滚轮每格步进秒数（wheel 模式），约一帧
      smooth: boolean; // 缓动跟随（更顺滑，move 模式）
      autoResume: boolean; // 鼠标离开首屏后恢复自动循环播放（move 模式）
      hint: boolean; // 显示互动提示
    };
  };
  nav: Record<string, { label: Bilingual; link: string }>;
  // 导航栏菜单顺序（数据驱动，后台「导航区域」可调，可增删自定义项）
  navOrder: string[];
  // 后台 /admin 左侧边栏菜单顺序（分组内可上下移动）
  adminNavOrder: string[];
  // 后台 /admin 左侧边栏菜单文案（分组名、菜单项名称可编辑）
  adminNav: { groups: AdminNavGroupConfig[] };
  serviceCats: ServiceCat[];
  contact: {
    wechat: string;
    email: string;
    phone: string;
  };
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  footer: {
    desc: Bilingual;
    copyright: Bilingual;
    backToTopLabel: Bilingual;
    sitemapTitle: Bilingual;
    sitemap: FooterLink[];
    contactTitle: Bilingual;
    contacts: FooterContact[];
    socialTitle: Bilingual;
    socials: FooterSocial[];
  };
  theme: {
    ink: string;
    accent: string;
    dot: string;
  };
  sections: {
    works: Bilingual;
    services: Bilingual;
    about: Bilingual;
  };
  /** 区块大标题（SectionTitle）字体，后台「区块标题」可手动调节 */
  sectionTitleFont: {
    family: string; // 字体风格：sans=现代黑体, serif=经典衬线, rounded=圆润体, mono=等宽科技
    weight: number; // 字重 400/600/700/900
    scale: number; // 标题大小倍率 0.5-2.0（1=默认）
    letterSpacing: number; // 字间距 em，如 -0.02
  };
  aboutBio: Bilingual; // 关于我：个人简介
  aboutMeta: Bilingual; // 关于我：学历 / 证书 一行
  worksGallery: WorksImage[];
  resume: ResumeItemConfig[];
}

// 语言读取辅助：优先用对应语言，空了回退中文；v 为 undefined/null 时返回空串（防白屏）
export const pick = (
  v: Bilingual | undefined | null,
  lang: "zh" | "en",
): string => (v ? (v[lang] || v.zh) : "");

// 导航链接跳转：#锚点→平滑滚动本页区块；/内部路由→站内跳转；其余→新标签打开外链
export const goNavLink = (link: string | undefined): void => {
  if (!link) return;
  if (link.startsWith("#")) {
    const id = link.slice(1);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  } else if (link.startsWith("/")) {
    window.location.href = link;
  } else {
    window.open(link, "_blank", "noopener");
  }
};

// 读取导航项文字（兼容新旧 nav 形状）：优先 label，回退旧版 zh
export const navLabel = (
  item: { label?: Bilingual; zh?: string } | undefined,
  lang: "zh" | "en",
): string => {
  if (!item) return "";
  if (item.label) return pick(item.label, lang);
  return item.zh || "";
};


export const defaultSiteConfig: SiteConfig = {
  "brand": {
    "nameZh": "GAO",
    "titleZh": "CHENGZE",
    "nameEn": "GAO",
    "titleEn": "CHENGZE",
    "tagline": {
      "zh": "",
      "en": ""
    }
  },
  "hero": {
    "subtitle": {
      "zh": "",
      "en": ""
    },
    "ctaText": {
      "zh": "留言",
      "en": "Free Kit"
    },
    "heading": {
      "zh": "",
      "en": ""
    },
    "video": "/hero/hero-particles.mp4",
    "poster": "",
    "videoScrub": {
      "enabled": true,
      "mode": "loop",
      "axis": "y",
      "step": 0.05,
      "smooth": true,
      "autoResume": true,
      "hint": true
    }
  },
  "nav": {
    "works": {
      "label": {
        "zh": "作品预览",
        "en": "Works Preview"
      },
      "link": "#marquee-section"
    },
    "services": {
      "label": {
        "zh": "服务选项",
        "en": "Services"
      },
      "link": "#services-section"
    },
    "about": {
      "label": {
        "zh": "关于我",
        "en": "About"
      },
      "link": "#resume-section"
    }
  },
  "navOrder": [
    "works",
    "services",
    "about"
  ],
  "adminNavOrder": [
    "brand",
    "hero",
    "sections",
    "cats",
    "gallery",
    "resume",
    "footer",
    "theme",
    "leads"
  ],
  "adminNav": {
    "groups": [
      {
        "id": "content",
        "label": {
          "zh": "内容管理",
          "en": "Content"
        },
        "items": [
          {
            "id": "brand",
            "label": {
              "zh": "导航区域",
              "en": "Navigation"
            },
            "icon": "compass"
          },
          {
            "id": "hero",
            "label": {
              "zh": "首屏文案",
              "en": "Hero Text"
            },
            "icon": "hero"
          },
          {
            "id": "cats",
            "label": {
              "zh": "接单类目",
              "en": "Services"
            },
            "icon": "tag"
          },
          {
            "id": "sections",
            "label": {
              "zh": "区块标题",
              "en": "Section Titles"
            },
            "icon": "heading"
          },
          {
            "id": "gallery",
            "label": {
              "zh": "作品图",
              "en": "Gallery"
            },
            "icon": "photo"
          },
          {
            "id": "resume",
            "label": {
              "zh": "关于我",
              "en": "About"
            },
            "icon": "user"
          },
          {
            "id": "footer",
            "label": {
              "zh": "页脚",
              "en": "Footer"
            },
            "icon": "flag"
          }
        ]
      },
      {
        "id": "appearance",
        "label": {
          "zh": "外观",
          "en": "Appearance"
        },
        "items": [
          {
            "id": "theme",
            "label": {
              "zh": "配色",
              "en": "Theme"
            },
            "icon": "swatch"
          }
        ]
      },
      {
        "id": "data",
        "label": {
          "zh": "数据",
          "en": "Data"
        },
        "items": [
          {
            "id": "leads",
            "label": {
              "zh": "接单线索",
              "en": "Leads"
            },
            "icon": "inbox"
          }
        ]
      }
    ]
  },
  "serviceCats": [
    {
      "name": {
        "zh": "电商设计",
        "en": "E-commerce Design"
      },
      "image": "/uploads/_____________202608221139_5_mt3u0mszmgadam.jpg",
      "link": "#marquee-section",
      "desc": {
        "zh": "主图 / 详情页 / 直通车，人+AI 快速出图改稿",
        "en": "Main image, detail page, top ads — human + AI fast turnaround"
      },
      "imageRatio": "16:9"
    },
    {
      "name": {
        "zh": "平面设计",
        "en": "Packaging Design"
      },
      "image": "/uploads/_____________202608221139_4_mt3u0qjggwizat.jpg",
      "link": "#marquee-section",
      "desc": {
        "zh": "礼盒 / 标签 / 三维效果，落地可用的包装视觉",
        "en": "Gift box, label, 3D mockups — production-ready packaging visuals"
      },
      "imageRatio": "16:9"
    },
    {
      "name": {
        "zh": "前端设计",
        "en": "Brand Identity"
      },
      "image": "/uploads/_____________202608221139_mt3u0vtshm5taj.jpg",
      "link": "#marquee-section",
      "desc": {
        "zh": "Logo / VI / 规范，从 0 到 1 的品牌体系",
        "en": "Logo, VI, guidelines — brand system from zero to one"
      }
    },
    {
      "name": {
        "zh": "景观设计",
        "en": "AI Video"
      },
      "image": "/uploads/_____________202608221139_2_mt3u0zcu1665up.jpg",
      "link": "#marquee-section",
      "desc": {
        "zh": "口播 / 产品 / 广告，AI 生成加剪辑交付",
        "en": "Spokesperson, product, ads — AI generation + editing"
      }
    },
    {
      "name": {
        "zh": "建模设计",
        "en": "Spatial Design"
      },
      "image": "/uploads/_____________202608221139_3_mt3u13q9gz5td2.jpg",
      "link": "#marquee-section",
      "desc": {
        "zh": "景观 / 室内 / 效果图，发挥景观设计老本行",
        "en": "Landscape, interior, renderings — your landscaping core skill"
      }
    },
    {
      "name": {
        "zh": "视频设计",
        "en": ""
      },
      "image": "/uploads/_______________________202608221139_mt3u1i5r4ebz4k.jpg",
      "link": "",
      "desc": {
        "zh": "",
        "en": ""
      }
    },
    {
      "name": {
        "zh": "MCU",
        "en": ""
      },
      "image": "/uploads/_____________2K_202608221253_mt3xpgsu24ope0.jpg",
      "link": "",
      "desc": {
        "zh": "",
        "en": ""
      }
    },
    {
      "name": {
        "zh": "FDE",
        "en": ""
      },
      "image": "/uploads/_____________2K_202608221253__1__mt3xpw5p29vgbj.jpg",
      "link": "",
      "desc": {
        "zh": "",
        "en": ""
      }
    }
  ],
  "contact": {
    "wechat": "你的微信号",
    "email": "你的邮箱@example.com",
    "phone": ""
  },
  "social": {
    "github": "",
    "twitter": "",
    "linkedin": ""
  },
  "footer": {
    "desc": {
      "zh": "一人设计公司，用 AI 放大交付力。电商 / 包装 / 品牌 / 视频，接单交付。",
      "en": "A solo design studio powered by AI. E-commerce, packaging, brand and video commissions."
    },
    "copyright": {
      "zh": "保留所有权利。",
      "en": "All rights reserved."
    },
    "backToTopLabel": {
      "zh": "回到顶部",
      "en": "Back to Top"
    },
    "sitemapTitle": {
      "zh": "站点地图",
      "en": "Sitemap"
    },
    "sitemap": [
      {
        "label": {
          "zh": "回到顶部",
          "en": "Back to Top"
        },
        "link": "#hero-section"
      },
      {
        "label": {
          "zh": "作品预览",
          "en": "Works Preview"
        },
        "link": "#marquee-section"
      },
      {
        "label": {
          "zh": "接单服务",
          "en": "Services"
        },
        "link": "#services-section"
      },
      {
        "label": {
          "zh": "关于我",
          "en": "About"
        },
        "link": "#resume-section"
      },
      {
        "label": {
          "zh": "001",
          "en": ""
        },
        "link": "#"
      }
    ],
    "contactTitle": {
      "zh": "联系我",
      "en": "Contact"
    },
    "contacts": [
      {
        "type": "wechat",
        "label": {
          "zh": "微信",
          "en": "WeChat"
        },
        "value": "你的微信号",
        "qrImage": "/uploads/___.jpg"
      },
      {
        "type": "email",
        "label": {
          "zh": "邮箱",
          "en": "Email"
        },
        "value": "你的邮箱@example.com",
        "qrImage": ""
      }
    ],
    "socialTitle": {
      "zh": "社交平台",
      "en": "Social"
    },
    "socials": []
  },
  "theme": {
    "ink": "#0C0C0C",
    "accent": "#7621B0",
    "dot": "#1FD66E"
  },
  "sections": {
    "works": {
      "zh": "作品预览",
      "en": "Works Preview"
    },
    "services": {
      "zh": "服务选项",
      "en": "Services"
    },
    "about": {
      "zh": "关于我",
      "en": "About"
    }
  },
  "sectionTitleFont": {
    "family": "sans",
    "weight": 900,
    "scale": 0.7,
    "letterSpacing": 0.22
  },
  "aboutBio": {
    "zh": "12 年设计经验，从电商美工到一人 AI 设计公司。擅长 人+AI 协同交付电商视觉、包装、品牌全案与 AI 视频，并用景观设计功底做空间效果图。",
    "en": "12 years in design, from e-commerce artist to a solo AI design studio. I deliver e-commerce visuals, packaging, brand identity and AI video with human+AI, and apply my landscaping background to spatial renderings."
  },
  "aboutMeta": {
    "zh": "句容农林职业技术学院 · 风景园林　|　景观设计师证书 · C1 驾照",
    "en": "Jurong Agriculture & Forestry Vocational College · Landscape Architecture　|　Landscape Designer Certificate · C1 License"
  },
  "worksGallery": [
    {
      "url": "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
      "caption": ""
    },
    {
      "url": "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif"
    },
    {
      "url": "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
    }
  ],
  "resume": [
    {
      "num": "01",
      "period": "2025 – 2026 · 泰兴(泰州)",
      "company": {
        "zh": "泰兴新浩达开发有限公司（储能电池）",
        "en": "Taixing XinhaoDa Dev Co. (Energy Storage)"
      },
      "title": {
        "zh": "电商美工",
        "en": "E-commerce Artist"
      },
      "label": {
        "zh": "工业 / B2B 电商",
        "en": "Industrial / B2B E-commerce"
      },
      "description": {
        "zh": "储能电池行业电商视觉设计，工业产品图精修与店铺/官网视觉。",
        "en": "E-commerce visual design for energy-storage batteries; industrial product retouching and store/official-site visuals."
      }
    },
    {
      "num": "02",
      "period": "2024 – 2025 · 盐城",
      "company": {
        "zh": "盐城万凌科电商（儿童DIY玩具）",
        "en": "Yancheng Wanlinke E-commerce (Kids DIY Toys)"
      },
      "title": {
        "zh": "电商美工 / 做图",
        "en": "E-commerce Artist"
      },
      "label": {
        "zh": "玩具 / 亲子视觉",
        "en": "Toy / Parenting Visuals"
      },
      "description": {
        "zh": "儿童 DIY 玩具类目主图/详情页/活动视觉。",
        "en": "Main images, detail pages and campaign visuals for kids DIY toy category."
      }
    },
    {
      "num": "03",
      "period": "2022 – 2024 · 盐城",
      "company": {
        "zh": "原典一体化污水处理系统有限公司",
        "en": "Yuandian Integrated Sewage Treatment Sys Co."
      },
      "title": {
        "zh": "电商美工 / 做图",
        "en": "E-commerce Artist / Visuals"
      },
      "label": {
        "zh": "网页 + 电商视觉",
        "en": "Web + E-commerce Visuals"
      },
      "description": {
        "zh": "公司官网/电商图文设计（老板请不起 UI，由电商设计兼顾网页视觉）。以“做图”为主，兼顾简单网页视觉。",
        "en": "Official-site and e-commerce graphics (no budget for a UI designer, so the e-commerce designer also handled web visuals). Image production focused, plus light web visuals."
      }
    },
    {
      "num": "04",
      "period": "2021 – 2022 · 南京",
      "company": {
        "zh": "丰璞电商",
        "en": "Fengpu E-commerce"
      },
      "title": {
        "zh": "设计 + 视频剪辑",
        "en": "Designer + Video Editor"
      },
      "label": {
        "zh": "电商 / 视频",
        "en": "E-commerce / Video"
      },
      "description": {
        "zh": "电商主图/详情页设计，并负责商品展示视频剪辑。打通“静态图 + 短视频”内容产出链路。",
        "en": "E-commerce main images/detail pages plus product showcase video editing; bridged static-image and short-video production."
      }
    },
    {
      "num": "05",
      "period": "2020 – 2021 · 南京",
      "company": {
        "zh": "优艾丝（天猫/淘宝/京东）",
        "en": "Youaisi (Tmall / Taobao / JD)"
      },
      "title": {
        "zh": "平台视觉",
        "en": "Platform Visual Designer"
      },
      "label": {
        "zh": "多平台电商",
        "en": "Multi-platform E-commerce"
      },
      "description": {
        "zh": "多平台店铺视觉统一与大促页面设计。",
        "en": "Unified multi-platform store visuals and big-sale campaign pages."
      }
    },
    {
      "num": "06",
      "period": "2019 – 2020 · 南京",
      "company": {
        "zh": "南京奇好农产品",
        "en": "Nanjing Qihao Produce"
      },
      "title": {
        "zh": "运营兼美工 / 小程序",
        "en": "Ops + Artist / Mini-program"
      },
      "label": {
        "zh": "电商 / 小程序",
        "en": "E-commerce / Mini-program"
      },
      "description": {
        "zh": "独立设计微信小程序界面与推广物料，兼顾运营视觉。",
        "en": "Independently designed WeChat mini-program UI and promo materials, also handling operation visuals."
      }
    },
    {
      "num": "07",
      "period": "2016 – 2019 · 南京",
      "company": {
        "zh": "千言万语（食品/曲奇巧克力）",
        "en": "Qianyanwan (Food / Cookies & Chocolate)"
      },
      "title": {
        "zh": "电商美工",
        "en": "E-commerce Artist"
      },
      "label": {
        "zh": "食品视觉",
        "en": "Food Visuals"
      },
      "description": {
        "zh": "食品类目主图/详情页设计，强调食欲感与品牌调性。",
        "en": "Main images/detail pages for food category, emphasizing appetite appeal and brand tone."
      }
    },
    {
      "num": "08",
      "period": "2016 – 2019 · 南京",
      "company": {
        "zh": "龙居网（建材）",
        "en": "Longju Web (Building Materials)"
      },
      "title": {
        "zh": "电商美工",
        "en": "E-commerce Artist"
      },
      "label": {
        "zh": "产品精修 / 场景",
        "en": "Product Retouch / Scenes"
      },
      "description": {
        "zh": "建材类目产品图精修与场景合成，输出统一视觉。",
        "en": "Building-material product retouching and scene compositing with consistent visuals."
      }
    },
    {
      "num": "09",
      "period": "2016 – 2019 · 南京",
      "company": {
        "zh": "第八城（花茶）",
        "en": "Dibache (Floral Tea)"
      },
      "title": {
        "zh": "电商美工",
        "en": "E-commerce Artist"
      },
      "label": {
        "zh": "电商视觉",
        "en": "E-commerce Visuals"
      },
      "description": {
        "zh": "花茶店铺主图、详情页、活动视觉整体设计。建立店铺视觉规范，提升点击与转化。",
        "en": "End-to-end floral-tea store visuals (main images, detail pages, campaigns); built visual standards to lift CTR and conversion."
      }
    },
    {
      "num": "10",
      "period": "2015 – 2016 · 南京",
      "company": {
        "zh": "达内科技",
        "en": "Dane Tech (Training)"
      },
      "title": {
        "zh": "前端培训（未完结）",
        "en": "Front-end Training (Unfinished)"
      },
      "label": {
        "zh": "前端基础",
        "en": "Front-end Basics"
      },
      "description": {
        "zh": "学习 HTML/CSS/JS 前端基础，建立网页结构思维。未完结即转自学，并沿“前端 + 视觉”路径切入电商设计。",
        "en": "Studied HTML/CSS/JS fundamentals and built web-structure thinking. Left unfinished to self-study, then pivoted into e-commerce design via the 'front-end + visuals' path."
      }
    },
    {
      "num": "11",
      "period": "2014 – 2015 · 上海",
      "company": {
        "zh": "上海百安居「思源」专柜",
        "en": "B&Q 'Siyuan' Counter (Shanghai)"
      },
      "title": {
        "zh": "销售（深圳公司）",
        "en": "Sales (Shenzhen-based Co.)"
      },
      "label": {
        "zh": "销售 / 商务",
        "en": "Sales / Business"
      },
      "description": {
        "zh": "活性炭产品门店销售、客户咨询与需求挖掘。锻炼客户需求洞察与沟通表达，反哺后续“懂业务”的设计。",
        "en": "In-store sales of activated-carbon products, customer consulting and needs mining; honed client insight and communication that later fed 'business-aware' design."
      }
    },
    {
      "num": "12",
      "period": "2013 – 2014 · 高邮",
      "company": {
        "zh": "南京路友有限公司",
        "en": "Nanjing Luyou Co."
      },
      "title": {
        "zh": "园林景观设计",
        "en": "Landscape Designer"
      },
      "label": {
        "zh": "空间 / 景观",
        "en": "Space / Landscape"
      },
      "description": {
        "zh": "参与园林景观配套工程的方案图、施工图辅助绘制与景观效果图制作。奠定空间/景观效果图功底，是后续 3D 渲染强项的基础。",
        "en": "Assisted with landscape supporting-engineering schematic/construction drawings and renderings; built the spatial/landscape foundation behind the later 3D-rendering strength."
      }
    }
  ]
};
