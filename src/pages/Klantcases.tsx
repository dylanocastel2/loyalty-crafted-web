import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const placeholderCases = [
  { id: 1, title: "Gemeente Amsterdam", category: "Gemeenten", description: "Implementatie van een stadspas voor 850.000 inwoners met koppelingen aan lokale ondernemers en culturele instellingen." },
  { id: 2, title: "Retailketen Nederland", category: "Commercieel", description: "Omnichannel loyaliteitsprogramma met digitale spaarpas, mobiele app en POS-integratie voor 200+ vestigingen." },
  { id: 3, title: "Gemeente Utrecht", category: "Gemeenten", description: "Digitaal minimaregelingen-platform met automatische toekenning van kortingen en subsidies aan inwoners." },
  { id: 4, title: "Horeca Groep", category: "Commercieel", description: "Spaarprogramma voor een keten van 50+ horecagelegenheden met gepersonaliseerde beloningen en analytics." },
];

const Klantcases = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Klantcases</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Ontdek hoe wij organisaties helpen met op maat gemaakte loyaliteitsoplossingen.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {placeholderCases.map((c) => (
            <div key={c.id} className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
              <div className="bg-muted h-48 flex items-center justify-center">
                <span className="text-muted-foreground text-sm">{c.category}</span>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-primary uppercase tracking-wider">{c.category}</span>
                <h3 className="text-lg font-semibold mt-1 mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container text-center">
        <h2 className="text-2xl font-bold mb-4">Wilt u de volgende succescase zijn?</h2>
        <Link to="/contact"><Button size="lg">Neem contact op</Button></Link>
      </div>
    </section>
  </Layout>
);

export default Klantcases;
