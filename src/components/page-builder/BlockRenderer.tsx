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

const alignClass = (align?: string) =>
  align === "center" ? "text-center" : align === "right" ? "text-right" : "text-left";

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
  size === "small" ? "py-6" : size === "large" ? "py-16 md:py-24" : "py-10 md:py-14";

interface Props {
  block: Block;
}

const BlockRenderer = ({ block }: Props) => {
  const p = block.props;
  const wrapperStyle: React.CSSProperties = {
    marginTop: p.marginTop != null ? `${p.marginTop}px` : undefined,
    marginBottom: p.marginBottom != null ? `${p.marginBottom}px` : undefined,
    paddingLeft: p.offsetX ? `${p.offsetX}px` : undefined,
  };
  const wrap = (node: React.ReactNode) => (
    <div style={wrapperStyle}>{node}</div>
  );

  const rendered = (() => {
  switch (block.type) {
    case "heading": {
      const Tag = (`h${p.level || 2}`) as keyof JSX.IntrinsicElements;
      const sizeClass = p.level === 1 ? "text-4xl md:text-5xl" : p.level === 2 ? "text-3xl md:text-4xl" : p.level === 3 ? "text-2xl md:text-3xl" : "text-xl md:text-2xl";
      return (
        <section className="container py-4">
          <Tag className={`font-bold ${sizeClass} ${alignClass(p.align)}`}>{p.text}</Tag>
        </section>
      );
    }

    case "paragraph":
      return (
        <section className="container py-3">
          <p className={`text-base text-foreground/80 leading-relaxed whitespace-pre-wrap ${alignClass(p.align)}`}>{p.text}</p>
        </section>
      );

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
        <section className={`container py-3 flex ${p.align === "center" ? "justify-center" : p.align === "right" ? "justify-end" : "justify-start"}`}>
          {p.link?.startsWith("http") ? (
            <a href={p.link} target="_blank" rel="noopener noreferrer">
              <Button variant={p.variant || "default"} size="lg">{p.label}</Button>
            </a>
          ) : (
            <Link to={p.link || "/"}>
              <Button variant={p.variant || "default"} size="lg">{p.label}</Button>
            </Link>
          )}
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
      return (
        <section
          className={`relative py-20 md:py-32 ${!p.bgImage ? bgColorClass(p.bgColor || "primary") : ""}`}
          style={bg}
        >
          {p.bgImage && <div className="absolute inset-0 bg-black/50" />}
          <div className={`container relative text-center ${isLight ? "text-primary-foreground" : "text-foreground"}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{p.title}</h1>
            {p.subtitle && <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">{p.subtitle}</p>}
            {p.ctaLabel && (
              <Link to={p.ctaLink || "/"}>
                <Button size="lg" variant={isLight ? "secondary" : "default"}>{p.ctaLabel}</Button>
              </Link>
            )}
          </div>
        </section>
      );
    }

    case "two_columns":
      return (
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="prose max-w-none whitespace-pre-wrap">{p.left}</div>
            <div className="prose max-w-none whitespace-pre-wrap">{p.right}</div>
          </div>
        </section>
      );

    case "three_columns":
      return (
        <section className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="prose max-w-none whitespace-pre-wrap">{p.col1}</div>
            <div className="prose max-w-none whitespace-pre-wrap">{p.col2}</div>
            <div className="prose max-w-none whitespace-pre-wrap">{p.col3}</div>
          </div>
        </section>
      );

    case "container":
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container whitespace-pre-wrap">{p.content}</div>
        </section>
      );

    case "row": {
      const cols = p.columns || 2;
      const colsClass = cols === 1 ? "grid-cols-1" : cols === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2";
      const valign = p.verticalAlign === "center" ? "items-center" : p.verticalAlign === "end" ? "items-end" : "items-start";
      const children = block.children || [];
      return (
        <section className={`${bgColorClass(p.bgColor)} ${paddingClass(p.padding)}`}>
          <div className="container">
            <div className={`grid ${colsClass} ${valign}`} style={{ gap: `${p.gap ?? 32}px` }}>
              {Array.from({ length: cols }).map((_, ci) => (
                <div key={ci} className="min-w-0">
                  {(children[ci] || []).map((child) => (
                    <BlockRenderer key={child.id} block={child} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "icon_card": {
      const Icon = (Icons as any)[p.icon] || Icons.Star;
      return (
        <div className="group relative rounded-2xl border border-border bg-card p-6 card-hover h-full">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="font-display font-semibold text-lg mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{p.description}</p>
        </div>
      );
    }

    case "stat":
      return (
        <div className="text-center py-4">
          <div className="text-4xl md:text-5xl font-display font-bold text-gradient-aqua mb-2">{p.value}</div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-[0.2em] font-medium">{p.label}</div>
        </div>
      );

    case "feature_list":
      return (
        <section className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(p.items || []).map((item: any, i: number) => (
              <div key={i} className="border rounded-lg p-6 bg-card">
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
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
                <AccordionContent>{item.answer}</AccordionContent>
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
            <p className="text-xl italic mb-6">"{p.quote}"</p>
            <div className="flex items-center justify-center gap-3">
              {p.photo && <img src={p.photo} alt={p.name} className="h-12 w-12 rounded-full object-cover" />}
              <div className="text-left">
                <p className="font-semibold">{p.name}</p>
                {p.role && <p className="text-sm text-muted-foreground">{p.role}</p>}
              </div>
            </div>
          </div>
        </section>
      );

    case "cta_banner":
      return (
        <section className="bg-gradient-to-br from-primary to-secondary py-16">
          <div className="container text-center text-primary-foreground">
            <h2 className="text-3xl font-bold mb-3">{p.title}</h2>
            {p.subtitle && <p className="mb-6 opacity-90">{p.subtitle}</p>}
            {p.ctaLabel && (
              <Link to={p.ctaLink || "/contact"}>
                <Button size="lg" variant="secondary">{p.ctaLabel}</Button>
              </Link>
            )}
          </div>
        </section>
      );

    case "contact_form":
      return (
        <section className="container py-12 max-w-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">{p.title}</h2>
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
                <AccordionContent>{item.content}</AccordionContent>
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
              <TabsContent key={i} value={`tab-${i}`} className="mt-4 whitespace-pre-wrap">
                {item.content}
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
          <div className="rounded-2xl overflow-hidden bg-muted" style={{ aspectRatio: ratio }}>
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
          {p.title && <h2 className="font-display font-bold text-2xl md:text-3xl mb-3">{p.title}</h2>}
          {p.text && <p className="text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">{p.text}</p>}
          {p.ctaLabel && (
            <div className="mt-5">
              {p.ctaLink?.startsWith("http") ? (
                <a href={p.ctaLink} target="_blank" rel="noopener noreferrer">
                  <Button size="lg">{p.ctaLabel}</Button>
                </a>
              ) : (
                <Link to={p.ctaLink || "/"}>
                  <Button size="lg">{p.ctaLabel}</Button>
                </Link>
              )}
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
      const loop = [...logos, ...logos];
      const duration = `${Math.max(8, p.speed || 30)}s`;
      const h = `${p.height || 60}px`;
      return (
        <section className={`${bgColorClass(p.bgColor || "muted")} py-12`}>
          <div className="container">
            {p.title && (
              <h3 className="text-center text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-8">
                {p.title}
              </h3>
            )}
            <div className="marquee-mask overflow-hidden">
              <div
                className="flex w-max animate-marquee items-center gap-12"
                style={{ ["--marquee-duration" as any]: duration }}
              >
                {loop.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{ height: h, width: `calc(${h} * 2.4)` }}
                    className={`object-contain shrink-0 ${p.grayscale ? "grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition" : ""}`}
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      );
    }

    default:
      return null;
  }
  })();
  return wrap(rendered);
};

export default BlockRenderer;
