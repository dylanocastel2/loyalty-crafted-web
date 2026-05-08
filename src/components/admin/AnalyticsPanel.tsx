import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Clock, Eye, Users } from "lucide-react";

type View = {
  id: string;
  path: string;
  session_id: string;
  duration_ms: number;
  created_at: string;
};

type Range = "7" | "30" | "90" | "all";

function formatDuration(ms: number) {
  if (!ms || ms < 1000) return `${ms || 0} ms`;
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return `${m}m ${rs}s`;
}

export default function AnalyticsPanel() {
  const [range, setRange] = useState<Range>("30");
  const [views, setViews] = useState<View[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    let q = supabase.from("page_views").select("id, path, session_id, duration_ms, created_at").order("created_at", { ascending: false }).limit(5000);
    if (range !== "all") {
      const days = parseInt(range, 10);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      q = q.gte("created_at", since);
    }
    const { data } = await q;
    setViews((data as View[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [range]);

  const stats = useMemo(() => {
    const total = views.length;
    const sessions = new Set(views.map((v) => v.session_id)).size;
    const durations = views.filter((v) => v.duration_ms > 0).map((v) => v.duration_ms);
    const avg = durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;

    const byPath = new Map<string, { visits: number; sessions: Set<string>; durations: number[] }>();
    for (const v of views) {
      const cur = byPath.get(v.path) || { visits: 0, sessions: new Set(), durations: [] };
      cur.visits += 1;
      cur.sessions.add(v.session_id);
      if (v.duration_ms > 0) cur.durations.push(v.duration_ms);
      byPath.set(v.path, cur);
    }
    const perPage = Array.from(byPath.entries())
      .map(([path, v]) => ({
        path,
        visits: v.visits,
        sessions: v.sessions.size,
        avg: v.durations.length ? v.durations.reduce((a, b) => a + b, 0) / v.durations.length : 0,
      }))
      .sort((a, b) => b.visits - a.visits);

    // Daily visits for last N days
    const daily = new Map<string, number>();
    for (const v of views) {
      const d = v.created_at.slice(0, 10);
      daily.set(d, (daily.get(d) || 0) + 1);
    }
    const days = Array.from(daily.entries()).sort((a, b) => (a[0] < b[0] ? -1 : 1));

    return { total, sessions, avg, perPage, days };
  }, [views]);

  const maxDay = Math.max(1, ...stats.days.map(([, n]) => n));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold">Analytics</h2>
        </div>
        <Select value={range} onValueChange={(v) => setRange(v as Range)}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Laatste 7 dagen</SelectItem>
            <SelectItem value="30">Laatste 30 dagen</SelectItem>
            <SelectItem value="90">Laatste 90 dagen</SelectItem>
            <SelectItem value="all">Alles</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card icon={<Eye className="h-4 w-4" />} label="Paginabezoeken" value={stats.total.toString()} />
        <Card icon={<Users className="h-4 w-4" />} label="Unieke sessies" value={stats.sessions.toString()} />
        <Card icon={<Clock className="h-4 w-4" />} label="Gem. tijd op pagina" value={formatDuration(stats.avg)} />
      </div>

      <div className="bg-card border rounded-lg p-5">
        <h3 className="font-semibold mb-3">Bezoeken per dag</h3>
        {loading ? (
          <p className="text-sm text-muted-foreground">Laden...</p>
        ) : stats.days.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nog geen data.</p>
        ) : (
          <div className="flex items-end gap-1 h-40">
            {stats.days.map(([d, n]) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1 group">
                <div
                  className="w-full bg-primary/80 hover:bg-primary rounded-t transition-colors"
                  style={{ height: `${(n / maxDay) * 100}%`, minHeight: 2 }}
                  title={`${d}: ${n} bezoeken`}
                />
                <div className="text-[10px] text-muted-foreground rotate-45 origin-left whitespace-nowrap">
                  {d.slice(5)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="p-4 border-b font-semibold">Per pagina</div>
        {stats.perPage.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground">Nog geen pagina-data.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Pagina</th>
                <th className="px-4 py-3 text-right">Bezoeken</th>
                <th className="px-4 py-3 text-right">Unieke sessies</th>
                <th className="px-4 py-3 text-right">Gem. tijd</th>
              </tr>
            </thead>
            <tbody>
              {stats.perPage.map((row) => (
                <tr key={row.path} className="border-t">
                  <td className="px-4 py-2 font-mono text-xs">{row.path}</td>
                  <td className="px-4 py-2 text-right">{row.visits}</td>
                  <td className="px-4 py-2 text-right">{row.sessions}</td>
                  <td className="px-4 py-2 text-right">{formatDuration(row.avg)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Card({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border rounded-lg p-5">
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}