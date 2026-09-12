import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/**
 * How far an element has travelled through the viewport, 0 to 1.
 *
 * 0 when its top edge is still at the bottom of the screen, 1 once its
 * bottom edge has reached the top. Used to draw the export route as the
 * section is read, and to drift the hero image behind its type.
 *
 * Reduced motion returns 1 and never attaches a listener: the rail shows
 * fully drawn and nothing moves. That is the correct end state, not a
 * degraded one - the information is the route, not the drawing of it.
 *
 * Reads are batched into a rAF and the listener is passive, so scrolling
 * is never blocked on layout. Without the frame guard this fires on every
 * scroll event and forces a synchronous reflow each time.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(reduced ? 1 : 0);

  useEffect(() => {
    if (reduced) {
      setProgress(1);
      return;
    }

    const el = ref.current;
    if (!el) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Span from "top edge entering the bottom" to "bottom edge leaving
      // the top", so the value covers the whole time the element is on
      // screen rather than only while it is centred.
      const total = r.height + vh;
      const travelled = vh - r.top;
      const p = travelled / total;
      setProgress(p < 0 ? 0 : p > 1 ? 1 : p);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return [ref, progress] as const;
}
