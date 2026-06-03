import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bold, Italic, Underline, Palette, Eraser, Type, AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink, CaseSensitive } from "lucide-react";
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

// Numerieke lettergroottes in pixels — zelfde schaal als gangbare editors (Word/Docs).
const FONT_SIZES: number[] = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];

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
        const fsize = attr.value.match(/(?:^|;)\s*font-size\s*:\s*([^;]+)/i);
        if (fsize && (tag === "span" || tag === "a" || tag === "div" || tag === "p")) {
          const v = fsize[1].trim();
          // Sta alleen veilige eenheden toe
          if (/^[0-9.]+(px|rem|em|%)$/i.test(v)) parts.push(`font-size:${v}`);
        }
        const fweight = attr.value.match(/(?:^|;)\s*font-weight\s*:\s*([^;]+)/i);
        if (fweight && (tag === "span" || tag === "a" || tag === "div" || tag === "p")) {
          const v = fweight[1].trim().toLowerCase();
          if (/^(bold|bolder|lighter|normal|[1-9]00)$/.test(v)) parts.push(`font-weight:${v}`);
        }
        const fstyle = attr.value.match(/(?:^|;)\s*font-style\s*:\s*([^;]+)/i);
        if (fstyle && (tag === "span" || tag === "a" || tag === "div" || tag === "p")) {
          const v = fstyle[1].trim().toLowerCase();
          if (["italic", "normal", "oblique"].includes(v)) parts.push(`font-style:${v}`);
        }
        const tdec = attr.value.match(/(?:^|;)\s*text-decoration(?:-line)?\s*:\s*([^;]+)/i);
        if (tdec && (tag === "span" || tag === "a" || tag === "div" || tag === "p")) {
          const v = tdec[1].trim().toLowerCase();
          if (/^(underline|line-through|overline|none)(\s+(underline|line-through|overline))*$/.test(v)) {
            parts.push(`text-decoration:${v}`);
          }
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
  const [currentSize, setCurrentSize] = useState<number | null>(null);

  // Detecteer huidige lettergrootte op basis van selectie/cursor
  const detectFontSize = () => {
    if (!ref.current) return;
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    let node: Node | null = sel.anchorNode;
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement;
    if (!(node instanceof Element)) return;
    if (!ref.current.contains(node)) return;
    const px = parseFloat(window.getComputedStyle(node).fontSize || "");
    if (!Number.isNaN(px)) setCurrentSize(Math.round(px));
  };

  useEffect(() => {
    const handler = () => {
      if (focusedRef.current) detectFontSize();
    };
    document.addEventListener("selectionchange", handler);
    return () => document.removeEventListener("selectionchange", handler);
  }, []);

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
    const useTags = cmd === "bold" || cmd === "italic" || cmd === "underline";
    try {
      document.execCommand("styleWithCSS", false, useTags ? "false" : "true");
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

  const applyFontSize = (size: string) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    if (!ref.current) return;
    ref.current.focus();
    const range = sel.getRangeAt(0);
    // Wikkel selectie in span met font-size; behoud bestaande opmaak.
    const span = document.createElement("span");
    span.style.fontSize = size;
    try {
      span.appendChild(range.extractContents());
      range.insertNode(span);
      // Herstel selectie over de nieuwe span
      const newRange = document.createRange();
      newRange.selectNodeContents(span);
      sel.removeAllRanges();
      sel.addRange(newRange);
    } catch {}
    emit();
    force((n) => n + 1);
    detectFontSize();
  };

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
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Links uitlijnen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyLeft")}>
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Centreren" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyCenter")}>
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Rechts uitlijnen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyRight")}>
          <AlignRight className="h-3.5 w-3.5" />
        </Button>
        {!singleLine && (
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" title="Uitvullen" onMouseDown={(e) => e.preventDefault()} onClick={() => exec("justifyFull")}>
            <AlignJustify className="h-3.5 w-3.5" />
          </Button>
        )}
        <div className="w-px h-4 bg-border mx-0.5" />

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
        <div className="w-px h-4 bg-border mx-0.5" />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-1.5 gap-1"
              title={currentSize ? `Lettergrootte: ${currentSize}px` : "Lettergrootte"}
              onMouseDown={(e) => e.preventDefault()}
            >
              <CaseSensitive className="h-3.5 w-3.5" />
              <span className="text-[11px] tabular-nums min-w-[1.5ch] text-left">
                {currentSize ?? "–"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
            <p className="text-[11px] text-muted-foreground mb-2 px-1">
              Huidig: <span className="font-medium text-foreground">{currentSize ? `${currentSize}px` : "–"}</span> · Selecteer tekst, kies grootte (px)
            </p>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Input
                type="number"
                placeholder="Eigen grootte..."
                min={1}
                max={200}
                defaultValue={currentSize ?? ""}
                className="h-8 text-sm"
                onMouseDown={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = parseInt((e.currentTarget as HTMLInputElement).value, 10);
                    if (!Number.isNaN(val) && val > 0 && val <= 200) {
                      applyFontSize(`${val}px`);
                    }
                  }
                }}
                onBlur={(e) => {
                  const val = parseInt(e.currentTarget.value, 10);
                  if (!Number.isNaN(val) && val > 0 && val <= 200) {
                    applyFontSize(`${val}px`);
                  }
                }}
              />
              <span className="text-xs text-muted-foreground">px</span>
            </div>
            <div className="grid grid-cols-6 gap-1 max-h-56 overflow-auto">
              {FONT_SIZES.map((n) => (
                <button
                  key={n}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyFontSize(`${n}px`)}
                  className={cn(
                    "h-8 rounded border border-border hover:bg-muted text-xs tabular-nums",
                    currentSize === n && "bg-primary text-primary-foreground border-primary"
                  )}
                  title={`${n}px`}
                >
                  {n}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onFocus={() => { focusedRef.current = true; detectFontSize(); }}
        onBlur={() => { focusedRef.current = false; emit(); }}
        onKeyDown={onKeyDown}
        onKeyUp={detectFontSize}
        onMouseUp={detectFontSize}
        className={cn(
          "px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40 rounded-b-md overflow-y-auto overflow-x-hidden break-words",
          "[&_a]:text-primary [&_a]:underline",
          "[&[data-placeholder]:empty]:before:content-[attr(data-placeholder)] [&[data-placeholder]:empty]:before:text-muted-foreground",
          singleLine ? "min-h-[2rem]" : "whitespace-pre-wrap"
        )}
        style={{
          minHeight: singleLine ? undefined : `${rows * 1.5}rem`,
          maxHeight: singleLine ? undefined : `24rem`,
        }}
      />
    </div>
  );
};

export default RichText;