import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logoLg from "@/assets/lg-logo-wit.png.asset.json";

const defaultNavItems = [
  { label: "SPAARSYSTEEM", path: "/spaarsysteem" },
  { label: "BRANCHES", path: "/branches" },
  { label: "KLANTCASES", path: "/klantcases" },
  { label: "SUPPORT", path: "/support" },
  { label: "OVER ONS", path: "/over-ons" },
  { label: "CONTACT", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customItems, setCustomItems] = useState<{ label: string; path: string }[]>([]);
  const [baseNavItems, setBaseNavItems] = useState<{ label: string; path: string }[]>(defaultNavItems);
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const [pagesRes, navRes] = await Promise.all([
        supabase
          .from("custom_pages")
          .select("title, slug, menu_label, menu_order")
          .eq("published", true)
          .eq("show_in_menu", true)
          .order("menu_order", { ascending: true }),
        supabase
          .from("page_content")
          .select("content")
          .eq("page", "settings")
          .eq("key", "site_navigation")
          .maybeSingle(),
      ]);
      if (pagesRes.data) {
        setCustomItems(
          pagesRes.data.map((p) => ({
            label: (p.menu_label || p.title).toUpperCase(),
            path: `/p/${p.slug}`,
          }))
        );
      }
      try {
        const parsed = navRes.data?.content ? JSON.parse(navRes.data.content) : null;
        if (Array.isArray(parsed?.items)) {
          setBaseNavItems(
            parsed.items
              .filter((it: any) => it && !it.hidden && it.label && it.path)
              .map((it: any) => ({ label: String(it.label), path: String(it.path) }))
          );
        }
      } catch {
        // keep defaults
      }
    };
    fetch();
  }, []);

  const navItems = [...baseNavItems, ...customItems];

  return (
    <>
      {isAdmin && (
        <div className="bg-primary text-primary-foreground text-xs py-1.5 z-[60] relative">
          <div className="container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5" />
              <span className="font-medium">Ontwikkelaarsmodus — Klik op ✏️ om teksten te bewerken</span>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin" className="hover:underline">Admin Panel</Link>
              <button onClick={signOut} className="flex items-center gap-1 hover:underline">
                <LogOut className="h-3 w-3" /> Uitloggen
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="sticky top-0 z-50 glass-primary">
        <div className="container relative flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center group" aria-label="Naar homepage">
            <img src={logoLg.url} alt="Loyaltygroup logo" className="h-9 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-underline px-3 py-5 text-[11px] font-semibold tracking-wider whitespace-nowrap transition-colors ${
                  location.pathname === item.path
                    ? "text-white is-active"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/demo">
              <Button size="sm" className="ml-3 text-[11px] font-semibold tracking-wider rounded-full bg-white text-primary hover:bg-white/90 shadow-soft">
                DEMO →
              </Button>
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu openen"
          >
            {mobileOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-white/20 glass-primary pb-4">
            <div className="container flex flex-col gap-1 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-semibold tracking-wider rounded-md transition-colors hover:bg-white/10 ${
                    location.pathname === item.path ? "text-white bg-white/15" : "text-white/80"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/demo" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 text-sm font-semibold tracking-wider bg-white text-primary hover:bg-white/90">DEMO</Button>
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
