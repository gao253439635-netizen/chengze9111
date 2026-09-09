import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  defaultSiteConfig,
  pick,
  SiteConfig,
} from "./siteConfig";

// 深合并：对象递归合并，数组整体替换
function deepMerge<T>(base: T, override: any): T {
  if (override === null || override === undefined) return base;
  if (Array.isArray(base) || Array.isArray(override)) {
    return (Array.isArray(override) ? override : base) as T;
  }
  if (typeof base === "object" && typeof override === "object") {
    const out: any = { ...(base as any) };
    for (const key of Object.keys(override)) {
      out[key] = deepMerge((base as any)[key], override[key]);
    }
    return out;
  }
  return override as T;
}

interface SiteConfigContextType {
  config: SiteConfig;
  loaded: boolean;
  save: (next: SiteConfig) => Promise<void>;
}

const SiteConfigContext = createContext<SiteConfigContextType | undefined>(
  undefined
);

export function SiteConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [config, setConfig] = useState<SiteConfig>(defaultSiteConfig);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/config", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (!active) return;
        if (data && typeof data === "object" && Object.keys(data).length) {
          setConfig(deepMerge(defaultSiteConfig, data));
        }
        setLoaded(true);
      })
      .catch(() => {
        if (active) setLoaded(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // 把配色写入 CSS 变量，全站即时生效
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--c-ink", config.theme.ink);
    root.style.setProperty("--c-accent", config.theme.accent);
    root.style.setProperty("--c-dot", config.theme.dot);
  }, [config.theme]);

  // 免密保存：后台无需密码即可写回（按需求：进入后台不输入密码）
  const save = useCallback(async (next: SiteConfig) => {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config: next }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "保存失败（服务异常）");
    }
    setConfig(next);
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loaded, save }}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    throw new Error("useSiteConfig must be used within SiteConfigProvider");
  }
  return ctx;
}

export { pick };
