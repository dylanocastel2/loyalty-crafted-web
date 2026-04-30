import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="relative bg-[hsl(var(--ink))] text-white/70 mt-auto overflow-hidden">
    <div className="absolute inset-0 grid-pattern opacity-20" />
    <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-[hsl(var(--primary)/0.25)] blur-3xl" />
    <div className="container relative py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-9 w-9 rounded-lg bg-gradient-aqua grid place-items-center font-display font-bold text-[hsl(var(--ink))] shadow-glow">L</div>
          <span className="font-display font-bold text-white text-lg">Loyalty<span className="text-gradient-aqua">group</span></span>
        </div>
        <p className="text-sm leading-relaxed">
          Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte spaarsystemen voor gemeenten en commerciële bedrijven.
        </p>
      </div>
      <div>
        <h4 className="text-white font-display font-semibold mb-4 text-sm tracking-wide uppercase">Oplossingen</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/spaarsysteem" className="hover:text-white transition-colors">Spaarsysteem</Link></li>
          <li><Link to="/gemeenten" className="hover:text-white transition-colors">Gemeenten</Link></li>
          <li><Link to="/klantcases" className="hover:text-white transition-colors">Klantcases</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-display font-semibold mb-4 text-sm tracking-wide uppercase">Bedrijf</h4>
        <ul className="space-y-2.5 text-sm">
          <li><Link to="/over-ons" className="hover:text-white transition-colors">Over Ons</Link></li>
          <li><Link to="/support" className="hover:text-white transition-colors">Support</Link></li>
          <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-display font-semibold mb-4 text-sm tracking-wide uppercase">Contact</h4>
        <ul className="space-y-2.5 text-sm">
          <li>info@loyaltygroup.nl</li>
          <li>Nederland</li>
          <li className="pt-3">
            <Link to="/demo" className="inline-flex items-center gap-1 rounded-full bg-gradient-aqua px-4 py-2 text-[hsl(var(--ink))] font-semibold text-xs shadow-glow hover:shadow-elevated transition-shadow">
              Demo aanvragen →
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="relative border-t border-white/10">
      <div className="container py-5 flex items-center justify-between text-xs text-white/50">
        <span>© {new Date().getFullYear()} Loyaltygroup B.V. Alle rechten voorbehouden.</span>
        <Link to="/admin/login" className="hover:text-white transition-colors">
          Log in als administrator
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
