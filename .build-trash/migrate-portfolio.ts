import { defaultSiteConfig } from "./src/config/siteConfig.ts";

async function main() {
  const base = "http://localhost:9111";
  const res = await fetch(base + "/api/config");
  const current = await res.json();
  console.log("GET keys:", Object.keys(current).join(","));

  const merged: any = {
    ...current,
    resume: defaultSiteConfig.resume,
    portfolio: defaultSiteConfig.portfolio,
    nav: { ...(current.nav || {}), portfolio: defaultSiteConfig.nav.portfolio },
    projects: Array.isArray(current.projects)
      ? current.projects.slice(1)
      : defaultSiteConfig.projects.slice(1),
  };

  const r2 = await fetch(base + "/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ config: merged }),
  });
  console.log("POST /api/config status:", r2.status);
  if (!r2.ok) {
    const t = await r2.text().catch(() => "");
    console.error("POST failed:", t);
    process.exit(1);
  }

  // 重新拉取验证
  const verify = await (await fetch(base + "/api/config")).json();
  console.log("verify resume length:", (verify.resume || []).length);
  console.log("verify projects length:", (verify.projects || []).length);
  console.log("verify portfolio cats:", (verify.portfolio?.categories || []).length);
  console.log("verify nav.portfolio:", verify.nav?.portfolio);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
