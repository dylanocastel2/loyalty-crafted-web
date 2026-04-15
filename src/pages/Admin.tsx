import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Klantcase = Database["public"]["Tables"]["klantcases"]["Row"];
type PageContent = Database["public"]["Tables"]["page_content"]["Row"];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Klantcases state
  const [cases, setCases] = useState<Klantcase[]>([]);
  const [editCase, setEditCase] = useState<Partial<Klantcase> | null>(null);

  // Page content state
  const [contents, setContents] = useState<PageContent[]>([]);
  const [editContent, setEditContent] = useState<Partial<PageContent> | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }
    // Check admin role
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
    fetchContents();
  };

  const fetchCases = async () => {
    const { data } = await supabase.from("klantcases").select("*").order("created_at", { ascending: false });
    if (data) setCases(data);
  };

  const fetchContents = async () => {
    const { data } = await supabase.from("page_content").select("*").order("page");
    if (data) setContents(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const saveCase = async () => {
    if (!editCase?.title) return;
    if (editCase.id) {
      await supabase.from("klantcases").update({
        title: editCase.title,
        description: editCase.description || "",
        category: editCase.category || "Gemeenten",
        image_url: editCase.image_url || null,
        published: editCase.published ?? false,
      }).eq("id", editCase.id);
    } else {
      await supabase.from("klantcases").insert({
        title: editCase.title,
        description: editCase.description || "",
        category: editCase.category || "Gemeenten",
        image_url: editCase.image_url || null,
        published: editCase.published ?? false,
      });
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

  const saveContent = async () => {
    if (!editContent?.page || !editContent?.key) return;
    if (editContent.id) {
      await supabase.from("page_content").update({ content: editContent.content || "" }).eq("id", editContent.id);
    } else {
      await supabase.from("page_content").insert({
        page: editContent.page,
        key: editContent.key,
        content: editContent.content || "",
      });
    }
    setEditContent(null);
    fetchContents();
    toast({ title: "Opgeslagen" });
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
            <TabsTrigger value="content">Pagina-inhoud</TabsTrigger>
          </TabsList>

          <TabsContent value="klantcases" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Klantcases</h2>
              <Button size="sm" onClick={() => setEditCase({ title: "", description: "", category: "Gemeenten", published: false })}>
                <Plus className="h-4 w-4 mr-1" /> Nieuw
              </Button>
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
                </div>
                <div>
                  <Label>Beschrijving</Label>
                  <Textarea value={editCase.description || ""} onChange={(e) => setEditCase({ ...editCase, description: e.target.value })} rows={3} />
                </div>
                <div>
                  <Label>Afbeelding URL</Label>
                  <Input value={editCase.image_url || ""} onChange={(e) => setEditCase({ ...editCase, image_url: e.target.value })} />
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
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c.title}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{c.category}</span>
                      {c.published && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Live</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.description}</p>
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

          <TabsContent value="content" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Pagina-inhoud</h2>
              <Button size="sm" onClick={() => setEditContent({ page: "", key: "", content: "" })}>
                <Plus className="h-4 w-4 mr-1" /> Nieuw
              </Button>
            </div>

            {editContent && (
              <div className="bg-card border rounded-lg p-6 mb-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Pagina</Label>
                    <Input value={editContent.page || ""} onChange={(e) => setEditContent({ ...editContent, page: e.target.value })} placeholder="bijv. homepage" />
                  </div>
                  <div>
                    <Label>Sleutel</Label>
                    <Input value={editContent.key || ""} onChange={(e) => setEditContent({ ...editContent, key: e.target.value })} placeholder="bijv. hero_title" />
                  </div>
                </div>
                <div>
                  <Label>Inhoud</Label>
                  <Textarea value={editContent.content || ""} onChange={(e) => setEditContent({ ...editContent, content: e.target.value })} rows={4} />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveContent}>Opslaan</Button>
                  <Button variant="outline" onClick={() => setEditContent(null)}>Annuleren</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {contents.map((c) => (
                <div key={c.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">{c.page}</span>
                      <span className="font-semibold">{c.key}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{c.content}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setEditContent(c)}><Pencil className="h-4 w-4" /></Button>
                </div>
              ))}
              {contents.length === 0 && <p className="text-muted-foreground text-center py-8">Geen pagina-inhoud gevonden.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
