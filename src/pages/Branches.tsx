import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Sparkles } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BRANCHES } from "@/lib/brancheContent";
import DemoCTA from "@/components/sections/DemoCTA";
import USPGrid from "@/components/sections/USPGrid";
import PageContent from "@/components/page-builder/PageContent";

const Branches = () => (
  <Layout>
    <Helmet>
      <title>Spaarsystemen per branche | Loyaltygroup</title>
      <meta
        name="description"
        content="Loyaltygroup levert spaarsystemen en loyaliteitsoplossingen voor gemeenten, horeca, retail, zorg en winkeliersverenigingen. Bekijk wat we per branche doen."
      />
      <link rel="canonical" href="https://www.loyaltygroup.nl/branches" />
      <meta property="og:title" content="Spaarsystemen per branche | Loyaltygroup" />
      <meta
        property="og:description"
        content="Loyaliteitsoplossingen op maat per branche: gemeenten, horeca, retail, zorg en winkeliersverenigingen."
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: BRANCHES.map((b, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: b.label,
            url: `https://www.loyaltygroup.nl/branches/${b.slug}`,
          })),
        })}
      </script>
    </Helmet>

    <PageContent pageKey="branches">
    <section className="relative overflow-hidden bg-hero py-20 md:py-28">
      <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
      <div className="container relative z-10 max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-soft">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          Loyaliteitsoplossingen per branche
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-5 leading-[1.05]">
          Een platform dat past bij úw branche
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Elke branche stelt andere eisen aan een loyaliteitsplatform. Kies hieronder uw sector
          en ontdek hoe Loyaltygroup u — met een bewezen standaardplatform én maatwerk in uw
          huisstijl — verder helpt.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BRANCHES.map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className="group rounded-2xl border border-border bg-tile p-7 hover:shadow-soft hover:border-primary/40 transition-all flex flex-col"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <b.icon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-display font-semibold mb-2">{b.label}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{b.shortDesc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Bekijk oplossingen <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Staat uw sector er niet bij? We werken voor veel meer organisaties — neem gerust contact op.
          </p>
          <Link to="/contact">
            <Button variant="outline" className="rounded-full">Neem contact op</Button>
          </Link>
        </div>
      </div>
    </section>

    <USPGrid
      title="Waarom organisaties — in elke branche — voor Loyaltygroup kiezen"
      subtitle="Acht punten die in elk sectorgesprek terugkomen."
    />

    <DemoCTA variant="gradient" />
    </PageContent>
  </Layout>
);

export default Branches;