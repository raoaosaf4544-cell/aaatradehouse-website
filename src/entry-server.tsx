import { renderToString } from "react-dom/server";
import App from "./App";
import { takeHead } from "@/lib/head";

/**
 * The build-time entry. Renders one route to a string of HTML.
 *
 * This exists so the site ships readable markup instead of an empty
 * <div id="root">. Google executes JavaScript; GPTBot, ClaudeBot and
 * PerplexityBot do not, so before this the answer engines could see the
 * JSON-LD and nothing else - no headings, no FAQ, no product copy.
 *
 * Deliberately NOT a server: there is no runtime here. scripts/prerender.mjs
 * calls this once per route at build time and writes static files, so
 * hosting stays a plain static deploy on the free tier with no functions,
 * no cold starts and no change to how the site is served.
 *
 * Effects do not run during renderToString, which is the whole reason this
 * is safe: every scroll listener, IntersectionObserver, matchMedia probe
 * and localStorage read in the app lives in an effect and simply does not
 * fire. The reveal animations, the consent banner and the forms all wake
 * up on hydration exactly as they do now.
 */
export function render(url: string) {
  const html = renderToString(<App url={url} />);
  return { html, head: takeHead() };
}
