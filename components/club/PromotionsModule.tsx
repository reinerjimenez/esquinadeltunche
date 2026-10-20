"use client";

import Image from "next/image";
import { Sparkles, Calendar, ArrowRight, MessageCircle } from "lucide-react";
import { Promotion, isPromotionActive } from "@/data/club";
import { config } from "@/data/config";
import { buildPromoInquiryUrl, formatPrice } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type PromotionsModuleProps = {
  promotions: Promotion[];
  onOpenMenu?: () => void;
  onApplyCoupon?: (code: string) => void;
};

export default function PromotionsModule({
  promotions,
  onOpenMenu,
  onApplyCoupon,
}: PromotionsModuleProps) {
  // Filtrar solo promociones realmente activas y vigentes
  const activePromos = promotions.filter(isPromotionActive);

  // Si no hay promociones activas configuradas, mostrar un diseño elegante
  // que invite a consultar las promociones y platos del día por WhatsApp
  if (activePromos.length === 0) {
    const handleConsultPromo = () => {
      trackEvent("whatsapp_click", { context: "promo", label: "consultar_promociones_del_dia" });
      const url = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(
        "¡Hola, La Esquina del Tunche! 👋\nQuiero consultar si tienen alguna promoción o especial disponible el día de hoy."
      )}`;
      window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
      <div className="card-surface p-5 sm:p-6 text-center relative overflow-hidden border border-tunche-border/80">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-tunche-gold/5 blur-2xl pointer-events-none" />
        <div className="flex flex-col items-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-tunche-gold/10 border border-tunche-gold/30 flex items-center justify-center text-tunche-gold mb-3">
            <Sparkles size={22} aria-hidden="true" />
          </div>
          <h3 className="font-display text-tunche-cream text-base sm:text-lg font-bold mb-1">
            Promociones y Especiales del Día
          </h3>
          <p className="text-tunche-muted text-xs sm:text-sm leading-relaxed mb-4">
            Cada día preparamos atenciones y sugerencias con los mejores insumos frescos de la selva y del mar. Consulta por WhatsApp nuestros platos recomendados.
          </p>
          <button
            onClick={handleConsultPromo}
            className="btn-outline-gold text-xs sm:text-sm py-2.5 px-5 flex items-center gap-2"
            aria-label="Consultar promociones del día por WhatsApp"
          >
            <MessageCircle size={16} aria-hidden="true" />
            Consultar especiales por WhatsApp
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {activePromos.map((promo) => {
        const handleAction = () => {
          trackEvent("promo_click", { promoId: promo.id, promoTitle: promo.title });

          if (!promo.action || promo.action.type === "whatsapp") {
            const url = buildPromoInquiryUrl(promo.title, promo.promoCode);
            window.open(url, "_blank", "noopener,noreferrer");
          } else if (promo.action.type === "menu" && onOpenMenu) {
            onOpenMenu();
          } else if (promo.action.type === "coupon" && promo.promoCode && onApplyCoupon) {
            onApplyCoupon(promo.promoCode);
          }
        };

        return (
          <article
            key={promo.id}
            className="card-surface border border-tunche-border hover:border-tunche-gold/40 transition-colors p-4 sm:p-5 flex flex-col sm:flex-row gap-4"
          >
            {promo.image && (
              <div className="relative w-full sm:w-44 h-36 sm:h-auto rounded-lg overflow-hidden flex-shrink-0 bg-tunche-surface-2">
                <Image
                  src={promo.image}
                  alt={promo.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 176px"
                />
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="inline-flex items-center gap-1 rounded-full bg-tunche-gold/15 border border-tunche-gold/40 px-2.5 py-0.5 text-[11px] font-bold text-tunche-gold">
                    <Sparkles size={11} aria-hidden="true" />
                    Promoción activa
                  </span>
                  {promo.endDate && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-tunche-muted">
                      <Calendar size={11} aria-hidden="true" />
                      Hasta {promo.endDate}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-tunche-cream text-base sm:text-lg font-bold">
                  {promo.title}
                </h3>
                <p className="text-tunche-muted text-xs sm:text-sm mt-1 leading-relaxed">
                  {promo.description}
                </p>

                {/* Precios promocionales reales únicamente si están explícitamente configurados */}
                {typeof promo.promoPrice === "number" && (
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display text-tunche-gold text-lg font-bold">
                      {formatPrice(promo.promoPrice)}
                    </span>
                    {typeof promo.originalPrice === "number" && (
                      <span className="text-xs text-tunche-muted/70 line-through">
                        {formatPrice(promo.originalPrice)}
                      </span>
                    )}
                  </div>
                )}

                {/* Condiciones explícitas */}
                {promo.conditions && promo.conditions.length > 0 && (
                  <ul className="mt-2.5 space-y-1 text-[11px] text-tunche-muted/80 list-disc list-inside">
                    {promo.conditions.map((cond, i) => (
                      <li key={i}>{cond}</li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-tunche-border/60 flex items-center justify-between gap-3">
                {promo.promoCode && (
                  <span className="font-mono text-xs font-semibold text-tunche-gold-bright bg-tunche-surface-2 px-2.5 py-1 rounded border border-tunche-border">
                    Código: {promo.promoCode}
                  </span>
                )}
                <button
                  onClick={handleAction}
                  className="btn-gold !py-2 !px-4 text-xs flex items-center gap-1.5 ml-auto"
                  aria-label={`Acción para ${promo.title}`}
                >
                  {promo.action?.label || "Aprovechar por WhatsApp"}
                  <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
