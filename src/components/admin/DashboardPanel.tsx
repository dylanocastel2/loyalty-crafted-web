import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Eye,
  Mail,
  FileText,
  MessageSquare,
  Briefcase,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Stats = {
  views7d: number;
  views30d: number;
  uniqueSessions7d: number;
  unread: number;
  totalSubmissions: number;
  customPages: number;
  publishedPages: number;
  klantcases: number;
  popupResponses: number;
};

type RecentSub = { id: string; name: string; subject: string; created_at: string; read: boolean };
type TopPage = { path: string; count: number };

export default function DashboardPanel({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<RecentSub[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const now = Date.now();
      const since7 = new Date(now - 7 * 86400_000).toISOString();
      const since30 = new Date(now - 30 * 86400_000).toISOString();

      const [v7, v30, subs, customPages, klantcases, popups, recentSubs] = await Promise.all([
        supabase.from("page_views").select("session_id, path", { count: "exact" }).gte("created_at", since7).limit(5000),
        supabase.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since30),
        supabase.from("contact_submissions").select("id, read", { count: "exact" }).limit(2000),
        supabase.from("custom_pages").select("id, published", { count: "exact" }).limit(2000),
        supabase.from("klantcases").select("id", { count: "exact", head: true }),
        supabase.from("popup_responses").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id, name, subject, created_at, read").order("created_at", { ascending: false }).limit(5),
      ]);

      const v7Rows = (v7.data as { session_id: string; path: string }[]) || [];
      const sessions = new Set(v7Rows.map((r) => r.session_id));
      const pageMap = new Map<string, number>();
      for (const r of v7Rows) pageMap.set(r.path, (pageMap.get(r.path) || 0) + 1);
      const top: TopPage[] = [...pageMap.entries()]
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const subRows = (subs.data as { id: string; read: boolean }[]) || [];
      const customRows = (customPages.data as { id: string; published: boolean }[]) || [];

      setStats({
        views7d: v7.count ?? v7Rows.length,
        views30d: v30.count ?? 0,
        uniqueSessions7d: sessions.size,
        unread: subRows.filter((s) => !s.read).length,
        totalSubmissions: subs.count ?? subRows.length,
        customPages: customPages.count ?? customRows.length,
        publishedPages: customRows.filter((p) => p.published).length,
        klantcases: klantcases.count ?? 0,
        popupResponses: popups.count ?? 0,
      });
      setRecent((recentSubs.data as RecentSub[]) || []);
      setTopPages(top);
      setLoading(false);
    };
    load();
  }, []);

  if (loading || !stats) {
    return <div className="text-muted-foreground">Dashboard laden…</div>;
  }

  const cards = [
    { label: "Paginaweergaven (7d)", value: stats.views7d, sub: `${stats.uniqueSessions7d} unieke bezoekers`, icon: Eye, accent: "text-blue-600 bg-blue-50" },
    { label: "Nieuwe aanvragen", value: stats.unread, sub: `${stats.totalSubmissions} totaal`, icon: Mail, accent: "text-orange-600 bg-orange-50" },
    { label: "Pagina's", value: stats.customPages, sub: `${stats.publishedPages} live`, icon: FileText, accent: "text-primary bg-primary/10" },
    { label: "Klantcases", value: stats.klantcases, sub: "totaal", icon: Briefcase, accent: "text-purple-600 bg-purple-50" },
    { label: "Pop-up reacties", value: stats.popupResponses, sub: "totaal", icon: MessageSquare, accent: "text-emerald-600 bg-emerald-50" },
    { label: "Weergaven (30d)", value: stats.views30d, sub: "afgelopen maand", icon: Eye, accent: "text-slate-600 bg-slate-100" },
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.label} className="bg-card border rounded-lg p-5 flex items-start gap-4">
                <div className={`h-10 w-10 rounded-md flex items-center justify-center ${c.accent}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground">{c.label}</div>
                  <div className="text-2xl font-bold leading-tight">{c.value.toLocaleString("nl-NL")}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="font-bold mb-3">Snel aan de slag</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to="/admin/pages/nieuw/edit">
            <div className="bg-card border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition cursor-pointer h-full">
              <Plus className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold text-sm">Nieuwe pagina</div>
              <div className="text-xs text-muted-foreground">Bouw een pagina met blokken</div>
            </div>
          </Link>
          <button onClick={() => onNavigate("media")} className="text-left">
            <div className="bg-card border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition h-full">
              <ArrowUpRight className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold text-sm">Media uploaden</div>
              <div className="text-xs text-muted-foreground">Beheer afbeeldingen & bestanden</div>
            </div>
          </button>
          <button onClick={() => onNavigate("aanvragen")} className="text-left">
            <div className="bg-card border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition h-full">
              <Mail className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold text-sm">Aanvragen bekijken</div>
              <div className="text-xs text-muted-foreground">{stats.unread} ongelezen</div>
            </div>
          </button>
          <button onClick={() => onNavigate("analytics")} className="text-left">
            <div className="bg-card border rounded-lg p-4 hover:border-primary/40 hover:shadow-sm transition h-full">
              <Eye className="h-5 w-5 text-primary mb-2" />
              <div className="font-semibold text-sm">Analytics</div>
              <div className="text-xs text-muted-foreground">Bekijk bezoekersgedrag</div>
            </div>
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg">
          <div className="px-5 py-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Recente aanvragen</h3>
            <button onClick={() => onNavigate("aanvragen")} className="text-xs text-primary hover:underline">
              Alles bekijken
            </button>
          </div>
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nog geen aanvragen.</p>
          ) : (
            <ul className="divide-y">
              {recent.map((r) => (
                <li key={r.id} className="px-5 py-3 flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${r.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{r.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{r.subject}</div>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString("nl-NL", { day: "2-digit", month: "short" })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-card border rounded-lg">
          <div className="px-5 py-3 border-b flex items-center justify-between">
            <h3 className="font-semibold">Top pagina's (7d)</h3>
            <button onClick={() => onNavigate("analytics")} className="text-xs text-primary hover:underline">
              Details
            </button>
          </div>
          {topPages.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">Nog geen data.</p>
          ) : (
            <ul className="divide-y">
              {topPages.map((p) => {
                const max = topPages[0]?.count || 1;
                const pct = Math.round((p.count / max) * 100);
                return (
                  <li key={p.path} className="px-5 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono truncate mr-3">{p.path}</span>
                      <span className="text-muted-foreground tabular-nums">{p.count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}