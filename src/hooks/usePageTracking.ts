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
 * Inserts ONE row when the user leaves the page (route change / tab close)
 * with the final duration. This avoids needing an UPDATE policy.
 */
export function usePageTracking() {
  const location = useLocation();
  const startRef = useRef<number>(Date.now());
  const flushedRef = useRef<boolean>(false);

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    const sessionId = getSessionId();
    const path = location.pathname;
    const referrer = document.referrer || null;
    startRef.current = Date.now();
    flushedRef.current = false;

    const flush = () => {
      if (flushedRef.current) return;
      flushedRef.current = true;
      const duration = Math.min(86400000, Math.max(0, Date.now() - startRef.current));
      supabase
        .from("page_views")
        .insert([{ path, session_id: sessionId, referrer, duration_ms: duration }])
        .then(() => {});
    };

    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    document.addEventListener("visibilitychange", onHide);

    return () => {
      flush();
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [location.pathname]);
}