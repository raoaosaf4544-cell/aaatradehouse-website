import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import path from "node:path";
import App from "@/App";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";
import { CONSENT_REOPEN, readConsent } from "@/lib/consent";
import { HUBSPOT_TRACKING_SRC } from "@/lib/hubspot";

/**
 * The legal batch. Every assertion here maps to something that is only
 * visible in a network tab: a script that loaded too early, an iframe that
 * phoned Google before anyone pressed anything, a font fetched from a US
 * host. None of it changes how the page looks, so nothing but a test
 * notices when it regresses.
 */

const root = path.resolve(__dirname, "../..");
const read = (p: string) => readFileSync(path.join(root, p), "utf8");
/** HTML comments explain what was removed and name the very hosts we are
 *  asserting are gone, so they have to come out before searching. */
const stripHtmlComments = (s: string) => s.replace(/<!--[\s\S]*?-->/g, "");

const trackingScript = () =>
  document.querySelector(`script[src="${HUBSPOT_TRACKING_SRC}"]`);

beforeEach(() => {
  localStorage.clear();
  document.getElementById("hs-script-loader")?.remove();
  history.pushState({}, "", "/");
});

describe("H1 - consent gates the tracking script", () => {
  it("loads nothing before a decision has been made", () => {
    render(<ConsentBanner />);
    expect(trackingScript()).toBeNull();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("injects the script only after Accept", () => {
    render(<ConsentBanner />);
    expect(trackingScript()).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /^accept$/i }));

    expect(trackingScript()).not.toBeNull();
    expect(readConsent()).toBe("granted");
  });

  it("loads nothing after Decline, and remembers the refusal", () => {
    render(<ConsentBanner />);
    fireEvent.click(screen.getByRole("button", { name: /^decline$/i }));

    expect(trackingScript()).toBeNull();
    expect(readConsent()).toBe("denied");
  });

  it("does not re-ask once a decision exists", () => {
    localStorage.setItem("aaa.consent.analytics", "denied");
    render(<ConsentBanner />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("honours a stored refusal on a later visit without showing the banner", () => {
    localStorage.setItem("aaa.consent.analytics", "denied");
    render(<ConsentBanner />);
    expect(trackingScript()).toBeNull();
  });

  it("re-applies a stored acceptance on a later visit", () => {
    localStorage.setItem("aaa.consent.analytics", "granted");
    render(<ConsentBanner />);
    expect(trackingScript()).not.toBeNull();
  });

  it("makes declining exactly as easy as accepting", () => {
    render(<ConsentBanner />);
    const accept = screen.getByRole("button", { name: /^accept$/i });
    const decline = screen.getByRole("button", { name: /^decline$/i });

    // Consent is only valid if refusal is as easy as agreement. A greyed
    // Decline beside a filled Accept would invalidate every acceptance
    // collected through this banner, so the styling is a correctness
    // property, not a preference.
    expect(decline.className).toBe(accept.className);
  });

  it("offers no dismiss control that would sidestep the choice", () => {
    render(<ConsentBanner />);
    const buttons = within(screen.getByRole("dialog")).getAllByRole("button");
    expect(buttons.map((b) => b.textContent?.trim().toLowerCase())).toEqual([
      "accept",
      "decline",
    ]);
  });

  it("can be reopened so consent can be withdrawn (Art. 7(3))", () => {
    localStorage.setItem("aaa.consent.analytics", "granted");
    render(<ConsentBanner />);
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent(window, new CustomEvent(CONSENT_REOPEN));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^decline$/i }));
    expect(trackingScript()).toBeNull();
    expect(readConsent()).toBe("denied");
  });

  it("gives the footer a permanent way back to that choice", () => {
    render(<Footer />);
    expect(
      screen.getByRole("button", { name: /cookie settings/i }),
    ).toBeInTheDocument();
  });
});

