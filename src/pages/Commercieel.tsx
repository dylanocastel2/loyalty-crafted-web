import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Gift, QrCode, BarChart3, Repeat } from "lucide-react";
import Layout from "@/components/layout/Layout";

const benefits = [
  { icon: TrendingUp, title: "Klantenbinding", desc: "Verhoog klantloyaliteit met een persoonlijk spaarprogramma." },
  { icon: QrCode, title: "Digitale Spaarpas", desc: "Moderne digitale spaarpas via app of webportal." },
  { icon: Gift, title: "Beloningen", desc: "Flexibel beloningssysteem met punten, kortingen en cadeaus." },
  { icon: BarChart3, title: "CRM & Analytics", desc: "Uitgebreide klantinzichten en rapportages voor betere besluitvorming." },
  { icon: Repeat, title: "Herhaalaankopen", desc: "Stimuleer herhaalaankopen en verhoog de gemiddelde orderwaarde." },
  { icon: ShoppingBag, title: "Omnichannel", desc: "Werkt in-store, online en via mobiele apps voor maximaal bereik." },
];

const Commercieel = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Commerciële Loyaliteitsoplossingen</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Bouw duurzame klantrelaties op met een op maat gemaakt loyaliteitsprogramma dat past bij uw merk.
        </p>
        <Link to="/demo"><Button size="lg" variant="secondary">Demo aanvragen</Button></Link>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Voordelen voor uw bedrijf</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <b.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container text-center">
        <h2 className="text-2xl font-bold mb-4">Start vandaag nog</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Ontdek hoe een loyaliteitsprogramma op maat uw bedrijf kan laten groeien.</p>
        <Link to="/contact"><Button size="lg">Neem contact op</Button></Link>
      </div>
    </section>
  </Layout>
);

export default Commercieel;
