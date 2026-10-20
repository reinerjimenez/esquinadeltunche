"use client";

import { Sparkles, Ticket, Award } from "lucide-react";
import { config } from "@/data/config";
import PromotionsModule from "./club/PromotionsModule";
import CouponsModule from "./club/CouponsModule";
import LoyaltyCardModule from "./club/LoyaltyCardModule";
import ShareModule from "./club/ShareModule";

type ClubSectionProps = {
  onOpenMenu?: () => void;
};

export default function ClubSection({ onOpenMenu }: ClubSectionProps) {
  const { club } = config;

  if (!club.enabled) return null;

  return (
    <section
      id="club-tunche"
      aria-labelledby="heading-club-tunche"
      className="club-section my-12 px-4 sm:px-6 max-w-4xl mx-auto"
    >
      {/* Encabezado principal del Club */}
      <div className="section-divider mb-4">
        <div>
          <p className="text-tunche-gold text-xs font-bold uppercase tracking-[0.2em]">
            Fidelización y Beneficios
          </p>
          <h2
            id="heading-club-tunche"
            className="font-display text-2xl sm:text-3xl font-extrabold text-tunche-cream mt-1"
          >
            {club.title}
          </h2>
        </div>
      </div>

      <p className="text-tunche-muted text-sm sm:text-base leading-relaxed mb-8 max-w-2xl">
        {club.intro}
      </p>

      {/* Grid de módulos del Club */}
      <div className="flex flex-col gap-8">
        {/* 1. Promociones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-tunche-gold" aria-hidden="true" />
            <h3 className="font-display text-tunche-cream text-base font-bold">
              Promociones del Restaurante
            </h3>
          </div>
          <PromotionsModule promotions={club.promotions} onOpenMenu={onOpenMenu} />
        </div>

        {/* 2. Cupones de Beneficio */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={16} className="text-tunche-gold" aria-hidden="true" />
            <h3 className="font-display text-tunche-cream text-base font-bold">
              Cupones para tu Próxima Visita
            </h3>
          </div>
          <CouponsModule coupons={club.coupons} />
        </div>

        {/* 3. Tarjeta de Visitas (Fidelización) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-tunche-gold" aria-hidden="true" />
            <h3 className="font-display text-tunche-cream text-base font-bold">
              Tarjeta de Visitas Digital
            </h3>
          </div>
          <LoyaltyCardModule config={club.loyaltyCard} />
        </div>

        {/* 4. Compartir la Carta */}
        <div>
          <ShareModule />
        </div>
      </div>
    </section>
  );
}
