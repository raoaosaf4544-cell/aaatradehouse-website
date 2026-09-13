/**
 * Per-route canonical and og:url.
 *
 * WHY THIS EXISTS
 * ---------------
 * vercel.json rewrites every path to index.html, and index.html hard-codes
 *
 *   <link rel="canonical" href="https://www.aaatradehouse.com/" />
 *
 * so /products and /export were both serving a canonical pointing at the
 * HOMEPAGE. That is not a missing optimisation, it is an instruction to
 * Google saying "these pages are duplicates of /, index that instead" -
 * the site was actively suppressing its own two deepest pages.
 *
 * PageShell already rewrites the title and the meta description per page.
 * It never touched the canonical, which is the one that decides whether
 * the page is eligible to rank at all.
 *
 * UNKNOWN PATHS
 * -------------
 * The rewrite means /anything returns HTTP 200 with the 404 page rendered
 * client-side - a soft 404. Google indexes soft 404s as thin duplicates.
 * Until the response can carry a real 404 status, an unknown path gets
 * `noindex` and no canonical, which is the correct signal.
 */
const ORIGIN = "https://www.aaatradehouse.com";

function setLink(rel: string, href: string | null) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function setMeta(property: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[property="${property}"]`,
  );
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setName(name: string, content: string | null) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * @param path   the resolved route, already normalised ("/" or "/products")
 * @param known  false for a path that matched no route
 */
export function applyCanonical(path: string, known: boolean) {
  if (!known) {
    setLink("canonical", null);
    setMeta("og:url", null);
    setName("robots", "noindex, follow");
    return;
  }
  // "follow" is deliberate even on a real page: there is nothing to
  // suppress, and leaving the tag off entirely is the same as index,follow.
  setName("robots", null);
  const url = ORIGIN + (path === "/" ? "/" : path);
  setLink("canonical", url);
  setMeta("og:url", url);
}
