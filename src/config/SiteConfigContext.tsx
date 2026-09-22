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
  // 安全默认（fail-closed）：宁可锁死也不要在无后端时开门。
  // 后端可达且明确返回 authEnabled=false（本机免密模式）才解锁；否则一律要求登录。
  const [authEnabled, setAuthEnabled] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  // 静态兜底配置：Cloudflare Pages 纯静态托管时使用（/siteConfig.json 编译进 dist/）
  const loadFromStatic = useCallback(async (): Promise<SiteConfig | null> => {
    try {
      const r = await fetch("/siteConfig.json", { cache: "no-store", credentials: "include" });
      if (!r.ok) return null;
      const json = await r.json();
      if (json && typeof json === "object" && Object.keys(json).length) return json as SiteConfig;
      return null;
    } catch {
      return null;
    }
  }, []);

  // 拉取后端（本地 / 自有服务器）：成功返回 true，失败返回 false（走静态兜底）
  const loadFromBackend = useCallback(async (): Promise<boolean> => {
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

  useEffect(() => {
    // 加载策略：
    // 1) 优先拉后端（本地/自有服务器，支持 /admin 实时编辑）；成功即接管并停止。
    // 2) 后端不可用（Cloudflare Pages 纯静态）→ 拉 /siteConfig.json 兜底，并标记 loaded 防无限转圈。
    // 3) 后台有限轮询后端：本地/自有服务器冷启动就绪后自动升级为实时配置（/admin 编辑即时可见）；
    //    轮询有次数上限，纯静态环境不会无限打请求。
    let cancelled = false;
    let backoff = 2000;
    let attempts = 0;
    const MAX_BACKOFF = 30000;
    const MAX_ATTEMPTS = 12;

    const init = async () => {
      if (!cancelled && (await loadFromBackend())) {
        setLoaded(true);
        return;
      }
      const staticJson = await loadFromStatic();
      if (!cancelled && staticJson) {
        setConfig(deepMerge(defaultSiteConfig, staticJson));
      }
      // 关键：无论后端/静态是否就绪，都标记已加载，避免首页无限转圈（纯静态必须）
      if (!cancelled) setLoaded(true);

      const poll = async () => {
        if (cancelled || ++attempts > MAX_ATTEMPTS) return;
        const ok = await loadFromBackend();
        if (ok) {
          setLoaded(true);
          return; // 后端已接管，停止轮询
        }
        backoff = Math.min(backoff * 1.8, MAX_BACKOFF);
        setTimeout(poll, backoff);
      };
      setTimeout(poll, backoff);
    };

    void init();
    return () => {
      cancelled = true;
    };
  }, [loadFromBackend, loadFromStatic]);

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
