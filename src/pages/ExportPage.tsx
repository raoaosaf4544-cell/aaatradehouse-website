import PageShell from "@/components/PageShell";
import GlobalReach from "@/components/GlobalReach";
import Ordering from "@/components/Ordering";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

/**
 * /export
 *
 * The page a buyer forwards to their procurement or compliance team, so
 * it carries the commercial terms rather than the brand story: the
 * route, Incoterms, load ports, minimum order, the five ordering steps
 * and the questions importers actually ask.
 *
 * Sections are reused, not restated - duplicating the route or the
 * Incoterms would put this page in competition with the homepage for
 * the same phrases and weaken both.
 */
const ExportPage = () => (
  <PageShell
    title="Bulk Salt Export: FOB, CIF & Ordering | AAA Trade House"
    description="Export terms for bulk Himalayan pink salt from Pakistan. FOB Karachi or Port Qasim, CIF on request, no fixed minimum order. Contracts issued by AAA General Trading, a registered Chamber of Commerce member."
  >
    <section className="pt-36 pb-4 md:pt-44">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
            Export Terms
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] tracking-tight mb-8">
            How we <span className="italic text-accent">trade</span>.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            The route the salt takes, the terms we ship on, and what happens
            between your first message and a booked container. Written so you
            can forward it to whoever signs off the order.
          </p>
        </div>
      </div>
    </section>

    <GlobalReach />
    <Ordering />
    <FAQ />
    <Contact />
  </PageShell>
);

export default ExportPage;
