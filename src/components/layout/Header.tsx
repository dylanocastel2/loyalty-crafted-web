import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "SPAARSYSTEMEN", path: "/spaarsystemen" },
  { label: "SPAARPROGRAMMA", path: "/spaarprogramma" },
  { label: "KLANTCASES", path: "/klantcases" },
  { label: "SUPPORT", path: "/support" },
  { label: "OVER ONS", path: "/over-ons" },
  { label: "CONTACT", path: "/contact" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundImage: 'url(/header-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="sr-only">Loyaltygroup B.V.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-3 py-2 text-xs font-semibold tracking-wider transition-colors rounded-md hover:bg-accent hover:text-accent-foreground ${
                location.pathname === item.path ? "text-primary bg-accent" : "text-foreground/70"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link to="/demo">
            <Button size="sm" className="ml-2 text-xs font-semibold tracking-wider">
              DEMO
            </Button>
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu openen"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="lg:hidden border-t bg-background pb-4">
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
  );
};

export default Header;
