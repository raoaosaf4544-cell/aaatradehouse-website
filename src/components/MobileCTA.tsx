import { MessageCircle, FileText } from "lucide-react";
import { phones } from "@/lib/contact";

/**
 * Mobile-only sticky CTA. Desktop already keeps "Get Quote" in the fixed
 * navbar, so this fills the gap on small screens where the navbar collapses
 * behind the menu toggle and a buyer can otherwise scroll the whole page
 * without a visible way to contact us.
 *
 * Both numbers take WhatsApp, so both get a tap target. They are labelled by
 * their operator prefix because neither number has a distinct role (sales vs
 * ops) that we can honestly print - the full number is on the aria-label and
 * spelled out in full in the Contact section and the footer.
 */
const MobileCTA = () => (
  <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex border-t border-primary-foreground/15 bg-salt-dark/95 backdrop-blur-lg pb-[env(safe-area-inset-bottom)]">
    {phones.map((p) => (
      <a
        key={p.wa}
        href={`https://wa.me/${p.wa}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${p.display}`}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 leading-tight text-primary-foreground"
      >
        <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide">
          <MessageCircle className="w-4 h-4 text-salt-coral" />
          WhatsApp
        </span>
        <span className="text-[11px] tabular-nums text-primary-foreground/55">
          {p.display.split(" ")[1]}
        </span>
      </a>
    ))}
    <a
      href="#contact"
      className="flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium uppercase tracking-wide bg-primary text-primary-foreground"
    >
      <FileText className="w-4 h-4" />
      Get Quote
    </a>
  </div>
);

export default MobileCTA;
