import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useConsent } from "@/hooks/use-consent";
import { phones } from "@/lib/contact";
import { HUBSPOT_ENDPOINT } from "@/lib/hubspot";

type SubmitState = "idle" | "sending" | "sent" | "error";


/* Both listings are the live Google Business Profiles. The office CID is the
   same one already referenced in the JSON-LD hasMap / sameAs. */
/* t=h is hybrid: satellite imagery WITH street and place labels. Plain
   satellite (t=k) looks better and reads worse - an importer checking that
   a crushing plant exists needs the road and the rail station named, not
   just a pretty aerial. Verified against the keyless CID embed, which
   honours the parameter; true 3D Earth would need the Maps Embed API and a
   billing-enabled key, which this does not use. */
const MAP_VIEW = "&t=h";

const locations = [
  {
    name: "Head Office",
    address: "Office No. 42, Valencia Tower, Block K1, Valencia Town, Lahore 54770, Pakistan",
    embed: `https://maps.google.com/maps?cid=14540864625688017508&output=embed${MAP_VIEW}`,
    link: "https://maps.google.com/?cid=14540864625688017508",
  },
  {
    name: "Crushing Plant",
    address: "Near Kot Abbas Shaheed Station, Khanewal 60000, Pakistan",
    embed: `https://maps.google.com/maps?cid=13571007861337017993&output=embed${MAP_VIEW}`,
    link: "https://maps.google.com/?cid=13571007861337017993",
  },
];

/**
 * A Google Maps iframe contacts Google the moment it renders, sending the
 * visitor's IP address and setting Google's cookies before anyone has been
 * asked. So it is never rendered without a basis, and there are two:
 *
 *   - Accepted in the banner. The banner names embedded maps explicitly,
 *     so the map can load straight away. Widening the wording was the
 *     price of that - a yes to "analytics" alone would not have covered
 *     Google, and stretching it there is exactly the kind of unspecific
 *     consent that invalidates the whole banner.
 *   - Pressed Show map. For anyone who declined or has not chosen, the
 *     button is the consent, and it is per map: loading the office does
 *     not load the plant.
 */
