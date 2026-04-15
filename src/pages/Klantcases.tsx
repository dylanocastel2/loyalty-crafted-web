import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";

interface KlantcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
}

const Klantcases = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState<KlantcaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("klantcases").select("*").eq("published", true).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setCases(data);
      } else {
        setCases([
          { id: "1", title: "Gemeente Amsterdam", category: "Gemeenten", description: "Implementatie van een stadspas voor 850.000 inwoners met koppelingen aan lokale ondernemers en culturele instellingen.", image_url: null },
          { id: "2", title: "Retailketen Nederland", category: "Commercieel", description: "Omnichannel loyaliteitsprogramma met digitale spaarpas, mobiele app en POS-integratie voor 200+ vestigingen.", image_url: null },
          { id: "3", title: "Gemeente Utrecht", category: "Gemeenten", description: "Digitaal minimaregelingen-platform met automatische toekenning van kortingen en subsidies aan inwoners.", image_url: null },
          { id: "4", title: "Horeca Groep", category: "Commercieel", description: "Spaarprogramma voor een keten van 50+ horecagelegenheden met gepersonaliseerde beloningen en analytics.", image_url: null },
        ]);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary to-secondary py-16 md:py-24">
        <div className="container text-center relative">
          <EditableText page="klantcases" contentKey="hero_title" defaultValue="Klantcases" as="h1" className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4" />
          <EditableText page="klantcases" contentKey="hero_subtitle" defaultValue="Ontdek hoe wij organisaties helpen met op maat gemaakte loyaliteitsoplossingen." as="p" className="text-lg text-primary-foreground/90 max-w-2xl mx-auto" multiline />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          {isAdmin && (
            <div className="flex justify-end mb-6">
              <Link to="/klantcases/nieuw">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Maak klantcase
                </Button>
              </Link>
            </div>
          )}
          {loading ? (
            <p className="text-center text-muted-foreground">Laden...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {cases.map((c) => (
                <div key={c.id} className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow">
                  <div className="bg-muted h-48 flex items-center justify-center">
                    {c.image_url ? (
                      <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-muted-foreground text-sm">{c.category}</span>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">{c.category}</span>
                    <h3 className="text-lg font-semibold mt-1 mb-2">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-accent">
        <div className="container text-center">
          <EditableText page="klantcases" contentKey="cta_title" defaultValue="Wilt u de volgende succescase zijn?" as="h2" className="text-2xl font-bold mb-4" />
          <EditableButton page="klantcases" contentKey="cta_btn" defaultValue="Neem contact op" to="/contact" />
        </div>
      </section>
    </Layout>
  );
};

export default Klantcases;
