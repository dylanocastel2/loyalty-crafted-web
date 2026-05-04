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
    {/* Hero — clean */}
    <section className="relative overflow-hidden bg-hero py-24 md:py-36">
      <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
      <div className="absolute -top-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-[hsl(var(--primary)/0.10)] blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[hsl(var(--secondary)/0.10)] blur-3xl animate-float-slow" style={{ animationDelay: "-7s" }} />

      <div className="container relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-7 shadow-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          In-house ontwikkeld in Nederland
        </div>
        <EditableText
          page="homepage"
          contentKey="hero_title"
          defaultValue="Spaarsystemen op maat"
          as="h1"
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.05] tracking-tight text-foreground"
        />
        <EditableText
          page="homepage"
          contentKey="hero_subtitle"
          defaultValue="Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte loyaliteitssystemen. In-house ontwikkeld, flexibel en schaalbaar."
          as="p"
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          multiline
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/spaarsysteem">
            <Button size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 font-semibold">
              Bekijk ons spaarsysteem →
            </Button>
          </Link>
          <Link to="/demo">
            <Button size="lg" variant="outline" className="rounded-full border-border hover:border-primary hover:text-primary">
              Demo aanvragen
            </Button>
          </Link>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 md:py-28 relative bg-mist border-y border-border">
      <div className="container">
        <div className="max-w-2xl mb-12">
          <span className="accent-bar mb-5" />
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
        <div className="bento-grid">
          {features.map((f, i) => {
            // Bento span pattern: tall, wide, normal, normal
            const span = i === 0
              ? "col-span-2 md:col-span-3 md:row-span-2"
              : i === 1
              ? "col-span-2 md:col-span-3"
              : "col-span-1 md:col-span-3";
            const tall = i === 0 ? "min-h-[280px] md:min-h-[420px]" : "min-h-[200px] md:min-h-[200px]";
            const tile = i === 0 ? "bg-tile" : "bg-background";
            return (
              <div key={f.titleKey} className={`bento-tile group ${span} ${tall} ${tile} p-7 flex flex-col justify-between`}>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-6">
                  <EditableText page="homepage" contentKey={f.titleKey} defaultValue={f.title} as="h3" className="font-display font-semibold text-xl mb-2" />
                  <EditableText page="homepage" contentKey={f.descKey} defaultValue={f.description} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
                </div>
                {i === 0 && (
                  <div className="pointer-events-none absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-[hsl(var(--primary)/0.10)] blur-2xl" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20 md:py-28 relative bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-tile p-10 md:p-16 text-center">
          <div className="absolute inset-0 dot-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[hsl(var(--primary)/0.10)] blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[hsl(var(--secondary)/0.10)] blur-3xl" />
          <div className="relative max-w-2xl mx-auto">
            <EditableText page="homepage" contentKey="cta_title" defaultValue="Klaar om te starten?" as="h2" className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight" />
            <EditableText
              page="homepage"
              contentKey="cta_text"
              defaultValue="Ontdek hoe een op maat gemaakt spaarsysteem uw organisatie kan versterken. Vraag vandaag nog een demo aan."
              as="p"
              className="text-muted-foreground max-w-xl mx-auto mb-8"
              multiline
            />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <EditableButton page="homepage" contentKey="cta_btn_demo" defaultValue="Demo aanvragen" to="/demo" />
              <EditableButton page="homepage" contentKey="cta_btn_contact" defaultValue="Neem contact op" to="/contact" variant="outline" />
            </div>
          </div>
        </div>
      </div>
    </section>
    <PageBuilderSlot pageKey="index" position="after" />
  </Layout>
);

export default Index;
