import { useEffect, useRef, useState } from "react";

/** Both behaviours run for this long, so the three figures in the hero
 *  spec column finish together regardless of which one they are. */
const DURATION = 1100;

/**
 * Brings a figure to life when it scrolls into view. Fires once.
 *
 * Two behaviours, one trigger and one duration:
 *
 *   COUNTABLE values ("100+", "4") count up. "100+" counts to 100 and
 *   keeps the plus.
 *
 *   YEARS do not count. Watching 2009 spin up from zero reads as a
 *   broken odometer rather than a statistic - but "not counted" is not
 *   the same as "not animated", and leaving it dead still while its
 *   neighbours moved made it look like something had failed. It slides
 *   into place from behind a mask instead: same trigger, same duration,
 *   an expression that suits a figure whose digits are not a quantity.
 *
 * FAIL-SAFE: the final value is what renders unless we know we can
 * animate. A missing observer or a reduced-motion preference simply
 * shows the number, and the counter only drops to zero at the instant
 * the animation actually starts - a counter that failed mid-flight
 * would otherwise leave "0 tonnes per month" on the page, which is
 * worse than no animation at all.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : "";
  const isYear = target >= 1900;
  const countable = !!match && !isYear && target > 0;

  const motionOk =
    typeof window !== "undefined" &&
    typeof IntersectionObserver !== "undefined" &&
    !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const canCount = countable && motionOk;
  const canSlide = !countable && motionOk;

  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(target);
  // Starts false only when a slide is actually possible; otherwise the
  // figure is simply in place from the first paint.
  const [arrived, setArrived] = useState(!canSlide);

  useEffect(() => {
    if (!canCount && !canSlide) return;
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let io: IntersectionObserver | null = null;
    const onVisible = () => {
      if (document.visibilityState === "visible") run();
    };

    const run = () => {
      io?.disconnect();
      if (canSlide) {
        setArrived(true);
        return;
      }
      // A background tab throttles requestAnimationFrame to nothing, so
      // dropping to zero here would leave "0 tonnes per month" on screen
      // until the tab is looked at. The original fail-safe only covered
      // never STARTING; this covers starting and then being frozen,
      // which is what a tab opened in the background actually does.
      // Verified: with the tab hidden the counters sat at 0 indefinitely.
      if (document.visibilityState !== "visible") {
        document.addEventListener("visibilitychange", onVisible, { once: true });
        return;
      }
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
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [canCount, canSlide, target]);

  if (countable) {
    return (
      <span ref={ref} className={className}>
        {canCount ? n : target}
        {suffix}
      </span>
    );
  }

  // The mask needs its own box, so the slid element has something to be
  // clipped by. inline-block keeps it on the text baseline inside the dd.
  return (
    <span ref={ref} className={`num-mask ${className ?? ""}`}>
      <span className={`num-slide ${arrived ? "is-in" : ""}`}>{value}</span>
    </span>
  );
}
