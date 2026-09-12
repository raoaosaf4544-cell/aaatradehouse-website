import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import logoLight from "@/assets/logo-light.webp";
import { phones } from "@/lib/contact";

/* A 404 is usually reached by a buyer following a stale link from an
   email or a directory listing. Dumping them on "Oops!" with one link
   home wastes the only chance to keep them - so this offers the four
   destinations they were most likely aiming for, and the contact
   details, which is what they wanted from the site anyway. */
const routes = [
  { name: "Products and grades", href: "/#products" },
  { name: "Export capability", href: "/#global" },
  { name: "How ordering works", href: "/#ordering" },
  { name: "Contact us", href: "/#contact" },
];

const NotFound = () => {
  useEffect(() => {
    document.title = "Page not found | AAA Trade House";
    // window.location rather than the router's location - the router is
    // gone, and this only ever needs the path at mount.
    console.error(
      "404: no route for",
      window.location.pathname,
      "| referrer:",
      document.referrer || "(none)",
    );
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center">
        <div className="container mx-auto px-6 py-28">
          <div className="max-w-2xl mx-auto text-center">
            <a href="/" className="inline-block mb-12">
              <img
                src={logoLight}
                width={240}
                height={128}
                alt="AAA Trade House - Himalayan Salt Experts"
                className="h-14 w-auto object-contain mx-auto"
              />
            </a>

            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Error 404
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[0.95] tracking-tight mb-6">
              This page isn't <span className="italic text-accent">here</span>.
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-12">
              The link may be out of date, or we may have moved the page. Nothing
              is lost — everything on the site is one step away.
            </p>

            <ul className="grid sm:grid-cols-2 gap-px bg-border border border-border rounded-lg overflow-hidden text-left mb-12">
              {routes.map((r) => (
                <li key={r.href}>
                  <a
                    href={r.href}
                    className="group flex items-center justify-between gap-4 bg-card p-5 transition-colors hover:bg-secondary/60"
                  >
                    <span className="text-foreground font-medium">{r.name}</span>
                    <ArrowRight className="w-4 h-4 text-accent transition-transform group-hover:translate-x-1" />
                  </a>
                </li>
              ))}
            </ul>

            <Button asChild variant="hero" size="lg">
              <a href="/">Back to the homepage</a>
            </Button>

            <p className="mt-10 text-sm text-muted-foreground">
              Or reach us directly:{" "}
              <a
                href="mailto:info@aaatradehouse.com"
                className="text-accent underline underline-offset-4"
              >
                info@aaatradehouse.com
              </a>{" "}
              ·{" "}
              <a
                href={`https://wa.me/${phones[0].wa}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent underline underline-offset-4"
              >
                WhatsApp {phones[0].display}
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
