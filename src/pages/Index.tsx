import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import Industries from "@/components/Industries";
import VideoShowcase from "@/components/VideoShowcase";
import GlobalReach from "@/components/GlobalReach";
import FAQ from "@/components/FAQ";
import Ordering from "@/components/Ordering";
import Contact from "@/components/Contact";
import MobileCTA from "@/components/MobileCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-14 lg:pb-0">
      {/* First focusable thing on the page. Without it a keyboard or screen
          reader visitor tabs the logo plus seven nav links before reaching
          any content, on every arrival. Hidden until focused. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-background focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-elevated"
      >
        Skip to main content
      </a>
      <Navbar />
      {/* tabIndex -1 so the skip link actually moves focus here, rather than
          only scrolling - several browsers will not focus a plain <main>. */}
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Products />
        <Industries />
        <VideoShowcase />
        <GlobalReach />
        <FAQ />
        <Ordering />
        <Contact />
      </main>
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Index;
