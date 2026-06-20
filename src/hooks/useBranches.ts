import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface BrancheData {
  id?: string;
  slug: string;
  label: string;
  icon: string;
  shortDesc: string;
  heroTitle: string;
  heroSubtitle: string;
  problems: string[];
  opportunities: string[];
  loyaltyValue: string;
  scenarios: { title: string; text: string }[];
  features: { title: string; desc: string }[];
  whyUs: { title: string; desc: string }[];
  klantcaseFilter: string;
  tone: string;
  metaTitle: string;
  metaDescription: string;
}

const rowToBranche = (r: any): BrancheData => ({
  id: r.id,
  slug: r.slug,
  label: r.label,
  icon: r.icon || "Building2",
  shortDesc: r.short_desc || "",
  heroTitle: r.hero_title || "",
  heroSubtitle: r.hero_subtitle || "",
  problems: Array.isArray(r.problems) ? r.problems : [],
  opportunities: Array.isArray(r.opportunities) ? r.opportunities : [],
  loyaltyValue: r.loyalty_value || "",
  scenarios: Array.isArray(r.scenarios) ? r.scenarios : [],
  features: Array.isArray(r.features) ? r.features : [],
  whyUs: Array.isArray(r.why_us) ? r.why_us : [],
  klantcaseFilter: r.klantcase_filter || "",
  tone: r.tone || "",
  metaTitle: r.meta_title || "",
  metaDescription: r.meta_description || "",
});

let cache: BrancheData[] | null = null;
let inflight: Promise<BrancheData[]> | null = null;
const fetchAll = async (): Promise<BrancheData[]> => {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = (async () => {
    const { data } = await supabase
      .from("branches")
      .select("*")
      .eq("published", true)
      .order("sort_order", { ascending: true });
    cache = (data || []).map(rowToBranche);
    inflight = null;
    return cache;
  })();
  return inflight;
};

export const invalidateBranches = () => {
  cache = null;
};

export const useBranches = () => {
  const [branches, setBranches] = useState<BrancheData[]>(cache || []);
  const [loading, setLoading] = useState(!cache);
  useEffect(() => {
    let mounted = true;
    fetchAll().then((list) => {
      if (!mounted) return;
      setBranches(list);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);
  return { branches, loading };
};

export const useBranche = (slug: string) => {
  const { branches, loading } = useBranches();
  return { branche: branches.find((b) => b.slug === slug) || null, loading };
};