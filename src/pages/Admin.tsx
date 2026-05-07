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
import { LogOut, Plus, Pencil, Trash2, ExternalLink, FileText, Mail, Settings as SettingsIcon, Shield, Check } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { Database } from "@/integrations/supabase/types";
import { SOCIAL_OPTIONS, SocialLink, SocialPlatform } from "@/hooks/useSocials";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Submission = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
};

type Klantcase = Database["public"]["Tables"]["klantcases"]["Row"];

const pages = [
  { label: "Homepage", path: "/", key: "index" },
  { label: "Gemeenten", path: "/gemeenten", key: "gemeenten" },
  { label: "Commercieel", path: "/commercieel", key: "commercieel" },
  { label: "Spaarsysteem", path: "/spaarsysteem", key: "spaarsysteem" },
  { label: "Klantcases", path: "/klantcases", key: "klantcases" },
  { label: "Support", path: "/support", key: "support" },
  { label: "Over Ons", path: "/over-ons", key: "over-ons" },
  { label: "Contact", path: "/contact", key: "contact" },
  { label: "Demo", path: "/demo", key: "demo" },
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cases, setCases] = useState<Klantcase[]>([]);
  const [editCase, setEditCase] = useState<Partial<Klantcase> | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [savingSocials, setSavingSocials] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openSubmission, setOpenSubmission] = useState<Submission | null>(null);
  const [admins, setAdmins] = useState<{ user_id: string; email: string | null }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

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
    setCurrentUserId(session.user.id);
    fetchCases();
    fetchSocials();
    fetchSubmissions();
    fetchAdmins();
    fetchSettings();
  };

  const fetchCases = async () => {
    const { data } = await supabase.from("klantcases").select("*").order("created_at", { ascending: false });
    if (data) setCases(data);
  };

  const fetchSocials = async () => {
    const { data } = await supabase
      .from("page_content")
      .select("content")
      .eq("page", "settings")
      .eq("key", "socials")
      .maybeSingle();
    try {
      const parsed = data?.content ? JSON.parse(data.content) : [];
      setSocials(Array.isArray(parsed) ? parsed : []);
    } catch {
      setSocials([]);
    }
  };

  const saveSocials = async () => {
    setSavingSocials(true);
    const cleaned = socials.filter((s) => s.url.trim());
    const { error } = await supabase
      .from("page_content")
      .upsert(
        { page: "settings", key: "socials", content: JSON.stringify(cleaned) },
        { onConflict: "page,key" }
      );
    setSavingSocials(false);
    if (error) {
      toast({ title: "Fout bij opslaan", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Social media opgeslagen" });
      fetchSocials();
    }
  };

  const fetchSubmissions = async () => {
    const { data } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setSubmissions(data as Submission[]);
  };

  const markRead = async (id: string, read: boolean) => {
    await supabase.from("contact_submissions").update({ read }).eq("id", id);
    fetchSubmissions();
  };

  const deleteSubmission = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    setOpenSubmission(null);
    fetchSubmissions();
  };

  const fetchAdmins = async () => {
    const { data, error } = await supabase.functions.invoke("manage-admins", { body: { action: "list" } });
    if (!error && data?.admins) setAdmins(data.admins);
  };

  const addAdmin = async () => {
    if (!newAdminEmail.trim()) return;
    const { data, error } = await supabase.functions.invoke("manage-admins", {
      body: {
        action: "add",
        email: newAdminEmail.trim(),
        redirectTo: `${window.location.origin}/admin/activeren`,
      },
    });
    if (error || data?.error) {
      toast({ title: "Toevoegen mislukt", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Uitnodiging verstuurd", description: "De beheerder ontvangt een activatiemail." });
    setNewAdminEmail("");
    fetchAdmins();
  };

  const removeAdmin = async (user_id: string) => {
    const { data, error } = await supabase.functions.invoke("manage-admins", {
      body: { action: "remove", user_id },
    });
    if (error || data?.error) {
      toast({ title: "Verwijderen mislukt", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Beheerder verwijderd" });
    fetchAdmins();
  };

  const fetchSettings = async () => {
    const { data } = await supabase
      .from("page_content")
      .select("key,content")
      .eq("page", "settings")
      .in("key", ["notify_email", "notify_enabled"]);
    const map = Object.fromEntries((data || []).map((r) => [r.key, r.content]));
    setNotifyEmail(map["notify_email"] || "");
    setNotifyEnabled(map["notify_enabled"] === "true");
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const rows = [
      { page: "settings", key: "notify_email", content: notifyEmail.trim() },
      { page: "settings", key: "notify_enabled", content: notifyEnabled ? "true" : "false" },
    ];
    const { error } = await supabase.from("page_content").upsert(rows, { onConflict: "page,key" });
    setSavingSettings(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Instellingen opgeslagen" });
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

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
      video_url: (editCase as any).video_url || null,
      cta_label: (editCase as any).cta_label || null,
      cta_url: (editCase as any).cta_url || null,
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
            <TabsTrigger value="socials">Social media</TabsTrigger>
            <TabsTrigger value="aanvragen">
              Aanvragen{unreadCount > 0 && <span className="ml-1.5 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">{unreadCount}</span>}
            </TabsTrigger>
            <TabsTrigger value="instellingen">Instellingen</TabsTrigger>
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
                <div>
                  <Label>Video URL (YouTube/Vimeo)</Label>
                  <Input
                    value={(editCase as any).video_url || ""}
                    onChange={(e) => setEditCase({ ...editCase, video_url: e.target.value } as any)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Knoptekst (CTA)</Label>
                    <Input
                      value={(editCase as any).cta_label || ""}
                      onChange={(e) => setEditCase({ ...editCase, cta_label: e.target.value } as any)}
                      placeholder="Bijv. Bezoek website"
                    />
                  </div>
                  <div>
                    <Label>Knop-URL</Label>
                    <Input
                      value={(editCase as any).cta_url || ""}
                      onChange={(e) => setEditCase({ ...editCase, cta_url: e.target.value } as any)}
                      placeholder="https://..."
                    />
                  </div>
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
                <div
                  key={p.path}
                  className="bg-card border rounded-lg p-5 hover:shadow-md hover:border-primary/30 transition-all group relative"
                >
                  <Link to={p.path} className="block">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{p.label}</h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{p.path}</p>
                  </Link>
                  <Link
                    to={`/admin/pages/builtin/${p.key}`}
                    title="Open in paginabouwer"
                    className="absolute top-2 right-10 inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted text-muted-foreground hover:text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="socials" className="mt-6">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Social media</h2>
                <p className="text-muted-foreground text-sm">
                  Deze links verschijnen in de footer en op de contactpagina.
                </p>
              </div>

              <div className="space-y-3">
                {socials.map((s, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Select
                      value={s.platform}
                      onValueChange={(v) => {
                        const next = [...socials];
                        next[i] = { ...next[i], platform: v as SocialPlatform };
                        setSocials(next);
                      }}
                    >
                      <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SOCIAL_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="https://..."
                      value={s.url}
                      onChange={(e) => {
                        const next = [...socials];
                        next[i] = { ...next[i], url: e.target.value };
                        setSocials(next);
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSocials(socials.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {socials.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nog geen social media links toegevoegd.</p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSocials([...socials, { platform: "linkedin", url: "" }])}
                >
                  <Plus className="h-4 w-4 mr-1" /> Toevoegen
                </Button>
                <Button size="sm" onClick={saveSocials} disabled={savingSocials}>
                  {savingSocials ? "Opslaan..." : "Opslaan"}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="aanvragen" className="mt-6">
            <div className="bg-card border rounded-lg">
              <div className="p-5 border-b flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Contactaanvragen</h2>
                <span className="ml-auto text-sm text-muted-foreground">{submissions.length} totaal · {unreadCount} ongelezen</span>
              </div>
              {submissions.length === 0 ? (
                <p className="p-8 text-center text-muted-foreground">Nog geen formulieren ingevuld.</p>
              ) : (
                <ul className="divide-y">
                  {submissions.map((s) => (
                    <li key={s.id} className={`p-4 flex items-start gap-3 hover:bg-muted/40 cursor-pointer ${!s.read ? "bg-primary/5" : ""}`} onClick={() => { setOpenSubmission(s); if (!s.read) markRead(s.id, true); }}>
                      <div className={`mt-1.5 h-2 w-2 rounded-full ${!s.read ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold truncate">{s.name}</span>
                          <span className="text-xs text-muted-foreground truncate">&lt;{s.email}&gt;</span>
                        </div>
                        <p className="text-sm font-medium truncate">{s.subject}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{s.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(s.created_at).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {openSubmission && (
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpenSubmission(null)}>
                <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-5 border-b flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">{openSubmission.subject}</h3>
                      <p className="text-sm text-muted-foreground">
                        {openSubmission.name} &lt;<a href={`mailto:${openSubmission.email}`} className="text-primary hover:underline">{openSubmission.email}</a>&gt;
                        {openSubmission.company && <> · {openSubmission.company}</>}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(openSubmission.created_at).toLocaleString("nl-NL")}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setOpenSubmission(null)}>Sluiten</Button>
                  </div>
                  <div className="p-5 whitespace-pre-wrap text-sm leading-relaxed">{openSubmission.message}</div>
                  <div className="p-5 border-t flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => markRead(openSubmission.id, !openSubmission.read)}>
                      Markeer als {openSubmission.read ? "ongelezen" : "gelezen"}
                    </Button>
                    <a href={`mailto:${openSubmission.email}?subject=Re: ${encodeURIComponent(openSubmission.subject)}`}>
                      <Button size="sm">Beantwoorden</Button>
                    </a>
                    <Button variant="destructive" size="sm" onClick={() => deleteSubmission(openSubmission.id)}>
                      <Trash2 className="h-4 w-4 mr-1" /> Verwijderen
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="instellingen" className="mt-6 space-y-6">
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Notificaties</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Ontvang een melding wanneer iemand het contactformulier invult.
              </p>
              <div className="flex items-center gap-3">
                <Switch checked={notifyEnabled} onCheckedChange={setNotifyEnabled} />
                <Label>E-mailmeldingen ontvangen bij nieuwe aanvragen</Label>
              </div>
              <div>
                <Label>Notificatie e-mailadres</Label>
                <Input
                  type="email"
                  placeholder="info@loyaltygroup.nl"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  disabled={!notifyEnabled}
                />
                <p className="text-[11px] text-muted-foreground mt-1">
                  Tip: nieuwe aanvragen verschijnen altijd in het tabblad "Aanvragen", ook zonder mailmelding.
                </p>
              </div>
              <Button size="sm" onClick={saveSettings} disabled={savingSettings}>
                {savingSettings ? "Opslaan..." : "Instellingen opslaan"}
              </Button>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Beheerders</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Voeg een nieuwe beheerder toe via e-mailadres. De persoon ontvangt automatisch een activatiemail om een wachtwoord in te stellen (min. 10 tekens, 1 cijfer en 1 speciaal teken).
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@voorbeeld.nl"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addAdmin(); }}
                />
                <Button onClick={addAdmin}><Plus className="h-4 w-4 mr-1" /> Toevoegen</Button>
              </div>
              <div className="space-y-2">
                {admins.map((a) => (
                  <div key={a.user_id} className="flex items-center justify-between border rounded-md p-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      <span className="text-sm">{a.email || a.user_id}</span>
                      {a.user_id === currentUserId && <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">jij</span>}
                    </div>
                    {a.user_id !== currentUserId && (
                      <Button variant="ghost" size="sm" onClick={() => removeAdmin(a.user_id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {admins.length === 0 && <p className="text-sm text-muted-foreground">Nog geen beheerders.</p>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
