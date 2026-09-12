import { useRef, useState } from "react";
import { Factory, FlaskConical, Pause, Pickaxe, Play } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import showcaseStill from "@/assets/banner-clean.webp";
import facilityVideo from "@/assets/facility.mp4";

/* Line icons rather than emoji. Emoji render as a different picture on every
   OS, announce as "pick emoji" / "microscope emoji" to a screen reader, and
   read as consumer rather than trade - the wrong register for a buyer doing
   due diligence. Decorative here, so aria-hidden: the heading says it. */
const features = [
  {
    icon: Pickaxe,
    title: "Traditional Mining",
    body: "Hand-mined from ancient Khewra salt mines",
  },
  {
    icon: FlaskConical,
    title: "Quality Tested",
    body: "PCSIR lab report available on request",
  },
  {
    icon: Factory,
    title: "In-House Processing",
    body: "Khanewal facility operational, crushing and grading in-house",
  },
];

const VideoShowcase = () => {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const header = useReveal<HTMLDivElement>();
  const feats = useReveal<HTMLDivElement>();

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      // play() rejects when autoplay is blocked or the element is torn
      // down mid-gesture; swallow it so the button never throws at a user.
      void v.play().then(
        () => setPlaying(true),
        () => setPlaying(false),
      );
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section id="video-section" className="pt-24 md:pt-32 pb-16 md:pb-20 bg-salt-dark relative overflow-hidden">
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
          <div className="relative rounded-lg overflow-hidden border border-primary-foreground/10 elev-dark">
            {prefersReduced ? (
              <img
                src={showcaseStill}
                alt="Himalayan pink salt crushing and grading at the AAA Trade House facility near Kot Abbas Shaheed, Khanewal"
                loading="lazy"
                onLoad={() => setMediaLoaded(true)}
                className={`w-full aspect-video object-cover media-load ${mediaLoaded ? "is-loaded" : ""}`}
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={showcaseStill}
                  aria-label="AAA Trade House salt processing facility"
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                  onLoadedData={() => setMediaLoaded(true)}
                  className={`w-full aspect-video object-cover media-load ${mediaLoaded ? "is-loaded" : ""}`}
                >
                  <source src={facilityVideo} type="video/mp4" />
                </video>
                {/* WCAG 2.2.2: motion that starts on its own and runs past
                    five seconds needs a way to stop it. The clip loops, so
                    without this there is none. Sits above the falloff
                    gradient, which is pointer-events-none. */}
                <button
                  type="button"
                  onClick={toggle}
                  aria-pressed={!playing}
                  aria-label={playing ? "Pause facility video" : "Play facility video"}
                  className="absolute bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-md border border-primary-foreground/20 bg-salt-dark/80 px-3 py-2 text-xs font-medium uppercase tracking-wide text-primary-foreground backdrop-blur-sm transition-colors hover:bg-salt-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-salt-dark"
                >
                  {playing ? (
                    <Pause className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Play className="w-4 h-4" aria-hidden="true" />
                  )}
                  {playing ? "Pause" : "Play"}
                </button>
              </>
            )}
            {/* Edge falloff so the clip sits in the section rather than on it. */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-salt-dark/60 via-transparent to-transparent" />
          </div>
        </div>

        {/* Features Below Video */}
        <div ref={feats} className="reveal-group grid sm:grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-12 mt-16 max-w-6xl mx-auto border-t border-primary-foreground/10 pt-12">
          {features.map((f, i) => (
            <div key={f.title} className="text-left" style={{ "--reveal-delay": `${i * 60}ms` } as React.CSSProperties}>
              <div className="w-11 h-11 rounded-md bg-primary-foreground/5 border border-primary-foreground/10 flex items-center justify-center mb-4 elev-dark">
                <f.icon className="w-5 h-5 text-salt-coral" aria-hidden="true" strokeWidth={1.5} />
              </div>
              <h3 className="text-primary-foreground font-medium mb-2">{f.title}</h3>
              <p className="text-primary-foreground/50 text-sm leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;