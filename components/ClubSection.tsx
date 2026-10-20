"use client";

import { useState, useCallback, useRef } from "react";
import { Award, Ticket, Sparkles } from "lucide-react";
import { config } from "@/data/config";
import PromotionsModule from "./club/PromotionsModule";
import CouponsModule from "./club/CouponsModule";
import LoyaltyCardModule from "./club/LoyaltyCardModule";

type ClubSectionProps = {
  onOpenMenu?: () => void;
};

type TabId = "loyalty" | "coupons" | "promotions";

const TABS: {
  id: TabId;
  icon: React.ReactNode;
  label: string;
  shortLabel: string;
}[] = [
  {
    id: "loyalty",
    icon: <Award size={15} aria-hidden="true" />,
    label: "Mis visitas",
    shortLabel: "Visitas",
  },
  {
    id: "coupons",
    icon: <Ticket size={15} aria-hidden="true" />,
    label: "Cupones",
    shortLabel: "Cupones",
  },
  {
    id: "promotions",
    icon: <Sparkles size={15} aria-hidden="true" />,
    label: "Especiales",
    shortLabel: "Especiales",
  },
];

export default function ClubSection({ onOpenMenu }: ClubSectionProps) {
  const { club } = config;
  const [activeTab, setActiveTab] = useState<TabId>("loyalty");
  const tabRefs = useRef<Map<TabId, HTMLButtonElement>>(new Map());

  // Keyboard navigation for tab list (ARIA Authoring Practices)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const ids = TABS.map((t) => t.id);
      const currentIndex = ids.indexOf(activeTab);
      let nextIndex = currentIndex;

      if (e.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % ids.length;
      } else if (e.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + ids.length) % ids.length;
      } else if (e.key === "Home") {
        nextIndex = 0;
      } else if (e.key === "End") {
        nextIndex = ids.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextId = ids[nextIndex];
      setActiveTab(nextId);
      tabRefs.current.get(nextId)?.focus();
    },
    [activeTab]
  );

  // Derive screen-reader announcement directly from activeTab — no effect needed
  const announcement = TABS.find((t) => t.id === activeTab)?.label
    ? `${TABS.find((t) => t.id === activeTab)!.label} seleccionado`
    : "";

  if (!club.enabled) return null;

  return (
    <section
      id="club-tunche"
      aria-labelledby="heading-club-tunche"
      className="club-section"
    >
      {/* Screen-reader live region */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* ── Header ── */}
      <div className="club-header">
        <p className="club-eyebrow">Fidelización · Beneficios</p>
        <h2 id="heading-club-tunche" className="club-title">
          {club.title}
        </h2>
        <p className="club-intro">{club.intro}</p>
      </div>

      {/* ── Tab Bar ── */}
      <div
        role="tablist"
        aria-label="Secciones del Club del Tunche"
        className="club-tabbar"
        onKeyDown={handleKeyDown}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              id={`club-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`club-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              ref={(el) => {
                if (el) tabRefs.current.set(tab.id, el);
                else tabRefs.current.delete(tab.id);
              }}
              onClick={() => setActiveTab(tab.id)}
              className={`club-tab${isActive ? " active" : ""}`}
            >
              {tab.icon}
              <span className="club-tab-label">{tab.label}</span>
              <span className="club-tab-short">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ── Panels ── */}
      <div className="club-panel-wrapper">
        <div
          role="tabpanel"
          id="club-panel-loyalty"
          aria-labelledby="club-tab-loyalty"
          hidden={activeTab !== "loyalty"}
          className={activeTab === "loyalty" ? "club-panel" : undefined}
        >
          <LoyaltyCardModule config={club.loyaltyCard} />
        </div>

        <div
          role="tabpanel"
          id="club-panel-coupons"
          aria-labelledby="club-tab-coupons"
          hidden={activeTab !== "coupons"}
          className={activeTab === "coupons" ? "club-panel" : undefined}
        >
          <CouponsModule coupons={club.coupons} />
        </div>

        <div
          role="tabpanel"
          id="club-panel-promotions"
          aria-labelledby="club-tab-promotions"
          hidden={activeTab !== "promotions"}
          className={activeTab === "promotions" ? "club-panel" : undefined}
        >
          <PromotionsModule promotions={club.promotions} onOpenMenu={onOpenMenu} />
        </div>
      </div>
    </section>
  );
}
