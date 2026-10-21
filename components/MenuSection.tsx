"use client";

import { Dish, Category } from "@/data/menu";
import DishCard from "./DishCard";

type MenuSectionProps = {
  category: Category;
  onDishClick: (dish: Dish) => void;
};

export default function MenuSection({ category, onDishClick }: MenuSectionProps) {
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
            <span className="category-count" aria-label={`${category.dishes.length} platos`}>
              {category.dishes.length}
            </span>
          </div>
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
    </section>
  );
}
