"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

// Las páginas de detalle (ficha de propiedad, etc.) son Server Components —
// esto es el puente mínimo para disparar un evento de cliente al montar,
// sin convertir la página entera en Client Component.
export function TrackOnMount({ event, params }: { event: AnalyticsEvent; params?: Record<string, string | number | boolean> }) {
  useEffect(() => {
    trackEvent(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- se dispara una sola vez al montar, no en cada cambio de referencia de `params`
  }, []);

  return null;
}
