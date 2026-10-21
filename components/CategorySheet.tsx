"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, Check } from "lucide-react";
import { Category } from "@/data/menu";

type CategorySheetProps = {
  isOpen: boolean;
  categories: Category[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
  onClose: () => void;
};

export default function CategorySheet({
  isOpen,
  categories,
  activeCategoryId,
  onSelectCategory,
  onClose,
}: CategorySheetProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const activeButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Handle Escape key and focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      // Trap focus inside modal
      if (event.key === "Tab" && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Initial focus management
  useEffect(() => {
    if (!isOpen) return;

    // Focus active category button or close button smoothly
    const timer = window.setTimeout(() => {
      if (activeButtonRef.current) {
        activeButtonRef.current.focus({ preventScroll: true });
        activeButtonRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (closeButtonRef.current) {
        closeButtonRef.current.focus({ preventScroll: true });
      }
    }, 50);

    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Overlay click to close
  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === overlayRef.current) {
        onClose();
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Superimposed backdrop overlay */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="category-sheet-overlay"
        aria-hidden="true"
      />

      {/* Accessible Bottom Sheet / Modal Dialog */}
      <div
        ref={sheetRef}
        id="category-sheet"
        className="category-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-sheet-title"
      >
        <div className="category-sheet-handle" aria-hidden="true" />

        {/* Header */}
        <div className="category-sheet-header">
          <div>
            <h2 id="category-sheet-title" className="category-sheet-title">
              Todas las categorías
            </h2>
            <p className="category-sheet-subtitle">
              {categories.length} categorías disponibles
            </p>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="category-sheet-close"
            aria-label="Cerrar selector de categorías"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable list of categories in 2 columns */}
        <div className="category-sheet-body">
          <div className="category-sheet-grid">
            {categories.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  ref={isActive ? activeButtonRef : undefined}
                  type="button"
                  onClick={() => {
                    onSelectCategory(category.id);
                  }}
                  className={`category-sheet-item ${isActive ? "active" : ""}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  <div className="category-sheet-item-copy">
                    <span className="category-sheet-item-name">{category.name}</span>
                    <span className="category-sheet-item-count">
                      {category.dishes.length}{" "}
                      {category.dishes.length === 1 ? "plato" : "platos"}
                    </span>
                  </div>

                  {isActive && (
                    <span className="category-sheet-active-pill" aria-hidden="true">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
