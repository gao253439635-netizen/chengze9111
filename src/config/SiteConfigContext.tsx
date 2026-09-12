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

  // 拉取认证状态 + 公开配置：成功返回 true，失败（含后端冷启动未就绪）返回 false
  const tryLoadConfig = useCallback(async (): Promise<boolean> => {
    try {
      const stR = await fetch("/api/v1/auth/status", { cache: "no-store", credentials: "include" });
      if (!stR.ok) return false;
      const st = await stR.json();
      setAuthEnabled(!!st.authEnabled);
      setLoggedIn(!!st.loggedIn);

      const cfgR = await fetch("/api/config", { cache: "no-store", credentials: "include" });
      if (!cfgR.ok) return false;
      const json = await cfgR.json();
      if (json && typeof json === "object" && Object.keys(json).length) {
        setConfig(deepMerge(defaultSiteConfig, json));
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  // 检查认证状态 + 拉取配置，带退避重试。
  // 关键：后端冷启动（~1.5min）期间绝不把 loaded 置 true，
  // 避免首页回退到编译进包的 defaultSiteConfig（旧作品集 = "老连接"）。
  // 只有真正拉到 /api/config 才置 loaded=true；失败则保持 false 并退避重试。
  const checkAuth = useCallback(() => {
    let cancelled = false;
    let backoff = 1000;
    const MAX_BACKOFF = 8000;

    const attempt = async () => {
      if (cancelled) return;
      const ok = await tryLoadConfig();
      if (ok) {
        setLoaded(true);
        return;
      }
      scheduleRetry();
    };

    const scheduleRetry = () => {
      if (cancelled) return;
      setTimeout(() => {
        if (cancelled) return;
        backoff = Math.min(backoff * 2, MAX_BACKOFF);
        void attempt();
      }, backoff);
    };

    void attempt();
    return () => {
      cancelled = true;
    };
  }, [tryLoadConfig]);

  useEffect(() => {
    // 首次挂载：探测认证状态 + 拉取公开配置（失败自动退避重试）
    const cancel = checkAuth();
    return cancel;
  }, [checkAuth]);

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
