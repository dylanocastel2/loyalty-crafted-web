import { Block } from "./blockSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import { Plus, Trash2 } from "lucide-react";
import PagePicker from "./PagePicker";
import KlantcasePicker from "./KlantcasePicker";

interface Props {
  block: Block | null;
  onChange: (props: Record<string, any>) => void;
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    {children}
  </div>
);

const BlockInspector = ({ block, onChange }: Props) => {
  if (!block) {
    return (
      <div className="text-center text-muted-foreground text-sm py-12">
        <p>Selecteer een blok om eigenschappen te bewerken</p>
      </div>
    );
  }

  const p = block.props;
  const set = (key: string, value: any) => onChange({ ...p, [key]: value });

  const setItem = (key: string, idx: number, field: string, value: any) => {
    const items = [...(p[key] || [])];
    items[idx] = { ...items[idx], [field]: value };
    set(key, items);
  };
  const addItem = (key: string, template: any) => set(key, [...(p[key] || []), template]);
  const removeItem = (key: string, idx: number) => set(key, (p[key] || []).filter((_: any, i: number) => i !== idx));

  const alignSelect = (
    <Select value={p.align || "left"} onValueChange={(v) => set("align", v)}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>
        <SelectItem value="left">Links</SelectItem>
        <SelectItem value="center">Midden</SelectItem>
        <SelectItem value="right">Rechts</SelectItem>
      </SelectContent>
    </Select>
  );

  const renderFields = () => {
    switch (block.type) {
      case "heading":
        return (
          <>
            <Field label="Tekst"><Input value={p.text || ""} onChange={(e) => set("text", e.target.value)} /></Field>
            <Field label="Niveau">
              <Select value={String(p.level || 2)} onValueChange={(v) => set("level", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                  <SelectItem value="4">H4</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Uitlijning">{alignSelect}</Field>
          </>
        );

      case "paragraph":
        return (
          <>
            <Field label="Tekst"><Textarea value={p.text || ""} onChange={(e) => set("text", e.target.value)} rows={6} /></Field>
            <Field label="Uitlijning">{alignSelect}</Field>
          </>
        );

      case "image":
        return (
          <>
            <Field label="Afbeelding">
              <FileUpload onUpload={(url) => set("url", url || "")} currentUrl={p.url} folder="page-media" />
            </Field>
            <Field label="Alt tekst"><Input value={p.alt || ""} onChange={(e) => set("alt", e.target.value)} /></Field>
            <Field label="Breedte (bv. 100%, 600px)"><Input value={p.width || ""} onChange={(e) => set("width", e.target.value)} /></Field>
            <Field label="Uitlijning">{alignSelect}</Field>
            <div className="pt-3 mt-2 border-t space-y-3">
              <Field label="Gradient overlay">
                <Select value={p.gradientEnabled ? "on" : "off"} onValueChange={(v) => set("gradientEnabled", v === "on")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="off">Uit</SelectItem>
                    <SelectItem value="on">Aan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              {p.gradientEnabled && (
                <>
                  <Field label="Stijl gradient">
                    <Select value={p.gradient || "dark-bottom"} onValueChange={(v) => set("gradient", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dark-bottom">Donker — onderaan</SelectItem>
                        <SelectItem value="dark-top">Donker — bovenaan</SelectItem>
                        <SelectItem value="dark-full">Donker — volledig</SelectItem>
                        <SelectItem value="primary">Aqua merk — diagonaal</SelectItem>
                        <SelectItem value="primary-soft">Aqua merk — subtiel</SelectItem>
                        <SelectItem value="aqua-radial">Aqua glow — hoek</SelectItem>
                        <SelectItem value="white-bottom">Wit — onderaan (lichte tekst)</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Intensiteit (%)">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={p.gradientOpacity ?? 100}
                      onChange={(e) => set("gradientOpacity", Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                    />
                  </Field>
                  <Field label="Tekst over afbeelding (titel)">
                    <Input value={p.overlayTitle || ""} onChange={(e) => set("overlayTitle", e.target.value)} placeholder="Optioneel" />
                  </Field>
                  <Field label="Tekst over afbeelding (ondertitel)">
                    <Textarea value={p.overlayText || ""} onChange={(e) => set("overlayText", e.target.value)} rows={2} placeholder="Optioneel" />
                  </Field>
                  <Field label="Positie tekst (verticaal)">
                    <Select value={p.overlayPosition || "bottom"} onValueChange={(v) => set("overlayPosition", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Boven</SelectItem>
                        <SelectItem value="center">Midden</SelectItem>
                        <SelectItem value="bottom">Onder</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Uitlijning tekst">
                    <Select value={p.overlayAlign || "left"} onValueChange={(v) => set("overlayAlign", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Links</SelectItem>
                        <SelectItem value="center">Midden</SelectItem>
                        <SelectItem value="right">Rechts</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </>
              )}
            </div>
          </>
        );

      case "button":
        return (
          <>
            <Field label="Knoptekst"><Input value={p.label || ""} onChange={(e) => set("label", e.target.value)} /></Field>
            <Field label="Link"><Input value={p.link || ""} onChange={(e) => set("link", e.target.value)} placeholder="/contact of https://..." /></Field>
            <Field label="Stijl">
              <Select value={p.variant || "default"} onValueChange={(v) => set("variant", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="outline">Omlijnd</SelectItem>
                  <SelectItem value="ghost">Subtiel</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Uitlijning">{alignSelect}</Field>
          </>
        );

      case "spacer":
        return (
          <Field label="Hoogte (px)">
            <Input type="number" value={p.height || 40} onChange={(e) => set("height", parseInt(e.target.value) || 0)} />
          </Field>
        );

      case "hero":
        return (
          <>
            <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Subtitel"><Textarea value={p.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} rows={2} /></Field>
            <Field label="Achtergrondafbeelding (optioneel)">
              <FileUpload onUpload={(url) => set("bgImage", url || "")} currentUrl={p.bgImage} folder="page-media" />
            </Field>
            <Field label="Achtergrondkleur (zonder afbeelding)">
              <Select value={p.bgColor || "primary"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tekstkleur">
              <Select value={p.textColor || "light"} onValueChange={(v) => set("textColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Licht</SelectItem>
                  <SelectItem value="dark">Donker</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="CTA knoptekst"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="CTA link"><Input value={p.ctaLink || ""} onChange={(e) => set("ctaLink", e.target.value)} /></Field>
          </>
        );

      case "two_columns":
        return (
          <>
            <Field label="Linker kolom"><Textarea value={p.left || ""} onChange={(e) => set("left", e.target.value)} rows={5} /></Field>
            <Field label="Rechter kolom"><Textarea value={p.right || ""} onChange={(e) => set("right", e.target.value)} rows={5} /></Field>
          </>
        );

      case "three_columns":
        return (
          <>
            <Field label="Kolom 1"><Textarea value={p.col1 || ""} onChange={(e) => set("col1", e.target.value)} rows={4} /></Field>
            <Field label="Kolom 2"><Textarea value={p.col2 || ""} onChange={(e) => set("col2", e.target.value)} rows={4} /></Field>
            <Field label="Kolom 3"><Textarea value={p.col3 || ""} onChange={(e) => set("col3", e.target.value)} rows={4} /></Field>
          </>
        );

      case "container":
        return (
          <>
            <Field label="Inhoud"><Textarea value={p.content || ""} onChange={(e) => set("content", e.target.value)} rows={6} /></Field>
            <Field label="Achtergrondkleur">
              <Select value={p.bgColor || "muted"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                  <SelectItem value="card">Wit</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Padding">
              <Select value={p.padding || "medium"} onValueChange={(v) => set("padding", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Klein</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="large">Groot</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "row":
        return (
          <>
            <Field label="Aantal kolommen">
              <Select value={String(p.columns || 2)} onValueChange={(v) => set("columns", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 kolom</SelectItem>
                  <SelectItem value="2">2 kolommen</SelectItem>
                  <SelectItem value="3">3 kolommen</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tussenruimte (px)">
              <Input type="number" value={p.gap ?? 32} onChange={(e) => set("gap", parseInt(e.target.value) || 0)} />
            </Field>
            <Field label="Verticale uitlijning">
              <Select value={p.verticalAlign || "start"} onValueChange={(v) => set("verticalAlign", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Boven</SelectItem>
                  <SelectItem value="center">Midden</SelectItem>
                  <SelectItem value="end">Onder</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Achtergrondkleur">
              <Select value={p.bgColor || "background"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="background">Geen</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                  <SelectItem value="card">Wit</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Padding">
              <Select value={p.padding || "medium"} onValueChange={(v) => set("padding", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Klein</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="large">Groot</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <p className="text-[11px] text-muted-foreground">Voeg blokken toe in elke kolom via de + knop in de kolom op het canvas.</p>
          </>
        );

      case "icon_card":
        return (
          <>
            <Field label="Icoon (Lucide naam, bv. Star, Heart, Code)">
              <Input value={p.icon || ""} onChange={(e) => set("icon", e.target.value)} />
            </Field>
            <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Beschrijving"><Textarea value={p.description || ""} onChange={(e) => set("description", e.target.value)} rows={4} /></Field>
            <Field label="Icoonkleur">
              <Select value={p.iconColor || "primary"} onValueChange={(v) => set("iconColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "stat":
        return (
          <>
            <Field label="Waarde (bv. 100+)"><Input value={p.value || ""} onChange={(e) => set("value", e.target.value)} /></Field>
            <Field label="Label"><Input value={p.label || ""} onChange={(e) => set("label", e.target.value)} /></Field>
          </>
        );

      case "feature_list":
        return (
          <>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Feature {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                <Input value={item.title} onChange={(e) => setItem("items", i, "title", e.target.value)} placeholder="Titel" />
                <Textarea value={item.description} onChange={(e) => setItem("items", i, "description", e.target.value)} rows={2} placeholder="Beschrijving" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("items", { title: "Nieuwe feature", description: "" })}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "faq":
        return (
          <>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Vraag {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                <Input value={item.question} onChange={(e) => setItem("items", i, "question", e.target.value)} placeholder="Vraag" />
                <Textarea value={item.answer} onChange={(e) => setItem("items", i, "answer", e.target.value)} rows={2} placeholder="Antwoord" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("items", { question: "Nieuwe vraag?", answer: "" })}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "testimonial":
        return (
          <>
            <Field label="Quote"><Textarea value={p.quote || ""} onChange={(e) => set("quote", e.target.value)} rows={3} /></Field>
            <Field label="Naam"><Input value={p.name || ""} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field label="Functie / bedrijf"><Input value={p.role || ""} onChange={(e) => set("role", e.target.value)} /></Field>
            <Field label="Foto">
              <FileUpload onUpload={(url) => set("photo", url || "")} currentUrl={p.photo} folder="page-media" />
            </Field>
          </>
        );

      case "cta_banner":
        return (
          <>
            <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Subtitel"><Input value={p.subtitle || ""} onChange={(e) => set("subtitle", e.target.value)} /></Field>
            <Field label="Knoptekst"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="Knop link"><Input value={p.ctaLink || ""} onChange={(e) => set("ctaLink", e.target.value)} /></Field>
          </>
        );

      case "contact_form":
        return <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>;

      case "video_embed":
        return (
          <Field label="Embed URL (YouTube/Vimeo)">
            <Input value={p.url || ""} onChange={(e) => set("url", e.target.value)} placeholder="https://www.youtube.com/embed/..." />
          </Field>
        );

      case "accordion":
        return (
          <>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Item {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                <Input value={item.title} onChange={(e) => setItem("items", i, "title", e.target.value)} placeholder="Titel" />
                <Textarea value={item.content} onChange={(e) => setItem("items", i, "content", e.target.value)} rows={2} placeholder="Inhoud" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("items", { title: "Nieuw item", content: "" })}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "tabs":
        return (
          <>
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Tab {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                <Input value={item.label} onChange={(e) => setItem("items", i, "label", e.target.value)} placeholder="Label" />
                <Textarea value={item.content} onChange={(e) => setItem("items", i, "content", e.target.value)} rows={3} placeholder="Inhoud" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("items", { label: "Nieuwe tab", content: "" })}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "image_carousel":
        return (
          <>
            {(p.images || []).map((img: string, i: number) => (
              <div key={i} className="border rounded p-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold">Afbeelding {i + 1}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("images", i)}><Trash2 className="h-3 w-3" /></Button>
                </div>
                <FileUpload
                  onUpload={(url) => {
                    const arr = [...(p.images || [])];
                    arr[i] = url || "";
                    set("images", arr);
                  }}
                  currentUrl={img}
                  folder="page-media"
                />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("images", "")}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "custom_html":
        return (
          <Field label="HTML">
            <Textarea value={p.html || ""} onChange={(e) => set("html", e.target.value)} rows={10} className="font-mono text-xs" />
          </Field>
        );

      case "image_text":
        return (
          <>
            <Field label="Afbeelding">
              <FileUpload onUpload={(url) => set("imageUrl", url || "")} currentUrl={p.imageUrl} folder="page-media" />
            </Field>
            <Field label="Alt tekst"><Input value={p.imageAlt || ""} onChange={(e) => set("imageAlt", e.target.value)} /></Field>
            <Field label="Positie afbeelding">
              <Select value={p.imagePosition || "left"} onValueChange={(v) => set("imagePosition", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Links</SelectItem>
                  <SelectItem value="right">Rechts</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Beeldverhouding">
              <Select value={p.imageRatio || "4/3"} onValueChange={(v) => set("imageRatio", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1/1">Vierkant (1:1)</SelectItem>
                  <SelectItem value="4/3">Klassiek (4:3)</SelectItem>
                  <SelectItem value="3/2">Foto (3:2)</SelectItem>
                  <SelectItem value="16/9">Breedbeeld (16:9)</SelectItem>
                  <SelectItem value="3/4">Portret (3:4)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Breedte afbeelding (% — 20–80)">
              <Input type="number" min={20} max={80} value={p.imageWidth ?? 50} onChange={(e) => set("imageWidth", Math.max(20, Math.min(80, parseInt(e.target.value) || 50)))} />
            </Field>
            <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Tekst"><Textarea value={p.text || ""} onChange={(e) => set("text", e.target.value)} rows={6} /></Field>
            <Field label="Knoptekst (optioneel)"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="Knop link (kies pagina)">
              <PagePicker value={p.ctaLink || ""} onChange={(v) => set("ctaLink", v)} />
            </Field>
            <Field label="Verticale uitlijning">
              <Select value={p.verticalAlign || "center"} onValueChange={(v) => set("verticalAlign", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="start">Boven</SelectItem>
                  <SelectItem value="center">Midden</SelectItem>
                  <SelectItem value="end">Onder</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Achtergrondkleur">
              <Select value={p.bgColor || "background"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="background">Geen</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                  <SelectItem value="card">Wit</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Padding">
              <Select value={p.padding || "medium"} onValueChange={(v) => set("padding", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Klein</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="large">Groot</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "logo_marquee":
        return (
          <>
            <Field label="Titel boven (optioneel)">
              <Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Achtergrond">
              <Select value={p.bgColor || "muted"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="background">Wit</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                  <SelectItem value="card">Kaart</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Logo hoogte (px)">
              <Input type="number" value={p.height ?? 60} onChange={(e) => set("height", parseInt(e.target.value) || 60)} />
            </Field>
            <Field label="Snelheid (sec — lager = sneller)">
              <Input type="number" value={p.speed ?? 30} onChange={(e) => set("speed", parseInt(e.target.value) || 30)} />
            </Field>
            <Field label="Grijswaarden tot hover">
              <Select value={p.grayscale ? "yes" : "no"} onValueChange={(v) => set("grayscale", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Ja</SelectItem>
                  <SelectItem value="no">Nee</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="space-y-2 pt-2 border-t">
              <Label className="text-xs font-medium">Logo's</Label>
              {(p.logos || []).map((img: string, i: number) => (
                <div key={i} className="border rounded p-3 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold">Logo {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("logos", i)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  <FileUpload
                    onUpload={(url) => {
                      const arr = [...(p.logos || [])];
                      arr[i] = url || "";
                      set("logos", arr);
                    }}
                    currentUrl={img}
                    folder="page-media"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("logos", "")}><Plus className="h-3 w-3 mr-1" /> Voeg logo toe</Button>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b">
        <h3 className="font-bold text-sm">Eigenschappen</h3>
        <p className="text-xs text-muted-foreground">{getBlockMeta(block.type)?.label}</p>
      </div>
      {renderFields()}

      <div className="pt-4 mt-4 border-t space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Positie & marges</h4>
        <Field label="Marge boven (px)">
          <Input type="number" value={p.marginTop ?? ""} onChange={(e) => set("marginTop", e.target.value === "" ? undefined : parseInt(e.target.value) || 0)} placeholder="0" />
        </Field>
        <Field label="Marge onder (px)">
          <Input type="number" value={p.marginBottom ?? ""} onChange={(e) => set("marginBottom", e.target.value === "" ? undefined : parseInt(e.target.value) || 0)} placeholder="0" />
        </Field>
        <Field label="Horizontale offset (px)">
          <Input type="number" value={p.offsetX ?? ""} onChange={(e) => set("offsetX", e.target.value === "" ? undefined : parseInt(e.target.value) || 0)} placeholder="0" />
        </Field>
        <p className="text-[10px] text-muted-foreground leading-snug">Tip: gebruik 'Uitlijning' bovenaan en deze velden om je tekst of afbeelding precies op de juiste plek te zetten.</p>
      </div>
    </div>
  );
};

const getBlockMeta = (type: string) => {
  const map: Record<string, string> = {
    heading: "Koptekst", paragraph: "Paragraaf", image: "Afbeelding", button: "Knop",
    spacer: "Tussenruimte", divider: "Scheidingslijn", hero: "Hero sectie",
    two_columns: "Twee kolommen", three_columns: "Drie kolommen", container: "Achtergrondblok",
    feature_list: "Featurelijst", faq: "FAQ", testimonial: "Testimonial", cta_banner: "CTA banner",
    contact_form: "Contactformulier", video_embed: "Video", accordion: "Accordeon",
    tabs: "Tabbladen", image_carousel: "Carrousel", custom_html: "Custom HTML",
  };
  return { label: map[type] || type };
};

export default BlockInspector;
