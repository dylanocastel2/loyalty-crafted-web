import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Paperclip, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface FormAttachment {
  url: string;
  name: string;
  size: number;
}

interface Props {
  value: FormAttachment[];
  onChange: (files: FormAttachment[]) => void;
  maxFiles?: number;
  maxMb?: number;
}

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const FormAttachments = ({ value, onChange, maxFiles = 3, maxMb = 10 }: Props) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = maxFiles - value.length;
    if (remaining <= 0) {
      toast({ title: "Maximum aantal bijlagen bereikt", variant: "destructive" });
      return;
    }
    setUploading(true);
    const next: FormAttachment[] = [...value];
    for (const file of Array.from(files).slice(0, remaining)) {
      if (file.size > maxMb * 1024 * 1024) {
        toast({ title: "Bestand te groot", description: `${file.name} > ${maxMb}MB`, variant: "destructive" });
        continue;
      }
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safe}`;
      const { error } = await supabase.storage.from("form-uploads").upload(path, file, {
        contentType: file.type || "application/octet-stream",
      });
      if (error) {
        toast({ title: "Upload mislukt", description: error.message, variant: "destructive" });
        continue;
      }
      const { data } = supabase.storage.from("form-uploads").getPublicUrl(path);
      next.push({ url: data.publicUrl, name: file.name, size: file.size });
    }
    onChange(next);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Uploaden...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-sm">
            <Upload className="h-4 w-4 text-muted-foreground" />
            <span>Klik om bestand(en) toe te voegen</span>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-1">Max {maxFiles} bestanden — {maxMb}MB per stuk</p>
      </div>
      {value.length > 0 && (
        <ul className="space-y-1">
          {value.map((f, i) => (
            <li key={i} className="flex items-center gap-2 border rounded-md p-2 bg-muted/30 text-sm">
              <Paperclip className="h-4 w-4 text-primary shrink-0" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-muted-foreground">{formatSize(f.size)}</span>
              <button type="button" onClick={() => remove(i)} className="p-1 rounded hover:bg-destructive hover:text-destructive-foreground">
                <X className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <input
        ref={inputRef}
        type="file"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
};

export default FormAttachments;