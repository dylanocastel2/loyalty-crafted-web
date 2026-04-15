import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">Contact</h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
            Neem contact met ons op. Wij helpen u graag verder.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Stuur ons een bericht</h2>
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
              <h2 className="text-2xl font-bold mb-6">Contactgegevens</h2>
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">E-mail</h3>
                  <p className="text-muted-foreground">info@loyaltygroup.nl</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Telefoon</h3>
                  <p className="text-muted-foreground">Ma-Vr 9:00 - 17:00</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold">Adres</h3>
                  <p className="text-muted-foreground">Nederland</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
