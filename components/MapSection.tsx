"use client";

import { MapPin, Navigation, Phone, Star } from "lucide-react";
import { config } from "@/data/config";
import { trackEvent } from "@/lib/analytics";

export default function MapSection() {
  const hasEmbed = config.mapsEmbedUrl && config.mapsEmbedUrl.trim() !== "";
  const hasPublicAddress = Boolean(config.address && !config.address.startsWith("TODO"));
  const publicAddress = hasPublicAddress ? config.address : "Tingo María, Huánuco, Perú";
  const hasReviews = Boolean(config.googleReviewsUrl && config.googleReviewsUrl.trim() !== "");

  return (
    <section
      id="visitanos"
      className="visit-section"
      aria-label="Dónde encontrarnos"
    >
      <div className="section-divider visit-heading">
        <div>
          <p className="text-tunche-muted text-xs font-semibold uppercase tracking-wider">¿Dónde estamos?</p>
          <h2 className="font-display text-tunche-cream text-lg font-bold">
            Visítanos
          </h2>
        </div>
      </div>

      {/* Map */}
      {hasEmbed ? (
        <div className="visit-map">
          <iframe
            src={config.mapsEmbedUrl}
            width="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="Ubicación de La Esquina del Tunche"
            className="visit-map-frame"
          />
        </div>
      ) : (
        <div className="visit-fallback">
          <div className="visit-pin" aria-hidden="true">
            <MapPin size={24} />
          </div>
          <div className="visit-fallback-copy">
            <p>La Esquina del Tunche</p>
            <span>{publicAddress}</span>
          </div>
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("map_directions_click")}
            className="btn-gold"
            aria-label="Cómo llegar a La Esquina del Tunche en Google Maps"
          >
            <Navigation size={16} aria-hidden="true" />
            Cómo llegar
          </a>
        </div>
      )}

      {/* Action buttons */}
      <div className="visit-actions">
        {hasEmbed && (
          <a
            href={config.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("map_directions_click")}
            className="btn-gold visit-action"
            aria-label="Cómo llegar en Google Maps"
            id="map-directions-btn"
          >
            <Navigation size={16} aria-hidden="true" />
            Cómo llegar
          </a>
        )}
        <a
          href={`https://wa.me/${config.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("whatsapp_click", { context: "map" })}
          className="btn-outline-gold visit-action"
          aria-label={`Llamar o escribir por WhatsApp al ${config.whatsappDisplay}`}
          id="map-whatsapp-btn"
        >
          <Phone size={16} aria-hidden="true" />
          {config.whatsappDisplay}
        </a>

        {/* Botón de opiniones en Google (solo visible cuando esté configurada la URL oficial) */}
        {hasReviews && (
          <a
            href={config.googleReviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("review_click")}
            className="btn-ghost visit-action text-tunche-gold"
            aria-label="Dejar o consultar opiniones en Google"
            id="map-reviews-btn"
          >
            <Star size={16} aria-hidden="true" />
            Opiniones en Google
          </a>
        )}
      </div>
    </section>
  );
}
