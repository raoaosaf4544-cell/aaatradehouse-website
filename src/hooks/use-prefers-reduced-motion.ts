import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Tracks the reduced-motion preference and re-renders when it changes.
 *
 * Reading matchMedia once during render - which is what the video section
 * used to do - is only correct until the user changes the setting. After
 * that the component keeps the stale answer until something else remounts
 * it, so a visitor who turns the preference on watches the video carry on
 * looping. CSS cannot fix that one: no media query pauses a <video>.
 *
 * Returns false during SSR and on the first paint, matching the CSS
 * default, so the two never disagree about what the page should look like.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && !!window.matchMedia?.(QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia?.(QUERY);
    if (!mq) return;
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
