/**
 * Render every route to static HTML at build time.
 *
 * WHY
 * ---
 * The site is a client-rendered React app, so dist/index.html shipped
 * `<div id="root"></div>` and nothing else. Google runs JavaScript and
 * indexed it anyway; GPTBot, ClaudeBot, PerplexityBot and OAI-SearchBot
 * do not run JavaScript at all, so to every answer engine the site was a
 * blank page with some JSON-LD attached. No amount of keyword work fixes
 * that - the words have to be in the response.
 *
 * WHY THIS APPROACH
 * -----------------
 * react-dom/server, which React already ships. No Puppeteer (a ~170 MB
 * Chromium download in the Vercel build), no framework migration, no new
 * dependency of any kind, and the output is still plain static files on
 * the free tier - no serverless functions, no runtime, no cold starts.
 *
 * The alternatives were worse for this codebase: vite-react-ssg wants
 * react-router and this app has a twenty-line hand-rolled router;
 * prerender-spa-plugin and react-snap are both browser-driven and
 * effectively unmaintained.
 *
 * HOW
 * ---
 * `vite build` produces the client bundle and the HTML template.
 * `vite build --ssr` produces a Node build of entry-server.
 * This script renders each route, injects the markup into the template,
 * and writes dist/<route>/index.html.
 *
 * Vercel checks the filesystem before applying rewrites, so /products is
 * served from dist/products/index.html and the catch-all in vercel.json
 * only ever catches paths that genuinely do not exist.
 */
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIST = path.join(ROOT, "dist");
const SSR = path.join(ROOT, "dist-ssr");
const ORIGIN = "https://www.aaatradehouse.com";

// Kept in step with the router by a test, not by hope: src/test/seo.test.ts
// asserts every sitemap URL is a route App answers, and this list is
// asserted against the sitemap below.
const ROUTES = ["/", "/products", "/export", "/privacy"];

const entry = path.join(SSR, "entry-server.js");
if (!existsSync(entry)) {
  console.error(`prerender: missing ${entry}\nRun the ssr build first.`);
  process.exit(1);
}
const { render } = await import(`file://${entry}`);

const template = await readFile(path.join(DIST, "index.html"), "utf8");

// The template must contain an empty root for the markup to go into. If a
// previous run already filled it we would nest one app inside another.
if (!template.includes('<div id="root"></div>')) {
  console.error('prerender: dist/index.html has no empty <div id="root"></div>');
  process.exit(1);
}

// Every route the sitemap advertises has to be one we actually prerender,
// or we are telling Google about pages that ship blank.
const sitemap = await readFile(path.join(DIST, "sitemap.xml"), "utf8");
const advertised = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((m) => m[1].replace(ORIGIN, "").replace(/\/$/, "") || "/");
const missing = advertised.filter((u) => !ROUTES.includes(u));
if (missing.length) {
  console.error(`prerender: sitemap advertises un-prerendered routes: ${missing}`);
  process.exit(1);
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;");

/**
 * Replace a head tag, or insert it if the template has none.
 *
 * Insert-if-missing matters: index.html carries a canonical but no
 * og:url, and the tags are written across several lines, so a
 * replace-only pass matching a single line fails on both counts.
 */
function setTag(html, pattern, tag) {
  if (pattern.test(html)) return html.replace(pattern, tag);
  return html.replace("</head>", `  ${tag}
  </head>`);
}

let total = 0;
for (const route of ROUTES) {
  const { html, head } = render(route);

  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);

  // The head that PageShell would have set in the browser. The homepage is
  // not wrapped in PageShell and correctly keeps the template's own.
  if (head.title) {
    page = setTag(page, /<title>[\s\S]*?<\/title>/, `<title>${esc(head.title)}</title>`);
  }
  if (head.description) {
    page = setTag(
      page,
      /<meta\s[^>]*name="description"[^>]*>/,
      `<meta name="description" content="${esc(head.description)}" />`,
    );
  }

  // Canonical and og:url, written statically so they are correct for a
  // crawler that never runs the script which would otherwise set them.
  const url = ORIGIN + (route === "/" ? "/" : route);
  page = setTag(
    page,
    /<link\s[^>]*rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}" />`,
  );
  page = setTag(
    page,
    /<meta\s[^>]*property="og:url"[^>]*>/,
    `<meta property="og:url" content="${url}" />`,
  );

  const outDir = route === "/" ? DIST : path.join(DIST, route);
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), page, "utf8");

  const text = page
    .slice(page.indexOf('<div id="root">'))
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length < 500) {
    console.error(`prerender: ${route} produced only ${text.length} chars of text`);
    process.exit(1);
  }
  total += text.length;
  console.log(`  ${route.padEnd(10)} ${String(text.length).padStart(6)} chars of readable text`);
}

// The SSR bundle is a build artefact, not something to deploy.
await rm(SSR, { recursive: true, force: true });
console.log(`prerendered ${ROUTES.length} routes, ${total} chars total`);
