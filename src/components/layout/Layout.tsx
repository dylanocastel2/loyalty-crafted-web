import Header from "./Header";
import Footer from "./Footer";
import SitePopup from "@/components/popup/SitePopup";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useHeatmapTracking } from "@/hooks/useHeatmapTracking";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Layout = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  useHeatmapTracking();
  const { pathname } = useLocation();
  const hideCta = pathname === "/contact" || pathname === "/demo";
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      {!hideCta && (
        <section className="bg-gradient-to-br from-primary to-secondary">
          <div className="container py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-3">
              Benieuwd wat we voor u kunnen betekenen?
            </h2>
            <p className="text-primary-foreground/90 mb-6 max-w-xl mx-auto">
              Neem vrijblijvend contact met ons op — we denken graag met u mee.
            </p>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Neem contact op</Link>
            </Button>
          </div>
        </section>
      )}
      <Footer />
      <SitePopup />
    </div>
  );
};

export default Layout;
