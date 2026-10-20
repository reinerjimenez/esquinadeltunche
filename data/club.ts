export type PromotionStatus = "active" | "scheduled" | "expired";

export type PromotionAction = {
  label: string;
  type: "whatsapp" | "menu" | "coupon";
  target?: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string;
  image?: string;
  promoPrice?: number;
  originalPrice?: number;
  conditions?: string[];
  startDate?: string; // Formato YYYY-MM-DD
  endDate?: string;   // Formato YYYY-MM-DD
  promoCode?: string;
  action?: PromotionAction;
  status: PromotionStatus;
};

export type CouponBenefitType = "descuento" | "cortesia" | "especial";

export type Coupon = {
  code: string;
  name: string;
  description: string;
  conditions: string[];
  validity: string;
  benefitType: CouponBenefitType;
  benefitValue?: string;
  enabled: boolean;
};

export type LoyaltyCardConfig = {
  targetVisits: number;
  rewardTitle: string;
  rewardDescription: string;
  conditions: string[];
  disclaimer: string;
  incentives: {
    start: string;
    progress: string;
    almostThere: string;
    completed: string;
  };
};

export type ClubConfig = {
  enabled: boolean;
  title: string;
  subtitle: string;
  intro: string;
  promotions: Promotion[];
  coupons: Coupon[];
  loyaltyCard: LoyaltyCardConfig;
};

/**
 * Validador de promociones activas para evitar mostrar promociones vencidas
 * o con datos inconsistentes.
 */
export function isPromotionActive(promo: Promotion): boolean {
  if (promo.status !== "active") return false;

  // Validación de precios negativos
  if (typeof promo.promoPrice === "number" && promo.promoPrice <= 0) return false;

  // Validación de fechas si existen
  if (promo.endDate) {
    const end = new Date(promo.endDate);
    if (!isNaN(end.getTime())) {
      // Comparar con el final del día de vencimiento
      end.setHours(23, 59, 59, 999);
      if (Date.now() > end.getTime()) {
        return false;
      }
    }
  }

  if (promo.startDate) {
    const start = new Date(promo.startDate);
    if (!isNaN(start.getTime())) {
      start.setHours(0, 0, 0, 0);
      if (Date.now() < start.getTime()) {
        return false;
      }
    }
  }

  return true;
}

export const clubConfig: ClubConfig = {
  enabled: true,
  title: "Club del Tunche",
  subtitle: "Beneficios y fidelización para nuestros clientes",
  intro: "Vuelve a disfrutar tus favoritos. Descubre promociones, guarda tus cupones y conoce las novedades de La Esquina del Tunche.",

  /**
   * PROMOCIONES
   * Para añadir una promoción real, define su id, título, descripción y condiciones.
   * Si no hay promociones activas, la interfaz mostrará elegantemente una invitación
   * a consultar las novedades y promociones del día por WhatsApp.
   */
  promotions: [],

  /**
   * CUPONES PROMOCIONALES
   * Los cupones son códigos de consulta y beneficio comercial.
   * El cliente puede copiarlos o aplicarlos a su pedido de WhatsApp.
   * La confirmación del beneficio siempre corresponde al restaurante.
   */
  coupons: [
    {
      code: "CLUBTUNCHE",
      name: "Bienvenida Club del Tunche",
      description: "Menciona o aplica este código al hacer tu pedido para consultar las cortesías y atenciones disponibles para miembros del Club en tu visita.",
      conditions: [
        "Válido en consumos presenciales y pedidos para llevar.",
        "Sujeto a confirmación y disponibilidad del restaurante al momento de la orden.",
        "No acumulable con otras promociones vigentes ni canjeable por dinero en efectivo.",
        "Presenta o envía este código antes de emitir tu cuenta."
      ],
      validity: "Vigente durante 2026",
      benefitType: "cortesia",
      benefitValue: "Atención o cortesía del día",
      enabled: true,
    },
  ],

  /**
   * TARJETA DE VISITAS (FIDELIZACIÓN)
   * Diseñada para premiar la recurrencia de los clientes.
   * El progreso en el navegador es orientativo para el cliente.
   * El personal del restaurante valida físicamente los consumos y entrega la recompensa.
   */
  loyaltyCard: {
    targetVisits: 5,
    rewardTitle: "Recompensa por Fidelidad",
    rewardDescription: "Consulta en el restaurante las recompensas disponibles para los clientes frecuentes.",
    conditions: [
      "Válido por cada visita o consumo registrado en La Esquina del Tunche en Tingo María.",
      "Cada sello requiere confirmación presencial del personal del restaurante al solicitar tu cuenta.",
      "La recompensa final se entrega sujeta a disponibilidad de insumos y reglas del establecimiento.",
      "Progreso personal guardado en tu navegador a modo de recordatorio."
    ],
    disclaimer: "Nota de transparencia: Este registro es un recordatorio local en tu dispositivo. No constituye un comprobante formal de compra. El restaurante validará físicamente tus visitas para la entrega de recompensas.",
    incentives: {
      start: "Comienza a sellar tu tarjeta en cada visita y descubre beneficios especiales.",
      progress: "¡Excelente avance! Te faltan {remaining} visitas para completar tu tarjeta.",
      almostThere: "¡Ya casi! Solo te falta 1 visita para completar tu tarjeta del Club.",
      completed: "¡Felicitaciones! Has completado tus 5 visitas. Consulta tu recompensa con el personal en tu próxima visita.",
    },
  },
};
