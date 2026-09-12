# Security headers

Configured in `vercel.json`. JSON takes no comments, so the reasoning lives here.

## Content-Security-Policy-Report-Only

**Report-Only on purpose. Do not enforce this yet.**

HubSpot's tracking script loads further scripts at runtime, and the hosts it
reaches for are not knowable by reading our source. Enforcing a guessed
allow-list would silently break analytics for every visitor who accepted
cookies — and CSP failures are invisible to the person browsing, so nobody
would report it.

There is no `report-uri`: we have no endpoint to collect reports. Violations
appear in the browser console instead.

### Promoting it to enforced

1. Deploy, open the site, **accept** cookies in the banner.
2. Click through every section, submit the contact form, press **Show map** on
   both maps.
3. Read the console. Each violation names the host and the directive it
   failed.
4. Add those hosts to the matching directive below.
5. Repeat until a full pass is clean, then rename the key to
   `Content-Security-Policy`.

Worth doing a second pass having **declined** cookies — that path should
produce no HubSpot requests at all, and a violation there is a real bug in
the consent gating, not a missing allow-list entry.

### Notes on specific directives

| Directive | Why |
|---|---|
| `font-src 'self'` | Only correct because fonts are self-hosted. If anyone re-adds Google Fonts, this breaks — which is the point. |
| `style-src 'unsafe-inline'` | Tailwind and React inline styles need it. Removing it means hashing every inline style; not worth it here. |
| `img-src data:` | The hero's film-grain texture is an inline SVG data URI. |
| `frame-src` | Only the two Google Maps embeds, and only after **Show map**. |
| `frame-ancestors 'none'` | Nothing should embed this site. Duplicated by `X-Frame-Options` for older browsers. |

## Strict-Transport-Security

Deliberately **without** `includeSubDomains` and **without** `preload`.

Both are close to one-way doors — `preload` is compiled into browser binaries
and removal takes months. This domain has live Zoho MX/SPF/DKIM/DMARC records
mid-warmup and subdomains that have not been audited for HTTPS support. One
year on the apex is the safe first step.

Add `includeSubDomains` only once every subdomain is confirmed HTTPS-only.
Add `preload` only after that has been stable for a while.

HSTS governs browser HTTP requests only; it does not affect mail delivery.

## The rest

`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and
`Permissions-Policy` are enforced. None can break a page that already worked.
`Permissions-Policy` denies camera, microphone, geolocation, payment, USB and
motion sensors — we use none of them, so denying them stops an injected script
from prompting a visitor in our name.
