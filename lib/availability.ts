import { config } from "../data/config";
import { menu } from "../data/menu";

type Availability = { available: boolean; message: string | null };

const categoryByDishId = new Map(
  menu.flatMap((category) => category.dishes.map((dish) => [dish.id, category.id] as const))
);

const available: Availability = { available: true, message: null };

export function getCategoryAvailability(categoryId: string, now: Date | null = new Date()): Availability {
  if (categoryId === "frappes" && config.availability.frappesSuspended) {
    return { available: false, message: "No disponible temporalmente" };
  }

  if (categoryId === "makis") {
    // Sin hora del cliente confirmada, se mantiene cerrado hasta la hidratación.
    if (!now) return { available: false, message: "Disponibles desde las 6:00 p. m." };
    const parts = new Intl.DateTimeFormat("en-GB", {
      timeZone: config.availability.makis.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);
    const minuteOfDay = hour * 60 + minute;
    if (minuteOfDay < config.availability.makis.startMinute || minuteOfDay >= config.availability.makis.endMinute) {
      return { available: false, message: "Disponibles desde las 6:00 p. m." };
    }
  }

  return available;
}

export function getDishAvailability(dishId: string, now: Date | null = new Date()): Availability {
  const categoryId = categoryByDishId.get(dishId);
  if (!categoryId) return { available: false, message: "Este producto ya no está en la carta" };
  return getCategoryAvailability(categoryId, now);
}

export function getUnavailableCartItems<T extends { dishId: string }>(items: T[], now: Date | null = new Date()): T[] {
  return items.filter((item) => !getDishAvailability(item.dishId, now).available);
}
