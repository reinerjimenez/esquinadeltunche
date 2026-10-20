"use client";

import { useState, useId } from "react";
import { Sparkles, Ticket, Award, Share2 } from "lucide-react";
import { config } from "@/data/config";
import PromotionsModule from "./club/PromotionsModule";
import CouponsModule from "./club/CouponsModule";
import LoyaltyCardModule from "./club/LoyaltyCardModule";
import ShareModule from "./club/ShareModule";

type ClubSectionProps = {
  onOpenMenu?: () => void;
};

type TabId = "promotions" | "coupons" | "loyalty" | "share";

const TABS: { id: TabId; icon: React.ReactNode; label: string; shortLabel: string }[] = [
  {
    id: "promotions",
    icon: <Sparkles size={16} aria-hidden="true" />,
    label: "Promociones",
    shortLabel: "Promos",
  },
  {
    id: "coupons",
    icon: <Ticket size={16} aria-hidden="true" />,
    label: "Cupones",
    shortLabel: "Cupones",
  },
  {
    id: "loyalty",
    icon: <Award size={16} aria-hidden="true" />,
    label: "Fidelización",
    shortLabel: "Sellos",
  },
  {
    id: "share",
    icon: <Share2 size={16} aria-hidden="true" />,
    label: "Compartir",
    shortLabel: "Compartir",
  },
];

export default function ClubSection({ onOpenMenu }: ClubSectionProps) {
  const { club } = config;
  const [activeTab, setActiveTab] = useState<TabId>("promotions");
  const tablistId = useId();

  if (!club.enabled) return null;

  return (
    <section
      id="club-tunche"
      aria-labelledby="heading-club-tunche"
      className="club-section"
    >
      {/* ── Header ── */}
      <div className="club-header">
        <p className="club-eyebrow">Fidelización · Beneficios</p>
        <h2 id="heading-club-tunche" className="club-title">
          {club.title}
        </h2>
        <p className="club-intro">{club.intro}</p>
      </div>

      {/* ── Tab Bar ── */}
      <div className="club-tabbar" role="tablist" aria-label="Secciones del Club del Tunche" id={tablistId}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`club-tab${activeTab === tab.id ? " active" : ""}`}
          >
            {tab.icon}
            <span className="club-tab-label">{tab.label}</span>
            <span className="club-tab-short">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Panels ── */}
      <div className="club-panel-wrapper">
        {activeTab === "promotions" && (
          <div
            role="tabpanel"
            id="panel-promotions"
            aria-labelledby="tab-promotions"
            className="club-panel"
          >
            <PromotionsModule promotions={club.promotions} onOpenMenu={onOpenMenu} />
          </div>
        )}

        {activeTab === "coupons" && (
          <div
            role="tabpanel"
            id="panel-coupons"
            aria-labelledby="tab-coupons"
            className="club-panel"
          >
            <CouponsModule coupons={club.coupons} />
          </div>
        )}

        {activeTab === "loyalty" && (
          <div
            role="tabpanel"
            id="panel-loyalty"
            aria-labelledby="tab-loyalty"
            className="club-panel"
          >
            <LoyaltyCardModule config={club.loyaltyCard} />
          </div>
        )}

        {activeTab === "share" && (
          <div
            role="tabpanel"
            id="panel-share"
            aria-labelledby="tab-share"
            className="club-panel"
          >
            <ShareModule />
          </div>
        )}
      </div>
    </section>
  );
}
