import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface KlantcaseItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image_url: string | null;
  header_image_url: string | null;
  branche: string | null;
}

interface Props {
  view: "short" | "detailed";
  mode: "selected" | "latest";
  selectedIds: string[];
  limit: number;
  columns: number;
  showBranche?: boolean;
  showCategory?: boolean;
  title?: string;
  showFilter?: boolean;
}

const SECTOR_OPTIONS = ["Gemeenten", "Horeca", "Zorg", "Retail", "Overig"];

const matchesSector = (c: KlantcaseItem, sector: string) => {
  const haystack = `${c.branche ?? ""} ${c.category ?? ""}`.toLowerCase();
  if (sector === "Overig") {
    return !SECTOR_OPTIONS.filter((s) => s !== "Overig").some((s) =>
      haystack.includes(s.toLowerCase())
    );
  }
  return haystack.includes(sector.toLowerCase());
};

const KlantcasesBlock = ({ view, mode, selectedIds, limit, columns, showBranche, showCategory, title, showFilter }: Props) => {
  const [cases, setCases] = useState<KlantcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSector, setActiveSector] = useState<string>("all");

  useEffect(() => {
    let active = true;
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from("klantcases").select("*").eq("published", true);
      if (mode === "selected" && selectedIds?.length) {
        query = query.in("id", selectedIds);
      } else {
        query = query.order("created_at", { ascending: false }).limit(limit || 3);
      }
      const { data } = await query;
      if (!active) return;
      let list = (data as KlantcaseItem[]) || [];
      if (mode === "selected" && selectedIds?.length) {
        list = selectedIds.map((id) => list.find((c) => c.id === id)).filter(Boolean) as KlantcaseItem[];
      }
      setCases(list);
      setLoading(false);
    };
    fetch();
    return () => { active = false; };
  }, [mode, JSON.stringify(selectedIds), limit]);

  if (loading) return <div className="container py-8 text-center text-sm text-muted-foreground">Klantcases laden...</div>;
  if (!cases.length) return <div className="container py-8 text-center text-sm text-muted-foreground">Geen klantcases gevonden.</div>;

  const visibleCases =
    showFilter && activeSector !== "all"
      ? cases.filter((c) => matchesSector(c, activeSector))
      : cases;

  const cols = Math.max(1, Math.min(4, columns || 3));
  const colsClass = cols === 1 ? "md:grid-cols-1" : cols === 2 ? "md:grid-cols-2" : cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-2 lg:grid-cols-3";

  const filterBar = showFilter ? (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
      <Button
        variant={activeSector === "all" ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveSector("all")}
        className="rounded-full"
      >
        Alle
      </Button>
      {SECTOR_OPTIONS.map((s) => (
        <Button
          key={s}
          variant={activeSector === s ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveSector(s)}
          className="rounded-full"
        >
          {s}
        </Button>
      ))}
    </div>
  ) : null;

  if (view === "short") {
    return (
      <div className="container">
        {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>}
        {filterBar}
        {visibleCases.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-8">Geen klantcases in deze sector.</p>
        ) : (
        <div className={`grid grid-cols-1 ${colsClass} gap-6`}>
          {visibleCases.map((c) => {
            const img = c.header_image_url || c.image_url;
            return (
              <Link key={c.id} to={`/klantcases/${c.id}`} className="group border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow block">
                <div className="bg-muted aspect-video overflow-hidden flex items-center justify-center">
                  {img ? (
                    <img src={img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                  ) : (
                    <span className="text-muted-foreground text-sm">{c.category}</span>
                  )}
                </div>
                <div className="p-5">
                  {(showCategory || showBranche) && (
                    <div className="flex items-center gap-2 mb-1">
                      {showCategory && <span className="text-xs font-medium text-primary uppercase tracking-wider">{c.category}</span>}
                      {showBranche && c.branche && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{c.branche}</span>}
                    </div>
                  )}
                  <h3 className="text-base font-semibold mt-1 line-clamp-2">{c.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
        )}
      </div>
    );
  }

  // Detailed view
  return (
    <div className="container">
      {title && <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{title}</h2>}
      {filterBar}
      {visibleCases.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground py-8">Geen klantcases in deze sector.</p>
      ) : (
      <div className={`grid grid-cols-1 ${cols >= 2 ? "md:grid-cols-2" : ""} gap-8`}>
        {visibleCases.map((c) => {
          const img = c.header_image_url || c.image_url;
          return (
            <Link key={c.id} to={`/klantcases/${c.id}`} className="group border rounded-lg overflow-hidden bg-card hover:shadow-lg transition-shadow block">
              <div className="bg-muted h-56 overflow-hidden flex items-center justify-center">
                {img ? (
                  <img src={img} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                ) : (
                  <span className="text-muted-foreground text-sm">{c.category}</span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  {showCategory && <span className="text-xs font-medium text-primary uppercase tracking-wider">{c.category}</span>}
                  {showBranche && c.branche && <span className="text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">{c.branche}</span>}
                </div>
                <h3 className="text-lg font-semibold mt-1 mb-2">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-3">{c.description}</p>
                <span className="inline-flex items-center gap-1 text-sm text-primary font-medium mt-3 group-hover:gap-2 transition-all">
                  Lees meer <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default KlantcasesBlock;