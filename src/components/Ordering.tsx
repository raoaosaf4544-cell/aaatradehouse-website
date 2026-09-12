import { useReveal } from "@/hooks/use-reveal";

const steps = [
  {
    title: "Message us",
    description: "Send your requirement: grade, volume, packaging and destination port.",
  },
  {
    title: "We quote",
    description: "Price, packaging options and the certifications your market asks for, in writing.",
  },
  {
    title: "Sample",
    description: "We send a sample for your approval. You cover the sample shipping.",
  },
  {
    title: "Confirm",
    description: "You approve a proforma invoice, issued by AAA General Trading, and the order is booked.",
  },
  {
    title: "Export and ship",
    description: "We handle the export documentation and the shipping arrangements.",
  },
];

const Ordering = () => {
  const header = useReveal<HTMLDivElement>();
  const strip = useReveal<HTMLOListElement>();

  return (
    <section id="ordering" className="py-28 md:py-36 bg-salt-dark text-primary-foreground">
      <div className="container mx-auto px-6">
        <div ref={header} className="reveal max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">How Ordering Works</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-6">
            Five steps, no surprises.
          </h2>
          <p className="text-primary-foreground/60 text-base md:text-lg leading-relaxed">
            You will know the price, the packaging and the paperwork before you commit to
            anything. Nothing is booked until you have approved it in writing.
          </p>
        </div>

        <ol ref={strip} className="reveal-group grid sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              style={{ "--reveal-delay": `${Math.min(index, 4) * 60}ms` } as React.CSSProperties}
              className="relative pt-6 border-t border-primary-foreground/15"
            >
              <span className="font-serif text-3xl font-bold text-accent tabular-nums leading-none block mb-4">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-medium mb-2">{step.title}</h3>
              <p className="text-sm text-primary-foreground/60 leading-relaxed">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Ordering;
