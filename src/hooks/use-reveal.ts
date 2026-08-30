import { useEffect, useRef } from "react";

/**
 * Reveal-on-scroll. Fires once.
 *
 * Fail-safe by design: the CSS leaves content visible until this hook adds
 * `reveal-armed`. If the ref never attaches, JS never runs, or the observer
 * never delivers, the content is simply visible - it can never be stranded
 * at opacity 0, which is a far worse failure than a missing animation.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    let io: IntersectionObserver | null = null;
    let raf = 0;

    const show = () => {
      el.classList.add("is-visible");
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };

    function onScroll() {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight - 80 && r.bottom > 0) show();
    }

    // Opt in to hiding only once we know we can undo it.
    el.classList.add("reveal-armed");

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Already on screen: reveal next frame so it transitions rather than snaps.
      raf = requestAnimationFrame(show);
    } else {
      // threshold 0, not a ratio: an element taller than the viewport can
      // never reach a ratio like 0.15 and would stay hidden forever.
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) show();
        },
        { threshold: 0, rootMargin: "0px 0px -80px 0px" },
      );
      io.observe(el);
      // Belt and braces if the observer never delivers.
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return ref;
}
