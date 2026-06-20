import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import BrancheIcon from "@/components/BrancheIcon";
import { invalidateBranches } from "@/hooks/useBranches";

interface Row {
  id: string;
  slug: string;
  label: string;
  icon: string;
  short_desc: string;
  hero_title: string;
  hero_subtitle: string;
  problems: string[];
  opportunities: string[];
  loyalty_value: string;
  scenarios: { title: string; text: string }[];
  features: { title: string; desc: string }[];
  why_us: { title: string; desc: string }[];
  klantcase_filter: string;
  tone: string;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  published: boolean;
}

const empty: Partial<Row> = {
  slug: "",
  label: "",
  icon: "Building2",
  short_desc: "",
  hero_title: "",
  hero_subtitle: "",
  problems: [],
  opportunities: [],
  loyalty_value: "",
  scenarios: [],
  features: [],
  why_us: [],
  klantcase_filter: "",
  tone: "",
  meta_title: "",
  meta_description: "",
  sort_order: 0,
  published: true,
};

const linesToList = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);
const listToLines = (a: string[]) => (a || []).join("\n");
const jsonOrEmpty = (a: any) => JSON.stringify(a || [], null, 2);

const BranchesPanel = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Partial<Row> | null>(null);
  const [problemsText, setProblemsText] = useState("");
  const [oppsText, setOppsText] = useState("");
  const [scenariosJson, setScenariosJson] = useState("[]");
  const [featuresJson, setFeaturesJson] = useState("[]");
  const [whyJson, setWhyJson] = useState("[]");

  const fetchAll = async () => {
    const { data } = await supabase.from("branches").select("*").order("sort_order");
    setRows((data || []) as unknown as Row[]);
    setLoading(false);
  };
  useEffect(() => {
    fetchAll();
  }, []);

  const openEdit = (r: Partial<Row>) => {
    setEdit({ ...empty, ...r });
    setProblemsText(listToLines(r.problems as string[] || []));
    setOppsText(listToLines(r.opportunities as string[] || []));
    setScenariosJson(jsonOrEmpty(r.scenarios));
    setFeaturesJson(jsonOrEmpty(r.features));
    setWhyJson(jsonOrEmpty(r.why_us));
  };

  const save = async () => {
    if (!edit?.slug || !edit?.label) {
      toast({ title: "Slug en label zijn verplicht", variant: "destructive" });
      return;
    }
    let scenarios: any, features: any, why_us: any;
    try {
      scenarios = JSON.parse(scenariosJson || "[]");
      features = JSON.parse(featuresJson || "[]");
      why_us = JSON.parse(whyJson || "[]");
    } catch (e: any) {
      toast({ title: "Ongeldige JSON in scenarios/features/why_us", description: e.message, variant: "destructive" });
      return;
    }
    const payload: any = {
      slug: edit.slug,
      label: edit.label,
      icon: edit.icon || "Building2",
      short_desc: edit.short_desc || "",
      hero_title: edit.hero_title || "",
      hero_subtitle: edit.hero_subtitle || "",
      problems: linesToList(problemsText),
      opportunities: linesToList(oppsText),
      loyalty_value: edit.loyalty_value || "",
      scenarios,
      features,
      why_us,
      klantcase_filter: edit.klantcase_filter || edit.label,
      tone: edit.tone || "",
      meta_title: edit.meta_title || null,
      meta_description: edit.meta_description || null,
      sort_order: edit.sort_order ?? 0,
      published: edit.published ?? true,
    };
    const { error } = edit.id
      ? await supabase.from("branches").update(payload).eq("id", edit.id)
      : await supabase.from("branches").insert(payload);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Branche opgeslagen" });
    setEdit(null);
    invalidateBranches();
    fetchAll();
  };

  const remove = async (id: string) => {
    if (!confirm("Branche verwijderen?")) return;
    await supabase.from("branches").delete().eq("id", id);
    invalidateBranches();
    fetchAll();
    toast({ title: "Verwijderd" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Branches</h2>
          <p className="text-sm text-muted-foreground">Beheer de inhoud van /branches en /branches/:slug</p>
        </div>
        <Button onClick={() => openEdit(empty)}>
          <Plus className="h-4 w-4 mr-1" /> Nieuwe branche
        </Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-semibold w-12"></th>
              <th className="px-4 py-3 font-semibold">Label</th>
              <th className="px-4 py-3 font-semibold">Slug</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Acties</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t hover:bg-muted/20">
                <td className="px-4 py-3"><BrancheIcon name={r.icon} className="h-5 w-5 text-primary" /></td>
                <td className="px-4 py-3 font-medium">{r.label}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground font-mono">/branches/{r.slug}</td>
                <td className="px-4 py-3 text-sm">
                  {r.published ? (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Live</span>
                  ) : (
                    <span className="text-xs bg-muted px-2 py-0.5 rounded">Concept</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <a href={`/branches/${r.slug}`} target="_blank" rel="noreferrer">
                      <Button variant="ghost" size="icon" title="Bekijken"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                    <Button variant="ghost" size="icon" title="Bewerken" onClick={() => openEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Verwijderen" onClick={() => remove(r.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{edit?.id ? "Branche bewerken" : "Nieuwe branche"}</DialogTitle>
          </DialogHeader>
          {edit && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Slug</Label><Input value={edit.slug || ""} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} placeholder="bv. horeca" /></div>
                <div><Label>Label</Label><Input value={edit.label || ""} onChange={(e) => setEdit({ ...edit, label: e.target.value })} /></div>
                <div><Label>Icoon (Lucide naam)</Label><Input value={edit.icon || ""} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} placeholder="Building2" /></div>
                <div><Label>Klantcase filter</Label><Input value={edit.klantcase_filter || ""} onChange={(e) => setEdit({ ...edit, klantcase_filter: e.target.value })} /></div>
                <div><Label>Tone</Label><Input value={edit.tone || ""} onChange={(e) => setEdit({ ...edit, tone: e.target.value })} /></div>
                <div><Label>Sortering</Label><Input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: parseInt(e.target.value, 10) || 0 })} /></div>
              </div>
              <div><Label>Korte beschrijving</Label><Textarea rows={2} value={edit.short_desc || ""} onChange={(e) => setEdit({ ...edit, short_desc: e.target.value })} /></div>
              <div><Label>Hero titel</Label><Input value={edit.hero_title || ""} onChange={(e) => setEdit({ ...edit, hero_title: e.target.value })} /></div>
              <div><Label>Hero subtitle</Label><Textarea rows={2} value={edit.hero_subtitle || ""} onChange={(e) => setEdit({ ...edit, hero_subtitle: e.target.value })} /></div>
              <div><Label>Problemen (één per regel)</Label><Textarea rows={4} value={problemsText} onChange={(e) => setProblemsText(e.target.value)} /></div>
              <div><Label>Kansen (één per regel)</Label><Textarea rows={4} value={oppsText} onChange={(e) => setOppsText(e.target.value)} /></div>
              <div><Label>Loyalty value (lange tekst)</Label><Textarea rows={4} value={edit.loyalty_value || ""} onChange={(e) => setEdit({ ...edit, loyalty_value: e.target.value })} /></div>
              <div>
                <Label>Scenarios (JSON: <code className="text-xs">[{`{ "title": "...", "text": "..." }`}]</code>)</Label>
                <Textarea rows={6} className="font-mono text-xs" value={scenariosJson} onChange={(e) => setScenariosJson(e.target.value)} />
              </div>
              <div>
                <Label>Features (JSON: <code className="text-xs">[{`{ "title": "...", "desc": "..." }`}]</code>)</Label>
                <Textarea rows={6} className="font-mono text-xs" value={featuresJson} onChange={(e) => setFeaturesJson(e.target.value)} />
              </div>
              <div>
                <Label>Why Us (JSON: <code className="text-xs">[{`{ "title": "...", "desc": "..." }`}]</code>)</Label>
                <Textarea rows={6} className="font-mono text-xs" value={whyJson} onChange={(e) => setWhyJson(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><Label>Meta title</Label><Input value={edit.meta_title || ""} onChange={(e) => setEdit({ ...edit, meta_title: e.target.value })} /></div>
                <div><Label>Meta description</Label><Input value={edit.meta_description || ""} onChange={(e) => setEdit({ ...edit, meta_description: e.target.value })} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={edit.published ?? true} onCheckedChange={(v) => setEdit({ ...edit, published: v })} />
                <Label>Gepubliceerd</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>Annuleren</Button>
            <Button onClick={save}>Opslaan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BranchesPanel;