describe("H2 - privacy notice", () => {
  it("is served at /privacy", () => {
    history.pushState({}, "", "/privacy");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /privacy & cookies/i }),
    ).toBeInTheDocument();
  });

  it("treats /privacy/ as the same page", () => {
    history.pushState({}, "", "/privacy/");
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 1, name: /privacy & cookies/i }),
    ).toBeInTheDocument();
  });

  it("names AAA General Trading as controller, not the trading brand", () => {
    history.pushState({}, "", "/privacy");
    render(<App />);
    // getAllByText, not getByText: the footer names the entity too, and
    // that is correct - the contracts line says the same thing.
    expect(screen.getAllByText(/AAA General Trading/).length).toBeGreaterThan(0);

    const controller = screen.getByText(/data controller/i);
    expect(controller).toBeInTheDocument();
    // The controller is the legal entity. Naming the trading brand here
    // would point a data subject at something they cannot serve notice on.
    expect(controller.textContent).toMatch(/AAA General Trading/);
  });

  it("discloses the US transfer, the retention period and how to complain", () => {
    history.pushState({}, "", "/privacy");
    const { container } = render(<App />);
    const text = container.textContent ?? "";

    expect(text).toMatch(/HubSpot, Inc\./);
    expect(text).toMatch(/United States/);
    expect(text).toMatch(/Data Privacy Framework/);
    expect(text).toMatch(/24 months/);
    expect(text).toMatch(/data protection authority/i);
  });

  it("puts the notice where someone is about to submit, not only in the footer", () => {
    render(<Contact />);
    const notice = screen.getByText(/your details go to us and to hubspot/i);
    expect(notice).toBeInTheDocument();
    expect(
      within(notice).getByRole("link", { name: /privacy notice/i }),
    ).toHaveAttribute("href", "/privacy");
  });

  it("links the notice from the footer", () => {
    render(<Footer />);
    expect(
      screen.getByRole("link", { name: /privacy & cookies/i }),
    ).toHaveAttribute("href", "/privacy");
  });
});

describe("H3 - fonts are self-hosted", () => {
  it("requests nothing from Google's font hosts", () => {
    const html = stripHtmlComments(read("index.html"));
    expect(html).not.toContain("fonts.googleapis.com");
    expect(html).not.toContain("fonts.gstatic.com");
  });

  it("loads them from the bundle instead", () => {
    const main = read("src/main.tsx");
    expect(main).toMatch(/@fontsource-variable\/inter/);
    expect(main).toMatch(/@fontsource\/playfair-display/);
  });

  it("points the type stack at the self-hosted family name", () => {
    // The variable package registers "Inter Variable"; a stack that only
    // says "Inter" silently falls through to system-ui and nobody notices.
    expect(read("tailwind.config.ts")).toContain("Inter Variable");
  });
});

describe("H4 - maps never load without a basis", () => {
  it("embeds no iframe before any decision", () => {
    const { container } = render(<Contact />);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
    expect(screen.getAllByRole("button", { name: /show map/i })).toHaveLength(2);
  });

  it("embeds no iframe after Decline", () => {
    localStorage.setItem("aaa.consent.analytics", "denied");
    const { container } = render(<Contact />);
    expect(container.querySelectorAll("iframe")).toHaveLength(0);
  });

  it("loads both automatically once consent is given", () => {
    localStorage.setItem("aaa.consent.analytics", "granted");
    const { container } = render(<Contact />);
    expect(container.querySelectorAll("iframe")).toHaveLength(2);
    expect(screen.queryByRole("button", { name: /show map/i })).toBeNull();
  });

  it("reveals them the moment consent is given, without a reload", () => {
    const { container } = render(
      <>
        <ConsentBanner />
        <Contact />
      </>,
    );
    expect(container.querySelectorAll("iframe")).toHaveLength(0);

    fireEvent.click(screen.getByRole("button", { name: /^accept$/i }));

    // Someone who presses Accept and sees nothing change assumes it failed.
    expect(container.querySelectorAll("iframe")).toHaveLength(2);
  });

  it("names maps in the banner, since a yes to analytics would not cover Google", () => {
    render(<ConsentBanner />);
    const body = screen.getByRole("dialog").textContent ?? "";
    expect(body).toMatch(/google maps/i);
    expect(body).toMatch(/analytics/i);
  });

  it("says what pressing it will do", () => {
    render(<Contact />);
    expect(
      screen.getAllByText(/sends your IP address to Google/i),
    ).toHaveLength(2);
  });

  it("loads one map per press, not both", () => {
    const { container } = render(<Contact />);
    fireEvent.click(screen.getAllByRole("button", { name: /show map/i })[0]);

    expect(container.querySelectorAll("iframe")).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: /show map/i })).toHaveLength(1);
  });

  it("opens in hybrid satellite, not the default roadmap", () => {
    const { container } = render(<Contact />);
    fireEvent.click(screen.getAllByRole("button", { name: /show map/i })[0]);

    // t=h is satellite imagery plus street and place labels. Losing this
    // parameter is invisible - the map still works, it just goes back to
    // a flat roadmap - so it needs an assertion rather than an eyeball.
    const src = container.querySelector("iframe")!.getAttribute("src") ?? "";
    expect(src).toContain("t=h");
    expect(src).toContain("output=embed");
  });
});

