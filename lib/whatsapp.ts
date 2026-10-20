import { config } from "@/data/config";

export type OrderType = "takeaway" | "dineIn";

export type CartItemOption = {
  optionId: string;
  label: string;
  choices: string[];
};

export type CartItem = {
  cartId: string; // unique per item+options combo
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  options: CartItemOption[];
  note: string;
};

export type CartOrder = {
  items: CartItem[];
  orderType: OrderType | null;
  address: string;
  tableNumber: string;
  customerName: string;
  comment: string;
  promoCode?: string;
};

function buildOptionsSuffix(options: CartItemOption[]): string {
  return options
    .filter((o) => o.choices.length > 0)
    .map((o) => `${o.choices.join(", ")}`)
    .join(" | ");
}

export function buildWhatsAppMessage(order: CartOrder): string {
  const lines: string[] = [];

  lines.push(config.orderGreeting);
  lines.push("");

  // Order type
  if (order.orderType === "takeaway") {
    lines.push(`*Tipo de pedido:* Para llevar`);
    lines.push(`*Dirección:* ${order.address}`);
  } else if (order.orderType === "dineIn") {
    lines.push(`*Tipo de pedido:* Comer en el restaurante`);
    lines.push(`*Mesa:* ${order.tableNumber}`);
  }

  if (order.customerName.trim()) {
    lines.push(`*Nombre:* ${order.customerName}`);
  }

  lines.push("");
  lines.push("*Detalle del pedido:*");

  let total = 0;
  for (const item of order.items) {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    const optionsSuffix = buildOptionsSuffix(item.options);
    const optionsPart = optionsSuffix ? ` (${optionsSuffix})` : "";
    lines.push(`${item.quantity} x ${item.name}${optionsPart} — ${config.currency} ${subtotal.toFixed(2)}`);
    if (item.note.trim()) {
      lines.push(`   📝 Nota: ${item.note}`);
    }
  }

  // Código promocional o cupón del Club del Tunche (si fue aplicado)
  if (order.promoCode && order.promoCode.trim()) {
    lines.push("");
    lines.push(`🎟️ *Cupón / Código Club:* ${order.promoCode.trim().toUpperCase()}`);
    lines.push(`   _(Beneficio y aplicación sujetos a confirmación y disponibilidad del restaurante)_`);
  }

  lines.push("");
  lines.push(`*Total estimado: ${config.currency} ${total.toFixed(2)}*`);

  if (order.comment.trim()) {
    lines.push("");
    lines.push(`Comentario: ${order.comment}`);
  }

  lines.push("");
  lines.push(config.orderFooter);

  return lines.join("\n");
}

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildCouponInquiryUrl(code: string, couponName: string): string {
  const message = `¡Hola, La Esquina del Tunche! 👋\nQuiero consultar sobre el cupón *${code}* (${couponName}) del Club del Tunche.\n¿Podrían confirmarme las condiciones y atenciones disponibles para mi visita?`;
  return getWhatsAppUrl(message);
}

export function buildLoyaltyInquiryUrl(visits: number, target: number): string {
  const message = `¡Hola, La Esquina del Tunche! 👋\nHe completado ${visits} de ${target} visitas en mi tarjeta de fidelización del Club del Tunche.\n¿Podrían informarme cómo validar mis sellos y conocer las recompensas disponibles?`;
  return getWhatsAppUrl(message);
}

export function buildPromoInquiryUrl(promoTitle: string, promoCode?: string): string {
  const codePart = promoCode ? ` con código *${promoCode}*` : "";
  const message = `¡Hola, La Esquina del Tunche! 👋\nQuiero consultar la disponibilidad de la promoción: *${promoTitle}*${codePart}.\n¿Tienen disponibilidad hoy?`;
  return getWhatsAppUrl(message);
}

export function formatPrice(price: number): string {
  return `${config.currency} ${price.toFixed(2)}`;
}

export function generateCartId(dishId: string, options: CartItemOption[]): string {
  const optStr = options
    .map((o) => `${o.optionId}:${o.choices.sort().join(",")}`)
    .join("|");
  return `${dishId}__${optStr}`;
}
