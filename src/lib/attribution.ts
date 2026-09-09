/**
 * 渠道归因工具。
 * 私域运营核心：区分每条线索来自哪个入口（首页/作品集/资料包/外部投放）。
 * 支持 URL ?ref=xxx 覆盖，便于在小红书/朋友圈等外部分发时打渠道标签。
 */
export function getRefSource(defaultSource: string): string {
  if (typeof window === "undefined") return defaultSource;
  try {
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref && ref.trim()) return "ref_" + ref.trim().slice(0, 40);
  } catch {
    /* ignore */
  }
  return defaultSource;
}
