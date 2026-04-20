import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditableText from "@/components/EditableText";
import PageBuilderSlot from "@/components/page-builder/PageBuilderSlot";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Bericht verzonden", description: "Wij nemen zo snel mogelijk contact met u op." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <Layout>
      <PageBuilderSlot pageKey="contact" position="before" />
      <section className="py-16 md:py-24 pb-0">
        <div className="container text-center">
          <EditableText page="contact" contentKey="hero_title" defaultValue="Contact" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
          <EditableText page="contact" contentKey="hero_subtitle" defaultValue="Neem contact met ons op. Wij helpen u graag verder." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto" multiline />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <EditableText page="contact" contentKey="form_title" defaultValue="Stuur ons een bericht" as="h2" className="text-2xl font-bold mb-6" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Naam</Label>
                    <Input id="name" required placeholder="Uw naam" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" required placeholder="uw@email.nl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Organisatie</Label>
                  <Input id="company" placeholder="Uw organisatie" />
                </div>
                <div>
                  <Label htmlFor="subject">Onderwerp</Label>
                  <Input id="subject" required placeholder="Onderwerp" />
                </div>
                <div>
                  <Label htmlFor="message">Bericht</Label>
                  <Textarea id="message" required placeholder="Uw bericht..." rows={5} />
                </div>
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? "Verzenden..." : "Verstuur bericht"}
                </Button>
              </form>
            </div>

            <div className="space-y-6">
              <EditableText page="contact" contentKey="info_title" defaultValue="Contactgegevens" as="h2" className="text-2xl font-bold mb-6" />
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <EditableText page="contact" contentKey="email_label" defaultValue="E-mail" as="h3" className="font-semibold" />
                  <EditableText page="contact" contentKey="email_value" defaultValue="info@loyaltygroup.nl" as="p" className="text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <EditableText page="contact" contentKey="phone_label" defaultValue="Telefoon" as="h3" className="font-semibold" />
                  <EditableText page="contact" contentKey="phone_value" defaultValue="Ma-Vr 9:00 - 17:00" as="p" className="text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <EditableText page="contact" contentKey="address_label" defaultValue="Adres" as="h3" className="font-semibold" />
                  <EditableText page="contact" contentKey="address_value" defaultValue="Nederland" as="p" className="text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PageBuilderSlot pageKey="contact" position="after" />
    </Layout>
  );
};

export default Contact;
