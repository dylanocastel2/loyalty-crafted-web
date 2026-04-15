import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-foreground text-background/80 mt-auto">
    <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <img src="/logo.jpg" alt="Loyaltygroup B.V." className="h-10 w-auto mb-4 brightness-0 invert" />
        <p className="text-sm leading-relaxed">
          Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte spaarsystemen voor gemeenten en commerciële bedrijven.
        </p>
      </div>
      <div>
        <h4 className="text-background font-semibold mb-3 text-sm">Oplossingen</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/spaarsystemen" className="hover:text-background transition-colors">Spaarsystemen</Link></li>
          <li><Link to="/spaarprogramma" className="hover:text-background transition-colors">Spaarprogramma</Link></li>
          <li><Link to="/gemeenten" className="hover:text-background transition-colors">Gemeenten</Link></li>
          <li><Link to="/commercieel" className="hover:text-background transition-colors">Commercieel</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-background font-semibold mb-3 text-sm">Bedrijf</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/over-ons" className="hover:text-background transition-colors">Over Ons</Link></li>
          <li><Link to="/klantcases" className="hover:text-background transition-colors">Klantcases</Link></li>
          <li><Link to="/support" className="hover:text-background transition-colors">Support</Link></li>
          <li><Link to="/contact" className="hover:text-background transition-colors">Contact</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="text-background font-semibold mb-3 text-sm">Contact</h4>
        <ul className="space-y-2 text-sm">
          <li>info@loyaltygroup.nl</li>
          <li>Nederland</li>
          <li className="pt-2">
            <Link to="/demo" className="text-secondary hover:text-background transition-colors font-medium">
              Demo aanvragen →
            </Link>
          </li>
        </ul>
      </div>
    </div>
    <div className="border-t border-background/10">
      <div className="container py-4 flex items-center justify-between text-xs text-background/50">
        <span>© {new Date().getFullYear()} Loyaltygroup B.V. Alle rechten voorbehouden.</span>
        <Link to="/admin/login" className="hover:text-background transition-colors">
          Log in als administrator
        </Link>
      </div>
    </div>
  </footer>
);

export default Footer;
