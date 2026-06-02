import Header from "./Header";
import Footer from "./Footer";
import SitePopup from "@/components/popup/SitePopup";
import { usePageTracking } from "@/hooks/usePageTracking";
import { useHeatmapTracking } from "@/hooks/useHeatmapTracking";

const Layout = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  useHeatmapTracking();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <SitePopup />
    </div>
  );
};

export default Layout;
