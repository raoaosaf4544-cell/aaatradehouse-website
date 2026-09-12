import { HUBSPOT_TRACKING_SRC } from "@/lib/hubspot";

/**
 * Consent for the one non-essential thing this site loads: the HubSpot
 * tracking script.
 *
 * The scope is deliberately narrow. Fonts are self-hosted and the two maps
 * are click-to-load, so neither needs a banner - which leaves consent
 * "specific" in the Art. 4(11) sense instead of one vague yes covering
 * everything. The contact form is not gated either: it fires only when
 * someone presses Send, which is Art. 6(1)(b), not consent.
 *
 * The rule this module exists to enforce is that the script is ABSENT
 * until consent exists - not loaded-and-idle, not loaded-with-tracking-off.
 * A script that has already run has already set cookies.
 */

export type Consent = "granted" | "denied";

const KEY = "aaa.consent.analytics";
const SCRIPT_ID = "hs-script-loader";

/** Set by js.hs-scripts.com once it runs. If consent is withdrawn after
 *  having been given, these are already on the device and removing the
 *  script does not remove them. */
const HUBSPOT_COOKIES = ["__hstc", "__hssc", "__hssrc", "hubspotutk"];

/** Fired when the stored decision changes, so open UI can re-render. */
export const CONSENT_CHANGED = "aaa:consent-changed";
/** Fired by the footer link to reopen the banner. Withdrawing has to be as
 *  easy as consenting (Art. 7(3)), which means a permanent way back in. */
export const CONSENT_REOPEN = "aaa:consent-reopen";

/**
 * localStorage throws outright in some privacy modes rather than returning
 * null, and a crash here would take the whole page down. Unreadable storage
 * is treated as "no decision yet", which is the safe direction: it means we
 * do not track.
 */
export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: Consent) {
  try {
    localStorage.setItem(KEY, value);
  } catch {
    // Storage blocked. Apply the decision for this page view anyway - the
    // banner will ask again next time, which is the honest failure mode.
  }
  applyConsent(value);
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED, { detail: value }));
}

/** Reopen the banner from anywhere (the footer link). */
export function openConsentSettings() {
  window.dispatchEvent(new CustomEvent(CONSENT_REOPEN));
}

/**
 * Bring the page into line with a decision. Safe to call repeatedly.
 */
export function applyConsent(value: Consent | null) {
  if (value === "granted") {
    injectTracking();
  } else {
    removeTracking();
    // Also on "no decision yet": a visitor who previously accepted and then
    // cleared localStorage but not cookies would otherwise keep being
    // tracked by cookies we can no longer account for.
    clearHubSpotCookies();
  }
}

function injectTracking() {
  if (document.getElementById(SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = SCRIPT_ID;
  s.async = true;
  s.defer = true;
  s.src = HUBSPOT_TRACKING_SRC;
  document.body.appendChild(s);
}

function removeTracking() {
  document.getElementById(SCRIPT_ID)?.remove();
}

/**
 * Expire HubSpot's cookies on every domain scope they could have been set
 * at. A cookie set on `.aaatradehouse.com` is not removed by expiring the
 * same name on `www.aaatradehouse.com`, so both are attempted - the browser
 * ignores the ones that do not match, which is why this is a loop and not a
 * lookup.
 */
function clearHubSpotCookies() {
  const host = window.location.hostname;
  const parts = host.split(".");
  const scopes = new Set<string>([""]);
  for (let i = 0; i < parts.length - 1; i++) {
    const d = parts.slice(i).join(".");
    scopes.add(`; domain=${d}`);
    scopes.add(`; domain=.${d}`);
  }

  for (const name of HUBSPOT_COOKIES) {
    for (const scope of scopes) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${scope}`;
    }
  }
}
