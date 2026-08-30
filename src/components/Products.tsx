import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Utensils, ShieldCheck, Mountain, Package, Boxes, Ruler, Tag } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { LucideIcon } from "lucide-react";

interface Product {
  name: string;
  description: string;
  uses: string;
  icon: LucideIcon;
  gradient: string;
}

const products: Product[] = [
  {
    name: "Coarse",
    description: "Coarse-ground Himalayan pink salt, supplied in bulk for processing and resale.",
    uses: "Industrial processing, bulk resale, further grading",
    icon: Layers,
    gradient: "from-slate-600 to-slate-800",
  },
  {
    name: "Fine",
    description: "Fine-ground Himalayan pink salt for food manufacturing and table use.",
    uses: "Food manufacturing, seasoning, table salt",
    icon: Utensils,
    gradient: "from-rose-500 to-pink-600",
  },
  {
    name: "Edible",
    description: "Food-grade Himalayan pink salt. Carries PMDC certification at product level.",
    uses: "Food brands — carries PMDC certification",
    icon: ShieldCheck,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "Chunks",
    description: "Raw salt chunks and rock, supplied direct from the mine.",
    uses: "Lamp and décor manufacturers, animal licks, processing",
    icon: Mountain,
    gradient: "from-blue-600 to-indigo-700",
  },
];

const Products = () => {
  const header = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const packs = useReveal<HTMLDivElement>();

  return (
    <section id="products" className="py-28 md:py-36 bg-background relative">
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
            Complete Salt Solutions
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Four grades of Himalayan pink salt — coarse, fine, edible and chunks — supplied
            in bulk from Khewra and other Pakistani mines, with packaging and private
            labelling to your specification. PCSIR lab report available on request.
          </p>
        </div>

        {/* Products Grid */}
        <div ref={grid} className="reveal-group grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.name}
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
              className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 border border-transparent hover:border-primary/30"
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${product.gradient} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10" />
                <product.icon className="w-16 h-16 text-white/90 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10" />
                <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-white/5" />
              </div>
              
              {/* Content */}
              <div className="p-8">
                <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                  {product.name}
                </h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-salt-warm uppercase tracking-wide w-16 flex-shrink-0">Uses:</span>
                    <span className="text-sm text-muted-foreground">{product.uses}</span>
                  </div>
                </div>
                <Button asChild variant="outline" className="w-full group/btn justify-center">
                  <a href="#contact">
                    Request Samples
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Packaging Info */}
        <div ref={packs} className="reveal mt-20 bg-salt-cream rounded-lg p-10 md:p-14">
          <p className="text-primary font-semibold mb-3 tracking-widest uppercase text-sm">Packaging</p>
          <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
            Any bulk size you need.
          </h3>
          <p className="text-muted-foreground mb-10 max-w-2xl">
            Standard export bags, jumbo bags, or a size you specify. Tell us what your
            line runs and we pack to it.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">Available now</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Package className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">25 / 50 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">PP export bags</p>
              <p className="text-muted-foreground text-sm">Standard distribution sizes.</p>
            </div>
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Boxes className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">1000 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">Jumbo bags</p>
              <p className="text-muted-foreground text-sm">For large-scale operations.</p>
            </div>
            <div className="bg-card rounded-md border border-border/50 p-6 transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft">
              <div className="w-14 h-14 rounded-md bg-gradient-accent flex items-center justify-center mb-4">
                <Ruler className="w-7 h-7 text-primary-foreground" />
              </div>
              <h4 className="font-serif text-xl font-bold text-foreground mb-1">Custom</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">To your specification</p>
              <p className="text-muted-foreground text-sm">Name the size, we pack to it.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-12 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">In development</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="md:max-w-sm rounded-md border border-dashed border-border p-6 opacity-70">
            <div className="w-14 h-14 rounded-md border border-border flex items-center justify-center mb-4">
              <Tag className="w-7 h-7 text-muted-foreground" />
            </div>
            <h4 className="font-serif text-xl font-bold text-foreground mb-1">500 g / 1 kg</h4>
            <p className="text-sm font-medium text-foreground/70 mb-2">Branded retail packs</p>
            <p className="text-muted-foreground text-sm">
              Private labelling. Arrives with the Rashide plant.
            </p>
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
