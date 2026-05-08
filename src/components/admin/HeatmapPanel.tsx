import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Flame, RefreshCcw, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Event = {
  id: string;
  path: string;
  x: number;
  y: number;
  viewport_w: number;
  viewport_h: number;
  page_w: number;
  page_h: number;
  created_at: string;
};

type Range = "7" | "30" | "90" | "all";
type Device = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTH: Record<Device, number> = {
  desktop: 1280,
  tablet: 820,
  mobile: 390,
};

function drawHeatmap(canvas: HTMLCanvasElement, points: { x: number; y: number }[], radius: number, intensity: number) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (points.length === 0) return;

  // Build alpha map via radial gradients
  const alpha = document.createElement("canvas");
  alpha.width = canvas.width;
  alpha.height = canvas.height;
  const actx = alpha.getContext("2d")!;
  actx.globalCompositeOperation = "lighter";
  for (const p of points) {
    const grad = actx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
    grad.addColorStop(0, `rgba(0,0,0,${intensity})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    actx.fillStyle = grad;
    actx.beginPath();
    actx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    actx.fill();
  }

  // Colorize alpha map
  const img = actx.getImageData(0, 0, alpha.width, alpha.height);
  const data = img.data;
  const palette = [
    [0, 0, 255, 0],
    [0, 0, 255, 120],
    [0, 255, 255, 180],
    [0, 255, 0, 200],
    [255, 255, 0, 220],
    [255, 128, 0, 235],
    [255, 0, 0, 250],
  ];
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a === 0) continue;
    const t = Math.min(1, a);
    const idx = t * (palette.length - 1);
    const lo = Math.floor(idx);
    const hi = Math.min(palette.length - 1, lo + 1);
    const f = idx - lo;
    const c0 = palette[lo];
    const c1 = palette[hi];
    data[i] = c0[0] + (c1[0] - c0[0]) * f;
    data[i + 1] = c0[1] + (c1[1] - c0[1]) * f;
    data[i + 2] = c0[2] + (c1[2] - c0[2]) * f;
    data[i + 3] = c0[3] + (c1[3] - c0[3]) * f;
  }
  ctx.putImageData(img, 0, 0);
}

export default function HeatmapPanel() {
  const { toast } = useToast();
  const [paths, setPaths] = useState<string[]>([]);
  const [path, setPath] = useState<string>("/");
  const [range, setRange] = useState<Range>("30");
  const [device, setDevice] = useState<Device>("desktop");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(30);
  const [intensity, setIntensity] = useState(0.35);
  const [iframeHeight, setIframeHeight] = useState(900);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load distinct paths
  useEffect(() => {
    supabase
      .from("heatmap_events")
      .select("path")
      .order("created_at", { ascending: false })
      .limit(2000)
      .then(({ data }) => {
        const set = new Set<string>(["/"]);
        (data || []).forEach((r: any) => set.add(r.path));
        setPaths(Array.from(set).sort());
      });
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    let q = supabase
      .from("heatmap_events")
      .select("id, path, x, y, viewport_w, viewport_h, page_w, page_h, created_at")
      .eq("path", path)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (range !== "all") {
      const days = parseInt(range, 10);
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      q = q.gte("created_at", since);
    }
    const { data } = await q;
    setEvents((data as Event[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    loadEvents();
  }, [path, range]);

  // Filter events to selected device viewport bucket
  const filtered = useMemo(() => {
    const w = DEVICE_WIDTH[device];
    return events.filter((e) => {
      if (device === "mobile") return e.viewport_w < 640;
      if (device === "tablet") return e.viewport_w >= 640 && e.viewport_w < 1024;
      return e.viewport_w >= 1024;
    });
  }, [events, device]);

  // Draw heatmap whenever data / canvas size changes
  const drawNow = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const targetW = DEVICE_WIDTH[device];
    const containerW = container.clientWidth;
    const scale = containerW / targetW;
    canvas.width = containerW;
    canvas.height = iframeHeight;
    const points = filtered.map((e) => {
      const sx = (e.x / Math.max(e.viewport_w, 1)) * targetW * scale;
      const sy = e.y * scale;
      return { x: sx, y: sy };
    });
    drawHeatmap(canvas, points, radius, intensity);
  };

  useEffect(() => {
    drawNow();
    const onResize = () => drawNow();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered, radius, intensity, iframeHeight, device]);

  const clearAll = async () => {
    if (!confirm(`Alle heatmap-data voor ${path} verwijderen?`)) return;
    await supabase.from("heatmap_events").delete().eq("path", path);
    toast({ title: "Heatmap-data verwijderd" });
    loadEvents();
  };

  const targetW = DEVICE_WIDTH[device];
  const scale = (containerRef.current?.clientWidth || targetW) / targetW;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Flame className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold">Heatmap</h2>
        <span className="ml-2 text-sm text-muted-foreground">{filtered.length} kliks weergegeven</span>
      </div>

      <div className="bg-card border rounded-lg p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Pagina</label>
          <Select value={path} onValueChange={setPath}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {paths.map((p) => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Periode</label>
          <Select value={range} onValueChange={(v) => setRange(v as Range)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 dagen</SelectItem>
              <SelectItem value="30">30 dagen</SelectItem>
              <SelectItem value="90">90 dagen</SelectItem>
              <SelectItem value="all">Alles</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Apparaat</label>
          <Select value={device} onValueChange={(v) => setDevice(v as Device)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="desktop">Desktop (≥1024px)</SelectItem>
              <SelectItem value="tablet">Tablet (640–1023px)</SelectItem>
              <SelectItem value="mobile">Mobiel (&lt;640px)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" onClick={loadEvents} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Vernieuwen
          </Button>
          <Button variant="outline" onClick={clearAll}>
            <Trash2 className="h-4 w-4 mr-1" /> Wissen
          </Button>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Punt-radius ({radius}px)</label>
          <Slider value={[radius]} min={10} max={80} step={1} onValueChange={(v) => setRadius(v[0])} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Intensiteit ({intensity.toFixed(2)})</label>
          <Slider value={[intensity * 100]} min={5} max={100} step={1} onValueChange={(v) => setIntensity(v[0] / 100)} />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Hoogte ({iframeHeight}px)</label>
          <Slider value={[iframeHeight]} min={600} max={4000} step={100} onValueChange={(v) => setIframeHeight(v[0])} />
        </div>
      </div>

      <div ref={containerRef} className="relative w-full bg-muted border rounded-lg overflow-hidden" style={{ height: iframeHeight }}>
        <iframe
          ref={iframeRef}
          src={path + (path.includes("?") ? "&" : "?") + "heatmap_preview=1"}
          title="Heatmap pagina"
          className="absolute top-0 left-0 origin-top-left border-0 bg-white"
          style={{
            width: targetW,
            height: iframeHeight / scale,
            transform: `scale(${scale})`,
          }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 pointer-events-none"
          style={{ width: "100%", height: iframeHeight, mixBlendMode: "multiply" }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: De pagina wordt geladen op {targetW}px breed en geschaald in dit venster. Kliks worden geplaatst op basis van de
        positie binnen de originele viewport.
      </p>
    </div>
  );
}