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
  /** 是否启用密码认证 */
  authEnabled: boolean;
  /** 当前是否已登录 */
  loggedIn: boolean;
  /** 登录：输入密码，成功后写入 session cookie */
  login: (password: string) => Promise<boolean>;
  /** 退出登录：清除 session cookie */
  logout: () => Promise<void>;
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
  const [authEnabled, setAuthEnabled] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // 检查认证状态
  const checkAuth = useCallback(async () => {
    try {
      const r = await fetch("/api/config", { cache: "no-store", credentials: "include" });
      if (r.status === 401) {
        setAuthEnabled(true);
        setLoggedIn(false);
      } else if (r.ok) {
        setAuthEnabled(true);
        setLoggedIn(true);
        // 重新加载配置
        const json = await r.json();
        if (json && typeof json === "object" && Object.keys(json).length) {
          setConfig(deepMerge(defaultSiteConfig, json));
        }
        setLoaded(true);
      } else {
        setAuthEnabled(false);
        setLoaded(true);
      }
    } catch {
      setAuthEnabled(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    // 先检查认证状态
    checkAuth().then(() => {
      if (!active) return;
      // 如果未认证且需要认证，不自动加载配置；否则正常加载
      if (!authEnabled || loggedIn) {
        fetch("/api/config", { cache: "no-store", credentials: "include" })
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
      }
    });
    return () => { active = false; };
  }, [authEnabled, loggedIn, checkAuth]);

  // 把配色写入 CSS 变量，全站即时生效
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--c-ink", config.theme.ink);
    root.style.setProperty("--c-accent", config.theme.accent);
    root.style.setProperty("--c-dot", config.theme.dot);
  }, [config.theme]);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const r = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });
    if (r.ok) {
      setLoggedIn(true);
      // 登录后加载配置
      fetch("/api/config", { cache: "no-store", credentials: "include" })
        .then((r) => (r.ok ? r.json() : {}))
        .then((data) => {
          if (data && typeof data === "object" && Object.keys(data).length) {
            setConfig(deepMerge(defaultSiteConfig, data));
          }
          setLoaded(true);
        })
        .catch(() => setLoaded(true));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(async () => {
    // 清除 cookie（让服务端置空）
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    document.cookie = "admin_session=; path=/; max-age=0";
    setLoggedIn(false);
    setLoaded(false);
    setConfig(defaultSiteConfig);
  }, []);

  const save = useCallback(async (next: SiteConfig) => {
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ config: next }),
    });
    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      throw new Error(msg || "保存失败（服务异常）");
    }
    setConfig(next);
  }, []);

  return (
    <SiteConfigContext.Provider value={{ config, loaded, save, authEnabled, loggedIn, login, logout }}>
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
