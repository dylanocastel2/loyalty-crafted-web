import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { BUILTIN_PAGES } from "@/lib/builtinPages";

interface Entry {
  label: string;
  path: string;
  description?: string;
}

interface Props {
  placeholder?: string;
  buttonLabel?: string;
  maxWidth?: number; // px
  align?: "left" | "center" | "right";
  variant?: "default" | "rounded" | "pill";
  showButton?: boolean;
}

const SearchBlock = ({
  placeholder = "Waar bent u naar op zoek?",
  buttonLabel = "Zoek",
  maxWidth = 560,
  align = "center",
  variant = "rounded",
  showButton = true,
}: Props) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [customPages, setCustomPages] = useState<Entry[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("custom_pages")
      .select("title,slug,meta_description")
      .eq("published", true)
      .then(({ data }) => {
        if (!data) return;
        setCustomPages(
          data.map((d: any) => ({
            label: d.title,
            path: `/p/${d.slug}`,
            description: d.meta_description || undefined,
          }))
        );
      });
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const entries: Entry[] = useMemo(
    () => [
      ...BUILTIN_PAGES.map((p) => ({ label: p.label, path: p.path })),
      ...customPages,
    ],
    [customPages]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return entries
      .filter(
        (e) =>
          e.label.toLowerCase().includes(q) ||
          (e.description || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, entries]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) {
      navigate(results[0].path);
      setOpen(false);
      setQuery("");
    }
  };

  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  const radius =
    variant === "pill" ? "rounded-full" : variant === "default" ? "rounded-md" : "rounded-xl";

  return (
    <div className={`w-full flex ${justify}`}>
      <div ref={wrapperRef} className="relative w-full" style={{ maxWidth }}>
        <form
          onSubmit={submit}
          className={`flex items-center gap-2 bg-card border shadow-sm ${radius} pl-3 pr-1 py-1`}
        >
          <Search className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            aria-label="Zoeken op de site"
            className="border-0 shadow-none focus-visible:ring-0 px-1 h-10 bg-transparent"
          />
          {showButton && (
            <Button type="submit" size="sm" className={radius}>
              {buttonLabel}
            </Button>
          )}
        </form>

        {open && query && (
          <div className="absolute z-50 left-0 right-0 mt-2 bg-popover border rounded-lg shadow-lg overflow-hidden">
            {results.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Geen resultaten voor "{query}"
              </div>
            ) : (
              <ul className="py-1">
                {results.map((r) => (
                  <li key={r.path}>
                    <button
                      type="button"
                      onClick={() => {
                        navigate(r.path);
                        setOpen(false);
                        setQuery("");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="text-sm font-medium text-foreground">{r.label}</div>
                      {r.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {r.description}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground/70">{r.path}</div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBlock;