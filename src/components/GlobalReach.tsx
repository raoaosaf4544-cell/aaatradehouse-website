import { useReveal } from "@/hooks/use-reveal";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

/**
 * The physical route the salt takes, replacing what used to be three
 * concentric circles, a mountain icon and four floating pills.
 *
 * The old right column carried no information: the pills repeated facts
 * already on the page ("100+ t / month" and "4 grades" are in the hero spec
 * column; "PCSIR on request" sat two inches to their left), and it ran five
 * infinite animations to do it. A procurement buyer reads a supply chain,
 * not a pulsing circle.
 *
 * Deliberately NOT a numbered timeline. Ordering already owns that pattern
 * further down the page, and two numbered-step sections would compete
 * rather than reinforce. This is geography - where the salt goes; Ordering
 * is process - what the buyer does.
 *
 * Every fact here is confirmed. Two things are deliberately absent: no port
 * is named, and no shipment count is given.
 */
const route = [
  {
    place: "PMDC-leased mines",
    region: "Khewra and other Pakistani mines",
    detail:
      "Sourced primarily direct from PMDC. Where we draw on other local suppliers, the material is tested and you are told.",
  },
  {
    place: "Khanewal",
    region: "Near Kot Abbas Shaheed",
    detail:
      "Crushing and grading handled in-house at our own plant, not subcontracted.",
  },
  {
    place: "Lahore",
    region: "Valencia Town",
    detail:
      "Contracts and invoices issued by AAA General Trading, a registered Chamber of Commerce member.",
  },
  {
    place: "Your container",
    region: "Four grades, packed to specification",
    detail:
      "Over 100 tonnes a month across coarse, fine, edible and chunk, in the packaging your market needs.",
  },
];

/* Incoterms are among the first things an importer looks for and the site
   did not state them anywhere.

   Karachi and Port Qasim are two SEPARATE seaports, not one place with two
   names, and which is used is decided per booking - so both are named.
   "FOB Karachi" alone would be wrong half the time, and to a freight
   forwarder that is not a rounding error.

   "Other" stays deliberately unnamed. EXW, CFR and FCA have not been
   confirmed as terms we can actually quote, and naming a term we then
   cannot honour is worse in a negotiation than not listing it. */
const terms = [
  { code: "FOB", note: "Our usual basis — Karachi or Port Qasim" },
  { code: "CIF", note: "Available on request" },
  { code: "Other", note: "Quoted to your requirement" },
];

const GlobalReach = () => {
  const intro = useReveal<HTMLDivElement>();
  const rail = useReveal<HTMLOListElement>();
  const [track, progress] = useScrollProgress<HTMLDivElement>();

  /* Remap raw viewport progress so the rail finishes while the section is
     still comfortably on screen. Left raw, it would only complete as the
     block scrolled off the top, and nobody would see the last node light. */
  const drawn = Math.min(1, Math.max(0, (progress - 0.12) / 0.45));

  return (
    <section
      id="global"
      className="pt-16 md:pt-20 pb-32 md:pb-44 bg-salt-dark text-primary-foreground overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-x-16 gap-y-16">
          {/* Left: the claim and the commercial terms behind it. */}
          <div ref={intro} className="reveal lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
              Export Capability
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.05] tracking-tight mb-6">
              From the mine to your container.
            </h2>
            <p className="text-primary-foreground/60 text-base md:text-lg leading-relaxed mb-12">
              We source primarily direct from PMDC, grade to order, and pack for
              bulk shipment. There is no trading layer, so the people arranging
              your container are the people who know the mine — and batches are
              PCSIR tested either way.
            </p>

            <dl className="border-t border-primary-foreground/15">
              <div className="py-4 border-b border-primary-foreground/15">
                <dt className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-3">
                  Shipping terms
                </dt>
                <dd className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
                  {terms.map((t) => (
                    <span key={t.code} className="flex items-baseline gap-2">
                      <span className="font-serif text-2xl font-bold text-primary-foreground">
                        {t.code}
                      </span>
                      <span className="text-xs text-primary-foreground/50">
                        {t.note}
                      </span>
                    </span>
                  ))}
                </dd>
              </div>
              <div className="py-4 border-b border-primary-foreground/15">
                <dt className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-1.5">
                  Minimum order
                </dt>
                <dd className="text-sm text-primary-foreground/60 leading-relaxed">
                  No fixed minimum. Tell us the volume, grade and packaging you
                  need and we quote to it.
                </dd>
              </div>
              <div className="py-4 border-b border-primary-foreground/15">
                <dt className="text-xs uppercase tracking-[0.16em] text-primary-foreground/60 mb-1.5">
                  Certification
                </dt>
                <dd className="text-sm text-primary-foreground/60 leading-relaxed">
                  PMDC certification on the edible grade, halal certified,
                  PCSIR-tested batches, and the certifications your order
                  requires.
                </dd>
              </div>
            </dl>
          </div>

          {/* Right: the route. A hairline rail with a node per stage - the
              same vocabulary as the Ordering strip and the Products grid,
              so it reads as part of the site rather than a widget.

              The rail draws itself as the section is read. The motion is
              the one thing on this page that carries meaning rather than
              decorating: it is the supply chain being traced. Under
              reduced motion the hook pins progress at 1, so the rail is
              simply already drawn - the end state, not a degraded one. */}
          <div ref={track} className="relative lg:col-span-6 lg:col-start-7">
            {/* Unlit track, full height. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 bottom-6 w-px bg-primary-foreground/15"
            />
            {/* Lit portion. scaleY on a transform-only property, so this
                never triggers layout while scrolling. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 bottom-6 w-px origin-top bg-accent"
              style={{ transform: `scaleY(${drawn})` }}
            />

            <ol ref={rail} className="reveal-group">
              {route.map((stop, i) => {
                // A node lights once the rail has reached it.
                const reached = drawn >= (i + 0.35) / route.length;
                return (
                  <li
                    key={stop.place}
                    style={{ "--reveal-delay": `${i * 70}ms` } as React.CSSProperties}
                    className="relative pl-8 pb-10 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[4.5px] top-1.5 h-2 w-2 rounded-full ring-4 ring-salt-dark transition-colors duration-500 ${
                        reached ? "bg-accent" : "bg-primary-foreground/25"
                      }`}
                    />
                    <p className="text-[11px] uppercase tracking-[0.18em] text-accent mb-2">
                      {stop.region}
                    </p>
                    <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight mb-2">
                      {stop.place}
                    </h3>
                    <p className="text-sm text-primary-foreground/55 leading-relaxed max-w-md">
                      {stop.detail}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalReach;
