"use client";

import { useCart } from "@/lib/cart";

export default function Toast() {
  const { state } = useCart();
  const message = state.toastMessage;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`toast transition-[opacity,transform] duration-200 ${
        message ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}
