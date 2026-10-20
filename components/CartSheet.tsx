"use client";

import { useState } from "react";
import { X, Trash2, ShoppingBag, Send, MapPin, Hash, Ticket, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { buildWhatsAppMessage, getWhatsAppUrl, formatPrice } from "@/lib/whatsapp";
import { config } from "@/data/config";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";

export default function CartSheet() {
  const {
    state,
    removeItem,
    updateQty,
    updateNote,
    setOrderType,
    setAddress,
    setTable,
    setName,
    setComment,
    setPromoCode,
    showToast,
    clearCart,
    closeCart,
    totalItems,
    totalPrice,
    isValid,
  } = useCart();

  const [promoInput, setPromoInput] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [sent, setSent] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!state.isCartOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (totalItems === 0) errs.items = "Agrega al menos un plato.";
    if (!state.orderType) errs.orderType = "Elige el tipo de pedido.";
    if (state.orderType === "takeaway" && !state.address.trim())
      errs.address = "Escribe tu dirección de entrega.";
    if (state.orderType === "dineIn" && !state.tableNumber.trim())
      errs.tableNumber = "Escribe el número de mesa.";
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSend = () => {
    if (!validate()) return;
    trackEvent("whatsapp_click", {
      context: "cart",
      totalPrice,
      totalItems,
      promoCode: state.promoCode || undefined,
    });
    const message = buildWhatsAppMessage({ ...state, orderType: state.orderType! });
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
      {/* Overlay */}
      <div
        className="bottom-sheet-overlay"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="bottom-sheet"
        style={{ maxHeight: "96dvh" }}
        role="dialog"
        aria-modal="true"
        aria-label="Tu pedido"
        id="cart-sheet"
      >
        <div className="bottom-sheet-handle" />

        <div className="bottom-sheet-body flex flex-col" style={{ maxHeight: "calc(96dvh - 20px)" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-tunche-border flex-shrink-0">
            <div>
              <h2 className="font-display text-tunche-cream text-lg font-bold">Tu pedido</h2>
              <p className="text-tunche-muted text-xs">
                {totalItems} {totalItems === 1 ? "producto" : "productos"} · {formatPrice(totalPrice)}
              </p>
            </div>
            <button
              onClick={closeCart}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-tunche-surface-3 border border-tunche-border text-tunche-muted hover:text-tunche-cream transition-colors"
              aria-label="Cerrar carrito"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-5">

            {/* Empty state */}
            {totalItems === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag size={40} className="text-tunche-border mb-3" />
                <p className="text-tunche-cream text-sm font-semibold">Aún no has agregado platos</p>
                <p className="text-tunche-muted/60 text-xs mt-1">Agrega platos desde la carta</p>
                <a
                  href={`https://wa.me/${config.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_20px_rgba(37,211,102,0.24)] transition-transform duration-150 active:scale-[0.97]"
                  aria-label="Escribir al restaurante por WhatsApp"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  Escribir al restaurante
                </a>
                {fieldErrors.items && (
                  <p className="text-red-400 text-xs mt-3" role="alert">{fieldErrors.items}</p>
                )}
              </div>
            )}

            {/* Items list */}
            {state.items.map((item) => (
              <div
                key={item.cartId}
                className="flex flex-col gap-2 pb-4 border-b border-tunche-border last:border-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-tunche-cream text-sm font-semibold">{item.name}</p>
                    {item.options.filter((o) => o.choices.length > 0).map((o) => (
                      <p key={o.optionId} className="text-tunche-muted text-xs">
                        {o.label}: {o.choices.join(", ")}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-tunche-gold text-sm font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.cartId)}
                      className="w-8 h-8 flex items-center justify-center text-tunche-muted hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10"
                      aria-label={`Quitar ${item.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-3">
                  <div className="qty-stepper" aria-label={`Cantidad de ${item.name}`}>
                    <button
                      onClick={() => updateQty(item.cartId, item.quantity - 1)}
                      aria-label="Reducir"
                    >−</button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.cartId, item.quantity + 1)}
                      aria-label="Aumentar"
                    >+</button>
                  </div>
                  <span className="text-tunche-muted text-xs">
                    {formatPrice(item.price)} c/u
                  </span>
                </div>

                {/* Item note */}
                <input
                  type="text"
                  placeholder="Nota para este plato (opcional)"
                  value={item.note}
                  onChange={(e) => updateNote(item.cartId, e.target.value)}
                  className="tunche-input text-xs py-2"
                  aria-label={`Nota para ${item.name}`}
                />
              </div>
            ))}

            {/* Order type */}
            {totalItems > 0 && (
              <>
                <div>
                  <p className="text-tunche-cream text-sm font-semibold mb-2">
                    Tipo de pedido <span className="text-red-400">*</span>
                  </p>
                  <div className="segmented" role="group" aria-label="Tipo de pedido">
                    <button
                      onClick={() => { setOrderType("dineIn"); setFieldErrors((e) => ({ ...e, orderType: "" })); }}
                      className={`segmented-option ${state.orderType === "dineIn" ? "active" : ""}`}
                      aria-pressed={state.orderType === "dineIn"}
                      id="order-type-dine-in"
                    >
                      <Hash size={15} aria-hidden="true" />
                      En el restaurante
                    </button>
                    <button
                      onClick={() => { setOrderType("takeaway"); setFieldErrors((e) => ({ ...e, orderType: "" })); }}
                      className={`segmented-option ${state.orderType === "takeaway" ? "active" : ""}`}
                      aria-pressed={state.orderType === "takeaway"}
                      id="order-type-takeaway"
                    >
                      <MapPin size={15} aria-hidden="true" />
                      Para llevar
                    </button>
                  </div>
                  {fieldErrors.orderType && (
                    <p className="text-red-400 text-xs mt-1" role="alert">{fieldErrors.orderType}</p>
                  )}
                </div>

                {/* Conditional fields */}
                {state.orderType === "dineIn" && (
                  <div>
                    <label htmlFor="cart-table" className="text-tunche-cream text-sm font-semibold block mb-2">
                      Número de mesa <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="cart-table"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={config.tableCount || undefined}
                      placeholder="Ej: 5"
                      value={state.tableNumber}
                      onChange={(e) => { setTable(e.target.value); setFieldErrors((err) => ({ ...err, tableNumber: "" })); }}
                      className={`tunche-input ${fieldErrors.tableNumber ? "error" : ""}`}
                      aria-describedby={fieldErrors.tableNumber ? "table-error" : undefined}
                    />
                    {fieldErrors.tableNumber && (
                      <p id="table-error" className="text-red-400 text-xs mt-1" role="alert">{fieldErrors.tableNumber}</p>
                    )}
                  </div>
                )}

                {state.orderType === "takeaway" && (
                  <div>
                    <label htmlFor="cart-address" className="text-tunche-cream text-sm font-semibold block mb-2">
                      Dirección de entrega <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="cart-address"
                      placeholder="Calle, número y referencia…"
                      value={state.address}
                      onChange={(e) => { setAddress(e.target.value); setFieldErrors((err) => ({ ...err, address: "" })); }}
                      className={`tunche-input resize-none ${fieldErrors.address ? "error" : ""}`}
                      rows={2}
                      aria-describedby={fieldErrors.address ? "address-error" : undefined}
                    />
                    {config.takeawayNote && (
                      <p className="text-tunche-muted text-xs mt-1">{config.takeawayNote}</p>
                    )}
                    {fieldErrors.address && (
                      <p id="address-error" className="text-red-400 text-xs mt-1" role="alert">{fieldErrors.address}</p>
                    )}
                  </div>
                )}

                {/* Optional fields */}
                <div>
                  <label htmlFor="cart-name" className="text-tunche-cream text-sm font-semibold block mb-2">
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
                </div>

                <div>
                  <label htmlFor="cart-comment" className="text-tunche-cream text-sm font-semibold block mb-2">
                    Comentario general <span className="text-tunche-muted font-normal">(opcional)</span>
                  </label>
                  <textarea
                    id="cart-comment"
                    placeholder="Alergias, indicaciones especiales…"
                    value={state.comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="tunche-input resize-none"
                    rows={2}
                  />
                </div>

                {/* Club del Tunche: Código o cupón promocional */}
                <div className="rounded-xl border border-tunche-border bg-tunche-surface-2/60 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-tunche-gold">
                      <Ticket size={14} aria-hidden="true" />
                      <span>Club del Tunche · Cupón</span>
                    </div>
                    {state.promoCode && (
                      <button
                        type="button"
                        onClick={() => {
                          setPromoCode("");
                          showToast("Cupón retirado");
                        }}
                        className="text-xs text-tunche-muted hover:text-red-400 transition-colors"
                        aria-label="Quitar código promocional"
                      >
                        Quitar
                      </button>
                    )}
                  </div>

                  {state.promoCode ? (
                    <div className="flex items-center justify-between rounded-lg border border-tunche-gold/40 bg-tunche-gold/10 px-3 py-2">
                      <div>
                        <span className="font-mono text-xs font-bold text-tunche-gold">{state.promoCode}</span>
                        <p className="text-[11px] text-tunche-muted mt-0.5">
                          Se incluirá en tu pedido para confirmación en el restaurante.
                        </p>
                      </div>
                      <Check size={16} className="text-tunche-gold flex-shrink-0 ml-2" />
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Ej: CLUBTUNCHE"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        className="tunche-input font-mono uppercase text-xs !min-h-[38px] !py-1.5 !px-3"
                        aria-label="Código promocional o cupón"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const clean = promoInput.trim().toUpperCase();
                          if (!clean) return;
                          setPromoCode(clean);
                          setPromoInput("");
                          showToast(`Cupón ${clean} agregado`);
                          trackEvent("coupon_apply_cart", { couponCode: clean });
                        }}
                        className="btn-outline-gold !min-h-[38px] !py-1.5 !px-3 text-xs flex-shrink-0"
                      >
                        Aplicar
                      </button>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div className="flex items-center justify-between py-3 border-t border-tunche-border">
                  <span className="text-tunche-cream font-semibold">Total estimado</span>
                  <span className="font-display text-tunche-gold text-xl font-bold">{formatPrice(totalPrice)}</span>
                </div>
              </>
            )}

            {/* Sent confirmation */}
            {sent && (
              <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-4 py-3 text-center">
                <p className="text-green-400 text-sm font-semibold">✓ Pedido enviado</p>
                <p className="text-green-400/70 text-xs mt-0.5">Revisa WhatsApp y pulsa enviar para confirmar.</p>
              </div>
            )}
          </div>

          {/* Actions footer */}
          {totalItems > 0 && (
            <div className="px-5 pb-6 pt-3 border-t border-tunche-border flex flex-col gap-3 flex-shrink-0">
              <button
                onClick={handleSend}
                disabled={!isValid}
                className={`btn-gold w-full py-4 text-base flex items-center justify-center gap-2 ${
                  !isValid ? "opacity-40 cursor-not-allowed hover:transform-none hover:shadow-none" : ""
                }`}
                aria-disabled={!isValid}
                id="cart-send-btn"
                aria-label="Enviar pedido por WhatsApp"
              >
                <Send size={18} aria-hidden="true" />
                Enviar pedido por WhatsApp
              </button>

              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="btn-ghost w-full py-2 text-sm text-red-400 border-red-900/40 hover:bg-red-900/20"
                  aria-label="Vaciar pedido"
                >
                  <Trash2 size={15} aria-hidden="true" />
                  Vaciar pedido
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="btn-ghost flex-1 py-2 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleClearConfirm}
                    className="flex-1 py-2 text-sm rounded-full bg-red-900/50 border border-red-700/50 text-red-300 font-semibold hover:bg-red-900/80 transition-colors"
                    aria-label="Confirmar vaciar pedido"
                  >
                    Sí, vaciar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
