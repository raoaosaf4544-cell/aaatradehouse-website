import { useState } from "react";
import { Shield, Leaf, FlaskConical, Building2 } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import saltPacking from "@/assets/salt-packing.jpg";
import bannerImage from "@/assets/banner-clean.jpg";

const features = [
  {
    icon: Shield,
    title: "PMDC-Certified Edible Grade",
    description: "Our edible grade carries PMDC certification. The certification is product-level, on the edible grade — not company-wide.",
  },
  {
    icon: Leaf,
    title: "Direct from Source",
    description: "No middlemen. Direct supply from Khewra and other Pakistani salt mines, with no trading layer in between.",
  },
  {
    icon: FlaskConical,
    title: "PCSIR Report on Request",
    description: "Independent PCSIR laboratory analysis available on request.",
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
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <section id="about" className="py-28 md:py-36 bg-salt-cream relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <img src={bannerImage} alt="" className="w-full h-full object-cover" />
      </div>
      
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div ref={header} className="reveal text-center max-w-3xl mx-auto mb-20">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-5">Why AAA Trade House</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] tracking-tight mb-6">
            Our Heritage & Strength
          </h2>
          <p className="text-muted-foreground text-lg">
            Family experience in Pakistan's salt trade since 1994, operating as the export
            brand of AAA General Trading.
          </p>
        </div>

        {/* Features Grid */}
        <div ref={grid} className="reveal-group grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative bg-card p-8 rounded-lg shadow-soft hover:shadow-elevated transition-all duration-[180ms] ease-[var(--ease-out)] hover:-translate-y-1 hover:border-primary/30 group border border-border/50"
              style={{ "--reveal-delay": `${Math.min(index, 3) * 60}ms` } as React.CSSProperties}
            >
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-salt-coral/10 rounded-full blur-2xl group-hover:bg-salt-coral/20 transition-colors" />
              <div className="w-16 h-16 rounded-md bg-gradient-accent flex items-center justify-center mb-6 shadow-lg">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
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
                Our family has worked in Pakistan's salt trade since 1994. AAA Trade House is
                the export brand of AAA General Trading, supplying bulk Himalayan pink salt
                direct from a PMDC-leased mine.
              </p>
              <p>
                There is no trading layer between the mine and your container. We hold 100
                tonnes a month across coarse, fine, edible and chunk grades, with PMDC
                certification on the edible grade.
              </p>
              <p>
                Our facility near Rashide, Multan is under construction and has begun
                processing, bringing crushing and grading in-house.
              </p>
            </div>
            
            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-10 border-t border-border">
              <div>
                <p className="font-serif text-3xl font-bold text-primary">1994</p>
                <p className="text-sm text-muted-foreground mt-1">Family in salt since</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">100</p>
                <p className="text-sm text-muted-foreground mt-1">Tonnes per month</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-bold text-primary">4</p>
                <p className="text-sm text-muted-foreground mt-1">Grades supplied</p>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <img
                src={saltPacking}
                alt="AAA Trade House salt packing process"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover hover:scale-105 transition-transform duration-700 media-load ${imgLoaded ? "is-loaded" : ""}`}
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-md shadow-elevated border border-border">
              <p className="font-serif text-2xl font-bold text-primary">PMDC</p>
              <p className="text-sm text-muted-foreground">Certified edible grade</p>
            </div>
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-accent opacity-20 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
