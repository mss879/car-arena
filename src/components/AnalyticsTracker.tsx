import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Lightweight client-side tracker. Avoids storing IP; uses public IP geolocation API without logging IP.
// For privacy, only country/region/city are sent, not IP.

// One log per browser session (tab/window lifecycle)
const SESSION_ID_KEY = "arc_visit_id";
const VISIT_LOGGED_KEY = "arc_analytics_logged";

function getSessionId() {
  try {
    // Use sessionStorage so each browser session is a distinct visit
    let id = sessionStorage.getItem(SESSION_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_ID_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

// Removed geo lookup to avoid storing country/region/city

export const AnalyticsTracker = () => {
  useEffect(() => {
    const logOncePerSession = async () => {
      try {
        // Prevent multiple inserts within the same browser session (and React StrictMode double-invoke)
        if (sessionStorage.getItem(VISIT_LOGGED_KEY)) return;

        const sessionId = getSessionId();
        const payload = {
          session_id: sessionId,
          path: window.location.pathname + window.location.search,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          screen_width: (window.screen?.width as number) ?? null,
          screen_height: (window.screen?.height as number) ?? null,
        } as const;
        await supabase.from("web_analytics").insert(payload);
      } catch {
        // no-op
      } finally {
        try { sessionStorage.setItem(VISIT_LOGGED_KEY, "1"); } catch {}
      }
    };

    const t = setTimeout(logOncePerSession, 50);
    return () => clearTimeout(t);
  }, []);

  return null;
};

export default AnalyticsTracker;
