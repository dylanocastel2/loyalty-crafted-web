import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare } from "lucide-react";

const faqs = [
  { q: "Hoe lang duurt de ontwikkeling van een spaarsysteem?", a: "De doorlooptijd varieert per project, maar gemiddeld duurt een implementatie 6-12 weken, afhankelijk van de complexiteit en gewenste integraties." },
  { q: "Kunnen jullie koppelen met ons bestaande systeem?", a: "Ja, wij ontwikkelen API's op maat voor naadloze integratie met POS-systemen, CRM-software, webshops en andere bestaande systemen." },
  { q: "Is het systeem AVG-compliant?", a: "Absoluut. Privacy en veiligheid staan centraal in onze ontwikkeling. Alle systemen voldoen aan de AVG-wetgeving." },
  { q: "Bieden jullie ook ondersteuning na de lancering?", a: "Ja, wij bieden doorlopende ondersteuning, onderhoud en optimalisatie na de lancering van uw spaarsysteem." },
  { q: "Wat kost een spaarsysteem?", a: "De kosten zijn afhankelijk van uw wensen en de complexiteit van het project. Neem contact met ons op voor een vrijblijvende offerte." },
];

const Support = () => (
  <Layout>
    <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
      <div className="container text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Support</h1>
        <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
          Wij staan voor u klaar. Vind antwoorden op veelgestelde vragen of neem direct contact op.
        </p>
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <h2 className="text-2xl font-bold mb-8">Veelgestelde Vragen</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-8">Nog vragen?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">E-mail</h3>
            <p className="text-sm text-muted-foreground">info@loyaltygroup.nl</p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Telefoon</h3>
            <p className="text-sm text-muted-foreground">Ma-Vr 9:00 - 17:00</p>
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-1">Contact</h3>
            <Link to="/contact"><Button variant="link" className="p-0">Contactformulier →</Button></Link>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Support;
