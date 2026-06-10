import { ReactNode, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  Briefcase,
  Mail,
  MessageSquare,
  BarChart3,
  Flame,
  Layers,
  Share2,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CmsSection =
  | "dashboard"
  | "pages"
  | "media"
  | "klantcases"
  | "aanvragen"
  | "popup"
  | "analytics"
  | "heatmap"
  | "footer"
  | "socials"
  | "instellingen";

export interface NavSettings {
  groups: {
    label: string;
    items: {
      key: CmsSection;
      label: string;
      hidden?: boolean;
    }[];
  }[];
}

type Item = {
  key: CmsSection;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: number;
};

type Group = { label: string; items: Item[] };

interface Props {
  active: CmsSection;
  onSelect: (section: CmsSection) => void;
  unreadCount?: number;
  children: ReactNode;
  title?: string;
}

const ICON_MAP: Record<CmsSection, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  pages: FileText,
  media: ImageIcon,
  klantcases: Briefcase,
  aanvragen: Mail,
  popup: MessageSquare,
  analytics: BarChart3,
  heatmap: Flame,
  footer: Layers,
  socials: Share2,
  instellingen: SettingsIcon,
};

const DEFAULT_GROUPS: Group[] = [
  {
    label: "Overzicht",
    items: [{ key: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Inhoud",
    items: [
      { key: "pages", label: "Pagina-bouwer", icon: FileText },
      { key: "media", label: "Mediabibliotheek", icon: ImageIcon },
      { key: "klantcases", label: "Klantcases", icon: Briefcase },
    ],
  },
  {
    label: "Bezoekers",
    items: [
      { key: "aanvragen", label: "Aanvragen", icon: Mail },
      { key: "popup", label: "Pop-up", icon: MessageSquare },
      { key: "analytics", label: "Analytics", icon: BarChart3 },
      { key: "heatmap", label: "Heatmap", icon: Flame },
    ],
  },
  {
    label: "Site",
    items: [
      { key: "footer", label: "Footer", icon: Layers },
      { key: "socials", label: "Social media", icon: Share2 },
      { key: "instellingen", label: "Instellingen", icon: SettingsIcon },
    ],
  },
];

export default function CmsShell({ active, onSelect, unreadCount = 0, children, title }: Props) {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("page_content")
        .select("content")
        .eq("page", "settings")
        .eq("key", "admin_navigation")
        .maybeSingle();
      try {
        const parsed: NavSettings = data?.content ? JSON.parse(data.content) : null;
        if (parsed?.groups) {
          const merged: Group[] = parsed.groups.map((g) => ({
            label: g.label,
            items: g.items
              .filter((i) => !i.hidden)
              .map((i) => ({
                key: i.key,
                label: i.label,
                icon: ICON_MAP[i.key] || LayoutDashboard,
                badge: i.key === "aanvragen" ? unreadCount : undefined,
              })),
          })).filter((g) => g.items.length > 0);
          if (merged.length > 0) setGroups(merged);
        }
      } catch {
        // ignore parse errors
      }
    };
    load();
  }, [unreadCount]);

  const activeLabel =
    groups.flatMap((g) => g.items).find((i) => i.key === active)?.label ?? "CMS";

  const logout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-muted/30 flex">
      <aside className="w-64 shrink-0 border-r bg-card flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-4 border-b">
          <Link to="/admin" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="Loyaltygroup" className="h-8 w-8 rounded object-cover" />
            <div className="leading-tight">
              <div className="font-bold text-sm">Loyaltygroup</div>
              <div className="text-[11px] text-muted-foreground">CMS</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="px-3 pb-1 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                {g.label}
              </div>
              <div className="space-y-0.5">
                {g.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => onSelect(item.key)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && item.badge > 0 ? (
                        <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t p-3 space-y-1">
          <a href="/" target="_blank" rel="noreferrer" className="block">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ExternalLink className="h-4 w-4 mr-2" /> Bekijk site
            </Button>
          </a>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" /> Uitloggen
          </Button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="bg-card border-b sticky top-0 z-40">
          <div className="px-8 h-14 flex items-center justify-between">
            <h1 className="font-bold text-lg">{title || activeLabel}</h1>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
