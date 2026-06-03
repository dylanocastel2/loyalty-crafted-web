import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, XCircle, Circle } from "lucide-react";
import type { Block } from "./blockSchema";
import type { SeoData } from "./SeoFields";

type Status = "good" | "ok" | "bad" | "neutral";
interface Check {
  status: Status;
  label: string;
}

const stripHtml = (s: string) => (s || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");

const collectText = (blocks: Block[] = []): { text: string; headings: string[]; h1: string[]; images: { alt?: string }[]; links: { href?: string; internal: boolean }[] } => {
  const out = { text: "", headings: [] as string[], h1: [] as string[], images: [] as { alt?: string }[], links: [] as { href?: string; internal: boolean }[] };
  const walk = (bs: Block[]) => {
    for (const b of bs) {
      const p = b.props || {};
      // headings & titles
      if (b.type === "heading") {
        const t = stripHtml(p.text || "");
        out.headings.push(t);
        if ((p.level || "h2") === "h1") out.h1.push(t);
      }
      if (b.type === "hero") {
        const t = stripHtml(p.title || "");
        if (t) { out.headings.push(t); out.h1.push(t); }
      }
      ["title", "subtitle", "heading"].forEach((k) => {
        if (p[k] && b.type !== "heading" && b.type !== "hero") {
          out.headings.push(stripHtml(p[k]));
        }
      });
      // body text
      ["text", "content", "description", "body", "subtitle", "title"].forEach((k) => {
        if (typeof p[k] === "string") out.text += " " + stripHtml(p[k]);
      });
      // images
      if (b.type === "image" || p.image_url || p.src) {
        out.images.push({ alt: p.alt || p.image_alt });
      }
      // links / buttons
      if (b.type === "button" || p.href || p.url || p.link) {
        const href = p.href || p.url || p.link || "";
        out.links.push({ href, internal: href.startsWith("/") || href.includes("loyaltygroup") });
      }
      // recurse
      if (Array.isArray(b.children)) {
        for (const col of b.children) walk(col);
      }
    }
  };
  walk(blocks);
  return out;
};

const countWords = (s: string) => (s.trim().match(/\b[\p{L}\p{N}]+\b/gu) || []).length;

const occurrences = (haystack: string, needle: string) => {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  let i = 0, c = 0;
  while ((i = h.indexOf(n, i)) !== -1) { c++; i += n.length; }
  return c;
};

interface Props {
  seo: SeoData;
  blocks?: Block[];
  slug?: string;
  storageKey?: string;
}

const SeoAnalysis = ({ seo, blocks = [], slug = "", storageKey }: Props) => {
  const storeKey = storageKey ? `seo_focus_${storageKey}` : null;
  const [focus, setFocus] = useState<string>(() => {
    if (typeof window === "undefined" || !storeKey) return "";
    return localStorage.getItem(storeKey) || "";
  });

  useEffect(() => {
    if (storeKey) localStorage.setItem(storeKey, focus);
  }, [focus, storeKey]);

  const analysis = useMemo(() => collectText(blocks), [blocks]);

  const checks: Check[] = useMemo(() => {
    const list: Check[] = [];
    const kw = focus.trim();
    const kwLower = kw.toLowerCase();
    const bodyText = analysis.text.trim();
    const wordCount = countWords(bodyText);
    const headingsText = analysis.headings.join(" ").toLowerCase();

    // Focus keyword
    if (!kw) {
      list.push({ status: "bad", label: "Geen focus-zoekwoord ingesteld. Vul er één in om de analyse te starten." });
    } else {
      list.push({ status: "good", label: `Focus-zoekwoord: "${kw}".` });
    }

    // Meta title
    const mt = seo.meta_title || "";
    if (!mt) list.push({ status: "bad", label: "Meta titel ontbreekt." });
    else if (mt.length < 30) list.push({ status: "ok", label: `Meta titel is kort (${mt.length} tekens). Aanbevolen: 30–60.` });
    else if (mt.length > 60) list.push({ status: "ok", label: `Meta titel is lang (${mt.length} tekens). Aanbevolen: 30–60.` });
    else list.push({ status: "good", label: `Meta titel lengte is goed (${mt.length} tekens).` });
    if (kw && mt) {
      if (mt.toLowerCase().includes(kwLower)) list.push({ status: "good", label: "Focus-zoekwoord komt voor in de meta titel." });
      else list.push({ status: "bad", label: "Focus-zoekwoord komt niet voor in de meta titel." });
    }

    // Meta description
    const md = seo.meta_description || "";
    if (!md) list.push({ status: "bad", label: "Meta omschrijving ontbreekt." });
    else if (md.length < 120) list.push({ status: "ok", label: `Meta omschrijving is kort (${md.length} tekens). Aanbevolen: 120–160.` });
    else if (md.length > 160) list.push({ status: "ok", label: `Meta omschrijving is lang (${md.length} tekens). Aanbevolen: 120–160.` });
    else list.push({ status: "good", label: `Meta omschrijving lengte is goed (${md.length} tekens).` });
    if (kw && md) {
      if (md.toLowerCase().includes(kwLower)) list.push({ status: "good", label: "Focus-zoekwoord komt voor in de meta omschrijving." });
      else list.push({ status: "bad", label: "Focus-zoekwoord komt niet voor in de meta omschrijving." });
    }

    // Slug
    if (kw && slug) {
      const slugWords = slug.replace(/-/g, " ");
      if (slugWords.toLowerCase().includes(kwLower)) list.push({ status: "good", label: "Focus-zoekwoord komt voor in de URL (slug)." });
      else list.push({ status: "ok", label: "Focus-zoekwoord komt niet voor in de URL (slug)." });
    }

    // Headings
    if (analysis.h1.length === 0) list.push({ status: "ok", label: "Geen H1/hero-titel gevonden op de pagina." });
    else if (analysis.h1.length > 1) list.push({ status: "ok", label: `Meerdere H1-titels (${analysis.h1.length}). Gebruik er bij voorkeur één.` });
    else list.push({ status: "good", label: "Er is precies één H1/hero-titel." });

    if (kw) {
      if (analysis.h1.join(" ").toLowerCase().includes(kwLower)) list.push({ status: "good", label: "Focus-zoekwoord komt voor in de H1." });
      else list.push({ status: "bad", label: "Focus-zoekwoord komt niet voor in de H1." });
      if (headingsText.includes(kwLower)) list.push({ status: "good", label: "Focus-zoekwoord komt voor in een subkop." });
      else list.push({ status: "ok", label: "Focus-zoekwoord komt niet voor in subkoppen." });
    }

    // Content length
    if (wordCount < 100) list.push({ status: "bad", label: `Erg weinig tekst (${wordCount} woorden). Aanbevolen: minimaal 300.` });
    else if (wordCount < 300) list.push({ status: "ok", label: `Beperkte hoeveelheid tekst (${wordCount} woorden). Aanbevolen: minimaal 300.` });
    else list.push({ status: "good", label: `Voldoende tekst op de pagina (${wordCount} woorden).` });

    // Keyword density
    if (kw && wordCount > 0) {
      const occ = occurrences(bodyText, kw);
      const density = (occ / wordCount) * 100;
      if (occ === 0) list.push({ status: "bad", label: "Focus-zoekwoord komt niet voor in de tekst." });
      else if (density < 0.5) list.push({ status: "ok", label: `Lage zoekwoorddichtheid (${density.toFixed(1)}%, ${occ}×). Streef naar 0,5–2,5%.` });
      else if (density > 3) list.push({ status: "ok", label: `Hoge zoekwoorddichtheid (${density.toFixed(1)}%, ${occ}×). Vermijd overoptimalisatie.` });
      else list.push({ status: "good", label: `Zoekwoorddichtheid is goed (${density.toFixed(1)}%, ${occ}×).` });
    }

    // Images & alt
    if (analysis.images.length === 0) list.push({ status: "ok", label: "Geen afbeeldingen op de pagina." });
    else {
      const missingAlt = analysis.images.filter((i) => !i.alt || !i.alt.trim()).length;
      if (missingAlt === 0) list.push({ status: "good", label: `Alle afbeeldingen (${analysis.images.length}) hebben een alt-tekst.` });
      else list.push({ status: "ok", label: `${missingAlt} van ${analysis.images.length} afbeeldingen mist een alt-tekst.` });
      if (kw) {
        const altKw = analysis.images.some((i) => (i.alt || "").toLowerCase().includes(kwLower));
        if (altKw) list.push({ status: "good", label: "Focus-zoekwoord komt voor in een afbeelding-alt." });
        else list.push({ status: "ok", label: "Focus-zoekwoord komt niet voor in een afbeelding-alt." });
      }
    }

    // Links
    const internal = analysis.links.filter((l) => l.internal).length;
    const external = analysis.links.length - internal;
    if (internal === 0) list.push({ status: "ok", label: "Geen interne links gevonden. Voeg er een paar toe." });
    else list.push({ status: "good", label: `${internal} interne link(s) gevonden.` });
    if (external > 0) list.push({ status: "good", label: `${external} externe link(s) gevonden.` });

    // OG image
    if (!seo.og_image_url) list.push({ status: "ok", label: "Geen social share afbeelding ingesteld." });
    else list.push({ status: "good", label: "Social share afbeelding is ingesteld." });

    return list;
  }, [focus, seo, slug, analysis]);

  const score = useMemo(() => {
    const weights: Record<Status, number> = { good: 1, ok: 0.5, bad: 0, neutral: 0.5 };
    const total = checks.length || 1;
    const sum = checks.reduce((acc, c) => acc + weights[c.status], 0);
    return Math.round((sum / total) * 100);
  }, [checks]);

  const verdict = score >= 80 ? { label: "Goed", color: "text-green-600", bg: "bg-green-500" }
    : score >= 55 ? { label: "Kan beter", color: "text-amber-600", bg: "bg-amber-500" }
    : { label: "Slecht", color: "text-red-600", bg: "bg-red-500" };

  const Icon = ({ status }: { status: Status }) => {
    if (status === "good") return <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />;
    if (status === "ok") return <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />;
    if (status === "bad") return <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />;
    return <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />;
  };

  const groups: { key: Status; title: string }[] = [
    { key: "bad", title: "Problemen" },
    { key: "ok", title: "Verbeteringen" },
    { key: "good", title: "Goed" },
  ];

  return (
    <div className="border rounded-lg p-5 space-y-5 bg-card">
      <div>
        <h3 className="text-lg font-bold mb-1">SEO-beoordeling</h3>
        <p className="text-sm text-muted-foreground">Automatische analyse in de stijl van Yoast SEO.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="seo-focus">Focus-zoekwoord</Label>
        <Input
          id="seo-focus"
          value={focus}
          onChange={(e) => setFocus(e.target.value)}
          placeholder="Bijv. loyaliteitsprogramma"
        />
        <p className="text-xs text-muted-foreground">Het belangrijkste woord of zinsdeel waarop deze pagina moet ranken.</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.9" fill="none"
              stroke="currentColor"
              className={verdict.color}
              strokeWidth="3"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">{score}</div>
        </div>
        <div>
          <div className={`font-semibold ${verdict.color}`}>{verdict.label}</div>
          <div className="text-xs text-muted-foreground">{checks.length} controles uitgevoerd</div>
        </div>
      </div>

      <div className="space-y-4">
        {groups.map((g) => {
          const items = checks.filter((c) => c.status === g.key);
          if (items.length === 0) return null;
          return (
            <div key={g.key}>
              <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{g.title} ({items.length})</div>
              <ul className="space-y-1.5">
                {items.map((c, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Icon status={c.status} />
                    <span>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeoAnalysis;