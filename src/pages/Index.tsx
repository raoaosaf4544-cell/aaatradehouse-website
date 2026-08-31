import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Products from "@/components/Products";
import VideoShowcase from "@/components/VideoShowcase";
import GlobalReach from "@/components/GlobalReach";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <About />
      <Products />
      <VideoShowcase />
      <GlobalReach />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
