"use client";

import { useState, useSyncExternalStore } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { config } from "@/data/config";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/lib/cart";

const emptySubscribe = () => () => {};

export default function ShareModule() {
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
      // Ignorar cancelaciones del usuario
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
    <div className="card-surface p-5 sm:p-6 border border-tunche-border/80 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="max-w-md">
          <div className="flex items-center gap-1.5 text-xs font-bold text-tunche-gold uppercase tracking-wider mb-1">
            <Share2 size={14} aria-hidden="true" />
            <span>Comparte la Carta</span>
          </div>
          <h3 className="font-display text-tunche-cream text-base sm:text-lg font-bold">
            ¿Vienes en grupo o quieres recomendar un buen plato?
          </h3>
          <p className="text-tunche-muted text-xs sm:text-sm mt-1 leading-relaxed">
            Comparte nuestra carta digital con tus amigos o familia para elegir juntos antes de llegar o hacer su pedido.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 sm:self-center flex-shrink-0">
          {canShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="btn-gold !py-2.5 !px-4 text-xs flex items-center gap-2"
              aria-label="Compartir carta digital con aplicaciones del dispositivo"
              id="share-native-btn"
            >
              <Share2 size={15} aria-hidden="true" />
              Compartir
            </button>
          )}

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-[0_4px_16px_rgba(37,211,102,0.22)] transition-transform duration-150 active:scale-[0.98] hover:bg-[#20ba59]"
            aria-label="Compartir carta digital por WhatsApp"
            id="share-whatsapp-btn"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Por WhatsApp
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="btn-outline-gold !py-2.5 !px-3.5 text-xs flex items-center gap-1.5"
            aria-label="Copiar enlace de la carta al portapapeles"
            id="share-copy-btn"
          >
            {copied ? (
              <>
                <Check size={14} className="text-tunche-gold" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copiar enlace</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
