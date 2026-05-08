import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, MessageSquare } from "lucide-react";

type Option = { label: string; next?: string | null };
type Question = {
  id: string;
  type: "choice" | "text";
  label: string;
  placeholder?: string;
  options?: Option[];
};
type Config = {
  id: string;
  name: string;
  enabled: boolean;
  title: string;
  delay_seconds: number;
  frequency: "once" | "session" | "always";
  show_on_pages: string[];
  questions: Question[];
};

type Response = {
  id: string;
  created_at: string;
  page_path: string | null;
  answers: { question: string; answer: string }[];
};

const newId = () => "q_" + Math.random().toString(36).slice(2, 8);

export default function PopupEditor() {
  const { toast } = useToast();
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [pagesText, setPagesText] = useState("*");

  const load = async () => {
    const { data } = await supabase
      .from("popup_configs")
      .select("*")
      .eq("is_active", true)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      const cfg = data as unknown as Config;
      setConfig(cfg);
      setPagesText((cfg.show_on_pages || []).join(", "));
    } else {
      // No config yet, make a default
      const { data: created } = await supabase
        .from("popup_configs")
        .insert([
          {
            name: "Standaard pop-up",
            enabled: false,
            title: "Heeft u gevonden wat u zocht?",
            delay_seconds: 5,
            frequency: "session",
            show_on_pages: ["*"],
            questions: [],
          },
        ])
        .select("*")
        .single();
      if (created) setConfig(created as unknown as Config);
    }
    setLoading(false);
  };

  const loadResponses = async () => {
    const { data } = await supabase
      .from("popup_responses")
      .select("id, created_at, page_path, answers")
      .order("created_at", { ascending: false })
      .limit(500);
    if (data) setResponses(data as unknown as Response[]);
  };

  useEffect(() => {
    load();
    loadResponses();
  }, []);

  const save = async () => {
    if (!config) return;
    setSaving(true);
    const pages = pagesText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const { error } = await supabase
      .from("popup_configs")
      .update({
        name: config.name,
        enabled: config.enabled,
        title: config.title,
        delay_seconds: config.delay_seconds,
        frequency: config.frequency,
        show_on_pages: pages.length ? pages : ["*"],
        questions: config.questions as unknown as any,
      })
      .eq("id", config.id);
    setSaving(false);
    if (error) toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    else toast({ title: "Pop-up opgeslagen" });
  };

  const updateQ = (idx: number, patch: Partial<Question>) => {
    if (!config) return;
    const next = [...config.questions];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, questions: next });
  };

  const removeQ = (idx: number) => {
    if (!config) return;
    setConfig({ ...config, questions: config.questions.filter((_, i) => i !== idx) });
  };

  const addQ = (type: "choice" | "text") => {
    if (!config) return;
    const q: Question =
      type === "choice"
        ? { id: newId(), type, label: "Nieuwe vraag", options: [{ label: "Ja" }, { label: "Nee" }] }
        : { id: newId(), type, label: "Nieuwe vraag", placeholder: "Uw antwoord..." };
    setConfig({ ...config, questions: [...config.questions, q] });
  };

  const allQuestionIds = useMemo(() => config?.questions.map((q) => q.id) || [], [config]);

  const deleteResponse = async (id: string) => {
    if (!confirm("Antwoord verwijderen?")) return;
    await supabase.from("popup_responses").delete().eq("id", id);
    loadResponses();
  };

  if (loading || !config) return <p className="text-muted-foreground">Laden...</p>;

  return (
    <Tabs defaultValue="config">
      <TabsList>
        <TabsTrigger value="config">Instellingen</TabsTrigger>
        <TabsTrigger value="results">Resultaten ({responses.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="config" className="mt-4 space-y-6">
        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">Pop-up instellingen</h3>
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={config.enabled} onCheckedChange={(v) => setConfig({ ...config, enabled: v })} />
            <Label>Pop-up actief</Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Naam (intern)</Label>
              <Input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />
            </div>
            <div>
              <Label>Titel (zichtbaar)</Label>
              <Input value={config.title} onChange={(e) => setConfig({ ...config, title: e.target.value })} />
            </div>
            <div>
              <Label>Vertraging (seconden)</Label>
              <Input
                type="number"
                min={0}
                value={config.delay_seconds}
                onChange={(e) => setConfig({ ...config, delay_seconds: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label>Frequentie</Label>
              <Select
                value={config.frequency}
                onValueChange={(v) => setConfig({ ...config, frequency: v as Config["frequency"] })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Eén keer per bezoeker</SelectItem>
                  <SelectItem value="session">Eén keer per sessie</SelectItem>
                  <SelectItem value="always">Altijd tonen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Tonen op pagina's</Label>
            <Input
              value={pagesText}
              onChange={(e) => setPagesText(e.target.value)}
              placeholder="* of /, /contact, /spaarsysteem"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gebruik <code>*</code> voor alle pagina's, of komma-gescheiden paden zoals <code>/, /contact</code>. Pad eindigend op <code>/*</code> matcht alles eronder.
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">Vragen & antwoorden</h3>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => addQ("choice")}>
                <Plus className="h-4 w-4 mr-1" /> Keuzevraag
              </Button>
              <Button size="sm" variant="outline" onClick={() => addQ("text")}>
                <Plus className="h-4 w-4 mr-1" /> Open vraag
              </Button>
            </div>
          </div>

          {config.questions.length === 0 && (
            <p className="text-sm text-muted-foreground">Nog geen vragen. Voeg er één toe om te beginnen.</p>
          )}

          <div className="space-y-4">
            {config.questions.map((q, idx) => (
              <div key={q.id} className="border rounded-md p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider px-2 py-0.5 rounded bg-muted">
                      {idx === 0 ? "Eerste vraag" : `Vraag (id: ${q.id})`}
                    </span>
                    <span className="text-xs text-muted-foreground">{q.type === "choice" ? "Meerkeuze" : "Open antwoord"}</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeQ(idx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Vraag</Label>
                  <Input value={q.label} onChange={(e) => updateQ(idx, { label: e.target.value })} />
                </div>
                {q.type === "text" && (
                  <div>
                    <Label>Placeholder</Label>
                    <Input
                      value={q.placeholder || ""}
                      onChange={(e) => updateQ(idx, { placeholder: e.target.value })}
                    />
                  </div>
                )}
                {q.type === "choice" && (
                  <div className="space-y-2">
                    <Label>Antwoordopties</Label>
                    {(q.options || []).map((opt, oi) => (
                      <div key={oi} className="flex gap-2 items-center">
                        <Input
                          className="flex-1"
                          placeholder="Antwoord"
                          value={opt.label}
                          onChange={(e) => {
                            const opts = [...(q.options || [])];
                            opts[oi] = { ...opts[oi], label: e.target.value };
                            updateQ(idx, { options: opts });
                          }}
                        />
                        <Select
                          value={opt.next || "__end__"}
                          onValueChange={(v) => {
                            const opts = [...(q.options || [])];
                            opts[oi] = { ...opts[oi], next: v === "__end__" ? null : v };
                            updateQ(idx, { options: opts });
                          }}
                        >
                          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__end__">Einde (versturen)</SelectItem>
                            {allQuestionIds
                              .filter((qid) => qid !== q.id)
                              .map((qid) => (
                                <SelectItem key={qid} value={qid}>
                                  Naar: {qid}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const opts = (q.options || []).filter((_, i) => i !== oi);
                            updateQ(idx, { options: opts });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateQ(idx, { options: [...(q.options || []), { label: "Optie" }] })}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Optie toevoegen
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving ? "Opslaan..." : "Pop-up opslaan"}
            </Button>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="results" className="mt-4">
        <div className="bg-card border rounded-lg overflow-hidden">
          <div className="p-4 border-b font-semibold">Pop-up resultaten</div>
          {responses.length === 0 ? (
            <p className="p-8 text-center text-muted-foreground">Nog geen antwoorden binnen.</p>
          ) : (
            <ul className="divide-y">
              {responses.map((r) => (
                <li key={r.id} className="p-4 flex justify-between gap-4">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString("nl-NL")} · {r.page_path || "—"}
                    </div>
                    <div className="space-y-1">
                      {(r.answers || []).map((a, i) => (
                        <div key={i} className="text-sm">
                          <span className="text-muted-foreground">{a.question}: </span>
                          <span className="font-medium">{a.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteResponse(r.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}