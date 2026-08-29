import logo from "@/assets/logo.png";
import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-salt-dark to-black text-primary-foreground py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img 
              src={logo} 
              alt="AAA Trade House" 
              className="h-14 w-auto brightness-0 invert opacity-90 mb-4"
            />
            <p className="text-salt-coral/70 text-sm leading-relaxed mb-6">
              Family experience in Pakistan's salt trade since 1994. Bulk Himalayan pink
              salt, direct from the mine with no trading layer.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/aaatradehouse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on LinkedIn"
                className="w-10 h-10 rounded-full bg-salt-coral/10 flex items-center justify-center hover:bg-salt-coral/30 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/aaatradehouse/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on Instagram"
                className="w-10 h-10 rounded-full bg-salt-coral/10 flex items-center justify-center hover:bg-salt-coral/30 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/share/14hsELyh9mY/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="AAA Trade House on Facebook"
                className="w-10 h-10 rounded-full bg-salt-coral/10 flex items-center justify-center hover:bg-salt-coral/30 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "#home" },
                { name: "About", href: "#about" },
                { name: "Products", href: "#products" },
                { name: "Process", href: "#video-section" },
                { name: "Export", href: "#global" },
                { name: "Contact", href: "#contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-salt-coral/70 hover:text-salt-coral transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold mb-6">Products</h4>
            <ul className="space-y-3">
              {["Coarse", "Fine", "Edible", "Chunks"].map((product) => (
                <li key={product}>
                  <a href="#products" className="text-salt-coral/70 hover:text-salt-coral transition-colors text-sm">
                    {product}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-salt-coral flex-shrink-0 mt-0.5" />
                <span className="text-salt-coral/70 text-sm">
                  Lahore,<br />Punjab, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-salt-coral flex-shrink-0" />
                <a href="tel:+923174286226" className="text-salt-coral/70 hover:text-salt-coral transition-colors text-sm">+92 317 4286226</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-salt-coral flex-shrink-0" />
                <a href="mailto:info@aaatradehouse.com" className="text-salt-coral/70 hover:text-salt-coral transition-colors text-sm">info@aaatradehouse.com</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-salt-coral flex-shrink-0" />
                <a href="https://wa.me/923174286226" target="_blank" rel="noopener noreferrer" className="text-salt-coral/70 hover:text-salt-coral transition-colors text-sm">WhatsApp</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-salt-coral/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-salt-coral/50 text-sm">
            © {new Date().getFullYear()} AAA Trade House. All rights reserved.
          </p>
          <p className="text-salt-coral/40 text-sm">
            The export brand of AAA General Trading
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;