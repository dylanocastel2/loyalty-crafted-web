import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Users, BarChart3, Shield, Landmark } from "lucide-react";
import Layout from "@/components/layout/Layout";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";

const benefits = [
  { icon: CreditCard, tKey: "gem_stadspas_title", dKey: "gem_stadspas_desc", title: "Stadspas", desc: "Digitale stadspas voor inwoners met kortingen bij lokale ondernemers." },
  { icon: Users, tKey: "gem_regelingen_title", dKey: "gem_regelingen_desc", title: "Regelingen", desc: "Beheer minimaregelingen en subsidies via één centraal platform." },
  { icon: BarChart3, tKey: "gem_economie_title", dKey: "gem_economie_desc", title: "Lokale Economie", desc: "Stimuleer de lokale economie door inwoners naar winkelgebieden te leiden." },
  { icon: Shield, tKey: "gem_privacy_title", dKey: "gem_privacy_desc", title: "Privacy & Veiligheid", desc: "AVG-compliant systeem met hoge beveiligingsstandaarden." },
  { icon: Landmark, tKey: "gem_beheer_title", dKey: "gem_beheer_desc", title: "Gemeentelijk Beheer", desc: "Volledig beheerpaneel voor ambtenaren met rapportages en analyses." },
  { icon: Building2, tKey: "gem_integraties_title", dKey: "gem_integraties_desc", title: "Integraties", desc: "Naadloze koppeling met bestaande gemeentelijke systemen via API's." },
];

const Gemeenten = () => (
  <Layout>
    <section className="py-16 md:py-24">
      <div className="container text-center">
        <EditableText page="gemeenten" contentKey="hero_title" defaultValue="Oplossingen voor Gemeenten" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
        <EditableText page="gemeenten" contentKey="hero_subtitle" defaultValue="Versterk uw gemeente met een op maat gemaakt spaarsysteem. Van stadspassen tot minimaregelingen — alles in één platform." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8" multiline />
        <EditableButton page="gemeenten" contentKey="hero_btn" defaultValue="Demo aanvragen" to="/demo" />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <EditableText page="gemeenten" contentKey="benefits_title" defaultValue="Wat bieden wij gemeenten?" as="h2" className="text-2xl md:text-3xl font-bold text-center mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.tKey} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <b.icon className="h-8 w-8 text-primary mb-4" />
              <EditableText page="gemeenten" contentKey={b.tKey} defaultValue={b.title} as="h3" className="font-semibold mb-2" />
              <EditableText page="gemeenten" contentKey={b.dKey} defaultValue={b.desc} as="p" className="text-sm text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-gradient-to-br from-primary to-secondary">
      <div className="container text-center">
        <EditableText page="gemeenten" contentKey="cta_title" defaultValue="Interesse in een samenwerking?" as="h2" className="text-2xl font-bold mb-4 text-primary-foreground" />
        <EditableText page="gemeenten" contentKey="cta_text" defaultValue="Neem contact met ons op voor een vrijblijvend gesprek over de mogelijkheden voor uw gemeente." as="p" className="text-primary-foreground/90 mb-8 max-w-xl mx-auto" multiline />
        <EditableButton page="gemeenten" contentKey="cta_btn" defaultValue="Contact opnemen" to="/contact" variant="secondary" />
      </div>
    </section>
  </Layout>
);

export default Gemeenten;
