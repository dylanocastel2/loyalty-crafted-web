import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/FileUpload";

interface SeoData {
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
}

interface Props {
  data: SeoData;
  onChange: (data: SeoData) => void;
}

const Counter = ({ value, max }: { value: string; max: number }) => (
  <span className={`text-xs ${value.length > max ? "text-destructive" : "text-muted-foreground"}`}>
    {value.length} / {max}
  </span>
);

const SeoFields = ({ data, onChange }: Props) => {
  const set = (key: keyof SeoData, value: string) => onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold mb-1">Zoekmachine optimalisatie</h3>
        <p className="text-sm text-muted-foreground">Hoe je pagina verschijnt in Google en op social media.</p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Meta titel</Label>
          <Counter value={data.meta_title || ""} max={60} />
        </div>
        <Input value={data.meta_title || ""} onChange={(e) => set("meta_title", e.target.value)} placeholder="Verschijnt als titel in Google" />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Meta omschrijving</Label>
          <Counter value={data.meta_description || ""} max={160} />
        </div>
        <Textarea value={data.meta_description || ""} onChange={(e) => set("meta_description", e.target.value)} rows={3} placeholder="Korte beschrijving onder de titel in zoekresultaten" />
      </div>

      <div className="space-y-2">
        <Label>Keywords (komma-gescheiden)</Label>
        <Input value={data.meta_keywords || ""} onChange={(e) => set("meta_keywords", e.target.value)} placeholder="loyaliteit, spaarpas, retail" />
      </div>

      <div className="border-t pt-6 space-y-2">
        <h4 className="font-semibold">Open Graph (social media)</h4>
        <p className="text-xs text-muted-foreground">Hoe je pagina verschijnt wanneer iemand de link deelt op Facebook, LinkedIn of WhatsApp.</p>
      </div>

      <div className="space-y-2">
        <Label>OG titel</Label>
        <Input value={data.og_title || ""} onChange={(e) => set("og_title", e.target.value)} placeholder="Optioneel, anders wordt meta titel gebruikt" />
      </div>

      <div className="space-y-2">
        <Label>OG omschrijving</Label>
        <Textarea value={data.og_description || ""} onChange={(e) => set("og_description", e.target.value)} rows={2} placeholder="Optioneel, anders wordt meta omschrijving gebruikt" />
      </div>

      <div className="space-y-2">
        <Label>Social share afbeelding (OG image)</Label>
        <p className="text-xs text-muted-foreground">Aanbevolen: 1200×630 pixels</p>
        <FileUpload onUpload={(url) => set("og_image_url", url || "")} currentUrl={data.og_image_url} folder="page-media/og" />
      </div>

      <div className="space-y-2 border-t pt-6">
        <Label>Canonical URL (optioneel)</Label>
        <Input value={data.canonical_url || ""} onChange={(e) => set("canonical_url", e.target.value)} placeholder="https://www.loyaltygroup.nl/p/voorbeeld" />
        <p className="text-xs text-muted-foreground">Gebruik dit alleen als deze pagina dezelfde inhoud heeft als een andere URL.</p>
      </div>
    </div>
  );
};

export default SeoFields;
export type { SeoData };
