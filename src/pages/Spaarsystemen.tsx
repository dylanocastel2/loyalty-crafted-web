import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, QrCode, Gift, Globe, Layers } from "lucide-react";
import Layout from "@/components/layout/Layout";

const systems = [
  { icon: Globe, title: "Online Spaarsysteem", desc: "Webgebaseerd spaarsysteem toegankelijk via elk apparaat met internetverbinding." },
  { icon: CreditCard, title: "Digitale Spaarpas", desc: "Vervang fysieke pasjes door een moderne digitale spaarpas in de app of wallet." },
  { icon: QrCode, title: "Klantenkaart", desc: "Fysieke of digitale klantenkaart met QR-code voor snelle identificatie." },
  { icon: Smartphone, title: "Mobiele Apps", desc: "Native apps voor iOS en Android met push-notificaties en locatiediensten." },
  { icon: Gift, title: "Cadeaukaarten", desc: "Digitale en fysieke cadeaukaarten als onderdeel van uw loyaliteitsprogramma." },
  { icon: Layers, title: "API Platform", desc: "Krachtige API's voor integratie met POS-systemen, webshops en CRM-software." },
];

const Spaarsystemen = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Spaarsystemen</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Een compleet overzicht van onze loyaliteitssystemen — van digitale spaarpassen tot volledige app-oplossingen.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {systems.map((s) => (
            <div key={s.title} className="border rounded-lg p-8 bg-card hover:shadow-lg transition-shadow">
              <s.icon className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
              <p className="text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container text-center">
        <h2 className="text-2xl font-bold mb-4">Welk systeem past bij u?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Wij adviseren u graag over de beste oplossing voor uw situatie.</p>
        <Link to="/demo"><Button size="lg">Demo aanvragen</Button></Link>
      </div>
    </section>
  </Layout>
);

export default Spaarsystemen;
