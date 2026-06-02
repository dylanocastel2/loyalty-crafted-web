import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bold, Italic, Underline, Palette, Eraser, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lichtgewicht rich-text editor met kleur-selectie.
 * Slaat een veilige HTML-string op (alleen span style=color, strong, em, u, br).
 * Backwards compatible: bestaande platte tekst wordt automatisch correct getoond.
 */

const PRESET_COLORS: { label: string; value: string }[] = [
  { label: "Primair", value: "hsl(var(--primary))" },
  { label: "Secundair", value: "hsl(var(--secondary))" },
  { label: "Aqua", value: "hsl(var(--aqua))" },
  { label: "Glow", value: "hsl(var(--primary-glow))" },
  { label: "Inkt", value: "hsl(var(--ink))" },
  { label: "Tekst", value: "hsl(var(--foreground))" },
  { label: "Gedempt", value: "hsl(var(--muted-foreground))" },
  { label: "Wit", value: "#ffffff" },
  { label: "Zwart", value: "#000000" },
  { label: "Diep blauw", value: "#084261" },
  { label: "Middel blauw", value: "#4db8db" },
  { label: "Destructive", value: "hsl(var(--destructive))" },
];

export const SANITIZED_TAGS = ["span", "strong", "b", "em", "i", "u", "br", "a", "div", "p"];

const BLOCK_TAGS = ["section", "article", "header", "footer", "li", "h1", "h2", "h3", "h4", "h5", "h6"];

const sanitizeUrl = (url: string): string => {
  const u = url.trim();
  if (!u) return "";
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(u)) return u;
  if (/^[\w.-]+\.[a-z]{2,}/i.test(u)) return `https://${u}`;
  return "";
};

/** Sanitize HTML voor opslag/weergave — staat alleen veilige inline opmaak toe.
 *  Block-tags (div/p) worden omgezet naar hun inhoud + <br/> zodat Enter regelafbrekingen bewaard blijven. */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  if (typeof window === "undefined") return html;
  const tpl = document.createElement("template");
  tpl.innerHTML = html;
  const walk = (node: Element) => {
    [...node.children].forEach((el) => walk(el));
    const tag = node.tagName.toLowerCase();
    if (!SANITIZED_TAGS.includes(tag)) {
      const parent = node.parentNode;
      if (!parent) return;
      const isBlock = BLOCK_TAGS.includes(tag);
      // Verplaats kinderen naar parent op deze positie
      while (node.firstChild) parent.insertBefore(node.firstChild, node);
      if (isBlock) parent.insertBefore(document.createElement("br"), node);
      parent.removeChild(node);
      return;
    }
    [...node.attributes].forEach((attr) => {
      if (attr.name === "style") {
        const parts: string[] = [];
        const color = attr.value.match(/(?:^|;)\s*color\s*:\s*([^;]+)/i);
        if (color && (tag === "span" || tag === "a" || tag === "div" || tag === "p")) {
          parts.push(`color:${color[1].trim()}`);
        }
        const align = attr.value.match(/text-align\s*:\s*([^;]+)/i);
        if (align && (tag === "div" || tag === "p")) {
          const v = align[1].trim().toLowerCase();
          if (["left", "center", "right", "justify"].includes(v)) parts.push(`text-align:${v}`);
        }
        if (parts.length) node.setAttribute("style", parts.join(";"));
        else node.removeAttribute("style");
      } else if (tag === "a" && attr.name === "href") {
        const safe = sanitizeUrl(attr.value);
        if (safe) node.setAttribute("href", safe);
        else node.removeAttribute("href");
      } else if (tag === "a" && (attr.name === "target" || attr.name === "rel")) {
        // toegestaan
      } else {
        node.removeAttribute(attr.name);
      }
    });
    if (tag === "a") {
      node.setAttribute("target", "_blank");
      node.setAttribute("rel", "noopener noreferrer");
    }
  };
  [...tpl.content.children].forEach((el) => walk(el as Element));
  // Verwijder dubbele <br/> aan einde
  let out = tpl.innerHTML;
  out = out.replace(/(<br\s*\/?>\s*)+$/i, "");
  return out;
}

/** Render-helper: zet platte tekst (zonder tags) om naar HTML met <br/>; sanitize anders. */
export function toRenderHtml(value?: string): string {
  if (!value) return "";
  const hasTags = /<[a-z][\s\S]*>/i.test(value);
  if (!hasTags) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\n/g, "<br/>");
  }
  return sanitizeRichText(value);
}

