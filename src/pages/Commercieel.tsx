import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, TrendingUp, Gift, QrCode, BarChart3, Repeat } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";
import PageContent from "@/components/page-builder/PageContent";
import USPGrid from "@/components/sections/USPGrid";
import DemoCTA from "@/components/sections/DemoCTA";
import PriceIndication from "@/components/sections/PriceIndication";
import DemoForm from "@/components/sections/DemoForm";
import { useBranches } from "@/hooks/useBranches";
import { ArrowRight } from "lucide-react";

const benefits = [
  { icon: TrendingUp, tKey: "com_binding_title", dKey: "com_binding_desc", title: "Klantenbinding", desc: "Verhoog klantloyaliteit met een persoonlijk spaarprogramma." },
  { icon: QrCode, tKey: "com_spaarpas_title", dKey: "com_spaarpas_desc", title: "Digitale Spaarpas", desc: "Moderne digitale spaarpas via app of webportal." },
  { icon: Gift, tKey: "com_beloningen_title", dKey: "com_beloningen_desc", title: "Beloningen", desc: "Flexibel beloningssysteem met punten, kortingen en cadeaus." },
  { icon: BarChart3, tKey: "com_crm_title", dKey: "com_crm_desc", title: "CRM & Analytics", desc: "Uitgebreide klantinzichten en rapportages voor betere besluitvorming." },
  { icon: Repeat, tKey: "com_herhaal_title", dKey: "com_herhaal_desc", title: "Herhaalaankopen", desc: "Stimuleer herhaalaankopen en verhoog de gemiddelde orderwaarde." },
  { icon: ShoppingBag, tKey: "com_omnichannel_title", dKey: "com_omnichannel_desc", title: "Omnichannel", desc: "Werkt in-store, online en via mobiele apps voor maximaal bereik." },
];

const Commercieel = () => {
  const { branches } = useBranches();
  return (
  <Layout>
      <PageContent pageKey="commercieel">
    <section className="py-16 md:py-24">
      <div className="container text-center">
        <EditableText page="commercieel" contentKey="hero_title" defaultValue="Commerciële Loyaliteitsoplossingen" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
        <EditableText page="commercieel" contentKey="hero_subtitle" defaultValue="Bouw duurzame klantrelaties op met een op maat gemaakt loyaliteitsprogramma dat past bij uw merk." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" multiline />
        <EditableButton page="commercieel" contentKey="hero_btn" defaultValue="Demo aanvragen" to="/demo" />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <EditableText page="commercieel" contentKey="benefits_title" defaultValue="Voordelen voor uw bedrijf" as="h2" className="text-2xl md:text-3xl font-bold text-center mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.tKey} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <b.icon className="h-8 w-8 text-primary mb-4" />
              <EditableText page="commercieel" contentKey={b.tKey} defaultValue={b.title} as="h3" className="font-semibold mb-2" />
              <EditableText page="commercieel" contentKey={b.dKey} defaultValue={b.desc} as="p" className="text-sm text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-primary to-secondary">
      <div className="container text-center">
        <EditableText page="commercieel" contentKey="cta_title" defaultValue="Start vandaag nog" as="h2" className="text-2xl font-bold mb-4 text-primary-foreground" />
        <EditableText page="commercieel" contentKey="cta_text" defaultValue="Ontdek hoe een loyaliteitsprogramma op maat uw bedrijf kan laten groeien." as="p" className="text-primary-foreground/90 mb-8 max-w-xl mx-auto" multiline />
        <EditableButton page="commercieel" contentKey="cta_btn" defaultValue="Neem contact op" to="/contact" variant="secondary" />
      </div>
    </section>

    <section className="py-16 md:py-20 bg-background">
      <div className="container max-w-3xl text-center">
        <span className="accent-bar mx-auto mb-5" />
        <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-3">
          Werkt u in een specifieke branche?
        </h2>
        <p className="text-muted-foreground mb-8">
          We hebben aparte oplossingen uitgewerkt per sector — met voorbeelden, functionaliteiten en
          klantcases die voor u herkenbaar zijn.
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {branches.filter((b) => b.slug !== "gemeenten").map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className="inline-flex items-center gap-1 text-sm px-4 py-2 rounded-full border border-border bg-tile hover:border-primary hover:text-primary transition-colors"
            >
              {b.label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </div>
    </section>

    <USPGrid />
    <PriceIndication />
    <DemoForm source="commercieel" />
    <DemoCTA variant="gradient" />

    </PageContent>
  </Layout>
  );
};

export default Commercieel;
