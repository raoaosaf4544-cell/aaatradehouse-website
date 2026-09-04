import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logoLight from "@/assets/logo-light.webp";
import logoDark from "@/assets/logo-dark.webp";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Products", href: "#products" },
    { name: "Industries", href: "#industries" },
    { name: "Export", href: "#global" },
    { name: "Ordering", href: "#ordering" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? "bg-background/90 backdrop-blur-lg border-b border-border" 
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2">
            <img
              src={scrolled ? logoDark : logoLight}
              width={240}
              height={128}
              alt="AAA Trade House - Himalayan Pink Salt Experts"
              className="h-12 md:h-14 w-auto object-contain transition-opacity duration-300"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`transition-colors duration-300 text-sm font-medium tracking-wide uppercase ${
                  scrolled 
                    ? "text-muted-foreground hover:text-primary" 
                    : "text-primary-foreground/90 hover:text-primary-foreground"
                }`}
              >
                {link.name}
              </a>
            ))}
            <Button asChild variant="hero" size="lg" className="shadow-elevated">
              <a href="#contact">Get Quote</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            className={`lg:hidden ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden py-6 bg-background/95 backdrop-blur-md rounded-b-2xl animate-fade-in">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-3 text-lg text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <Button asChild variant="hero" className="w-full mt-6" size="lg">
              <a href="#contact" onClick={() => setIsOpen(false)}>Get Quote</a>
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
