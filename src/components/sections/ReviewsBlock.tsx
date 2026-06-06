import { Quote } from "lucide-react";
import EditableText from "@/components/EditableText";

const DEFAULT_REVIEWS = [
  {
    quoteKey: "reviews_q1_quote",
    nameKey: "reviews_q1_name",
    roleKey: "reviews_q1_role",
    quote:
      "We werken al jaren met Loyaltygroup. Wat het verschil maakt zijn de korte lijnen: wensen worden niet 'doorgezet', ze worden opgepakt door dezelfde mensen die het systeem gebouwd hebben.",
    name: "— citaat te beheren via admin",
    role: "Klantcitaat (voorbeeld)",
  },
  {
    quoteKey: "reviews_q2_quote",
    nameKey: "reviews_q2_name",
    roleKey: "reviews_q2_role",
    quote:
      "Wat ons opviel is hoeveel mogelijkheden er onder de motorkap zitten, terwijl het platform aan de buitenkant rustig en eenvoudig blijft. Onze gebruikers hebben geen instructie nodig.",
    name: "— citaat te beheren via admin",
    role: "Klantcitaat (voorbeeld)",
  },
  {
    quoteKey: "reviews_q3_quote",
    nameKey: "reviews_q3_name",
    roleKey: "reviews_q3_role",
    quote:
      "We hebben offertes opgevraagd bij meerdere leveranciers. Loyaltygroup bood verreweg de beste prijs-kwaliteitsverhouding en bovendien echt maatwerk in onze huisstijl.",
    name: "— citaat te beheren via admin",
    role: "Klantcitaat (voorbeeld)",
  },
];

interface Props {
  page?: string;
  title?: string;
  subtitle?: string;
}

const ReviewsBlock = ({
  page = "homepage",
  title = "Wat klanten over Loyaltygroup zeggen",
  subtitle = "Quotes worden door beheerders aangepast in het admin-paneel.",
}: Props) => (
  <section className="py-20 md:py-24 bg-background">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <span className="accent-bar mx-auto mb-5" />
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {DEFAULT_REVIEWS.map((r) => (
          <article
            key={r.quoteKey}
            className="relative rounded-2xl border border-border bg-tile p-7 flex flex-col"
          >
            <Quote className="h-7 w-7 text-primary/40 mb-4" aria-hidden />
            <EditableText
              page={page}
              contentKey={r.quoteKey}
              defaultValue={r.quote}
              as="p"
              className="text-base text-foreground leading-relaxed mb-6"
              multiline
            />
            <div className="mt-auto">
              <EditableText
                page={page}
                contentKey={r.nameKey}
                defaultValue={r.name}
                as="p"
                className="font-semibold text-sm"
              />
              <EditableText
                page={page}
                contentKey={r.roleKey}
                defaultValue={r.role}
                as="p"
                className="text-xs text-muted-foreground"
              />
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewsBlock;