import Layout from "@/components/layout/Layout";
import { Code, Users, Heart, Shield } from "lucide-react";
import EditableText from "@/components/EditableText";

const values = [
  { icon: Code, tKey: "oo_inhouse_title", dKey: "oo_inhouse_desc", title: "In-house Ontwikkeling", desc: "Al onze systemen worden volledig in eigen huis ontwikkeld door ons ervaren team. Geen outsourcing, volledige controle over kwaliteit." },
  { icon: Users, tKey: "oo_klantgericht_title", dKey: "oo_klantgericht_desc", title: "Klantgericht", desc: "Wij luisteren naar uw wensen en vertalen die naar een oplossing die perfect aansluit bij uw organisatie en doelgroep." },
  { icon: Heart, tKey: "oo_passie_title", dKey: "oo_passie_desc", title: "Passie voor Technologie", desc: "Ons team bestaat uit gepassioneerde ontwikkelaars die altijd op zoek zijn naar de beste en meest innovatieve oplossingen." },
  { icon: Shield, tKey: "oo_betrouwbaar_title", dKey: "oo_betrouwbaar_desc", title: "Betrouwbaar & Veilig", desc: "Veiligheid en betrouwbaarheid staan centraal in alles wat wij doen. Onze systemen voldoen aan de hoogste standaarden." },
];

const OverOns = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <EditableText page="over-ons" contentKey="hero_title" defaultValue="Over Ons" as="h1" className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
        <EditableText page="over-ons" contentKey="hero_subtitle" defaultValue="Loyaltygroup B.V. — uw partner voor op maat gemaakte loyaliteitsoplossingen." as="p" className="text-lg text-primary-foreground/90 max-w-2xl mx-auto" multiline />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <div className="mb-16">
          <EditableText page="over-ons" contentKey="about_title" defaultValue="Wie zijn wij?" as="h2" className="text-2xl font-bold mb-4" />
          <EditableText page="over-ons" contentKey="about_p1" defaultValue="Loyaltygroup B.V. is een Nederlands softwarebedrijf gespecialiseerd in het ontwikkelen van spaarsystemen en loyaliteitsprogramma's. Wij werken voor zowel gemeenten als commerciële organisaties." as="p" className="text-muted-foreground leading-relaxed mb-4" multiline />
          <EditableText page="over-ons" contentKey="about_p2" defaultValue="Wat ons onderscheidt is dat wij alles in eigen huis ontwikkelen. Ons team van ervaren ontwikkelaars bouwt elk systeem volledig op maat, zonder gebruik te maken van standaard templates of externe partijen." as="p" className="text-muted-foreground leading-relaxed mb-4" multiline />
          <EditableText page="over-ons" contentKey="about_p3" defaultValue="Dankzij onze flexibele aanpak en diepgaande technische kennis kunnen wij snel inspelen op veranderende wensen en nieuwe mogelijkheden bieden die standaardoplossingen niet kunnen leveren." as="p" className="text-muted-foreground leading-relaxed" multiline />
        </div>

        <EditableText page="over-ons" contentKey="values_title" defaultValue="Onze Waarden" as="h2" className="text-2xl font-bold text-center mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((v) => (
            <div key={v.tKey} className="border rounded-lg p-6 bg-card hover:shadow-lg transition-shadow">
              <v.icon className="h-8 w-8 text-primary mb-4" />
              <EditableText page="over-ons" contentKey={v.tKey} defaultValue={v.title} as="h3" className="font-semibold mb-2" />
              <EditableText page="over-ons" contentKey={v.dKey} defaultValue={v.desc} as="p" className="text-sm text-muted-foreground" multiline />
            </div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default OverOns;
