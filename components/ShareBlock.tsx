"use client";

import { useState, useSyncExternalStore } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { config } from "@/data/config";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/lib/cart";

const emptySubscribe = () => () => {};

/**
 * Bloque compacto «Comparte la carta» — aparece entre MapSection y Footer.
 * Mantiene compartir nativo, WhatsApp y copia de enlace en un bloque independiente.
 */
export default function ShareBlock() {
  const { showToast } = useCart();
  const [copied, setCopied] = useState(false);

  const canShare = useSyncExternalStore(
    emptySubscribe,
    () => typeof navigator !== "undefined" && typeof navigator.share === "function",
    () => false
  );

  const shareData = {
    title: config.share.title,
    text: config.share.text,
    url: config.publicUrl,
  };

  const handleNativeShare = async () => {
    trackEvent("share_click", { method: "web_share" });
    try {
      await navigator.share(shareData);
    } catch {
      // Cancelación del usuario — ignorar
    }
  };

  const handleCopyLink = async () => {
    trackEvent("share_click", { method: "clipboard" });
    try {
      await navigator.clipboard.writeText(config.publicUrl);
      setCopied(true);
      showToast("¡Enlace copiado al portapapeles!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      showToast(`Enlace: ${config.publicUrl}`);
    }
  };

  const handleWhatsAppShare = () => {
    trackEvent("share_click", { method: "whatsapp" });
    const fullText = `${config.share.text} ${config.publicUrl}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(fullText)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="share-block" aria-label="Compartir la carta digital">
      <div className="share-block-inner">
        <div className="share-block-copy">
          <div className="share-block-label">
            <Share2 size={13} aria-hidden="true" />
            <span>Comparte la carta</span>
          </div>
          <p className="share-block-desc">
            ¿Vienes en grupo? Comparte la carta con tus amigos antes de llegar.
          </p>
        </div>

        <div className="share-block-actions">
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="btn-gold !py-2 !px-3.5 text-xs flex items-center gap-1.5"
              aria-label="Compartir carta con aplicaciones del dispositivo"
              id="share-native-btn"
            >
              <Share2 size={14} aria-hidden="true" />
              Compartir
            </button>
          )}

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="share-block-wa"
            aria-label="Compartir carta por WhatsApp"
            id="share-whatsapp-btn"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-outline-gold !py-2 !px-3 text-xs flex items-center gap-1.5"
            aria-label="Copiar enlace de la carta"
            id="share-copy-btn"
          >
            {copied ? (
              <>
                <Check size={13} className="text-tunche-gold" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
