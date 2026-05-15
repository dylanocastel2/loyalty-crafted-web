import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search, RefreshCw } from "lucide-react";

const BUCKETS = ["media", "page-media"] as const;
type Bucket = (typeof BUCKETS)[number];

type Item = { bucket: Bucket; path: string; url: string; name: string };

const isImage = (name: string) => /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);

async function listRecursive(bucket: Bucket, prefix = ""): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
  if (error || !data) return [];
  const out: string[] = [];
  for (const item of data) {
    if (!item.name || item.name === ".emptyFolderPlaceholder") continue;
    const full = prefix ? `${prefix}/${item.name}` : item.name;
    // Folders have no metadata/id
    if (item.id === null && !item.metadata) {
      const sub = await listRecursive(bucket, full);
      out.push(...sub);
    } else {
      out.push(full);
    }
  }
  return out;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSelect: (url: string) => void;
  imagesOnly?: boolean;
}

export default function MediaPicker({ open, onOpenChange, onSelect, imagesOnly = true }: Props) {
  const [bucket, setBucket] = useState<Bucket>("media");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const paths = await listRecursive(bucket);
    const filtered = imagesOnly ? paths.filter(isImage) : paths;
    const result: Item[] = filtered.map((p) => {
      const { data } = supabase.storage.from(bucket).getPublicUrl(p);
      return { bucket, path: p, url: data.publicUrl, name: p.split("/").pop() || p };
    });
    setItems(result);
    setLoading(false);
  };

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, bucket]);

  const visible = items.filter((i) => !search || i.path.toLowerCase().includes(search.toLowerCase()));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Kies uit mediabibliotheek</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 items-center">
          <Select value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
            <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BUCKETS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-8" placeholder="Zoeken..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
          ) : visible.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">Geen afbeeldingen gevonden.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {visible.map((item) => (
                <button
                  key={`${item.bucket}/${item.path}`}
                  type="button"
                  onClick={() => { onSelect(item.url); onOpenChange(false); }}
                  className="group border rounded-lg overflow-hidden hover:border-primary transition-colors text-left"
                >
                  <div className="aspect-square bg-muted">
                    <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-xs truncate" title={item.path}>{item.name}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
