import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import Index from "@/pages/Index";
import Navbar from "@/components/Navbar";
import VideoShowcase from "@/components/VideoShowcase";

/**
 * Covers the four accessibility fixes so a later edit cannot quietly undo
 * them. These are the kind of bug that never produces a visible error - the
 * page looks identical and is simply unusable for some people - so nothing
 * catches a regression except an assertion.
 *
 * P1 and P4 are CSS, which jsdom does not apply (no cascade, no
 * media-query evaluation). Those two are asserted against the stylesheet
 * text instead. That is weaker than a real browser check: it proves the
 * rule is still present and still scoped correctly, not that it paints.
 */

/* Comments are stripped first. Without that, an assertion matches prose -
   the reduce-motion block explains in a comment why it avoids
   `animation: none`, and a naive search for that string finds the
   explanation rather than a declaration. */
const css = readFileSync(path.resolve(__dirname, "../index.css"), "utf8").replace(
  /\/\*[\s\S]*?\*\//g,
  "",
);

/** Slice out one @media / selector block so assertions cannot pass on a
 *  match found somewhere else in the file. */
const blockAfter = (marker: string) => {
  const start = css.indexOf(marker);
  if (start === -1) return "";
  let depth = 0;
  for (let i = start; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}") {
      depth--;
      if (depth === 0) return css.slice(start, i + 1);
    }
  }
  return "";
};

describe("P1 - reduced motion", () => {
  const block = blockAfter("@media (prefers-reduced-motion: reduce)");

  it("has a reduce-motion block at all", () => {
    expect(block).not.toBe("");
  });

  it("neutralises animation and transition for every element, not a list", () => {
    // The bug this replaced: the block named .reveal / .media-load only, so
    // animate-fade-in, animate-bounce and animate-pulse kept running.
    expect(block).toMatch(/^\s*\*,/m);
    expect(block).toMatch(/animation-duration:\s*0\.01ms\s*!important/);
    expect(block).toMatch(/animation-iteration-count:\s*1\s*!important/);
    expect(block).toMatch(/transition-duration:\s*0\.01ms\s*!important/);
  });

  it("does not use `animation: none`, which would strand fade-in content invisible", () => {
    // fade-in and scale-in are `forwards` animations starting at opacity 0.
    expect(block).not.toMatch(/animation:\s*none/);
  });

  it("still un-hides the class-driven reveal, which the blanket cannot reach", () => {
    expect(block).toContain(".reveal");
    expect(block).toContain(".media-load");
    expect(block).toMatch(/opacity:\s*1\s*!important/);
  });
});

describe("P4 - focus visible", () => {
  it("gives links and buttons a focus indicator", () => {
    // Not [^)]* - the selector contains :not([tabindex="-1"]), so a
    // negated-class match stops at the wrong bracket.
    expect(css).toMatch(/:where\(a, button[\s\S]*?\):focus-visible/);
  });

  it("uses accent, not the navy --ring that vanishes on salt-dark", () => {
    const block = blockAfter(":where(a, button");
    expect(block).toContain("hsl(var(--accent))");
    expect(block).not.toContain("hsl(var(--ring))");
  });

  it("keeps specificity at zero so component-level rings still win", () => {
    expect(css).toMatch(/:where\([^)]*\):focus-visible/);
  });
});

describe("P3 - bypass blocks", () => {
  it("puts a skip link before anything else focusable", () => {
    const { container } = render(<Index />);
    const first = container.querySelector("a, button, input, textarea, select");
    expect(first).toHaveAttribute("href", "#main");
    expect(first).toHaveTextContent(/skip to main content/i);
  });

  it("points the skip link at a real, focusable main landmark", () => {
    render(<Index />);
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main");
    // Without tabIndex the link scrolls but never moves focus in Safari
    // and Chrome, so the next Tab restarts from the top of the document.
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("keeps the nav, footer and mobile bar outside main", () => {
    render(<Index />);
    const main = screen.getByRole("main");
    expect(within(main).queryByRole("navigation")).toBeNull();
    expect(within(main).queryByRole("contentinfo")).toBeNull();
  });
});

describe("P3 - mobile menu keyboard", () => {
  it("associates the toggle with the panel it controls", () => {
    render(<Navbar />);
    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-controls", "mobile-menu");
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();
  });

  it("closes on Escape and hands focus back to the toggle", () => {
    render(<Navbar />);
    fireEvent.click(screen.getByRole("button", { name: /open menu/i }));
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(document.getElementById("mobile-menu")).not.toBeInTheDocument();
    // The real bug: focus was stranded on an unmounted button, so the next
    // Tab jumped back to the top of the page.
    expect(screen.getByRole("button", { name: /open menu/i })).toHaveFocus();
  });
});

describe("P2 - video pause control", () => {
  let paused = false;

  beforeEach(() => {
    paused = false;
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      configurable: true,
      get: () => paused,
    });
    // jsdom implements neither, and play() rejects rather than throwing.
    HTMLMediaElement.prototype.play = vi.fn(() => {
      paused = false;
      return Promise.resolve();
    });
    HTMLMediaElement.prototype.pause = vi.fn(() => {
      paused = true;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("offers a way to stop the looping video (WCAG 2.2.2)", () => {
    render(<VideoShowcase />);
    expect(
      screen.getByRole("button", { name: /pause facility video/i }),
    ).toBeInTheDocument();
  });

  it("actually pauses the element, and flips to a play control", () => {
    render(<VideoShowcase />);
    fireEvent.click(screen.getByRole("button", { name: /pause facility video/i }));

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /play facility video/i }),
    ).toBeInTheDocument();
  });

  it("resumes on a second press", async () => {
    render(<VideoShowcase />);
    fireEvent.click(screen.getByRole("button", { name: /pause facility video/i }));
    fireEvent.click(screen.getByRole("button", { name: /play facility video/i }));

    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
    expect(
      await screen.findByRole("button", { name: /pause facility video/i }),
    ).toBeInTheDocument();
  });

  it("serves a still instead of the video when reduced motion is set", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    try {
      const { container } = render(<VideoShowcase />);
      // CSS cannot pause a <video>; the element must not be there at all.
      expect(container.querySelector("video")).toBeNull();
      expect(
        screen.getByRole("img", { name: /crushing and grading/i }),
      ).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });
});

describe("P4 - decorative content is not announced", () => {
  it("hides the scroll indicator and the feature icons from the a11y tree", () => {
    const { container } = render(<VideoShowcase />);
    for (const svg of Array.from(container.querySelectorAll("svg"))) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("uses no emoji as an icon", () => {
    const { container } = render(<VideoShowcase />);
    // Emoji announce as "pick emoji" / "microscope emoji" and render
    // differently per OS. Extended_Pictographic catches the whole class.
    expect(container.textContent ?? "").not.toMatch(/\p{Extended_Pictographic}/u);
  });
});
