"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";

type HeaderProps = {
  searchQuery: string;
  onSearch: (q: string) => void;
};

export default function Header({ searchQuery, onSearch }: HeaderProps) {
  const { totalItems, totalPrice, openCart } = useCart();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header id="site-header" className="site-header sticky top-0 z-40">
      <div className="site-header-inner">
        {/* Logo */}
        {!searchOpen && (
          <div className="flex-shrink-0">
            <Image
              src="/img/logo.webp"
              alt="La Esquina del Tunche"
              width={38}
              height={38}
              className="rounded-full border border-tunche-gold/30"
            />
          </div>
        )}

        {/* Search bar */}
        {searchOpen ? (
          <div className="header-search">
            <Search size={16} className="text-tunche-muted flex-shrink-0" aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar platos..."
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-tunche-cream text-sm placeholder:text-tunche-muted"
              aria-label="Buscar platos en el menú"
              autoFocus
            />
            <button
              onClick={() => { onSearch(""); setSearchOpen(false); }}
              className="header-icon-button"
              aria-label="Cerrar buscador"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-tunche-muted font-semibold uppercase tracking-wider leading-none">La Esquina del</p>
              <h1 className="font-display text-tunche-gold text-base font-bold leading-tight truncate">Tunche</h1>
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="header-icon-button"
              aria-label="Abrir buscador"
            >
              <Search size={18} />
            </button>
          </>
        )}

        {/* Cart button */}
        <button
          onClick={openCart}
          className="header-icon-button relative flex-shrink-0"
          aria-label={`Carrito con ${totalItems} productos, total S/ ${totalPrice.toFixed(2)}`}
          id="header-cart-btn"
        >
          <ShoppingBag size={18} />
          {totalItems > 0 && (
            <span
              className="badge absolute -top-1 -right-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
