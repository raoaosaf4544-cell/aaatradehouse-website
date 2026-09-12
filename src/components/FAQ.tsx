import { useReveal } from "@/hooks/use-reveal";

/* Google requires FAQPage schema to mirror content the user can actually see.
   These pairs must stay identical to the FAQPage node in index.html -
   src/test/faq-schema.test.ts fails the build if they drift apart.
   Every answer is copy already approved elsewhere on the site. */
export const faqs = [
  {
    q: "Where does AAA Trade House source its Himalayan pink salt?",
    a: "We are a bulk Himalayan pink salt supplier in Pakistan, sourcing primarily direct from PMDC-leased mines with no trading layer between the mine and your container. Where we draw on other local suppliers we test the material and keep you informed.",
  },
  {
    q: "What is the monthly supply capacity?",
    a: "Over 100 tonnes of Himalayan pink salt per month, across coarse, fine, edible and chunk grades.",
  },
  {
    q: "How long does a Himalayan salt order take to deliver?",
    a: "Lead time depends on grade, order volume, packaging and destination port. Tell us what you need and we confirm a date in writing before you commit.",
  },
  {
    q: "Is the salt certified and laboratory tested?",
    a: "The edible grade carries PMDC certification. That certification is product-level on the edible grade, not company-wide. Batches are PCSIR tested and an independent laboratory report is available on request.",
  },
  {
    q: "What packaging sizes are available?",
    a: "25 kg and 50 kg PP export bags, 1000 kg jumbo bags, 500 g and 1 kg branded retail packs, or a custom size you specify.",
  },
  {
    q: "Do you offer private label Himalayan pink salt?",
    a: "Yes. We supply wholesale pink salt for private label: your branding on bulk packaging and on 500 g / 1 kg retail packs under our registered brand. Local distribution is live and export is to follow.",
  },
  {
    q: "Which Incoterms do you ship on?",
    a: "FOB is our usual basis, loading at Karachi or Port Qasim depending on the booking. CIF is available on request, and we quote other terms to your requirement.",
  },
  {
    q: "Is there a minimum order quantity?",
    a: "There is no fixed minimum. Tell us the volume, grade and packaging you need and we quote to it.",
  },
];

const FAQ = () => {
  const header = useReveal<HTMLDivElement>();
  const list = useReveal<HTMLDivElement>();

  return (
    <section id="faq" className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-6">
        <div ref={header} className="reveal max-w-3xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">
            Buyer Questions
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
            What importers ask first.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The answers below are the ones we give on every call. Anything not
            covered here, ask us directly.
          </p>
        </div>

        {/* Native <details> - no JS, keyboard and screen-reader accessible
            by default, and the answer text stays in the DOM for crawlers
            even while collapsed. */}
        <div ref={list} className="reveal-group max-w-3xl border-t border-border">
          {faqs.map((item, index) => (
            <details
              key={item.q}
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
              className="group border-b border-border"
            >
              <summary className="flex items-start justify-between gap-6 cursor-pointer list-none py-6 [&::-webkit-details-marker]:hidden">
                <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground leading-snug">
                  {item.q}
                </h3>
                <span
                  aria-hidden="true"
                  className="mt-1 flex-shrink-0 text-2xl leading-none text-primary/70 transition-transform duration-[180ms] ease-[var(--ease-out)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted-foreground leading-relaxed pb-7 pr-12 max-w-2xl">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
