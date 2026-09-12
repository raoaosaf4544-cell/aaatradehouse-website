import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { openConsentSettings } from "@/lib/consent";

/**
 * Privacy notice.
 *
 * Every factual claim here is either confirmed by the business or taken
 * from a named source. Nothing is filled in from a template. An invented
 * retention period or an unverified transfer mechanism is the same class
 * of error as an invented certification: it is the first thing a regulator
 * or a buyer's compliance team checks, and being wrong is worse than being
 * silent.
 *
 * HubSpot's transfer position was verified against legal.hubspot.com/eu-us-dpf
 * rather than recalled - see TRANSFER_SOURCE below.
 *
 * KNOWN GAP: no Art. 27 EU representative is appointed, so none is named.
 * That is a deliberate omission pending legal advice, not an oversight.
 */

/** Confirmed with the business. One constant, so changing the policy is a
 *  one-line edit and cannot drift from what the page says. */
const RETENTION_MONTHS = 24;

const LAST_UPDATED = "12 September 2026";

const TRANSFER_SOURCE = "https://legal.hubspot.com/eu-us-dpf";

const Privacy = () => {
  useEffect(() => {
    document.title = "Privacy & Cookies | AAA Trade House";
  }, []);

  // No pb-14 on the wrapper, unlike Index: the mobile CTA bar is not
  // rendered on this page, so reserving space for it would leave dead gap.
  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-background focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-elevated"
      >
        Skip to main content
      </a>
      <Navbar />

      <main id="main" tabIndex={-1} className="focus:outline-none">
        {/* pt-32 clears the fixed navbar. */}
        <section className="bg-salt-cream pt-32 pb-20 md:pt-40 md:pb-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
                Legal
              </p>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
                Privacy &amp; cookies
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed">
                What we collect when you contact us, why we collect it, where it
                goes, and how to get it back or have it deleted.
              </p>
              <p className="mt-6 text-sm text-muted-foreground">
                Last updated {LAST_UPDATED}
              </p>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl space-y-14">
              <Block title="Who we are">
                <p>
                  This site is operated by <strong>AAA General Trading</strong>,
                  the registered legal entity behind the AAA Trade House brand.
                  AAA General Trading is the data controller for everything
                  described here, and is the party named on contracts, invoices
                  and banking.
                </p>
                <address className="not-italic">
                  AAA General Trading
                  <br />
                  Office No. 42, Valencia Tower, Block K1, Valencia Town
                  <br />
                  Lahore 54770, Pakistan
                </address>
                <p>
                  Email{" "}
                  <a className={linkClass} href="mailto:info@aaatradehouse.com">
                    info@aaatradehouse.com
                  </a>{" "}
                  for anything on this page, including a request to see or
                  delete your data.
                </p>
              </Block>

              <Block title="What we collect">
                <p>
                  <strong>When you use the contact form:</strong> your name, and
                  whatever you choose to put in the email, phone, company,
                  product interest and message fields. Only what you type — we
                  do not buy or enrich contact data.
                </p>
                <p>
                  <strong>If you accept analytics cookies:</strong> your IP
                  address, the pages you view, and how you arrived at the site.
                  This is off unless you turn it on, and you can turn it back
                  off at any time.
                </p>
                <p>
                  <strong>Always:</strong> our host records standard server logs
                  including IP addresses, as any web server does. These are used
                  to run and secure the site, not to profile you.
                </p>
                <p>
                  We do not ask for, and have no use for, special category data
                  — health, beliefs, biometrics or anything comparable. Please
                  do not send it.
                </p>
              </Block>

              <Block title="Why, and on what legal basis">
                <ul className="list-disc space-y-3 pl-5">
                  <li>
                    <strong>To answer your enquiry</strong> — quoting, sending
                    specifications, arranging samples. Legal basis: steps taken
                    at your request before entering a contract (UK/EU GDPR Art.
                    6(1)(b)).
                  </li>
                  <li>
                    <strong>To run and secure the site</strong> — server logs.
                    Legal basis: our legitimate interest in keeping the site
                    available and resisting abuse (Art. 6(1)(f)).
                  </li>
                  <li>
                    <strong>Analytics</strong> — understanding how buyers find
                    us. Legal basis: your consent (Art. 6(1)(a)), which you can
                    withdraw at any time.
                  </li>
                </ul>
              </Block>

              <Block title="Where your data goes">
                <p>
                  Our contact form is handled by <strong>HubSpot, Inc.</strong>,
                  which stores data on servers in the United States. Submitting
                  the form transfers your name, email address and anything else
                  you enter outside the EEA and the UK.
                </p>
                <p>
                  HubSpot is certified under the EU–U.S. Data Privacy Framework
                  (effective 1 September 2023) and under its UK Extension
                  (certified 26 September 2023), and incorporates the European
                  Commission's Standard Contractual Clauses in its data
                  processing agreement as an alternative safeguard. HubSpot
                  publishes its current position at{" "}
                  <a
                    className={linkClass}
                    href={TRANSFER_SOURCE}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    legal.hubspot.com/eu-us-dpf
                  </a>
                  .
                </p>
                <p>
                  If you accept analytics cookies, HubSpot also receives your IP
                  address and the pages you view. If you decline, it receives
                  nothing from you until you submit the form.
                </p>
                <p>
                  This site is hosted by <strong>Vercel Inc.</strong> (United
                  States), which processes request logs in order to serve pages.
                </p>
                <p>
                  The two maps in our Contact section load from{" "}
                  <strong>Google</strong>, which receives your IP address when
                  one does. They load automatically only if you accepted
                  cookies, since that choice covers them. If you declined, or
                  have not chosen, neither map loads until you press "Show
                  map" on it — and pressing it loads only that one.
                </p>
                <p>
                  Our fonts are served from this site, not from Google Fonts, so
                  no third party sees your IP address just because you opened a
                  page.
                </p>
                <p>
                  We do not sell your data, and we do not share it with anyone
                  beyond the processors named above.
                </p>
              </Block>

              <Block title="Cookies">
                <p>
                  Accepting covers two things: HubSpot's analytics cookies —{" "}
                  <code className={codeClass}>__hstc</code>,{" "}
                  <code className={codeClass}>__hssc</code>,{" "}
                  <code className={codeClass}>__hssrc</code> and{" "}
                  <code className={codeClass}>hubspotutk</code> — and loading
                  the embedded Google Maps, which lets Google set its own
                  cookies. Neither happens unless you accept, and if you
                  decline we delete any HubSpot cookies already there.
                </p>
                <p>
                  Declining does not hide the maps. They stay one click away,
                  so refusing costs you nothing on this site.
                </p>
                <p>
                  We store your choice itself on your own device so we do not
                  have to ask on every visit. Nothing else is stored, and your
                  choice is never sent to us.
                </p>
                <p>
                  <button
                    type="button"
                    onClick={openConsentSettings}
                    className={`${linkClass} bg-transparent p-0`}
                  >
                    Change your cookie choice
                  </button>
                </p>
              </Block>

              <Block title="How long we keep it">
                <p>
                  Enquiries that do not become orders are deleted after{" "}
                  <strong>{RETENTION_MONTHS} months</strong>. Export buying
                  cycles are slow and a buyer who enquires in one season often
                  returns in the next, which is what that period is for.
                </p>
                <p>
                  Where an enquiry becomes an order, the records are kept for as
                  long as we are required to keep commercial and tax records,
                  and then deleted.
                </p>
                <p>You can ask us to delete your data sooner. We will.</p>
              </Block>

              <Block title="Your rights">
                <p>
                  If you are in the UK or the EEA you can ask us for a copy of
                  your data, to correct it, to delete it, to restrict or object
                  to how we use it, or to receive it in a portable form. Where
                  we rely on your consent, you can withdraw it at any time
                  without affecting what we did before you withdrew it.
                </p>
                <p>
                  Email{" "}
                  <a className={linkClass} href="mailto:info@aaatradehouse.com">
                    info@aaatradehouse.com
                  </a>
                  . We will respond within one month. There is no charge.
                </p>
                <p>
                  If you are unhappy with how we have handled your data you can
                  complain to your national data protection authority. In the UK
                  that is the Information Commissioner's Office; in the EEA it is
                  the supervisory authority for the country you live in.
                </p>
              </Block>

              <Block title="Changes">
                <p>
                  If we change how we handle your data we will update this page
                  and change the date at the top. If the change is significant
                  and we hold your contact details, we will tell you directly.
                </p>
              </Block>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const linkClass =
  "text-accent underline underline-offset-4 hover:text-accent/80 transition-colors";
const codeClass = "rounded bg-muted px-1.5 py-0.5 text-[0.85em] font-mono";

const Block = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section>
    <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-5">
      {title}
    </h2>
    <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
      {children}
    </div>
  </section>
);

export default Privacy;
