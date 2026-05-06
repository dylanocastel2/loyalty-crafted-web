import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
}

const KlantcasePicker = ({ value, onChange }: Props) => {
  const [items, setItems] = useState<{ id: string; title: string; category: string }[]>([]);

  useEffect(() => {
    supabase
      .from("klantcases")
      .select("id,title,category")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems(data || []));
  }, []);

  const toggle = (id: string) => {
    if (value.includes(id)) onChange(value.filter((v) => v !== id));
    else onChange([...value, id]);
  };

  if (!items.length) {
    return <p className="text-xs text-muted-foreground">Nog geen gepubliceerde klantcases gevonden.</p>;
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto border rounded p-2">
      {items.map((c) => (
        <label key={c.id} className="flex items-start gap-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded">
          <Checkbox checked={value.includes(c.id)} onCheckedChange={() => toggle(c.id)} className="mt-0.5" />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium leading-tight truncate">{c.title}</div>
            <div className="text-[10px] text-muted-foreground">{c.category}</div>
          </div>
        </label>
      ))}
      <p className="text-[10px] text-muted-foreground pt-1">Volgorde van selecteren = volgorde op pagina.</p>
    </div>
  );
};

export default KlantcasePicker;