"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";
import { Category } from "@/data/menu";

type CategoryNavProps = {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
  isPanelOpen: boolean;
  onPanelOpenChange: (isOpen: boolean) => void;
};

export default function CategoryNav({
  categories,
  activeCategory,
  onCategoryClick,
  isPanelOpen,
  onPanelOpenChange,
}: CategoryNavProps) {
  const selectorRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const panelButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastInteractionWasKeyboardRef = useRef(false);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: true });

  const selectCategory = useCallback((id: string) => {
    onCategoryClick(id);
    onPanelOpenChange(false);
  }, [onCategoryClick, onPanelOpenChange]);

  const selectAndFocus = useCallback((index: number) => {
    const category = categories[index];
    if (!category) return;
    lastInteractionWasKeyboardRef.current = true;
    selectCategory(category.id);
    chipRefs.current.get(category.id)?.focus();
  }, [categories, selectCategory]);

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

  useEffect(() => {
    const chip = chipRefs.current.get(activeCategory);
    if (chip && scrollRef.current) {
      const container = scrollRef.current;
      const scrollTarget = chip.offsetLeft - container.offsetWidth / 2 + chip.offsetWidth / 2;
      container.scrollTo({
        left: scrollTarget,
        behavior: lastInteractionWasKeyboardRef.current ? "auto" : "smooth",
      });
      lastInteractionWasKeyboardRef.current = false;
    }
  }, [activeCategory]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollEdges = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      setScrollEdges({
        left: container.scrollLeft > 4,
        right: container.scrollLeft < maxScroll - 4,
      });
    };

    updateScrollEdges();
    container.addEventListener("scroll", updateScrollEdges, { passive: true });
    window.addEventListener("resize", updateScrollEdges);
    return () => {
      container.removeEventListener("scroll", updateScrollEdges);
      window.removeEventListener("resize", updateScrollEdges);
    };
  }, [categories]);

  useEffect(() => {
    if (!isPanelOpen) return;

    panelButtonRefs.current.get(activeCategory)?.focus({ preventScroll: true });

    const closeOnOutsidePress = (event: PointerEvent) => {
      if (!selectorRef.current?.contains(event.target as Node)) {
        onPanelOpenChange(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onPanelOpenChange(false);
      toggleRef.current?.focus({ preventScroll: true });
    };

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [activeCategory, isPanelOpen, onPanelOpenChange]);

  return (
    <section
      ref={selectorRef}
      id="category-selector"
      className="category-selector"
      aria-labelledby="category-selector-title"
    >
      <header className="category-selector-heading">
        <h2 id="category-selector-title">Nuestra carta</h2>
        <p>Explora nuestras {categories.length} categorías</p>
      </header>

      <nav id="category-nav" className="category-nav sticky z-30" aria-label="Navegación de categorías">
        <div className={`category-chip-shell${scrollEdges.left ? " can-scroll-left" : ""}${scrollEdges.right ? " can-scroll-right" : ""}`}>
          <div
            ref={scrollRef}
            className="category-nav-track scrollbar-hide"
            role="tablist"
            onKeyDown={handleKeyDown}
            aria-label="Categorías del menú"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                ref={(element) => {
                  if (element) chipRefs.current.set(category.id, element);
                  else chipRefs.current.delete(category.id);
                }}
                onClick={(event) => {
                  lastInteractionWasKeyboardRef.current = event.detail === 0;
                  selectCategory(category.id);
                }}
                role="tab"
                aria-selected={activeCategory === category.id}
                tabIndex={activeCategory === category.id ? 0 : -1}
                id={`tab-${category.id}`}
                aria-controls="catalog-panel"
                className={`chip ${activeCategory === category.id ? "active" : ""}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="category-panel-toggle"
          onClick={() => onPanelOpenChange(!isPanelOpen)}
          aria-expanded={isPanelOpen}
          aria-controls="category-panel"
          aria-haspopup="dialog"
        >
          <LayoutGrid size={15} aria-hidden="true" />
          <span>Ver todas las categorías</span>
          <ChevronDown size={15} className={isPanelOpen ? "is-open" : undefined} aria-hidden="true" />
        </button>

        {isPanelOpen && (
          <div
            id="category-panel"
            className="category-panel"
            role="dialog"
            aria-modal="false"
            aria-labelledby="category-panel-title"
          >
            <div className="category-panel-heading">
              <h3 id="category-panel-title">Elige una categoría</h3>
              <span>{categories.length} opciones</span>
            </div>
            <div className="category-panel-grid">
              {categories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    ref={(element) => {
                      if (element) panelButtonRefs.current.set(category.id, element);
                      else panelButtonRefs.current.delete(category.id);
                    }}
                    type="button"
                    onClick={() => selectCategory(category.id)}
                    className={`category-panel-option${isActive ? " active" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    <span>{category.name}</span>
                    <small>
                      {category.dishes.length} {category.dishes.length === 1 ? "plato" : "platos"}
                    </small>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </section>
  );
}
