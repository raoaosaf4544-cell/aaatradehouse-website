import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";

/**
 * The frame every page other than the homepage sits in.
 *
 * Extracted because Privacy had already hand-rolled its own copy of the
 * skip link, <main> and title effect, and adding two more pages would
 * have meant three more copies of the same accessibility scaffolding -
 * which is exactly how a skip link goes missing from one page and
 * nobody notices for a year.
 */
const PageShell = ({
  title,
  description,
  children,
  withMobileCta = true,
}: {
  title: string;
  /** Written to the meta description so each page can target its own
   *  search intent. Without this every route would inherit the
   *  homepage's, which is the main reason thin pages fail to rank. */
  description?: string;
  children: React.ReactNode;
  withMobileCta?: boolean;
}) => {
  useEffect(() => {
    document.title = title;
    if (!description) return;
    const tag = document.querySelector('meta[name="description"]');
    const previous = tag?.getAttribute("content") ?? null;
    tag?.setAttribute("content", description);
    // Restore on unmount so a client-side route change cannot leave one
    // page's description attached to another.
    return () => {
      if (tag && previous !== null) tag.setAttribute("content", previous);
    };
  }, [title, description]);

  return (
    <div className={`min-h-screen bg-background ${withMobileCta ? "pb-14 lg:pb-0" : ""}`}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[60] focus:rounded-md focus:bg-background focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-foreground focus:shadow-elevated"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer />
      {withMobileCta && <MobileCTA />}
    </div>
  );
};

export default PageShell;
