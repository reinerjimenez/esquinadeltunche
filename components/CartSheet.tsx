"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Trash2,
  ShoppingBag,
  PackageCheck,
  UtensilsCrossed,
  FileText,
  Pencil,
  Check,
  ChevronDown,
  User,
} from "lucide-react";
import { useCart } from "@/lib/cart";
import { buildWhatsAppMessage, getWhatsAppUrl, formatPrice, getOrderFieldErrors } from "@/lib/whatsapp";
import { config } from "@/data/config";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { useBottomSheetViewport } from "@/lib/useBottomSheetViewport";
import { getDishAvailability, getUnavailableCartItems } from "@/lib/availability";

export default function CartSheet() {
  const {
    state,
    now,
    removeItem,
    updateQty,
    updateNote,
    setOrderType,
    setAddress,
    setTable,
    setName,
    setPhone,
    setComment,
    clearCart,
    closeCart,
    totalItems,
    subtotal,
    taperCount,
    taperTotal,
    totalPrice,
  } = useCart();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showOptionalFields, setShowOptionalFields] = useState(
    Boolean(state.customerName.trim() || state.dineInPhone?.trim() || state.comment.trim())
  );

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { maxHeight, bottomOffset } = useBottomSheetViewport(state.isCartOpen);

  // Close on Escape key
  useEffect(() => {
    if (!state.isCartOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [state.isCartOpen, closeCart]);

  if (!state.isCartOpen) return null;

  const unavailableItems = getUnavailableCartItems(state.items, now);
  const orderFieldErrors = getOrderFieldErrors(state);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    let firstErrorElementId = "";

    if (totalItems === 0) {
      errs.items = "Agrega al menos un plato a tu pedido.";
    }
    if (getUnavailableCartItems(state.items).length > 0) {
      errs.items = "Quita los productos retirados o suspendidos. Los makis se habilitan en su horario.";
      firstErrorElementId = "cart-step-items";
    }

    const fieldIssues = getOrderFieldErrors(state);
    Object.assign(errs, fieldIssues);
    if (!firstErrorElementId) {
      const fieldIds: Record<string, string> = {
        orderType: "cart-step-order-type",
        address: "cart-address",
        customerName: "cart-pickup-name",
        customerPhone: "cart-pickup-phone",
        tableNumber: "cart-table",
      };
      firstErrorElementId = fieldIds[Object.keys(fieldIssues)[0]] ?? "";
    }

    setFieldErrors(errs);

    if (firstErrorElementId) {
      window.setTimeout(() => {
        const el = document.getElementById(firstErrorElementId);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
          el.focus();
        }
      }, 100);
    }

    return Object.keys(errs).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    let message: string;
    try {
      message = buildWhatsAppMessage({ ...state, orderType: state.orderType! });
    } catch {
      setFieldErrors((errors) => ({ ...errors, items: "Hay productos que ya no están disponibles. Revísalos antes de enviar." }));
      return;
    }
    trackEvent("whatsapp_click", {
      context: "cart",
      totalPrice,
      totalItems,
    });
    const url = getWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const handleClearConfirm = () => {
    clearCart();
    setShowClearConfirm(false);
    setSent(false);
    closeCart();
  };

  return (
    <>
      {/* Background Overlay */}
      <div
        className="bottom-sheet-overlay"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sheet Modal */}
      <div
        className="bottom-sheet"
        style={{
          maxHeight,
          bottom: `${bottomOffset}px`,
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        id="cart-sheet"
      >
        <div className="bottom-sheet-handle" />

        <div
          className="bottom-sheet-body flex flex-col"
          style={{ maxHeight: `calc(${maxHeight} - 16px)` }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-tunche-border flex-shrink-0">
            <div>
              <h2 className="font-display text-tunche-cream text-lg font-bold">Tu pedido</h2>
              <p className="text-tunche-muted text-xs">
                {totalItems} {totalItems === 1 ? "plato" : "platos"} · Total: {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="w-11 h-11 flex items-center justify-center rounded-full bg-tunche-surface-3 border border-tunche-border text-tunche-muted hover:text-tunche-cream transition-colors"
              aria-label="Cerrar pedido"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body with the 3 steps */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-6"
          >
            {/* Empty State */}
            {totalItems === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag size={44} className="text-tunche-border mb-3" aria-hidden="true" />
                <p className="text-tunche-cream text-base font-semibold">Tu pedido está vacío</p>
                <p className="text-tunche-muted text-sm mt-1 max-w-xs">
                  Explora la carta y presiona el botón «+» en tus platos preferidos para agregarlos aquí.
                </p>
                <button
                  type="button"
                  onClick={closeCart}
                  className="btn-gold mt-5 py-3 px-6 text-sm"
                >
                  Ver la carta
                </button>
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-xs text-tunche-muted hover:text-tunche-cream underline underline-offset-4"
                  aria-label="Consultar directamente al restaurante por WhatsApp"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  ¿Deseas consultar algo por WhatsApp?
                </a>
              </div>
            )}

            {totalItems > 0 && (
              <>
                {/* ═══════════════════════════════════════════
                    PASO 1 — REVISA TUS PLATOS
                    ═══════════════════════════════════════════ */}
                <section className="cart-step" aria-labelledby="step-1-title" id="cart-step-items">
                  <header className="cart-step-header">
                    <span className="cart-step-number" aria-hidden="true">1</span>
                    <div>
                      <h3 id="step-1-title" className="cart-step-title">Revisa tus platos</h3>
                      <p className="cart-step-subtitle">Verifica cantidades o agrega indicaciones especiales si deseas.</p>
                    </div>
                  </header>
                  {fieldErrors.items && <p className="cart-error-msg" role="alert">{fieldErrors.items}</p>}

                  <div className="cart-items-list" role="list">
                    {state.items.map((item) => {
                      const isEditingNote = editingNoteId === item.cartId;
                      const hasNote = Boolean(item.note?.trim());
                      const availability = getDishAvailability(item.dishId, now);

                      return (
                        <div
                          key={item.cartId}
                          className="cart-item-card"
                          role="listitem"
                        >
                          {/* Dish info & subtotal */}
                          <div className="cart-item-main">
                            <div className="cart-item-info">
                              <h4 className="cart-item-name">{item.name}</h4>
                              {!availability.available && (
                                <p className="text-amber-300 text-xs font-semibold" role="status">
                                  {availability.message}. Puedes quitarlo del pedido.
                                </p>
                              )}
                              {item.options
                                .filter((o) => o.choices.length > 0)
                                .map((o) => (
                                  <p key={o.optionId} className="cart-item-option">
                                    <span className="text-tunche-muted/70">{o.label}:</span>{" "}
                                    {o.choices.join(", ")}
                                  </p>
                                ))}
                              <span className="cart-item-unit-price">
                                {formatPrice(item.price)} cada uno
                              </span>
                            </div>

                            <div className="cart-item-pricing">
                              <span className="cart-item-subtotal">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          </div>

                          {/* Stepper controls */}
                          <div className="cart-item-controls">
                            <div
                              className="qty-stepper"
                              aria-label={`Cantidad de ${item.name}`}
                            >
                              <button
                                type="button"
                                onClick={() => updateQty(item.cartId, item.quantity - 1)}
                                aria-label={`Quitar una unidad de ${item.name}`}
                              >
                                −
                              </button>
                              <span aria-live="polite">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.cartId, item.quantity + 1)}
                                disabled={!availability.available}
                                aria-label={`Añadir una unidad de ${item.name}`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.cartId)}
                              className="cart-item-remove-btn"
                              aria-label={`Quitar ${item.name} del pedido`}
                              title="Quitar plato"
                            >
                              <Trash2 size={16} aria-hidden="true" />
                            </button>
                          </div>

                          {/* Secondary note for this dish: collapsed when empty */}
                          {!hasNote && !isEditingNote && (
                            <button
                              type="button"
                              onClick={() => setEditingNoteId(item.cartId)}
                              className="cart-note-toggle-btn"
                              aria-label={`Añadir una indicación para ${item.name}`}
                            >
                              <FileText size={15} aria-hidden="true" />
                              <span>Añadir una indicación (opcional)</span>
                            </button>
                          )}

                          {isEditingNote && (
                            <div className="cart-note-input-wrap">
                              <textarea
                                autoFocus
                                rows={1}
                                placeholder="Ej: sin cebolla, salsa aparte..."
                                value={item.note}
                                onChange={(e) => updateNote(item.cartId, e.target.value)}
                                ref={(element) => {
                                  if (element) {
                                    element.style.height = "auto";
                                    element.style.height = `${Math.min(element.scrollHeight, 120)}px`;
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    setEditingNoteId(null);
                                  }
                                }}
                                className="tunche-input cart-note-input"
                                aria-label={`Indicación para ${item.name}`}
                                maxLength={120}
                              />
                              <button
                                type="button"
                                onClick={() => setEditingNoteId(null)}
                                className="cart-note-done-btn"
                                aria-label="Guardar indicación"
                              >
                                <Check size={16} aria-hidden="true" />
                                <span>Listo</span>
                              </button>
                            </div>
                          )}

                          {hasNote && !isEditingNote && (
                            <div className="cart-note-badge">
                              <div className="cart-note-badge-content">
                                <FileText size={14} className="text-tunche-gold flex-shrink-0" aria-hidden="true" />
                                <span className="cart-note-text">
                                  <strong className="text-tunche-cream">Nota:</strong> {item.note}
                                </span>
                              </div>
                              <div className="cart-note-badge-actions">
                                <button
                                  type="button"
                                  onClick={() => setEditingNoteId(item.cartId)}
                                  className="cart-note-action-btn"
                                  aria-label={`Editar indicación de ${item.name}`}
                                >
                                  <Pencil size={13} aria-hidden="true" />
                                  <span>Editar</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => updateNote(item.cartId, "")}
                                  className="cart-note-action-btn text-red-400"
                                  aria-label={`Borrar indicación de ${item.name}`}
                                >
                                  <X size={14} aria-hidden="true" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* ═══════════════════════════════════════════
                    PASO 2 — ¿CÓMO QUIERES TU PEDIDO?
                    ═══════════════════════════════════════════ */}
                <section className="cart-step" aria-labelledby="step-2-title" id="cart-step-order-type">
                  <header className="cart-step-header">
                    <span className="cart-step-number" aria-hidden="true">2</span>
                    <div>
                      <h3 id="step-2-title" className="cart-step-title">¿Cómo quieres tu pedido?</h3>
                      <p className="cart-step-subtitle">Elige cómo deseas recibir tu pedido.</p>
                    </div>
                  </header>

                  {/* Modalidades de pedido */}
                  <div
                    className="cart-order-types"
                    role="radiogroup"
                    aria-label="Modalidad de pedido"
                  >
                    <button
                      type="button"
                      role="radio"
                      aria-checked={state.orderType === "dineIn"}
                      onClick={() => {
                        setOrderType("dineIn");
                        setFieldErrors({});
                      }}
                      className={`cart-order-type-card ${state.orderType === "dineIn" ? "is-selected" : ""
                        }`}
                      id="order-type-dine-in"
                    >
                      <div className="cart-order-type-icon">
                        <UtensilsCrossed size={20} aria-hidden="true" />
                      </div>
                      <div className="cart-order-type-copy">
                        <span className="cart-order-type-name">Comer aquí</span>
                        <span className="cart-order-type-desc">Disfruta tu pedido en nuestro restaurante.</span>
                      </div>
                      <div className="cart-order-type-check" aria-hidden="true">
                        {state.orderType === "dineIn" && <Check size={18} strokeWidth={3} />}
                      </div>
                    </button>

                    <button
                      type="button"
                      role="radio"
                      aria-checked={state.orderType === "takeaway"}
                      onClick={() => {
                        setOrderType("takeaway");
                        setFieldErrors({});
                      }}
                      className={`cart-order-type-card ${state.orderType === "takeaway" ? "is-selected" : ""
                        }`}
                      id="order-type-takeaway"
                    >
                      <div className="cart-order-type-icon">
                        <ShoppingBag size={20} aria-hidden="true" />
                      </div>
                      <div className="cart-order-type-copy">
                        <span className="cart-order-type-name">Delivery</span>
                        <span className="cart-order-type-desc">Recibe tu pedido en tu domicilio.</span>
                      </div>
                      <div className="cart-order-type-check" aria-hidden="true">
                        {state.orderType === "takeaway" && <Check size={18} strokeWidth={3} />}
                      </div>
                    </button>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={state.orderType === "pickup"}
                      onClick={() => {
                        setOrderType("pickup");
                        setFieldErrors({});
                      }}
                      className={`cart-order-type-card ${state.orderType === "pickup" ? "is-selected" : ""}`}
                      id="order-type-pickup"
                    >
                      <div className="cart-order-type-icon">
                        <PackageCheck size={20} aria-hidden="true" />
                      </div>
                      <div className="cart-order-type-copy">
                        <span className="cart-order-type-name">Recoger</span>
                        <span className="cart-order-type-desc">Pide ahora y recógelo personalmente en el restaurante.</span>
                      </div>
                      <div className="cart-order-type-check" aria-hidden="true">
                        {state.orderType === "pickup" && <Check size={18} strokeWidth={3} />}
                      </div>
                    </button>
                  </div>

                  {fieldErrors.orderType && (
                    <p className="cart-error-msg" role="alert">
                      {fieldErrors.orderType}
                    </p>
                  )}

                  {/* Conditional Required Fields */}
                  {state.orderType === "dineIn" && (
                    <div className="cart-required-field" id="cart-field-table">
                      <label htmlFor="cart-table" className="cart-label">
                        <span>Número de mesa</span>
                        <span className="cart-required-badge">Obligatorio</span>
                      </label>
                      <input
                        id="cart-table"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={config.tableCount || undefined}
                        placeholder="Ej: 4"
                        value={state.tableNumber}
                        onChange={(e) => {
                          setTable(e.target.value);
                          setFieldErrors((err) => ({ ...err, tableNumber: "" }));
                        }}
                        className={`tunche-input ${fieldErrors.tableNumber ? "error" : ""}`}
                        aria-describedby={fieldErrors.tableNumber ? "table-error" : undefined}
                      />
                      {fieldErrors.tableNumber && (
                        <p id="table-error" className="cart-error-msg" role="alert">
                          {fieldErrors.tableNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {state.orderType === "takeaway" && (
                    <div className="cart-required-field" id="cart-field-address">
                      <label htmlFor="cart-address" className="cart-label">
                        <span>Dirección de entrega</span>
                        <span className="cart-required-badge">Obligatorio</span>
                      </label>
                      <textarea
                        id="cart-address"
                        placeholder="Calle, número, urbanización o referencia..."
                        value={state.address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setFieldErrors((err) => ({ ...err, address: "" }));
                        }}
                        className={`tunche-input resize-none ${fieldErrors.address ? "error" : ""}`}
                        rows={2}
                        aria-describedby={fieldErrors.address ? "address-error" : undefined}
                      />
                      {config.takeawayNote && (
                        <p className="text-tunche-muted text-xs mt-1">{config.takeawayNote}</p>
                      )}
                      {fieldErrors.address && (
                        <p id="address-error" className="cart-error-msg" role="alert">
                          {fieldErrors.address}
                        </p>
                      )}
                    </div>
                  )}

                  {(state.orderType === "takeaway" || state.orderType === "pickup") && (
                    <div className="cart-required-field">
                      <label htmlFor="cart-pickup-name" className="cart-label">
                        <span>{state.orderType === "pickup" ? "Persona que recogerá el pedido *" : "Nombre del cliente *"}</span>
                        <span className="cart-required-badge">Obligatorio</span>
                      </label>
                      <p id="cart-pickup-name-help" className="text-tunche-muted text-xs mb-2">
                        Para identificar tu pedido al momento de entregarlo
                      </p>
                      <input
                        id="cart-pickup-name"
                        type="text"
                        value={state.customerName}
                        onChange={(event) => {
                          setName(event.target.value);
                          setFieldErrors((errors) => ({ ...errors, customerName: "" }));
                        }}
                        className={`tunche-input ${fieldErrors.customerName ? "error" : ""}`}
                        required
                        aria-invalid={Boolean(fieldErrors.customerName)}
                        aria-describedby={`cart-pickup-name-help${fieldErrors.customerName ? " cart-pickup-name-error" : ""}`}
                      />
                      {fieldErrors.customerName && (
                        <p id="cart-pickup-name-error" className="cart-error-msg" role="alert">
                          {fieldErrors.customerName}
                        </p>
                      )}
                    </div>
                  )}

                  {state.orderType === "takeaway" && (
                    <div className="cart-required-field">
                      <label htmlFor="cart-pickup-phone" className="cart-label">
                        <span>Número de celular *</span>
                        <span className="cart-required-badge">Obligatorio</span>
                      </label>
                      <p id="cart-pickup-phone-help" className="text-tunche-muted text-xs mb-2">
                        Necesitamos tu número para contactarte cuando tu pedido esté listo
                      </p>
                      <input
                        id="cart-pickup-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        value={state.customerPhone}
                        onChange={(event) => {
                          setPhone(event.target.value);
                          setFieldErrors((errors) => ({ ...errors, customerPhone: "" }));
                        }}
                        className={`tunche-input ${fieldErrors.customerPhone ? "error" : ""}`}
                        required
                        aria-invalid={Boolean(fieldErrors.customerPhone)}
                        aria-describedby={`cart-pickup-phone-help${fieldErrors.customerPhone ? " cart-pickup-phone-error" : ""}`}
                      />
                      {fieldErrors.customerPhone && (
                        <p id="cart-pickup-phone-error" className="cart-error-msg" role="alert">
                          {fieldErrors.customerPhone}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Secondary Optional Fields (Name & Comment) */}
                  <div className="cart-optional-section">
                    <button
                      type="button"
                      onClick={() => setShowOptionalFields(!showOptionalFields)}
                      className="cart-optional-toggle"
                      aria-expanded={showOptionalFields}
                    >
                      <span className="cart-optional-toggle-text">
                        <User size={16} aria-hidden="true" />
                        <span>{state.orderType === "dineIn" ? "Nombre, celular y comentarios" : "Comentarios"} <span className="text-tunche-muted text-xs font-normal">(opcional)</span></span>
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${showOptionalFields ? "rotate-180" : ""
                          }`}
                        aria-hidden="true"
                      />
                    </button>

                    {showOptionalFields && (
                      <div className="cart-optional-fields">
                        {state.orderType === "dineIn" && <div>
                          <label htmlFor="cart-name" className="cart-sublabel">
                            Tu nombre <span className="text-tunche-muted font-normal">(opcional)</span>
                          </label>
                          <input
                            id="cart-name"
                            type="text"
                            placeholder="¿Cómo te llamas?"
                            value={state.customerName}
                            onChange={(e) => setName(e.target.value)}
                            className="tunche-input"
                          />
                        </div>}

                        {state.orderType === "dineIn" && <div>
                          <label htmlFor="cart-phone" className="cart-sublabel">
                            Número de celular <span className="text-tunche-muted font-normal">(opcional)</span>
                          </label>
                          <input
                            id="cart-phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel"
                            value={state.dineInPhone ?? ""}
                            onChange={(event) => setPhone(event.target.value)}
                            className="tunche-input"
                          />
                        </div>}

                        <div>
                          <label htmlFor="cart-comment" className="cart-sublabel">
                            Comentario general <span className="text-tunche-muted font-normal">(opcional)</span>
                          </label>
                          <textarea
                            id="cart-comment"
                            placeholder="Alergias, cubiertos, indicaciones generales..."
                            value={state.comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="tunche-input resize-none"
                            rows={2}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* ═══════════════════════════════════════════
                    PASO 3 — CONFIRMA TU PEDIDO
                    ═══════════════════════════════════════════ */}
                <section className="cart-step" aria-labelledby="step-3-title">
                  <header className="cart-step-header">
                    <span className="cart-step-number" aria-hidden="true">3</span>
                    <div>
                      <h3 id="step-3-title" className="cart-step-title">Confirma tu pedido</h3>
                      <p className="cart-step-subtitle">Revisa el total estimado antes de enviarlo por WhatsApp.</p>
                    </div>
                  </header>

                  <div className="cart-summary-box">
                    <div className="cart-summary-row">
                      <span className="text-tunche-cream text-sm">
                        Subtotal de productos ({totalItems}):
                      </span>
                      <span className="text-tunche-cream font-semibold">
                        {formatPrice(subtotal)}
                      </span>
                    </div>

                    {taperCount > 0 && (
                      <div className="cart-summary-row">
                        <span className="text-tunche-cream text-sm">
                          Táper ({taperCount} × {formatPrice(config.taperUnitPrice)})
                        </span>
                        <span className="text-tunche-cream font-semibold">{formatPrice(taperTotal)}</span>
                      </div>
                    )}

                    <div className="cart-summary-row cart-summary-total">
                      <span className="text-tunche-cream font-bold text-base">Total estimado</span>
                      <span className="font-display text-tunche-gold-bright text-2xl font-bold">
                        {formatPrice(totalPrice)}
                      </span>
                    </div>

                    {/* Status feedback */}
                    <div className="cart-validation-status">
                      {unavailableItems.length > 0 ? (
                        <p className="cart-status-hint text-amber-300">
                          <strong>Productos no disponibles:</strong> retira los suspendidos o retirados. Los makis se habilitan en su horario.
                        </p>
                      ) : Object.values(orderFieldErrors).length > 0 ? (
                        <p className="cart-status-hint text-amber-300">
                          ⚠️ <strong>Falta completar:</strong> {Object.values(orderFieldErrors)[0]}
                        </p>
                      ) : (
                        <p className="cart-status-hint text-emerald-400">
                          ✓ <strong>¡Todo listo!</strong> Presiona el botón verde de abajo para enviar tu orden por WhatsApp.
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Sent confirmation banner */}
            {sent && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-3 text-center">
                <p className="text-green-400 text-sm font-semibold">✓ Pedido preparado</p>
                <p className="text-green-400/80 text-xs mt-0.5">
                  Se abrió WhatsApp con tu mensaje listo. Presiona enviar en WhatsApp para confirmar tu orden con el restaurante.
                </p>
              </div>
            )}
          </div>

          {/* Sticky Actions Footer */}
          {totalItems > 0 && (
            <footer className="cart-sheet-footer">
              <button
                type="button"
                onClick={handleSend}
                disabled={unavailableItems.length > 0}
                className="btn-gold cart-submit-btn"
                id="cart-send-btn"
                aria-label={`Enviar pedido por WhatsApp, total ${formatPrice(totalPrice)}`}
              >
                <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
                <span>Enviar pedido por WhatsApp</span>
                <span className="cart-submit-total">· {formatPrice(totalPrice)}</span>
              </button>

              {!showClearConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(true)}
                  className="cart-clear-btn"
                  aria-label="Vaciar todo el pedido"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  <span>Vaciar pedido</span>
                </button>
              ) : (
                <div className="cart-clear-confirm-wrap">
                  <span className="text-xs text-tunche-muted">
                    ¿Deseas quitar todos los platos del pedido?
                  </span>
                  <div className="flex gap-2 w-full">
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(false)}
                      className="btn-ghost flex-1 py-2 text-sm"
                    >
                      Conservar
                    </button>
                    <button
                      type="button"
                      onClick={handleClearConfirm}
                      className="btn-danger flex-1 py-2 text-sm"
                      aria-label="Confirmar vaciar pedido"
                    >
                      Sí, vaciar
                    </button>
                  </div>
                </div>
              )}
            </footer>
          )}
        </div>
      </div>
    </>
  );
}
