import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Phone, MessageSquare } from "lucide-react";
import EditableText from "@/components/EditableText";
import PageContent from "@/components/page-builder/PageContent";

const faqs = [
  { key: "faq_1", q: "Hoe lang duurt de ontwikkeling van een spaarsysteem?", a: "De doorlooptijd varieert per project, maar gemiddeld duurt een implementatie 6-12 weken, afhankelijk van de complexiteit en gewenste integraties." },
  { key: "faq_2", q: "Kunnen jullie koppelen met ons bestaande systeem?", a: "Ja, wij ontwikkelen API's op maat voor naadloze integratie met POS-systemen, CRM-software, webshops en andere bestaande systemen." },
  { key: "faq_3", q: "Is het systeem AVG-compliant?", a: "Absoluut. Privacy en veiligheid staan centraal in onze ontwikkeling. Alle systemen voldoen aan de AVG-wetgeving." },
  { key: "faq_4", q: "Bieden jullie ook ondersteuning na de lancering?", a: "Ja, wij bieden doorlopende ondersteuning, onderhoud en optimalisatie na de lancering van uw spaarsysteem." },
  { key: "faq_5", q: "Wat kost een spaarsysteem?", a: "De kosten zijn afhankelijk van uw wensen en de complexiteit van het project. Neem contact met ons op voor een vrijblijvende offerte." },
];

const Support = () => (
  <Layout>
      <PageContent pageKey="support">
    <section className="py-16 md:py-24">
      <div className="container text-center">
        <EditableText page="support" contentKey="hero_title" defaultValue="Support" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
        <EditableText page="support" contentKey="hero_subtitle" defaultValue="Wij staan voor u klaar. Vind antwoorden op veelgestelde vragen of neem direct contact op." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto" multiline />
      </div>
    </section>

    <section className="py-16 md:py-24">
      <div className="container max-w-3xl">
        <EditableText page="support" contentKey="faq_title" defaultValue="Veelgestelde Vragen" as="h2" className="text-2xl font-bold mb-8" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.key} value={faq.key}>
              <AccordionTrigger className="text-left">
                <EditableText page="support" contentKey={`${faq.key}_q`} defaultValue={faq.q} as="span" />
              </AccordionTrigger>
              <AccordionContent>
                <EditableText page="support" contentKey={`${faq.key}_a`} defaultValue={faq.a} as="p" className="text-muted-foreground" multiline />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>

    <section className="py-16 bg-accent">
      <div className="container">
        <EditableText page="support" contentKey="contact_title" defaultValue="Nog vragen?" as="h2" className="text-2xl font-bold text-center mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center p-6 rounded-lg border bg-card">
            <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
            <EditableText page="support" contentKey="support_email_label" defaultValue="E-mail" as="h3" className="font-semibold mb-1" />
            <EditableText page="support" contentKey="support_email_value" defaultValue="info@loyaltygroup.nl" as="p" className="text-sm text-muted-foreground" />
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <Phone className="h-8 w-8 text-primary mx-auto mb-3" />
            <EditableText page="support" contentKey="support_phone_label" defaultValue="Telefoon" as="h3" className="font-semibold mb-1" />
            <EditableText page="support" contentKey="support_phone_value" defaultValue="Ma-Vr 9:00 - 17:00" as="p" className="text-sm text-muted-foreground" />
          </div>
          <div className="text-center p-6 rounded-lg border bg-card">
            <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
            <EditableText page="support" contentKey="support_contact_label" defaultValue="Contact" as="h3" className="font-semibold mb-1" />
            <Link to="/contact"><Button variant="link" className="p-0">Contactformulier →</Button></Link>
          </div>
        </div>
      </div>
    </section>
    </PageContent>
  </Layout>
);

export default Support;
