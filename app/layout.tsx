import type { Metadata, Viewport } from "next";
import { Cinzel, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

import { config } from "@/data/config";

const shareTitle = "La Esquina del Tunche | Carta Digital";
const shareDescription =
  "Cocina amazónica y marina peruana en Tingo María. Explora nuestra carta digital y haz tu pedido fácilmente por WhatsApp.";
const shareImage = `${config.publicUrl}/og/la-esquina-del-tunche-share.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(config.publicUrl),
  title: shareTitle,
  description: shareDescription,
  keywords: [
    "La Esquina del Tunche",
    "carta digital",
    "restaurante Tingo María",
    "cocina amazónica",
    "ceviche",
    "tacacho",
    "cecina",
    "pedido por WhatsApp",
  ],
  authors: [{ name: "R.DEV" }],
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: config.publicUrl,
    siteName: config.name,
    type: "website",
    locale: "es_PE",
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: "La Esquina del Tunche: carta digital de cocina amazónica y marina peruana",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/img/logo.webp", type: "image/webp" },
    ],
    apple: "/img/logo.webp",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1A10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-PE" className={`${cinzel.variable} ${dmSans.variable}`}>
      <body className="font-sans bg-tunche-dark text-tunche-cream antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
