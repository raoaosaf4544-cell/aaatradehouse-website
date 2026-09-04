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
      <Navbar />
      <Hero />
      <About />
      <Products />
      <Industries />
      <VideoShowcase />
      <GlobalReach />
      <FAQ />
      <Ordering />
      <Contact />
      <Footer />
      <MobileCTA />
    </div>
  );
};

export default Index;
