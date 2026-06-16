import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, CheckCircle2 } from "lucide-react";

interface Props {
  source?: string; // e.g. "homepage", "branche-retail"
  brancheDefault?: string;
  title?: string;
  subtitle?: string;
}

const DemoForm = ({
  source = "homepage",
  brancheDefault,
  title = "Plan direct een demo",
  subtitle = "Vul het formulier in en we nemen binnen één werkdag contact met u op om een passend moment in te plannen.",
}: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [branche, setBranche] = useState(brancheDefault || "");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim().slice(0, 200);
    const email = String(fd.get("email") || "").trim().slice(0, 255);
    const company = String(fd.get("company") || "").trim().slice(0, 200);
    const phone = String(fd.get("phone") || "").trim().slice(0, 50);
    const preferred = String(fd.get("preferred") || "").trim().slice(0, 50);
    const note = String(fd.get("note") || "").trim().slice(0, 2000);

    if (!name || !email || !company) {
      setLoading(false);
      toast({ title: "Vul de verplichte velden in", variant: "destructive" });
      return;
    }

    const messageParts = [
      phone ? `Telefoon: ${phone}` : null,
      branche ? `Branche: ${branche}` : null,
      preferred ? `Gewenste demo-datum: ${preferred}` : null,
      note ? `\nToelichting:\n${note}` : null,
    ].filter(Boolean);
    const message = messageParts.join("\n") || "Demo-aanvraag";
    const subject = `Demo-aanvraag (${source})`;

    const payload = { name, email, company: company || null, subject, message };
    const { error } = await supabase.from("contact_submissions").insert(payload);
    if (error) {
      setLoading(false);
      toast({ title: "Versturen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    supabase.functions.invoke("send-contact-notification", {
      body: {
        name,
        email,
        company,
        subject,
        message,
        form_title: subject,
        extra_fields: {
          Telefoon: phone || "-",
          Branche: branche || "-",
          "Gewenste demo-datum": preferred || "-",
        },
      },
    }).catch(() => {});

    setLoading(false);
    toast({
      title: "Bedankt, uw aanvraag is verstuurd",
      description: "We nemen binnen één werkdag contact met u op.",
    });
    form.reset();
    setBranche(brancheDefault || "");
    setSubmitted(true);
  };

  return (
    <section className="py-20 md:py-24 bg-background">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div>
            <span className="accent-bar mb-5" />
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">{title}</h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">{subtitle}</p>
            <ul className="space-y-3 text-sm">
              {[
                "30 minuten online, op een moment dat u uitkomt",
                "Live rondleiding door het platform — geen verkooppraatje",
                "Direct antwoord op uw vragen over functionaliteit en investering",
                "Vrijblijvend, kosteloos en zonder verplichtingen",
              ].map((i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{i}</span>
                </li>
              ))}
            </ul>
          </div>

          {submitted ? (
            <div className="rounded-2xl border border-border bg-tile p-8 md:p-10 text-center shadow-soft flex flex-col items-center justify-center min-h-[420px]">
              <CheckCircle2 className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Bedankt, uw aanvraag is verstuurd</h3>
              <p className="text-muted-foreground mb-6 max-w-sm">
                We nemen binnen één werkdag contact met u op om een passend moment in te plannen.
              </p>
              <Button variant="outline" onClick={() => setSubmitted(false)} className="rounded-full">
                Nieuwe aanvraag indienen
              </Button>
            </div>
          ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-tile p-6 md:p-8 space-y-4 shadow-soft"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="df-name">Naam *</Label>
                <Input id="df-name" name="name" required placeholder="Uw naam" />
              </div>
              <div>
                <Label htmlFor="df-company">Organisatie *</Label>
                <Input id="df-company" name="company" required placeholder="Uw organisatie" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="df-email">E-mail *</Label>
                <Input id="df-email" name="email" type="email" required placeholder="uw@email.nl" />
              </div>
              <div>
                <Label htmlFor="df-phone">Telefoon</Label>
                <Input id="df-phone" name="phone" type="tel" placeholder="06-..." />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="df-branche">Branche</Label>
                <Select value={branche} onValueChange={setBranche}>
                  <SelectTrigger id="df-branche">
                    <SelectValue placeholder="Selecteer uw branche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gemeenten">Gemeenten</SelectItem>
                    <SelectItem value="Horeca">Horeca</SelectItem>
                    <SelectItem value="Retail">Retail</SelectItem>
                    <SelectItem value="Zorg">Zorg</SelectItem>
                    <SelectItem value="Winkeliersverenigingen">Winkeliersverenigingen</SelectItem>
                    <SelectItem value="Anders">Anders</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="df-preferred">Gewenste demo-datum</Label>
                <Input id="df-preferred" name="preferred" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="df-note">Toelichting (optioneel)</Label>
              <Textarea id="df-note" name="note" rows={4} placeholder="Vertel kort wat u zoekt of waarmee we kunnen helpen." />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="w-full rounded-full font-semibold">
              <Calendar className="h-4 w-4 mr-2" />
              {loading ? "Verzenden…" : "Plan mijn demo"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              We gebruiken uw gegevens uitsluitend om contact met u op te nemen over uw aanvraag.
            </p>
          </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default DemoForm;