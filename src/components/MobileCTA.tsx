import { MessageCircle, FileText } from "lucide-react";

/**
 * Mobile-only sticky CTA. Desktop already keeps "Get Quote" in the fixed
 * navbar, so this fills the gap on small screens where the navbar collapses
 * behind the menu toggle and a buyer can otherwise scroll the whole page
 * without a visible way to contact us.
 */
const MobileCTA = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-primary-foreground/15 bg-salt-dark/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
    <a
      href="https://wa.me/923174286226"
      target="_blank"
      rel="noopener noreferrer"
      className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-wide text-primary-foreground"
    >
      <MessageCircle className="w-4 h-4 text-salt-coral" />
      WhatsApp
    </a>
    <a
      href="#contact"
      className="flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium uppercase tracking-wide bg-primary text-primary-foreground"
    >
      <FileText className="w-4 h-4" />
      Get Quote
    </a>
  </div>
);

export default MobileCTA;
