import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const baseNavItems = [
  { label: "SPAARSYSTEEM", path: "/spaarsysteem" },
  { label: "GEMEENTEN", path: "/gemeenten" },
  { label: "KLANTCASES", path: "/klantcases" },
  { label: "SUPPORT", path: "/support" },
  { label: "OVER ONS", path: "/over-ons" },
  { label: "CONTACT", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [customItems, setCustomItems] = useState<{ label: string; path: string }[]>([]);
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("custom_pages")
        .select("title, slug, menu_label, menu_order")
        .eq("published", true)
        .eq("show_in_menu", true)
        .order("menu_order", { ascending: true });
      if (data) {
        setCustomItems(
          data.map((p) => ({
            label: (p.menu_label || p.title).toUpperCase(),
            path: `/p/${p.slug}`,
          }))
        );
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
      <header className="sticky top-0 z-50 border-b border-white/10 glass-dark">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[hsl(var(--ink))] via-[hsl(var(--primary)/0.85)] to-[hsl(var(--primary-glow)/0.7)] opacity-95" />
        <div className="container relative flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group" aria-label="Naar homepage">
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-[hsl(var(--primary-glow))] opacity-60 group-hover:opacity-90 transition-opacity rounded-full" />
              <div className="relative h-8 w-8 rounded-lg bg-gradient-aqua grid place-items-center font-display font-bold text-[hsl(var(--ink))] text-sm shadow-glow">
                L
              </div>
            </div>
            <span className="text-white font-display font-bold tracking-tight text-base hidden sm:inline">
              Loyalty<span className="text-gradient-aqua">group</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-wrap justify-end">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-3 py-2 text-[11px] font-semibold tracking-wider transition-all rounded-full whitespace-nowrap ${
                  location.pathname === item.path
                    ? "text-[hsl(var(--ink))] bg-white shadow-glow"
                    : "text-white/85 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/demo">
              <Button size="sm" className="ml-2 text-[11px] font-semibold tracking-wider rounded-full bg-white text-[hsl(var(--ink))] hover:bg-white/90 shadow-glow">
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
          <nav className="md:hidden border-t bg-background pb-4">
            <div className="container flex flex-col gap-1 pt-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 text-sm font-semibold tracking-wider rounded-md transition-colors hover:bg-accent ${
                    location.pathname === item.path ? "text-primary bg-accent" : "text-foreground/70"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/demo" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2 text-sm font-semibold tracking-wider">DEMO</Button>
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
