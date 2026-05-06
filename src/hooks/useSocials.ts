import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SocialPlatform =
  | "facebook" | "instagram" | "linkedin" | "twitter" | "youtube"
  | "tiktok" | "whatsapp" | "github";

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export const SOCIAL_OPTIONS: { value: SocialPlatform; label: string }[] = [
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "github", label: "GitHub" },
];

export const useSocials = () => {
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "settings")
        .eq("key", "socials")
        .maybeSingle();
      if (!active) return;
      try {
        const parsed = data?.content ? JSON.parse(data.content) : [];
        setSocials(Array.isArray(parsed) ? parsed.filter((s: any) => s?.url) : []);
      } catch {
        setSocials([]);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  return { socials, loading };
};
