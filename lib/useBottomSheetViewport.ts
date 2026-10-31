"use client";

import { useEffect, useSyncExternalStore } from "react";

export type BottomSheetViewportMetrics = {
  maxHeight: string;
  bottomOffset: number;
  isKeyboardOpen: boolean;
};

const DEFAULT_METRICS: BottomSheetViewportMetrics = {
  maxHeight: "94dvh",
  bottomOffset: 0,
  isKeyboardOpen: false,
};

let cachedMetrics: BottomSheetViewportMetrics = DEFAULT_METRICS;

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener("resize", callback);
    vv.addEventListener("scroll", callback);
  }
  window.addEventListener("resize", callback);

  return () => {
    if (vv) {
      vv.removeEventListener("resize", callback);
      vv.removeEventListener("scroll", callback);
    }
    window.removeEventListener("resize", callback);
  };
}

function getSnapshot(): BottomSheetViewportMetrics {
  if (typeof window === "undefined" || !window.visualViewport) {
    return DEFAULT_METRICS;
  }

  const vv = window.visualViewport;
  const viewportHeight = vv.height;
  const windowHeight = window.innerHeight;
  const keyboardThreshold = 140;
  const isKeyboard = windowHeight - viewportHeight > keyboardThreshold;

  const offsetTop = vv.offsetTop || 0;
  const bottomDiff = Math.max(0, windowHeight - (offsetTop + viewportHeight));

  const availableHeight = isKeyboard
    ? Math.min(viewportHeight - 16, windowHeight * 0.94)
    : Math.min(viewportHeight * 0.94, windowHeight * 0.94);

  const roundedHeight = `${Math.round(availableHeight)}px`;
  const roundedBottom = Math.round(bottomDiff);

  if (
    cachedMetrics.maxHeight === roundedHeight &&
    cachedMetrics.bottomOffset === roundedBottom &&
    cachedMetrics.isKeyboardOpen === isKeyboard
  ) {
    return cachedMetrics;
  }

  cachedMetrics = {
    maxHeight: roundedHeight,
    bottomOffset: roundedBottom,
    isKeyboardOpen: isKeyboard,
  };

  return cachedMetrics;
}

function getServerSnapshot(): BottomSheetViewportMetrics {
  return DEFAULT_METRICS;
}

/**
 * Hook using React 19's useSyncExternalStore to synchronize visualViewport dimensions
 * and manage body scroll locking for bottom sheets across iOS Safari and Android Chrome.
 */
export function useBottomSheetViewport(isOpen: boolean): BottomSheetViewportMetrics {
  const metrics = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Pure DOM side effects: Body scroll locking and input visibility
  useEffect(() => {
    if (!isOpen || typeof window === "undefined") return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Auto-scroll focused element into view inside the bottom sheet
    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT")
      ) {
        window.setTimeout(() => {
          target.scrollIntoView({ block: "center", behavior: "smooth" });
        }, 120);
      }
    };

    // Soft restore viewport scroll on blur
    const handleFocusOut = () => {
      window.setTimeout(() => {
        if (!document.activeElement?.matches("input, textarea, select")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 100);
    };

    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, [isOpen]);

  return isOpen ? metrics : DEFAULT_METRICS;
}