describe("H5 - react-router is gone", () => {
  const pkg = JSON.parse(read("package.json"));

  it("is not a dependency any more", () => {
    const all = { ...pkg.dependencies, ...pkg.devDependencies };
    expect(all["react-router-dom"]).toBeUndefined();
    expect(all["react-router"]).toBeUndefined();
  });

  it("is imported nowhere", () => {
    for (const f of ["src/App.tsx", "src/pages/NotFound.tsx"]) {
      expect(read(f)).not.toMatch(/from ["']react-router/);
    }
  });

  it("still resolves unknown paths to a 404", () => {
    history.pushState({}, "", "/no-such-page");
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
  });

  it("no longer ships the ungated tracking script in the markup", () => {
    // A script tag in the HTML has already run by the time any banner
    // renders, so this must stay out of index.html permanently.
    expect(stripHtmlComments(read("index.html"))).not.toContain("js.hs-scripts.com");
  });
});

describe("M1 - security headers", () => {
  const vercel = JSON.parse(read("vercel.json"));
  const headers: { key: string; value: string }[] = vercel.headers[0].headers;
  const get = (k: string) => headers.find((h) => h.key === k)?.value;

  it("keeps CSP in report-only until the HubSpot hosts are known", () => {
    expect(get("Content-Security-Policy-Report-Only")).toBeDefined();
    expect(get("Content-Security-Policy")).toBeUndefined();
  });

  it("locks font-src to self, so re-adding Google Fonts is caught", () => {
    expect(get("Content-Security-Policy-Report-Only")).toContain("font-src 'self'");
  });

  it("sets the headers that cannot break a working page", () => {
    expect(get("X-Content-Type-Options")).toBe("nosniff");
    expect(get("Referrer-Policy")).toBe("strict-origin-when-cross-origin");
    expect(get("X-Frame-Options")).toBe("DENY");
    expect(get("Permissions-Policy")).toContain("geolocation=()");
  });

  it("does not commit to HSTS preload or includeSubDomains", () => {
    // Both are near-irreversible and this domain has live mail records
    // mid-warmup plus unaudited subdomains.
    const hsts = get("Strict-Transport-Security") ?? "";
    expect(hsts).toContain("max-age=");
    expect(hsts).not.toContain("preload");
    expect(hsts).not.toContain("includeSubDomains");
  });

  it("uses only keys Vercel accepts, so the deploy cannot fail validation", () => {
    for (const h of headers) {
      expect(Object.keys(h).sort()).toEqual(["key", "value"]);
    }
  });
});

describe("M2 - form spam checks", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn().mockResolvedValue({ ok: true, text: async () => "" });
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  const fill = (container: HTMLElement) => {
    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: "Jane Buyer" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "jane@example.com" },
    });
    return container.querySelector("form")!;
  };

  it("hides the honeypot from sight, tab order and screen readers", () => {
    const { container } = render(<Contact />);
    const trap = container.querySelector<HTMLInputElement>('input[name="website"]');

    expect(trap).not.toBeNull();
    expect(trap).toHaveAttribute("tabindex", "-1");
    expect(trap).toHaveAttribute("autocomplete", "off");
    // Hidden from AT, so a value in it is conclusive rather than a guess.
    expect(trap!.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("drops a submission that filled the honeypot", () => {
    const { container } = render(<Contact />);
    const form = fill(container);
    fireEvent.change(container.querySelector('input[name="website"]')!, {
      target: { value: "http://spam.example" },
    });

    fireEvent.submit(form);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops a submission that arrived faster than a person could type", () => {
    const { container } = render(<Contact />);
    const form = fill(container);

    fireEvent.submit(form); // immediately after mount
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("tells a rejected bot nothing - it reports success", () => {
    const { container } = render(<Contact />);
    const form = fill(container);
    fireEvent.submit(form);

    expect(screen.getByText(/your inquiry has reached us/i)).toBeInTheDocument();
  });

  it("lets a real submission through once enough time has passed", () => {
    const now = Date.now();
    const spy = vi.spyOn(Date, "now");
    spy.mockReturnValue(now); // mount time

    const { container } = render(<Contact />);
    const form = fill(container);

    spy.mockReturnValue(now + 10_000); // ten seconds later
    fireEvent.submit(form);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("api.hsforms.com");
  });
});
