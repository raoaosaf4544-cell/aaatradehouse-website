import { useState } from "react";
import { Shield, Leaf, FlaskConical, Building2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
/* Real photograph, shot at the plant. Replaces salt-packing.webp, which
   was AI-looking AND technically worse: 900x600 landscape being cropped
   to a 4:5 portrait frame and upscaled. This one is natively 1200x1500. */
import loading from "@/assets/loading.webp";
import bannerImage from "@/assets/banner-clean.webp";

const features = [
  {
    icon: Shield,
    title: "PMDC-Certified Edible Grade",
    description: "Our edible grade carries PMDC certification. The certification is product-level, on the edible grade — not company-wide.",
  },
  {
    icon: Leaf,
    title: "Direct from Source",
    description: "Primarily direct from PMDC. Where we draw on other local suppliers, we test the material and keep you in the loop.",
  },
  {
    icon: FlaskConical,
    title: "Tested, Report on Request",
    description: "High-purity salt, PCSIR tested and halal certified. Independent laboratory report available on request, and required certifications provided for orders that need them.",
  },
  {
    icon: Building2,
    title: "Registered Entity",
    description: "Contracts and invoices are issued by AAA General Trading, our registered company and a Chamber of Commerce member. AAA Trade House is the export brand.",
  },
];

const About = () => {
  const header = useReveal<HTMLDivElement>();
  const grid = useReveal<HTMLDivElement>();
  const story = useReveal<HTMLDivElement>();
  const why = useReveal<HTMLDivElement>();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section id="about" className="py-24 md:py-32 bg-salt-cream relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <img src={bannerImage} alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        {/* Left-aligned, like every other section header on the site. A
            centred header over a dead-even four-column grid is the most
            generic composition available and it was the only one here. */}
        <div ref={header} className="reveal max-w-2xl mb-16">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Why AAA Trade House</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
            Our Heritage & Strength
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Family experience in Pakistan's salt trade since 1994, operating as the export
            brand of AAA General Trading.
          </p>
        </div>

        {/* Features Grid.
            Was four floating cards, each with a blurred coral blob behind
            the corner, a gradient-filled icon tile, a drop shadow and a
            lift-on-hover. That is the exact vocabulary the brief rules out
            - no gradient meshes, no blobs - and it did not match Products
            or Industries, which both use a hairline gap-px grid. Now it
            does, so the three read as one system. */}
        <div ref={grid} className="reveal-group grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-lg overflow-hidden mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card p-8 flex flex-col transition-colors duration-[180ms] ease-[var(--ease-out)] hover:bg-secondary/40"
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
            >
              <feature.icon className="w-5 h-5 text-primary mb-6" aria-hidden="true" strokeWidth={1.5} />
              <h3 className="font-serif text-xl font-bold text-foreground mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div ref={story} className="reveal grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Our Story</p>
            <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
              In salt since 1994.
            </h3>
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
              <p>
                Our family has worked in Pakistan's salt trade for over 30 years. In
                2009 we formalised the business as AAA General Trading, our registered
                company. AAA Trade House is our dedicated Himalayan pink salt export
                brand, operating under it.
              </p>
              <p>
                We source primarily direct from PMDC. Where we draw on other local
                suppliers, we test the material and keep you in the loop. We hold over
                100 tonnes a month across coarse, fine, edible and chunk grades, with PMDC
                certification on the edible grade.
              </p>
              <p>
                Our facility near Kot Abbas Shaheed, Khanewal is operational, handling crushing and
                grading in-house. We already supply the domestic market, shipping to
                Karachi and across Pakistan under our own registered salt brand.
              </p>
            </div>
            
            {/* Company & Legal Structure */}
            <div className="mt-10 border-l-2 border-primary pl-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">
                Company &amp; Legal Structure
              </p>
              <p className="text-muted-foreground leading-relaxed">
                AAA Trade House is the export brand of{" "}
                <strong className="font-semibold text-foreground">AAA General Trading</strong>,
                our registered company operating since 2009. Contracts, invoices and
                banking documents are issued in the name of AAA General Trading.
              </p>
              {/* The shipment count is deliberately not on the site. It is
                  internal context, not a public credential. */}
              <p className="text-muted-foreground leading-relaxed mt-4">
                The export brand is younger than the company. Domestic supply
                across Pakistan is established, under our own registered salt
                brand, and the export side runs on the same plant, the same
                grades and the same registered entity.
              </p>
            </div>

          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden border border-border">
              <img
                src={loading}
                alt="Raw Himalayan pink salt being loaded at the AAA Trade House plant near Kot Abbas Shaheed, Khanewal"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-700 media-load ${imgLoaded ? "is-loaded" : ""}`}
              />
            </div>
            {/* Floating Badge */}
            {/* shadow-elevated, not elev-dark: this card sits on cream, and
                elev-dark's lift comes from a white inset highlight that is
                invisible on a light surface. */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-md border border-border shadow-elevated">
              <p className="font-serif text-2xl font-bold text-primary">PMDC</p>
              <p className="text-sm text-muted-foreground">Certified edible grade</p>
            </div>
          </div>
        </div>

        {/* Why we do this */}
        <div ref={why} className="reveal mt-24 pt-16 border-t border-border">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Why We Do This</p>
            <p className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-snug mb-7">
              For over thirty years our family has worked with Himalayan salt, learned
              hands-on and passed down, not taught at a desk.
            </p>
            <div className="space-y-5 text-muted-foreground text-lg leading-relaxed">
              <p>
                In 2009 we formalised the business as AAA General Trading. Today a new
                generation leads the export side: someone who grew up around this trade
                and set out early to take the family's salt to the world.
              </p>
              <p>
                We run it on transparency and persistence. We tell you what we know and
                what we do not, and we do not give up when something gets difficult. You
                are a buyer we know by name, not a ticket number, and we put our own name
                on every shipment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
