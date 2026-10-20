"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { menu, Dish, Category } from "@/data/menu";
import { config } from "@/data/config";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import FeaturedCarousel from "@/components/FeaturedCarousel";
import MenuSection from "@/components/MenuSection";
import DishSheet from "@/components/DishSheet";
import CartButton from "@/components/CartButton";
import CartSheet from "@/components/CartSheet";
import ClubSection from "@/components/ClubSection";
import MapSection from "@/components/MapSection";
import ShareBlock from "@/components/ShareBlock";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

// Normalize string: remove accents, lowercase — for search without accent distinction
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const dishesById = new Map(
  menu.flatMap((category) => category.dishes.map((dish) => [dish.id, dish] as const))
);

const featuredDishes: Dish[] = config.featured.flatMap((id) => {
  const dish = dishesById.get(id);
  return dish ? [dish] : [];
});

const searchableDishFields = new Map(
  menu.flatMap((category) =>
    category.dishes.map((dish) => [
      dish.id,
      [
        normalize(dish.name),
        ...(dish.description ? [normalize(dish.description)] : []),
        ...(dish.detail ? [normalize(dish.detail)] : []),
        ...(dish.variants?.map((variant) => normalize(variant.name)) ?? []),
      ],
    ] as const)
  )
);

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(menu[0]?.id ?? "");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const isScrollingRef = useRef(false);

  // Filter menu for search
  const filteredMenu: Category[] = useMemo(() => {
    if (!searchQuery) return menu;

    const query = normalize(searchQuery);
    return menu
      .map((category) => ({
        ...category,
        dishes: category.dishes.filter((dish) =>
          searchableDishFields.get(dish.id)?.some((field) => field.includes(query))
        ),
      }))
      .filter((category) => category.dishes.length > 0);
  }, [searchQuery]);

  // Scroll to category section
  const scrollToCategory = useCallback((id: string) => {
    const el = sectionRefs.current.get(id);
    if (!el) return;
    isScrollingRef.current = true;
    setActiveCategory(id);
    // Offset for header (65px) + category nav (~60px)
    const offset = 130;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setTimeout(() => { isScrollingRef.current = false; }, 800);
  }, []);

  // Scroll-spy: detect which section is in view
  useEffect(() => {
    if (searchQuery) return; // don't spy during search

    let animationFrame: number | null = null;

    const updateActiveCategory = () => {
      animationFrame = null;
      if (!isScrollingRef.current) {
        const offset = 140;
        let currentId = menu[0]?.id ?? "";

        for (const [id, el] of sectionRefs.current) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= offset) {
            currentId = id;
          }
        }

        setActiveCategory((previousId) => previousId === currentId ? previousId : currentId);
      }
    };

    const handleScroll = () => {
      if (animationFrame === null) {
        animationFrame = window.requestAnimationFrame(updateActiveCategory);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrame !== null) window.cancelAnimationFrame(animationFrame);
    };
  }, [searchQuery]);

  const handleDishClick = (dish: Dish, categoryId?: string) => {
    setSelectedDish(dish);
    setSelectedCategoryId(categoryId);
  };

  return (
    <>
      <div className="app-container">
        {/* Hero — above the fixed header */}
        <HeroSection />

        {/* Sticky header */}
        <Header searchQuery={searchQuery} onSearch={setSearchQuery} />

        {/* Main content */}
        <main id="menu-section" aria-label="Carta del restaurante">
          {/* Featured carousel — only when not searching */}
          {!searchQuery && featuredDishes.length > 0 && (
            <FeaturedCarousel
              dishes={featuredDishes}
              onDishClick={(dish) => {
                // Find the dish's category
                const cat = menu.find((c) => c.dishes.some((d) => d.id === dish.id));
                handleDishClick(dish, cat?.id);
              }}
            />
          )}

          {/* Category nav — sticky under header */}
          <CategoryNav
            categories={menu}
            activeCategory={activeCategory}
            onCategoryClick={scrollToCategory}
          />

          {/* Search results note */}
          {searchQuery && (
            <div className="px-4 pt-4 pb-1">
              <p className="text-tunche-muted text-sm">
                {filteredMenu.reduce((sum, c) => sum + c.dishes.length, 0) === 0
                  ? `Sin resultados para "${searchQuery}"`
                  : `Resultados para "${searchQuery}"`}
              </p>
            </div>
          )}

          {/* Category sections */}
          {filteredMenu.map((category) => (
            <MenuSection
              key={category.id}
              category={category}
              onDishClick={(dish) => handleDishClick(dish, category.id)}
              sectionRef={(el) => {
                if (el) sectionRefs.current.set(category.id, el);
                else sectionRefs.current.delete(category.id);
              }}
            />
          ))}

          {/* Empty search state */}
          {searchQuery && filteredMenu.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
              <span className="text-5xl mb-4">🔍</span>
              <p className="text-tunche-cream font-semibold mb-1">Sin resultados</p>
              <p className="text-tunche-muted text-sm">
                No encontramos platos que coincidan con{" "}
                <strong className="text-tunche-cream">&ldquo;{searchQuery}&rdquo;</strong>
              </p>
            </div>
          )}

          {/* Club del Tunche — Fidelización, promociones, cupones y compartir */}
          {!searchQuery && (
            <ClubSection onOpenMenu={() => scrollToCategory(menu[0]?.id ?? "")} />
          )}

          {/* Map section */}
          {!searchQuery && <MapSection />}

          {/* Share block — between map and footer */}
          {!searchQuery && <ShareBlock />}
        </main>

        {/* Footer */}
        {!searchQuery && <Footer />}

        {/* Floating cart button */}
        <CartButton />

        {/* Toast */}
        <Toast />
      </div>

      {/* Bottom sheets (outside app-container for proper positioning) */}
      <DishSheet
        key={selectedDish?.id ?? "closed-dish"}
        dish={selectedDish}
        categoryId={selectedCategoryId}
        onClose={() => { setSelectedDish(null); setSelectedCategoryId(undefined); }}
      />
      <CartSheet />
    </>
  );
}