const MapEmbed = ({ loc }: { loc: (typeof locations)[number] }) => {
  const [clicked, setClicked] = useState(false);
  const consent = useConsent();
  // Accepting in the banner covers embedded maps too - the banner says so -
  // so someone who accepted should not have to click again. Anyone who
  // declined, or has not chosen yet, still gets the placeholder, and the
  // button remains the consent for that one map.
  const loaded = clicked || consent === "granted";

  if (loaded) {
    return (
      <div className="rounded-lg overflow-hidden border border-border shadow-soft">
        <iframe
          src={loc.embed}
          title={`Google Map showing ${loc.name} - ${loc.address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="w-full h-72 block border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative h-72 overflow-hidden rounded-lg border border-border bg-salt-dark elev-dark">
      {/* Survey-grid texture. Reads as a map before one loads, and costs no
          request - it is a CSS gradient, not an image, so it cannot leak an
          IP the way a static map preview from Google would. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--salt-coral)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--salt-coral)) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-salt-dark via-salt-dark/70 to-transparent"
      />

      <div className="relative z-10 flex h-full flex-col justify-end gap-3 p-6">
        <MapPin className="w-5 h-5 text-salt-coral" aria-hidden="true" />
        <p className="text-xs uppercase tracking-[0.16em] text-primary-foreground/55">
          Satellite view
        </p>
        <button
          type="button"
          onClick={() => setClicked(true)}
          className="self-start rounded-full border border-foreground/25 bg-foreground/10 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/20"
        >
          Show map
        </button>
        <p className="text-[11px] leading-relaxed text-primary-foreground/60">
          Loading the map sends your IP address to Google.
        </p>
      </div>
    </div>
  );
};

/** A real person cannot read the form, think, and fill it in faster than
 *  this. Scripted submissions routinely post within a few hundred ms. */
const MIN_SECONDS_ON_FORM = 4;

const Contact = () => {
  const info = useReveal<HTMLDivElement>();
  const formCard = useReveal<HTMLDivElement>();
  const maps = useReveal<HTMLDivElement>();
  const [state, setState] = useState<SubmitState>("idle");
  const [errorDetail, setErrorDetail] = useState("");
  const mountedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();

    // Two cheap spam checks, no third-party captcha: nothing extra to load,
    // nothing for a visitor to solve, and no new processor to disclose in
    // the privacy notice.
    //
    // Both failures report success rather than an error. Telling a bot why
    // it was rejected is how it learns to pass - and a false positive on a
    // real person is better than a visible accusation, since they still have
    // the email address and both WhatsApp numbers right beside the form.
    const trap = get("website");
    const tooFast = (Date.now() - mountedAt.current) / 1000 < MIN_SECONDS_ON_FORM;
    if (trap !== "" || tooFast) {
      form.reset();
      setState("sent");
      return;
    }

    const [firstname, ...rest] = get("fullName").split(/\s+/);
    const interest = get("interest");
    const body = get("message");

    // Only standard HubSpot contact properties, so the form accepts them.
    const fields = [
      { name: "firstname", value: firstname },
      { name: "lastname", value: rest.join(" ") },
      { name: "email", value: get("email") },
      { name: "phone", value: get("phone") },
      { name: "company", value: get("company") },
      {
        name: "message",
        value: interest ? `Product interest: ${interest}\n\n${body}` : body,
      },
    ].filter((f) => f.value !== "");

    // Set by the HubSpot tracking script, which now only loads once someone
    // has accepted analytics cookies - so for anyone who declined, or who
    // has not been asked yet, this is simply absent. Omitted rather than
    // sent empty, which HubSpot rejects. The form itself works either way.
    const hutk = document.cookie.match(/(?:^|;\s*)hubspotutk=([^;]*)/)?.[1];

    setState("sending");
    setErrorDetail("");

    try {
      const res = await fetch(HUBSPOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
            ...(hutk ? { hutk } : {}),
            pageUri: window.location.href,
            pageName: document.title,
          },
        }),
      });

      if (!res.ok) {
        // Surface HubSpot's own reason - it names the offending field.
        const detail = await res.text();
        console.error("HubSpot submission failed", res.status, detail);
        setErrorDetail(`${res.status}`);
        setState("error");
        return;
      }

      form.reset();
      setState("sent");
    } catch (err) {
      console.error("HubSpot submission failed", err);
      setErrorDetail("network");
      setState("error");
    }
  };

  return (
    <section id="contact" className="py-32 md:py-44 bg-salt-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div ref={info} className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Get in Touch</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Order?
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              Talk directly to us, no sales queue. Send your requirement and get a real
              response from the people who run the business, with pricing, specifications
              and packaging options.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                  <a href="mailto:info@aaatradehouse.com" className="text-muted-foreground hover:text-accent transition-colors">info@aaatradehouse.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Call or WhatsApp</h3>
                  {/* Both numbers take calls and WhatsApp. phones[0] is primary. */}
                  {phones.map((p) => (
                    <div key={p.tel} className="flex flex-wrap items-baseline gap-x-3">
                      <a href={`tel:${p.tel}`} className="text-muted-foreground hover:text-accent transition-colors">{p.display}</a>
                      <a
                        href={`https://wa.me/${p.wa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`WhatsApp ${p.display}`}
                        className="text-sm text-accent hover:underline underline-offset-4"
                      >
                        WhatsApp
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
Office No. 42, Valencia Tower,<br />
                    Block K1, Valencia Town,<br />
                    Lahore 54770, Pakistan
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mt-10 pt-6 border-t border-border">
              Contracts, invoices and banking documents are issued in the name of{" "}
              <strong className="font-semibold text-foreground">AAA General Trading</strong>,
              our registered company. AAA Trade House is its Himalayan pink salt export
              brand.
            </p>
          </div>

          {/* Contact Form */}
          <div ref={formCard} className="reveal bg-card rounded-lg p-8 md:p-12 shadow-elevated" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Request a Quote
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Honeypot. Hidden from sight, from the tab order and from
                  the accessibility tree, so no real person can reach it -
                  which is what makes a value in it conclusive. Not
                  display:none, because some bots skip those; off-screen
                  still reads as a fillable field to a naive scraper.
                  autoComplete="off" keeps a browser from helpfully
                  populating it and locking a genuine visitor out. */}
              <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="website">Leave this field blank</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input id="fullName" name="fullName" required placeholder="John Smith" className="bg-secondary border-border/80" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input id="company" name="company" placeholder="Your Company Ltd." className="bg-secondary border-border/80" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required placeholder="john@company.com" className="bg-secondary border-border/80" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" className="bg-secondary border-border/80" />
                </div>
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                  Product Interest
                </label>
                <Input id="interest" name="interest" placeholder="e.g., Fine Pink Salt, 20 tons" className="bg-secondary border-border/80" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirements..."
                  className="bg-secondary border-border/80 min-h-[120px]"
                />
              </div>

              <Button variant="hero" size="lg" className="w-full" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send Inquiry"}
                <Send size={18} />
              </Button>

              {/* Transparency at the point of collection (Art. 13) - a link
                  in the footer is not where someone about to press Send is
                  looking. */}
              <p className="text-xs leading-relaxed text-muted-foreground">
                Your details go to us and to HubSpot (United States), and we use
                them only to answer your enquiry. See our{" "}
                <a
                  href="/privacy"
                  className="text-accent underline underline-offset-4"
                >
                  privacy notice
                </a>
                .
              </p>

              <p aria-live="polite" className="text-sm">
                {state === "sent" && (
                  <span className="text-foreground">
                    Thanks — your inquiry has reached us. We'll reply from
                    info@aaatradehouse.com.
                  </span>
                )}
                {state === "error" && (
                  <span className="text-muted-foreground">
                    That didn't send{errorDetail ? ` (${errorDetail})` : ""}. Please email{" "}
                    <a href="mailto:info@aaatradehouse.com" className="text-accent underline underline-offset-4">
                      info@aaatradehouse.com
                    </a>{" "}
                    or message us on{" "}
                    <a
                      href={`https://wa.me/${phones[0].wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline underline-offset-4"
                    >
                      WhatsApp
                    </a>
                    .
                  </span>
                )}
              </p>
            </form>
          </div>
        </div>
        {/* Verified locations - Google Business Profile listings */}
        <div ref={maps} className="reveal mt-20 md:mt-24">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Find Us</p>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight mb-10">
            Two verified locations.
          </h3>
          <div className="grid md:grid-cols-2 gap-10">
            {locations.map((loc) => (
              <div key={loc.name}>
                <h4 className="font-serif text-xl font-bold text-foreground mb-2">{loc.name}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 min-h-[2.5rem]">
                  {loc.address}
                </p>
                <MapEmbed loc={loc} />
                <a
                  href={loc.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-sm font-medium text-accent hover:underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
