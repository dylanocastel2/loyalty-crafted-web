import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EditableButtonProps {
  page: string;
  contentKey: string;
  defaultValue: string;
  to: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

const EditableButton = ({
  page,
  contentKey,
  defaultValue,
  to,
  size = "lg",
  variant = "default",
  className = "",
}: EditableButtonProps) => {
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
    const { data: existing } = await supabase
      .from("page_content")
      .select("id")
      .eq("page", page)
      .eq("key", contentKey)
      .maybeSingle();

    if (existing) {
      await supabase.from("page_content").update({ content: value }).eq("id", existing.id);
    } else {
      await supabase.from("page_content").insert({ page, key: contentKey, content: value });
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
    return (
      <Link to={to}>
        <Button size={size} variant={variant} className={className}>
          {displayValue}
        </Button>
      </Link>
    );
  }

  if (editing) {
    return (
      <div className="inline-flex items-center gap-2 border-2 border-primary rounded-md p-2 bg-background">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="text-foreground min-w-[150px]"
          autoFocus
        />
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
    );
  }

  return (
    <div className="relative group inline-block">
      <Link to={to}>
        <Button size={size} variant={variant} className={className}>
          {displayValue}
        </Button>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditing(true); }}
        className="absolute -top-2 -right-8 p-1 rounded bg-primary text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
        title="Knoptekst bewerken"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default EditableButton;
