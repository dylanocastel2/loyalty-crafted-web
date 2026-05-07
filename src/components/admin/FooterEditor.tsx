import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ArrowUp, ArrowDown, RotateCcw } from "lucide-react";
import {
  DEFAULT_FOOTER_CONFIG,
  FooterConfig,
  FooterColumn,
  FooterItem,
  fetchFooterConfig,
} from "@/hooks/useFooterConfig";
import Footer from "@/components/layout/Footer";

const THEME_COLORS: { label: string; value: string }[] = [
  { label: "Wit", value: "#ffffff" },
  { label: "Achtergrond", value: "hsl(210 33% 99%)" },
  { label: "Surface (lichtblauw)", value: "hsl(198 60% 96%)" },
  { label: "Surface 2", value: "hsl(198 50% 92%)" },
  { label: "Muted", value: "hsl(198 45% 96%)" },
  { label: "Accent", value: "hsl(198 60% 93%)" },
  { label: "Primair (#0784b6)", value: "hsl(196 91% 37%)" },
  { label: "Secundair (#08abd8)", value: "hsl(193 91% 44%)" },
  { label: "Donker (foreground)", value: "hsl(210 20% 15%)" },
  { label: "Zwart", value: "#000000" },
];

type ColorMode = "default" | "theme" | "custom";

const detectMode = (val: string | undefined): ColorMode => {
  if (!val) return "default";
  if (THEME_COLORS.some((c) => c.value === val)) return "theme";
  return "custom";
};

