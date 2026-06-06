import { Layers, MousePointerClick, Settings2, Zap } from "lucide-react";

const points = [
  {
    icon: MousePointerClick,
    title: "Eenvoudig in gebruik",
    desc: "Klanten sparen, beheerders beheren, beleidsmedewerkers rapporteren — zonder dure trainingstrajecten of uitgebreide handleidingen.",
  },
  {
    icon: Layers,
    title: "Rijke functionaliteit onder de motorkap",
    desc: "App, pas, kassa, webshop, vouchers, cadeaukaarten, koppelingen en rapportages — beschikbaar wanneer u ze nodig hebt, onzichtbaar als u ze niet gebruikt.",
  },
  {
    icon: Settings2,
    title: "Aan/uit per functionaliteit",
    desc: "U bepaalt zelf welke modules actief zijn. Begin eenvoudig en bouw rustig uit naarmate uw programma volwassener wordt.",
  },
  {
    icon: Zap,
    title: "Snel live",
    desc: "Doordat u op een uitontwikkeld platform start, gaat u sneller live dan met een 100% maatwerktraject — zonder in te leveren op uw eigen wensen.",
  },
];

const LaagdrempeligBlock = () => (
  <section className="py-20 md:py-28 bg-background">
    <div className="container">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <span className="accent-bar mb-5" />
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">
            Veel mogelijkheden, laagdrempelig in gebruik
          </h2>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4">
            Een loyaliteitsplatform mag nooit voelen als een complex stuk software. Uit onze
            gesprekken met prospects horen we steeds hetzelfde: men wil veel kunnen, zonder
            verstrikt te raken in instellingen, handleidingen of training.
          </p>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Het Loyalty-platform is bewust ontworpen om aan beide kanten rustig te zijn — voor uw
            klanten in de app en aan de kassa, voor uw team in het beheerportaal — terwijl de
            mogelijkheden vrijwel onbeperkt zijn voor wie er meer uit wil halen.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-border bg-tile p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary mb-4">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-semibold mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default LaagdrempeligBlock;