import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Smartphone, Users, Zap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";
import PageContent from "@/components/page-builder/PageContent";
import SearchBlock from "@/components/page-builder/SearchBlock";
import USPGrid from "@/components/sections/USPGrid";
import ReviewsBlock from "@/components/sections/ReviewsBlock";
import LaagdrempeligBlock from "@/components/sections/LaagdrempeligBlock";
import PriceIndication from "@/components/sections/PriceIndication";
import DemoForm from "@/components/sections/DemoForm";
import KlantcasesBlock from "@/components/page-builder/KlantcasesBlock";
import { BRANCHES } from "@/lib/brancheContent";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";

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
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Loyaltygroup B.V.",
          url: "https://www.loyaltygroup.nl",
          logo: "https://www.loyaltygroup.nl/logo.jpg",
          areaServed: "NL",
          description:
            "Loyaltygroup B.V. ontwikkelt in eigen huis volledig op maat gemaakte spaarsystemen en loyaliteitsplatformen voor gemeenten, retail, horeca, zorg en winkeliersverenigingen.",
        })}
      </script>
    </Helmet>
      <PageContent pageKey="index">
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

        <div className="mt-10 max-w-xl mx-auto">
          <SearchBlock align="center" variant="rounded" maxWidth={560} />
        </div>
      </div>
    </section>

    {/* Branche-selector */}
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <span className="accent-bar mx-auto mb-5" />
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">
            Voor welke branche zoekt u een loyaliteitsoplossing?
          </h2>
          <p className="text-muted-foreground">
            Onze aanpak verschilt per sector. Kies hieronder uw branche voor een pagina met
            herkenbare uitdagingen, kansen en concrete oplossingen.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BRANCHES.map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className="group rounded-2xl border border-border bg-tile p-5 hover:shadow-soft hover:border-primary/40 transition-all flex flex-col items-center text-center"
            >
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1">{b.label}</h3>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                Bekijk <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div key={f.titleKey} className="bento-tile group bg-background p-7 flex flex-col min-h-[220px]">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground mb-5">
                <f.icon className="h-5 w-5" />
              </div>
              <EditableText page="homepage" contentKey={f.titleKey} defaultValue={f.title} as="h3" className="font-display font-semibold text-lg mb-2" />
              <EditableText page="homepage" contentKey={f.descKey} defaultValue={f.description} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* USP-band */}
    <USPGrid />

    {/* Laagdrempelig + veel mogelijkheden */}
    <LaagdrempeligBlock />

    {/* Klantcases */}
    <section className="py-20 md:py-24 bg-mist border-y border-border">
      <div className="container max-w-2xl mb-10">
        <span className="accent-bar mb-5" />
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">
          Klanten die ons inmiddels jaren vertrouwen
        </h2>
        <p className="text-muted-foreground">
          Een greep uit organisaties waarvoor wij loyaliteitsoplossingen ontwikkelden en
          dagelijks beheren — van gemeenten tot landelijke ketens.
        </p>
      </div>
      <KlantcasesBlock
        view="short"
        mode="latest"
        selectedIds={[]}
        limit={6}
        columns={3}
        showBranche
        showCategory
        title=""
        titleAlign="left"
        showFilter={false}
        maxRows={2}
      />
    </section>

    {/* Reviews */}
    <ReviewsBlock />

    {/* Prijs-kwaliteit */}
    <PriceIndication />

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

    {/* Demo formulier onderaan */}
    <DemoForm source="homepage" />

    </PageContent>
  </Layout>
);

export default Index;
