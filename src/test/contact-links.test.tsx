import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { phones } from "@/lib/contact";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

/**
 * A wa.me link with a leading zero or a local-format number silently fails
 * for every foreign buyer - the link opens and finds nobody. Static greps
 * cannot catch it because the hrefs are built from template literals, so
 * these assertions render the components and read the real hrefs.
 */

const hrefs = (c: HTMLElement) =>
  Array.from(c.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");

describe("contact number constants", () => {
  it("stores every number in international format, no leading zero", () => {
    for (const p of phones) {
      expect(p.wa).toMatch(/^92\d{9,10}$/);
      expect(p.tel).toBe(`+${p.wa}`);
      expect(p.display.replace(/\s/g, "")).toBe(`+${p.wa}`);
    }
  });

  it("carries both numbers, with 317 primary", () => {
    expect(phones.map((p) => p.wa)).toEqual(["923174286226", "923003513889"]);
  });
});

describe.each([
  ["Contact", Contact],
  ["Footer", Footer],
  ["MobileCTA", MobileCTA],
])("%s", (_name, Component) => {
  it("links both numbers with no malformed wa.me or tel: href", () => {
    const { container } = render(<Component />);
    const all = hrefs(container);

    for (const p of phones) {
      expect(all).toContain(`https://wa.me/${p.wa}`);
    }
    for (const h of all.filter((x) => x.includes("wa.me") || x.startsWith("tel:"))) {
      expect(h).not.toMatch(/wa\.me\/0/);
      expect(h).not.toMatch(/^tel:\+?0/);
      expect(h).toMatch(/^(https:\/\/wa\.me\/92\d{9,10}|tel:\+92\d{9,10})$/);
    }
  });
});
