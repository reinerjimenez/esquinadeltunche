"use client";

import { useState, useRef, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Dish } from "@/data/menu";
import DishImage from "./DishImage";
import { formatPrice, CartItemOption } from "@/lib/whatsapp";
import { useCart } from "@/lib/cart";
import { useBottomSheetViewport } from "@/lib/useBottomSheetViewport";
import { getDishAvailability } from "@/lib/availability";

type DishSheetProps = {
  dish: Dish | null;
  categoryId?: string;
  onClose: () => void;
};

export default function DishSheet({ dish, categoryId, onClose }: DishSheetProps) {
  const { now, addItem, showToast } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState(dish?.variants?.[0]?.id ?? "");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>(() => {
    const defaults: Record<string, string[]> = {};
    dish?.options?.forEach((option) => {
      defaults[option.id] = [];
    });
    return defaults;
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const overlayRef = useRef<HTMLDivElement>(null);

  const { maxHeight, bottomOffset } = useBottomSheetViewport(Boolean(dish));

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!dish) return null;

  const hasOptions = Boolean(dish.options?.length);
  const selectedVariant = dish.variants?.find((variant) => variant.id === selectedVariantId);
  const unitPrice = selectedVariant?.price ?? dish.price;
  const availability = getDishAvailability(dish.id, now);

  const toggleChoice = (optionId: string, choice: string, max: number) => {
    const current = selectedOptions[optionId] || [];

    if (current.includes(choice)) {
      setSelectedOptions((prev) => ({
        ...prev,
        [optionId]: current.filter((selectedChoice) => selectedChoice !== choice),
      }));
      setErrors((prev) => ({ ...prev, [optionId]: "" }));
      return;
    }

    if (max === 1) {
      setSelectedOptions((prev) => ({ ...prev, [optionId]: [choice] }));
      setErrors((prev) => ({ ...prev, [optionId]: "" }));
      return;
    }

    if (current.length >= max) {
      setErrors((prev) => ({
        ...prev,
        [optionId]: `Puedes seleccionar como máximo ${max} opción${max > 1 ? "es" : ""}.`,
      }));
      return;
    }

    setSelectedOptions((prev) => ({
      ...prev,
      [optionId]: [...current, choice],
    }));
    setErrors((prev) => ({ ...prev, [optionId]: "" }));
  };

  const validate = (): boolean => {
    if (!hasOptions) return true;
    const newErrors: Record<string, string> = {};
    let valid = true;
    dish.options!.forEach((opt) => {
      const selected = selectedOptions[opt.id] || [];
      const hasValidSelection =
        opt.min === opt.max
          ? selected.length === opt.min
          : selected.length >= opt.min && selected.length <= opt.max;

      if (!hasValidSelection) {
        newErrors[opt.id] =
          opt.min === opt.max
            ? opt.min === 1
              ? "Debes elegir 1 opción obligatoria."
              : `Debes elegir exactamente ${opt.min} opciones.`
            : `Debes elegir entre ${opt.min} y ${opt.max} opciones.`;
        valid = false;
      }
    });
    setErrors(newErrors);
    return valid;
  };

  const buildOptions = (): CartItemOption[] => {
    const options = (dish.options ?? []).map((opt) => ({
      optionId: opt.id,
      label: opt.label,
      choices: selectedOptions[opt.id] || [],
    }));

    if (selectedVariant) {
      options.unshift({
        optionId: "variant",
        label: "Opción",
        choices: [selectedVariant.name],
      });
    }

    return options;
  };

  const handleAdd = () => {
    if (!getDishAvailability(dish.id).available) return;
    if (!validate() || !unitPrice) return;
    const options = buildOptions();
    if (!addItem({
      dishId: dish.id,
      name: dish.name,
      price: unitPrice,
      quantity,
      options,
      note,
    })) return;
    showToast(`✓ Agregado: ${dish.name}`);
    onClose();
  };

  const totalPrice = unitPrice ? unitPrice * quantity : 0;

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="bottom-sheet-overlay"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="bottom-sheet"
        style={{
          maxHeight,
          bottom: `${bottomOffset}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${dish.name}`}
      >
        <div className="bottom-sheet-handle" />

        <div
          className="bottom-sheet-body"
          style={{ maxHeight: `calc(${maxHeight} - 16px)` }}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center rounded-full bg-tunche-surface-3 border border-tunche-border text-tunche-muted hover:text-tunche-cream transition-colors z-10"
            aria-label="Cerrar detalle"
          >
            <X size={18} />
          </button>

          {/* Dish image */}
          {dish.image && (
            <div className="h-52 relative">
              <DishImage
                src={dish.image}
                alt={dish.name}
                fill
                className="absolute inset-0"
                type={categoryId as Parameters<typeof DishImage>[0]["type"]}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tunche-surface via-transparent to-transparent" />
            </div>
          )}

          {/* Content */}
          <div className="px-5 pb-6 pt-4 flex flex-col gap-5">
            {/* Name + description */}
            <div>
              {dish.tags?.[0] && (
                <div className="flex flex-wrap gap-1 mb-2">
                  <span className={`tag tag-${dish.tags[0]}`}>
                    {dish.tags[0] === "recomendado"
                      ? "Favorito"
                      : dish.tags[0] === "picante"
                      ? "Picante"
                      : dish.tags[0] === "amazonico"
                      ? "Amazónico"
                      : dish.tags[0] === "marino"
                      ? "Marino"
                      : "Nuevo"}
                  </span>
                </div>
              )}
              <h2
                className={`font-display text-tunche-cream text-xl font-bold mb-2 ${
                  dish.id === "poke-bowl" ? "uppercase" : ""
                }`}
              >
                {dish.name}
              </h2>
              {dish.detail && (
                <p className="text-tunche-gold text-xs font-semibold uppercase tracking-wider mb-2">
                  {dish.detail}
                </p>
              )}
              {dish.description && (
                <p className="text-tunche-muted text-sm leading-relaxed">{dish.description}</p>
              )}
              {!availability.available && (
                <p className="text-amber-300 text-sm font-semibold mt-2" role="status">{availability.message}</p>
              )}
            </div>

            {/* Price-bearing variant: segmented cards if <= 3, select if > 3 */}
            {dish.variants?.length ? (
              <div>
                <label className="text-tunche-cream text-sm font-semibold block mb-2">
                  Elige una opción
                </label>
                {dish.variants.length <= 3 ? (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {dish.variants.map((variant) => {
                      const isSelected = selectedVariantId === variant.id;
                      return (
                        <button
                          type="button"
                          key={variant.id}
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`min-h-12 p-3 rounded-lg border text-left transition-all ${
                            isSelected
                              ? "bg-tunche-gold text-tunche-dark border-tunche-gold font-bold shadow-sm"
                              : "bg-tunche-surface-2 text-tunche-cream border-tunche-border hover:border-tunche-gold/40"
                          }`}
                          aria-pressed={isSelected}
                        >
                          <span className="block text-sm leading-tight">{variant.name}</span>
                          <span className={`block text-xs mt-1 ${isSelected ? "text-tunche-dark/80" : "text-tunche-gold"}`}>
                            {formatPrice(variant.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <select
                    id="dish-variant"
                    value={selectedVariantId}
                    onChange={(event) => setSelectedVariantId(event.target.value)}
                    className="tunche-input"
                  >
                    {dish.variants.map((variant) => (
                      <option key={variant.id} value={variant.id}>
                        {variant.name} — {formatPrice(variant.price)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : null}

            {/* Options */}
            {dish.options?.map((opt) => {
              const selectedCount = (selectedOptions[opt.id] || []).length;
              const instruction =
                opt.min === opt.max
                  ? opt.min === 1
                    ? "Elige 1 (obligatorio)"
                    : `Elige ${opt.min} (obligatorio)`
                  : opt.min === 0
                  ? `Opcional · Hasta ${opt.max}`
                  : `Elige de ${opt.min} a ${opt.max} (obligatorio)`;

              return (
                <div
                  key={opt.id}
                  className="border-t border-tunche-border/60 pt-4"
                >
                  <div className="flex flex-col gap-1 mb-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p id={`option-${opt.id}-label`} className="text-tunche-cream text-sm font-semibold">
                        {opt.label}
                      </p>
                      <p className="text-tunche-muted text-xs mt-0.5">{instruction}</p>
                    </div>

                    {opt.max > 1 && (
                      <span className="text-tunche-gold text-xs font-semibold mt-1 sm:mt-0" aria-live="polite">
                        {selectedCount} de {opt.max} elegidos
                      </span>
                    )}
                  </div>

                  <div
                    className="flex flex-wrap gap-2"
                    role="group"
                    aria-labelledby={`option-${opt.id}-label`}
                  >
                    {opt.choices.map((choice) => {
                      const selected = (selectedOptions[opt.id] || []).includes(choice);
                      return (
                        <button
                          type="button"
                          key={choice}
                          onClick={() => toggleChoice(opt.id, choice, opt.max)}
                          className={`max-w-full min-h-11 whitespace-normal rounded-lg border px-3.5 py-2.5 text-left text-sm font-medium leading-snug transition-colors inline-flex items-center gap-1.5 ${
                            selected
                              ? "bg-tunche-gold text-tunche-dark border-tunche-gold font-semibold shadow-sm"
                              : "bg-tunche-surface-2 text-tunche-cream border-tunche-border hover:border-tunche-gold/40"
                          }`}
                          aria-pressed={selected}
                          aria-label={`${choice}${selected ? ", seleccionado" : ""}`}
                        >
                          {selected && <Check size={14} strokeWidth={3} className="flex-shrink-0" aria-hidden="true" />}
                          <span>{choice}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors[opt.id] && (
                    <p className="text-red-400 text-xs mt-1.5 font-medium" role="alert">
                      {errors[opt.id]}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Note for kitchen */}
            <div className="border-t border-tunche-border/60 pt-4">
              <label htmlFor="dish-note" className="text-tunche-cream text-sm font-semibold block mb-1">
                Indicación especial para cocina <span className="text-tunche-muted font-normal text-xs">(opcional)</span>
              </label>
              <textarea
                id="dish-note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ej: sin ají, salsa aparte, bien dorado..."
                className="tunche-input resize-none"
                rows={2}
                maxLength={200}
              />
            </div>

            {/* Sticky Action Footer for ALL dishes */}
            <div className="sticky bottom-0 z-20 -mx-5 -mb-6 border-t border-tunche-border bg-tunche-surface/95 px-5 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] backdrop-blur">
              <div className="flex items-center gap-3">
                <div
                  className="qty-stepper flex-shrink-0"
                  aria-label="Cantidad a pedir"
                >
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Quitar una unidad"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Añadir una unidad"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="btn-gold flex-1 text-sm sm:text-base py-3.5 font-bold"
                  disabled={!unitPrice || !availability.available}
                  id="dish-sheet-add-btn"
                  aria-label={`Agregar ${quantity} ${dish.name} al pedido por ${formatPrice(totalPrice)}`}
                >
                  {availability.available ? `Agregar al pedido · ${unitPrice ? formatPrice(totalPrice) : "Sin precio"}` : availability.message}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
