"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Dish } from "@/data/menu";
import DishImage from "./DishImage";
import { formatPrice } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";

const TAG_LABEL: Record<string, string> = {
  recomendado: "Favorito",
  picante: "Picante",
  amazonico: "Amazónico",
  marino: "Marino",
  nuevo: "Nuevo",
};

type DishCardProps = {
  dish: Dish;
  categoryId: string;
  onClick: () => void;
};

function DishPrice({ dish }: { dish: Dish }) {
  if (dish.price === null || dish.price === undefined) return <span>—</span>;

  const compactPrice = formatPrice(dish.price).replace(/\.00$/, "");

  return (
    <span>
      {dish.variants?.length ? <small>Desde </small> : null}
      {compactPrice}
    </span>
  );
}

export default function DishCard({ dish, categoryId, onClick }: DishCardProps) {
  const { state, addItem, updateQty, showToast } = useCart();
  const [adding, setAdding] = useState(false);
  const cartItems = state.items.filter((item) => item.dishId === dish.id);
  const hasChoices = Boolean(dish.options?.length || dish.variants?.length);
  const simpleCartItem = !hasChoices ? cartItems[0] : undefined;

  const handleAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (hasChoices || !dish.price) {
      onClick();
      return;
    }

    setAdding(true);
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: 1,
      options: [],
      note: "",
    });
    showToast(`✓ Agregado: ${dish.name}`);
    setTimeout(() => setAdding(false), 300);
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (simpleCartItem) updateQty(simpleCartItem.cartId, simpleCartItem.quantity - 1);
  };

  const handleIncrement = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (simpleCartItem) updateQty(simpleCartItem.cartId, simpleCartItem.quantity + 1);
    else handleAdd(event);
  };

  const controls = hasChoices || !simpleCartItem ? (
    <button
      onClick={handleAdd}
      className={`dish-add ${adding ? "is-adding" : ""}`}
      aria-label={hasChoices ? `Elegir opción para ${dish.name}` : `Agregar ${dish.name}`}
      id={`add-btn-${dish.id}`}
    >
      <Plus size={20} strokeWidth={2.25} aria-hidden="true" />
    </button>
  ) : (
    <div className="qty-stepper" onClick={(event) => event.stopPropagation()}>
      <button onClick={handleDecrement} aria-label={`Quitar una unidad de ${dish.name}`}>−</button>
      <span aria-live="polite">{simpleCartItem.quantity}</span>
      <button onClick={handleIncrement} aria-label={`Agregar una unidad más de ${dish.name}`}>+</button>
    </div>
  );

  if (dish.image) {
    return (
      <article
        onClick={onClick}
        className="dish-card dish-card-photo"
        aria-label={`${dish.name}, ${dish.price ? formatPrice(dish.price) : "Precio a consultar"}`}
      >
        <div className="dish-photo">
          <DishImage
            src={dish.image}
            alt={dish.name}
            fill
            className="absolute inset-0"
            type={categoryId as Parameters<typeof DishImage>[0]["type"]}
          />
        </div>
        <div className="dish-photo-copy">
          {dish.tags?.[0] && <span className={`tag tag-${dish.tags[0]}`}>{TAG_LABEL[dish.tags[0]]}</span>}
          <h3>{dish.name}</h3>
          {(dish.detail || dish.description) && (
            <p className="line-clamp-1">
              {dish.detail}{dish.detail && dish.description ? " — " : ""}{dish.description}
            </p>
          )}
          <div className="dish-photo-action">
            <strong><DishPrice dish={dish} /></strong>
            {controls}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={onClick}
      className={`dish-card dish-card-row ${simpleCartItem ? "has-quantity" : ""}`}
      aria-label={`${dish.name}, ${dish.price ? formatPrice(dish.price) : "Precio a consultar"}`}
    >
      <div className="dish-row-copy">
        <div className="dish-row-heading">
          <h3>{dish.name}</h3>
          <span className="dish-leader" aria-hidden="true" />
          <strong><DishPrice dish={dish} /></strong>
        </div>
        <div className="dish-row-meta">
          {(dish.detail || dish.description) && (
            <p className="line-clamp-1">
              {dish.detail}{dish.detail && dish.description ? " — " : ""}{dish.description}
            </p>
          )}
          {dish.tags?.[0] && <span className={`tag tag-${dish.tags[0]}`}>{TAG_LABEL[dish.tags[0]]}</span>}
        </div>
      </div>
      <div className="dish-row-action">{controls}</div>
    </article>
  );
}
