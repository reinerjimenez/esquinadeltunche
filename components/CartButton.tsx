"use client";

import { useEffect, useState } from "react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/whatsapp";

type CartButtonProps = {
  isHidden?: boolean;
};

export default function CartButton({ isHidden = false }: CartButtonProps) {
  const { state, totalItems, totalPrice, openCart } = useCart();
  const [isCatalogVisibleOnMobile, setIsCatalogVisibleOnMobile] = useState(false);

  useEffect(() => {
    const mobileViewport = window.matchMedia("(max-width: 767px)");
    let animationFrame = 0;

    const updateVisibility = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const catalog = document.getElementById("catalog-panel");
        const header = document.getElementById("site-header");

        if (!mobileViewport.matches || !catalog) {
          setIsCatalogVisibleOnMobile(false);
          return;
        }

        const catalogRect = catalog.getBoundingClientRect();
        const visibleTop = header?.getBoundingClientRect().bottom ?? 0;
        setIsCatalogVisibleOnMobile(
          catalogRect.top < window.innerHeight && catalogRect.bottom > visibleTop
        );
      });
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);
    mobileViewport.addEventListener("change", updateVisibility);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
      mobileViewport.removeEventListener("change", updateVisibility);
    };
  }, []);

  const shouldHide = isHidden || state.isCartOpen || isCatalogVisibleOnMobile;

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
          <span className="cart-fab-badge" aria-hidden="true">
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
