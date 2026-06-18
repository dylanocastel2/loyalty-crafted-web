import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Trash2, Copy, FileIcon, Search, RefreshCw, CheckCircle2, Download } from "lucide-react";

const BUCKETS = ["media", "page-media", "form-uploads"] as const;
type Bucket = (typeof BUCKETS)[number];
const PRIVATE_BUCKETS: readonly Bucket[] = ["form-uploads"];
const isPrivate = (b: Bucket) => PRIVATE_BUCKETS.includes(b);

async function resolveUrl(bucket: Bucket, name: string): Promise<string> {
  if (isPrivate(bucket)) {
    const { data } = await supabase.storage.from(bucket).createSignedUrl(name, 3600);
    return data?.signedUrl ?? "";
  }
  return supabase.storage.from(bucket).getPublicUrl(name).data.publicUrl;
}

type FileRow = {
  name: string;
  id: string | null;
  updated_at: string | null;
  created_at: string | null;
  metadata: { size?: number; mimetype?: string } | null;
};

function isImage(name: string, mime?: string) {
  if (mime?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
}

function formatBytes(b?: number) {
  if (!b) return "";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

async function listRecursive(bucket: Bucket, prefix = ""): Promise<FileRow[]> {
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];
  const out: FileRow[] = [];
  for (const item of data) {
    if (!item.name || item.name === ".emptyFolderPlaceholder") continue;
    const full = prefix ? `${prefix}/${item.name}` : item.name;
    const isFolder = (item as { id: string | null }).id === null && !(item as { metadata: unknown }).metadata;
    if (isFolder) {
      const sub = await listRecursive(bucket, full);
      out.push(...sub);
    } else {
      out.push({ ...(item as FileRow), name: full });
    }
  }
  return out;
}

export default function MediaLibrary() {
  const { toast } = useToast();
  const [bucket, setBucket] = useState<Bucket>("media");
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [usedUrls, setUsedUrls] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<"all" | "used" | "unused">("all");
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const rows = await listRecursive(bucket);
      setFiles(rows);
    } catch (e) {
      toast({ title: "Laden mislukt", description: (e as Error).message, variant: "destructive" });
      setFiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket]);

  // For private buckets, fetch signed URLs for previews
  useEffect(() => {
    if (!isPrivate(bucket) || files.length === 0) {
      setSignedUrls({});
      return;
    }
    let cancelled = false;
    (async () => {
      const names = files.map((f) => f.name);
      const { data } = await supabase.storage.from(bucket).createSignedUrls(names, 3600);
      if (cancelled || !data) return;
      const map: Record<string, string> = {};
      for (const item of data) {
        if (item.path && item.signedUrl) map[item.path] = item.signedUrl;
      }
      setSignedUrls(map);
    })();
    return () => { cancelled = true; };
  }, [bucket, files]);

  useEffect(() => {
    const loadUsed = async () => {
      const urls = new Set<string>();
      const collect = (val: unknown) => {
        if (!val) return;
        if (typeof val === "string") {
          const re = /https?:\/\/[^\s"')]+\.(?:png|jpe?g|gif|webp|svg|avif|pdf)/gi;
          const matches = val.match(re);
          if (matches) matches.forEach((u) => urls.add(u));
        } else if (Array.isArray(val)) {
          val.forEach(collect);
        } else if (typeof val === "object") {
          Object.values(val as Record<string, unknown>).forEach(collect);
        }
      };
      const [cp, pb, pc, kc] = await Promise.all([
        supabase.from("custom_pages").select("blocks,og_image_url"),
        supabase.from("page_blocks").select("blocks"),
        supabase.from("page_content").select("content"),
        supabase.from("klantcases").select("image_url,header_image_url,video_url"),
      ]);
      [cp.data, pb.data, pc.data, kc.data].forEach((rows) => rows?.forEach(collect));
      setUsedUrls(urls);
    };
    loadUsed();
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    let okCount = 0;
    let failCount = 0;
    for (const file of Array.from(fileList)) {
      const ext = file.name.split(".").pop();
      const safe = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60);
      const path = `${Date.now()}-${safe}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) failCount++;
      else okCount++;
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    toast({
      title: failCount === 0 ? "Geüpload" : "Deels gelukt",
      description: `${okCount} bestand(en) toegevoegd${failCount ? `, ${failCount} mislukt` : ""}.`,
      variant: failCount && !okCount ? "destructive" : "default",
    });
    load();
  };

  const remove = async (name: string) => {
    if (!confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) return;
    const { error } = await supabase.storage.from(bucket).remove([name]);
    if (error) {
      toast({ title: "Verwijderen mislukt", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Verwijderd" });
    load();
  };

  const copyUrl = async (name: string) => {
    const url = await resolveUrl(bucket, name);
    if (!url) {
      toast({ title: "URL ophalen mislukt", variant: "destructive" });
      return;
    }
    await navigator.clipboard.writeText(url);
    toast({ title: isPrivate(bucket) ? "Tijdelijke URL gekopieerd (1 uur geldig)" : "URL gekopieerd", description: url });
  };

  const downloadFile = async (name: string) => {
    const url = await resolveUrl(bucket, name);
    if (!url) {
      toast({ title: "URL ophalen mislukt", variant: "destructive" });
      return;
    }
    const a = document.createElement("a");
    a.href = url;
    a.download = name.split("/").pop() || name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filtered = files.filter((f) => {
    if (!f.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter === "all") return true;
    if (isPrivate(bucket)) {
      // Private files (form attachments) are never embedded on public pages
      return filter === "unused";
    }
    const url = supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl;
    const isUsed = usedUrls.has(url);
    return filter === "used" ? isUsed : !isUsed;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex gap-2 items-center">
          <Select value={bucket} onValueChange={(v) => setBucket(v as Bucket)}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {BUCKETS.map((b) => (
                <SelectItem key={b} value={b}>{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={load} title="Verversen">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek bestand..." className="pl-8 w-56" />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle bestanden</SelectItem>
              <SelectItem value="used">Alleen gebruikt</SelectItem>
              <SelectItem value="unused">Niet gebruikt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <input ref={inputRef} type="file" multiple onChange={onUpload} className="hidden" id="media-upload" />
          <label htmlFor="media-upload">
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploaden..." : "Upload bestanden"}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {loading ? (
        <div className="text-muted-foreground py-12 text-center">Bestanden laden…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
          Geen bestanden gevonden.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filtered.map((f) => {
            const url = isPrivate(bucket)
              ? (signedUrls[f.name] || "")
              : supabase.storage.from(bucket).getPublicUrl(f.name).data.publicUrl;
            const img = isImage(f.name, f.metadata?.mimetype);
            const used = !isPrivate(bucket) && usedUrls.has(url);
            return (
              <div key={f.name} className="bg-card border rounded-lg overflow-hidden group">
                <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden relative">
                  {img ? (
                    <img src={url} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <FileIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                  {used && (
                    <span className="absolute top-1 left-1 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 shadow">
                      <CheckCircle2 className="h-3 w-3" /> In gebruik
                    </span>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <div className="text-xs font-medium truncate" title={f.name}>{f.name}</div>
                  <div className="text-[10px] text-muted-foreground">{formatBytes(f.metadata?.size)}</div>
                  <div className="flex gap-1 pt-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="URL kopiëren" onClick={() => copyUrl(f.name)}>
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Downloaden" onClick={() => downloadFile(f.name)}>
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" title="Verwijderen" onClick={() => remove(f.name)}>
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}