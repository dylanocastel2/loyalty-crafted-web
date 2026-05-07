import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type FooterItem =
  | { type: "link"; label: string; url: string }
  | { type: "text"; text: string }
  | { type: "button"; label: string; url: string };

export interface FooterColumn {
  title: string;
  items: FooterItem[];
}

export interface FooterConfig {
  brandText: string;
  showSocials: boolean;
  columns: FooterColumn[];
  copyright: string;
  bgColor?: string;
  textColor?: string;
  linkColor?: string;
}

export const DEFAULT_FOOTER_CONFIG: FooterConfig = {
  brandText:
    "Loyaltygroup B.V. ontwikkelt volledig op maat gemaakte spaarsystemen voor gemeenten en commerciële bedrijven.",
  showSocials: true,
  copyright: "© {year} Loyaltygroup B.V. Alle rechten voorbehouden.",
  bgColor: "",
  textColor: "",
  linkColor: "",
  columns: [
    {
      title: "Oplossingen",
      items: [
        { type: "link", label: "Spaarsysteem", url: "/spaarsysteem" },
        { type: "link", label: "Gemeenten", url: "/gemeenten" },
        { type: "link", label: "Klantcases", url: "/klantcases" },
      ],
    },
    {
      title: "Bedrijf",
      items: [
        { type: "link", label: "Over Ons", url: "/over-ons" },
        { type: "link", label: "Support", url: "/support" },
        { type: "link", label: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Contact",
      items: [
        { type: "text", text: "info@loyaltygroup.nl" },
        { type: "text", text: "Nederland" },
        { type: "button", label: "Demo aanvragen →", url: "/demo" },
      ],
    },
  ],
};

const parseConfig = (raw: string | null | undefined): FooterConfig => {
  if (!raw) return DEFAULT_FOOTER_CONFIG;
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return DEFAULT_FOOTER_CONFIG;
    return {
      brandText: parsed.brandText ?? DEFAULT_FOOTER_CONFIG.brandText,
      showSocials: parsed.showSocials ?? true,
      copyright: parsed.copyright ?? DEFAULT_FOOTER_CONFIG.copyright,
      columns: Array.isArray(parsed.columns) ? parsed.columns : DEFAULT_FOOTER_CONFIG.columns,
      bgColor: parsed.bgColor ?? "",
      textColor: parsed.textColor ?? "",
      linkColor: parsed.linkColor ?? "",
    };
  } catch {
    return DEFAULT_FOOTER_CONFIG;
  }
};

export const useFooterConfig = () => {
  const [config, setConfig] = useState<FooterConfig>(DEFAULT_FOOTER_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "settings")
        .eq("key", "footer")
        .maybeSingle();
      if (!active) return;
      setConfig(parseConfig(data?.content));
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return { config, loading };
};

export const fetchFooterConfig = async (): Promise<FooterConfig> => {
  const { data } = await supabase
    .from("page_content")
    .select("content")
    .eq("page", "settings")
    .eq("key", "footer")
    .maybeSingle();
  return parseConfig(data?.content);
};
