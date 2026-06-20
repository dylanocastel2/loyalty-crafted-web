import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, ExternalLink, Mail, Shield, Check, X, FileText, Eye, EyeOff, GripVertical, ArrowUp, ArrowDown, LayoutDashboard } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { Database } from "@/integrations/supabase/types";
import { SOCIAL_OPTIONS, SocialLink, SocialPlatform } from "@/hooks/useSocials";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FooterEditor from "@/components/admin/FooterEditor";
import PopupEditor from "@/components/admin/PopupEditor";
import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
import HeatmapPanel from "@/components/admin/HeatmapPanel";
import CmsShell, { CmsSection, type NavSettings } from "@/components/admin/CmsShell";
import DashboardPanel from "@/components/admin/DashboardPanel";
import MediaLibrary from "@/components/admin/MediaLibrary";
import PagesPanel from "@/components/admin/PagesPanel";
import BranchesPanel from "@/components/admin/BranchesPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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

type FormSubmission = {
  id: string;
  form_id: string;
  form_title: string | null;
  page_path: string | null;
  data: Record<string, any>;
  created_at: string;
};

type Klantcase = Database["public"]["Tables"]["klantcases"]["Row"];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [section, setSection] = useState<CmsSection>("dashboard");
  const [cases, setCases] = useState<Klantcase[]>([]);
  const [editCase, setEditCase] = useState<Partial<Klantcase> | null>(null);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [savingSocials, setSavingSocials] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [openSubmission, setOpenSubmission] = useState<Submission | null>(null);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [openFormSubmission, setOpenFormSubmission] = useState<FormSubmission | null>(null);
  const [admins, setAdmins] = useState<{ user_id: string; email: string | null; roles: string[] }[]>([]);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"admin" | "editor" | "viewer">("editor");
  const [myRole, setMyRole] = useState<"admin" | "editor" | "viewer" | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [notifyEmails, setNotifyEmails] = useState<string[]>([]);
  const [newNotifyEmail, setNewNotifyEmail] = useState("");
  const [notifyEnabled, setNotifyEnabled] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [navSettings, setNavSettings] = useState<NavSettings>({
    groups: [
      { label: "Overzicht", items: [{ key: "dashboard", label: "Dashboard" }] },
      { label: "Inhoud", items: [{ key: "pages", label: "Pagina-bouwer" }, { key: "media", label: "Mediabibliotheek" }, { key: "klantcases", label: "Klantcases" }] },
      { label: "Bezoekers", items: [{ key: "aanvragen", label: "Aanvragen" }, { key: "popup", label: "Pop-up" }, { key: "analytics", label: "Analytics" }, { key: "heatmap", label: "Heatmap" }] },
      { label: "Site", items: [{ key: "footer", label: "Footer" }, { key: "socials", label: "Social media" }, { key: "instellingen", label: "Instellingen" }] },
    ],
  });
  const [savingNav, setSavingNav] = useState(false);

  type SiteNavItem = { label: string; path: string; hidden?: boolean };
  const defaultSiteNav: SiteNavItem[] = [
    { label: "SPAARSYSTEEM", path: "/spaarsysteem" },
    { label: "BRANCHES", path: "/branches" },
    { label: "KLANTCASES", path: "/klantcases" },
    { label: "SUPPORT", path: "/support" },
    { label: "OVER ONS", path: "/over-ons" },
    { label: "CONTACT", path: "/contact" },
  ];
  const [siteNav, setSiteNav] = useState<SiteNavItem[]>(defaultSiteNav);
  const [savingSiteNav, setSavingSiteNav] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { navigate("/admin/login"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
    const userRoles = (roles || []).map((r) => r.role as string);
    const allowed = userRoles.some((r) => ["admin", "editor", "viewer"].includes(r));
    if (!allowed) {
      toast({ title: "Geen toegang", description: "U heeft geen beheerdersrechten.", variant: "destructive" });
      await supabase.auth.signOut();
      navigate("/admin/login");
      return;
    }
    const role: "admin" | "editor" | "viewer" =
      userRoles.includes("admin") ? "admin" :
      userRoles.includes("editor") ? "editor" : "viewer";
    setMyRole(role);
    setIsAdmin(true);
    setLoading(false);
    setCurrentUserId(session.user.id);
    fetchCases();
    fetchSocials();
    fetchSubmissions();
    if (role === "admin") fetchAdmins();
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
    const { data: forms } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (forms) setFormSubmissions(forms as any as FormSubmission[]);
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

  const deleteFormSubmission = async (id: string) => {
    await supabase.from("form_submissions").delete().eq("id", id);
    setOpenFormSubmission(null);
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
        role: newAdminRole,
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

  const updateAdminRole = async (user_id: string, role: string) => {
    const { data, error } = await supabase.functions.invoke("manage-admins", {
      body: { action: "update_role", user_id, role },
    });
    if (error || data?.error) {
      toast({ title: "Wijzigen mislukt", description: data?.error || error?.message, variant: "destructive" });
      return;
    }
    toast({ title: "Rang bijgewerkt" });
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
      .in("key", ["notify_email", "notify_enabled", "admin_navigation", "site_navigation"]);
    const map = Object.fromEntries((data || []).map((r) => [r.key, r.content]));
    const raw = map["notify_email"] || "";
    setNotifyEmails(
      raw
        .split(/[,;\n]+/)
        .map((s: string) => s.trim())
        .filter(Boolean)
    );
    setNotifyEnabled(map["notify_enabled"] === "true");
    try {
      const nav: NavSettings = map["admin_navigation"] ? JSON.parse(map["admin_navigation"]) : null;
      if (nav?.groups) setNavSettings(nav);
    } catch {
      // ignore
    }
    try {
      const sn = map["site_navigation"] ? JSON.parse(map["site_navigation"]) : null;
      if (Array.isArray(sn?.items)) setSiteNav(sn.items);
    } catch {
      // ignore
    }
  };

  const saveSettings = async () => {
    setSavingSettings(true);
    const rows = [
      { page: "settings", key: "notify_email", content: notifyEmails.join(", ") },
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

  const saveNavSettings = async () => {
    setSavingNav(true);
    const { error } = await supabase.from("page_content").upsert(
      { page: "settings", key: "admin_navigation", content: JSON.stringify(navSettings) },
      { onConflict: "page,key" }
    );
    setSavingNav(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Navigatie opgeslagen", description: "De sidebar is bijgewerkt. Herlaad de pagina om de wijzigingen te zien." });
  };

  const saveSiteNav = async () => {
    setSavingSiteNav(true);
    const { error } = await supabase.from("page_content").upsert(
      { page: "settings", key: "site_navigation", content: JSON.stringify({ items: siteNav }) },
      { onConflict: "page,key" }
    );
    setSavingSiteNav(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Menubalk opgeslagen", description: "De site-menubalk is bijgewerkt." });
  };

  const addNotifyEmail = () => {
    const v = newNotifyEmail.trim();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      toast({ title: "Ongeldig e-mailadres", variant: "destructive" });
      return;
    }
    if (notifyEmails.includes(v)) return;
    setNotifyEmails([...notifyEmails, v]);
    setNewNotifyEmail("");
  };

  const removeNotifyEmail = (e: string) => {
    setNotifyEmails(notifyEmails.filter((x) => x !== e));
  };

  const unreadCount = submissions.filter((s) => !s.read).length;

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
    <CmsShell active={section} onSelect={setSection} unreadCount={unreadCount}>
      {section === "dashboard" && (
        <DashboardPanel onNavigate={(s) => setSection(s as CmsSection)} />
      )}

      {section === "pages" && <PagesPanel />}

      {section === "branches" && <BranchesPanel />}

      {section === "media" && <MediaLibrary />}

      {section === "klantcases" && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Klantcases</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditCase({ title: "", description: "", category: "Gemeenten", published: false })}>
                <Plus className="h-4 w-4 mr-1" /> Snel toevoegen
              </Button>
              <Link to="/klantcases/nieuw">
                <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nieuwe klantcase</Button>
              </Link>
            </div>
          </div>

          <Dialog open={!!editCase} onOpenChange={(open) => { if (!open) setEditCase(null); }}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editCase?.id ? "Klantcase bewerken" : "Nieuwe klantcase"}</DialogTitle>
              </DialogHeader>
              {editCase && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Titel</Label><Input value={editCase.title || ""} onChange={(e) => setEditCase({ ...editCase, title: e.target.value })} /></div>
                    <div><Label>Categorie</Label><Input value={editCase.category || ""} onChange={(e) => setEditCase({ ...editCase, category: e.target.value })} /></div>
                    <div><Label>Branche</Label><Input value={(editCase as any).branche || ""} onChange={(e) => setEditCase({ ...editCase, branche: e.target.value } as any)} placeholder="Bijv. Horeca, Retail, Overheid" /></div>
                  </div>
                  <div><Label>Beschrijving</Label><Textarea value={editCase.description || ""} onChange={(e) => setEditCase({ ...editCase, description: e.target.value })} rows={3} /></div>
                  <div><Label>Afbeelding (in detail pagina)</Label><FileUpload onUpload={(url) => setEditCase({ ...editCase, image_url: url || null })} currentUrl={editCase.image_url || undefined} folder="klantcases" /></div>
                  <div><Label>Headerfoto (overzichtspagina)</Label><FileUpload onUpload={(url) => setEditCase({ ...editCase, header_image_url: url } as any)} currentUrl={(editCase as any).header_image_url || undefined} folder="klantcases/headers" /></div>
                  <div className="flex items-center gap-2"><Switch checked={editCase.published ?? false} onCheckedChange={(v) => setEditCase({ ...editCase, published: v })} /><Label>Gepubliceerd</Label></div>
                  <div><Label>Video URL (YouTube/Vimeo)</Label><Input value={(editCase as any).video_url || ""} onChange={(e) => setEditCase({ ...editCase, video_url: e.target.value } as any)} placeholder="https://www.youtube.com/watch?v=..." /></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><Label>Knoptekst (CTA)</Label><Input value={(editCase as any).cta_label || ""} onChange={(e) => setEditCase({ ...editCase, cta_label: e.target.value } as any)} placeholder="Bijv. Bezoek website" /></div>
                    <div><Label>Knop-URL</Label><Input value={(editCase as any).cta_url || ""} onChange={(e) => setEditCase({ ...editCase, cta_url: e.target.value } as any)} placeholder="https://..." /></div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditCase(null)}>Annuleren</Button>
                <Button onClick={saveCase}>Opslaan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="space-y-3">
            {cases.map((c) => (
              <div key={c.id} className="bg-card border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {c.image_url && <img src={c.image_url} alt={c.title} className="h-12 w-16 rounded object-cover" />}
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
        </>
      )}

      {section === "socials" && (
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold mb-1">Social media</h2>
            <p className="text-muted-foreground text-sm">Deze links verschijnen in de footer en op de contactpagina.</p>
          </div>
          <div className="space-y-3">
            {socials.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <Select value={s.platform} onValueChange={(v) => { const next = [...socials]; next[i] = { ...next[i], platform: v as SocialPlatform }; setSocials(next); }}>
                  <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                  <SelectContent>{SOCIAL_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                </Select>
                <Input placeholder="https://..." value={s.url} onChange={(e) => { const next = [...socials]; next[i] = { ...next[i], url: e.target.value }; setSocials(next); }} />
                <Button variant="ghost" size="icon" onClick={() => setSocials(socials.filter((_, j) => j !== i))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {socials.length === 0 && <p className="text-sm text-muted-foreground">Nog geen social media links toegevoegd.</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setSocials([...socials, { platform: "linkedin", url: "" }])}><Plus className="h-4 w-4 mr-1" /> Toevoegen</Button>
            <Button size="sm" onClick={saveSocials} disabled={savingSocials}>{savingSocials ? "Opslaan..." : "Opslaan"}</Button>
          </div>
        </div>
      )}

      {section === "footer" && <FooterEditor />}

      {section === "aanvragen" && (
        <>
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
                  <Button variant="outline" size="sm" onClick={() => markRead(openSubmission.id, !openSubmission.read)}>Markeer als {openSubmission.read ? "ongelezen" : "gelezen"}</Button>
                  <a href={`mailto:${openSubmission.email}?subject=Re: ${encodeURIComponent(openSubmission.subject)}`}><Button size="sm">Beantwoorden</Button></a>
                  <Button variant="destructive" size="sm" onClick={() => deleteSubmission(openSubmission.id)}><Trash2 className="h-4 w-4 mr-1" /> Verwijderen</Button>
                </div>
              </div>
            </div>
          )}

          <div className="bg-card border rounded-lg mt-6">
            <div className="p-5 border-b flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Formulier-inzendingen</h2>
              <span className="ml-auto text-sm text-muted-foreground">{formSubmissions.length} totaal</span>
            </div>
            {formSubmissions.length === 0 ? (
              <p className="p-8 text-center text-muted-foreground">Nog geen formulier-inzendingen.</p>
            ) : (
              <ul className="divide-y">
                {formSubmissions.map((s) => {
                  const subj = (s.data && (s.data._subject as string)) || s.form_title || "Formulier";
                  const preview = Object.entries(s.data || {})
                    .filter(([k]) => k !== "_subject")
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v ?? ""}`)
                    .join(" · ");
                  return (
                    <li
                      key={s.id}
                      className="p-4 flex items-start gap-3 hover:bg-muted/40 cursor-pointer"
                      onClick={() => setOpenFormSubmission(s)}
                    >
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary/60" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{subj}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{preview || "—"}</p>
                        {s.page_path && <p className="text-[11px] text-muted-foreground mt-0.5">Pagina: {s.page_path}</p>}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{new Date(s.created_at).toLocaleDateString("nl-NL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {openFormSubmission && (
            <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpenFormSubmission(null)}>
              <div className="bg-card border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-5 border-b flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-lg">
                      {(openFormSubmission.data && (openFormSubmission.data._subject as string)) || openFormSubmission.form_title || "Formulier"}
                    </h3>
                    {openFormSubmission.page_path && (
                      <p className="text-xs text-muted-foreground mt-1">Pagina: {openFormSubmission.page_path}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(openFormSubmission.created_at).toLocaleString("nl-NL")}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setOpenFormSubmission(null)}>Sluiten</Button>
                </div>
                <div className="p-5 space-y-2 text-sm">
                  {Object.entries(openFormSubmission.data || {})
                    .filter(([k]) => k !== "_subject")
                    .map(([k, v]) => (
                      <div key={k} className="grid grid-cols-3 gap-3 border-b last:border-0 pb-2">
                        <div className="font-medium text-muted-foreground">{k}</div>
                        <div className="col-span-2 whitespace-pre-wrap break-words">
                          {Array.isArray(v) ? v.join(", ") : (v == null || v === "" ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v))}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-5 border-t flex gap-2 justify-end">
                  <Button variant="destructive" size="sm" onClick={() => deleteFormSubmission(openFormSubmission.id)}>
                    <Trash2 className="h-4 w-4 mr-1" /> Verwijderen
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {section === "popup" && <PopupEditor />}
      {section === "analytics" && <AnalyticsPanel />}
      {section === "heatmap" && <HeatmapPanel />}

      {section === "instellingen" && (
        <div className="space-y-6">
          <div className="bg-card border rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Notificaties</h2>
            </div>
            <p className="text-sm text-muted-foreground">Ontvang een melding wanneer iemand het contactformulier invult.</p>
            <div className="flex items-center gap-3">
              <Switch checked={notifyEnabled} onCheckedChange={setNotifyEnabled} />
              <Label>E-mailmeldingen ontvangen bij nieuwe aanvragen</Label>
            </div>
            <div className="space-y-2">
              <Label>Notificatie e-mailadressen</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="info@loyaltygroup.nl"
                  value={newNotifyEmail}
                  onChange={(e) => setNewNotifyEmail(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNotifyEmail(); } }}
                  disabled={!notifyEnabled}
                />
                <Button type="button" variant="outline" onClick={addNotifyEmail} disabled={!notifyEnabled}>
                  <Plus className="h-4 w-4 mr-1" /> Toevoegen
                </Button>
              </div>
              {notifyEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {notifyEmails.map((e) => (
                    <span key={e} className="inline-flex items-center gap-1 bg-muted text-foreground text-xs rounded-full pl-3 pr-1 py-1">
                      {e}
                      <button
                        type="button"
                        onClick={() => removeNotifyEmail(e)}
                        className="hover:bg-background rounded-full p-0.5"
                        aria-label={`${e} verwijderen`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">Alle opgegeven adressen ontvangen een melding bij nieuwe formulier-inzendingen. Aanvragen blijven altijd zichtbaar in het tabblad "Aanvragen".</p>
            </div>
            <Button size="sm" onClick={saveSettings} disabled={savingSettings}>{savingSettings ? "Opslaan..." : "Instellingen opslaan"}</Button>
          </div>

          {myRole === "admin" && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Site menubalk</h2>
              </div>
              <p className="text-sm text-muted-foreground">Pas de menu-items op de openbare site aan. Wijzig labels, paden, volgorde of verberg items. Pagina's uit de pagina-bouwer met "Toon in menu" worden automatisch toegevoegd.</p>
              <div className="space-y-2">
                {siteNav.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 border rounded-md p-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <Input
                      className="h-8 text-sm flex-1"
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => setSiteNav(siteNav.map((it, j) => j === i ? { ...it, label: e.target.value } : it))}
                    />
                    <Input
                      className="h-8 text-sm flex-1"
                      placeholder="/pad"
                      value={item.path}
                      onChange={(e) => setSiteNav(siteNav.map((it, j) => j === i ? { ...it, path: e.target.value } : it))}
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => setSiteNav(siteNav.map((it, j) => j === i ? { ...it, hidden: !it.hidden } : it))}
                      title={item.hidden ? "Tonen" : "Verbergen"}>
                      {item.hidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={i === 0}
                      onClick={() => {
                        const arr = [...siteNav];
                        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
                        setSiteNav(arr);
                      }}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" disabled={i === siteNav.length - 1}
                      onClick={() => {
                        const arr = [...siteNav];
                        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                        setSiteNav(arr);
                      }}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8"
                      onClick={() => setSiteNav(siteNav.filter((_, j) => j !== i))}
                      title="Verwijderen">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setSiteNav([...siteNav, { label: "NIEUW", path: "/" }])}>
                  <Plus className="h-4 w-4 mr-1" /> Item toevoegen
                </Button>
                <Button size="sm" onClick={saveSiteNav} disabled={savingSiteNav}>{savingSiteNav ? "Opslaan..." : "Menubalk opslaan"}</Button>
              </div>
            </div>
          )}

          {myRole === "admin" && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Navigatiebalk</h2>
              </div>
              <p className="text-sm text-muted-foreground">Pas groepen en items in de admin sidebar aan. Verberg items of wijzig de weergavenamen.</p>
              <div className="space-y-4">
                {navSettings.groups.map((group, gi) => (
                  <div key={gi} className="border rounded-md p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Input
                        className="h-8 text-sm font-semibold"
                        value={group.label}
                        onChange={(e) => {
                          const next = { ...navSettings, groups: navSettings.groups.map((g, i) => i === gi ? { ...g, label: e.target.value } : g) };
                          setNavSettings(next);
                        }}
                      />
                    </div>
                    <div className="space-y-1">
                      {group.items.map((item, ii) => (
                        <div key={ii} className="flex items-center gap-2">
                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                          <Input
                            className="h-8 text-sm flex-1"
                            value={item.label}
                            onChange={(e) => {
                              const next = { ...navSettings, groups: navSettings.groups.map((g, i) => i === gi ? { ...g, items: g.items.map((it, j) => j === ii ? { ...it, label: e.target.value } : it) } : g) };
                              setNavSettings(next);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              const next = { ...navSettings, groups: navSettings.groups.map((g, i) => i === gi ? { ...g, items: g.items.map((it, j) => j === ii ? { ...it, hidden: !it.hidden } : it) } : g) };
                              setNavSettings(next);
                            }}
                            title={item.hidden ? "Tonen" : "Verbergen"}
                          >
                            {item.hidden ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={ii === 0}
                            onClick={() => {
                              const items = [...group.items];
                              [items[ii - 1], items[ii]] = [items[ii], items[ii - 1]];
                              const next = { ...navSettings, groups: navSettings.groups.map((g, i) => i === gi ? { ...g, items } : g) };
                              setNavSettings(next);
                            }}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            disabled={ii === group.items.length - 1}
                            onClick={() => {
                              const items = [...group.items];
                              [items[ii], items[ii + 1]] = [items[ii + 1], items[ii]];
                              const next = { ...navSettings, groups: navSettings.groups.map((g, i) => i === gi ? { ...g, items } : g) };
                              setNavSettings(next);
                            }}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <Button size="sm" onClick={saveNavSettings} disabled={savingNav}>{savingNav ? "Opslaan..." : "Navigatie opslaan"}</Button>
            </div>
          )}

          {myRole === "admin" && (
            <div className="bg-card border rounded-lg p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">Beheerders</h2>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Voeg een nieuwe beheerder toe en kies een rang. De persoon ontvangt automatisch een activatiemail.</p>
                <ul className="list-disc list-inside text-xs space-y-0.5 pt-1">
                  <li><strong>Hoofdbeheerder</strong> — volledige toegang incl. beheerders beheren.</li>
                  <li><strong>Redacteur</strong> — pagina's, klantcases, footer en social media bewerken.</li>
                  <li><strong>Bekijker</strong> — alleen contactaanvragen lezen.</li>
                </ul>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input type="email" placeholder="email@voorbeeld.nl" value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addAdmin(); }} />
                <Select value={newAdminRole} onValueChange={(v) => setNewAdminRole(v as any)}>
                  <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Hoofdbeheerder</SelectItem>
                    <SelectItem value="editor">Redacteur</SelectItem>
                    <SelectItem value="viewer">Bekijker</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addAdmin}><Plus className="h-4 w-4 mr-1" /> Toevoegen</Button>
              </div>
              <div className="space-y-2">
                {admins.map((a) => {
                  const currentRole: "admin" | "editor" | "viewer" =
                    a.roles.includes("admin") ? "admin" :
                    a.roles.includes("editor") ? "editor" : "viewer";
                  return (
                    <div key={a.user_id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border rounded-md p-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        <span className="text-sm truncate">{a.email || a.user_id}</span>
                        {a.user_id === currentUserId && <span className="text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">jij</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={currentRole} onValueChange={(v) => updateAdminRole(a.user_id, v)} disabled={a.user_id === currentUserId}>
                          <SelectTrigger className="w-40 h-8 text-sm"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Hoofdbeheerder</SelectItem>
                            <SelectItem value="editor">Redacteur</SelectItem>
                            <SelectItem value="viewer">Bekijker</SelectItem>
                          </SelectContent>
                        </Select>
                        {a.user_id !== currentUserId && (
                          <Button variant="ghost" size="sm" onClick={() => removeAdmin(a.user_id)}><Trash2 className="h-4 w-4" /></Button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {admins.length === 0 && <p className="text-sm text-muted-foreground">Nog geen beheerders.</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </CmsShell>
  );
};

export default Admin;
