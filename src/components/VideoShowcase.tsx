import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import showcaseStill from "@/assets/banner-clean.jpg";

const VideoShowcase = () => {
  const [stillLoaded, setStillLoaded] = useState(false);
  const header = useReveal<HTMLDivElement>();
  const feats = useReveal<HTMLDivElement>();

  return (
    <section id="video-section" className="py-32 bg-salt-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--salt-coral)) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div ref={header} className="reveal text-center max-w-3xl mx-auto mb-16">
          <p className="text-salt-coral font-semibold mb-4 tracking-widest uppercase text-sm">See Us in Action</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
            From Mine to Market
          </h2>
          <p className="text-primary-foreground/70 text-lg">
            How we source, process and export Himalayan pink salt — from Khewra and
            other Pakistani mines to your container.
          </p>
        </div>

        {/* Still image until real footage is shot. Video player returns here. */}
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={showcaseStill}
              alt="Himalayan pink salt grades, bulk sacks and containerised export"
              loading="lazy"
              onLoad={() => setStillLoaded(true)}
              className={`w-full aspect-video object-cover media-load ${stillLoaded ? "is-loaded" : ""}`}
            />
            <div className="absolute inset-0 bg-salt-dark/20" />
          </div>
        </div>

        {/* Features Below Video */}
        <div ref={feats} className="reveal-group grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="text-center" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            <div className="w-12 h-12 mx-auto rounded-xl bg-salt-coral/20 flex items-center justify-center mb-4">
              <span className="text-2xl">⛏️</span>
            </div>
            <h3 className="text-primary-foreground font-semibold mb-2">Traditional Mining</h3>
            <p className="text-primary-foreground/60 text-sm">Hand-mined from ancient Khewra salt mines</p>
          </div>
          <div className="text-center" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
            <div className="w-12 h-12 mx-auto rounded-xl bg-salt-coral/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-primary-foreground font-semibold mb-2">Quality Tested</h3>
            <p className="text-primary-foreground/60 text-sm">PCSIR lab report available on request</p>
          </div>
          <div className="text-center" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className="w-12 h-12 mx-auto rounded-xl bg-salt-coral/20 flex items-center justify-center mb-4">
              <span className="text-2xl">🏭</span>
            </div>
            <h3 className="text-primary-foreground font-semibold mb-2">In-House Processing</h3>
            <p className="text-primary-foreground/60 text-sm">Rashide facility under construction and processing</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;