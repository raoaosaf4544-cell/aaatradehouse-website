import PageShell from "@/components/PageShell";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import Contact from "@/components/Contact";

/**
 * /products
 *
 * Reuses the Products and Industries sections rather than restating
 * them. Two copies of the same six product descriptions would be
 * duplicate content competing with each other, which is worse for both
 * pages than having neither.
 *
 * What makes this a page rather than an anchor is the intro above it and
 * its own title and meta description: the homepage targets the business,
 * this targets the goods. Contact is included because a buyer who has
 * read the grades should not have to navigate to ask about them.
 */
const ProductsPage = () => (
  <PageShell
    title="Himalayan Pink Salt Products & Grades | AAA Trade House"
    description="Bulk Himalayan pink salt in edible, industrial, animal lick, wellness and raw grades. PCSIR tested, PMDC certification on the edible grade, halal certified. Packed in 25kg and 50kg PP bags, retail packs, or to your specification."
  >
    <section className="pt-36 pb-4 md:pt-44">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-5">
            Product Range
          </p>
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] tracking-tight mb-8">
            Every grade we <span className="italic text-accent">supply</span>.
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Six lines, all from Himalayan pink salt out of Khewra and other
            Pakistani mines, crushed and graded in-house at our Khanewal plant.
            Tell us the grade, the volume and the packaging, and we quote to it.
          </p>
        </div>
      </div>
    </section>

    <Products />
    <Industries />
    <Contact />
  </PageShell>
);

export default ProductsPage;
