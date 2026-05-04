import { Database, Share2, Settings, ArrowRightLeft, Wrench, TrendingUp, CheckCircle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";
import PageContent from "@/components/page-builder/PageContent";

const highlights = [
  { icon: Database, tKey: "ss_hl_pakketten_title", dKey: "ss_hl_pakketten_desc", title: "Complete Pakketten", desc: "Al onze spaaroplossingen werken in combinatie met het Loyalty Spaarsysteem." },
  { icon: Share2, tKey: "ss_hl_gezamenlijk_title", dKey: "ss_hl_gezamenlijk_desc", title: "Gezamenlijke Systemen", desc: "Voor MKB, ketens, franchises, winkeliersverenigingen en gemeentes." },
  { icon: Settings, tKey: "ss_hl_maatwerk_title", dKey: "ss_hl_maatwerk_desc", title: "Oplossingen op Maat", desc: "Wij ontwikkelen al onze software in eigen huis. Als u het kunt bedenken, dan kunnen wij het maken!" },
];

const products = [
  { tKey: "ss_online_title", dKey: "ss_online_desc", title: "Online Spaarsysteem", desc: "De pasklare spaaroplossing om de klantenbinding te versterken. Met een fysieke spaarpas, smartphone app, cadeaukaarten en uitgebreide CRM Tools.", image: "https://www.loyaltygroup.nl/images/online-spaarsysteem-spaarsystemen.jpg", reverse: false },
  { tKey: "ss_digitaal_title", dKey: "ss_digitaal_desc", title: "Digitale Spaarpas", desc: "Liever geen fysieke kaarten? Uw klanten kunnen hun spaarpas en cadeaukaarten in de Loyalty App gebruiken. Nu ook met vouchers, push-berichten, webshopkoppeling en nog veel meer.", image: "https://www.loyaltygroup.nl/images/digitale-spaarpas-spaarsystemen.jpg", reverse: true },
  { tKey: "ss_klantenkaart_title", dKey: "ss_klantenkaart_desc", title: "Klantenkaart", desc: "Stimuleer uw klanten om vaker terug te komen met de Loyalty Spaarpas. Met een uniek design en saldochecker op uw eigen website.", image: "https://www.loyaltygroup.nl/images/klantenkaart.jpg", reverse: false },
  { tKey: "ss_apps_title", dKey: "ss_apps_desc", title: "Loyalty Apps", desc: "Met de Loyalty App kunnen klanten meer dan alleen sparen. Nu met o.a. vouchers, push-berichten en webshopkoppeling.", image: "https://www.loyaltygroup.nl/images/loyalty-apps-spaarsystemen.png", reverse: true },
  { tKey: "ss_cadeau_title", dKey: "ss_cadeau_desc", title: "Cadeaukaarten", desc: "Het meest feestelijke geschenk van Nederland. Werkt ook in combinatie met de Spaarpas en Loyalty App.", image: "https://www.loyaltygroup.nl/images/cadeaukaarten.jpg", reverse: false },
  { tKey: "ss_kassa_title", dKey: "ss_kassa_desc", title: "Kassakoppelingen", desc: "Het Loyalty Spaarsysteem kan gekoppeld worden aan de kassa. Sparen is nog nooit zo makkelijk geweest.", image: "https://www.loyaltygroup.nl/images/kassakoppelingen-spaarsystemen.jpg", reverse: true },
];

const services = [
  { icon: ArrowRightLeft, tKey: "ss_svc_overstap_title", dKey: "ss_svc_overstap_desc", title: "Overstappen", desc: "Heeft u al een klantenbestand? Wij kunnen deze overzetten naar het Loyalty Spaarsysteem.", image: "https://www.loyaltygroup.nl/images/overstappen.jpg" },
  { icon: Wrench, tKey: "ss_svc_installatie_title", dKey: "ss_svc_installatie_desc", title: "Installatie & Onderhoud", desc: "Wij zorgen dat u in de winkel aan de slag kunt en op de achtergrond houden we het systeem up-to-date.", image: "https://www.loyaltygroup.nl/images/onderhoud_installatie.jpg" },
  { icon: TrendingUp, tKey: "ss_svc_sales_title", dKey: "ss_svc_sales_desc", title: "Sales & Marketing", desc: "Met onze jarenlange ervaring in CRM en loyalty kunnen wij u helpen uw doelstellingen te realiseren.", image: "https://www.loyaltygroup.nl/images/sales.jpg" },
];

const steps = [
  { step: "1", tKey: "sp_stap1_title", dKey: "sp_stap1_desc", title: "Analyse & Advies", desc: "Wij analyseren uw situatie en adviseren over de beste aanpak voor uw loyaliteitsprogramma." },
  { step: "2", tKey: "sp_stap2_title", dKey: "sp_stap2_desc", title: "Ontwerp & Ontwikkeling", desc: "Ons team ontwerpt en bouwt uw spaarprogramma volledig op maat, in eigen huis." },
  { step: "3", tKey: "sp_stap3_title", dKey: "sp_stap3_desc", title: "Implementatie", desc: "Naadloze implementatie met koppelingen aan uw bestaande systemen via onze API's." },
  { step: "4", tKey: "sp_stap4_title", dKey: "sp_stap4_desc", title: "Lancering & Support", desc: "Wij begeleiden de lancering en bieden doorlopende ondersteuning en optimalisatie." },
];

const benefits = ["Volledig op maat gemaakt", "In-house ontwikkeld team", "Geen outsourcing", "Flexibele aanpassingen", "Doorlopende ondersteuning", "Schaalbare architectuur", "AVG-compliant", "Uitgebreide rapportages"];

const Spaarsysteem = () => (
  <Layout>
    <PageContent pageKey="spaarsysteem">

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl">
          <EditableText page="spaarsysteem" contentKey="hero_title" defaultValue="Spaarsysteem" as="h1" className="text-3xl md:text-5xl font-bold mb-6 tracking-wide" />
          <EditableText page="spaarsysteem" contentKey="hero_subtitle" defaultValue="Met het Loyalty Spaarsysteem kunnen klanten met hun aankopen sparen voor beloningen die u zelf kunt samenstellen. Met de gratis meegeleverde CRM Tools houdt u klanten altijd op de hoogte van de laatste nieuwtjes, acties en aanbiedingen." as="p" className="text-lg text-muted-foreground leading-relaxed" multiline />
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h) => (
            <div key={h.tKey} className="text-center p-6">
              <h.icon className="h-12 w-12 text-primary mx-auto mb-4" />
              <EditableText page="spaarsysteem" contentKey={h.tKey} defaultValue={h.title} as="h3" className="text-lg font-bold mb-2 uppercase tracking-wider" />
              <EditableText page="spaarsysteem" contentKey={h.dKey} defaultValue={h.desc} as="p" className="text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-8">
      <div className="container space-y-16 md:space-y-24">
        {products.map((p) => (
          <div key={p.tKey} className={`flex flex-col ${p.reverse ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center`}>
            <div className="flex-1 space-y-4">
              <EditableText page="spaarsysteem" contentKey={p.tKey} defaultValue={p.title} as="h2" className="text-2xl md:text-3xl font-bold text-primary" />
              <EditableText page="spaarsysteem" contentKey={p.dKey} defaultValue={p.desc} as="p" className="text-muted-foreground leading-relaxed text-lg" multiline />
            </div>
            <div className="flex-1">
              <img src={p.image} alt={p.title} className="w-full rounded-lg shadow-lg object-cover max-h-80" loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="py-16 md:py-24 bg-muted mt-16">
      <div className="container">
        <EditableText page="spaarsysteem" contentKey="steps_title" defaultValue="Hoe werkt het?" as="h2" className="text-2xl md:text-3xl font-bold text-center mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">{s.step}</div>
              <EditableText page="spaarsysteem" contentKey={s.tKey} defaultValue={s.title} as="h3" className="font-semibold mb-2" />
              <EditableText page="spaarsysteem" contentKey={s.dKey} defaultValue={s.desc} as="p" className="text-sm text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container">
        <EditableText page="spaarsysteem" contentKey="benefits_title" defaultValue="Voordelen" as="h2" className="text-2xl font-bold text-center mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm">{b}</span>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 md:py-20">
      <div className="container">
        <EditableText page="spaarsysteem" contentKey="service_title" defaultValue="Service" as="h2" className="text-2xl md:text-3xl font-bold text-center mb-4" />
        <EditableText page="spaarsysteem" contentKey="service_desc" defaultValue="Loyaltygroup probeert iedereen zo persoonlijk mogelijk te helpen en onze klanten zijn doorgaans uitermate content met de diensten die wij verlenen." as="p" className="text-muted-foreground text-center max-w-2xl mx-auto mb-12" multiline />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s) => (
            <div key={s.tKey} className="rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow">
              <img src={s.image} alt={s.title} className="w-full h-48 object-cover" loading="lazy" />
              <div className="p-6">
                <EditableText page="spaarsysteem" contentKey={s.tKey} defaultValue={s.title} as="h3" className="font-bold text-lg mb-2 uppercase tracking-wider" />
                <EditableText page="spaarsysteem" contentKey={s.dKey} defaultValue={s.desc} as="p" className="text-sm text-muted-foreground" multiline />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-primary to-secondary">
      <div className="container text-center">
        <EditableText page="spaarsysteem" contentKey="cta_title" defaultValue="Wilt u weten wat Loyaltygroup voor u kan betekenen?" as="h2" className="text-2xl md:text-3xl font-bold mb-4 text-primary-foreground" />
        <EditableText page="spaarsysteem" contentKey="cta_text" defaultValue="Wij komen graag geheel vrijblijvend bij u langs om de vele mogelijkheden van het Loyalty Spaarsysteem te demonstreren." as="p" className="text-primary-foreground/90 mb-8 max-w-xl mx-auto" multiline />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <EditableButton page="spaarsysteem" contentKey="cta_btn_demo" defaultValue="Demo aanvragen" to="/demo" />
          <EditableButton page="spaarsysteem" contentKey="cta_btn_contact" defaultValue="Contact opnemen" to="/contact" variant="outline" />
        </div>
      </div>
    </section>

    </PageContent>
  </Layout>
);

export default Spaarsysteem;
