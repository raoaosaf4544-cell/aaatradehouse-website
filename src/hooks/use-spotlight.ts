import { useCallback, useRef } from "react";

/**
 * Tracks the pointer across a card grid and writes its position into CSS
 * custom properties, so `.spot` cells can paint a highlight under it.
 *
 * One listener on the grid rather than one per cell. With six product
 * cards that is six event registrations saved, but the real reason is
 * correctness: per-cell listeners each fire on their own element, so a
 * pointer crossing a hairline gap flickers between two highlights.
 *
 * Writes are wrapped in a rAF because pointermove fires far faster than
 * the screen refreshes, and each write invalidates style on the subtree.
 * Without the frame guard this is one of the easiest ways to make a
 * perfectly good page feel sluggish.
 *
 * Returns props to spread onto the grid container. Attach `.spot` to the
 * cells themselves.
 */
export function useSpotlight<T extends HTMLElement>() {
  const frame = useRef(0);
  const next = useRef<{ el: HTMLElement; x: number; y: number } | null>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    // Coarse pointers do not hover. Painting a highlight that follows a
    // tap would be noise, and on touch the cell is already being pressed.
    if (e.pointerType !== "mouse") return;

    const cell = (e.target as HTMLElement).closest<HTMLElement>(".spot");
    if (!cell) return;

    const r = cell.getBoundingClientRect();
    next.current = { el: cell, x: e.clientX - r.left, y: e.clientY - r.top };

    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const n = next.current;
      if (!n) return;
      n.el.style.setProperty("--mx", `${n.x}px`);
      n.el.style.setProperty("--my", `${n.y}px`);
    });
  }, []);

  return { onPointerMove };
}
