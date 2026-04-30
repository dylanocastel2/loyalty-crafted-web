import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Smartphone, Users, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";
import PageBuilderSlot from "@/components/page-builder/PageBuilderSlot";

const features = [
  {
    icon: Settings,
    titleKey: "feature_maatwerk_title",
    descKey: "feature_maatwerk_desc",
    title: "Maatwerk",
    description: "Elk spaarsysteem wordt volledig op maat ontwikkeld, passend bij uw organisatie en doelgroep.",
  },
  {
    icon: Smartphone,
    titleKey: "feature_crossplatform_title",
    descKey: "feature_crossplatform_desc",
    title: "Cross Platform",
    description: "Onze systemen werken naadloos op desktop, tablet en mobiel voor optimaal bereik.",
  },
  {
    icon: Users,
    titleKey: "feature_gebruiksvriendelijk_title",
    descKey: "feature_gebruiksvriendelijk_desc",
    title: "Gebruiksvriendelijk",
    description: "Intuïtieve interfaces zorgen voor hoge adoptie bij zowel beheerders als eindgebruikers.",
  },
  {
    icon: Zap,
    titleKey: "feature_api_title",
    descKey: "feature_api_desc",
    title: "API Koppelingen",
    description: "Flexibele API's voor naadloze integratie met uw bestaande systemen en processen.",
  },
];

const Index = () => (
  <Layout>
      <PageBuilderSlot pageKey="index" position="before" />
    {/* Hero */}
    <section className="relative overflow-hidden bg-hero text-white py-24 md:py-36">
      {/* Decorative grid + orbs */}
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--primary)/0.45)] blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-[hsl(var(--primary-glow)/0.35)] blur-3xl animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[hsl(var(--secondary)/0.25)] blur-3xl" />

      <div className="container relative z-10 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary-glow))] animate-pulse" />
          In-house ontwikkeld in Nederland
        </div>
        <EditableText
          page="homepage"
          contentKey="hero_title"
          defaultValue="Spaarsystemen op maat"
          as="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.05] tracking-tight bg-gradient-to-br from-white via-white to-[hsl(var(--primary-glow))] bg-clip-text text-transparent"
        />
        <EditableText
          page="homepage"
          contentKey="hero_subtitle"
          defaultValue="Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte loyaliteitssystemen. In-house ontwikkeld, flexibel en schaalbaar."
          as="p"
          className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed"
          multiline
        />

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/spaarsysteem">
            <Button size="lg" className="bg-white text-[hsl(var(--ink))] hover:bg-white/90 rounded-full shadow-glow font-semibold">
              Bekijk ons spaarsysteem →
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur">
              Demo aanvragen
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-background" />
    </section>

    {/* Features */}
    <section className="py-20 md:py-28 relative">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] text-primary uppercase mb-3">Waarom wij</span>
        <EditableText
          page="homepage"
          contentKey="features_title"
          defaultValue="Waarom Loyaltygroup?"
          as="h2"
          className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight"
        />
        <EditableText
          page="homepage"
          contentKey="features_subtitle"
          defaultValue="Alles in eigen beheer ontwikkeld. Geen outsourcing, geen beperkingen."
          as="p"
          className="text-muted-foreground text-base md:text-lg"
        />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.titleKey} className="group relative rounded-2xl border border-border/60 bg-gradient-card p-6 card-hover overflow-hidden">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-[hsl(var(--primary-glow)/0.15)] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-aqua text-[hsl(var(--ink))] shadow-glow mb-5">
                  <f.icon className="h-6 w-6" />
                </div>
                <EditableText page="homepage" contentKey={f.titleKey} defaultValue={f.title} as="h3" className="font-display font-semibold text-lg mb-2" />
                <EditableText page="homepage" contentKey={f.descKey} defaultValue={f.description} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28 relative overflow-hidden bg-hero text-white">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-[hsl(var(--primary-glow)/0.4)] blur-3xl animate-pulse-glow" />
      <div className="container relative text-center max-w-3xl">
        <EditableText page="homepage" contentKey="cta_title" defaultValue="Klaar om te starten?" as="h2" className="text-3xl md:text-5xl font-display font-bold mb-5 tracking-tight bg-gradient-to-br from-white to-[hsl(var(--primary-glow))] bg-clip-text text-transparent" />
        <EditableText
          page="homepage"
          contentKey="cta_text"
          defaultValue="Ontdek hoe een op maat gemaakt spaarsysteem uw organisatie kan versterken. Vraag vandaag nog een demo aan."
          as="p"
          className="text-white/80 max-w-xl mx-auto mb-10 text-lg"
          multiline
        />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <EditableButton page="homepage" contentKey="cta_btn_demo" defaultValue="Demo aanvragen" to="/demo" variant="secondary" />
          <EditableButton page="homepage" contentKey="cta_btn_contact" defaultValue="Neem contact op" to="/contact" variant="outline" />
        </div>
      </div>
    </section>
    <PageBuilderSlot pageKey="index" position="after" />
  </Layout>
);

export default Index;
