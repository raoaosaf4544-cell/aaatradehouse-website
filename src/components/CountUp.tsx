import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up when it scrolls into view. Fires once.
 *
 * Fail-safe: the final value is what renders unless we know we can animate,
 * so a missing observer or reduced-motion preference simply shows the number.
 *
 * Values are parsed as "<digits><suffix>" - "100+" counts to 100 and keeps
 * the plus. Years are not counted: watching 1994 spin up from zero reads as
 * a broken odometer, not a statistic.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const isYear = target >= 1900;
  const countable = !!match && !isYear && target > 0;

  const canAnimate =
    countable &&
    typeof window !== "undefined" &&
    typeof IntersectionObserver !== "undefined" &&
    !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const ref = useRef<HTMLSpanElement>(null);
  // FAIL-SAFE: hold the real number. We only drop to zero at the moment the
  // animation actually starts. A counter that fails mid-flight would otherwise
  // display a wrong figure - "0 tonnes per month" is worse than no animation.
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!canAnimate) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let io: IntersectionObserver | null = null;

    const run = () => {
      const DURATION = 1100;
      setN(0);
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / DURATION, 1);
        // easeOutExpo - fast out of the gate, settles precisely on target
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setN(Math.round(eased * target));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      io?.disconnect();
    };

    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      run();
    } else {
      io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) run();
        },
        { threshold: 0, rootMargin: "0px 0px -80px 0px" },
      );
      io.observe(el);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [canAnimate, target]);

  return (
    <span ref={ref} className={className}>
      {countable ? n : value}
      {countable ? suffix : ""}
    </span>
  );
}
