import { useEffect, useRef } from "react";
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

/**
 * Tracks a page view + time spent on each route change.
 * Inserts a row immediately and updates duration_ms when leaving the page.
 */
export function usePageTracking() {
  const location = useLocation();
  const rowIdRef = useRef<string | null>(null);
  const startRef = useRef<number>(Date.now());

  useEffect(() => {
    // Don't track admin pages
    if (location.pathname.startsWith("/admin")) return;

    const sessionId = getSessionId();
    const path = location.pathname;
    startRef.current = Date.now();
    rowIdRef.current = null;

    let cancelled = false;
    supabase
      .from("page_views")
      .insert({
        path,
        session_id: sessionId,
        referrer: document.referrer || null,
        duration_ms: 0,
      })
      .select("id")
      .single()
      .then(({ data }) => {
        if (!cancelled && data) rowIdRef.current = data.id;
      });

    const flush = () => {
      const id = rowIdRef.current;
      if (!id) return;
      const duration = Date.now() - startRef.current;
      // Use keepalive-friendly path: regular update; best-effort
      supabase.from("page_views").update({ duration_ms: duration }).eq("id", id).then(() => {});
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      cancelled = true;
      flush();
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [location.pathname]);
}