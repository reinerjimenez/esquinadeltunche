"use client";

import { useSyncExternalStore } from "react";
import { Award, CheckCircle2, RotateCcw, Plus, Info, MessageCircle } from "lucide-react";
import { LoyaltyCardConfig } from "@/data/club";
import { buildLoyaltyInquiryUrl } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/lib/cart";

const LOYALTY_STORAGE_KEY = "tunche_loyalty_visits_v1";

let listeners: Array<() => void> = [];
function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function getStoredVisits(targetVisits: number): number {
  if (typeof window === "undefined") return 0;
  try {
    const stored = localStorage.getItem(LOYALTY_STORAGE_KEY);
    if (stored !== null) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        return Math.min(parsed, targetVisits);
      }
    }
  } catch {
    return 0;
  }
  return 0;
}

const loyaltyStore = {
  subscribe(listener: () => void) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },
  set(newCount: number) {
    try {
      localStorage.setItem(LOYALTY_STORAGE_KEY, newCount.toString());
    } catch {
      // storage disabled
    }
    emitChange();
  },
  reset() {
    try {
      localStorage.removeItem(LOYALTY_STORAGE_KEY);
    } catch {
      // ignore
    }
    emitChange();
  },
};

type LoyaltyCardModuleProps = {
  config: LoyaltyCardConfig;
};

export default function LoyaltyCardModule({ config }: LoyaltyCardModuleProps) {
  const { showToast } = useCart();
  const targetVisits = Math.max(1, config.targetVisits || 5);

  const visits = useSyncExternalStore(
    loyaltyStore.subscribe,
    () => getStoredVisits(targetVisits),
    () => 0
  );

  const handleAddVisit = () => {
    if (visits < targetVisits) {
      const next = visits + 1;
      loyaltyStore.set(next);
      trackEvent("loyalty_stamp", { currentVisits: next, targetVisits });
      showToast(`¡Sello registrado! Llevas ${next} de ${targetVisits} visitas.`);
    }
  };

  const handleReset = () => {
    loyaltyStore.reset();
    trackEvent("loyalty_reset");
    showToast("Progreso de la tarjeta reiniciado");
  };

  const handleInquireWhatsApp = () => {
    trackEvent("whatsapp_click", { context: "loyalty", currentVisits: visits });
    const url = buildLoyaltyInquiryUrl(visits, targetVisits);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Mensaje dinámico de avance
  const remaining = targetVisits - visits;
  let dynamicMessage = config.incentives.start;
  if (visits >= targetVisits) {
    dynamicMessage = config.incentives.completed;
  } else if (remaining === 1) {
    dynamicMessage = config.incentives.almostThere;
  } else if (visits > 0) {
    dynamicMessage = config.incentives.progress.replace("{remaining}", remaining.toString());
  }

  const isCompleted = visits >= targetVisits;

  return (
    <div className="card-surface border border-tunche-gold/40 p-5 sm:p-6 relative overflow-hidden bg-gradient-to-b from-tunche-surface to-tunche-surface-2 shadow-lg">
      {/* Fondo decorativo sutil */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-tunche-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Encabezado de la tarjeta */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-tunche-gold uppercase tracking-wider mb-1">
            <Award size={15} aria-hidden="true" />
            <span>Fidelización · Club del Tunche</span>
          </div>
          <h3 className="font-display text-tunche-cream text-base sm:text-lg font-bold">
            {config.rewardTitle}
          </h3>
          <p className="text-tunche-muted text-xs sm:text-sm mt-0.5">
            {config.rewardDescription}
          </p>
        </div>

        <div className="text-right flex-shrink-0">
          <span className="font-display text-tunche-gold text-xl sm:text-2xl font-black">
            {visits}
          </span>
          <span className="text-tunche-muted text-sm font-semibold">/{targetVisits}</span>
          <p className="text-[10px] text-tunche-muted uppercase font-medium">visitas</p>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full bg-tunche-dark/70 rounded-full h-2 mb-5 overflow-hidden border border-tunche-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-tunche-gold-dim via-tunche-gold to-tunche-gold-bright transition-[width] duration-300"
          style={{ width: `${(visits / targetVisits) * 100}%` }}
        />
      </div>

      {/* 5 Espacios visuales para sellos */}
      <div
        className="grid grid-cols-5 gap-2 sm:gap-3 mb-5"
        role="group"
        aria-label={`Progreso de fidelización: ${visits} de ${targetVisits} sellos`}
      >
        {Array.from({ length: targetVisits }).map((_, index) => {
          const isStamped = index < visits;
          const slotNumber = index + 1;

          return (
            <div
              key={slotNumber}
              className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition-[background-color,border-color,color,transform] duration-150 aspect-square ${
                isStamped
                  ? "bg-tunche-gold/15 border-tunche-gold shadow-[0_0_12px_rgba(201,152,58,0.25)] text-tunche-gold scale-[1.02]"
                  : "bg-tunche-dark/50 border-dashed border-tunche-border/80 text-tunche-muted/50"
              }`}
            >
              {isStamped ? (
                <CheckCircle2 size={22} className="text-tunche-gold animate-in fade-in zoom-in duration-300" />
              ) : (
                <span className="text-xs font-mono font-bold text-tunche-muted/60">{slotNumber}</span>
              )}
              <span className="text-[10px] mt-1 font-medium font-sans">
                {isStamped ? "Sello" : "Visita"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mensaje dinámico de avance */}
      <div className={`p-3 rounded-lg mb-4 text-xs ${
        isCompleted
          ? "bg-tunche-gold/20 border border-tunche-gold/60 text-tunche-cream font-semibold"
          : "bg-tunche-surface-3/80 text-tunche-cream/90"
      }`}>
        <p className="leading-relaxed">{dynamicMessage}</p>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-tunche-border/80">
        <div className="flex items-center gap-2">
          {!isCompleted ? (
            <button
              type="button"
              onClick={handleAddVisit}
              className="btn-gold !py-2 !px-3.5 text-xs flex items-center gap-1.5"
              aria-label="Registrar visita en tarjeta personal"
              id="loyalty-add-visit-btn"
            >
              <Plus size={14} aria-hidden="true" />
              Marcar visita (+1)
            </button>
          ) : (
            <button
              type="button"
              onClick={handleInquireWhatsApp}
              className="btn-gold !py-2 !px-4 text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(201,152,58,0.35)]"
              aria-label="Consultar recompensa por WhatsApp"
            >
              <MessageCircle size={14} aria-hidden="true" />
              Consultar recompensa por WhatsApp
            </button>
          )}

          {visits > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="btn-ghost !py-2 !px-2.5 text-xs text-tunche-muted hover:text-tunche-cream flex items-center gap-1"
              aria-label="Reiniciar progreso de visitas en este navegador"
              title="Reiniciar progreso"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleInquireWhatsApp}
          className="text-xs text-tunche-gold hover:underline underline-offset-4 flex items-center gap-1 ml-auto"
        >
          <MessageCircle size={13} aria-hidden="true" />
          Preguntar en WhatsApp
        </button>
      </div>

      {/* Salvaguarda legal y técnica obligatoria */}
      <div className="mt-4 pt-3 border-t border-tunche-border/40 flex items-start gap-2 text-[11px] text-tunche-muted/80 leading-relaxed">
        <Info size={14} className="flex-shrink-0 text-tunche-gold/70 mt-0.5" aria-hidden="true" />
        <p>{config.disclaimer}</p>
      </div>
    </div>
  );
}
