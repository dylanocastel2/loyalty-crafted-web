import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import EditableText from "@/components/EditableText";
import PageContent from "@/components/page-builder/PageContent";
import { supabase } from "@/integrations/supabase/client";

const Demo = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState<string>("");
  const [branche, setBranche] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "");
    const email = String(fd.get("email") || "");
    const company = String(fd.get("company") || "");
    const toelichting = String(fd.get("message") || "");
    const messageParts = [
      type ? `Type organisatie: ${type}` : null,
      branche ? `Branche: ${branche}` : null,
      toelichting ? `\nToelichting:\n${toelichting}` : null,
    ].filter(Boolean);
    const message = messageParts.join("\n") || "Geen toelichting";
    const payload = {
      name,
      email,
      company,
      subject: "Demo aanvraag",
      message,
    };
    const { error } = await supabase.from("contact_submissions").insert(payload);
    setLoading(false);
    if (error) {
      toast({ title: "Er ging iets mis", description: error.message, variant: "destructive" });
      return;
    }
    supabase.functions.invoke("send-contact-notification", { body: payload }).catch(() => {});
    toast({ title: "Demo aangevraagd", description: "Wij nemen binnen 24 uur contact met u op." });
    form.reset();
    setType("");
    setBranche("");
  };

  return (
    <Layout>
      <PageContent pageKey="demo">
      <section className="py-16 md:py-24 pb-0">
        <div className="container text-center">
          <EditableText page="demo" contentKey="hero_title" defaultValue="Demo Aanvragen" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
          <EditableText page="demo" contentKey="hero_subtitle" defaultValue="Ervaar onze spaarsystemen in actie. Vraag een vrijblijvende demo aan." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto" multiline />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <EditableText page="demo" contentKey="form_title" defaultValue="Vul het formulier in" as="h2" className="text-2xl font-bold mb-6" />
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Naam *</Label>
                    <Input id="name" name="name" required placeholder="Uw naam" />
                  </div>
                  <div>
                    <Label htmlFor="email">E-mail *</Label>
                    <Input id="email" name="email" type="email" required placeholder="uw@email.nl" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Organisatie *</Label>
                  <Input id="company" name="company" required placeholder="Uw organisatie" />
                </div>
                <div>
                  <Label htmlFor="type">Type organisatie</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemeente">Gemeente</SelectItem>
                      <SelectItem value="commercieel">Commercieel bedrijf</SelectItem>
                      <SelectItem value="overig">Overig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="branche">Branche</Label>
                  <Select value={branche} onValueChange={setBranche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer branche" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="horeca">Horeca</SelectItem>
                      <SelectItem value="overheid">Overheid</SelectItem>
                      <SelectItem value="sport">Sport & Recreatie</SelectItem>
                      <SelectItem value="zorg">Zorg</SelectItem>
                      <SelectItem value="onderwijs">Onderwijs</SelectItem>
                      <SelectItem value="anders">Anders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="message">Toelichting</Label>
                  <Textarea id="message" name="message" placeholder="Vertel ons meer over uw wensen..." rows={4} />
                </div>
                <Button type="submit" disabled={loading} size="lg" className="w-full sm:w-auto">
                  {loading ? "Verzenden..." : "Demo aanvragen"}
                </Button>
              </form>
            </div>

            <div className="bg-accent rounded-lg p-8">
              <EditableText page="demo" contentKey="expect_title" defaultValue="Wat kunt u verwachten?" as="h3" className="text-xl font-bold mb-6" />
              <ul className="space-y-4">
                {[
                  { key: "expect_1", text: "Persoonlijke demonstratie op maat" },
                  { key: "expect_2", text: "Overzicht van alle mogelijkheden" },
                  { key: "expect_3", text: "Antwoord op al uw vragen" },
                  { key: "expect_4", text: "Vrijblijvend en kosteloos" },
                  { key: "expect_5", text: "Reactie binnen 24 uur" },
                ].map((item) => (
                  <li key={item.key} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <EditableText page="demo" contentKey={item.key} defaultValue={item.text} as="span" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      </PageContent>
    </Layout>
  );
};

export default Demo;
