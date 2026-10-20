"use client";

import Image from "next/image";
import { useState } from "react";

type DishImageProps = {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  type?:
    | "desayunos"
    | "poke-bowls"
    | "pescados-mariscos"
    | "de-la-casa"
    | "salteados-wok"
    | "pastas-grill"
    | "alitas"
    | "hamburguesas"
    | "salchipapas"
    | "jugos"
    | "bebidas"
    | "frozen"
    | "frappes";
};

const categoryGradients: Record<string, string> = {
  "desayunos":        "from-amber-900/80 to-yellow-900/60",
  "poke-bowls":       "from-teal-900/80 to-cyan-900/60",
  "pescados-mariscos":"from-blue-900/80 to-cyan-900/60",
  "de-la-casa":       "from-green-900/80 to-emerald-900/60",
  "salteados-wok":    "from-orange-900/80 to-red-900/60",
  "pastas-grill":     "from-red-900/80 to-orange-900/60",
  "alitas":           "from-amber-900/80 to-red-900/60",
  "hamburguesas":     "from-yellow-900/80 to-orange-900/60",
  "salchipapas":      "from-orange-900/80 to-amber-900/60",
  "jugos":            "from-emerald-900/80 to-lime-900/60",
  "bebidas":          "from-purple-900/80 to-indigo-900/60",
  "frozen":           "from-cyan-900/80 to-blue-900/60",
  "frappes":          "from-amber-950/80 to-stone-900/60",
};

const categoryIcons: Record<string, string> = {
  "desayunos":        "🌿",
  "poke-bowls":       "🥗",
  "pescados-mariscos":"🐟",
  "de-la-casa":       "🌿",
  "salteados-wok":    "🔥",
  "pastas-grill":     "🍝",
  "alitas":           "🍗",
  "hamburguesas":     "🍔",
  "salchipapas":      "🍟",
  "jugos":            "🥤",
  "bebidas":          "🍹",
  "frozen":           "🍧",
  "frappes":          "☕",
};

export default function DishImage({
  src,
  alt,
  className = "",
  priority = false,
  fill = false,
  sizes = "(max-width: 480px) 100vw, 480px",
  type,
}: DishImageProps) {
  const [error, setError] = useState(false);

  const gradient = type ? categoryGradients[type] : "from-green-900/80 to-amber-900/60";
  const icon = type ? categoryIcons[type] : "🍽️";

  if (!src || error) {
    // Elegant placeholder
    return (
      <div className={`relative flex items-center justify-center bg-gradient-to-br ${gradient} texture-leaves ${className}`}>
        <div className="flex flex-col items-center gap-1 opacity-60">
          <span className="text-3xl">{icon}</span>
          <div className="w-8 h-0.5 bg-tunche-gold/40 rounded-full" />
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <div className={className}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={sizes}
          priority={priority}
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={400}
      height={300}
      className={`object-cover ${className}`}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
