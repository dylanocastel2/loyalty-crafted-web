import Layout from "@/components/layout/Layout";
import { Code, Users, Heart, Shield } from "lucide-react";

const values = [
  { icon: Code, title: "In-house Ontwikkeling", desc: "Al onze systemen worden volledig in eigen huis ontwikkeld door ons ervaren team. Geen outsourcing, volledige controle over kwaliteit." },
  { icon: Users, title: "Klantgericht", desc: "Wij luisteren naar uw wensen en vertalen die naar een oplossing die perfect aansluit bij uw organisatie en doelgroep." },
  { icon: Heart, title: "Passie voor Technologie", desc: "Ons team bestaat uit gepassioneerde ontwikkelaars die altijd op zoek zijn naar de beste en meest innovatieve oplossingen." },
  { icon: Shield, title: "Betrouwbaar & Veilig", desc: "Veiligheid en betrouwbaarheid staan centraal in alles wat wij doen. Onze systemen voldoen aan de hoogste standaarden." },
];

const OverOns = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Over Ons</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Loyaltygroup B.V. — uw partner voor op maat gemaakte loyaliteitsoplossingen.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <div className="prose prose-lg mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-4">Wie zijn wij?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Loyaltygroup B.V. is een Nederlands softwarebedrijf gespecialiseerd in het ontwikkelen van spaarsystemen en loyaliteitsprogramma's. Wij werken voor zowel gemeenten als commerciële organisaties.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Wat ons onderscheidt is dat wij alles in eigen huis ontwikkelen. Ons team van ervaren ontwikkelaars bouwt elk systeem volledig op maat, zonder gebruik te maken van standaard templates of externe partijen.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Dankzij onze flexibele aanpak en diepgaande technische kennis kunnen wij snel inspelen op veranderende wensen en nieuwe mogelijkheden bieden die standaardoplossingen niet kunnen leveren.
          </p>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">Onze Waarden</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.title} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <v.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default OverOns;
