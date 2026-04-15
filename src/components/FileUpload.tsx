import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUpload: (url: string) => void;
  currentUrl?: string;
  folder?: string;
}

const FileUpload = ({ onUpload, currentUrl, folder = "uploads" }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("application/pdf")) {
      toast({ title: "Ongeldig bestandstype", description: "Alleen afbeeldingen en PDF's zijn toegestaan.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Bestand te groot", description: "Maximaal 5MB per bestand.", variant: "destructive" });
      return;
    }

    setUploading(true);
    const ext = file.name.split(".").pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from("media").upload(fileName, file);
    if (error) {
      toast({ title: "Upload mislukt", description: error.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
    const publicUrl = urlData.publicUrl;
    setPreview(publicUrl);
    onUpload(publicUrl);
    setUploading(false);
    toast({ title: "Bestand geüpload" });
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onUpload("");
  };

  return (
    <div>
      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="max-h-48 rounded-lg border object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-muted/50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploaden...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium">Sleep een bestand hierheen</p>
              <p className="text-xs text-muted-foreground">of klik om een bestand te selecteren</p>
              <p className="text-xs text-muted-foreground">Max 5MB — Afbeeldingen & PDF's</p>
            </div>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
