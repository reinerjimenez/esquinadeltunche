"use client";

import { useState } from "react";
import { Ticket, Copy, Check, ChevronDown, ChevronUp, MessageCircle, ShoppingBag } from "lucide-react";
import { Coupon } from "@/data/club";
import { useCart } from "@/lib/cart";
import { buildCouponInquiryUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";

type CouponsModuleProps = {
  coupons: Coupon[];
};

export default function CouponsModule({ coupons }: CouponsModuleProps) {
  const { setPromoCode, showToast, openCart } = useCart();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  const enabledCoupons = coupons.filter((c) => c.enabled);

  if (enabledCoupons.length === 0) {
    return (
      <div className="card-surface p-5 text-center border border-tunche-border/80">
        <Ticket size={24} className="mx-auto text-tunche-muted mb-2 opacity-60" aria-hidden="true" />
        <p className="text-tunche-cream text-sm font-semibold">Sin cupones activos por el momento</p>
        <p className="text-tunche-muted text-xs mt-1">
          Nuevos cupones de cortesía y fidelización serán anunciados próximamente.
        </p>
      </div>
    );
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      showToast(`Código ${code} copiado al portapapeles`);
      trackEvent("coupon_copy", { couponCode: code });
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {
      showToast(`Código: ${code}`);
    });
  };

  const handleApplyToCart = (code: string) => {
    setPromoCode(code);
    showToast(`Cupón ${code} agregado a tu pedido`);
    trackEvent("coupon_apply_cart", { couponCode: code });
    openCart();
  };

  const handleInquireWhatsApp = (coupon: Coupon) => {
    trackEvent("whatsapp_click", { context: "coupon", promoCode: coupon.code });
    const url = buildCouponInquiryUrl(coupon.code, coupon.name);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const toggleExpand = (code: string) => {
    setExpandedCode((prev) => (prev === code ? null : code));
  };

  return (
    <div className="flex flex-col gap-3">
      {enabledCoupons.map((coupon) => {
        const isCopied = copiedCode === coupon.code;
        const isExpanded = expandedCode === coupon.code;

        return (
          <article
            key={coupon.code}
            className="card-surface border border-tunche-border hover:border-tunche-gold/40 transition-colors p-4 relative overflow-hidden"
          >
            {/* Cabecera del cupón */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs font-bold text-tunche-gold bg-tunche-surface-2 border border-tunche-gold/40 px-2 py-0.5 rounded tracking-wider">
                    {coupon.code}
                  </span>
                  {coupon.benefitValue && (
                    <span className="text-[11px] font-semibold text-tunche-cream/90 bg-tunche-surface-3 px-2 py-0.5 rounded">
                      {coupon.benefitValue}
                    </span>
                  )}
                  <span className="text-[11px] text-tunche-muted">
                    {coupon.validity}
                  </span>
                </div>

                <h3 className="font-display text-tunche-cream text-sm sm:text-base font-bold">
                  {coupon.name}
                </h3>
                <p className="text-tunche-muted text-xs mt-1 leading-relaxed">
                  {coupon.description}
                </p>
              </div>

              {/* Botón copiar rápido */}
              <button
                type="button"
                onClick={() => handleCopy(coupon.code)}
                className="flex size-11 items-center justify-center rounded-full border border-tunche-border bg-tunche-surface-2 text-tunche-muted transition-[color,border-color] duration-150 hover:border-tunche-gold/40 hover:text-tunche-gold flex-shrink-0"
                aria-label={`Copiar código ${coupon.code}`}
                title="Copiar código"
              >
                {isCopied ? (
                  <Check size={16} className="text-tunche-gold" />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>

            {/* Condiciones desplegables */}
            <div className="mt-3 pt-2.5 border-t border-tunche-border/60">
              <button
                type="button"
                onClick={() => toggleExpand(coupon.code)}
                className="flex min-h-11 items-center gap-1 text-[11px] font-medium text-tunche-muted transition-colors hover:text-tunche-cream"
                aria-expanded={isExpanded}
              >
                <span>{isExpanded ? "Ocultar condiciones" : "Ver condiciones de uso"}</span>
                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
              </button>

              {isExpanded && (
                <div className="mt-2 text-[11px] text-tunche-muted/90 bg-tunche-surface-2/60 p-2.5 rounded-lg space-y-1">
                  <p className="font-semibold text-tunche-cream/90">Condiciones de aplicación:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {coupon.conditions.map((cond, idx) => (
                      <li key={idx}>{cond}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-tunche-muted/70 italic pt-1">
                    * La aplicación final del beneficio requiere confirmación por el personal del restaurante.
                  </p>
                </div>
              )}
            </div>

            {/* Acciones principales */}
            <div className="mt-3 flex items-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleApplyToCart(coupon.code)}
                className="btn-gold !py-1.5 !px-3.5 text-xs flex items-center gap-1.5"
                aria-label={`Usar cupón ${coupon.code} en mi pedido`}
              >
                <ShoppingBag size={13} aria-hidden="true" />
                Usar en mi pedido
              </button>

              <button
                type="button"
                onClick={() => handleInquireWhatsApp(coupon)}
                className="btn-outline-gold !py-1.5 !px-3 text-xs flex items-center gap-1.5"
                aria-label={`Consultar cupón ${coupon.code} por WhatsApp`}
              >
                <MessageCircle size={13} aria-hidden="true" />
                Consultar por WhatsApp
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
