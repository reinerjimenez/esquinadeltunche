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
  categoryPosition,
  totalCategories,
  onExploreCategories,
}: MenuSectionProps) {
  return (
    <section
      id={`section-${category.id}`}
      aria-labelledby={`heading-${category.id}`}
      className="menu-category"
    >
      {/* Section header */}
      <header className="category-heading">
        <div className="category-heading-copy">
          <div className="category-title-row">
            <h2 id={`heading-${category.id}`} className="category-title">
              {category.name}
            </h2>
          </div>
          <p className="category-progress">
            Categoría {categoryPosition} de {totalCategories}
            <span aria-hidden="true"> · </span>
            {category.dishes.length} {category.dishes.length === 1 ? "plato" : "platos"}
          </p>
          <p className="category-subtitle">{category.subtitle}</p>
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
          <button type="button" onClick={onExploreCategories} className="category-explore-button">
            <LayoutGrid size={15} aria-hidden="true" />
            Explorar otra categoría
          </button>
        </div>
      )}
    </section>
  );
}
