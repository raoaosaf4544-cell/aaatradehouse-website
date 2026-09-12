/**
 * HubSpot identifiers, in one place.
 *
 * Two different things talk to HubSpot and they must agree on the portal:
 * the form POST (Contact) and the tracking script (consent). Defining the
 * portal ID twice is how they drift.
 */

// Portal ID confirmed against forms.hsforms.com - the 8-digit variant 404s;
// this one resolves.
export const HUBSPOT_PORTAL_ID = "246642088";
export const HUBSPOT_FORM_GUID = "c5c6ddcf-64b9-4848-aad7-727f44c62f46";

/** Form submission. Fires only when someone presses Send, so it rests on
 *  Art. 6(1)(b) pre-contractual steps, not consent. Never gated. */
export const HUBSPOT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

/** Behavioural tracking. Sets cookies and profiles visitors, so it is
 *  gated on consent and must not load until it is given. */
export const HUBSPOT_TRACKING_SRC = `https://js.hs-scripts.com/${HUBSPOT_PORTAL_ID}.js`;
