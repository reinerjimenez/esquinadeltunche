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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const lastInteractionWasKeyboardRef = useRef(false);
  const [scrollEdges, setScrollEdges] = useState({ left: false, right: false });

  const selectCategory = useCallback(
    (id: string) => {
      onCategoryClick(id);
      onPanelOpenChange(false);
    },
    [onCategoryClick, onPanelOpenChange]
  );

  const selectAndFocus = useCallback(
    (index: number) => {
      const category = categories[index];
      if (!category) return;
      lastInteractionWasKeyboardRef.current = true;
      selectCategory(category.id);
      chipRefs.current.get(category.id)?.focus();
    },
    [categories, selectCategory]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
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
    },
    [activeCategory, categories, selectAndFocus]
  );

  // Automatically scroll active chip into view smoothly
  useEffect(() => {
    const chip = chipRefs.current.get(activeCategory);
    if (chip && scrollRef.current) {
      const container = scrollRef.current;
      const scrollTarget = chip.offsetLeft - container.offsetWidth / 2 + chip.offsetWidth / 2;
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      container.scrollTo({
        left: Math.max(0, scrollTarget),
        behavior: lastInteractionWasKeyboardRef.current || prefersReducedMotion ? "auto" : "smooth",
      });
      lastInteractionWasKeyboardRef.current = false;
    }
  }, [activeCategory]);

  // Dynamic overflow indicators (left/right gradient cues)
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateScrollEdges = () => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll <= 0) {
        setScrollEdges({ left: false, right: false });
        return;
      }
      setScrollEdges({
        left: container.scrollLeft > 6,
        right: container.scrollLeft < maxScroll - 6,
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

  // When panel closes, restore focus to the toggle button if it was focused previously
  const wasOpenRef = useRef(isPanelOpen);
  useEffect(() => {
    if (wasOpenRef.current && !isPanelOpen) {
      toggleRef.current?.focus({ preventScroll: true });
    }
    wasOpenRef.current = isPanelOpen;
  }, [isPanelOpen]);

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

      <nav
        id="category-nav"
        className="category-nav sticky z-30"
        aria-label="Navegación de categorías"
      >
        <div
          className={`category-chip-shell${scrollEdges.left ? " can-scroll-left" : ""}${
            scrollEdges.right ? " can-scroll-right" : ""
          }`}
        >
          <div
            ref={scrollRef}
            className="category-nav-track scrollbar-hide"
            role="tablist"
            onKeyDown={handleKeyDown}
            aria-label="Categorías del menú"
          >
            {categories.map((category) => {
              const isActive = activeCategory === category.id;
              return (
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
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  id={`tab-${category.id}`}
                  aria-controls="catalog-panel"
                  className={`chip ${isActive ? "active" : ""}`}
                >
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="category-panel-toggle"
          onClick={() => onPanelOpenChange(!isPanelOpen)}
          aria-expanded={isPanelOpen}
          aria-controls="category-sheet"
          aria-haspopup="dialog"
          id="category-panel-toggle-btn"
        >
          <LayoutGrid size={15} aria-hidden="true" />
          <span>Ver todas las categorías</span>
          <ChevronDown
            size={15}
            className={isPanelOpen ? "is-open" : undefined}
            aria-hidden="true"
          />
        </button>
      </nav>
    </section>
  );
}
