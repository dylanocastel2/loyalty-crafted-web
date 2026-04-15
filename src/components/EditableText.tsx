import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface EditableTextProps {
  page: string;
  contentKey: string;
  defaultValue: string;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
  className?: string;
  multiline?: boolean;
}

const EditableText = ({
  page,
  contentKey,
  defaultValue,
  as: Tag = "p",
  className = "",
  multiline = false,
}: EditableTextProps) => {
  const { isAdmin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [savedValue, setSavedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", page)
        .eq("key", contentKey)
        .maybeSingle();
      if (data?.content) {
        setValue(data.content);
        setSavedValue(data.content);
      }
    };
    fetch();
  }, [page, contentKey]);

  const displayValue = savedValue ?? defaultValue;

  const handleSave = async () => {
    setLoading(true);
    // Upsert
    const { data: existing } = await supabase
      .from("page_content")
      .select("id")
      .eq("page", page)
      .eq("key", contentKey)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("page_content")
        .update({ content: value })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("page_content")
        .insert({ page, key: contentKey, content: value });
    }

    setSavedValue(value);
    setEditing(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setValue(displayValue);
    setEditing(false);
  };

  if (!isAdmin) {
    return <Tag className={className}>{displayValue}</Tag>;
  }

  if (editing) {
    return (
      <div className="relative border-2 border-primary rounded-md p-2 bg-background">
        {multiline ? (
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="min-h-[80px] text-foreground"
            autoFocus
          />
        ) : (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="text-foreground"
            autoFocus
          />
        )}
        <div className="flex gap-1 mt-2 justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="p-1.5 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            onClick={handleCancel}
            className="p-1.5 rounded bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group inline-block pr-8">
      <Tag className={className}>{displayValue}</Tag>
      <button
        onClick={() => setEditing(true)}
        className="absolute top-0 right-0 p-1 rounded bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
        title="Bewerken"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default EditableText;
