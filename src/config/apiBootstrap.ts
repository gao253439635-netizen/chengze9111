// 路线A 部署桥接：仅当构建时注入 VITE_API_BASE（后台域名）才生效。
// 作用：把前端所有 `/api/*` 请求自动指到后台地址；未设置时完全无副作用（走同源/代理，和本机一致）。
// 用全局 fetch 重写一处覆盖全部调用点，避免逐个改 6 个文件的 12 处请求。

const raw = (import.meta as any).env?.VITE_API_BASE as string | undefined;
const API_BASE = raw ? raw.replace(/\/+$/, "") : "";

if (API_BASE) {
  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string" && input.startsWith("/api")) {
      return originalFetch(API_BASE + input, init);
    }
    return originalFetch(input, init);
  }) as typeof window.fetch;
}

export const API_BASE_URL = API_BASE;
