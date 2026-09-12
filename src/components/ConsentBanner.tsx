import { useEffect, useRef, useState } from "react";
import {
  CONSENT_REOPEN,
  applyConsent,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * Consent for the HubSpot tracking script.
 *
 * Decline is the same size, weight and contrast as Accept. That is not
 * decoration: consent is only valid if refusing is as easy as agreeing, so
 * a greyed-out "Decline" beside a filled "Accept" would invalidate every
 * acceptance collected through it. Same reason there is no dismiss "x" -
 * a close button that quietly counts as consent is the oldest dark pattern
 * in the list, and one that counts as refusal is just a worse Decline.
 *
 * The banner does not block the page. Nothing is being tracked while it is
 * open, so there is nothing to block for.
 */
const ConsentBanner = () => {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const openedByUser = useRef(false);

  useEffect(() => {
    const stored = readConsent();
    // Enforce the stored decision on every load, before deciding whether to
    // ask. A previous "denied" has to keep clearing cookies, not just stay
    // quiet.
    applyConsent(stored);
    if (stored === null) setOpen(true);
  }, []);

  // Footer "Cookie settings" reopens this. Art. 7(3): withdrawing consent
  // must be as easy as giving it, so there is a permanent way back.
  useEffect(() => {
    const reopen = () => {
      openedByUser.current = true;
      setOpen(true);
    };
    window.addEventListener(CONSENT_REOPEN, reopen);
    return () => window.removeEventListener(CONSENT_REOPEN, reopen);
  }, []);

  // Only steal focus when the user asked for the panel. Yanking focus out of
  // the page on first load would be its own accessibility problem.
  useEffect(() => {
    if (open && openedByUser.current) {
      panelRef.current?.focus();
      openedByUser.current = false;
    }
  }, [open]);

  if (!open) return null;

  const decide = (value: "granted" | "denied") => {
    writeConsent(value);
    setOpen(false);
  };

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      tabIndex={-1}
      // bottom-14 on small screens clears the fixed mobile CTA bar.
      className="fixed inset-x-0 bottom-14 z-[70] p-4 lg:bottom-0 lg:p-6 focus:outline-none"
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-5 shadow-elevated md:p-6">
        <h2
          id="consent-title"
          className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-foreground"
        >
          Cookies
        </h2>
        {/* Names both things this consent covers. A yes to "analytics" alone
            would not cover Google, so auto-loading the maps on the back of it
            would be exactly the unspecific consent that invalidates a banner
            (Art. 4(11)). Declining does not hide the maps - they stay one
            button away, which is why refusing costs a visitor nothing real. */}
        <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
          We'd like to set analytics cookies from HubSpot to see how visitors
          find and use this site, and to load the Google Maps showing our office
          and plant. Neither is needed for the site to work, and we won't do
          either unless you agree. Our contact form works either way, and you
          can still open each map yourself with a single click.
        </p>

        {/* Identical classes on both, deliberately. */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => decide("granted")}
            className="flex-1 rounded-md border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => decide("denied")}
            className="flex-1 rounded-md border border-primary bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Decline
          </button>
        </div>

        <a
          href="/privacy"
          className="mt-4 inline-block text-sm text-primary underline underline-offset-4"
        >
          Privacy &amp; cookies
        </a>
      </div>
    </div>
  );
};

export default ConsentBanner;
