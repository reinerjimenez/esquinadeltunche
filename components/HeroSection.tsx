"use client";

import Image from "next/image";
import { MapPin, Clock, Navigation, MessageCircle } from "lucide-react";
import { config } from "@/data/config";

export default function HeroSection() {
  const scrollToMenu = () => {
    const target = document.getElementById("category-selector") || document.getElementById("menu-section");
    if (!target) return;
    const headerHeight = document.getElementById("site-header")?.offsetHeight ?? 62;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <section className="hero-section relative flex flex-col" aria-label="Portada del restaurante">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/hero-bg.jpg"
          alt="Platos de La Esquina del Tunche"
          fill
          className="object-cover"
          preload
          sizes="(max-width: 900px) 100vw, 900px"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 texture-leaves opacity-30" />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 flex flex-1 flex-col">
        {/* Logo & Brand */}
        <div className="hero-brand flex flex-col items-center text-center">
          <div className="hero-logo-wrap relative">
            <div className="hero-logo overflow-hidden rounded-full border border-tunche-gold/60">
              <Image
                src="/img/logo.webp"
                alt="Logo La Esquina del Tunche"
                width={112}
                height={112}
                className="object-cover"
              />
            </div>
          </div>

          <p className="text-tunche-muted text-xs font-semibold tracking-[0.25em] uppercase mb-1">
            Bienvenidos a
          </p>
          <h2 className="hero-title font-display text-tunche-cream">La Esquina</h2>
          <h2 className="hero-title font-display text-gold-gradient">del Tunche</h2>
          <p className="text-tunche-muted text-sm font-medium tracking-wide">
            {config.slogan}
          </p>
          <p className="text-tunche-muted/60 text-xs mt-1">Tingo María, Perú</p>
        </div>

        {/* Quick info pills */}
        <div className="hero-quick-info">
          {config.schedule && config.schedule !== "TODO: horario de atención" && (
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 self-center border border-tunche-border/50">
              <Clock size={14} className="text-tunche-gold" aria-hidden="true" />
              <span className="text-tunche-cream/90 text-sm">{config.schedule}</span>
            </div>
          )}
          {config.address && !config.address.startsWith("TODO") && (
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 self-center border border-tunche-border/50">
              <MapPin size={14} className="text-tunche-gold" aria-hidden="true" />
              <span className="text-tunche-cream/90 text-sm truncate max-w-[260px]">{config.address}</span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="hero-actions">
          <button
            onClick={scrollToMenu}
            className="btn-gold hero-primary"
            id="hero-ver-carta-btn"
            aria-label="Ver la carta del restaurante"
          >
            Ver carta
          </button>
          <a
            href={`https://wa.me/${config.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold hero-secondary"
            id="hero-whatsapp-btn"
            aria-label={`Contactar por WhatsApp al ${config.whatsappDisplay}`}
          >
            <MessageCircle size={18} aria-hidden="true" />
            Pedir por WhatsApp
          </a>
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost hero-secondary"
            id="hero-maps-btn"
            aria-label="Cómo llegar al restaurante"
          >
            <Navigation size={15} aria-hidden="true" />
            Cómo llegar
          </a>
        </div>
      </div>
    </section>
  );
}
