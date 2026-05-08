import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "lg_session_id";
function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

// Buffer + flush so we don't hammer the API
let buffer: any[] = [];
let timer: ReturnType<typeof setTimeout> | null = null;

function scheduleFlush() {
  if (timer) return;
  timer = setTimeout(async () => {
    timer = null;
    if (buffer.length === 0) return;
    const batch = buffer.splice(0, buffer.length);
    await supabase.from("heatmap_events").insert(batch);
  }, 1500);
}

export function useHeatmapTracking() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    const sessionId = getSessionId();

    const onClick = (e: MouseEvent) => {
      const x = Math.round(e.pageX);
      const y = Math.round(e.pageY);
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const pw = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
      const ph = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      buffer.push({
        path: location.pathname,
        session_id: sessionId,
        event_type: "click",
        x,
        y,
        viewport_w: vw,
        viewport_h: vh,
        page_w: pw,
        page_h: ph,
      });
      scheduleFlush();
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true } as any);
    };
  }, [location.pathname]);
}