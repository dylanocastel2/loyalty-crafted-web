import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { BUILTIN_PAGES } from "@/lib/builtinPages";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const CUSTOM = "__custom__";

const PagePicker = ({ value, onChange }: Props) => {
  const [customPages, setCustomPages] = useState<{ slug: string; title: string }[]>([]);

  useEffect(() => {
    supabase
      .from("custom_pages")
      .select("slug,title")
      .eq("published", true)
      .order("title", { ascending: true })
      .then(({ data }) => setCustomPages(data || []));
  }, []);

  const builtinPaths = BUILTIN_PAGES.map((p) => p.path);
  const customPaths = customPages.map((p) => `/p/${p.slug}`);
  const knownPaths = [...builtinPaths, ...customPaths];
  const isKnown = value && knownPaths.includes(value);
  const selectValue = !value ? "" : isKnown ? value : CUSTOM;

  return (
    <div className="space-y-2">
      <Select value={selectValue} onValueChange={(v) => onChange(v === CUSTOM ? (value && !isKnown ? value : "") : v)}>
        <SelectTrigger><SelectValue placeholder="Kies een pagina..." /></SelectTrigger>
        <SelectContent>
          <SelectItem value="__group_builtin__" disabled className="text-xs font-bold uppercase opacity-60">Hoofdpagina's</SelectItem>
          {BUILTIN_PAGES.map((p) => (
            <SelectItem key={p.path} value={p.path}>{p.label}</SelectItem>
          ))}
          {customPages.length > 0 && (
            <>
              <SelectItem value="__group_custom__" disabled className="text-xs font-bold uppercase opacity-60 mt-2">Eigen pagina's</SelectItem>
              {customPages.map((p) => (
                <SelectItem key={p.slug} value={`/p/${p.slug}`}>{p.title}</SelectItem>
              ))}
            </>
          )}
          <SelectItem value={CUSTOM}>Aangepaste URL...</SelectItem>
        </SelectContent>
      </Select>
      {selectValue === CUSTOM && (
        <div>
          <Label className="text-[10px] text-muted-foreground">Aangepaste URL of pad</Label>
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/contact of https://..." />
        </div>
      )}
    </div>
  );
};

export default PagePicker;