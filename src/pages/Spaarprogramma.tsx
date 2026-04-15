import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";

const steps = [
  { step: "1", title: "Analyse & Advies", desc: "Wij analyseren uw situatie en adviseren over de beste aanpak voor uw loyaliteitsprogramma." },
  { step: "2", title: "Ontwerp & Ontwikkeling", desc: "Ons team ontwerpt en bouwt uw spaarprogramma volledig op maat, in eigen huis." },
  { step: "3", title: "Implementatie", desc: "Naadloze implementatie met koppelingen aan uw bestaande systemen via onze API's." },
  { step: "4", title: "Lancering & Support", desc: "Wij begeleiden de lancering en bieden doorlopende ondersteuning en optimalisatie." },
];

const benefits = [
  "Volledig op maat gemaakt",
  "In-house ontwikkeld team",
  "Geen outsourcing",
  "Flexibele aanpassingen",
  "Doorlopende ondersteuning",
  "Schaalbare architectuur",
  "AVG-compliant",
  "Uitgebreide rapportages",
];

const Spaarprogramma = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Spaarprogramma</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Van concept tot lancering — ontdek hoe wij uw spaarprogramma realiseren.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Hoe werkt het?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Voordelen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/demo"><Button size="lg">Start uw programma</Button></Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Spaarprogramma;
