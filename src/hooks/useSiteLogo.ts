import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const EVENT = "site-logo-updated";

export const SITE_LOGO_EVENT = EVENT;

export function emitSiteLogoUpdate(url: string) {
  try {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: url }));
  } catch {}
}

export function useSiteLogo(fallback?: string) {
  const [url, setUrl] = useState<string | undefined>(fallback);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "settings")
        .eq("key", "site_logo")
        .maybeSingle();
      if (cancelled) return;
      const v = (data?.content || "").trim();
      setUrl(v || fallback);
      setLoaded(true);
    };
    load();
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setUrl((detail || "").trim() || fallback);
    };
    window.addEventListener(EVENT, onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener(EVENT, onUpdate);
    };
  }, [fallback]);

  return { url, loaded };
}