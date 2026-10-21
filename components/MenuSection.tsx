"use client";

import { Dish, Category } from "@/data/menu";
import { LayoutGrid } from "lucide-react";
import DishCard from "./DishCard";

type MenuSectionProps = {
  category: Category;
  onDishClick: (dish: Dish) => void;
  categoryPosition: number;
  totalCategories: number;
  onExploreCategories?: () => void;
};

export default function MenuSection({
  category,
  onDishClick,
  onExploreCategories,
}: MenuSectionProps) {
  return (
    <section
      id={`section-${category.id}`}
      aria-labelledby={`heading-${category.id}`}
      className="menu-category"
    >
      {/* Section header: Clean hierarchy without redundant tags */}
      <header className="category-heading">
        <div className="category-heading-copy">
          <h2 id={`heading-${category.id}`} className="category-title">
            {category.name}
          </h2>
          <p className="category-subtitle">
            {category.dishes.length}{" "}
            {category.dishes.length === 1 ? "plato disponible" : "platos disponibles"}
            {category.subtitle ? ` · ${category.subtitle}` : ""}
          </p>
        </div>
      </header>

      {/* Dish cards */}
      <div className="dish-list">
        {category.dishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            categoryId={category.id}
            onClick={() => onDishClick(dish)}
          />
        ))}
      </div>

      {onExploreCategories && (
        <div className="category-explore">
          <button
            type="button"
            onClick={onExploreCategories}
            className="category-explore-button"
            aria-label="Ver todas las categorías en el selector"
          >
            <LayoutGrid size={15} aria-hidden="true" />
            Explorar otra categoría
          </button>
        </div>
      )}
    </section>
  );
}
