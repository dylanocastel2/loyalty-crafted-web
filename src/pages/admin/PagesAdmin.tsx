import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  show_in_menu: boolean;
  updated_at: string;
}

const PagesAdmin = () => {
  const navigate = useNavigate();
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) navigate("/");
  }, [authLoading, isAdmin, navigate]);

  const fetchPages = async () => {
    const { data } = await supabase
      .from("custom_pages")
      .select("id, slug, title, published, show_in_menu, updated_at")
      .order("updated_at", { ascending: false });
    if (data) setPages(data as PageRow[]);
    setLoading(false);
  };

  useEffect(() => { if (isAdmin) fetchPages(); }, [isAdmin]);

  const remove = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze pagina wilt verwijderen?")) return;
    await supabase.from("custom_pages").delete().eq("id", id);
    toast({ title: "Pagina verwijderd" });
    fetchPages();
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
    fetchPages();
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link to="/admin"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-1" /> Admin</Button></Link>
            <h1 className="font-bold">Pagina's</h1>
          </div>
          <Link to="/admin/pages/nieuw/edit">
            <Button><Plus className="h-4 w-4 mr-1" /> Nieuwe pagina</Button>
          </Link>
        </div>
      </header>

      <div className="container py-8">
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
                      {p.published ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Live</span>
                      ) : (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">Concept</span>
                      )}
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
                          <Plus className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default PagesAdmin;
