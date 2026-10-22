export const config = {
  name: "La Esquina del Tunche",
  slogan: "Sabores de la selva y del mar",
  tagline: "Cocina amazónica y marina peruana en Tingo María",
  publicUrl: "https://esquinadeltunche.vercel.app",
  whatsapp: "51977480721", // formato wa.me: sin + ni espacios
  whatsappDisplay: "+51 977 480 721",
  address: "TODO: dirección escrita — pega aquí la dirección completa",
  // Enlace oficial de Google Maps proporcionado por el propietario
  mapsUrl: "https://maps.app.goo.gl/iU27zBfXCvB18uW66?g_st=ic",
  mapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3937.4144987310056!2d-76.00401742469995!3d-9.29649089077591!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91a641c2031a2eeb%3A0xf01a8225e7951703!2sLa%20Esquina%20del%20Tunche!5e0!3m2!1ses-419!2spe!4v1791912414912!5m2!1ses-419!2spe",
  // Ficha oficial de Google Maps; no es un enlace directo al formulario de reseña.
  googleReviewsUrl: "https://maps.app.goo.gl/X7MXjDFJNnvYPpH68?g_st=ic",
  schedule: "TODO: horario de atención", // ej: "Lun–Dom: 8:00 am – 10:00 pm"
  orderTypes: { takeaway: true, dineIn: true },
  tableCount: 0, // 0 = sin límite de número de mesa
  takeawayNote: "", // ej: "Delivery disponible en el centro de Tingo María"
  orderGreeting: "¡Hola, La Esquina del Tunche! 👋\nQuiero hacer el siguiente pedido:",
  orderFooter: "¡Gracias! 🙏",
  social: {
    facebook: "https://www.facebook.com/share/1FKygWXNao/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@esquinadeltunche?_r=1&_t=ZS-9AVqDaacohI",
    instagram: "https://www.instagram.com/esquinadeltunche?srtk=bWN6cmJuY2FlMmQy&utm_source=qr",
  },
  share: {
    title: "La Esquina del Tunche — Carta Digital",
    text: "Descubre la carta digital de La Esquina del Tunche: sabores auténticos de la selva y del mar en Tingo María. Mira la carta aquí:",
    url: "https://esquinadeltunche.vercel.app",
  },
  currency: "S/",
  featured: [
    "combito-del-tunche",
    "ceviche-del-tunche",
    "chaufa-del-tunche",
    "saltado-amazonico",
    "costillas-maracuya",
    "jalea-mixta",
  ],
  pokeBowlOptions: {
    bases: ["Arroz blanco", "Arroz integral", "Quinua"],
    proteinas: ["Salmón", "Atún", "Langostinos", "Tofu"],
    toppings: ["Aguacate", "Edamame", "Pepino", "Zanahoria", "Cebolla morada", "Mango"],
    salsas: ["Teriyaki", "Spicy Mayo", "Ponzu", "Sesame"],
  },
};

export type Config = typeof config;
