import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight } from "lucide-react";

interface Props {
  title?: string;
  text?: string;
  primaryLabel?: string;
  primaryTo?: string;
  secondaryLabel?: string;
  secondaryTo?: string;
  variant?: "gradient" | "tile";
}

const DemoCTA = ({
  title = "Plan vrijblijvend een demo",
  text = "In 30 minuten laten we live zien wat een loyaliteitsplatform van Loyaltygroup voor uw organisatie kan betekenen. Geen verkoopverhaal, wel een eerlijk gesprek over mogelijkheden, planning en investering.",
  primaryLabel = "Plan een demo",
  primaryTo = "/demo",
  secondaryLabel = "Vraag prijsindicatie",
  secondaryTo = "/contact",
  variant = "tile",
}: Props) => {
  if (variant === "gradient") {
    return (
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-secondary">
        <div className="container text-center max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-primary-foreground">{title}</h2>
          <p className="text-primary-foreground/90 mb-7">{text}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={primaryTo}>
              <Button size="lg" variant="secondary" className="rounded-full font-semibold">
                <Calendar className="h-4 w-4 mr-2" /> {primaryLabel}
              </Button>
            </Link>
            <Link to={secondaryTo}>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent text-white border-white/40 hover:bg-white hover:text-primary">
                {secondaryLabel} <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-tile p-10 md:p-14 text-center">
          <div className="absolute inset-0 dot-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[hsl(var(--primary)/0.10)] blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[hsl(var(--secondary)/0.10)] blur-3xl" />
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 tracking-tight">{title}</h2>
            <p className="text-muted-foreground mb-7">{text}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={primaryTo}>
                <Button size="lg" className="rounded-full font-semibold">
                  <Calendar className="h-4 w-4 mr-2" /> {primaryLabel}
                </Button>
              </Link>
              <Link to={secondaryTo}>
                <Button size="lg" variant="outline" className="rounded-full">
                  {secondaryLabel}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoCTA;