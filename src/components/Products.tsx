import { Button } from "@/components/ui/button";
import { ArrowRight, Utensils, Factory, PawPrint, Lamp, Package, Boxes, Ruler, Tag } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { useSpotlight } from "@/hooks/use-spotlight";
import saltRawClose from "@/assets/salt-raw-close.webp";
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
    // No spec figures on the site. The lab report is old and the
    // business is not publishing numbers a buyer could test against yet.
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
  const spot = useSpotlight<HTMLDivElement>();
  const packs = useReveal<HTMLDivElement>();

  return (
    <section id="products" className="py-24 md:py-32 bg-background relative">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div ref={header} className="reveal text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">Product Portfolio</p>
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
        <div onPointerMove={spot.onPointerMove} onPointerLeave={spot.onPointerLeave} ref={grid} className="stage reveal-group grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border rounded-lg overflow-hidden">
          {products.map((product, index) => (
            <div
              key={product.name}
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
              className="spot tilt border border-transparent group relative bg-card p-8 lg:p-10 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="brighten font-serif text-3xl font-bold text-foreground/50 tabular-nums leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <product.icon className="w-5 h-5 text-accent/60 group-hover:text-accent transition-colors" />
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
                /* py-2 -mb-2: the link measured 255x20 on a phone, under
                   the 24px minimum in WCAG 2.2 SC 2.5.8. The negative
                   margin keeps the card's spacing identical while the
                   hit area grows to 36px. */
                className="inline-flex items-center gap-2 py-2 -mb-2 text-sm font-medium text-accent hover:gap-3 transition-all duration-[180ms] ease-[var(--ease-out)]"
              >
                Request samples
                <ArrowRight className="arc-arrow w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        {/* Packaging, with the photograph as its right column.
            The image used to sit alone in a centred band, which is why
            it read as taking space for nothing: it had no neighbour and
            no argument to support. Paired with the bulk copy it is
            doing a job - the buyer reads the sizes on the left and sees
            the material they apply to on the right.

            It also stops being a full-width element, which is what
            fixes the resolution: at lg it paints around 600px from a
            1200px source, comfortably sharp even on a 2x screen. */}
        <div ref={packs} className="reveal mt-20 bg-salt-cream rounded-lg p-8 md:p-12 lg:p-14">
          <div className="grid lg:grid-cols-12 gap-x-14 gap-y-10 items-center mb-12">
            <div className="lg:col-span-7">
              <p className="text-accent font-semibold mb-3 tracking-widest uppercase text-sm">Packaging</p>
              <h3 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-3">
                Any bulk size you need.
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-2xl">
                Standard export bags, jumbo bags, or a size you specify. Tell us what your
                line runs and we pack to it.
              </p>
            </div>

            <figure className="lg:col-span-5">
              <div className="rounded-xl overflow-hidden border border-border">
                <img
                  src={saltRawClose}
                  alt="Raw Himalayan pink salt chunks at the AAA Trade House plant, showing natural colour variation from pale to deep pink"
                  loading="lazy"
                  width={1200}
                  height={1500}
                  className="w-full aspect-[4/5] object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-muted-foreground">
                Raw salt at our Khanewal plant, before crushing and grading.
                Colour varies naturally across the same seam.
              </figcaption>
            </figure>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Available now</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden">
            <div className="bg-card p-6 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40">
              <Package className="w-5 h-5 text-accent mb-5" aria-hidden="true" strokeWidth={1.5} />
              <h4 className="font-serif text-xl font-bold text-foreground mb-1 leading-tight">25 / 50 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">PP export bags</p>
              <p className="text-muted-foreground text-sm leading-relaxed">Standard distribution sizes.</p>
            </div>
            <div className="bg-card p-6 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40">
              <Boxes className="w-5 h-5 text-accent mb-5" aria-hidden="true" strokeWidth={1.5} />
              <h4 className="font-serif text-xl font-bold text-foreground mb-1 leading-tight">1000 kg</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">Jumbo bags</p>
              <p className="text-muted-foreground text-sm leading-relaxed">For large-scale operations.</p>
            </div>
            <div className="bg-card p-6 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40">
              <Ruler className="w-5 h-5 text-accent mb-5" aria-hidden="true" strokeWidth={1.5} />
              <h4 className="font-serif text-xl font-bold text-foreground mb-1 leading-tight">Custom</h4>
              <p className="text-sm font-medium text-foreground/70 mb-2">To your specification</p>
              <p className="text-muted-foreground text-sm leading-relaxed">Name the size, we pack to it.</p>
            </div>
            <div className="bg-card p-6 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40">
              <Tag className="w-5 h-5 text-accent mb-5" aria-hidden="true" strokeWidth={1.5} />
              <h4 className="font-serif text-xl font-bold text-foreground mb-1 leading-tight">500 g / 1 kg</h4>
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
