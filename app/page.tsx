"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { menu, Dish, Category } from "@/data/menu";
import { config } from "@/data/config";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import CategorySheet from "@/components/CategorySheet";
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
  const [isCategoryPanelOpen, setIsCategoryPanelOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const getStickyOffset = useCallback(() => {
    const headerHeight = document.getElementById("site-header")?.offsetHeight ?? 62;
    const navHeight = document.getElementById("category-nav")?.offsetHeight ?? 54;
    return headerHeight + navHeight + 8;
  }, []);

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

  const visibleCategory = useMemo(
    () => menu.find((category) => category.id === activeCategory) ?? menu[0],
    [activeCategory]
  );

  const scrollCatalogIntoView = useCallback(() => {
    const panel = document.getElementById("catalog-panel");
    if (!panel) return;

    const offset = getStickyOffset();
    const panelRect = panel.getBoundingClientRect();
    const targetTop = panelRect.top + window.scrollY - offset;
    const isBelowCatalogStart = window.scrollY > targetTop + 24;
    const isCatalogBelowViewport = panelRect.top > window.innerHeight * 0.7;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isBelowCatalogStart || isCatalogBelowViewport) {
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    }
  }, [getStickyOffset]);

  const selectCategory = useCallback(
    (id: string) => {
      if (!menu.some((category) => category.id === id)) return;

      setActiveCategory(id);
      setIsCategoryPanelOpen(false);
      window.history.replaceState(null, "", `#section-${id}`);
      window.requestAnimationFrame(scrollCatalogIntoView);
    },
    [scrollCatalogIntoView]
  );

  const exploreCategories = useCallback(() => {
    setIsCategoryPanelOpen(true);
  }, []);

  // Keep category hashes useful when URL has hash
  useEffect(() => {
    const applyCategoryHash = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const categoryId = hash.startsWith("section-") ? hash.slice(8) : hash;

      if (menu.some((category) => category.id === categoryId)) {
        setActiveCategory(categoryId);
      }
    };

    applyCategoryHash();
    window.addEventListener("hashchange", applyCategoryHash);
    return () => {
      window.removeEventListener("hashchange", applyCategoryHash);
    };
  }, []);

  const handleDishClick = (dish: Dish, categoryId?: string) => {
    setSelectedDish(dish);
    setSelectedCategoryId(categoryId);
  };

  const isModalOpen = Boolean(selectedDish || isCategoryPanelOpen);

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
                const cat = menu.find((c) => c.dishes.some((d) => d.id === dish.id));
                handleDishClick(dish, cat?.id);
              }}
            />
          )}

          {/* Category nav — sticky under header */}
          <CategoryNav
            categories={menu}
            activeCategory={activeCategory}
            onCategoryClick={selectCategory}
            isPanelOpen={isCategoryPanelOpen}
            onPanelOpenChange={setIsCategoryPanelOpen}
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

          <div
            id="catalog-panel"
            role={searchQuery ? undefined : "tabpanel"}
            aria-labelledby={searchQuery ? undefined : `tab-${activeCategory}`}
            tabIndex={searchQuery ? undefined : 0}
          >
            {(searchQuery ? filteredMenu : visibleCategory ? [visibleCategory] : []).map(
              (category) => (
                <MenuSection
                  key={category.id}
                  category={category}
                  onDishClick={(dish) => handleDishClick(dish, category.id)}
                  categoryPosition={menu.findIndex((item) => item.id === category.id) + 1}
                  totalCategories={menu.length}
                  onExploreCategories={searchQuery ? undefined : exploreCategories}
                />
              )
            )}
          </div>

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

          {/* Club del Tunche — Fidelización, promociones, cupones y especiales */}
          {!searchQuery && (
            <ClubSection onOpenMenu={() => selectCategory(menu[0]?.id ?? "")} />
          )}

          {/* Map section */}
          {!searchQuery && <MapSection />}

          {/* Share block — between map and footer */}
          {!searchQuery && <ShareBlock />}
        </main>

        {/* Footer */}
        {!searchQuery && <Footer />}

        {/* Floating cart button — hidden when any modal or sheet is open */}
        <CartButton isHidden={isModalOpen} />

        {/* Toast */}
        <Toast />
      </div>

      {/* Category selector bottom sheet / modal */}
      <CategorySheet
        isOpen={isCategoryPanelOpen}
        categories={menu}
        activeCategoryId={activeCategory}
        onSelectCategory={selectCategory}
        onClose={() => setIsCategoryPanelOpen(false)}
      />

      {/* Bottom sheets (outside app-container for proper z-index and fixed positioning) */}
      <DishSheet
        key={selectedDish?.id ?? "closed-dish"}
        dish={selectedDish}
        categoryId={selectedCategoryId}
        onClose={() => {
          setSelectedDish(null);
          setSelectedCategoryId(undefined);
        }}
      />
      <CartSheet />
    </>
  );
}
