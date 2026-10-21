"use client";

import { useEffect, useRef, useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/whatsapp";

type CartButtonProps = {
  isHidden?: boolean;
};

export default function CartButton({ isHidden = false }: CartButtonProps) {
  const { state, totalItems, totalPrice, openCart } = useCart();
  const previousTotal = useRef(totalItems);
  const [isBadgeBouncing, setIsBadgeBouncing] = useState(false);

  useEffect(() => {
    const wasItemAdded = totalItems > previousTotal.current;
    previousTotal.current = totalItems;

    if (!wasItemAdded) return;

    setIsBadgeBouncing(false);
    const animationFrame = requestAnimationFrame(() => setIsBadgeBouncing(true));
    const timeout = window.setTimeout(() => setIsBadgeBouncing(false), 450);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.clearTimeout(timeout);
    };
  }, [totalItems]);

  const shouldHide = isHidden || state.isCartOpen;

  return (
    <button
      type="button"
      onClick={openCart}
      className={`cart-fab${totalItems > 0 ? " has-items" : ""}${shouldHide ? " is-hidden" : ""}`}
      aria-label={
        totalItems > 0
          ? `Ver pedido por WhatsApp con ${totalItems} ${
              totalItems === 1 ? "producto" : "productos"
            }, total ${formatPrice(totalPrice)}`
          : "Abrir pedido por WhatsApp"
      }
      aria-haspopup="dialog"
      aria-controls="cart-sheet"
      aria-expanded={state.isCartOpen}
      aria-hidden={shouldHide}
      tabIndex={shouldHide ? -1 : 0}
      id="floating-cart-btn"
    >
      <div className="cart-fab-icon-wrap">
        <WhatsAppIcon className="cart-fab-icon" />
        {totalItems > 0 && (
          <span
            className={`cart-fab-badge${isBadgeBouncing ? " is-bouncing" : ""}`}
            aria-hidden="true"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </div>

      {totalItems > 0 ? (
        <div className="cart-fab-content" aria-hidden="true">
          <span className="cart-fab-title">Ver pedido</span>
          <span className="cart-fab-dot">·</span>
          <span className="cart-fab-price">{formatPrice(totalPrice)}</span>
        </div>
      ) : (
        <span className="cart-fab-label" aria-hidden="true">
          Pedir por WhatsApp
        </span>
      )}
    </button>
  );
}
