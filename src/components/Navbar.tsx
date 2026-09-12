import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoLight from "@/assets/logo-light.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Escape closes the panel and puts focus back on the toggle. Without the
  // second half, dismissing the menu strands focus on a button that is no
  // longer rendered and the next Tab restarts from the top of the document.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Industries", href: "/#industries" },
    { name: "Export", href: "/#global" },
    { name: "Ordering", href: "/#ordering" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-background/80 backdrop-blur-xl border-b border-border"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/#home" className="flex items-center gap-2">
            <img
              /* Always the light mark. The scrolled state used to mean
                 "a light bar is behind me" and swapped in logoDark; on an
                 all-dark site that rendered a near-black logo on near-black. */
              src={logoLight}
              width={240}
              height={128}
              alt="AAA Trade House - Himalayan Salt Experts"
              className="h-12 md:h-14 w-auto object-contain transition-opacity duration-300"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                /* py-2 is not decoration: at text-sm these links measured 20px
                   tall, under the 24px minimum in WCAG 2.2 SC 2.5.8. A
                   nav row is not an inline link in a sentence, so it does
                   not get that exemption. */
                className="py-2 transition-colors duration-300 text-sm font-medium tracking-wide uppercase text-foreground/70 hover:text-foreground"
              >
                {link.name}
              </a>
            ))}
            <Button asChild variant="hero" size="lg" className="shadow-elevated">
              <a href="/#contact">Get Quote</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          {/* -mr-2 p-2 keeps the optical alignment while giving the icon a
              44px tap target, which a bare 24px icon does not meet. */}
          <button
            ref={toggleRef}
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="lg:hidden -mr-2 p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden py-4 px-2 bg-background/95 backdrop-blur-md rounded-b-2xl animate-fade-in"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-2 py-3 text-lg text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button asChild variant="hero" className="w-full mt-6" size="lg">
              <a href="/#contact" onClick={() => setIsOpen(false)}>Get Quote</a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
