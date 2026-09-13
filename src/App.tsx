import { useEffect } from "react";
import Index from "./pages/Index";
import Privacy from "./pages/Privacy";
import ProductsPage from "./pages/ProductsPage";
import ExportPage from "./pages/ExportPage";
import NotFound from "./pages/NotFound";
import ConsentBanner from "@/components/ConsentBanner";
import { applyConsent, readConsent } from "@/lib/consent";
import { applyCanonical } from "@/lib/seo";

/**
 * Routing, such as it is.
 *
 * This replaced react-router-dom, which carried the only high-severity
 * advisory that actually reached a visitor's browser (open redirect via
 * protocol-relative URLs and a backslash bypass of CVE-2025-68470). Every
 * other high in `npm audit` is a devDependency and never ships.
 *
 * What it was doing for us: mapping three paths to three components. There
 * is no nested routing, no loader, no data API and no client-side
 * navigation anywhere on the site - every in-page link is a hash anchor,
 * and the only cross-page links are plain <a href>. So a full page load is
 * the correct behaviour for those, which means no pushState, no history
 * listener, and no popstate handling is needed. Reading the path once is
 * the entire router.
 *
 * vercel.json already rewrites every path to index.html, so a direct hit on
 * /privacy boots the app and lands here.
 */
const routes: Record<string, () => JSX.Element> = {
  "/": Index,
  "/products": ProductsPage,
  "/export": ExportPage,
  "/privacy": Privacy,
};

function resolve(pathname: string) {
  // Treat /privacy/ and /privacy as the same page, but keep bare "/" intact.
  const path = pathname.replace(/\/+$/, "") || "/";
  // The path comes back as well as the component: it is what the canonical
  // is built from, and the router is the only place that knows it.
  return { Page: routes[path] ?? NotFound, path, known: path in routes };
}

/** `url` is supplied by the prerender; the browser reads its own location.
 *  Reading window during render is what made this component impossible to
 *  render on the server. */
const App = ({ url }: { url?: string } = {}) => {
  const { Page, path, known } = resolve(
    url ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
  );

  // Enforce a stored decision before first paint of any page, including
  // /privacy, so tracking state never depends on the banner being rendered.
  useEffect(() => {
    applyConsent(readConsent());
  }, []);

  // Point the canonical at THIS page. index.html ships one hard-coded to
  // the homepage and vercel.json serves that same file for every route,
  // so without this /products and /export were telling Google they were
  // duplicates of / and asking not to be indexed.
  useEffect(() => {
    applyCanonical(path, known);
  }, [path, known]);

  return (
    <>
      <Page />
      <ConsentBanner />
    </>
  );
};

export default App;
