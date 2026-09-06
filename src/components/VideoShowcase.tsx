import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import showcaseStill from "@/assets/banner-clean.webp";
import facilityVideo from "@/assets/facility.mp4";

const VideoShowcase = () => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const header = useReveal<HTMLDivElement>();
  const feats = useReveal<HTMLDivElement>();

  return (
    <section id="video-section" className="py-28 md:py-36 bg-salt-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--salt-coral)) 1px, transparent 0)`,
          backgroundSize: '50px 50px',
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div ref={header} className="reveal max-w-3xl mb-14">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">See Us in Action</p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.05] tracking-tight mb-6">
            From Mine to Market
          </h2>
          <p className="text-primary-foreground/60 text-base md:text-lg leading-relaxed">
            How we source, process and export Himalayan pink salt — from Khewra and
            other Pakistani mines to your container.
          </p>
        </div>

        {/* Real facility footage. Below the fold, so preload="none"
            keeps it out of the hero's critical path. */}
        <div className="max-w-6xl mx-auto">
          <div className="relative rounded-lg overflow-hidden border border-primary-foreground/10">
            {prefersReduced ? (
              <img
                src={showcaseStill}
                alt="Himalayan pink salt crushing and grading at the AAA Trade House facility near Kot Abbas Shaheed, Khanewal"
                loading="lazy"
                onLoad={() => setMediaLoaded(true)}
                className={`w-full aspect-video object-cover media-load ${mediaLoaded ? "is-loaded" : ""}`}
              />
            ) : (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={showcaseStill}
                aria-label="AAA Trade House salt processing facility"
                onLoadedData={() => setMediaLoaded(true)}
                className={`w-full aspect-video object-cover media-load ${mediaLoaded ? "is-loaded" : ""}`}
              >
                <source src={facilityVideo} type="video/mp4" />
              </video>
            )}
            {/* Edge falloff so the clip sits in the section rather than on it. */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-salt-dark/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Features Below Video */}
        <div ref={feats} className="reveal-group grid md:grid-cols-3 gap-10 mt-16 max-w-6xl mx-auto border-t border-primary-foreground/10 pt-12">
          <div className="text-left" style={{ "--reveal-delay": "0ms" } as React.CSSProperties}>
            <div className="w-11 h-11 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center mb-4">
              <span className="text-2xl">⛏️</span>
            </div>
            <h3 className="text-primary-foreground font-medium mb-2">Traditional Mining</h3>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">Hand-mined from ancient Khewra salt mines</p>
          </div>
          <div className="text-left" style={{ "--reveal-delay": "60ms" } as React.CSSProperties}>
            <div className="w-11 h-11 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-primary-foreground font-medium mb-2">Quality Tested</h3>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">PCSIR lab report available on request</p>
          </div>
          <div className="text-left" style={{ "--reveal-delay": "120ms" } as React.CSSProperties}>
            <div className="w-11 h-11 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center mb-4">
              <span className="text-2xl">🏭</span>
            </div>
            <h3 className="text-primary-foreground font-medium mb-2">In-House Processing</h3>
            <p className="text-primary-foreground/50 text-sm leading-relaxed">Khanewal facility operational, crushing and grading in-house</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;