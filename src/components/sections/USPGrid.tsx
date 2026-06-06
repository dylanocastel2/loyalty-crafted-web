import { Code2, Sparkles, ShieldCheck, MessageCircle, Layers, Coins, Plug, Settings2 } from "lucide-react";

export const USPS = [
  {
    icon: Code2,
    title: "Eigen softwareontwikkeling",
    desc: "Alle code wordt in eigen huis in Nederland geschreven en onderhouden. Geen tussenpartijen, geen black box — u praat altijd direct met de mensen die uw systeem kennen.",
  },
  {
    icon: Sparkles,
    title: "Maatwerk in uw huisstijl",
    desc: "U start op een bewezen standaardplatform en wij vormen het exact naar uw merk, processen en gebruikers. Geen sjabloontje, geen 'one-size-fits-all'.",
  },
  {
    icon: Layers,
    title: "Veel mogelijkheden, laagdrempelig in gebruik",
    desc: "Onder de motorkap een rijk platform; aan de buitenkant een omgeving waar zowel uw klant als uw beheerder direct mee uit de voeten kan.",
  },
  {
    icon: MessageCircle,
    title: "Korte lijnen en persoonlijke samenwerking",
    desc: "Een vast aanspreekpunt, snelle reactie en een team dat met u meedenkt — vanaf de eerste demo tot jaren na de livegang.",
  },
  {
    icon: ShieldCheck,
    title: "Betrouwbaarheid en helpdesk",
    desc: "Een professionele helpdesk, stabiele hosting in Nederland en jarenlange ervaring met productie-omgevingen die 24/7 moeten draaien.",
  },
  {
    icon: Coins,
    title: "Sterke prijs-kwaliteitsverhouding",
    desc: "Een volwaardig platform tegen een eerlijke prijs — zonder de tarieven van internationale loyalty-suites en zonder verborgen kosten.",
  },
  {
    icon: Plug,
    title: "Integraties en koppelingen",
    desc: "API's en kassakoppelingen voor de meest gangbare Nederlandse systemen, plus de ruimte om specifieke koppelingen te maken.",
  },
  {
    icon: Settings2,
    title: "Flexibiliteit",
    desc: "Het platform groeit mee met uw organisatie. Nieuwe wensen worden niet 'doorgezet naar productontwikkeling', maar opgepakt door hetzelfde team.",
  },
];

interface Props {
  title?: string;
  subtitle?: string;
  compact?: boolean;
}

const USPGrid = ({
  title = "Waarom organisaties voor Loyaltygroup kiezen",
  subtitle = "Acht concrete redenen waarom gemeenten, ketens en winkeliersverenigingen ons jaar na jaar verlengen.",
  compact = false,
}: Props) => (
  <section className={`${compact ? "py-12" : "py-20 md:py-28"} bg-mist border-y border-border`}>
    <div className="container">
      <div className="max-w-2xl mb-10">
        <span className="accent-bar mb-5" />
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight">{title}</h2>
        <p className="text-muted-foreground text-base md:text-lg">{subtitle}</p>
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-4"} gap-5`}>
        {USPS.map((u) => (
          <div key={u.title} className="bento-tile group bg-background p-6 flex flex-col min-h-[200px]">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground mb-4">
              <u.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display font-semibold text-base mb-2">{u.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{u.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default USPGrid;