import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Check, Lightbulb, Target, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useBranches, useBranche } from "@/hooks/useBranches";
import BrancheIcon from "@/components/BrancheIcon";
import DemoCTA from "@/components/sections/DemoCTA";
import DemoForm from "@/components/sections/DemoForm";
import PriceIndication from "@/components/sections/PriceIndication";
import ReviewsBlock from "@/components/sections/ReviewsBlock";
import KlantcasesBlock from "@/components/page-builder/KlantcasesBlock";
import PageContent from "@/components/page-builder/PageContent";
import EditableText from "@/components/EditableText";

const Branche = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { branche: data, loading } = useBranche(slug);
  const { branches } = useBranches();
  if (loading) {
    return <Layout><div className="container py-24 text-center text-muted-foreground">Laden...</div></Layout>;
  }
  if (!data) return <Navigate to="/branches" replace />;

  const canonical = `https://www.loyaltygroup.nl/branches/${data.slug}`;
  const pageKey = `branche-${data.slug}`;

  return (
    <Layout>
      <Helmet>
        <title>{data.metaTitle}</title>
        <meta name="description" content={data.metaDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={data.metaTitle} />
        <meta property="og:description" content={data.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: `Loyaliteitsplatform voor ${data.label}`,
            provider: { "@type": "Organization", name: "Loyaltygroup B.V." },
            areaServed: "NL",
            description: data.metaDescription,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.loyaltygroup.nl/" },
              { "@type": "ListItem", position: 2, name: "Branches", item: "https://www.loyaltygroup.nl/branches" },
              { "@type": "ListItem", position: 3, name: data.label, item: canonical },
            ],
          })}
        </script>
      </Helmet>

      <PageContent pageKey={pageKey}>
      {/* Branche-switcher */}
      <div className="border-b border-border bg-mist">
        <div className="container py-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Andere branche:</span>
          {BRANCHES.map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                b.slug === data.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background border-border hover:border-primary hover:text-primary"
              }`}
            >
              {b.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero py-20 md:py-28">
        <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
        <div className="container relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-soft">
            <Icon className="h-3.5 w-3.5 text-primary" />
            <EditableText page={pageKey} contentKey="hero_badge" defaultValue={data.label} as="span" />
          </div>
          <EditableText
            page={pageKey}
            contentKey="hero_title"
            defaultValue={data.heroTitle}
            as="h1"
            className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-5 leading-[1.05]"
            multiline
          />
          <EditableText
            page={pageKey}
            contentKey="hero_subtitle"
            defaultValue={data.heroSubtitle}
            as="p"
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
            multiline
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/demo">
              <Button size="lg" className="rounded-full font-semibold">Plan een demo →</Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="rounded-full">Vraag prijsindicatie</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problemen & kansen */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-border bg-tile p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                <Target className="h-5 w-5" />
              </div>
              <EditableText page={pageKey} contentKey="problems_title" defaultValue="Herkenbare uitdagingen" as="h2" className="text-2xl font-display font-bold mb-4" />
              <ul className="space-y-3">
                {data.problems.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <EditableText page={pageKey} contentKey={`problems_${i}`} defaultValue={p} as="span" multiline />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-tile p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary mb-4">
                <Lightbulb className="h-5 w-5" />
              </div>
              <EditableText page={pageKey} contentKey="opps_title" defaultValue="Kansen met een loyaliteitsplatform" as="h2" className="text-2xl font-display font-bold mb-4" />
              <ul className="space-y-3">
                {data.opportunities.map((p, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <EditableText page={pageKey} contentKey={`opps_${i}`} defaultValue={p} as="span" multiline />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Hoe loyaliteit waarde toevoegt */}
      <section className="py-20 md:py-24 bg-mist border-y border-border">
        <div className="container max-w-5xl">
          <span className="accent-bar mb-5" />
          <EditableText
            page={pageKey}
            contentKey="value_title"
            defaultValue={`Hoe loyaliteit waarde toevoegt in ${data.label.toLowerCase()}`}
            as="h2"
            className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-5"
            multiline
          />
          <EditableText
            page={pageKey}
            contentKey="value_text"
            defaultValue={data.loyaltyValue}
            as="p"
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-3xl"
            multiline
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.scenarios.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <EditableText page={pageKey} contentKey={`scenario_${i}_title`} defaultValue={s.title} as="h3" className="font-display font-semibold mb-2" />
                <EditableText page={pageKey} contentKey={`scenario_${i}_text`} defaultValue={s.text} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Functionaliteiten */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <span className="accent-bar mb-5" />
            <EditableText page={pageKey} contentKey="features_title" defaultValue="Functionaliteiten die ertoe doen" as="h2" className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3" />
            <EditableText
              page={pageKey}
              contentKey="features_subtitle"
              defaultValue={`Een greep uit de modules die we voor ${data.label.toLowerCase()} doorgaans inzetten — we voegen alleen toe wat u écht gebruikt.`}
              as="p"
              className="text-muted-foreground"
              multiline
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.features.map((f, i) => (
              <div key={i} className="bento-tile bg-tile p-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary mb-3">
                  <Sparkles className="h-4 w-4" />
                </div>
                <EditableText page={pageKey} contentKey={`feature_${i}_title`} defaultValue={f.title} as="h3" className="font-display font-semibold mb-2" />
                <EditableText page={pageKey} contentKey={`feature_${i}_desc`} defaultValue={f.desc} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maatwerk-bewijs */}
      <section className="py-20 md:py-24 bg-mist border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="accent-bar mb-5" />
              <EditableText
                page={pageKey}
                contentKey="maatwerk_title"
                defaultValue="Maatwerk in uw huisstijl, gebouwd op een bewezen standaard"
                as="h2"
                className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4"
                multiline
              />
              <EditableText
                page={pageKey}
                contentKey="maatwerk_p1"
                defaultValue="U start niet bij nul. Loyaltygroup levert een uitontwikkeld standaardplatform en voegt daar exact die functionaliteit, vormgeving en koppelingen aan toe die uw organisatie nodig heeft. Het resultaat: snel live, en tóch een oplossing die zich volledig naar uw merk en processen voegt."
                as="p"
                className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4"
                multiline
              />
              <EditableText
                page={pageKey}
                contentKey="maatwerk_p2"
                defaultValue="Of het nu gaat om een gemeentelijke stadspas, een centrumpas of een eigen retail-app — naar uw klant toe is er niets standaards aan."
                as="p"
                className="text-muted-foreground text-base md:text-lg leading-relaxed"
                multiline
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.whyUs.map((w, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-6">
                  <EditableText page={pageKey} contentKey={`why_${i}_title`} defaultValue={w.title} as="h3" className="font-display font-semibold mb-2" />
                  <EditableText page={pageKey} contentKey={`why_${i}_desc`} defaultValue={w.desc} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Klantcases */}
      <section className="py-20 md:py-24 bg-background">
        <KlantcasesBlock
          view="short"
          mode="latest"
          selectedIds={[]}
          limit={6}
          columns={3}
          showBranche
          showCategory
          title={`Klantcases uit ${data.label.toLowerCase()}`}
          titleAlign="left"
          showFilter={false}
          maxRows={2}
        />
        <div className="container mt-8 text-center">
          <Link to="/klantcases">
            <Button variant="outline" className="rounded-full">Bekijk alle klantcases</Button>
          </Link>
        </div>
      </section>

      <ReviewsBlock
        page={pageKey}
        title={`Wat klanten uit ${data.label.toLowerCase()} zeggen`}
      />

      <PriceIndication variant="branche" brancheLabel={data.label.toLowerCase()} />

      <DemoForm
        source={pageKey}
        brancheDefault={data.label}
        title={`Plan een demo voor ${data.label.toLowerCase()}`}
        subtitle="We bereiden de demo voor met voorbeelden die passen bij uw branche en organisatie."
      />

      <DemoCTA variant="gradient" />
      </PageContent>
    </Layout>
  );
};

export default Branche;