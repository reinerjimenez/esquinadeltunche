"use client";

import { useCallback, useEffect, useRef } from "react";
import { Category } from "@/data/menu";

type CategoryNavProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
};

export default function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const selectAndFocus = useCallback((index: number) => {
    const category = categories[index];
    if (!category) return;
    onCategoryClick(category.id);
    chipRefs.current.get(category.id)?.focus();
  }, [categories, onCategoryClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = categories.findIndex((category) => category.id === activeCategory);
    if (currentIndex < 0) return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      selectAndFocus((currentIndex + 1) % categories.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectAndFocus((currentIndex - 1 + categories.length) % categories.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      selectAndFocus(0);
    } else if (event.key === "End") {
      event.preventDefault();
      selectAndFocus(categories.length - 1);
    }
  }, [activeCategory, categories, selectAndFocus]);

  // Scroll active chip into view
  useEffect(() => {
    const chip = chipRefs.current.get(activeCategory);
    if (chip && scrollRef.current) {
      const container = scrollRef.current;
      const chipLeft = chip.offsetLeft;
      const chipWidth = chip.offsetWidth;
      const containerWidth = container.offsetWidth;
      const scrollTarget = chipLeft - containerWidth / 2 + chipWidth / 2;
      container.scrollTo({ left: scrollTarget, behavior: "smooth" });
    }
  }, [activeCategory]);

  return (
    <nav
      id="category-nav"
      className="category-nav sticky z-30"
      aria-label="Navegación de categorías"
    >
      <div
        ref={scrollRef}
        className="category-nav-track scrollbar-hide"
        role="tablist"
        onKeyDown={handleKeyDown}
        aria-label="Categorías del menú"
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            ref={(el) => { if (el) chipRefs.current.set(cat.id, el); }}
            onClick={() => onCategoryClick(cat.id)}
            role="tab"
            aria-selected={activeCategory === cat.id}
            tabIndex={activeCategory === cat.id ? 0 : -1}
            id={`tab-${cat.id}`}
            aria-controls="catalog-panel"
            className={`chip ${activeCategory === cat.id ? "active" : ""}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
