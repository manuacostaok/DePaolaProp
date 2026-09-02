"use client";

// Los 12 eventos de de-paola-fase20-analytics-cro.md — no son una lista
// aparte de los eventos de automatización de leads (Fase 11): comparten el
// momento de disparo en el código, pero alimentan medición agregada, no
// notificación operativa.
export type AnalyticsEvent =
  | "property_view"
  | "property_search"
  | "property_filter"
  | "contact_click"
  | "whatsapp_click"
  | "valuation_start"
  | "valuation_submit"
  | "visit_request"
  | "favorite_property"
  | "share_property"
  | "ai_search"
  | "lead_created";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Guard explícito: sin GA4 cargado (falta NEXT_PUBLIC_GA_MEASUREMENT_ID) o
// bloqueado por un ad-blocker, esto nunca debe romper la funcionalidad real
// del sitio — un evento de analytics fallido es silencioso a propósito.
export function trackEvent(name: AnalyticsEvent, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
