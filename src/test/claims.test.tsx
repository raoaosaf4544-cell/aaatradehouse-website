import { describe, it, expect, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import GlobalReach from "@/components/GlobalReach";
import Products from "@/components/Products";
import Hero from "@/components/Hero";
import { CountUp } from "@/components/CountUp";

/**
 * Guards the claims, not the styling.
 *
 * A false credential does not break a build or fail a render - it sits
 * there looking fine until a buyer's compliance team finds it during due
 * diligence, and then the deal is over. These assertions exist because
 * nothing else in the toolchain can tell the difference between a fact and
 * a plausible sentence.
 */

const src = (p: string) =>
  readFileSync(path.resolve(__dirname, "../..", p), "utf8");

describe("GlobalReach - the export route", () => {
  it("states the Incoterms, with FOB as the usual basis", () => {
    render(<GlobalReach />);
    expect(screen.getByText("FOB")).toBeInTheDocument();
    expect(screen.getByText("CIF")).toBeInTheDocument();
    expect(screen.getByText(/our usual basis/i)).toBeInTheDocument();
  });

  it("names both ports, because the booking decides which", () => {
    // Karachi and Port Qasim are two separate seaports, not one place with
    // two names. Naming only one would be wrong on roughly half of
    // shipments, and to a freight forwarder that is not a rounding error.
    const { container } = render(<GlobalReach />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/Karachi/);
    expect(text).toMatch(/Port Qasim/);
    // Gwadar was never in scope; if it appears, someone guessed.
    expect(text).not.toMatch(/Gwadar/i);
  });

  it("states the minimum order rather than staying silent", () => {
    // Silence on MOQ is read by a smaller buyer as a large hidden one.
    const { container } = render(<GlobalReach />);
    expect(container.textContent ?? "").toMatch(/no fixed minimum/i);
  });

  it("names no Incoterm we have not confirmed we can quote", () => {
    // FOB and CIF are confirmed. EXW, CFR, FCA, DAP and DDP are not -
    // listing one we cannot honour is worse in a negotiation than the
    // vaguer "quoted to your requirement".
    const { container } = render(<GlobalReach />);
    const text = container.textContent ?? "";
    for (const term of ["EXW", "CFR", "FCA", "DAP", "DDP", "C&F"]) {
      expect(`${term}:${text.includes(term)}`).toBe(`${term}:false`);
    }
  });

  it("gives no shipment count and no export history", () => {
    const { container } = render(<GlobalReach />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\bUAE\b|shipments? completed|first (export|shipment)/i);
  });

  it("keeps the sourcing claim hedged as 'primarily'", () => {
    const { container } = render(<GlobalReach />);
    const text = container.textContent ?? "";
    expect(text).toMatch(/primarily direct from PMDC/i);
    // "direct from PMDC" without the hedge would contradict the rest of
    // the site and overstate what is true.
    expect(text).not.toMatch(/(?<!primarily )\bexclusively direct\b|\b100% direct\b/i);
  });

  it("dropped the decorative pills that duplicated facts", () => {
    const s = src("src/components/GlobalReach.tsx");
    expect(s).not.toContain("animate-float");
    expect(s).not.toContain("animate-pulse");
  });
});

describe("Products - withheld figures", () => {
  it("publishes no spec numbers a buyer could test the goods against", () => {
    // Withdrawn at the business's request: the lab report is old and they
    // are not ready to stand behind figures publicly. The numbers are
    // still printed on the 900g pack, which is a separate problem for
    // them to fix - but the site no longer repeats them.
    const { container } = render(<Products />);
    const text = container.textContent ?? "";
    for (const n of ["98.82", "0.801", "0.104", "0.090", "0.076", "0.046"]) {
      expect(`${n}:${text.includes(n)}`).toBe(`${n}:false`);
    }
    expect(text).not.toMatch(/\d+\s*(?:mm|mesh|micron)/i);
  });

  it("still offers the report on request", () => {
    const { container } = render(<Products />);
    expect(container.textContent ?? "").toMatch(/report.{0,20}on request/i);
  });
});

describe("Hero", () => {
  it("does not state the sourcing hedge twice", () => {
    const { container } = render(<Hero />);
    const text = container.textContent ?? "";
    const hits = text.match(/primarily direct from PMDC/gi) ?? [];
    // It belongs in the paragraph. The eyebrow used to repeat it verbatim
    // three lines above, inside an icon pill.
    expect(hits).toHaveLength(1);
  });

  it("carries no 0 Middlemen claim", () => {
    const { container } = render(<Hero />);
    expect(container.textContent ?? "").not.toMatch(/middlem[ae]n/i);
  });

  it("has no scroll indicator or infinite animation left", () => {
    const s = src("src/components/Hero.tsx");
    expect(s).not.toContain("animate-bounce");
    expect(s).not.toContain("animate-pulse");
  });
});

describe("site-wide", () => {
  const components = [
    "Hero", "About", "Products", "Industries",
    "VideoShowcase", "GlobalReach", "FAQ", "Ordering", "Contact",
  ].map((n) => [n, src(`src/components/${n}.tsx`)] as const);

  it("discloses no shipment count or export history, in any section", () => {
    // This was scoped to GlobalReach and About slipped through with "our
    // export record to date is one completed shipment to the UAE". The
    // count is internal context, not a public credential, so the guard
    // has to cover every section rather than the one being edited.
    for (const [name, s] of components) {
      const hit = /\bUAE\b|United Arab Emirates|shipments? completed|completed shipment|first (?:export|shipment)|one shipment/i.exec(s);
      expect(`${name}:${hit?.[0] ?? "clean"}`).toBe(`${name}:clean`);
    }
  });

  it("claims no packaging larger than 50kg", () => {
    // Corrected by the business: there are no 1000kg jumbo bags. 50kg is
    // the largest bag actually filled. A buyer who orders against a
    // packaging size that does not exist finds out at the port.
    for (const [name, s] of components) {
      const hit = /jumbo|1000\s*kg|1\s*tonne bag|bulk bag/i.exec(s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ""));
      expect(`${name}:${hit?.[0] ?? "clean"}`).toBe(`${name}:clean`);
    }
  });

  it("never colour-grades the product photography", () => {
    // Pink is the product. A duotone or grayscale pass over a Himalayan
    // salt photograph throws away the one thing a salt buyer is looking
    // at - the treatment makes generic imagery look art-directed and
    // makes your own goods look wrong. It was tried and removed.
    for (const [name, s] of components) {
      // Matches the class being APPLIED, not the word. Hero carries a
      // comment explaining why the treatment was removed, and a naive
      // substring search would fail on its own documentation.
      const applied = /className="[^"]*\bduotone\b/.test(s);
      expect(`${name}:${applied}`).toBe(`${name}:false`);
      expect(`${name}:${/grayscale\(|sepia\(|hue-rotate\(/.test(s)}`).toBe(`${name}:false`);
    }
  });

  it("keeps the decorative blobs the brief rules out off the page", () => {
    // "no gradient meshes, no glassmorphism, no 3D blobs" - About had four
    // blurred coral blobs behind its cards plus a fifth on the photo.
    for (const [name, s] of components) {
      expect(`${name}:${s.includes("blur-2xl")}`).toBe(`${name}:false`);
      expect(`${name}:${s.includes("blur-3xl")}`).toBe(`${name}:false`);
    }
  });

  it("runs no infinite animation anywhere on the page", () => {
    for (const [name, s] of components) {
      expect(`${name}:${s.includes("animate-float")}`).toBe(`${name}:false`);
      expect(`${name}:${s.includes("animate-bounce")}`).toBe(`${name}:false`);
    }
  });

  it("no longer uses one uniform vertical rhythm for every section", () => {
    // Eight sections at identical spacing is what reads as machine-made:
    // when everything is emphasised, nothing is.
    const spacings = new Set(
      components
        .map(([, s]) => s.match(/(?:^|")((?:pt-|py-)\d+ md:(?:pt-|py-)\d+)/)?.[1])
        .filter(Boolean),
    );
    expect(spacings.size).toBeGreaterThan(1);
  });
});

describe("CountUp never shows a wrong number", () => {
  const hide = (state: "visible" | "hidden") =>
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => state,
    });

  afterEach(() => hide("visible"));

  it("does not drop to zero while the tab is in the background", () => {
    // Found in the browser: a background tab throttles rAF to nothing,
    // so a counter that had already reset to 0 stayed at 0. "0 tonnes
    // per month" is a false figure, not a missing animation.
    hide("hidden");
    render(<CountUp value="100+" />);
    expect(screen.getByText("100+")).toBeInTheDocument();
    expect(screen.queryByText("0+")).toBeNull();
  });

  it("shows the real figure when motion is reduced", () => {
    const original = window.matchMedia;
    window.matchMedia = ((q: string) => ({
      matches: q.includes("prefers-reduced-motion"),
      media: q, onchange: null,
      addListener: () => {}, removeListener: () => {},
      addEventListener: () => {}, removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    try {
      render(<CountUp value="100+" />);
      expect(screen.getByText("100+")).toBeInTheDocument();
    } finally {
      window.matchMedia = original;
    }
  });

  it("animates a year instead of counting it, so it still arrives", () => {
    // 2009 counting up from zero reads as a broken odometer, but sitting
    // dead still beside two counters read as a failure. It slides.
    const { container } = render(<CountUp value="2009" />);
    expect(container.querySelector(".num-mask")).not.toBeNull();
    expect(container.querySelector(".num-slide")).not.toBeNull();
    expect(screen.getByText("2009")).toBeInTheDocument();
  });

  it("keeps the suffix on a counted value", () => {
    render(<CountUp value="100+" />);
    expect(screen.getByText("100+")).toBeInTheDocument();
  });
});