const ColorChooser = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | undefined;
  onChange: (v: string) => void;
}) => {
  const mode = detectMode(value);
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={mode === "default" ? "default" : "outline"}
          onClick={() => onChange("")}
        >
          Standaard
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "theme" ? "default" : "outline"}
          onClick={() => onChange(THEME_COLORS[0].value)}
        >
          Themakleur
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "custom" ? "default" : "outline"}
          onClick={() => onChange("#0784b6")}
        >
          Eigen kleur
        </Button>
      </div>

      {mode === "theme" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
          {THEME_COLORS.map((c) => {
            const active = value === c.value;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => onChange(c.value)}
                className={`flex items-center gap-2 rounded-md border px-2 py-1.5 text-xs text-left hover:border-primary transition-colors ${
                  active ? "border-primary ring-2 ring-primary/30" : "border-border"
                }`}
              >
                <span
                  className="h-5 w-5 rounded border border-border shrink-0"
                  style={{ background: c.value }}
                />
                <span className="truncate">{c.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {mode === "custom" && (
        <div className="flex gap-2 items-center pt-1">
          <input
            type="color"
            value={value && value.startsWith("#") ? value : "#0784b6"}
            onChange={(e) => onChange(e.target.value)}
            className="h-10 w-14 rounded border cursor-pointer bg-transparent"
          />
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#0784b6 of hsl(...) of rgb(...)"
          />
        </div>
      )}
    </div>
  );
};

const newItem = (type: FooterItem["type"]): FooterItem => {
  if (type === "text") return { type: "text", text: "Nieuwe tekst" };
  if (type === "button") return { type: "button", label: "Knop", url: "/" };
  return { type: "link", label: "Nieuwe link", url: "/" };
};

const FooterEditor = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFooterConfig().then((c) => {
      setConfig(c);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("page_content")
      .upsert(
        { page: "settings", key: "footer", content: JSON.stringify(config) },
        { onConflict: "page,key" }
      );
    setSaving(false);
    if (error) {
      toast({ title: "Opslaan mislukt", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Footer opgeslagen" });
    }
  };

  const reset = () => {
    if (confirm("Weet je zeker dat je de footer wilt resetten naar de standaardinstellingen?")) {
      setConfig(DEFAULT_FOOTER_CONFIG);
    }
  };

  const updateColumn = (idx: number, patch: Partial<FooterColumn>) => {
    const next = [...config.columns];
    next[idx] = { ...next[idx], ...patch };
    setConfig({ ...config, columns: next });
  };

  const moveColumn = (idx: number, dir: -1 | 1) => {
    const next = [...config.columns];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setConfig({ ...config, columns: next });
  };

  const removeColumn = (idx: number) => {
    setConfig({ ...config, columns: config.columns.filter((_, i) => i !== idx) });
  };

  const addColumn = () => {
    setConfig({
      ...config,
      columns: [...config.columns, { title: "Nieuwe kolom", items: [] }],
    });
  };

  const updateItem = (colIdx: number, itemIdx: number, item: FooterItem) => {
    const items = [...config.columns[colIdx].items];
    items[itemIdx] = item;
    updateColumn(colIdx, { items });
  };

  const moveItem = (colIdx: number, itemIdx: number, dir: -1 | 1) => {
    const items = [...config.columns[colIdx].items];
    const target = itemIdx + dir;
    if (target < 0 || target >= items.length) return;
    [items[itemIdx], items[target]] = [items[target], items[itemIdx]];
    updateColumn(colIdx, { items });
  };

  const removeItem = (colIdx: number, itemIdx: number) => {
    updateColumn(colIdx, { items: config.columns[colIdx].items.filter((_, i) => i !== itemIdx) });
  };

  const addItem = (colIdx: number, type: FooterItem["type"]) => {
    updateColumn(colIdx, { items: [...config.columns[colIdx].items, newItem(type)] });
  };

  if (loading) return <div className="text-sm text-muted-foreground">Laden...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <div>
          <h2 className="text-xl font-bold mb-1">Footer instellingen</h2>
          <p className="text-muted-foreground text-sm">
            Pas de tekst, kolommen en links in de footer aan. Wijzigingen verschijnen direct op de site.
          </p>
        </div>

        <div>
          <Label>Bedrijfstekst (onder logo)</Label>
          <Textarea
            value={config.brandText}
            onChange={(e) => setConfig({ ...config, brandText: e.target.value })}
            rows={3}
          />
        </div>

        <div className="flex items-center gap-3">
          <Switch
            checked={config.showSocials}
            onCheckedChange={(v) => setConfig({ ...config, showSocials: v })}
          />
          <Label>Social media iconen tonen onder bedrijfstekst</Label>
        </div>

        <div>
          <Label>Copyright tekst</Label>
          <Input
            value={config.copyright}
            onChange={(e) => setConfig({ ...config, copyright: e.target.value })}
            placeholder="© {year} Bedrijfsnaam"
          />
          <p className="text-[11px] text-muted-foreground mt-1">
            Gebruik {"{year}"} voor het huidige jaar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
          <ColorChooser
            label="Achtergrondkleur"
            value={config.bgColor}
            onChange={(v) => setConfig({ ...config, bgColor: v })}
          />
          <ColorChooser
            label="Tekstkleur"
            value={config.textColor}
            onChange={(v) => setConfig({ ...config, textColor: v })}
          />
          <ColorChooser
            label="Linkkleur"
            value={config.linkColor}
            onChange={(v) => setConfig({ ...config, linkColor: v })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Kolommen ({config.columns.length})</h3>
          <Button size="sm" variant="outline" onClick={addColumn}>
            <Plus className="h-4 w-4 mr-1" /> Kolom toevoegen
          </Button>
        </div>

        {config.columns.map((col, colIdx) => (
          <div key={colIdx} className="bg-card border rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Input
                value={col.title}
                onChange={(e) => updateColumn(colIdx, { title: e.target.value })}
                placeholder="Kolomtitel"
                className="font-semibold"
              />
              <Button variant="ghost" size="icon" onClick={() => moveColumn(colIdx, -1)} disabled={colIdx === 0}>
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveColumn(colIdx, 1)} disabled={colIdx === config.columns.length - 1}>
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeColumn(colIdx)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-muted">
              {col.items.map((item, itemIdx) => (
                <div key={itemIdx} className="flex gap-2 items-start bg-muted/30 rounded-md p-2">
                  <Select
                    value={item.type}
                    onValueChange={(v) => {
                      const t = v as FooterItem["type"];
                      updateItem(colIdx, itemIdx, newItem(t));
                    }}
                  >
                    <SelectTrigger className="w-28 shrink-0"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="link">Link</SelectItem>
                      <SelectItem value="text">Tekst</SelectItem>
                      <SelectItem value="button">Knop</SelectItem>
                    </SelectContent>
                  </Select>

                  {item.type === "text" ? (
                    <Input
                      value={item.text}
                      onChange={(e) => updateItem(colIdx, itemIdx, { ...item, text: e.target.value })}
                      placeholder="Tekst"
                    />
                  ) : (
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input
                        value={item.label}
                        onChange={(e) => updateItem(colIdx, itemIdx, { ...item, label: e.target.value })}
                        placeholder="Label"
                      />
                      <Input
                        value={item.url}
                        onChange={(e) => updateItem(colIdx, itemIdx, { ...item, url: e.target.value })}
                        placeholder="/pad of https://..."
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(colIdx, itemIdx, -1)} disabled={itemIdx === 0}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveItem(colIdx, itemIdx, 1)} disabled={itemIdx === col.items.length - 1}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(colIdx, itemIdx)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2 pt-1">
                <Button size="sm" variant="outline" onClick={() => addItem(colIdx, "link")}>
                  <Plus className="h-3 w-3 mr-1" /> Link
                </Button>
                <Button size="sm" variant="outline" onClick={() => addItem(colIdx, "text")}>
                  <Plus className="h-3 w-3 mr-1" /> Tekst
                </Button>
                <Button size="sm" variant="outline" onClick={() => addItem(colIdx, "button")}>
                  <Plus className="h-3 w-3 mr-1" /> Knop
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 sticky bottom-0 bg-background/95 backdrop-blur-sm py-3 border-t">
        <Button onClick={save} disabled={saving}>
          {saving ? "Opslaan..." : "Footer opslaan"}
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="h-4 w-4 mr-1" /> Resetten naar standaard
        </Button>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-bold">Live preview</h3>
        <p className="text-sm text-muted-foreground">
          Zo ziet de footer er met de huidige instellingen uit. Klik op "Footer opslaan" om publiekelijk door te voeren.
        </p>
        <div className="border rounded-lg overflow-hidden bg-background">
          <Footer configOverride={config} />
        </div>
      </div>
    </div>
  );
};

export default FooterEditor;
