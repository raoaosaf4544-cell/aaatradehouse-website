import { beforeEach, describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { applyCanonical } from "@/lib/seo";

/**
 * The canonical is the tag that decides whether a page may rank at all,
 * and it was wrong in a way nothing would have caught: index.html ships
 * one hard-coded to the homepage, vercel.json serves that same file for
 * every route, so /products and /export were telling Google they were
 * duplicates of /. These tests exist so that cannot come back.
 */
const canonical = () =>
  document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ??
  null;
const ogUrl = () =>
  document.head
    .querySelector<HTMLMetaElement>('meta[property="og:url"]')
    ?.getAttribute("content") ?? null;
const robots = () =>
  document.head
    .querySelector<HTMLMetaElement>('meta[name="robots"]')
    ?.getAttribute("content") ?? null;

describe("canonical URL", () => {
  beforeEach(() => {
    document.head.innerHTML =
      '<link rel="canonical" href="https://www.aaatradehouse.com/" />';
  });

  it("points a deep page at itself, not at the homepage", () => {
    applyCanonical("/products", true);
    expect(canonical()).toBe("https://www.aaatradehouse.com/products");
    expect(ogUrl()).toBe("https://www.aaatradehouse.com/products");
  });

  it("leaves the homepage canonical at the origin root", () => {
    applyCanonical("/", true);
    expect(canonical()).toBe("https://www.aaatradehouse.com/");
  });

  it("does not emit robots on a real page", () => {
    applyCanonical("/export", true);
    expect(robots()).toBeNull();
  });

  it("noindexes an unknown path and gives it no canonical", () => {
    // The rewrite returns 200 for /nope with the 404 rendered client-side.
    // A soft 404 with a canonical is worse than no canonical: it invites
    // the page to be indexed as a thin duplicate.
    applyCanonical("/nope", false);
    expect(canonical()).toBeNull();
    expect(robots()).toBe("noindex, follow");
  });

  it("every route in the sitemap is one the router answers", () => {
    const sitemap = readFileSync("public/sitemap.xml", "utf8");
    const app = readFileSync("src/App.tsx", "utf8");
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      m[1].replace("https://www.aaatradehouse.com", "").replace(/\/$/, ""),
    );
    expect(locs.length).toBeGreaterThan(0);
    for (const path of locs) {
      // "" is the homepage, which App maps as "/"
      expect(app).toContain(`"${path || "/"}"`);
    }
  });
});

describe("answer-engine surface", () => {
  it("llms.txt states the business without needing JavaScript", () => {
    const t = readFileSync("public/llms.txt", "utf8");
    expect(t).toContain("info@aaatradehouse.com");
    expect(t).toContain("+92 317 4286226");
    expect(t).toContain("2501"); // HS heading buyers search for
    expect(t).toContain("Khanewal");
    // The one thing that must never appear: a health claim.
    expect(t).toMatch(/make no health claims/i);
  });

  it("robots.txt names the answer engines explicitly", () => {
    const t = readFileSync("public/robots.txt", "utf8");
    for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot", "OAI-SearchBot"]) {
      expect(t).toContain(bot);
    }
    expect(t).toContain("Sitemap: https://www.aaatradehouse.com/sitemap.xml");
  });
});

describe("prerendering", () => {
  it("the build actually runs the prerender step", () => {
    // Without this the site silently reverts to shipping an empty
    // <div id="root"> and every answer engine goes blind again.
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    expect(pkg.scripts.build).toContain("scripts/prerender.mjs");
  });

  it("the prerender covers every route the router answers", () => {
    const script = readFileSync("scripts/prerender.mjs", "utf8");
    const app = readFileSync("src/App.tsx", "utf8");
    const routes = [...app.matchAll(/^\s*"(\/[a-z]*)":/gm)].map((m) => m[1]);
    expect(routes.length).toBeGreaterThan(1);
    for (const r of routes) expect(script).toContain(`"${r}"`);
  });
});

describe("entity graph", () => {
  const graph = () => {
    const html = readFileSync("index.html", "utf8");
    const m = html.match(
      /<script type="application\/ld\+json">\s*(\{[\s\S]*?\})\s*<\/script>/,
    );
    return JSON.parse(m![1])["@graph"] as Record<string, unknown>[];
  };
  const node = (type: string) => graph().find((n) => n["@type"] === type)!;

  it("says the company is a trading house, not only a salt brand", () => {
    // An engine reading this page could previously only conclude "salt
    // company": the trading-house relationship existed as a bare
    // legalName and in no description anywhere.
    const org = node("Organization") as Record<string, string>;
    expect(org.legalName).toBe("AAA General Trading");
    expect(org.description).toMatch(/general trading and export company/i);
    expect(org.foundingDate).toBe("2009");
  });

  it("carries both real locations", () => {
    const plant = node("Place") as Record<string, Record<string, string>>;
    expect(plant.address.addressLocality).toBe("Khanewal");
    const biz = node("LocalBusiness") as Record<string, Record<string, string>>;
    expect(biz.address.addressLocality).toBe("Lahore");
  });

  it("claims no export record outside salt", () => {
    // One completed export shipment. A broad capability claim is exactly
    // what fails at due diligence, so it must not creep into the entity
    // layer where nobody reads it back.
    const blob = JSON.stringify(graph()) + readFileSync("public/llms.txt", "utf8");
    expect(blob).not.toMatch(/years of export|established exporter|we export everything/i);
    expect(readFileSync("public/llms.txt", "utf8")).toMatch(
      /No claim is made here to an established export record/i,
    );
  });
});
