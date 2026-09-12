import { useCallback, useEffect, useRef } from "react";

/** How far the highlight closes toward the cursor each frame. Lower is
 *  heavier. 0.18 lands around 120ms to settle at 60fps, which matches
 *  --dur-micro closely enough that the spotlight feels part of the same
 *  system as everything else. */
const EASE = 0.18;
/** Below this, the remaining distance is invisible; stop the loop rather
 *  than run a rAF forever for sub-pixel movement. */
const SETTLED = 0.4;

type Pos = { x: number; y: number };

/**
 * Pointer-tracking for card grids: drives the `.spot` highlight and the
 * `.tilt` rotation from a single listener.
 *
 * The highlight EASES toward the cursor rather than snapping to it.
 * Tracking a pointer exactly looks mechanical - the light appears welded
 * to the cursor - whereas a little lag reads as a lamp with weight. That
 * is slow-in/slow-out applied to the tracking itself, and the reason for
 * the lerp loop instead of writing the raw coordinates.
 *
 * One listener on the grid, not one per cell: a pointer crossing a
 * hairline gap between two cells would otherwise flicker between two
 * highlights. And writes are batched into a rAF because pointermove
 * fires far faster than the screen refreshes.
 */
export function useSpotlight<T extends HTMLElement>() {
  const frame = useRef(0);
  const cell = useRef<HTMLElement | null>(null);
  const target = useRef<Pos>({ x: 0, y: 0 });
  const current = useRef<Pos>({ x: 0, y: 0 });

  const stop = useCallback(() => {
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  // A pointer can leave the window without firing pointerleave on the
  // grid, which would strand the loop running against a stale target.
  useEffect(() => stop, [stop]);

  const tick = useCallback(() => {
    frame.current = 0;
    const el = cell.current;
    if (!el) return;

    const dx = target.current.x - current.current.x;
    const dy = target.current.y - current.current.y;
    current.current.x += dx * EASE;
    current.current.y += dy * EASE;

    const box = el.getBoundingClientRect();
    if (!box.width || !box.height) return;

    el.style.setProperty("--mx", `${current.current.x}px`);
    el.style.setProperty("--my", `${current.current.y}px`);
    // Normalised -1..1 from the centre, which is what the tilt consumes.
    // Derived here rather than in a second listener: two handlers reading
    // one pointer is two chances to disagree.
    el.style.setProperty("--rx", `${(current.current.x / box.width) * 2 - 1}`);
    el.style.setProperty("--ry", `${(current.current.y / box.height) * 2 - 1}`);

    if (Math.abs(dx) > SETTLED || Math.abs(dy) > SETTLED) {
      frame.current = requestAnimationFrame(tick);
    }
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<T>) => {
      // Coarse pointers do not hover. A highlight chasing a tap is noise,
      // and the cell is already being pressed.
      if (e.pointerType !== "mouse") return;

      const hit = (e.target as HTMLElement).closest<HTMLElement>(".spot");
      if (!hit) return;

      const box = hit.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;

      // Moving to a different cell: start from the new pointer position
      // rather than easing across the gap from the old card, which would
      // drag a visible streak between them.
      if (hit !== cell.current) {
        cell.current = hit;
        current.current = { x, y };
      }
      target.current = { x, y };

      if (!frame.current) frame.current = requestAnimationFrame(tick);
    },
    [tick],
  );

  /** Release the tilt on the way out, so no card is left frozen at an
   *  angle after the cursor has gone. */
  const onPointerLeave = useCallback(
    (e: React.PointerEvent<T>) => {
      stop();
      cell.current = null;
      for (const el of (e.currentTarget as HTMLElement).querySelectorAll<HTMLElement>(".spot")) {
        el.style.removeProperty("--rx");
        el.style.removeProperty("--ry");
      }
    },
    [stop],
  );

  return { onPointerMove, onPointerLeave };
}
