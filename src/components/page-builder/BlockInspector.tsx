import { Block } from "./blockSchema";
import { Input } from "@/components/ui/input";
import { NumberInput } from "./NumberInput";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import FileUpload from "@/components/FileUpload";
import AnyFileUpload from "@/components/AnyFileUpload";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import PagePicker from "./PagePicker";
import KlantcasePicker from "./KlantcasePicker";
import RichText from "./RichText";
import IconPicker from "./IconPicker";


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

  const ctaEditor = (linkUsePagePicker: boolean) => {
    const extras: any[] = p.extraCtas || [];
    return (
      <div className="space-y-3 border rounded p-3 bg-muted/30">
        <div className="text-xs font-semibold">Extra knoppen</div>
        {extras.map((c, i) => (
          <div key={i} className="border rounded p-2 space-y-2 bg-background">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">Knop {i + 2}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("extraCtas", i)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <Input
              value={c.label || ""}
              placeholder="Knoptekst"
              onChange={(e) => setItem("extraCtas", i, "label", e.target.value)}
            />
            {linkUsePagePicker ? (
              <PagePicker value={c.link || ""} onChange={(v) => setItem("extraCtas", i, "link", v)} />
            ) : (
              <Input
                value={c.link || ""}
                placeholder="Link (bv. /contact of https://...)"
                onChange={(e) => setItem("extraCtas", i, "link", e.target.value)}
              />
            )}
            <Select value={c.variant || "outline"} onValueChange={(v) => setItem("extraCtas", i, "variant", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Primair</SelectItem>
                <SelectItem value="secondary">Secundair</SelectItem>
                <SelectItem value="outline">Omlijnd</SelectItem>
                <SelectItem value="ghost">Transparant</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => addItem("extraCtas", { label: "Knop", link: "/", variant: "outline" })}>
          <Plus className="h-3 w-3 mr-1" /> Voeg knop toe
        </Button>
        <Field label="Knoppen layout">
          <Select value={p.ctaLayout || "row"} onValueChange={(v) => set("ctaLayout", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="row">Naast elkaar</SelectItem>
              <SelectItem value="stack">Onder elkaar</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </div>
    );
  };

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

  const titleAlignSelect = (defaultVal: "left" | "center" | "right" = "center") => (
    <Select value={p.titleAlign || defaultVal} onValueChange={(v) => set("titleAlign", v)}>
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
            <Field label="Tekst (selecteer woorden om in te kleuren)">
              <RichText value={p.text || ""} onChange={(v) => set("text", v)} singleLine />
            </Field>
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
            <Field label="Eigen breedte (px, leeg = volledig)">
              <NumberInput value={p.customMaxWidth} onChange={(v) => set("customMaxWidth", v)} min={50} max={2000} placeholder="bijv. 800" />
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

      case "paragraph":
        return (
          <>
            <Field label="Tekst (selecteer woorden om in te kleuren)">
              <RichText value={p.text || ""} onChange={(v) => set("text", v)} rows={10} />
              <p className="text-[11px] text-muted-foreground mt-1">Gebruik Enter voor een nieuwe regel. Selecteer tekst voor opmaak of kleur.</p>
            </Field>
            <Field label="Uitlijning">{alignSelect}</Field>
            <Field label="Tekstgrootte">
              <Select value={p.size || "base"} onValueChange={(v) => set("size", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Extra klein</SelectItem>
                  <SelectItem value="sm">Klein</SelectItem>
                  <SelectItem value="base">Normaal</SelectItem>
                  <SelectItem value="lg">Groot</SelectItem>
                  <SelectItem value="xl">Extra groot</SelectItem>
                  <SelectItem value="2xl">2× groot</SelectItem>
                  <SelectItem value="3xl">3× groot</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Regelhoogte">
              <Select value={p.lineHeight || "relaxed"} onValueChange={(v) => set("lineHeight", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tight">Compact</SelectItem>
                  <SelectItem value="snug">Krap</SelectItem>
                  <SelectItem value="normal">Normaal</SelectItem>
                  <SelectItem value="relaxed">Ruim</SelectItem>
                  <SelectItem value="loose">Zeer ruim</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Maximale breedte">
              <Select value={p.maxWidth || "none"} onValueChange={(v) => set("maxWidth", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Volledig</SelectItem>
                  <SelectItem value="prose">Leesbreedte (65ch)</SelectItem>
                  <SelectItem value="sm">Smal</SelectItem>
                  <SelectItem value="md">Gemiddeld</SelectItem>
                  <SelectItem value="lg">Breed</SelectItem>
                  <SelectItem value="xl">Extra breed</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Eigen breedte (px, overschrijft bovenstaande)">
              <NumberInput value={p.customMaxWidth} onChange={(v) => set("customMaxWidth", v)} min={50} max={2000} placeholder="bijv. 720" />
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
              <Select value={p.padding || "small"} onValueChange={(v) => set("padding", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Geen</SelectItem>
                  <SelectItem value="small">Klein</SelectItem>
                  <SelectItem value="medium">Gemiddeld</SelectItem>
                  <SelectItem value="large">Groot</SelectItem>
                </SelectContent>
              </Select>
            </Field>
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
                    <NumberInput
                      min={0}
                      max={100}
                      value={p.gradientOpacity ?? 100}
                      onChange={(v) => set("gradientOpacity", v ?? 100)}
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
            <NumberInput value={p.height || 40} onChange={(v) => set("height", v ?? 40)} />
          </Field>
        );

      case "hero":
        return (
          <>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine /></Field>
            <Field label="Subtitel"><RichText value={p.subtitle || ""} onChange={(v) => set("subtitle", v)} rows={3} /></Field>
            <Field label="Achtergrondafbeelding (optioneel)">
              <FileUpload onUpload={(url) => set("bgImage", url || "")} currentUrl={p.bgImage} folder="page-media" />
            </Field>
            <Field label="Achtergrondkleur (zonder afbeelding)">
              <Select value={p.bgColor || "primary"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Geen achtergrond</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="secondary">Secundair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
            <Field label="Tekstkleur">
              <Select value={p.textColor || "light"} onValueChange={(v) => set("textColor", v)}>
                <SelectTrigger className="gap-2">
                  <span className={`inline-block w-3 h-3 rounded-full shrink-0 border ${p.textColor === "dark" ? "bg-foreground border-transparent" : "bg-white border-border"}`} />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Licht</SelectItem>
                  <SelectItem value="dark">Donker</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="CTA knoptekst"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="CTA link (kies pagina)">
              <PagePicker value={p.ctaLink || ""} onChange={(v) => set("ctaLink", v)} />
            </Field>
            {ctaEditor(true)}
          </>
        );

      case "two_columns":
        return (
          <>
            <Field label="Linker kolom"><RichText value={p.left || ""} onChange={(v) => set("left", v)} rows={5} /></Field>
            <Field label="Rechter kolom"><RichText value={p.right || ""} onChange={(v) => set("right", v)} rows={5} /></Field>
            <Field label="Breedte linker kolom (% — 15–85)">
              <NumberInput min={15} max={85} value={p.leftWidth ?? 50} onChange={(v) => set("leftWidth", v ?? 50)} />
            </Field>
            <Field label="Tussenruimte (px)">
              <NumberInput min={0} max={200} value={p.gap ?? 32} onChange={(v) => set("gap", v ?? 32)} />
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
            <Field label="Kolommen omwisselen">
              <Select value={p.swapOrder ? "yes" : "no"} onValueChange={(v) => set("swapOrder", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">Nee (links / rechts)</SelectItem>
                  <SelectItem value="yes">Ja (rechts / links)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "three_columns":
        return (
          <>
            <Field label="Kolom 1"><RichText value={p.col1 || ""} onChange={(v) => set("col1", v)} rows={4} /></Field>
            <Field label="Kolom 2"><RichText value={p.col2 || ""} onChange={(v) => set("col2", v)} rows={4} /></Field>
            <Field label="Kolom 3"><RichText value={p.col3 || ""} onChange={(v) => set("col3", v)} rows={4} /></Field>
          </>
        );

      case "container":
        return (
          <>
            <Field label="Inhoud"><RichText value={p.content || ""} onChange={(v) => set("content", v)} rows={6} /></Field>
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
                  <SelectItem value="4">4 kolommen</SelectItem>
                  <SelectItem value="5">5 kolommen</SelectItem>
                  <SelectItem value="6">6 kolommen</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Tussenruimte (px)">
              <NumberInput value={p.gap ?? 32} onChange={(v) => set("gap", v ?? 0)} />
            </Field>
            <Field label="Verticale uitlijning">
              <Select value={p.verticalAlign || "stretch"} onValueChange={(v) => set("verticalAlign", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="stretch">Stretch — gelijke hoogte</SelectItem>
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
            <Field label="Icoon">
              <IconPicker
                icon={p.icon}
                iconImage={p.iconImage}
                iconColor={p.iconColor}
                onChange={(v) => onChange({ ...p, ...v })}
              />
            </Field>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine /></Field>
            <Field label="Beschrijving"><RichText value={p.description || ""} onChange={(v) => set("description", v)} rows={5} /></Field>
          </>
        );

      case "stat":
        return (
          <>
            <Field label="Waarde (bv. 100+)"><RichText value={p.value || ""} onChange={(v) => set("value", v)} singleLine /></Field>
            <Field label="Label"><RichText value={p.label || ""} onChange={(v) => set("label", v)} singleLine /></Field>
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
                <RichText value={item.description || ""} onChange={(v) => setItem("items", i, "description", v)} rows={3} placeholder="Beschrijving" />
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
                <RichText value={item.answer || ""} onChange={(v) => setItem("items", i, "answer", v)} rows={3} placeholder="Antwoord" />
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addItem("items", { question: "Nieuwe vraag?", answer: "" })}><Plus className="h-3 w-3 mr-1" /> Voeg toe</Button>
          </>
        );

      case "testimonial":
        return (
          <>
            <Field label="Quote"><RichText value={p.quote || ""} onChange={(v) => set("quote", v)} rows={4} /></Field>
            <Field label="Naam"><RichText value={p.name || ""} onChange={(v) => set("name", v)} singleLine /></Field>
            <Field label="Functie / bedrijf"><RichText value={p.role || ""} onChange={(v) => set("role", v)} singleLine /></Field>
            <Field label="Foto">
              <FileUpload onUpload={(url) => set("photo", url || "")} currentUrl={p.photo} folder="page-media" />
            </Field>
          </>
        );

      case "cta_banner":
        return (
          <>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine /></Field>
            <Field label="Subtitel"><RichText value={p.subtitle || ""} onChange={(v) => set("subtitle", v)} rows={2} /></Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
            <Field label="Knoptekst"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="Knop link"><Input value={p.ctaLink || ""} onChange={(e) => set("ctaLink", e.target.value)} /></Field>
            {ctaEditor(false)}
          </>
        );

      case "contact_form":
        return (
          <>
            <Field label="Titel"><Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} /></Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
          </>
        );

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
                <RichText value={item.content || ""} onChange={(v) => setItem("items", i, "content", v)} rows={3} placeholder="Inhoud" />
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
                <RichText value={item.content || ""} onChange={(v) => setItem("items", i, "content", v)} rows={4} placeholder="Inhoud" />
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
              <NumberInput min={20} max={80} value={p.imageWidth ?? 50} onChange={(v) => set("imageWidth", v ?? 50)} />
            </Field>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine /></Field>
            <Field label="Tekst"><RichText value={p.text || ""} onChange={(v) => set("text", v)} rows={8} /></Field>
            <Field label="Titel uitlijning">{titleAlignSelect("left")}</Field>
            <Field label="Knoptekst (optioneel)"><Input value={p.ctaLabel || ""} onChange={(e) => set("ctaLabel", e.target.value)} /></Field>
            <Field label="Knop link (kies pagina)">
              <PagePicker value={p.ctaLink || ""} onChange={(v) => set("ctaLink", v)} />
            </Field>
            {ctaEditor(true)}
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
              <RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine />
            </Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
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
              <NumberInput value={p.height ?? 60} onChange={(v) => set("height", v ?? 60)} />
            </Field>
            <Field label="Snelheid (sec — lager = sneller)">
              <NumberInput value={p.speed ?? 30} onChange={(v) => set("speed", v ?? 30)} />
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

      case "klantcases":
        return (
          <>
            <Field label="Titel boven (optioneel)">
              <RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine placeholder="Bijv. Onze klantcases" />
            </Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
            <Field label="Weergave">
              <Select value={p.view || "short"} onValueChange={(v) => set("view", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Compact (meerdere naast elkaar)</SelectItem>
                  <SelectItem value="detailed">Gedetailleerd (met beschrijving)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Welke cases tonen">
              <Select value={p.mode || "selected"} onValueChange={(v) => set("mode", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="selected">Handmatig kiezen</SelectItem>
                  <SelectItem value="latest">Automatisch (nieuwste)</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {(p.mode || "selected") === "selected" ? (
              <Field label="Kies klantcases">
                <KlantcasePicker value={p.selectedIds || []} onChange={(ids) => set("selectedIds", ids)} />
              </Field>
            ) : (
              <Field label="Aantal cases">
                <NumberInput min={1} max={12} value={p.limit ?? 3} onChange={(v) => set("limit", v ?? 3)} />
              </Field>
            )}
            <Field label="Aantal kolommen">
              <Select value={String(p.columns || 3)} onValueChange={(v) => set("columns", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 kolom</SelectItem>
                  <SelectItem value="2">2 kolommen</SelectItem>
                  <SelectItem value="3">3 kolommen</SelectItem>
                  <SelectItem value="4">4 kolommen</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Max. rijen zichtbaar (0 = alles tonen)">
              <Select value={String(p.maxRows ?? 0)} onValueChange={(v) => set("maxRows", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Alles tonen</SelectItem>
                  <SelectItem value="1">1 rij</SelectItem>
                  <SelectItem value="2">2 rijen</SelectItem>
                  <SelectItem value="3">3 rijen</SelectItem>
                  <SelectItem value="4">4 rijen</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Toon categorie">
              <Select value={p.showCategory !== false ? "yes" : "no"} onValueChange={(v) => set("showCategory", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Ja</SelectItem>
                  <SelectItem value="no">Nee</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Toon branche">
              <Select value={p.showBranche !== false ? "yes" : "no"} onValueChange={(v) => set("showBranche", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Ja</SelectItem>
                  <SelectItem value="no">Nee</SelectItem>
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

      case "download_files":
        return (
          <>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine placeholder="Bijv. Downloads" /></Field>
            <Field label="Ondertitel"><RichText value={p.subtitle || ""} onChange={(v) => set("subtitle", v)} rows={3} /></Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
            <Field label="Aantal kolommen">
              <Select value={String(p.columns || 3)} onValueChange={(v) => set("columns", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="pt-3 border-t space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Bestanden</Label>
              {(p.files || []).map((f: any, i: number) => (
                <div key={i} className="border rounded p-3 space-y-2 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold">Bestand {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeItem("files", i)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  <Field label="Label">
                    <RichText value={f.label || ""} onChange={(v) => setItem("files", i, "label", v)} singleLine placeholder="Bijv. Driver X" />
                  </Field>
                  <Field label="Beschrijving (optioneel)">
                    <RichText value={f.description || ""} onChange={(v) => setItem("files", i, "description", v)} singleLine />
                  </Field>
                  <Field label="Bestand">
                    <AnyFileUpload
                      currentUrl={f.url}
                      currentName={f.label}
                      folder="page-downloads"
                      onUpload={(url, name, size) => {
                        const items = [...(p.files || [])];
                        items[i] = { ...items[i], url, sizeBytes: size, label: items[i].label || name };
                        set("files", items);
                      }}
                    />
                  </Field>
                  <Field label="Icoonafbeelding (optioneel)">
                    <FileUpload
                      currentUrl={f.iconUrl}
                      folder="page-downloads/icons"
                      onUpload={(url) => setItem("files", i, "iconUrl", url || "")}
                    />
                  </Field>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("files", { url: "", label: "Nieuw bestand", description: "", sizeBytes: 0, iconUrl: "" })}>
                <Plus className="h-3 w-3 mr-1" /> Bestand toevoegen
              </Button>
            </div>
            <Field label="Achtergrondkleur">
              <Select value={p.bgColor || "background"} onValueChange={(v) => set("bgColor", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="background">Geen</SelectItem>
                  <SelectItem value="muted">Licht grijs</SelectItem>
                  <SelectItem value="card">Wit</SelectItem>
                  <SelectItem value="primary">Primair</SelectItem>
                  <SelectItem value="gradient">Verloop</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </>
        );

      case "image_cards":
        return (
          <>
            <Field label="Titel"><RichText value={p.title || ""} onChange={(v) => set("title", v)} singleLine /></Field>
            <Field label="Ondertitel"><RichText value={p.subtitle || ""} onChange={(v) => set("subtitle", v)} rows={4} /></Field>
            <Field label="Titel uitlijning">{titleAlignSelect("center")}</Field>
            <Field label="Aantal kolommen">
              <Select value={String(p.columns || 3)} onValueChange={(v) => set("columns", parseInt(v))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <div className="pt-3 border-t space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kaarten</Label>
              {(p.items || []).map((it: any, i: number) => (
                <div key={i} className="border rounded p-3 space-y-2 bg-muted/20">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold">Kaart {i + 1}</span>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("items", i)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                  <Field label="Afbeelding">
                    <FileUpload currentUrl={it.image} folder="page-media" onUpload={(url) => setItem("items", i, "image", url || "")} />
                  </Field>
                  <Field label="Titel"><RichText value={it.title || ""} onChange={(v) => setItem("items", i, "title", v)} singleLine /></Field>
                  <Field label="Beschrijving"><RichText value={it.description || ""} onChange={(v) => setItem("items", i, "description", v)} rows={4} /></Field>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={() => addItem("items", { image: "", title: "Nieuwe kaart", description: "" })}><Plus className="h-3 w-3 mr-1" /> Kaart toevoegen</Button>
            </div>
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

      case "search_bar":
        return (
          <>
            <Field label="Placeholder">
              <Input value={p.placeholder || ""} onChange={(e) => set("placeholder", e.target.value)} placeholder="Waar bent u naar op zoek?" />
            </Field>
            <Field label="Knop tonen">
              <Select value={p.showButton === false ? "no" : "yes"} onValueChange={(v) => set("showButton", v === "yes")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Ja</SelectItem>
                  <SelectItem value="no">Nee</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            {p.showButton !== false && (
              <Field label="Knoptekst">
                <Input value={p.buttonLabel || ""} onChange={(e) => set("buttonLabel", e.target.value)} placeholder="Zoek" />
              </Field>
            )}
            <Field label="Maximale breedte (px)">
              <NumberInput value={p.maxWidth ?? 560} onChange={(v) => set("maxWidth", v ?? 560)} />
            </Field>
            <Field label="Uitlijning">
              <Select value={p.align || "center"} onValueChange={(v) => set("align", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Links</SelectItem>
                  <SelectItem value="center">Midden</SelectItem>
                  <SelectItem value="right">Rechts</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Stijl">
              <Select value={p.variant || "rounded"} onValueChange={(v) => set("variant", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Standaard</SelectItem>
                  <SelectItem value="rounded">Afgerond</SelectItem>
                  <SelectItem value="pill">Pill</SelectItem>
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
            <p className="text-[10px] text-muted-foreground leading-snug">
              Zoekt automatisch door alle pagina's van de site. Klik op een resultaat om te navigeren.
            </p>
          </>
        );

      case "custom_form": {
        const fields: any[] = p.fields || [];
        const updateField = (i: number, patch: Record<string, any>) => {
          const next = [...fields];
          next[i] = { ...next[i], ...patch };
          set("fields", next);
        };
        const moveField = (i: number, dir: -1 | 1) => {
          const j = i + dir;
          if (j < 0 || j >= fields.length) return;
          const next = [...fields];
          [next[i], next[j]] = [next[j], next[i]];
          set("fields", next);
        };
        const insertFieldAt = (i: number) => {
          const newField = {
            id: `veld_${fields.length + 1}`,
            label: `Veld ${fields.length + 1}`,
            type: "text",
            required: false,
          };
          const next = [...fields];
          next.splice(i, 0, newField);
          set("fields", next);
        };
        const onDragStart = (e: React.DragEvent, i: number) => {
          e.dataTransfer.setData("text/plain", String(i));
          e.dataTransfer.effectAllowed = "move";
        };
        const onDrop = (e: React.DragEvent, target: number) => {
          e.preventDefault();
          const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
          if (Number.isNaN(from) || from === target) return;
          const next = [...fields];
          const [moved] = next.splice(from, 1);
          next.splice(from < target ? target - 1 : target, 0, moved);
          set("fields", next);
        };
        const slugify = (s: string) =>
          s.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40) || `veld_${fields.length + 1}`;
        return (
          <>
            <Field label="Titel">
              <Input value={p.title || ""} onChange={(e) => set("title", e.target.value)} />
            </Field>
            <Field label="Titel uitlijning">{titleAlignSelect("left")}</Field>
            <Field label="Onderwerp (voor e-mailmelding & overzicht)">
              <Input
                value={p.formSubject || ""}
                onChange={(e) => set("formSubject", e.target.value)}
                placeholder="bv. Aanvraag offerte"
              />
            </Field>
            <Field label="Beschrijving">
              <Textarea value={p.description || ""} onChange={(e) => set("description", e.target.value)} rows={3} />
            </Field>
            <Field label="Knoptekst">
              <Input value={p.submitLabel || ""} onChange={(e) => set("submitLabel", e.target.value)} placeholder="Versturen" />
            </Field>
            <Field label="Bedank-bericht">
              <Textarea value={p.successMessage || ""} onChange={(e) => set("successMessage", e.target.value)} rows={2} />
            </Field>
            <Field label="Maximale breedte (px)">
              <NumberInput value={p.maxWidth ?? 640} onChange={(v) => set("maxWidth", v ?? 640)} />
            </Field>

            <div className="pt-3 border-t space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Formuliervelden ({fields.length})
              </Label>
              {fields.map((f, i) => {
                const needsOptions = f.type === "select" || f.type === "radio" || f.type === "checkbox_group";
                return (
                  <div key={f.id || i}>
                    <button
                      type="button"
                      onClick={() => insertFieldAt(i)}
                      className="w-full text-[10px] text-muted-foreground hover:text-primary hover:bg-muted/40 py-1 rounded border border-dashed border-transparent hover:border-primary/40 transition-colors flex items-center justify-center gap-1"
                      title="Voeg veld hierboven toe"
                    >
                      <Plus className="h-3 w-3" /> Veld hier invoegen
                    </button>
                    <div
                      className="border rounded p-3 space-y-2 bg-muted/20"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop(e, i)}
                    >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span
                          draggable
                          onDragStart={(e) => onDragStart(e, i)}
                          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
                          title="Sleep om te verplaatsen"
                        >
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-semibold">Veld {i + 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(i, -1)} disabled={i === 0} title="Omhoog">
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(i, 1)} disabled={i === fields.length - 1} title="Omlaag">
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeItem("fields", i)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Field label="Label (vraag)">
                      <Input
                        value={f.label || ""}
                        onChange={(e) => {
                          const label = e.target.value;
                          const id = f.id && f.id !== slugify(f.label || "") ? f.id : slugify(label);
                          updateField(i, { label, id });
                        }}
                      />
                    </Field>
                    <Field label="Type">
                      <Select value={f.type || "text"} onValueChange={(v) => updateField(i, { type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Korte tekst</SelectItem>
                          <SelectItem value="textarea">Lange tekst</SelectItem>
                          <SelectItem value="email">E-mail</SelectItem>
                          <SelectItem value="tel">Telefoon</SelectItem>
                          <SelectItem value="number">Nummer</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                          <SelectItem value="date">Datum</SelectItem>
                          <SelectItem value="time">Tijd</SelectItem>
                          <SelectItem value="select">Dropdown (keuzelijst)</SelectItem>
                          <SelectItem value="radio">Radioknoppen (één keuze)</SelectItem>
                          <SelectItem value="checkbox_group">Meerkeuze (meerdere antwoorden)</SelectItem>
                          <SelectItem value="rating">Sterrenbeoordeling</SelectItem>
                          <SelectItem value="range">Schuifregelaar</SelectItem>
                          <SelectItem value="checkbox">Vinkje (akkoord)</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    {f.type !== "checkbox" && f.type !== "rating" && f.type !== "range" && f.type !== "checkbox_group" && (
                      <Field label="Placeholder">
                        <Input value={f.placeholder || ""} onChange={(e) => updateField(i, { placeholder: e.target.value })} />
                      </Field>
                    )}
                    {f.type === "textarea" && (
                      <Field label="Aantal regels">
                        <NumberInput value={f.rows ?? 4} onChange={(v) => updateField(i, { rows: v ?? 4 })} />
                      </Field>
                    )}
                    {needsOptions && (
                      <Field label="Opties (één per regel)">
                        <Textarea
                          value={(f.options || []).join("\n")}
                          onChange={(e) => updateField(i, { options: e.target.value.split("\n") })}
                          rows={4}
                          placeholder="Keuze 1&#10;Keuze 2&#10;Keuze 3"
                        />
                      </Field>
                    )}
                    {f.type === "select" && (
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!f.multiple}
                          onChange={(e) => updateField(i, { multiple: e.target.checked })}
                        />
                        Meerdere keuzes toestaan
                      </label>
                    )}
                    {f.type === "number" && (
                      <div className="grid grid-cols-3 gap-2">
                        <Field label="Min">
                          <NumberInput value={f.min} onChange={(v) => updateField(i, { min: v })} />
                        </Field>
                        <Field label="Max">
                          <NumberInput value={f.max} onChange={(v) => updateField(i, { max: v })} />
                        </Field>
                        <Field label="Stap">
                          <NumberInput value={f.step} onChange={(v) => updateField(i, { step: v })} />
                        </Field>
                      </div>
                    )}
                    {f.type === "range" && (
                      <div className="grid grid-cols-3 gap-2">
                        <Field label="Min">
                          <NumberInput value={f.min ?? 0} onChange={(v) => updateField(i, { min: v ?? 0 })} />
                        </Field>
                        <Field label="Max">
                          <NumberInput value={f.max ?? 100} onChange={(v) => updateField(i, { max: v ?? 100 })} />
                        </Field>
                        <Field label="Stap">
                          <NumberInput value={f.step ?? 1} onChange={(v) => updateField(i, { step: v ?? 1 })} />
                        </Field>
                      </div>
                    )}
                    {f.type === "rating" && (
                      <Field label="Aantal sterren">
                        <NumberInput min={3} max={10} value={f.max ?? 5} onChange={(v) => updateField(i, { max: v ?? 5 })} />
                      </Field>
                    )}
                    {(f.type === "text" || f.type === "textarea") && (
                      <div className="grid grid-cols-2 gap-2">
                        <Field label="Min. tekens">
                          <NumberInput value={f.minLength} onChange={(v) => updateField(i, { minLength: v })} />
                        </Field>
                        <Field label="Max. tekens">
                          <NumberInput value={f.maxLength} onChange={(v) => updateField(i, { maxLength: v })} />
                        </Field>
                      </div>
                    )}
                    <Field label="Hulptekst (optioneel)">
                      <Input value={f.helpText || ""} onChange={(e) => updateField(i, { helpText: e.target.value })} />
                    </Field>
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!f.required}
                        onChange={(e) => updateField(i, { required: e.target.checked })}
                      />
                      Verplicht veld
                    </label>
                    </div>
                  </div>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  addItem("fields", {
                    id: `veld_${fields.length + 1}`,
                    label: `Veld ${fields.length + 1}`,
                    type: "text",
                    required: false,
                  })
                }
              >
                <Plus className="h-3 w-3 mr-1" /> Veld toevoegen
              </Button>
            </div>

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
            <p className="text-[10px] text-muted-foreground leading-snug">
              Inzendingen worden opgeslagen in de database en zijn zichtbaar voor beheerders.
            </p>
          </>
        );
      }

      default:
        return null;
    }
  };

  const textColorDotMap: Record<string, string> = {
    default: "bg-transparent border border-foreground/40",
    foreground: "bg-foreground",
    "muted-foreground": "bg-muted-foreground",
    primary: "bg-primary",
    "primary-foreground": "bg-primary-foreground border border-border",
    secondary: "bg-secondary",
    "secondary-foreground": "bg-secondary-foreground border border-border",
    "accent-foreground": "bg-accent-foreground",
    destructive: "bg-destructive",
  };

  return (
    <div className="space-y-4">
      <div className="pb-3 border-b">
        <h3 className="font-bold text-sm">Eigenschappen</h3>
        <p className="text-xs text-muted-foreground">{getBlockMeta(block.type)?.label}</p>
      </div>
      {renderFields()}

      {!["spacer", "divider", "image", "image_carousel", "video_embed", "custom_html"].includes(block.type) && (
        <div className="pt-4 mt-4 border-t space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Tekstkleur</h4>
          <Field label="Kleur (uit thema)">
            <Select value={p.textColorToken || "default"} onValueChange={(v) => set("textColorToken", v === "default" ? undefined : v)}>
              <SelectTrigger className="gap-2">
                <span className={`inline-block w-3 h-3 rounded-full shrink-0 ${textColorDotMap[p.textColorToken || "default"]}`} />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Standaard</SelectItem>
                <SelectItem value="foreground">Donker (foreground)</SelectItem>
                <SelectItem value="muted-foreground">Gedempt</SelectItem>
                <SelectItem value="primary">Primair</SelectItem>
                <SelectItem value="primary-foreground">Primair contrast (wit)</SelectItem>
                <SelectItem value="secondary">Secundair</SelectItem>
                <SelectItem value="secondary-foreground">Secundair contrast</SelectItem>
                <SelectItem value="accent-foreground">Accent</SelectItem>
                <SelectItem value="destructive">Waarschuwing</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <p className="text-[10px] text-muted-foreground leading-snug">Past de tekstkleur aan binnen de huisstijl. Werkt op alle teksten in dit blok.</p>
          <Field label="Tekst gradient (optioneel)">
            <Select value={p.textGradient || "none"} onValueChange={(v) => set("textGradient", v === "none" ? undefined : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Geen</SelectItem>
                <SelectItem value="primary-secondary">Primair → Secundair</SelectItem>
                <SelectItem value="secondary-primary">Secundair → Primair</SelectItem>
                <SelectItem value="aqua">Aqua diagonaal</SelectItem>
                <SelectItem value="sunset">Sunset (oranje → roze)</SelectItem>
                <SelectItem value="ocean">Ocean (blauw → teal)</SelectItem>
                <SelectItem value="gold">Goud</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <p className="text-[10px] text-muted-foreground leading-snug">Een gradient overschrijft de tekstkleur en wordt op alle teksten in dit blok toegepast.</p>
        </div>
      )}

      <div className="pt-4 mt-4 border-t space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Positie & marges</h4>
        <Field label="Marge boven (px)">
          <NumberInput value={p.marginTop} onChange={(v) => set("marginTop", v)} placeholder="0" />
        </Field>
        <Field label="Marge onder (px)">
          <NumberInput value={p.marginBottom} onChange={(v) => set("marginBottom", v)} placeholder="0" />
        </Field>
        <Field label="Horizontale offset (px)">
          <NumberInput value={p.offsetX} onChange={(v) => set("offsetX", v)} placeholder="0" />
        </Field>
        <p className="text-[10px] text-muted-foreground leading-snug">Tip: gebruik 'Uitlijning' bovenaan en deze velden om je tekst of afbeelding precies op de juiste plek te zetten.</p>

        <div className="pt-3 mt-3 border-t space-y-3">
          <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Mobiel (overschrijft desktop)</h5>
          <Field label="Marge boven mobiel (px)">
            <NumberInput value={p.marginTopMobile} onChange={(v) => set("marginTopMobile", v)} placeholder="Gebruik desktopwaarde" />
          </Field>
          <Field label="Marge onder mobiel (px)">
            <NumberInput value={p.marginBottomMobile} onChange={(v) => set("marginBottomMobile", v)} placeholder="Gebruik desktopwaarde" />
          </Field>
          <Field label="Horizontale offset mobiel (px)">
            <NumberInput value={p.offsetXMobile} onChange={(v) => set("offsetXMobile", v)} placeholder="Gebruik desktopwaarde" />
          </Field>
          <p className="text-[10px] text-muted-foreground leading-snug">Laat leeg om de desktopwaarde te gebruiken. Mobiel = breedte onder 768px.</p>
        </div>
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
