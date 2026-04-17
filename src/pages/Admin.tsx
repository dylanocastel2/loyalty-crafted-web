import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { LogOut, Plus, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { Database } from "@/integrations/supabase/types";

type Klantcase = Database["public"]["Tables"]["klantcases"]["Row"];

const pages = [
  { label: "Homepage", path: "/" },
  { label: "Gemeenten", path: "/gemeenten" },
  { label: "Commercieel", path: "/commercieel" },
  { label: "Spaarsystemen", path: "/spaarsystemen" },
  { label: "Spaarprogramma", path: "/spaarprogramma" },
  { label: "Klantcases", path: "/klantcases" },
  { label: "Support", path: "/support" },
  { label: "Over Ons", path: "/over-ons" },
  { label: "Contact", path: "/contact" },
  { label: "Demo", path: "/demo" },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cases, setCases] = useState<Klantcase[]>([]);
  const [editCase, setEditCase] = useState<Partial<Klantcase> | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    const admin = roles?.some((r) => r.role === "admin") ?? false;
    if (!admin) {
      toast({ title: "Geen toegang", description: "U heeft geen beheerdersrechten.", variant: "destructive" });
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }
    setIsAdmin(true);
    setLoading(false);
    fetchCases();
  };

  const fetchCases = async () => {
    const { data } = await supabase.from("klantcases").select("*").order("created_at", { ascending: false });
    if (data) setCases(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const saveCase = async () => {
    if (!editCase?.title) return;
    const payload = {
      title: editCase.title,
      description: editCase.description || "",
      category: editCase.category || "Gemeenten",
      branche: (editCase as any).branche || null,
      image_url: editCase.image_url || null,
      header_image_url: (editCase as any).header_image_url || null,
      published: editCase.published ?? false,
    };
    if (editCase.id) {
      await supabase.from("klantcases").update(payload).eq("id", editCase.id);
    } else {
      await supabase.from("klantcases").insert(payload);
    }
    setEditCase(null);
    fetchCases();
    toast({ title: "Opgeslagen" });
  };

  const deleteCase = async (id: string) => {
    await supabase.from("klantcases").delete().eq("id", id);
    fetchCases();
    toast({ title: "Verwijderd" });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Laden...</div>;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container flex items-center justify-between h-14">
          <h1 className="font-bold text-lg">Admin Panel</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Uitloggen
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="klantcases">
          <TabsList>
            <TabsTrigger value="klantcases">Klantcases</TabsTrigger>
            <TabsTrigger value="custom-pages">Pagina's beheren</TabsTrigger>
            <TabsTrigger value="paginas">Pagina's bewerken</TabsTrigger>
          </TabsList>

          <TabsContent value="custom-pages" className="mt-6">
            <div className="bg-card border rounded-lg p-8 text-center">
              <FileText className="h-12 w-12 mx-auto text-primary mb-3" />
              <h2 className="text-xl font-bold mb-2">Pagina bouwer</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Maak nieuwe pagina's met de drag & drop bouwer. Voeg blokken toe, stel SEO in en beheer welke pagina's in het hoofdmenu verschijnen.
              </p>
              <div className="flex gap-2 justify-center">
                <Link to="/admin/pages"><Button variant="outline">Bekijk alle pagina's</Button></Link>
                <Link to="/admin/pages/nieuw/edit"><Button><Plus className="h-4 w-4 mr-1" /> Nieuwe pagina</Button></Link>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="klantcases" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Klantcases</h2>
              <Link to="/klantcases/nieuw">
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nieuwe klantcase</Button>
              </Link>
            </div>

            {editCase && (
              <div className="bg-card border rounded-lg p-6 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Titel</Label>
                    <Input value={editCase.title || ""} onChange={(e) => setEditCase({ ...editCase, title: e.target.value })} />
                  </div>
                  <div>
                    <Label>Categorie</Label>
                    <Input value={editCase.category || ""} onChange={(e) => setEditCase({ ...editCase, category: e.target.value })} />
                  </div>
                  <div>
                    <Label>Branche</Label>
                    <Input value={(editCase as any).branche || ""} onChange={(e) => setEditCase({ ...editCase, branche: e.target.value } as any)} placeholder="Bijv. Horeca, Retail, Overheid" />
                  </div>
                </div>
                <div>
                  <Label>Beschrijving</Label>
                  <Textarea value={editCase.description || ""} onChange={(e) => setEditCase({ ...editCase, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Afbeelding (in detail pagina)</Label>
                  <FileUpload
                    onUpload={(url) => setEditCase({ ...editCase, image_url: url || null })}
                    currentUrl={editCase.image_url || undefined}
                    folder="klantcases"
                  />
                </div>
                <div>
                  <Label>Headerfoto (overzichtspagina)</Label>
                  <FileUpload
                    onUpload={(url) => setEditCase({ ...editCase, header_image_url: url } as any)}
                    currentUrl={(editCase as any).header_image_url || undefined}
                    folder="klantcases/headers"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={editCase.published ?? false} onCheckedChange={(v) => setEditCase({ ...editCase, published: v })} />
                  <Label>Gepubliceerd</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveCase}>Opslaan</Button>
                  <Button variant="outline" onClick={() => setEditCase(null)}>Annuleren</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {cases.map((c) => (
                <div key={c.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {c.image_url && (
                      <img src={c.image_url} alt={c.title} className="h-12 w-16 rounded object-cover" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{c.title}</span>
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{c.category}</span>
                        {c.published && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Live</span>}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setEditCase(c)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCase(c.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
              {cases.length === 0 && <p className="text-muted-foreground text-center py-8">Geen klantcases gevonden.</p>}
            </div>
          </TabsContent>

          <TabsContent value="paginas" className="mt-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">Pagina's bewerken</h2>
              <p className="text-muted-foreground">
                Klik op een pagina om deze te openen. Als administrator ziet u bij elk bewerkbaar tekstveld een
                <Pencil className="h-3.5 w-3.5 inline mx-1 text-primary" />
                icoon. Klik erop om de tekst direct aan te passen.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className="bg-card border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{p.label}</h3>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{p.path}</p>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
