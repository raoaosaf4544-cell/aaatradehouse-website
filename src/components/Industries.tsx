import { Factory, ChefHat, Beaker, Tags } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const industries = [
  {
    icon: Factory,
    title: "Food Manufacturing",
    description:
      "Edible grade carrying PMDC certification, graded to the requirement you specify, for processors and packers.",
  },
  {
    icon: ChefHat,
    title: "Food Service",
    description:
      "Coarse and fine grades in bulk or retail packs for distributors, restaurant suppliers and gourmet brands.",
  },
  {
    icon: Beaker,
    title: "Industrial",
    description:
      "Bulk raw and crushed salt for industrial and manufacturing use, packed to your specification.",
  },
  {
    icon: Tags,
    title: "Wholesale & Private Label",
    description:
      "Your branding on bulk packaging and retail packs, under your own label or our registered brand.",
  },
];

const Industries = () => {
  const header = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();

  return (
    <section id="industries" className="py-28 md:py-36 bg-secondary">
      <div className="container mx-auto px-6">
        <div ref={header} className="reveal max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Industries We Serve</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
            Who we supply.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The grade, the packaging and the paperwork change with the buyer. Tell us which
            of these you are and we will quote to it.
          </p>
        </div>

        <div ref={grid} className="reveal-group grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {industries.map((industry, index) => (
            <div
              key={industry.title}
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
              className="bg-card p-8 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40"
            >
              <industry.icon className="w-5 h-5 text-primary mb-6" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight">
                {industry.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {industry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Industries;
