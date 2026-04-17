import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface PageSettingsData {
  published: boolean;
  show_in_menu: boolean;
  menu_label: string;
  menu_order: number;
}

interface Props {
  data: PageSettingsData;
  onChange: (data: PageSettingsData) => void;
}

const PageSettings = ({ data, onChange }: Props) => {
  const set = <K extends keyof PageSettingsData>(key: K, value: PageSettingsData[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold mb-1">Pagina instellingen</h3>
        <p className="text-sm text-muted-foreground">Publicatie en navigatie</p>
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <Label className="text-base">Gepubliceerd</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Maak de pagina zichtbaar voor bezoekers</p>
        </div>
        <Switch checked={data.published} onCheckedChange={(v) => set("published", v)} />
      </div>

      <div className="flex items-center justify-between border rounded-lg p-4">
        <div>
          <Label className="text-base">Toon in hoofdmenu</Label>
          <p className="text-xs text-muted-foreground mt-0.5">Voeg een link toe aan de bovenste navigatiebalk</p>
        </div>
        <Switch checked={data.show_in_menu} onCheckedChange={(v) => set("show_in_menu", v)} />
      </div>

      {data.show_in_menu && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Menu label (optioneel)</Label>
            <Input value={data.menu_label || ""} onChange={(e) => set("menu_label", e.target.value)} placeholder="Standaard: pagina titel" />
          </div>
          <div className="space-y-2">
            <Label>Menu volgorde</Label>
            <Input type="number" value={data.menu_order || 0} onChange={(e) => set("menu_order", parseInt(e.target.value) || 0)} />
            <p className="text-xs text-muted-foreground">Lagere getallen verschijnen eerst</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageSettings;
export type { PageSettingsData };
