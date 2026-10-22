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

export function formatPrice(price: number): string {
  return `${config.currency} ${price.toFixed(2)}`;
}

export function generateCartId(dishId: string, options: CartItemOption[]): string {
  const optStr = options
    .map((o) => `${o.optionId}:${o.choices.sort().join(",")}`)
    .join("|");
  return `${dishId}__${optStr}`;
}
