import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain } from "lucide-react";
import heroStill from "@/assets/hero-salt.jpg";

/* Editorial spec column. Values are confirmed facts - do not invent rows. */
const specs = [
  { value: "100+", label: "Tonnes per month capacity" },
  { value: "4", label: "Salt grades" },
  { value: "0", label: "Middlemen" },
];

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden bg-salt-dark"
    >
      {/* ─────────────────────────────────────────────────────────────
          VIDEO SLOT
          Currently a still. To use real footage, replace the <img>
          below with:

            <video autoPlay muted loop playsInline
                   poster={heroStill} preload="metadata" aria-hidden="true"
                   className="w-full h-full object-cover scale-105">
              <source src={heroVideo} type="video/mp4" />
            </video>

          ...and add: import heroVideo from "@/assets/<file>.mp4";
          Nothing else needs to change - the gradients sit above it.
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <img
          src={heroStill}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="w-full h-full object-cover scale-105"
        />
        {/* Cinematic falloff - keeps display type crisp over any frame. */}
        <div className="absolute inset-0 bg-gradient-to-b from-salt-dark/75 via-salt-dark/55 to-salt-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-salt-dark/95 via-salt-dark/50 to-salt-dark/10" />
      </div>

      {/* Film grain */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left: display type ── */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2.5 mb-8 animate-fade-in">
              <Mountain size={16} className="text-accent" />
              <span className="text-xs uppercase tracking-[0.2em] text-primary-foreground/70">
                Direct from a PMDC-leased mine — no trading layer
              </span>
            </div>

            <h1
              className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground leading-[0.95] tracking-tight mb-8 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Himalayan
              <br />
              Pink Salt
              <br />
              <span className="text-accent">Experts</span>
            </h1>

            <p
              className="text-base md:text-lg text-primary-foreground/70 mb-10 max-w-xl leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Bulk Himalayan pink salt in coarse, fine, edible and chunk grades —
              sourced direct from a PMDC-leased mine, with no trading layer between
              the mine and your container.
            </p>

            <div
              className="flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Button asChild variant="hero" size="xl">
                <a href="#contact">
                  Get Quote
                  <ArrowRight size={18} />
                </a>
              </Button>
              <Button
                asChild
                size="xl"
                variant="outline"
                className="border-primary-foreground/25 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <a href="#products">View Products</a>
              </Button>
            </div>
          </div>

          {/* ── Right: editorial spec column ── */}
          <div
            className="lg:col-span-5 lg:pl-8 animate-fade-in"
            style={{ animationDelay: "0.45s" }}
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/40 mb-6">
              At a glance
            </p>
            <dl className="border-t border-primary-foreground/15">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between gap-6 py-5 border-b border-primary-foreground/15"
                >
                  <dt className="text-sm text-primary-foreground/60">{s.label}</dt>
                  <dd className="font-serif text-4xl md:text-5xl font-bold text-primary-foreground tabular-nums">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-primary-foreground/40 leading-relaxed">
              PMDC certification on the edible grade. PCSIR lab report on request.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-7 h-12 rounded-full border border-primary-foreground/25 flex items-start justify-center p-2">
          <div className="w-1 h-2.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
