import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative bg-surface text-muted-foreground mt-auto border-t border-border">
    <div className="container relative py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-lg bg-gradient-aqua grid place-items-center font-display font-bold text-white">L</div>
          <span className="font-display font-bold text-foreground text-lg">Loyalty<span className="text-primary">group</span></span>
        </div>
        <p className="text-sm leading-relaxed">
          Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte spaarsystemen voor gemeenten en commerciële bedrijven.
        </p>
      </div>
      <div>
        <h4 className="text-foreground font-display font-semibold mb-4 text-xs tracking-[0.18em] uppercase">Oplossingen</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/spaarsysteem" className="hover:text-primary transition-colors">Spaarsysteem</Link></li>
          <li><Link to="/gemeenten" className="hover:text-primary transition-colors">Gemeenten</Link></li>
          <li><Link to="/klantcases" className="hover:text-primary transition-colors">Klantcases</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-foreground font-display font-semibold mb-4 text-xs tracking-[0.18em] uppercase">Bedrijf</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/over-ons" className="hover:text-primary transition-colors">Over Ons</Link></li>
          <li><Link to="/support" className="hover:text-primary transition-colors">Support</Link></li>
          <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-foreground font-display font-semibold mb-4 text-xs tracking-[0.18em] uppercase">Contact</h4>
        <ul className="space-y-2.5 text-sm">
          <li>info@loyaltygroup.nl</li>
          <li>Nederland</li>
          <li className="pt-3">
            <Link to="/demo" className="inline-flex items-center gap-1 rounded-full bg-gradient-aqua px-4 py-2 text-white font-semibold text-xs shadow-soft hover:opacity-90 transition-opacity">
              Demo aanvragen →
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="relative border-t border-border">
      <div className="container py-5 flex items-center justify-between text-xs text-muted-foreground/80">
        <span>© {new Date().getFullYear()} Loyaltygroup B.V. Alle rechten voorbehouden.</span>
        <Link to="/admin/login" className="hover:text-primary transition-colors">
          Log in als administrator
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