interface Props {
  value: string;
  onChange: (html: string) => void;
  singleLine?: boolean;
  rows?: number;
  placeholder?: string;
  className?: string;
}

const RichText = ({ value, onChange, singleLine, rows = 4, placeholder, className }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const focusedRef = useRef(false);
  const [, force] = useState(0);

  // Sync alleen wanneer editor NIET gefocust is — anders verspringt de cursor bij elke toetsaanslag.
  useEffect(() => {
    if (!ref.current) return;
    if (focusedRef.current) return;
    const current = ref.current.innerHTML;
    const incoming = toRenderHtml(value);
    if (current !== incoming) ref.current.innerHTML = incoming;
  }, [value]);

  const emit = () => {
    if (!ref.current) return;
    onChange(sanitizeRichText(ref.current.innerHTML));
  };

  const exec = (cmd: string, val?: string) => {
    if (!ref.current) return;
    ref.current.focus();
    try {
      document.execCommand("styleWithCSS", false, "true");
    } catch {}
    document.execCommand(cmd, false, val);
    emit();
    force((n) => n + 1);
  };

  const applyColor = (color: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    exec("foreColor", color);
  };

  const clearColor = () => exec("removeFormat");

  const insertLink = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
      window.alert("Selecteer eerst de tekst die je tot een link wilt maken.");
      return;
    }
    const current = (sel.anchorNode?.parentElement?.closest?.("a") as HTMLAnchorElement | null)?.href || "";
    const url = window.prompt("Geef de URL op:", current || "https://");
    if (url === null) return;
    if (!url.trim()) {
      exec("unlink");
      return;
    }
    const safe = sanitizeUrl(url);
    if (!safe) return;
    exec("createLink", safe);
  };

  const removeLink = () => exec("unlink");

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (singleLine && e.key === "Enter") {
      e.preventDefault();
      return;
    }
    // Forceer <br/> bij Enter (in plaats van browser-default <div>/<p>) — voorkomt rare regelafstand.
    if (!singleLine && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      try {
        document.execCommand("insertLineBreak");
      } catch {
        document.execCommand("insertHTML", false, "<br/>");
      }
      emit();
    }
  };

  return (
    <div className={cn("border rounded-md bg-background", className)}>
      <div className="flex items-center gap-1 px-1.5 py-1 border-b bg-muted/30">
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Vet" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("bold")}>
          <Bold className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Cursief" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("italic")}>
          <Italic className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Onderstrepen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("underline")}>
          <Underline className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        {!singleLine && (
          <>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Links uitlijnen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyLeft")}>
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Centreren" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyCenter")}>
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Rechts uitlijnen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyRight")}>
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Uitvullen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyFull")}>
              <AlignJustify className="h-3.5 w-3.5" />
            </Button>
            <div className="w-px h-4 bg-border mx-0.5" />
          </>
        )}
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Hyperlink toevoegen" onMouseDown={(e) => e.preventDefault()} onClick={insertLink}>
          <LinkIcon className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Hyperlink verwijderen" onMouseDown={(e) => e.preventDefault()} onClick={removeLink}>
          <Unlink className="h-3.5 w-3.5" />
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Tekstkleur" onMouseDown={(e) => e.preventDefault()}>
              <Palette className="h-3.5 w-3.5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
            <p className="text-[11px] text-muted-foreground mb-2">Selecteer eerst tekst, kies dan een kleur</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.label}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyColor(c.value)}
                  className="h-7 w-7 rounded border border-border hover:scale-110 transition-transform"
                  style={{ background: c.value }}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Type className="h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="color"
                onChange={(e) => applyColor(e.target.value)}
                className="h-7 w-full rounded border border-border bg-transparent cursor-pointer"
                title="Eigen kleur"
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Opmaak wissen" onMouseDown={(e) => e.preventDefault()} onClick={clearColor}>
          <Eraser className="h-3.5 w-3.5" />
        </Button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onFocus={() => { focusedRef.current = true; }}
        onBlur={() => { focusedRef.current = false; emit(); }}
        onKeyDown={onKeyDown}
        className={cn(
          "px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 rounded-b-md",
          "[&_a]:text-primary [&_a]:underline",
          "[&[data-placeholder]:empty]:before:content-[attr(data-placeholder)] [&[data-placeholder]:empty]:before:text-muted-foreground",
          singleLine ? "min-h-[2rem]" : "whitespace-pre-wrap"
        )}
        style={{ minHeight: singleLine ? undefined : `${rows * 1.5}rem` }}
      />
    </div>
  );
};

export default RichText;