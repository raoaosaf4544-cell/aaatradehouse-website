/**
 * Head collection for the prerender pass.
 *
 * PageShell sets the title and meta description in an effect, which is
 * exactly right in the browser and useless on the server: effects do not
 * run during renderToString, so every prerendered page would ship the
 * homepage's title.
 *
 * Rather than duplicate the strings into the build script - where they
 * would drift from the components the moment anyone edited a page - the
 * shell records them here as it renders, and the server entry reads them
 * back once the render has finished.
 *
 * A module-level variable is safe for this because renderToString is a
 * single synchronous pass per page, and the build renders one route at a
 * time. It is not safe for a streaming or concurrent server, and there
 * isn't one: this runs at build time and the output is static files.
 */
export type Head = { title?: string; description?: string };

let collected: Head = {};

/** Called during render. A no-op in the browser, where the effect in
 *  PageShell owns the document instead. */
export function collectHead(head: Head) {
  if (typeof window !== "undefined") return;
  collected = { ...collected, ...head };
}

/** Read and reset, so one route's title cannot leak into the next. */
export function takeHead(): Head {
  const out = collected;
  collected = {};
  return out;
}
