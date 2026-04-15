import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";

const steps = [
  { step: "1", tKey: "sp_stap1_title", dKey: "sp_stap1_desc", title: "Analyse & Advies", desc: "Wij analyseren uw situatie en adviseren over de beste aanpak voor uw loyaliteitsprogramma." },
  { step: "2", tKey: "sp_stap2_title", dKey: "sp_stap2_desc", title: "Ontwerp & Ontwikkeling", desc: "Ons team ontwerpt en bouwt uw spaarprogramma volledig op maat, in eigen huis." },
  { step: "3", tKey: "sp_stap3_title", dKey: "sp_stap3_desc", title: "Implementatie", desc: "Naadloze implementatie met koppelingen aan uw bestaande systemen via onze API's." },
  { step: "4", tKey: "sp_stap4_title", dKey: "sp_stap4_desc", title: "Lancering & Support", desc: "Wij begeleiden de lancering en bieden doorlopende ondersteuning en optimalisatie." },
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
        <EditableText page="spaarprogramma" contentKey="hero_title" defaultValue="Spaarprogramma" as="h1" className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
        <EditableText page="spaarprogramma" contentKey="hero_subtitle" defaultValue="Van concept tot lancering — ontdek hoe wij uw spaarprogramma realiseren." as="p" className="text-lg text-primary-foreground/90 max-w-2xl mx-auto" multiline />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <EditableText page="spaarprogramma" contentKey="steps_title" defaultValue="Hoe werkt het?" as="h2" className="text-2xl md:text-3xl font-bold text-center mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {s.step}
              </div>
              <EditableText page="spaarprogramma" contentKey={s.tKey} defaultValue={s.title} as="h3" className="font-semibold mb-2" />
              <EditableText page="spaarprogramma" contentKey={s.dKey} defaultValue={s.desc} as="p" className="text-sm text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container">
        <EditableText page="spaarprogramma" contentKey="benefits_title" defaultValue="Voordelen" as="h2" className="text-2xl font-bold text-center mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <EditableButton page="spaarprogramma" contentKey="cta_btn" defaultValue="Start uw programma" to="/demo" />
        </div>
      </div>
    </section>
  </Layout>
);

export default Spaarprogramma;
