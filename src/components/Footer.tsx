import logoLight from "@/assets/logo-light.webp";
import footerBanner from "@/assets/banner-clean.webp";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { phones } from "@/lib/contact";
import { openConsentSettings } from "@/lib/consent";

const Footer = () => {
  return (
    <footer className="relative bg-salt-dark text-primary-foreground overflow-hidden">
      {/* Full-bleed brand banner behind the whole footer.
          banner-clean.jpg is the CROPPED collage - the original had a
          fabricated claims bar baked in. Do not swap in the uncropped file. */}
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={footerBanner}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {/* Layered scrim: heavy enough for AA text contrast, light enough
            that the collage still reads. */}
        <div className="absolute inset-0 bg-salt-dark/88" />
        <div className="absolute inset-0 bg-gradient-to-b from-salt-dark via-salt-dark/80 to-salt-dark" />
      </div>

      <div className="container mx-auto px-6 pt-20 pb-14 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img
              src={logoLight}
              width={240}
              height={128}
              alt="AAA Trade House - Himalayan Salt Experts"
              className="h-14 w-auto object-contain opacity-90 mb-5"
            />
            <p className="text-primary-foreground/55 text-sm leading-relaxed mb-6">
              Family experience in Pakistan's salt trade since 1994. Bulk Himalayan pink
              salt, direct from the mine with no trading layer.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/aaatradehouse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on LinkedIn"
                className="w-10 h-10 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/15 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/aaatradehouse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on Instagram"
                className="w-10 h-10 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/15 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/14hsELyh9mY/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on Facebook"
                className="w-10 h-10 rounded-full bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/15 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/55 mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/#home" },
                { name: "About", href: "/#about" },
                { name: "Products", href: "/#products" },
                { name: "Industries", href: "/#industries" },
                { name: "Process", href: "/#video-section" },
                { name: "Export", href: "/#global" },
                { name: "FAQ", href: "/#faq" },
                { name: "Ordering", href: "/#ordering" },
                { name: "Contact", href: "/#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/55 mb-6">Products</h3>
            <ul className="space-y-3">
              {["Edible Salt", "Industrial Salt", "Animal Lick Salt", "Wellness & Décor", "Bulk & Raw Sourcing", "Private Label"].map((product) => (
                <li key={product}>
                  <a href="/#products" className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary-foreground/55 mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-salt-coral flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/55 text-sm">
Office No. 42, Valencia Tower,<br />Block K1, Valencia Town,<br />Lahore 54770, Pakistan
                </span>
              </li>
              {/* Both numbers take calls and WhatsApp. phones[0] is primary. */}
              {phones.map((p) => (
                <li key={p.tel} className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-salt-coral flex-shrink-0 mt-0.5" />
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a href={`tel:${p.tel}`} className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm">{p.display}</a>
                    <a
                      href={`https://wa.me/${p.wa}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`WhatsApp ${p.display}`}
                      className="inline-flex items-center gap-1.5 text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm"
                    >
                      <MessageCircle className="w-4 h-4 text-salt-coral" />
                      WhatsApp
                    </a>
                  </span>
                </li>
              ))}
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-salt-coral flex-shrink-0" />
                <a href="mailto:info@aaatradehouse.com" className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm">info@aaatradehouse.com</a>
              </li>
            </ul>
            <p className="text-primary-foreground/55 text-sm leading-relaxed mt-6 pt-6 border-t border-primary-foreground/10">
              Contracts and invoices are issued by AAA General Trading.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative z-10 border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/55 text-sm">
            © {new Date().getFullYear()} AAA Trade House. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <a
              href="/privacy"
              className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm"
            >
              Privacy &amp; cookies
            </a>
            {/* Art. 7(3): withdrawing consent has to be as easy as giving it,
                which means a way back that does not depend on clearing
                browser storage by hand. */}
            <button
              type="button"
              onClick={openConsentSettings}
              className="text-primary-foreground/55 hover:text-primary-foreground transition-colors text-sm"
            >
              Cookie settings
            </button>
          </div>
          <p className="text-primary-foreground/55 text-sm">
            AAA Trade House is the export brand of AAA General Trading, registered since 2009.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;