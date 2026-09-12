import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Factory, PawPrint, Lamp, Package, Boxes, Ruler, Tag } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { LucideIcon } from "lucide-react";

interface Product {
  name: string;
  description: string;
  specs: string;
  uses: string;
  icon: LucideIcon;
}

const products: Product[] = [
  {
    name: "Edible Salt",
    description:
      "Edible Himalayan pink salt in fine, coarse and granular grades for gourmet food brands and culinary applications.",
    // Granulation figures are NOT on the site until a lab report exists.
    specs: "High-purity, PCSIR-tested. Report and grades on request",
    uses: "Gourmet food, table salt, seasoning, baking",
    icon: Utensils,
  },
  {
    name: "Industrial Salt",
    description:
      "High-grade Himalayan pink salt for industrial, chemical and manufacturing applications.",
    specs: "Custom specifications available",
    uses: "Chemical processing, manufacturing, water treatment",
    icon: Factory,
  },
  {
    name: "Animal Lick Salt",
    description:
      "Natural mineral blocks for livestock and farming, promoting animal health.",
    specs: "Blocks and chunks in various weights",
    uses: "Livestock, farming, equestrian, animal health",
    icon: PawPrint,
  },
  {
    name: "Wellness & Décor",
    description:
      "Hand-crafted Himalayan pink salt lamps and decorative slabs for homes and spas.",
    specs: "Lamps, tiles, slabs, custom carvings",
    uses: "Home décor, wellness, spas, gifts",
    icon: Lamp,
  },
  {
    name: "Bulk & Raw Sourcing",
    description:
      "Direct supply of raw Himalayan pink salt rocks for large-scale importers and manufacturers.",
    specs: "1000kg jumbo bags | 25kg/50kg PP bags",
    uses: "Importers, wholesalers, private label brands",
    icon: Package,
  },
  {
    name: "Private Label",
    description:
      "Wholesale Himalayan pink salt with your branding on bulk packaging and 500 g / 1 kg retail packs, under our registered brand. Local distribution is live; export to follow.",
    specs: "Custom packaging and branding",
    uses: "Retail brands, distributors, wholesalers",
    icon: Tag,
  },
];

const Products = () => {
  const header = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const packs = useReveal<HTMLDivElement>();

  return (
    <section id="products" className="py-24 md:py-32 bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }} />
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div ref={header} className="reveal text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Product Portfolio</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
            Himalayan Pink Salt Products
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
            Himalayan pink salt from Khewra and other Pakistani mines, supplied in bulk
            with packaging and private labelling to your specification. PCSIR lab report
            available on request.
          </p>
        </div>

        {/* Products Grid */}
        <div ref={grid} className="reveal-group grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {products.map((product, index) => (
            <div
              key={product.name}
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
              className="group relative bg-card p-8 lg:p-10 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-3xl font-bold text-border tabular-nums leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <product.icon className="w-5 h-5 text-primary/60 group-hover:text-primary transition-colors" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-foreground mb-3 leading-tight">
                {product.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                {product.description}
              </p>

              <dl className="mt-auto space-y-4 mb-8">
                <div className="border-t border-border pt-3">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                    Specs
                  </dt>
                  <dd className="text-sm text-foreground/80">{product.specs}</dd>
                </div>
                <div className="border-t border-border pt-3">
                  <dt className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">
                    Uses
                  </dt>
                  <dd className="text-sm text-foreground/80">{product.uses}</dd>
                </div>
              </dl>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all duration-[180ms] ease-[var(--ease-out)]"
              >
                Request samples
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Packaging Info */}
        <div ref={packs} className="reveal mt-20 bg-salt-cream rounded-lg p-10 md:p-14">
          <p className="text-primary font-semibold mb-3 tracking-widest uppercase text-sm">Packaging</p>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Any bulk size you need.
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
            Standard export bags, jumbo bags, or a size you specify. Tell us what your
            line runs and we pack to it.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Available now</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">25 / 50 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">PP export bags</p>
              <p className="text-muted-foreground text-sm leading-relaxed">Standard distribution sizes.</p>
            </div>
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Boxes className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">1000 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">Jumbo bags</p>
              <p className="text-muted-foreground text-sm leading-relaxed">For large-scale operations.</p>
            </div>
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Ruler className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">Custom</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">To your specification</p>
              <p className="text-muted-foreground text-sm leading-relaxed">Name the size, we pack to it.</p>
            </div>
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Tag className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">500 g / 1 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">Branded retail packs</p>
              <p className="text-muted-foreground text-sm leading-relaxed">Private labelling, registered brand.</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="hero" size="xl">
              <a href="#contact">
                Request Custom Quote
                <ArrowRight size={20} />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;
