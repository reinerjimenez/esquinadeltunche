import { config } from "../data/config";
import { getUnavailableCartItems } from "./availability";

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
};

export function calculateOrderTotals(order: Pick<CartOrder, "items" | "orderType">) {
  const itemCount = order.items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taperCount = order.orderType === "takeaway" ? itemCount : 0;
  const taperTotal = taperCount * config.taperUnitPrice;
  return { itemCount, subtotal, taperCount, taperTotal, total: subtotal + taperTotal };
}

export function getPickupNameError(order: Pick<CartOrder, "orderType" | "customerName">): string | null {
  return order.orderType === "takeaway" && !order.customerName.trim()
    ? "Ingresa el nombre de quien recogerá el pedido"
    : null;
}

function buildOptionsSuffix(options: CartItemOption[]): string {
  return options
    .filter((o) => o.choices.length > 0)
    .map((o) => `${o.choices.join(", ")}`)
    .join(" | ");
}

export function buildWhatsAppMessage(order: CartOrder, now: Date = new Date()): string {
  if (getUnavailableCartItems(order.items, now).length > 0) {
    throw new Error("El pedido contiene productos no disponibles");
  }
  const nameError = getPickupNameError(order);
  if (nameError) throw new Error(nameError);
  const totals = calculateOrderTotals(order);
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
    lines.push(`*${order.orderType === "takeaway" ? "Cliente" : "Nombre"}:* ${order.customerName.trim()}`);
  }

  lines.push("");
  lines.push("*Detalle del pedido:*");

  for (const item of order.items) {
    const subtotal = item.price * item.quantity;
    const optionsSuffix = buildOptionsSuffix(item.options);
    const optionsPart = optionsSuffix ? ` (${optionsSuffix})` : "";
    lines.push(`${item.quantity} x ${item.name}${optionsPart} — ${config.currency} ${subtotal.toFixed(2)}`);
    if (item.note.trim()) {
      lines.push(`   📝 Nota: ${item.note}`);
    }
  }

  lines.push("");
  lines.push(`Subtotal: ${formatPrice(totals.subtotal)}`);
  if (totals.taperCount > 0) {
    lines.push(`Táper (${totals.taperCount} × ${formatPrice(config.taperUnitPrice)}): ${formatPrice(totals.taperTotal)}`);
  }
  lines.push(`*Total estimado: ${formatPrice(totals.total)}*`);

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

export function formatPrice(price: number): string {
  return `${config.currency} ${price.toFixed(2)}`;
}

export function generateCartId(dishId: string, options: CartItemOption[]): string {
  const optStr = options
    .map((o) => `${o.optionId}:${o.choices.sort().join(",")}`)
    .join("|");
  return `${dishId}__${optStr}`;
}
