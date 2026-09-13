import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
/* Real photograph of our own raw salt, replacing an AI-looking still.
   Fewer pixels than the image it replaces (1200x800 vs 1920x1080) and
   that is a deliberate trade: it sits under two heavy falloff gradients
   and a grain layer, so the softness never shows, and the brief is
   explicit that the generated imagery is a problem worth solving. */
import heroStill from "@/assets/salt-raw-wide.webp";
import { CountUp } from "@/components/CountUp";
import { useScrollProgress } from "@/hooks/use-scroll-progress";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

/* Editorial spec column. Values are confirmed facts - do not invent rows.
   "0 Middlemen" used to sit in the third slot. It contradicted the
   "primarily direct from PMDC" wording everywhere else on the site -
   "primarily" concedes that some volume is not direct, so "0" was not a
   softer claim, it was a false one. A buyer who finds both statements in
   the same due-diligence pass stops reading.

   The replacement is a registration date rather than a softer sourcing
   claim: it is checkable against the register, which is what a buyer doing
   diligence actually wants from this column. CountUp does not animate it -
   anything >= 1900 is treated as a year, so it renders flat instead of
   spinning up from zero like an odometer. */
const specs = [
  { value: "100+", label: "Tonnes per month capacity" },
  { value: "4", label: "Salt grades" },
  { value: "2009", label: "AAA General Trading registered" },
];

const Hero = () => {
  const [section, progress] = useScrollProgress<HTMLElement>();
  const reduced = usePrefersReducedMotion();
  /* Depth without a 3D engine: the backdrop rises at a fraction of scroll
     speed while the type stays put. Capped small - past about 15% the two
     planes visibly desync and it reads as a bug. Never applied to the
     text, which would hurt reading and can provoke motion sickness.

     The reduced check is not redundant. useScrollProgress pins progress
     at 1 under reduced motion, which is the right end state for a rail
     that draws itself but the wrong one here: it would park the image at
     a permanent +45px offset rather than leaving it where it belongs. */
  const drift = reduced ? 0 : (progress - 0.5) * 90;

  return (
    <section
      ref={section}
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
      {/* scale-110 rather than 105: the parallax drift would otherwise
          expose the bottom edge as the layer rises.

          NO duotone here. It was tried and removed: the salt is pink, and
          pink is the product. Grading a Himalayan salt photograph to navy
          and terracotta throws away the single thing a salt buyer is
          looking for. The treatment makes generic imagery read as art
          direction; on your own product it just makes the goods look
          wrong. Do not reapply it to anything showing salt. */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${drift}px, 0)` }}
      >
        <img
          src={heroStill}
          alt=""
          aria-hidden="true"
          /* lowercase: React 18 does not recognise the camelCase
             prop, so it renders on the client but not in the
             prerender - an attribute mismatch on hydration */
          fetchpriority="high"
          className="w-full h-full object-cover scale-110"
        />
        {/* Cinematic falloff - keeps display type crisp over any frame. */}
        <div className="absolute inset-0 bg-gradient-to-b from-salt-dark/85 via-salt-dark/70 to-salt-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-salt-dark via-salt-dark/75 to-salt-dark/25" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* ── Left: display type ── */}
          <div className="lg:col-span-7">
            {/* Was an icon + pill badge reading "Primarily direct from PMDC
                - no trading layer". Two problems: the paragraph four lines
                below says the same thing in better English, so the hedge
                was being made twice; and an icon-pill above the H1 is the
                single most recognisable generated-landing-page tell. This
                is now the same eyebrow treatment every other section uses,
                and it orients rather than claims. */}
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-8 animate-fade-in">
              Bulk export · Lahore, Pakistan
            </p>

            <h1
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-primary-foreground leading-[0.88] tracking-[-0.02em] mb-8"
            >
              <span className="line-mask">
                <span className="line-in" style={{ "--line-delay": "80ms" } as React.CSSProperties}>
                  Himalayan
                </span>
              </span>
              <span className="line-mask">
                <span className="line-in" style={{ "--line-delay": "200ms" } as React.CSSProperties}>
                  Salt
                </span>
              </span>
              <span className="line-mask">
                <span className="line-in text-accent italic" style={{ "--line-delay": "320ms" } as React.CSSProperties}>
                  Experts
                </span>
              </span>
            </h1>

            <p
              className="text-base md:text-lg text-primary-foreground/70 mb-10 max-w-xl leading-relaxed animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Bulk Himalayan pink salt in coarse, fine, edible and chunk grades,
              sourced primarily direct from PMDC. No trading layer between the mine
              and your container, and batches PCSIR tested.
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
            <p className="text-xs uppercase tracking-[0.2em] text-primary-foreground/55 mb-6">
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
                    <CountUp value={s.value} />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs text-primary-foreground/55 leading-relaxed">
              PMDC certification on the edible grade. PCSIR lab report on request.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
