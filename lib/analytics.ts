/**
 * Sistema ligero de telemetría y analítica de eventos para La Esquina del Tunche.
 *
 * ⚠️ CONSIDERACIONES TÉCNICAS Y LIMITACIONES:
 * 1. Esta implementación se ejecuta 100% en el frontend del cliente.
 * 2. Registra eventos de interacción del usuario (visitas, clics en WhatsApp, cupones, compartir).
 * 3. NO confirma una venta, cobro o pedido completado; la confirmación definitiva
 *    de pedidos, pagos y validación física de sellos corresponde al personal del restaurante.
 * 4. Compatible con Google Analytics (gtag), Meta Pixel o Vercel Analytics si se conectan en el futuro.
 */

export type AnalyticsEventType =
  | "page_view"
  | "whatsapp_click"
  | "promo_click"
  | "coupon_copy"
  | "coupon_apply_cart"
  | "loyalty_stamp"
  | "loyalty_reset"
  | "share_click"
  | "map_directions_click"
  | "review_click";

export type AnalyticsPayload = {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown;
};

export function trackEvent(eventType: AnalyticsEventType, payload: AnalyticsPayload = {}): void {
  try {
    if (typeof window === "undefined") return;

    // Integración opcional con gtag (Google Analytics) si existe en window
    const win = window as unknown as { gtag?: (command: string, action: string, params?: Record<string, unknown>) => void };
    if (typeof win.gtag === "function") {
      win.gtag("event", eventType, {
        event_category: payload.category || "user_interaction",
        event_label: payload.label,
        value: payload.value,
        ...payload,
      });
    }

    // Registro en consola en modo desarrollo para verificación de telemetría
    if (process.env.NODE_ENV === "development") {
      console.info(`[Analytics - ${eventType}]`, payload);
    }
  } catch {
    // Protección contra fallos silenciosos en navegadores con bloqueadores
  }
}
