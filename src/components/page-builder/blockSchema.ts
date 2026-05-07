export type BlockType =
  | "heading"
  | "paragraph"
  | "image"
  | "button"
  | "spacer"
  | "divider"
  | "hero"
  | "two_columns"
  | "three_columns"
  | "container"
  | "row"
  | "feature_list"
  | "faq"
  | "testimonial"
  | "cta_banner"
  | "contact_form"
  | "video_embed"
  | "accordion"
  | "tabs"
  | "image_carousel"
  | "icon_card"
  | "stat"
  | "logo_marquee"
  | "image_text"
  | "custom_html"
  | "klantcases"
  | "download_files";

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  // For row blocks: per-column nested children
  children?: Block[][];
}

export interface BlockMeta {
  type: BlockType;
  label: string;
  category: "Basis" | "Layout" | "Content" | "Geavanceerd";
  icon: string; // lucide icon name
  defaultProps: Record<string, any>;
}

export const BLOCK_META: BlockMeta[] = [
  // Basis
  { type: "heading", label: "Koptekst", category: "Basis", icon: "Heading", defaultProps: { text: "Nieuwe koptekst", level: 2, align: "left", bgColor: "background", padding: "medium" } },
  { type: "paragraph", label: "Paragraaf", category: "Basis", icon: "Type", defaultProps: { text: "Schrijf hier je tekst...", align: "left" } },
  { type: "image", label: "Afbeelding", category: "Basis", icon: "Image", defaultProps: { url: "", alt: "", width: "100%", align: "center" } },
  { type: "button", label: "Knop", category: "Basis", icon: "MousePointerClick", defaultProps: { label: "Klik hier", link: "/", variant: "default", align: "left" } },
  { type: "spacer", label: "Tussenruimte", category: "Basis", icon: "MoveVertical", defaultProps: { height: 40 } },
  { type: "divider", label: "Scheidingslijn", category: "Basis", icon: "Minus", defaultProps: {} },

  // Layout
  { type: "hero", label: "Hero sectie", category: "Layout", icon: "LayoutTemplate", defaultProps: { title: "Welkom", subtitle: "Een korte beschrijving", bgImage: "", bgColor: "primary", ctaLabel: "Lees meer", ctaLink: "/", textColor: "light" } },
  { type: "two_columns", label: "Twee kolommen", category: "Layout", icon: "Columns2", defaultProps: { left: "Linkerkolom inhoud", right: "Rechterkolom inhoud" } },
  { type: "three_columns", label: "Drie kolommen", category: "Layout", icon: "Columns3", defaultProps: { col1: "Kolom 1", col2: "Kolom 2", col3: "Kolom 3" } },
  { type: "container", label: "Achtergrondblok", category: "Layout", icon: "Square", defaultProps: { content: "Inhoud van het blok", bgColor: "muted", padding: "large" } },
  { type: "row", label: "Rij met kolommen", category: "Layout", icon: "Columns", defaultProps: { columns: 2, gap: 32, bgColor: "background", padding: "medium", verticalAlign: "start" } },
  { type: "image_text", label: "Afbeelding + Tekst", category: "Layout", icon: "Image", defaultProps: { imageUrl: "", imageAlt: "", imagePosition: "left", title: "Een pakkende titel", text: "Schrijf hier je tekst. Combineer een sterke afbeelding met begeleidende uitleg.", ctaLabel: "", ctaLink: "/", bgColor: "background", padding: "medium", imageRatio: "4/3", verticalAlign: "center", imageWidth: 50 } },

  // Content
  { type: "feature_list", label: "Featurelijst", category: "Content", icon: "List", defaultProps: { items: [{ title: "Feature 1", description: "Beschrijving" }, { title: "Feature 2", description: "Beschrijving" }, { title: "Feature 3", description: "Beschrijving" }] } },
  { type: "faq", label: "FAQ", category: "Content", icon: "HelpCircle", defaultProps: { items: [{ question: "Vraag 1?", answer: "Antwoord op vraag 1." }, { question: "Vraag 2?", answer: "Antwoord op vraag 2." }] } },
  { type: "testimonial", label: "Testimonial", category: "Content", icon: "Quote", defaultProps: { quote: "Een geweldig product!", name: "Jan Jansen", role: "CEO bij Bedrijf", photo: "" } },
  { type: "cta_banner", label: "CTA banner", category: "Content", icon: "Megaphone", defaultProps: { title: "Klaar om te beginnen?", subtitle: "", ctaLabel: "Neem contact op", ctaLink: "/contact" } },
  { type: "contact_form", label: "Contactformulier", category: "Content", icon: "Mail", defaultProps: { title: "Neem contact op" } },

  // Geavanceerd
  { type: "video_embed", label: "Video embed", category: "Geavanceerd", icon: "Video", defaultProps: { url: "https://www.youtube.com/embed/dQw4w9WgXcQ" } },
  { type: "accordion", label: "Accordeon", category: "Geavanceerd", icon: "ChevronsUpDown", defaultProps: { items: [{ title: "Item 1", content: "Inhoud 1" }, { title: "Item 2", content: "Inhoud 2" }] } },
  { type: "tabs", label: "Tabbladen", category: "Geavanceerd", icon: "LayoutGrid", defaultProps: { items: [{ label: "Tab 1", content: "Inhoud 1" }, { label: "Tab 2", content: "Inhoud 2" }] } },
  { type: "image_carousel", label: "Afbeeldingen carrousel", category: "Geavanceerd", icon: "GalleryHorizontal", defaultProps: { images: [] } },
  { type: "logo_marquee", label: "Logobalk (bewegend)", category: "Content", icon: "GalleryHorizontalEnd", defaultProps: { title: "Met deze partijen werken we", logos: [], speed: 30, bgColor: "muted", grayscale: true, height: 60 } },
  { type: "icon_card", label: "Icoon-kaart", category: "Content", icon: "Square", defaultProps: { icon: "Star", title: "Titel", description: "Korte beschrijving", iconColor: "primary" } },
  { type: "stat", label: "Statistiek", category: "Content", icon: "BarChart3", defaultProps: { value: "100+", label: "Klanten" } },
  { type: "custom_html", label: "Custom HTML", category: "Geavanceerd", icon: "Code", defaultProps: { html: "<p>Custom HTML</p>" } },
  { type: "klantcases", label: "Klantcases", category: "Content", icon: "Briefcase", defaultProps: { view: "short", mode: "selected", selectedIds: [], limit: 3, columns: 3, showBranche: true, showCategory: true, title: "", bgColor: "background", padding: "medium" } },
  { type: "download_files", label: "Download bestanden", category: "Content", icon: "Download", defaultProps: { title: "Downloads", subtitle: "", files: [], columns: 3, bgColor: "background", padding: "medium" } },
];

export const getBlockMeta = (type: BlockType): BlockMeta | undefined =>
  BLOCK_META.find((b) => b.type === type);

const safeUUID = (): string => {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40;
      bytes[8] = (bytes[8] & 0x3f) | 0x80;
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
  } catch {}
  return "id-" + Date.now().toString(16) + "-" + Math.random().toString(16).slice(2, 10);
};

export { safeUUID };

export const createBlock = (type: BlockType): Block => {
  const meta = getBlockMeta(type);
  const block: Block = {
    id: safeUUID(),
    type,
    props: JSON.parse(JSON.stringify(meta?.defaultProps ?? {})),
  };
  if (type === "row") {
    const cols = block.props.columns || 2;
    block.children = Array.from({ length: cols }, () => []);
  }
  return block;
};
