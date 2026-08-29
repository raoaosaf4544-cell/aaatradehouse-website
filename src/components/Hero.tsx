import { Button } from "@/components/ui/button";
import { ArrowRight, Mountain, Package, ShieldCheck } from "lucide-react";
import heroStill from "@/assets/hero-salt.jpg";
import logo from "@/assets/logo.png";

const Hero = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        {/* Still image until real footage is shot. Video returns here. */}
        <img
          src={heroStill}
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-salt-dark/80 via-salt-dark/60 to-salt-dark/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-salt-dark/50 via-transparent to-salt-dark/30" />
      </div>

      {/* Animated Particles/Grain Effect */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Content */}
      <div className="container mx-auto px-6 relative z-10 pt-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-foreground text-sm font-medium mb-8 animate-fade-in">
              <Mountain size={18} className="text-salt-coral" />
              <span>Direct from a PMDC-leased mine — no trading layer</span>
            </div>

            {/* Heading */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
              Himalayan Pink Salt{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-salt-coral to-salt-pink">
                Experts
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in leading-relaxed" style={{ animationDelay: "0.2s" }}>
              Bulk Himalayan pink salt in coarse, fine, edible and chunk grades —
              sourced direct from a PMDC-leased mine, with no trading layer between
              the mine and your container.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <Button asChild variant="hero" size="xl" className="shadow-2xl">
                <a href="#contact">
                  Get Quote
                  <ArrowRight size={20} />
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 mt-12 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <div className="w-8 h-8 rounded-full bg-salt-coral/20 flex items-center justify-center">
                  <Package size={16} className="text-salt-coral" />
                </div>
                <span>100 tonnes / month capacity</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-sm">
                <div className="w-8 h-8 rounded-full bg-salt-coral/20 flex items-center justify-center">
                  <ShieldCheck size={16} className="text-salt-coral" />
                </div>
                <span>PMDC-certified edible grade</span>
              </div>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="hidden lg:flex justify-center animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <div className="relative">
              {/* Glowing orb behind */}
              <div className="absolute -inset-20 bg-gradient-radial from-salt-coral/20 via-transparent to-transparent rounded-full blur-3xl" />
              
              {/* Stats Card */}
              <div className="relative bg-primary-foreground/5 backdrop-blur-xl border border-primary-foreground/10 rounded-3xl p-10 shadow-2xl">
                <div className="text-center mb-8">
                  <img src={logo} alt="AAA Trade House" className="h-20 mx-auto mb-4" />
                </div>
                
                <div className="space-y-6">
                  <div className="text-center p-4 rounded-2xl bg-primary-foreground/5">
                    <p className="font-serif text-4xl font-bold text-salt-coral">100</p>
                    <p className="text-sm text-primary-foreground/70 mt-1">Tonnes per month capacity</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-2xl bg-primary-foreground/5">
                      <p className="font-serif text-3xl font-bold text-salt-coral">4</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">Salt grades</p>
                    </div>
                    <div className="text-center p-4 rounded-2xl bg-primary-foreground/5">
                      <p className="font-serif text-3xl font-bold text-salt-coral">0</p>
                      <p className="text-xs text-primary-foreground/70 mt-1">Middlemen</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 rounded-full border-2 border-primary-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 rounded-full bg-salt-coral animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
