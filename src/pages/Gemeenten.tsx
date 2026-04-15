import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, CreditCard, Users, BarChart3, Shield, Landmark } from "lucide-react";
import Layout from "@/components/layout/Layout";

const benefits = [
  { icon: CreditCard, title: "Stadspas", desc: "Digitale stadspas voor inwoners met kortingen bij lokale ondernemers." },
  { icon: Users, title: "Regelingen", desc: "Beheer minimaregelingen en subsidies via één centraal platform." },
  { icon: BarChart3, title: "Lokale Economie", desc: "Stimuleer de lokale economie door inwoners naar winkelgebieden te leiden." },
  { icon: Shield, title: "Privacy & Veiligheid", desc: "AVG-compliant systeem met hoge beveiligingsstandaarden." },
  { icon: Landmark, title: "Gemeentelijk Beheer", desc: "Volledig beheerpaneel voor ambtenaren met rapportages en analyses." },
  { icon: Building2, title: "Integraties", desc: "Naadloze koppeling met bestaande gemeentelijke systemen via API's." },
];

const Gemeenten = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Oplossingen voor Gemeenten</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">
          Versterk uw gemeente met een op maat gemaakt spaarsysteem. Van stadspassen tot minimaregelingen — alles in één platform.
        </p>
        <Link to="/demo"><Button size="lg" variant="secondary">Demo aanvragen</Button></Link>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Wat bieden wij gemeenten?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <b.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container text-center">
        <h2 className="text-2xl font-bold mb-4">Interesse in een samenwerking?</h2>
        <p className="text-muted-foreground mb-8 max-w-xl mx-auto">Neem contact met ons op voor een vrijblijvend gesprek over de mogelijkheden voor uw gemeente.</p>
        <Link to="/contact"><Button size="lg">Contact opnemen</Button></Link>
      </div>
    </section>
  </Layout>
);

export default Gemeenten;
