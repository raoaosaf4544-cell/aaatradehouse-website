import { Mountain, Factory, FileCheck, Package } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const exportFeatures = [
  {
    icon: Mountain,
    title: "Direct Sourcing",
    description: "Khewra and other Pakistani salt mines, on a PMDC lease. No trading layer in between.",
  },
  {
    icon: Factory,
    title: "In-House Processing",
    description: "Our Rashide facility in Multan handles crushing and grading, and is still being built out.",
  },
  {
    icon: FileCheck,
    title: "Certification",
    description: "PMDC certification on the edible grade. Independent PCSIR laboratory report on request.",
  },
  {
    icon: Package,
    title: "Bulk Supply",
    description: "100 tonnes a month across four grades, packed to your specification.",
  },
];

const GlobalReach = () => {
  const intro = useReveal<HTMLDivElement>();
  const feats = useReveal<HTMLDivElement>();

  return (
    <section id="global" className="py-28 md:py-36 bg-salt-dark text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={intro} className="reveal">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Export Capability</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-6">
              From the mine to your container.
            </h2>
            <p className="text-primary-foreground/60 text-base md:text-lg leading-relaxed mb-12">
              We source on a PMDC lease, grade to order, and pack for bulk shipment.
              Because there is no trading layer, the people arranging your container
              are the people who know the mine.
            </p>

            <div ref={feats} className="reveal-group grid sm:grid-cols-2 gap-6">
              {exportFeatures.map((feature, index) => (
                <div
                  key={feature.title}
                  style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
                  className="flex gap-4"
                >
                  <div className="w-11 h-11 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-primary-foreground/50 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map/Visual */}
          <div className="relative">
            <div className="aspect-square rounded-full border border-primary-foreground/10 flex items-center justify-center">
              <div className="w-3/4 h-3/4 rounded-full border border-primary-foreground/15 flex items-center justify-center animate-pulse">
                <div className="w-1/2 h-1/2 rounded-full bg-gradient-accent flex items-center justify-center">
                  <Mountain className="w-16 h-16 text-primary-foreground" />
                </div>
              </div>
            </div>
            
            {/* Floating Fact Markers */}
            <div className="absolute top-10 right-10 px-3 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-primary-foreground/70 animate-float">
              PMDC lease
            </div>
            <div className="absolute top-1/4 left-0 px-3 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-primary-foreground/70 animate-float" style={{ animationDelay: "1s" }}>
              100 t / month
            </div>
            <div className="absolute bottom-1/4 right-0 px-3 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-primary-foreground/70 animate-float" style={{ animationDelay: "2s" }}>
              4 grades
            </div>
            <div className="absolute bottom-10 left-10 px-3 py-1.5 bg-primary-foreground/5 border border-primary-foreground/15 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider text-primary-foreground/70 animate-float" style={{ animationDelay: "0.5s" }}>
              PCSIR on request
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
