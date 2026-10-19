export type DishTag = "recomendado" | "picante" | "amazonico" | "marino" | "nuevo";

export type DishOption = {
  id: string;
  label: string;
  choices: string[];
  min: number;
  max: number;
};

export type DishVariant = {
  id: string;
  name: string;
  price: number;
};

export type Dish = {
  id: string;
  name: string;
  description?: string;
  detail?: string;
  price: number | null;
  image?: string;
  tags?: DishTag[];
  options?: DishOption[];
  variants?: DishVariant[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  note?: string;
  dishes: Dish[];
};

export const menu: Category[] = [
  // ─── 1. DESAYUNOS ──────────────────────────────────────────────────────────
  {
    id: "desayunos",
    name: "Desayunos",
    icon: "🌿",
    subtitle: "Sabores amazónicos para empezar el día",
    dishes: [
      {
        id: "yuquitas-arrebozadas-del-tunche",
        name: "Yuquitas arrebozadas del Tunche",
        description: "Con cecina y chorizo.",
        price: 12,
        tags: ["amazonico"],
      },
      {
        id: "tortilla-amazonica",
        name: "Tortilla amazónica",
        price: 14,
        tags: ["amazonico"],
      },
      {
        id: "combito-del-tunche",
        name: "Combito del Tunche",
        description: "Tacacho + juanecito con cecina ahumada, chorizo artesanal o chicharrón.",
        price: 15,
        image: "/img/dishes/combito-del-tunche.jpg",
        tags: ["recomendado", "amazonico"],
        options: [
          {
            id: "proteina",
            label: "Elige tu proteína",
            choices: ["Cecina ahumada", "Chorizo artesanal", "Chicharrón"],
            min: 1,
            max: 1,
          },
        ],
      },
      {
        id: "juanecito",
        name: "Juanecito",
        price: 5,
        tags: ["amazonico"],
      },
      {
        id: "tacacho-chicharron",
        name: "Tacacho con chicharrón",
        price: 16,
        tags: ["amazonico"],
      },
      {
        id: "tacacho-cecina",
        name: "Tacacho con cecina",
        price: 14,
        tags: ["amazonico"],
      },
      {
        id: "tacacho-chorizo",
        name: "Tacacho con chorizo",
        price: 14,
        tags: ["amazonico"],
      },
      {
        id: "tacacho-combinado",
        name: "Tacacho combinado",
        description: "2 presas a elección.",
        price: 18,
        tags: ["amazonico"],
        options: [
          {
            id: "presas",
            label: "Elige 2 presas",
            choices: ["Cecina ahumada", "Chorizo artesanal", "Chicharrón"],
            min: 2,
            max: 2,
          },
        ],
      },
      {
        id: "tacacho-mixto",
        name: "Tacacho mixto",
        description: "3 presas.",
        price: 22,
        tags: ["amazonico"],
        options: [
          {
            id: "presas",
            label: "Elige 3 presas",
            choices: ["Cecina ahumada", "Chorizo artesanal", "Chicharrón"],
            min: 3,
            max: 3,
          },
        ],
      },
    ],
  },

  // ─── SANGUCHES ────────────────────────────────────────────────────────────
  {
    id: "sanguches",
    name: "Sanguches",
    icon: "🥪",
    subtitle: "Sanguches de la carta",
    dishes: [
      {
        id: "sandwiche-filete-pollo",
        name: "Sándwiche de filete de pollo",
        description: "Lechuga, tomate y papas al hilo.",
        price: 10,
      },
      {
        id: "sandwiche-chorizo-artesanal",
        name: "Sándwiche de chorizo artesanal",
        description: "Maduros fritos y sarsa criolla.",
        price: 12,
      },
      {
        id: "sandwiche-cecina",
        name: "Sándwiche de cecina",
        description: "Maduros fritos y sarsa criolla.",
        price: 12,
      },
      {
        id: "sandwiche-chicharron",
        name: "Sándwiche de chicharrón",
        description: "Camotes fritos y sarsa criolla.",
        price: 12,
      },
      {
        id: "sandwiche-amazonico-mix",
        name: "Sándwiche amazónico (Mix)",
        description: "Maduros fritos con cecina, chorizo, chicharrón y sarsa criolla.",
        price: 14,
        tags: ["amazonico"],
      },
    ],
  },

  // ─── MAKIS ────────────────────────────────────────────────────────────────
  {
    id: "makis",
    name: "Makis",
    icon: "🍣",
    subtitle: "Clásicos, fritos y porción personal",
    dishes: [
      {
        id: "acevichado-del-tunche",
        name: "Acevichado del Tunche",
        description: "Palta, langostinos al panko y pesca del día, bañados en salsa acevichada de la casa.",
        detail: "Clásico · 10 cortes",
        price: 22,
      },
      {
        id: "furay-salvaje",
        name: "Furay Salvaje",
        description: "Palta, queso crema y trucha salmón, con salsa de tare o maracuyá salvaje.",
        detail: "Clásico · 10 cortes",
        price: 22,
      },
      {
        id: "el-malcriado",
        name: "El Malcriado",
        description: "Pollo crocante, palta y queso crema, en salsa de mango.",
        detail: "Clásico · 10 cortes",
        price: 22,
      },
      {
        id: "juane-travieso",
        name: "Juane Travieso",
        description: "Arroz con mishquina, queso crema, pollo sazonado y palta, con mayonesa de sachaculantro y cocona.",
        detail: "Maki frito · 10 cortes",
        price: 22,
      },
      {
        id: "tunche-loco",
        name: "Tunche Loco",
        description: "Maduros fritos, queso crema, coronada con cecina en salsa spicy.",
        detail: "Clásico · 10 cortes",
        price: 26,
      },
      {
        id: "makibrasa",
        name: "Makibrasa",
        description: "Palta, queso crema, pollo tipo brasa con papas al hilo y salsa de pollería.",
        detail: "Clásico · 10 cortes",
        price: 22,
      },
      {
        id: "el-fritunche",
        name: "El Fritunche",
        description: "Triángulos de makis fritos llenos de palta, queso crema y trucha salmón.",
        detail: "Triangular frito · 4 cortes",
        price: 24,
      },
      {
        id: "shishiburguer",
        name: "Shishiburguer",
        description: "Relleno de palta, queso crema y trucha marinada.",
        detail: "Porción personal",
        price: 20,
      },
    ],
  },

  // ─── 2. POKÉ BOWLS ────────────────────────────────────────────────────────
  {
    id: "poke-bowls",
    name: "Poké Bowls",
    icon: "🥗",
    subtitle: "Frescos, ligeros y armados a tu gusto",
    dishes: [
      {
        id: "poke-bowl",
        name: "Poké Bowl",
        description: "Ármalo a tu gusto.",
        price: 16,
        tags: ["nuevo", "marino"],
        options: [
          {
            id: "base",
            label: "Elige tu base",
            choices: ["Arroz blanco", "Arroz integral", "Quinua"],
            min: 1,
            max: 1,
          },
          {
            id: "toppings",
            label: "Elige tus toppings",
            choices: [
              "Palta",
              "Pepinos",
              "Zanahoria",
              "Beterraga",
              "Col morada",
              "Col natural",
              "Lechuga americana",
              "Camotes cocidos",
              "Jolantao",
              "Chanchita chulpi",
              "Chifles de plátano",
            ],
            min: 4,
            max: 4,
          },
          {
            id: "proteina",
            label: "Elige tu proteína",
            choices: [
              "Pollo al grill",
              "Pollo cocido",
              "Pollo Crispi al panko",
              "Langostinos flameados",
              "Langostinos al panko",
              "Pescado tipo Nikey",
              "Pescado crocante al panko",
            ],
            min: 1,
            max: 1,
          },
        ],
      },
    ],
  },

  // ─── 3. PESCADOS Y MARISCOS ───────────────────────────────────────────────
  {
    id: "pescados-mariscos",
    name: "Pescados y Mariscos",
    icon: "🐟",
    subtitle: "Frescura marina con sazón peruana",
    dishes: [
      {
        id: "leche-de-tigre",
        name: "Leche de tigre carretillero",
        description: "Cremosa, con pescado y chicharrón de pota.",
        price: 20,
        tags: ["marino", "picante"],
      },
      {
        id: "ceviche-barrio",
        name: "Ceviche de barrio",
        description: "Ceviche de pescado acompañado de chicharrón de pota crocante.",
        price: 24,
        tags: ["marino"],
      },
      {
        id: "causa-de-tigre",
        name: "Causa de tigre",
        description: "Causa rellena con leche de tigre y chicharrón de pota.",
        price: 22,
        tags: ["marino"],
      },
      {
        id: "causa-acevichada",
        name: "Causa acevichada",
        description: "Causa rellena de palta, acompañada de ceviche de pescado.",
        price: 24,
        tags: ["marino"],
      },
      {
        id: "causa-langostinos",
        name: "Causa de langostinos",
        description: "Roll de causa con langostinos, salsa golf y palta.",
        price: 25,
        tags: ["marino"],
      },
      {
        id: "arroz-mariscos",
        name: "Arroz con mariscos",
        description: "Arroz cremoso con mixtura marina y zarza criolla.",
        price: 25,
        tags: ["marino"],
      },
      {
        id: "chaufa-mariscos",
        name: "Chaufa de mariscos",
        description: "Arroz frito con mixtura marina y maduros fritos.",
        price: 22,
        tags: ["marino"],
      },
      {
        id: "chaufa-langostinos",
        name: "Chaufa de langostinos",
        description: "Arroz frito con langostinos y maduros fritos.",
        price: 25,
        tags: ["marino"],
      },
      {
        id: "chicharron-pescado",
        name: "Chicharrón de pescado",
        description: "Pesca del día crocante, con yucas fritas, chifles y zarza criolla.",
        price: 25,
        tags: ["marino"],
      },
      {
        id: "jalea-mixta",
        name: "Jalea mixta",
        description: "Pesca del día y mixtura marina crocantes, con yucas fritas, chifles y zarza criolla.",
        price: 30,
        image: "/img/dishes/jalea-mixta.jpg",
        tags: ["marino", "recomendado"],
      },
      {
        id: "chicharron-pota",
        name: "Chicharrón de pota",
        description: "Pota crocante servida con yucas fritas y zarza criolla.",
        price: 15,
        tags: ["marino"],
      },
      {
        id: "duo-marino",
        name: "Dúo marino",
        description: "Elige exactamente 2 alternativas del combo marino.",
        price: 30,
        tags: ["marino"],
        options: [
          {
            id: "opciones",
            label: "Elige 2 alternativas",
            choices: [
              "Chicharrón de pota",
              "Chicharrón de pescado",
              "Chaufa de mariscos",
              "Aeropuerto de mariscos",
              "Arroz con mariscos",
              "Causa rellena",
              "Ceviche clásico",
              "Leche de tigre",
            ],
            min: 2,
            max: 2,
          },
        ],
      },
      {
        id: "trio-marino",
        name: "Trío marino",
        description: "Elige exactamente 3 alternativas del combo marino.",
        price: 40,
        tags: ["marino"],
        options: [
          {
            id: "opciones",
            label: "Elige 3 alternativas",
            choices: [
              "Chicharrón de pota",
              "Chicharrón de pescado",
              "Chaufa de mariscos",
              "Aeropuerto de mariscos",
              "Arroz con mariscos",
              "Causa rellena",
              "Ceviche clásico",
              "Leche de tigre",
            ],
            min: 3,
            max: 3,
          },
        ],
      },
    ],
  },

  // ─── 4. DE LA CASA ────────────────────────────────────────────────────────
  {
    id: "de-la-casa",
    name: "De la Casa",
    icon: "🌿",
    subtitle: "Los sabores que cuentan nuestra historia",
    dishes: [
      {
        id: "chaufa-del-tunche",
        name: "Chaufa del Tunche",
        description: "Arroz frito con cecina ahumada, chorizo artesanal, langostinos y toque de mishquina.",
        price: 25,
        image: "/img/dishes/chaufa-del-tunche.jpg",
        tags: ["recomendado", "amazonico"],
      },
      {
        id: "fetuccini-del-tunche",
        name: "Fetuccini del Tunche",
        description: "Cecina ahumada, chorizo artesanal y langostinos en salsa de la casa.",
        price: 25,
        tags: ["amazonico"],
      },
      {
        id: "saltado-del-tunche",
        name: "Saltado del Tunche",
        description: "Cecina ahumada y langostinos flameados, acompañados de yucas fritas y patacones.",
        price: 25,
        tags: ["amazonico", "marino"],
      },
      {
        id: "saltado-amazonico",
        name: "Saltado amazónico",
        description: "Cecina ahumada y chorizo regional flameados al wok, acompañados de patacones y yucas fritas.",
        price: 25,
        image: "/img/dishes/saltado-amazonico.jpg",
        tags: ["recomendado", "amazonico"],
      },
      {
        id: "ceviche-del-tunche",
        name: "Ceviche del Tunche",
        description: "Pesca local con limón mandarina y leche de tigre amazónica, acompañada de yucas fritas y trozos de chicharrón de pescado.",
        price: 30,
        image: "/img/dishes/ceviche-del-tunche.jpg",
        tags: ["recomendado", "marino", "amazonico"],
      },
      {
        id: "costillas-bbq",
        name: "Costillas BBQ",
        description: "Costillas ahumadas en salsa BBQ, acompañadas de papas nativas.",
        price: 28,
      },
      {
        id: "costillas-maracuya",
        name: "Costillas en miel de maracuyá",
        description: "Costillas ahumadas en salsa de miel de maracuyá, acompañadas de papas nativas.",
        price: 28,
        image: "/img/dishes/costillas-maracuya.jpg",
        tags: ["recomendado"],
      },
    ],
  },

  // ─── 5. SALTEADOS AL WOK ──────────────────────────────────────────────────
  {
    id: "salteados-wok",
    name: "Salteados al Wok",
    icon: "🔥",
    subtitle: "Fuego alto, aroma intenso y mucho sabor",
    dishes: [
      {
        id: "lomo-saltado",
        name: "Lomo saltado",
        description: "200 gramos de lomo fino.",
        price: 35,
      },
      {
        id: "tallarines-saltados-lomo-fino",
        name: "Tallarines saltados de lomo fino",
        description: "Lomo fino flameado al wok con verduras crujientes y tallarines.",
        price: 35,
      },
      {
        id: "tallarines-saltados-pollo",
        name: "Tallarines saltados de pollo",
        description: "Pechuga de pollo flameada al wok con verduras y tallarines.",
        price: 22,
      },
      {
        id: "saltado-pollo",
        name: "Saltado de pollo",
        description: "Trozos de pechuga salteados con cebolla, tomate y ají, servidos con papas y arroz.",
        price: 22,
      },
      {
        id: "chaufa-pollo",
        name: "Chaufa de pollo",
        description: "Arroz frito al wok con pollo, cebollita china y huevo.",
        price: 17,
      },
      {
        id: "chaufa-amazonico",
        name: "Chaufa amazónico",
        description: "Cecina ahumada, chorizo artesanal y chicharrón.",
        price: 22,
        tags: ["amazonico"],
      },
      {
        id: "chaufa-cecina",
        name: "Chaufa de cecina",
        description: "Arroz frito al wok con cecina ahumada de la selva.",
        price: 20,
        tags: ["amazonico"],
      },
      {
        id: "chaufa-chancho",
        name: "Chaufa de chancho",
        description: "Arroz frito al wok con chancho asado y sazón oriental.",
        price: 20,
      },
      {
        id: "chaufa-mar-selva",
        name: "Chaufa mar y selva",
        description: "Mixtura marina y cecina ahumada salteadas al wok con arroz frito.",
        price: 25,
        tags: ["marino", "amazonico"],
      },
    ],
  },

  // ─── 6. PASTAS Y AL GRILL ─────────────────────────────────────────────────
  {
    id: "pastas-grill",
    name: "Pastas y al Grill",
    icon: "🍝",
    subtitle: "Pastas cremosas y carnes a la parrilla",
    dishes: [
      {
        id: "fetuccini-alfredo-clasico",
        name: "Fetuccini Alfredo clásico",
        description: "Fetuccini al dente en cremosa salsa Alfredo tradicional.",
        price: 20,
      },
      {
        id: "fetuccini-alfredo-pechuga",
        name: "Fetuccini Alfredo con pechuga al grill",
        description: "Fetuccini en salsa Alfredo acompañado de jugosa pechuga al grill.",
        price: 25,
      },
      {
        id: "fetuccini-alfredo-brochetas",
        name: "Fetuccini Alfredo con brochetas de pollo",
        description: "Fetuccini en salsa Alfredo con brochetas de pollo marinado.",
        price: 25,
      },
      {
        id: "fetuccini-alfredo-lomo",
        name: "Fetuccini Alfredo con lomo fino al grill",
        description: "Fetuccini en salsa Alfredo con corte selecto de lomo fino al grill.",
        price: 37,
      },
      {
        id: "fetuccini-huancaina-pechuga",
        name: "Fetuccini a la huancaína con pechuga al grill",
        description: "Fetuccini en salsa huancaína cremosa con pechuga de pollo al grill.",
        price: 25,
      },
      {
        id: "fetuccini-huancaina-brochetas",
        name: "Fetuccini a la huancaína con brochetas de pollo",
        description: "Fetuccini en salsa huancaína cremosa con brochetas de pollo a la plancha.",
        price: 26,
      },
      {
        id: "fetuccini-huancaina-lomo",
        name: "Fetuccini a la huancaína con lomo fino al grill",
        description: "Fetuccini en salsa huancaína cremosa acompañado de lomo fino al grill.",
        price: 37,
      },
      {
        id: "fetuccini-huancaina-lomo-saltado",
        name: "Fetuccini a la huancaína con lomo saltado",
        description: "Fetuccini en salsa huancaína con jugoso lomo fino flameado al wok.",
        price: 37,
      },
      {
        id: "pechuga-grill",
        name: "Pechuga al grill",
        description: "Jugosa pechuga de pollo a la plancha, sazonada con hierbas frescas.",
        price: 22,
      },
      {
        id: "lomo-grill",
        name: "Lomo fino al grill",
        description: "Corte de lomo fino sellado a la plancha, jugoso y sazonado al punto.",
        price: 35,
      },
      {
        id: "brochetas-pollo",
        name: "Brochetas de pollo",
        description: "Brochetas de pollo marinado a las brasas, doradas y jugosas.",
        price: 24,
      },
    ],
  },

  // ─── 7. ALITAS ────────────────────────────────────────────────────────────
  {
    id: "alitas",
    name: "Alitas",
    icon: "🍗",
    subtitle: "Crocantes alitas con tus salsas favoritas",
    dishes: [
      {
        id: "alitas-personal",
        name: "Alitas personal",
        description: "6 unidades con un solo sabor a elegir.",
        price: 20,
        options: [
          {
            id: "sabor",
            label: "Elige 1 sabor",
            choices: [
              "Lemon Nikkei",
              "Acevichadas",
              "BBQ",
              "Maracuyá",
              "Mango Hot",
              "Crispi",
              "Anticucheras",
            ],
            min: 1,
            max: 1,
          },
        ],
      },
      {
        id: "alitas-para-picar",
        name: "Alitas para picar",
        description: "12 unidades con hasta tres sabores a elegir.",
        price: 35,
        tags: ["recomendado"],
        options: [
          {
            id: "sabores",
            label: "Elige hasta 3 sabores",
            choices: [
              "Lemon Nikkei",
              "Acevichadas",
              "BBQ",
              "Maracuyá",
              "Mango Hot",
              "Crispi",
              "Anticucheras",
            ],
            min: 1,
            max: 3,
          },
        ],
      },
    ],
  },

  // ─── 8. HAMBURGUESAS ──────────────────────────────────────────────────────
  {
    id: "hamburguesas",
    name: "Hamburguesas",
    icon: "🍔",
    subtitle: "En pan artesanal, preparadas al momento",
    dishes: [
      {
        id: "hamburguesa-clasica",
        name: "Clásica",
        description: "Hamburguesa artesanal clásica en pan artesanal con vegetales frescos y salsas.",
        price: 16,
      },
      {
        id: "hamburguesa-doble",
        name: "Doble",
        description: "Doble carne artesanal con queso derretido en pan artesanal.",
        price: 27,
      },
      {
        id: "hamburguesa-palteada",
        name: "Palteada",
        description: "Hamburguesa artesanal con láminas de palta fresca.",
        price: 17,
      },
      {
        id: "hamburguesa-hawaiana",
        name: "Hawaiana",
        description: "Hamburguesa artesanal con piña caramelizada al grill y queso derretido.",
        price: 18,
      },
      {
        id: "hamburguesa-a-lo-pobre",
        name: "A lo pobre",
        description: "Hamburguesa artesanal con plátano maduro frito y huevo montado.",
        price: 18,
      },
      {
        id: "hamburguesa-crispi",
        name: "Crispi",
        description: "Pollo crocante extra crujiente con lechuga fresca y salsas.",
        price: 15,
      },
    ],
  },

  // ─── 9. SALCHIPAPAS ───────────────────────────────────────────────────────
  {
    id: "salchipapas",
    name: "Salchipapas",
    icon: "🍟",
    subtitle: "Papas nativas doradas con la combinación que más te provoque",
    dishes: [
      {
        id: "salchipapa-clasica",
        name: "Clásica",
        description: "Salchichas arrebozadas con huevo, servidas con papas nativas.",
        price: 16,
      },
      {
        id: "salchipapa-parrillera",
        name: "Parrillera",
        description: "Chorizo arrebozado con huevos, servido con papas nativas y trozos de pollo al grill.",
        price: 18,
      },
      {
        id: "salchipapa-amazonica",
        name: "Amazónica",
        description: "Cecina ahumada y chorizo artesanal arrebozados, servidos con papas nativas.",
        price: 20,
        tags: ["amazonico"],
      },
      {
        id: "salchipapa-crispi",
        name: "Crispi Chicken",
        description: "Salchichas arrebozadas con huevo y pollo crocante.",
        price: 18,
      },
    ],
  },

  // ─── 10. JUGOS ────────────────────────────────────────────────────────────
  {
    id: "jugos",
    name: "Jugos",
    icon: "🥤",
    subtitle: "Todos de ½ litro",
    dishes: [
      {
        id: "jugo-papaya",
        name: "Papaya",
        price: 7,
      },
      {
        id: "jugo-pina",
        name: "Piña",
        price: 7,
      },
      {
        id: "jugo-tunas",
        name: "Tunas",
        price: 8,
      },
      {
        id: "jugo-surtido",
        name: "Surtido",
        price: 8,
      },
      {
        id: "jugo-naranja",
        name: "Naranja",
        price: 10,
      },
      {
        id: "jugo-especial",
        name: "Especial",
        price: 12,
      },
      {
        id: "jugo-fresa-leche",
        name: "Fresa con leche",
        price: 12,
      },
      {
        id: "jugo-mango-leche",
        name: "Mango con leche",
        price: 12,
      },
      {
        id: "jugo-guanabana-leche",
        name: "Guanábana con leche",
        price: 12,
      },
      {
        id: "jugo-lucuma-leche",
        name: "Lúcuma con leche",
        price: 12,
      },
      {
        id: "jugo-platano-leche",
        name: "Plátano con leche",
        price: 12,
      },
      {
        id: "jugo-mix-al-gusto",
        name: "Jugos mix",
        description: "Combínalo a tu gusto.",
        price: 14,
      },
    ],
  },

  // ─── 11. BEBIDAS ──────────────────────────────────────────────────────────
  {
    id: "bebidas",
    name: "Bebidas",
    icon: "🍹",
    subtitle: "Refrescos tradicionales y bebidas personales",
    dishes: [
      {
        id: "chicha-morada-1-litro",
        name: "Chicha morada — 1 litro",
        description: "Jarra de chicha morada tradicional preparada en casa (1 litro).",
        price: 16,
      },
      {
        id: "chicha-morada-medio-litro",
        name: "Chicha morada — ½ litro",
        description: "Media jarra de chicha morada tradicional preparada en casa (½ litro).",
        price: 8,
      },
      {
        id: "chicha-morada-vaso",
        name: "Chicha morada — 1 vaso",
        description: "Vaso de chicha morada tradicional preparada en casa.",
        price: 5,
      },
      {
        id: "cocona-1-litro",
        name: "Cocona — 1 litro",
        description: "Jarra de refresco natural de cocona de la selva (1 litro).",
        price: 16,
        tags: ["amazonico"],
      },
      {
        id: "cocona-medio-litro",
        name: "Cocona — ½ litro",
        description: "Media jarra de refresco natural de cocona de la selva (½ litro).",
        price: 8,
        tags: ["amazonico"],
      },
      {
        id: "cocona-vaso",
        name: "Cocona — 1 vaso",
        description: "Vaso de refresco natural de cocona.",
        price: 5,
        tags: ["amazonico"],
      },
      {
        id: "camu-camu-1-litro",
        name: "Camu Camu — 1 litro",
        description: "Jarra de refresco natural de camu camu amazónico (1 litro).",
        price: 16,
        tags: ["amazonico"],
      },
      {
        id: "camu-camu-medio-litro",
        name: "Camu Camu — ½ litro",
        description: "Media jarra de refresco natural de camu camu amazónico (½ litro).",
        price: 8,
        tags: ["amazonico"],
      },
      {
        id: "camu-camu-vaso",
        name: "Camu Camu — 1 vaso",
        description: "Vaso de refresco natural de camu camu.",
        price: 5,
        tags: ["amazonico"],
      },
      {
        id: "coca-cola-personal",
        name: "Coca-Cola personal",
        description: "Botella personal.",
        price: 5,
      },
      {
        id: "inca-kola-personal",
        name: "Inca Kola personal",
        description: "Botella personal.",
        price: 5,
      },
      {
        id: "agua-mineral",
        name: "Agua mineral",
        description: "Botella personal.",
        price: 4,
      },
    ],
  },

  // ─── 12. FROZEN ───────────────────────────────────────────────────────────
  {
    id: "frozen",
    name: "Frozen",
    icon: "🍧",
    subtitle: "Refrescos frozen granizados al momento",
    dishes: [
      {
        id: "limonada-frozen-1-litro",
        name: "Limonada Frozen — 1 litro",
        description: "Limonada frozen granizada al punto (1 litro).",
        price: 17,
      },
      {
        id: "limonada-frozen-medio-litro",
        name: "Limonada Frozen — ½ litro",
        description: "Limonada frozen granizada al punto (½ litro).",
        price: 9,
      },
      {
        id: "maracuya-frozen-1-litro",
        name: "Maracuyá Frozen — 1 litro",
        description: "Maracuyá frozen granizado al punto (1 litro).",
        price: 18,
      },
      {
        id: "maracuya-frozen-medio-litro",
        name: "Maracuyá Frozen — ½ litro",
        description: "Maracuyá frozen granizado al punto (½ litro).",
        price: 9,
      },
      {
        id: "mango-frozen-1-litro",
        name: "Mango Frozen — 1 litro",
        description: "Mango frozen granizado al punto (1 litro).",
        price: 18,
      },
      {
        id: "mango-frozen-medio-litro",
        name: "Mango Frozen — ½ litro",
        description: "Mango frozen granizado al punto (½ litro).",
        price: 9,
      },
      {
        id: "fresa-frozen-1-litro",
        name: "Fresa Frozen — 1 litro",
        description: "Fresa frozen granizada al punto (1 litro).",
        price: 18,
      },
      {
        id: "fresa-frozen-medio-litro",
        name: "Fresa Frozen — ½ litro",
        description: "Fresa frozen granizada al punto (½ litro).",
        price: 9,
      },
      {
        id: "maracumango-frozen-1-litro",
        name: "Maracumango Frozen — 1 litro",
        description: "Maracuyá y mango frozen granizado (1 litro).",
        price: 18,
      },
      {
        id: "maracumango-frozen-medio-litro",
        name: "Maracumango Frozen — ½ litro",
        description: "Maracuyá y mango frozen granizado (½ litro).",
        price: 9,
      },
    ],
  },

  // ─── 13. FRESH TEA ────────────────────────────────────────────────────────
  {
    id: "fresh-tea",
    name: "Fresh Tea",
    icon: "🍃",
    subtitle: "Tés fríos e infusiones refrescantes",
    dishes: [
      {
        id: "fresh-tea-negro-clasico",
        name: "Negro Clásico",
        description: "Té negro frío tradicional.",
        price: 8,
      },
      {
        id: "fresh-tea-pina-jengibre",
        name: "Piña y Jengibre",
        description: "Té frío con infusión de piña y jengibre.",
        price: 9,
      },
      {
        id: "fresh-tea-maracuya",
        name: "Maracuyá",
        description: "Té frío con pulpa natural de maracuyá.",
        price: 9,
      },
      {
        id: "fresh-tea-fresa",
        name: "Fresa",
        description: "Té frío con esencia y trozos de fresa.",
        price: 10,
      },
      {
        id: "fresh-tea-limon-miel",
        name: "Limón y Miel",
        description: "Té frío con jugo de limón y miel de abeja.",
        price: 10,
      },
      {
        id: "fresh-tea-menta-jengibre",
        name: "Menta y Jengibre",
        description: "Té frío con hojas de menta y jengibre fresco.",
        price: 10,
      },
      {
        id: "fresh-tea-mango",
        name: "Mango",
        description: "Té frío con pulpa natural de mango.",
        price: 10,
      },
    ],
  },

  // ─── 14. FRAPPÉS ──────────────────────────────────────────────────────────
  {
    id: "frappes",
    name: "Frappés",
    icon: "☕",
    subtitle: "Frappés cremosos y batidos especiales",
    dishes: [
      {
        id: "frappe-clasico",
        name: "Frappé clásico",
        description: "Frappé cremoso tradicional batido con hielo.",
        price: 13,
      },
      {
        id: "frappe-pina",
        name: "Frappé de Piña",
        description: "Frappé refrescante de piña natural.",
        price: 13,
      },
      {
        id: "frappe-fresa",
        name: "Frappé de Fresa",
        description: "Frappé cremoso batido con fresas selectas.",
        price: 13,
      },
      {
        id: "frappe-mango",
        name: "Frappé de Mango",
        description: "Frappé cremoso con pulpa de mango.",
        price: 14,
      },
      {
        id: "frappe-oreo",
        name: "Frappé Oreo",
        description: "Frappé cremoso con galletas Oreo y toque dulce.",
        price: 15,
      },
      {
        id: "frappe-lucuma",
        name: "Frappé de Lúcuma",
        description: "Frappé cremoso con pulpa de lúcuma.",
        price: 15,
      },
      {
        id: "frappe-protein-fit",
        name: "Frappé Protein-Fit",
        description: "Frappé Protein-Fit.",
        price: 16,
      },
    ],
  },
];
