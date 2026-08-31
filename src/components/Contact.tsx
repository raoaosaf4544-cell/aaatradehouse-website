import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

// HubSpot Forms submission endpoint. Portal ID confirmed against
// forms.hsforms.com (the 8-digit variant 404s; this one resolves).
const HUBSPOT_PORTAL_ID = "246642088";
const HUBSPOT_FORM_GUID = "c5c6ddcf-64b9-4848-aad7-727f44c62f46";
const HUBSPOT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

type SubmitState = "idle" | "sending" | "sent" | "error";

const Contact = () => {
  const info = useReveal<HTMLDivElement>();
  const formCard = useReveal<HTMLDivElement>();
  const [state, setState] = useState<SubmitState>("idle");
  const [errorDetail, setErrorDetail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? "").trim();

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

    setState("sending");
    setErrorDetail("");

    try {
      const res = await fetch(HUBSPOT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields,
          context: {
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
    <section id="contact" className="py-28 md:py-36 bg-salt-cream">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <div ref={info} className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Get in Touch</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Ready to Order?
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Whether you need a small sample or bulk shipments, our team is ready 
              to assist you with pricing, specifications, and logistics.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Us</h3>
                  <a href="mailto:info@aaatradehouse.com" className="text-muted-foreground hover:text-primary transition-colors">info@aaatradehouse.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Call Us</h3>
                  <a href="tel:+923174286226" className="block text-muted-foreground hover:text-primary transition-colors">+92 317 4286226</a>
                  <a href="https://wa.me/923174286226" target="_blank" rel="noopener noreferrer" className="block text-muted-foreground hover:text-primary transition-colors">WhatsApp</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-salt-blush flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Visit Us</h3>
                  <p className="text-muted-foreground">
Office No. 42, Valencia Tower,<br />
                    Block K1, Valencia Town,<br />
                    Lahore 54770, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formCard} className="reveal bg-card rounded-lg p-8 md:p-12 shadow-elevated" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
            <h3 className="font-serif text-2xl font-semibold text-foreground mb-6">
              Request a Quote
            </h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input id="fullName" name="fullName" required placeholder="John Smith" className="bg-background" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                    Company
                  </label>
                  <Input id="company" name="company" placeholder="Your Company Ltd." className="bg-background" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input id="email" name="email" type="email" required placeholder="john@company.com" className="bg-background" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                    Phone
                  </label>
                  <Input id="phone" name="phone" type="tel" placeholder="+1 234 567 890" className="bg-background" />
                </div>
              </div>

              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                  Product Interest
                </label>
                <Input id="interest" name="interest" placeholder="e.g., Fine Pink Salt, 20 tons" className="bg-background" />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your requirements..."
                  className="bg-background min-h-[120px]"
                />
              </div>

              <Button variant="hero" size="lg" className="w-full" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send Inquiry"}
                <Send size={18} />
              </Button>

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
                    <a href="mailto:info@aaatradehouse.com" className="text-primary underline underline-offset-4">
                      info@aaatradehouse.com
                    </a>{" "}
                    or message us on{" "}
                    <a
                      href="https://wa.me/923174286226"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
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
      </div>
    </section>
  );
};

export default Contact;
