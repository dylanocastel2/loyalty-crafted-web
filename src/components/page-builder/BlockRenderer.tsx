import { Block } from "./blockSchema";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Quote } from "lucide-react";
import * as Icons from "lucide-react";
import KlantcasesBlock from "./KlantcasesBlock";
import SearchBlock from "./SearchBlock";
import CustomFormBlock from "./CustomFormBlock";
import USPGrid from "@/components/sections/USPGrid";
import ReviewsBlock from "@/components/sections/ReviewsBlock";
import PriceIndication from "@/components/sections/PriceIndication";
import DemoCTA from "@/components/sections/DemoCTA";
import DemoForm from "@/components/sections/DemoForm";
import LaagdrempeligBlock from "@/components/sections/LaagdrempeligBlock";
import { useBranches, useBranche } from "@/hooks/useBranches";
import BrancheIcon from "@/components/BrancheIcon";
import { useParams } from "react-router-dom";
import { ArrowRight, Sparkles, Target, Lightbulb, Check } from "lucide-react";
import EditableText from "@/components/EditableText";
import KlantcasesBlockComp from "./KlantcasesBlock";

const BrancheGridBlock = ({ title, subtitle }: { title?: string; subtitle?: string }) => {
  const { branches } = useBranches();
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container">
        {(title || subtitle) && (
          <div className="max-w-2xl mb-10">
            {title && <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className="group rounded-2xl border border-border bg-tile p-7 hover:shadow-soft hover:border-primary/40 transition-all flex flex-col"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-primary mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <BrancheIcon name={b.icon} className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-display font-semibold mb-2">{b.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{b.shortDesc}</p>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Bekijk oplossingen <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const BrancheDetailBlock = () => {
  const { slug = "" } = useParams<{ slug: string }>();
  const { branche: data, loading } = useBranche(slug);
  const { branches } = useBranches();
  if (loading) return <div className="container py-24 text-center text-muted-foreground">Laden...</div>;
  if (!data) return <div className="container py-24 text-center text-muted-foreground">Branche niet gevonden.</div>;
  const pageKey = `branche-${data.slug}`;
  return (
    <>
      <div className="border-b border-border bg-mist">
        <div className="container py-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">Andere branche:</span>
          {branches.map((b) => (
            <Link
              key={b.slug}
              to={`/branches/${b.slug}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                b.slug === data.slug ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary hover:text-primary"
              }`}
            >
              {b.label}
            </Link>
          ))}
        </div>
      </div>
      <section className="relative overflow-hidden bg-hero py-20 md:py-28">
        <div className="absolute inset-0 dot-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)]" />
        <div className="container relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6 shadow-soft">
            <BrancheIcon name={data.icon} className="h-3.5 w-3.5 text-primary" />
            <EditableText page={pageKey} contentKey="hero_badge" defaultValue={data.label} as="span" />
          </div>
          <EditableText page={pageKey} contentKey="hero_title" defaultValue={data.heroTitle} as="h1" className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-5 leading-[1.05]" multiline />
          <EditableText page={pageKey} contentKey="hero_subtitle" defaultValue={data.heroSubtitle} as="p" className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8" multiline />
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/demo"><Button size="lg" className="rounded-full font-semibold">Plan een demo →</Button></Link>
            <Link to="/contact"><Button size="lg" variant="outline" className="rounded-full">Vraag prijsindicatie</Button></Link>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="rounded-2xl border border-border bg-tile p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary mb-4"><Target className="h-5 w-5" /></div>
              <EditableText page={pageKey} contentKey="problems_title" defaultValue="Herkenbare uitdagingen" as="h2" className="text-2xl font-display font-bold mb-4" />
              <ul className="space-y-3">
                {data.problems.map((pr, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <EditableText page={pageKey} contentKey={`problems_${i}`} defaultValue={pr} as="span" multiline />
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-tile p-8">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-primary mb-4"><Lightbulb className="h-5 w-5" /></div>
              <EditableText page={pageKey} contentKey="opps_title" defaultValue="Kansen met een loyaliteitsplatform" as="h2" className="text-2xl font-display font-bold mb-4" />
              <ul className="space-y-3">
                {data.opportunities.map((pr, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <EditableText page={pageKey} contentKey={`opps_${i}`} defaultValue={pr} as="span" multiline />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-24 bg-mist border-y border-border">
        <div className="container max-w-5xl">
          <span className="accent-bar mb-5" />
          <EditableText page={pageKey} contentKey="value_title" defaultValue={`Hoe loyaliteit waarde toevoegt in ${data.label.toLowerCase()}`} as="h2" className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-5" multiline />
          <EditableText page={pageKey} contentKey="value_text" defaultValue={data.loyaltyValue} as="p" className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-3xl" multiline />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {data.scenarios.map((s, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <EditableText page={pageKey} contentKey={`scenario_${i}_title`} defaultValue={s.title} as="h3" className="font-display font-semibold mb-2" />
                <EditableText page={pageKey} contentKey={`scenario_${i}_text`} defaultValue={s.text} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 md:py-24 bg-background">
        <div className="container">
          <div className="max-w-2xl mb-12">
            <span className="accent-bar mb-5" />
            <EditableText page={pageKey} contentKey="features_title" defaultValue="Functionaliteiten die ertoe doen" as="h2" className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3" />
            <EditableText page={pageKey} contentKey="features_subtitle" defaultValue={`Een greep uit de modules die we voor ${data.label.toLowerCase()} doorgaans inzetten — we voegen alleen toe wat u écht gebruikt.`} as="p" className="text-muted-foreground" multiline />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.features.map((f, i) => (
              <div key={i} className="bento-tile bg-tile p-6">
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-primary mb-3"><Sparkles className="h-4 w-4" /></div>
                <EditableText page={pageKey} contentKey={`feature_${i}_title`} defaultValue={f.title} as="h3" className="font-display font-semibold mb-2" />
                <EditableText page={pageKey} contentKey={`feature_${i}_desc`} defaultValue={f.desc} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 md:py-24 bg-mist border-y border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="accent-bar mb-5" />
              <EditableText page={pageKey} contentKey="maatwerk_title" defaultValue="Maatwerk in uw huisstijl, gebouwd op een bewezen standaard" as="h2" className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4" multiline />
              <EditableText page={pageKey} contentKey="maatwerk_p1" defaultValue="U start niet bij nul. Loyaltygroup levert een uitontwikkeld standaardplatform en voegt daar exact die functionaliteit, vormgeving en koppelingen aan toe die uw organisatie nodig heeft. Het resultaat: snel live, en tóch een oplossing die zich volledig naar uw merk en processen voegt." as="p" className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4" multiline />
              <EditableText page={pageKey} contentKey="maatwerk_p2" defaultValue="Of het nu gaat om een gemeentelijke stadspas, een centrumpas of een eigen retail-app — naar uw klant toe is er niets standaards aan." as="p" className="text-muted-foreground text-base md:text-lg leading-relaxed" multiline />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.whyUs.map((w, i) => (
                <div key={i} className="rounded-2xl border border-border bg-background p-6">
                  <EditableText page={pageKey} contentKey={`why_${i}_title`} defaultValue={w.title} as="h3" className="font-display font-semibold mb-2" />
                  <EditableText page={pageKey} contentKey={`why_${i}_desc`} defaultValue={w.desc} as="p" className="text-sm text-muted-foreground leading-relaxed" multiline />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 md:py-24 bg-background">
        <KlantcasesBlockComp view="short" mode="latest" selectedIds={[]} limit={6} columns={3} showBranche showCategory title={`Klantcases uit ${data.label.toLowerCase()}`} titleAlign="left" showFilter={false} maxRows={2} />
        <div className="container mt-8 text-center">
          <Link to="/klantcases"><Button variant="outline" className="rounded-full">Bekijk alle klantcases</Button></Link>
        </div>
      </section>
      <ReviewsBlock page={pageKey} title={`Wat klanten uit ${data.label.toLowerCase()} zeggen`} />
      <PriceIndication variant="branche" brancheLabel={data.label.toLowerCase()} />
      <DemoForm source={pageKey} brancheDefault={data.label} title={`Plan een demo voor ${data.label.toLowerCase()}`} subtitle="We bereiden de demo voor met voorbeelden die passen bij uw branche en organisatie." />
      <DemoCTA variant="gradient" />
    </>
  );
};
import { Download, FileIcon, Pause, Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toRenderHtml } from "./RichText";
import { useState } from "react";

const LogoMarquee = ({
  logos,
  duration,
  height,
  grayscale,
  pauseOnHover,
  showPauseButton,
}: {
  logos: (string | { url: string; link?: string })[];
  duration: string;
  height: string;
  grayscale: boolean;
  pauseOnHover: boolean;
  showPauseButton: boolean;
}) => {
  const [paused, setPaused] = useState(false);
  const normalized = logos.map((l) =>
    typeof l === "string" ? { url: l, link: "" } : l
  );
  const loop = [...normalized, ...normalized];
  return (
    <div className={`relative marquee-mask overflow-hidden ${pauseOnHover ? "marquee-hover-pause" : ""}`}>
      <div
        className={`flex w-max animate-marquee items-center gap-12 ${paused ? "is-paused" : ""}`}
        style={{ ["--marquee-duration" as any]: duration }}
      >
        {loop.map((logo, i) => {
          const img = (
            <img
              key={i}
              src={logo.url}
              alt=""
              style={{ height, width: `calc(${height} * 2.4)` }}
              className={`object-contain shrink-0 ${grayscale ? "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition" : ""}`}
              loading="lazy"
              draggable={false}
            />
          );
          if (logo.link) {
            return (
              <a
                key={i}
                href={logo.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                {img}
              </a>
            );
          }
          return img;
        })}
      </div>
      {showPauseButton && (
        <button
          type="button"
          onClick={() => setPaused((v) => !v)}
          aria-label={paused ? "Logobalk afspelen" : "Logobalk pauzeren"}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 hover:bg-background text-foreground border shadow-soft p-2 transition"
        >
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
};

const LIST_CLASSES =
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2 [&_li]:my-0.5";

const RT = ({ html, as: Tag = "span", className, ...rest }: { html?: string; as?: any; className?: string } & React.HTMLAttributes<HTMLElement>) => (
  <Tag className={`${className ?? ""} ${LIST_CLASSES}`} {...rest} dangerouslySetInnerHTML={{ __html: toRenderHtml(html) }} />
);

const alignClass = (align?: string) =>
  align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

const titleAlignWrapClass = (align?: string) =>
  align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "";

const bgColorClass = (color?: string) => {
  switch (color) {
    case "primary": return "bg-primary text-primary-foreground";
    case "secondary": return "bg-secondary text-secondary-foreground";
    case "muted": return "bg-muted";
    case "card": return "bg-card";
    case "gradient": return "bg-gradient-to-br from-primary to-secondary text-primary-foreground";
    default: return "bg-background";
  }
};

const paddingClass = (size?: string) =>
  size === "none"
    ? ""
    : size === "small"
      ? "py-6"
      : size === "large"
        ? "py-16 md:py-24"
        : size === "xlarge"
          ? "py-20 md:py-32"
          : "py-10 md:py-14";

const maxWidthClass = (size?: string) => {
  switch (size) {
    case "sm": return "max-w-sm";
    case "md": return "max-w-md";
    case "lg": return "max-w-lg";
    case "xl": return "max-w-xl";
    case "2xl": return "max-w-2xl";
    case "3xl": return "max-w-3xl";
    case "4xl": return "max-w-4xl";
    case "5xl": return "max-w-5xl";
    case "6xl": return "max-w-6xl";
    case "7xl": return "max-w-7xl";
    case "full": return "max-w-full";
    default: return "";
  }
};

const innerWrapperClass = (maxWidth?: string) =>
  maxWidth && maxWidth !== "none"
    ? `mx-auto px-4 w-full ${maxWidthClass(maxWidth)}`
    : "container";

type CtaItem = { label?: string; link?: string; variant?: string };

const CtaLink = ({ to, children }: { to?: string; children: React.ReactNode }) => {
  const link = to || "/";
  if (link.startsWith("http")) {
    return <a href={link} target="_blank" rel="noopener noreferrer">{children}</a>;
  }
  return <Link to={link}>{children}</Link>;
};

const CtaGroup = ({
  primary,
  extras,
  layout,
  align,
  defaultVariant,
  extraVariant,
}: {
  primary?: CtaItem;
  extras?: CtaItem[];
  layout?: string;
  align?: string;
  defaultVariant?: any;
  extraVariant?: any;
}) => {
  const items: (CtaItem & { _variant: any })[] = [];
  if (primary?.label) items.push({ ...primary, _variant: primary.variant || defaultVariant || "default" });
  (extras || []).forEach((c) => {
    if (c?.label) items.push({ ...c, _variant: c.variant || extraVariant || "outline" });
  });
  if (!items.length) return null;
  const isStack = layout === "stack";
  const justify = align === "center" ? "justify-center" : align === "right" ? "justify-end" : "justify-start";
  const itemsAlign = align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start";
  return (
    <div className={`flex flex-wrap gap-3 ${isStack ? `flex-col ${itemsAlign}` : `flex-row ${justify}`}`}>
      {items.map((c, i) => (
        <CtaLink key={i} to={c.link}>
          <Button size="lg" variant={c._variant}>{c.label}</Button>
        </CtaLink>
      ))}
    </div>
  );
};

interface Props {
  block: Block;
}

const BlockRenderer = ({ block }: Props) => {
  const p = block.props;
  const isMobile = useIsMobile();
  const mTop = isMobile && p.marginTopMobile != null ? p.marginTopMobile : p.marginTop;
  const mBottom = isMobile && p.marginBottomMobile != null ? p.marginBottomMobile : p.marginBottom;
  const mOffsetX = isMobile && p.offsetXMobile != null ? p.offsetXMobile : p.offsetX;
  const gradients: Record<string, string> = {
    "primary-secondary": "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))",
    "secondary-primary": "linear-gradient(90deg, hsl(var(--secondary)), hsl(var(--primary)))",
    "aqua": "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)",
    "sunset": "linear-gradient(90deg, hsl(20 90% 55%), hsl(340 80% 55%))",
    "ocean": "linear-gradient(90deg, hsl(200 90% 45%), hsl(170 80% 45%))",
    "gold": "linear-gradient(90deg, hsl(40 85% 55%), hsl(25 85% 50%))",
  };
  const gradientBg = p.textGradient && gradients[p.textGradient];
  const wrapperStyle: React.CSSProperties = {
    marginTop: mTop != null ? `${mTop}px` : undefined,
    marginBottom: mBottom != null ? `${mBottom}px` : undefined,
    paddingLeft: mOffsetX ? `${mOffsetX}px` : undefined,
    color: gradientBg ? "transparent" : p.textColorToken ? `hsl(var(--${p.textColorToken}))` : undefined,
    backgroundImage: gradientBg || undefined,
    WebkitBackgroundClip: gradientBg ? "text" : undefined,
    backgroundClip: gradientBg ? "text" : undefined,
    WebkitTextFillColor: gradientBg ? "transparent" : undefined,
  };
  const wrap = (node: React.ReactNode) => (
    <div className="h-full" style={wrapperStyle}>{node}</div>
  );

  const rendered = (() => {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${p.level || 2}`) as keyof JSX.IntrinsicElements;
      const sizeClass = p.level === 1 ? "text-4xl md:text-5xl leading-tight" : p.level === 2 ? "text-3xl md:text-4xl leading-tight" : p.level === 3 ? "text-2xl md:text-3xl leading-tight" : "text-xl md:text-2xl leading-tight";
      const hHasCustomMw = typeof p.customMaxWidth === "number" && p.customMaxWidth > 0;
      const hAlignWrap = p.align === "center" ? "mx-auto" : p.align === "right" ? "ml-auto" : "";
      const hStyle: React.CSSProperties | undefined = hHasCustomMw ? { maxWidth: `${p.customMaxWidth}px` } : undefined;
      return (
        <section className={`${bgColorClass(p.bgColor)} ${p.bgColor && p.bgColor !== "background" ? paddingClass(p.padding) : "py-4"}`}>
          <div className="container">
            <RT as={Tag} className={`font-bold ${sizeClass} ${alignClass(p.align)} ${hHasCustomMw ? `w-full ${hAlignWrap}` : ""}`} html={p.text} style={hStyle} />
          </div>
        </section>
      );
    }

    case "paragraph": {
      const sizeMap: Record<string, string> = {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg md:text-xl",
        xl: "text-xl md:text-2xl",
        "2xl": "text-2xl md:text-3xl",
        "3xl": "text-3xl md:text-4xl",
      };
      const lhMap: Record<string, string> = {
        tight: "leading-tight",
        snug: "leading-snug",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      };
      const mwMap: Record<string, string> = {
        none: "",
        prose: "max-w-prose",
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
      };
      const padMap: Record<string, string> = {
        none: "py-0",
        small: "py-3",
        medium: "py-8",
        large: "py-12 md:py-16",
      };
      const sizeCls = sizeMap[p.size || "base"] || sizeMap.base;
      const lhCls = lhMap[p.lineHeight || "relaxed"] || lhMap.relaxed;
      const mwCls = mwMap[p.maxWidth || "none"] || "";
      const padCls = padMap[p.padding || "small"] || padMap.small;
      const hasBg = p.bgColor && p.bgColor !== "background";
      const hasCustomMw = typeof p.customMaxWidth === "number" && p.customMaxWidth > 0;
      const alignWrap = p.align === "center" ? "mx-auto" : p.align === "right" ? "ml-auto" : "";
      const mwWrap = hasCustomMw
        ? `w-full ${alignWrap}`
        : mwCls
        ? `${mwCls} ${alignWrap}`
        : "";
      const mwStyle: React.CSSProperties | undefined = hasCustomMw ? { maxWidth: `${p.customMaxWidth}px` } : undefined;
      return (
        <section className={`${hasBg ? bgColorClass(p.bgColor) : ""} ${padCls}`}>
          <div className="container">
            <RT
              as="div"
              className={`${sizeCls} ${lhCls} ${alignClass(p.align)} ${mwWrap} ${hasBg ? "" : "text-foreground/80"} whitespace-pre-wrap`}
              html={p.text}
              style={mwStyle}
            />
          </div>
        </section>
      );
    }

    case "image":
      if (!p.url) return null;
      {
        const gradients: Record<string, string> = {
          "dark-bottom": "linear-gradient(180deg, transparent 40%, hsl(var(--ink) / 0.75) 100%)",
          "dark-top": "linear-gradient(0deg, transparent 40%, hsl(var(--ink) / 0.75) 100%)",
          "dark-full": "linear-gradient(180deg, hsl(var(--ink) / 0.35) 0%, hsl(var(--ink) / 0.65) 100%)",
          "primary": "linear-gradient(135deg, hsl(var(--primary) / 0.55) 0%, hsl(var(--secondary) / 0.45) 100%)",
          "primary-soft": "linear-gradient(135deg, hsl(var(--primary) / 0.25) 0%, transparent 60%)",
          "aqua-radial": "radial-gradient(ellipse at top right, hsl(var(--secondary) / 0.45), transparent 60%)",
          "white-bottom": "linear-gradient(180deg, transparent 50%, hsl(var(--background) / 0.9) 100%)",
        };
        const showGradient = !!p.gradientEnabled && !!p.gradient && gradients[p.gradient];
        return (
          <section className="container py-4">
            <div className={`flex ${p.align === "center" ? "justify-center" : p.align === "right" ? "justify-end" : "justify-start"}`}>
              <div className="relative inline-block rounded-lg overflow-hidden" style={{ width: p.width || "100%", maxWidth: "100%" }}>
                <img src={p.url} alt={p.alt || ""} className="block w-full h-auto" loading="lazy" />
                {showGradient && (
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: gradients[p.gradient], opacity: (p.gradientOpacity ?? 100) / 100 }}
                  />
                )}
                {showGradient && p.overlayText && (
                  <div className={`absolute inset-0 flex p-6 ${p.overlayPosition === "top" ? "items-start" : p.overlayPosition === "center" ? "items-center" : "items-end"} ${p.overlayAlign === "center" ? "justify-center text-center" : p.overlayAlign === "right" ? "justify-end text-right" : "justify-start text-left"}`}>
                    <div className={`max-w-xl ${p.gradient?.startsWith("white") ? "text-foreground" : "text-white"}`}>
                      {p.overlayTitle && <h3 className="font-display font-bold text-2xl md:text-4xl mb-2 drop-shadow">{p.overlayTitle}</h3>}
                      {p.overlayText && <p className="text-sm md:text-base opacity-95 drop-shadow">{p.overlayText}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      }

    case "button":
      return (
        <section className={`container py-3`}>
          <CtaGroup
            primary={{ label: p.label, link: p.link, variant: p.variant }}
            extras={p.extraCtas}
            layout={p.ctaLayout}
            align={p.align || "left"}
          />
        </section>
      );

    case "spacer":
      return <div style={{ height: `${p.height || 40}px` }} />;

    case "divider":
      return (
        <section className="container py-4">
          <hr className="border-border" />
        </section>
      );

    case "hero": {
      const isLight = p.textColor === "light";
      const bg = p.bgImage
        ? { backgroundImage: `url(${p.bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
        : {};
      const noBg = !p.bgImage && p.bgColor === "none";
      const titleAlign = p.titleAlign || "center";
      const overlayEnabled = p.bgImage && p.overlayEnabled !== false;
      const overlayColor = p.overlayColor || "#000000";
      const overlayOpacity = p.overlayOpacity ?? 50;
      return (
        <section
          className={`relative py-20 md:py-32 ${!p.bgImage && !noBg ? bgColorClass(p.bgColor || "primary") : ""}`}
          style={bg}
        >
          {overlayEnabled && (
            <div
              className="absolute inset-0"
              style={{ backgroundColor: overlayColor, opacity: overlayOpacity / 100 }}
            />
          )}
          <div className={`container relative ${alignClass(titleAlign)} ${isLight && !noBg ? "text-primary-foreground" : "text-foreground"}`}>
            <RT as="h1" className="text-4xl md:text-6xl font-bold leading-tight mb-4" html={p.title} />
            {p.subtitle && <RT as="p" className={`text-lg md:text-xl leading-relaxed mb-8 opacity-90 max-w-2xl whitespace-pre-wrap ${titleAlignWrapClass(titleAlign)}`} html={p.subtitle} />}
            <CtaGroup
              primary={{ label: p.ctaLabel, link: p.ctaLink, variant: p.ctaVariant }}
              extras={p.extraCtas}
              layout={p.ctaLayout}
              align={titleAlign}
              defaultVariant={isLight && !noBg ? "secondary" : "default"}
              extraVariant={isLight && !noBg ? "outline" : "outline"}
            />
          </div>
        </section>
      );
    }

    case "two_columns": {
      const leftW = Math.max(15, Math.min(85, p.leftWidth ?? 50));
      const rightW = 100 - leftW;
      const valign2 =
        p.verticalAlign === "start" ? "items-start" : p.verticalAlign === "end" ? "items-end" : "items-center";
      const gap2 = p.gap ?? 32;
      const swap = p.swapOrder === true;
      return (
        <section className="container py-8">
          <div className={`grid grid-cols-1 md:grid-cols-12 ${valign2}`} style={{ gap: `${gap2}px` }}>
            <div
              className={`min-w-0 ${swap ? "md:order-2" : ""}`}
              style={{ gridColumn: `span ${Math.round((leftW / 100) * 12)} / span ${Math.round((leftW / 100) * 12)}` }}
            >
              <RT as="div" className="prose max-w-none" html={p.left} />
            </div>
            <div
              className={`min-w-0 ${swap ? "md:order-1" : ""}`}
              style={{ gridColumn: `span ${Math.round((rightW / 100) * 12)} / span ${Math.round((rightW / 100) * 12)}` }}
            >
              <RT as="div" className="prose max-w-none" html={p.right} />
            </div>
          </div>
        </section>
      );
    }

    case "three_columns":
      return (
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RT as="div" className="prose max-w-none" html={p.col1} />
            <RT as="div" className="prose max-w-none" html={p.col2} />
            <RT as="div" className="prose max-w-none" html={p.col3} />
          </div>
        </section>
      );

    case "container":
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <RT as="div" className={innerWrapperClass(p.maxWidth)} html={p.content} />
        </section>
      );

    case "row": {
      const cols = p.columns || 2;
      const gridColsMap: Record<number, string> = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
        5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-5",
        6: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
      };
      const responsive = p.responsive || "auto";
      const responsiveColsMap: Record<string, Record<number, string>> = {
        auto: gridColsMap,
        always: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" },
        md2: { 2: "grid-cols-1 md:grid-cols-2", 3: "grid-cols-1 md:grid-cols-3", 4: "grid-cols-1 md:grid-cols-2", 5: "grid-cols-1 md:grid-cols-2", 6: "grid-cols-1 md:grid-cols-2" },
      };
      const colsClass = (responsiveColsMap[responsive] && responsiveColsMap[responsive][cols]) || gridColsMap[cols] || gridColsMap[2];
      const valign = p.verticalAlign === "center" ? "items-center" : p.verticalAlign === "end" ? "items-end" : p.verticalAlign === "start" ? "items-start" : "";
      const children = block.children || [];
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className={innerWrapperClass(p.maxWidth)}>
            <div className={`grid ${colsClass} ${valign}`} style={{ gap: `${p.gap ?? 32}px` }}>
              {Array.from({ length: cols }).map((_, ci) => (
                <div key={ci} className="min-w-0 w-full h-full flex flex-col">
                  {(children[ci] || []).map((child) => (
                    <div key={child.id} className="h-full">
                      <BlockRenderer block={child} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "icon_card": {
      const Icon = p.icon ? ((Icons as any)[p.icon] || Icons.Star) : Icons.Star;
      const colorStyle = p.iconColor && !["primary", "secondary"].includes(p.iconColor)
        ? { color: p.iconColor }
        : undefined;
      const colorClass = p.iconColor === "secondary" ? "text-secondary" : colorStyle ? "" : "text-primary";
      return (
        <div className="group relative rounded-2xl border border-border bg-card p-6 card-hover h-full flex flex-col">
          <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent mb-4 transition-colors ${colorClass}`} style={colorStyle}>
            {p.iconImage ? (
              <img src={p.iconImage} alt="" className="h-6 w-6 object-contain" />
            ) : (
              <Icon className="h-5 w-5" />
            )}
          </div>
          <RT as="h3" className="font-display font-semibold text-lg leading-snug mb-2" html={p.title} />
          <RT as="p" className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed flex-grow" html={p.description} />
        </div>
      );
    }

    case "stat":
      return (
        <div className="text-center py-4">
          <RT as="div" className="text-4xl md:text-5xl font-display font-bold text-gradient-aqua mb-2" html={p.value} />
          <RT as="div" className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium" html={p.label} />
        </div>
      );

    case "feature_list":
      return (
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-6 bg-card">
                <h3 className="font-bold text-lg leading-snug mb-2">{item.title}</h3>
                <RT as="p" className="text-muted-foreground text-sm whitespace-pre-wrap leading-relaxed" html={item.description} />
              </div>
            ))}
          </div>
        </section>
      );

    case "faq":
      return (
        <section className="container py-12 max-w-3xl">
          <Accordion type="single" collapsible>
            {(p.items || []).map((item: any, i: number) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent><RT as="div" className="whitespace-pre-wrap" html={item.answer} /></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      );

    case "testimonial":
      return (
        <section className="container py-12">
          <div className="max-w-2xl mx-auto text-center">
            <Quote className="h-10 w-10 text-primary mx-auto mb-4" />
            <RT as="p" className="text-xl italic mb-6 whitespace-pre-wrap" html={p.quote} />
            <div className="flex items-center justify-center gap-3">
              {p.photo && <img src={p.photo} alt={p.name} className="h-12 w-12 rounded-full object-cover" />}
              <div className="text-left">
                <RT as="p" className="font-semibold" html={p.name} />
                {p.role && <RT as="p" className="text-sm text-muted-foreground" html={p.role} />}
              </div>
            </div>
          </div>
        </section>
      );

    case "cta_banner":
      {
        const hasCustomBg = p.bgColor && p.bgColor !== "gradient-primary";
        const bgCls = !hasCustomBg
          ? "bg-gradient-to-br from-primary to-secondary text-primary-foreground"
          : bgColorClass(p.bgColor);
      return (
        <section className={`${bgCls} py-16`}>
          <div className={`container ${alignClass(p.titleAlign || "center")}`}>
            <RT as="h2" className="text-3xl font-bold leading-tight mb-3" html={p.title} />
            {p.subtitle && <RT as="p" className="mb-6 opacity-90 leading-relaxed whitespace-pre-wrap" html={p.subtitle} />}
            <CtaGroup
              primary={{ label: p.ctaLabel, link: p.ctaLink || "/contact", variant: p.ctaVariant }}
              extras={p.extraCtas}
              layout={p.ctaLayout}
              align={p.titleAlign || "center"}
              defaultVariant="secondary"
              extraVariant="outline"
            />
          </div>
        </section>
      );
      }

    case "contact_form":
      return (
        <section className="container py-12 max-w-xl">
          <h2 className={`text-2xl font-bold leading-tight mb-6 ${alignClass(p.titleAlign || "center")}`}>{p.title}</h2>
          <form
            className="space-y-4"
            onSubmit={(e) => { e.preventDefault(); alert("Bedankt voor je bericht!"); }}
          >
            <div>
              <Label>Naam</Label>
              <Input required />
            </div>
            <div>
              <Label>E-mail</Label>
              <Input type="email" required />
            </div>
            <div>
              <Label>Bericht</Label>
              <Textarea rows={4} required />
            </div>
            <Button type="submit" className="w-full">Verstuur</Button>
          </form>
        </section>
      );

    case "video_embed":
      if (!p.url) return null;
      return (
        <section className="container py-8">
          <div className="aspect-video w-full max-w-4xl mx-auto">
            <iframe
              src={p.url}
              className="w-full h-full rounded-lg"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </section>
      );

    case "accordion":
      return (
        <section className="container py-8 max-w-3xl">
          <Accordion type="single" collapsible>
            {(p.items || []).map((item: any, i: number) => (
              <AccordionItem key={i} value={`acc-${i}`}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent><RT as="div" className="whitespace-pre-wrap" html={item.content} /></AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      );

    case "tabs":
      return (
        <section className="container py-8">
          <Tabs defaultValue="tab-0">
            <TabsList>
              {(p.items || []).map((item: any, i: number) => (
                <TabsTrigger key={i} value={`tab-${i}`}>{item.label}</TabsTrigger>
              ))}
            </TabsList>
            {(p.items || []).map((item: any, i: number) => (
              <TabsContent key={i} value={`tab-${i}`} className="mt-4">
                <RT as="div" className="whitespace-pre-wrap" html={item.content} />
              </TabsContent>
            ))}
          </Tabs>
        </section>
      );

    case "image_carousel":
      if (!p.images?.length) return null;
      return (
        <section className="container py-8">
          <Carousel className="max-w-4xl mx-auto">
            <CarouselContent>
              {p.images.map((img: string, i: number) => (
                <CarouselItem key={i}>
                  <img src={img} alt="" className="w-full h-96 object-cover rounded-lg" />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
      );

    case "custom_html":
      return (
        <section className="container py-4">
          <div dangerouslySetInnerHTML={{ __html: p.html || "" }} />
        </section>
      );

    case "image_text": {
      const imgRight = p.imagePosition === "right";
      const valign = p.verticalAlign === "start" ? "items-start" : p.verticalAlign === "end" ? "items-end" : "items-center";
      const ratio = p.imageRatio || "4/3";
      const imgW = Math.max(20, Math.min(80, p.imageWidth ?? 50));
      const textW = 100 - imgW;
      const imageEl = p.imageUrl ? (
        <div className="w-full">
          <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: ratio }}>
            <img src={p.imageUrl} alt={p.imageAlt || ""} className="w-full h-full object-cover" loading="lazy" />
          </div>
        </div>
      ) : (
        <div className="w-full rounded-2xl bg-muted flex items-center justify-center text-sm text-muted-foreground" style={{ aspectRatio: ratio }}>
          Voeg een afbeelding toe
        </div>
      );
      const textEl = (
        <div className="w-full">
          {p.title && <RT as="h2" className={`font-display font-bold text-2xl md:text-3xl leading-tight mb-3 ${alignClass(p.titleAlign || "left")}`} html={p.title} />}
          {p.text && <RT as="div" className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap" html={p.text} />}
          {(p.ctaLabel || (p.extraCtas || []).some((c: any) => c?.label)) && (
            <div className="mt-5">
              <CtaGroup
                primary={{ label: p.ctaLabel, link: p.ctaLink, variant: p.ctaVariant }}
                extras={p.extraCtas}
                layout={p.ctaLayout}
                align={p.titleAlign || "left"}
                defaultVariant="default"
                extraVariant="outline"
              />
            </div>
          )}
        </div>
      );
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            <div
              className={`grid grid-cols-1 gap-8 md:gap-12 ${valign}`}
              style={{ gridTemplateColumns: undefined }}
            >
              <div
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center"
                style={{}}
              >
                <div className={`${imgRight ? "md:order-2" : ""}`} style={{ gridColumn: `span ${Math.round(imgW / 100 * 12)} / span ${Math.round(imgW / 100 * 12)}` }}>
                  {imageEl}
                </div>
                <div className={`${imgRight ? "md:order-1" : ""}`} style={{ gridColumn: `span ${Math.round(textW / 100 * 12)} / span ${Math.round(textW / 100 * 12)}` }}>
                  {textEl}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case "logo_marquee": {
      const logos: string[] = (p.logos || []).filter(Boolean);
      if (!logos.length) {
        return (
          <section className={`${bgColorClass(p.bgColor || "muted")} py-12`}>
            <div className="container text-center text-sm text-muted-foreground">
              Voeg logo's toe in het zijpaneel om de bewegende balk te tonen.
            </div>
          </section>
        );
      }
      const duration = `${Math.max(8, p.speed || 30)}s`;
      const h = `${p.height || 60}px`;
      return (
        <section className={`${bgColorClass(p.bgColor || "muted")} py-12`}>
          <div className="container">
            {p.title && (
              <RT as="h3" className={`${alignClass(p.titleAlign || "center")} text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8`} html={p.title} />
            )}
            <LogoMarquee
              logos={logos}
              duration={duration}
              height={h}
              grayscale={!!p.grayscale}
              pauseOnHover={p.pauseOnHover !== false}
              showPauseButton={p.showPauseButton !== false}
            />
          </div>
        </section>
      );
    }

    case "klantcases":
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <KlantcasesBlock
            view={p.view || "short"}
            mode={p.mode || "selected"}
            selectedIds={p.selectedIds || []}
            limit={p.limit || 3}
            columns={p.columns || 3}
            showBranche={p.showBranche !== false}
            showCategory={p.showCategory !== false}
            title={p.title}
            titleAlign={p.titleAlign}
            showFilter={p.showFilter === true}
            maxRows={p.maxRows || 0}
            filterOptions={Array.isArray(p.filterOptions) ? p.filterOptions : undefined}
            showAll={p.showAll === true}
            filterSector={p.filterSector}
          />
        </section>
      );

    case "download_files": {
      const files: Array<{ url: string; label: string; description?: string; sizeBytes?: number; iconUrl?: string }> = p.files || [];
      if (!files.length && !p.title) return null;
      const cols = p.columns || 3;
      const colClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : cols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      const fmt = (b?: number) => {
        if (!b) return "";
        if (b < 1024) return `${b} B`;
        if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
        return `${(b / 1024 / 1024).toFixed(1)} MB`;
      };
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            {p.title && <RT as="h2" className={`text-2xl md:text-3xl font-bold leading-tight mb-2 ${alignClass(p.titleAlign || "center")}`} html={p.title} />}
            {p.subtitle && <RT as="p" className={`text-muted-foreground leading-relaxed mb-8 max-w-2xl whitespace-pre-wrap ${alignClass(p.titleAlign || "center")} ${titleAlignWrapClass(p.titleAlign || "center")}`} html={p.subtitle} />}
            <div className={`grid ${colClass} gap-6 mt-6`}>
              {files.map((f, i) => (
                <a
                  key={i}
                  href={f.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card hover:border-primary hover:shadow-md transition-all"
                >
                  {f.iconUrl ? (
                    <img src={f.iconUrl} alt="" className="h-16 w-16 object-contain mb-3" loading="lazy" />
                  ) : (
                    <div className="h-16 w-16 rounded-xl bg-accent grid place-items-center mb-3 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <FileIcon className="h-7 w-7" />
                    </div>
                  )}
                  <RT as="h3" className="font-semibold text-base mb-1" html={f.label || "Download"} />
                  {f.description && <RT as="p" className="text-xs text-muted-foreground mb-3" html={f.description} />}
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:underline">
                    <Download className="h-3.5 w-3.5" /> Download {f.sizeBytes ? `(${fmt(f.sizeBytes)})` : ""}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "image_cards": {
      const items: Array<{ image?: string; title?: string; description?: string; link?: string }> = p.items || [];
      const cols = p.columns || 3;
      const colClass = cols === 1 ? "grid-cols-1" : cols === 2 ? "grid-cols-1 sm:grid-cols-2" : cols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 md:grid-cols-3";
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            {p.title && <RT as="h2" className={`text-2xl md:text-3xl font-bold leading-tight mb-4 ${alignClass(p.titleAlign || "center")}`} html={p.title} />}
            {p.subtitle && <RT as="p" className={`text-muted-foreground leading-relaxed max-w-2xl mb-12 whitespace-pre-wrap ${alignClass(p.titleAlign || "center")} ${titleAlignWrapClass(p.titleAlign || "center")}`} html={p.subtitle} />}
            <div className={`grid ${colClass} gap-8`}>
              {items.map((it, i) => {
                const card = (
                  <div key={i} className="rounded-lg overflow-hidden border bg-card hover:shadow-lg transition-shadow">
                    {it.image ? (
                      <img src={it.image} alt={it.title || ""} className="w-full h-48 object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-48 bg-muted flex items-center justify-center text-sm text-muted-foreground">Voeg een afbeelding toe</div>
                    )}
                    <div className="p-6">
                      {it.title && <RT as="h3" className="font-bold text-lg leading-snug mb-2 uppercase tracking-wider" html={it.title} />}
                      {it.description && <RT as="p" className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed" html={it.description} />}
                    </div>
                  </div>
                );
                if (it.link) {
                  return (
                    <CtaLink key={i} to={it.link}>
                      {card}
                    </CtaLink>
                  );
                }
                return card;
              })}
            </div>
          </div>
        </section>
      );
    }

    case "search_bar": {
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            <SearchBlock
              placeholder={p.placeholder}
              buttonLabel={p.buttonLabel}
              maxWidth={p.maxWidth}
              align={p.align}
              variant={p.variant}
              showButton={p.showButton !== false}
            />
          </div>
        </section>
      );
    }

    case "custom_form": {
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            <CustomFormBlock
              formId={block.id}
              title={p.title}
              titleAlign={p.titleAlign}
              formSubject={p.formSubject}
              description={p.description}
              submitLabel={p.submitLabel}
              successMessage={p.successMessage}
              fields={p.fields || []}
              maxWidth={p.maxWidth}
              notifySubjectTpl={p.notifySubjectTpl}
              notifyIntro={p.notifyIntro}
              confirmEnabled={p.confirmEnabled !== false}
              confirmSubjectTpl={p.confirmSubjectTpl}
              confirmIntro={p.confirmIntro}
              confirmOutro={p.confirmOutro}
            />
          </div>
        </section>
      );
    }

    case "usp_grid":
      return <USPGrid title={p.title} subtitle={p.subtitle} compact={!!p.compact} />;

    case "reviews":
      return <ReviewsBlock page={p.page} title={p.title} subtitle={p.subtitle} />;

    case "price_indication":
      return <PriceIndication variant={p.variant} brancheLabel={p.brancheLabel} />;

    case "demo_cta":
      return (
        <DemoCTA
          title={p.title}
          text={p.text}
          primaryLabel={p.primaryLabel}
          primaryTo={p.primaryTo}
          secondaryLabel={p.secondaryLabel}
          secondaryTo={p.secondaryTo}
          variant={p.variant}
        />
      );

    case "demo_form":
      return (
        <DemoForm
          source={p.source}
          brancheDefault={p.brancheDefault}
          title={p.title}
          subtitle={p.subtitle}
        />
      );

    case "laagdrempelig":
      return <LaagdrempeligBlock />;

    case "branche_grid":
      return <BrancheGridBlock title={p.title} subtitle={p.subtitle} />;

    case "branche_detail":
      return <BrancheDetailBlock />;

    default:
      return null;
  }
  })();
  return wrap(rendered);
};

export default BlockRenderer;
