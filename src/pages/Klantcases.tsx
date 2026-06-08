import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ArrowRight, Pencil } from "lucide-react";
import EditableText from "@/components/EditableText";
import EditableButton from "@/components/EditableButton";
import PageContent from "@/components/page-builder/PageContent";

interface KlantcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  header_image_url: string | null;
  branche: string | null;
}

const placeholderCases: KlantcaseItem[] = [
  { id: "1", title: "Gemeente Amsterdam", category: "Gemeenten", description: "Implementatie van een stadspas voor 850.000 inwoners met koppelingen aan lokale ondernemers en culturele instellingen.", image_url: null, header_image_url: null, branche: "Overheid" },
  { id: "2", title: "Retailketen Nederland", category: "Commercieel", description: "Omnichannel loyaliteitsprogramma met digitale spaarpas, mobiele app en POS-integratie voor 200+ vestigingen.", image_url: null, header_image_url: null, branche: "Retail" },
  { id: "3", title: "Gemeente Utrecht", category: "Gemeenten", description: "Digitaal minimaregelingen-platform met automatische toekenning van kortingen en subsidies aan inwoners.", image_url: null, header_image_url: null, branche: "Overheid" },
  { id: "4", title: "Horeca Groep", category: "Commercieel", description: "Spaarprogramma voor een keten van 50+ horecagelegenheden met gepersonaliseerde beloningen en analytics.", image_url: null, header_image_url: null, branche: "Horeca" },
];

const Klantcases = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState<KlantcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranche, setSelectedBranche] = useState<string>("all");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("klantcases").select("*").eq("published", true).order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setCases(data as KlantcaseItem[]);
      } else {
        setCases(placeholderCases);
      }
      setLoading(false);
    };
    fetch();
  }, []);

  const sectorOptions = ["Gemeenten", "Horeca", "Zorg", "Retail", "Overig"];

  const matchesSector = (c: KlantcaseItem, sector: string) => {
    const haystack = `${c.branche ?? ""} ${c.category ?? ""}`.toLowerCase();
    if (sector === "Overig") {
      return !sectorOptions
        .filter((s) => s !== "Overig")
        .some((s) => haystack.includes(s.toLowerCase()));
    }
    return haystack.includes(sector.toLowerCase());
  };

  const filteredCases =
    selectedBranche === "all"
      ? cases
      : cases.filter((c) => matchesSector(c, selectedBranche));

  return (
    <Layout>
      <PageContent pageKey="klantcases">
      <section className="py-16 md:py-24 pb-0">
        <div className="container text-center relative">
          {isAdmin && (
            <div className="absolute right-0 top-0 hidden md:block">
              <Link to="/klantcases/nieuw">
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Klantcase maken
                </Button>
              </Link>
            </div>
          )}
          <EditableText page="klantcases" contentKey="hero_title" defaultValue="Klantcases" as="h1" className="text-3xl md:text-5xl font-bold mb-4" />
          <EditableText page="klantcases" contentKey="hero_subtitle" defaultValue="Ontdek hoe wij organisaties helpen met op maat gemaakte loyaliteitsoplossingen." as="p" className="text-lg text-muted-foreground max-w-2xl mx-auto" multiline />
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={selectedBranche === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedBranche("all")}
                className="rounded-full"
              >
                Alle
              </Button>
              {sectorOptions.map((s) => (
                <Button
                  key={s}
                  variant={selectedBranche === s ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBranche(s)}
                  className="rounded-full"
                >
                  {s}
                </Button>
              ))}
            </div>
            {isAdmin && (
              <Link to="/klantcases/nieuw" className="self-end">
                <Button>
                  <Plus className="h-4 w-4 mr-2" /> Maak klantcase
                </Button>
              </Link>
            )}
          </div>
          {loading ? (
            <p className="text-center text-muted-foreground">Laden...</p>
          ) : filteredCases.length === 0 ? (
            <p className="text-center text-muted-foreground">Geen klantcases gevonden voor deze sector.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              {filteredCases.map((c) => {
                const cardImage = c.header_image_url || c.image_url;
                const isReal = !placeholderCases.find((p) => p.id === c.id);
                const CardWrapper = isReal ? Link : "div";
                const wrapperProps = isReal ? { to: `/klantcases/${c.id}` } : {};

                return (
                  <div key={c.id} className="relative">
                    <CardWrapper
                      {...(wrapperProps as any)}
                      className="border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow group block h-full"
                    >
                      <div className="bg-muted h-32 md:h-48 flex items-center justify-center overflow-hidden">
                        {cardImage ? (
                          <img src={cardImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <span className="text-muted-foreground text-sm">{c.category}</span>
                        )}
                      </div>
                      <div className="p-3 md:p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] md:text-xs font-medium text-primary uppercase tracking-wider">{c.category}</span>
                          {c.branche && (
                            <span className="text-[10px] md:text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{c.branche}</span>
                          )}
                        </div>
                        <h3 className="text-sm md:text-lg font-semibold mt-1 mb-2">{c.title}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{c.description}</p>
                        {isReal && (
                          <span className="inline-flex items-center gap-1 text-xs md:text-sm text-primary font-medium mt-3 group-hover:gap-2 transition-all">
                            Lees meer <ArrowRight className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                    </CardWrapper>
                    {isAdmin && isReal && (
                      <Link to="/admin" className="absolute top-3 right-3 z-10">
                        <Button size="sm" variant="secondary" className="shadow-md">
                          <Pencil className="h-3.5 w-3.5 mr-1" /> Bewerken
                        </Button>
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container text-center">
          <EditableText page="klantcases" contentKey="cta_title" defaultValue="Wilt u de volgende succescase zijn?" as="h2" className="text-2xl font-bold mb-4 text-foreground" />
          <EditableButton page="klantcases" contentKey="cta_btn" defaultValue="Neem contact op" to="/contact" variant="default" />
        </div>
      </section>
      </PageContent>
    </Layout>
  );
};

export default Klantcases;
