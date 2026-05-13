import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BUILTIN_PAGES } from "@/lib/builtinPages";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  show_in_menu: boolean;
  updated_at: string;
}

export default function PagesPanel() {
  const { toast } = useToast();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [p, s] = await Promise.all([
      supabase.from("custom_pages").select("id, slug, title, published, show_in_menu, updated_at").order("updated_at", { ascending: false }),
      supabase.from("page_blocks").select("page_key, blocks"),
    ]);
    if (p.data) setPages(p.data as PageRow[]);
    if (s.data) {
      const counts: Record<string, number> = {};
      for (const row of s.data as { page_key: string; blocks: any }[]) {
        const len = Array.isArray(row.blocks) ? row.blocks.length : 0;
        counts[row.page_key] = (counts[row.page_key] || 0) + len;
      }
      setSlotCounts(counts);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze pagina wilt verwijderen?")) return;
    await supabase.from("custom_pages").delete().eq("id", id);
    toast({ title: "Pagina verwijderd" });
    load();
  };

  const duplicate = async (id: string) => {
    const { data: orig } = await supabase.from("custom_pages").select("*").eq("id", id).single();
    if (!orig) return;
    const { id: _id, created_at, updated_at, ...rest } = orig;
    await supabase.from("custom_pages").insert({
      ...rest,
      title: `${orig.title} (kopie)`,
      slug: `${orig.slug}-kopie-${Date.now().toString(36)}`,
      published: false,
    });
    toast({ title: "Pagina gedupliceerd" });
    load();
  };

  if (loading) return <div className="text-muted-foreground">Pagina's laden…</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">Beheer alle pagina's met de drag-and-drop bouwer.</p>
        <Link to="/admin/pages/nieuw/edit">
          <Button><Plus className="h-4 w-4 mr-1" /> Nieuwe pagina</Button>
        </Link>
      </div>

      <section>
        <h2 className="font-bold mb-2">Bestaande pagina's</h2>
        <p className="text-xs text-muted-foreground mb-3">Voeg blokken toe boven of onder bestaande inhoud, of bewerk SEO.</p>
        <div className="bg-card border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Pagina</th>
                <th className="px-4 py-3 font-semibold">Pad</th>
                <th className="px-4 py-3 font-semibold">Extra blokken</th>
                <th className="px-4 py-3 font-semibold text-right">Acties</th>
              </tr>
            </thead>
            <tbody>
              {BUILTIN_PAGES.map((bp) => (
                <tr key={bp.key} className="border-t hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{bp.label}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">{bp.path}</td>
                  <td className="px-4 py-3 text-sm">{slotCounts[bp.key] || 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <a href={bp.path} target="_blank" rel="noreferrer">
                        <Button variant="ghost" size="icon" title="Bekijken"><ExternalLink className="h-4 w-4" /></Button>
                      </a>
                      <Link to={`/admin/pages/builtin/${bp.key}`}>
                        <Button variant="ghost" size="icon" title="Bewerken"><Pencil className="h-4 w-4" /></Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-bold mb-2">Eigen pagina's</h2>
        <p className="text-xs text-muted-foreground mb-3">Volledig zelf opgebouwde pagina's via de blokkenbouwer.</p>
        {pages.length === 0 ? (
          <div className="bg-card border rounded-lg p-12 text-center">
            <p className="text-muted-foreground mb-4">Nog geen pagina's aangemaakt</p>
            <Link to="/admin/pages/nieuw/edit">
              <Button><Plus className="h-4 w-4 mr-1" /> Maak je eerste pagina</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 font-semibold">Titel</th>
                  <th className="px-4 py-3 font-semibold">Slug</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">In menu</th>
                  <th className="px-4 py-3 font-semibold text-right">Acties</th>
                </tr>
              </thead>
              <tbody>
                {pages.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">/p/{p.slug}</td>
                    <td className="px-4 py-3">
                      {p.published
                        ? <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Live</span>
                        : <span className="text-xs bg-muted px-2 py-0.5 rounded">Concept</span>}
                    </td>
                    <td className="px-4 py-3 text-sm">{p.show_in_menu ? "Ja" : "Nee"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
                        {p.published && (
                          <a href={`/p/${p.slug}`} target="_blank" rel="noreferrer">
                            <Button variant="ghost" size="icon" title="Bekijken"><ExternalLink className="h-4 w-4" /></Button>
                          </a>
                        )}
                        <Link to={`/admin/pages/${p.id}/edit`}>
                          <Button variant="ghost" size="icon" title="Bewerken"><Pencil className="h-4 w-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" title="Dupliceren" onClick={() => duplicate(p.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Verwijderen" onClick={() => remove(p.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}