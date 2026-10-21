"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dish } from "@/data/menu";
import DishImage from "./DishImage";
import { formatPrice } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

type FeaturedCarouselProps = {
  dishes: Dish[];
  onDishClick: (dish: Dish) => void;
};

const TAG_LABEL: Record<string, string> = {
  recomendado: "Favorito",
  picante:     "Picante",
  amazonico:   "Amazónico",
  marino:      "Marino",
  nuevo:       "Nuevo",
};

export default function FeaturedCarousel({ dishes, onDishClick }: FeaturedCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { state, addItem, showToast } = useCart();

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 220 : -220, behavior: "smooth" });
  };

  const handleQuickAdd = (dish: Dish, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!dish.price) return;
    if (dish.options && dish.options.length > 0) {
      onDishClick(dish);
      return;
    }
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      options: [],
      note: "",
    });
    showToast(`✓ Agregado: ${dish.name}`);
  };

  return (
    <section className="pt-6 pb-2" aria-label="Los favoritos del Tunche">
      <div className="px-4 mb-4">
        <div className="section-divider">
          <div>
            <p className="text-tunche-muted text-xs font-semibold uppercase tracking-wider">Lo que más piden</p>
            <h2 className="font-display text-tunche-cream text-lg font-bold leading-tight">
              Los favoritos del <span className="text-gold-gradient">Tunche</span>
            </h2>
          </div>
        </div>
      </div>

      <div className="relative">
        {/* Scroll buttons (only shows on large screens) */}
        <button
          onClick={() => scroll("left")}
          className="hidden lg:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-tunche-surface border border-tunche-border text-tunche-cream hover:border-tunche-gold/40 shadow-md"
          aria-label="Anterior"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => scroll("right")}
          className="hidden lg:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 items-center justify-center rounded-full bg-tunche-surface border border-tunche-border text-tunche-cream hover:border-tunche-gold/40 shadow-md"
          aria-label="Siguiente"
        >
          <ChevronRight size={16} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 px-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {dishes.map((dish) => {
            const inCart = state.items.some((i) => i.dishId === dish.id);
            return (
              <article
                key={dish.id}
                onClick={() => onDishClick(dish)}
                className="flex-shrink-0 w-48 rounded-xl overflow-hidden border border-tunche-border bg-tunche-surface cursor-pointer transition-[border-color,box-shadow,transform] duration-200 hover:border-tunche-gold/40 hover:shadow-[0_4px_20px_rgba(201,152,58,0.14)] active:scale-[0.98]"
                aria-label={`${dish.name}, ${dish.price ? formatPrice(dish.price) : "Precio a consultar"}`}
              >
                {/* Image */}
                <div className="h-32 relative">
                  <DishImage
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="192px"
                    className="absolute inset-0"
                  />
                  {/* Tag badge */}
                  {dish.tags && dish.tags[0] && (
                    <div className="absolute top-2 left-2">
                      <span className={`tag tag-${dish.tags[0]}`}>
                        {TAG_LABEL[dish.tags[0]]}
                      </span>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-3">
                  <h3 className="text-tunche-cream text-sm font-bold leading-tight line-clamp-2 mb-1">
                    {dish.name}
                  </h3>
                  <div className="flex items-center justify-between mt-2 gap-1">
                    <span className="text-tunche-gold font-bold text-sm">
                      {dish.price ? formatPrice(dish.price) : "—"}
                    </span>
                    <button
                      onClick={(e) => handleQuickAdd(dish, e)}
                      className={`flex items-center justify-center w-11 h-11 rounded-full border transition-[background-color,border-color,color,transform] duration-150 text-base font-bold flex-shrink-0 ${
                        inCart
                          ? "bg-tunche-gold border-tunche-gold text-tunche-dark"
                          : "bg-tunche-surface-2 border-tunche-border text-tunche-gold hover:bg-tunche-gold hover:text-tunche-dark hover:border-tunche-gold"
                      }`}
                      aria-label={`Agregar ${dish.name} al carrito`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
