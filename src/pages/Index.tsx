import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, ShoppingBag, Settings, Smartphone, Users, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";

const features = [
  {
    icon: Settings,
    title: "Maatwerk",
    description: "Elk spaarsysteem wordt volledig op maat ontwikkeld, passend bij uw organisatie en doelgroep.",
  },
  {
    icon: Smartphone,
    title: "Cross Platform",
    description: "Onze systemen werken naadloos op desktop, tablet en mobiel voor optimaal bereik.",
  },
  {
    icon: Users,
    title: "Gebruiksvriendelijk",
    description: "Intuïtieve interfaces zorgen voor hoge adoptie bij zowel beheerders als eindgebruikers.",
  },
  {
    icon: Zap,
    title: "API Koppelingen",
    description: "Flexibele API's voor naadloze integratie met uw bestaande systemen en processen.",
  },
];

const Index = () => (
  <Layout>
    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-secondary py-20 md:py-32">
      <div className="container relative z-10 text-center">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
          Spaarsystemen op maat
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-10">
          Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte loyaliteitssystemen. In-house ontwikkeld, flexibel en schaalbaar.
        </p>

        {/* Audience selector */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
          <Link to="/gemeenten" className="flex-1">
            <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-lg p-6 hover:bg-primary-foreground/20 transition-all cursor-pointer group">
              <Building2 className="h-10 w-10 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-primary-foreground">Gemeenten</h3>
              <p className="text-sm text-primary-foreground/70 mt-1">Stadspas & regelingen</p>
            </div>
          </Link>
          <Link to="/commercieel" className="flex-1">
            <div className="bg-primary-foreground/10 backdrop-blur border border-primary-foreground/20 rounded-lg p-6 hover:bg-primary-foreground/20 transition-all cursor-pointer group">
              <ShoppingBag className="h-10 w-10 text-primary-foreground mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-primary-foreground">Commercieel</h3>
              <p className="text-sm text-primary-foreground/70 mt-1">Klantenbinding & loyalty</p>
            </div>
          </Link>
        </div>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
    </section>

    {/* Features */}
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Waarom Loyaltygroup?</h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Alles in eigen beheer ontwikkeld. Geen outsourcing, geen beperkingen.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow">
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-16 bg-accent">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Klaar om te starten?</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Ontdek hoe een op maat gemaakt spaarsysteem uw organisatie kan versterken. Vraag vandaag nog een demo aan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/demo">
            <Button size="lg">Demo aanvragen</Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline">Neem contact op</Button>
          </Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Index;
