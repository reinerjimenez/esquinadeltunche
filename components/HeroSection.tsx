"use client";

import Image from "next/image";
import { MapPin, Clock, Navigation, MessageCircle, Award } from "lucide-react";
import { config } from "@/data/config";

export default function HeroSection() {
  const scrollToMenu = () => {
    document.getElementById("menu-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90dvh] flex flex-col" aria-label="Portada del restaurante">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/hero-bg.jpg"
          alt="Platos de La Esquina del Tunche"
          fill
          className="object-cover"
          preload
          sizes="(max-width: 480px) 100vw, 480px"
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="absolute inset-0 texture-leaves opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 px-6 pt-16 pb-8">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center text-center mt-auto mb-6">
          <div className="mb-6 relative">
            <div className="w-28 h-28 rounded-full border-2 border-tunche-gold/60 shadow-[0_0_40px_rgba(201,152,58,0.3)] overflow-hidden">
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
          <h2 className="font-display text-4xl font-black text-tunche-cream leading-none mb-1">
            La Esquina
          </h2>
          <h2 className="font-display text-4xl font-black text-gold-gradient leading-none mb-3">
            del Tunche
          </h2>
          <p className="text-tunche-muted text-sm font-medium tracking-wide">
            {config.slogan}
          </p>
          <p className="text-tunche-muted/60 text-xs mt-1">Tingo María, Perú</p>
        </div>

        {/* Quick info pills */}
        <div className="flex flex-col gap-2 mb-8">
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
        <div className="flex flex-col gap-3">
          <button
            onClick={scrollToMenu}
            className="btn-gold w-full text-base py-4"
            id="hero-ver-carta-btn"
            aria-label="Ver la carta del restaurante"
          >
            Ver carta
          </button>
          <a
            href={`https://wa.me/${config.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold w-full text-base py-4 flex items-center justify-center gap-2"
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
            className="btn-ghost w-full py-3 text-sm"
            id="hero-maps-btn"
            aria-label="Cómo llegar al restaurante"
          >
            <Navigation size={15} aria-hidden="true" />
            Cómo llegar
          </a>
          <a
            href="#club-tunche"
            className="flex items-center justify-center gap-1.5 text-xs font-semibold text-tunche-gold hover:text-tunche-gold-bright transition-colors py-1.5"
            aria-label="Conocer el Club del Tunche, cupones y beneficios"
          >
            <Award size={14} aria-hidden="true" />
            <span>Club del Tunche · Beneficios y Cupones</span>
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-10 flex justify-center pb-4">
        <div className="flex flex-col items-center gap-1 opacity-50 animate-bounce">
          <div className="w-px h-6 bg-tunche-gold/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-tunche-gold/60" />
        </div>
      </div>
    </section>
  );
}
