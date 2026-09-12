import { useEffect, useState } from "react";
import { CONSENT_CHANGED, type Consent, readConsent } from "@/lib/consent";

/**
 * The current consent decision, kept in sync as it changes.
 *
 * Reading localStorage once at mount is not enough: accepting in the banner
 * has to reveal the maps in the same page view, not on the next reload.
 * Someone who has just pressed Accept and sees no change assumes it did
 * not work.
 */
export function useConsent(): Consent | null {
  const [consent, setConsent] = useState<Consent | null>(() => readConsent());

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_CHANGED, sync);
    // Another tab deciding should settle this one too.
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_CHANGED, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return consent;
}
