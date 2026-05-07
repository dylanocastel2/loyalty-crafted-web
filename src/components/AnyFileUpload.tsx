import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, FileIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  onUpload: (url: string, name: string, sizeBytes: number) => void;
  currentUrl?: string;
  currentName?: string;
  folder?: string;
  maxMb?: number;
}

const formatSize = (bytes: number) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const AnyFileUpload = ({ onUpload, currentUrl, currentName, folder = "downloads", maxMb = 50 }: Props) => {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState<string | null>(currentName || (currentUrl ? currentUrl.split("/").pop() || "" : null));
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const upload = async (file: File) => {
    if (file.size > maxMb * 1024 * 1024) {
      toast({ title: "Bestand te groot", description: `Maximaal ${maxMb}MB per bestand.`, variant: "destructive" });
      return;
    }
    setUploading(true);
    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type || "application/octet-stream" });
    if (error) {
      toast({ title: "Upload mislukt", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("media").getPublicUrl(path);
    setName(file.name);
    onUpload(data.publicUrl, file.name, file.size);
    setUploading(false);
    toast({ title: "Bestand geüpload" });
  };

  const remove = () => {
    setName(null);
    onUpload("", "", 0);
  };

  return (
    <div>
      {name ? (
        <div className="flex items-center gap-2 border rounded-lg p-3 bg-muted/30">
          <FileIcon className="h-5 w-5 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            {currentUrl && (
              <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary truncate block">
                Bekijk bestand
              </a>
            )}
          </div>
          <button type="button" onClick={remove} className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">Uploaden...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-medium">Klik om bestand te selecteren</p>
              <p className="text-xs text-muted-foreground">Alle bestandstypen — max {maxMb}MB</p>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }}
        className="hidden"
      />
    </div>
  );
};

export { formatSize };
export default AnyFileUpload;
