import { useMemo, useState } from "react";
import * as LucideIcons from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import FileUpload from "@/components/FileUpload";

interface IconPickerProps {
  icon?: string;
  iconImage?: string;
  iconColor?: string;
  onChange: (val: { icon?: string; iconImage?: string; iconColor?: string }) => void;
}

const PRESET_COLORS = [
  "#0784b6", "#08abd8", "#0f172a", "#ffffff", "#64748b",
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899",
];

// Build a list of all Lucide icon component names (PascalCase exports).
const ALL_ICON_NAMES: string[] = Object.keys(LucideIcons).filter((k) => {
  if (!/^[A-Z]/.test(k)) return false;
  if (k.endsWith("Icon")) return false; // skip aliases ending in Icon
  if (["Icon", "LucideIcon", "createLucideIcon"].includes(k)) return false;
  const v: any = (LucideIcons as any)[k];
  return typeof v === "object" || typeof v === "function";
}).sort();

const IconPicker = ({ icon, iconImage, iconColor, onChange }: IconPickerProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(200);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ALL_ICON_NAMES;
    return ALL_ICON_NAMES.filter((n) => n.toLowerCase().includes(q));
  }, [search]);

  const CurrentIcon = icon ? (LucideIcons as any)[icon] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div
          className="h-12 w-12 rounded-md border flex items-center justify-center bg-muted/30 overflow-hidden shrink-0"
          style={{ color: iconColor || undefined }}
        >
          {iconImage ? (
            <img src={iconImage} alt="" className="h-full w-full object-contain" />
          ) : CurrentIcon ? (
            <CurrentIcon className="h-6 w-6" />
          ) : (
            <span className="text-[10px] text-muted-foreground">geen</span>
          )}
        </div>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setLimit(200); }}>
          <DialogTrigger asChild>
            <Button type="button" variant="outline" size="sm">Kies icoon</Button>
          </DialogTrigger>
          {(icon || iconImage) && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onChange({ icon: "", iconImage: "", iconColor })}
              title="Verwijder"
            >
              <X className="h-4 w-4" />
            </Button>
          )}

          <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Icoon kiezen</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue={iconImage ? "upload" : "library"} className="flex-1 flex flex-col overflow-hidden">
              <TabsList>
                <TabsTrigger value="library">Bibliotheek</TabsTrigger>
                <TabsTrigger value="upload">Eigen upload</TabsTrigger>
                <TabsTrigger value="color">Kleur</TabsTrigger>
              </TabsList>

              <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col space-y-3 mt-3">
                <Input
                  placeholder="Zoek icoon… (bv. star, arrow, mail)"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setLimit(200); }}
                />
                <div className="text-xs text-muted-foreground">{filtered.length} iconen</div>
                <div className="overflow-y-auto flex-1 border rounded-md p-2">
                  <div className="grid grid-cols-8 sm:grid-cols-10 gap-1">
                    {filtered.slice(0, limit).map((name) => {
                      const I: any = (LucideIcons as any)[name];
                      const active = icon === name && !iconImage;
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => {
                            onChange({ icon: name, iconImage: "", iconColor });
                            setOpen(false);
                          }}
                          title={name}
                          className={`aspect-square flex items-center justify-center rounded border hover:bg-accent transition-colors ${active ? "border-primary bg-accent" : "border-transparent"}`}
                          style={{ color: iconColor || undefined }}
                        >
                          <I className="h-5 w-5" />
                        </button>
                      );
                    })}
                  </div>
                  {filtered.length > limit && (
                    <div className="flex justify-center mt-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => setLimit((l) => l + 400)}>
                        Toon meer
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-3 space-y-2">
                <p className="text-xs text-muted-foreground">Upload een eigen icoon (PNG/SVG/JPG). Dit overschrijft de bibliotheekselectie.</p>
                <FileUpload
                  folder="page-icons"
                  currentUrl={iconImage}
                  onUpload={(url) => onChange({ icon: "", iconImage: url || "", iconColor })}
                />
              </TabsContent>

              <TabsContent value="color" className="mt-3 space-y-3">
                <p className="text-xs text-muted-foreground">Kies een kleur (alleen actief voor bibliotheek-iconen).</p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onChange({ icon, iconImage, iconColor: c })}
                      className={`h-8 w-8 rounded-full border-2 ${iconColor === c ? "border-foreground" : "border-border"}`}
                      style={{ background: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={iconColor && iconColor.startsWith("#") ? iconColor : "#0784b6"}
                    onChange={(e) => onChange({ icon, iconImage, iconColor: e.target.value })}
                    className="h-9 w-12 rounded border cursor-pointer"
                  />
                  <Input
                    value={iconColor || ""}
                    placeholder="#0784b6 of hsl(...)"
                    onChange={(e) => onChange({ icon, iconImage, iconColor: e.target.value })}
                  />
                  {iconColor && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => onChange({ icon, iconImage, iconColor: "" })}>
                      Reset
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>
      <div className="text-[11px] text-muted-foreground truncate">
        {iconImage ? "Eigen upload" : icon ? `Lucide: ${icon}` : "Geen icoon geselecteerd"}
      </div>
    </div>
  );
};

export default IconPicker;