import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import GlobalReach from "@/components/GlobalReach";
import Hero from "@/components/Hero";

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

  it("names no port", () => {
    // FOB normally names a port, but ours is not confirmed. Printing an
    // unconfirmed one would be the same class of error as printing a lead
    // time - checkable, and wrong.
    const { container } = render(<GlobalReach />);
    const text = container.textContent ?? "";
    expect(text).not.toMatch(/\bport\b/i);
    expect(text).not.toMatch(/Karachi|Gwadar|Qasim/i);
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
