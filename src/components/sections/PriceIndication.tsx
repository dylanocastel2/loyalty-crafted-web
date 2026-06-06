import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Coins } from "lucide-react";

interface Props {
  variant?: "default" | "branche";
  brancheLabel?: string;
}

const PriceIndication = ({ variant = "default", brancheLabel }: Props) => {
  const title =
    variant === "branche"
      ? `Wat kost een loyaliteitsplatform voor ${brancheLabel ?? "uw organisatie"}?`
      : "Wat kost een loyaliteitsplatform van Loyaltygroup?";

  return (
    <section className="py-20 md:py-24 bg-mist border-y border-border">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="accent-bar mb-5" />
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight">{title}</h2>
            <p className="text-muted-foreground text-base md:text-lg mb-6 leading-relaxed">
              Wij geloven niet in een vaste prijslijst, maar wél in volledige transparantie. Elke
              organisatie is anders — het aantal gebruikers, gewenste functionaliteiten en koppelingen
              bepalen de uiteindelijke investering. Wat we wél kunnen beloven: een sterke
              prijs-kwaliteitsverhouding zonder de tarieven van internationale loyalty-suites.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Eenmalige inrichtingskosten en een vast maandtarief",
                "Geen percentage over uw omzet of transacties",
                "Inclusief helpdesk, hosting in Nederland en updates",
                "Doorgroeibaar: u betaalt alleen voor wat u nodig heeft",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm md:text-base">{b}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/contact">
                <Button size="lg" className="rounded-full font-semibold">
                  Vraag prijsindicatie aan
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="rounded-full">
                  Plan eerst een demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-border bg-background p-8 md:p-10 shadow-soft">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-5">
                <Coins className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-3">Prijs-kwaliteit als uitgangspunt</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Klanten kiezen zelden voor de allergoedkoopste of de allerduurste leverancier — ze kiezen
                voor degene die het meeste waar maakt voor het bedrag dat ze investeren. Loyaltygroup
                positioneert zich bewust in die zone: een professioneel, in eigen huis ontwikkeld
                platform tegen een eerlijke prijs.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Tijdens een vrijblijvende kennismaking geven wij een realistische indicatie van de
                investering die past bij uw situatie — zonder verkoopdruk en zonder verborgen kosten.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceIndication;