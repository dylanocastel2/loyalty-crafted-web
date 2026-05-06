import { Facebook, Instagram, Linkedin, Twitter, Youtube, Github, MessageCircle, Music2 } from "lucide-react";
import { SocialPlatform, useSocials } from "@/hooks/useSocials";

const ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  twitter: Twitter,
  youtube: Youtube,
  tiktok: Music2,
  whatsapp: MessageCircle,
  github: Github,
};

const LABELS: Record<SocialPlatform, string> = {
  facebook: "Facebook", instagram: "Instagram", linkedin: "LinkedIn",
  twitter: "X / Twitter", youtube: "YouTube", tiktok: "TikTok",
  whatsapp: "WhatsApp", github: "GitHub",
};

interface Props {
  className?: string;
  iconClassName?: string;
}

const SocialIcons = ({ className = "", iconClassName = "h-5 w-5" }: Props) => {
  const { socials } = useSocials();
  if (!socials.length) return null;
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socials.map((s, i) => {
        const Icon = ICONS[s.platform];
        if (!Icon) return null;
        return (
          <a
            key={i}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={LABELS[s.platform]}
            className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
