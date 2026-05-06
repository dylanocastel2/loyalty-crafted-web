import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditableText from "@/components/EditableText";
import PageContent from "@/components/page-builder/PageContent";
import SocialIcons from "@/components/SocialIcons";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || "").trim().slice(0, 200),
      email: String(fd.get("email") || "").trim().slice(0, 255),
      company: String(fd.get("company") || "").trim().slice(0, 200) || null,
      subject: String(fd.get("subject") || "").trim().slice(0, 250),
      message: String(fd.get("message") || "").trim().slice(0, 4000),
    };
    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setLoading(false);
      toast({ title: "Vul alle velden in", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("contact_submissions").insert(payload);
    setLoading(false);
    if (error) {
      toast({ title: "Versturen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    supabase.functions.invoke("send-contact-notification", { body: payload }).catch(() => {});
    toast({ title: "Bericht verzonden", description: "Wij nemen zo snel mogelijk contact met u op." });
    form.reset();
  };

  return (
    <Layout>
      <PageContent pageKey="contact">
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
                    <Input id="name" name="name" required placeholder="Uw naam" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" name="email" type="email" required placeholder="uw@email.nl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Organisatie</Label>
                  <Input id="company" name="company" placeholder="Uw organisatie" />
                </div>
                <div>
                  <Label htmlFor="subject">Onderwerp</Label>
                  <Input id="subject" name="subject" required placeholder="Onderwerp" />
                </div>
                <div>
                  <Label htmlFor="message">Bericht</Label>
                  <Textarea id="message" name="message" required placeholder="Uw bericht..." rows={5} />
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
              <div className="pt-2">
                <h3 className="font-semibold mb-3">Volg ons</h3>
                <SocialIcons />
              </div>
            </div>
          </div>
        </div>
      </section>
      </PageContent>
    </Layout>
  );
};

export default Contact;
