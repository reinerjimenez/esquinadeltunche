# Graph Report - tunche-app  (2026-11-02)

## Corpus Check
- 39 files · ~27,303 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: .csv 24, (none) 1, .css 1)

## Summary
- 389 nodes · 620 edges · 29 communities (24 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5bd25dd1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- page.tsx
- package.json
- ui-ux-pro-max
- cart.tsx
- LA ESQUINA DEL TUNCHE
- DesignSystemGenerator
- compilerOptions
- patch-readlink.cjs
- design_system.py
- Footer.tsx
- manifest.json
- _search_csv
- search.py
- Design Engineering
- core.py
- Component Building Principles
- generate_design_system
- useBottomSheetViewport.ts
- The Animation Decision Framework
- clip-path for Animation
- Performance Rules
- Gesture and Drag Interactions
- CSS Transform Mastery
- The Sonner Principles (Building Loved Components)
- Spring Animations
- Core Philosophy
- Debugging Animations
- AGENTS.md
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `useCart()` - 17 edges
2. `compilerOptions` - 16 edges
3. `Design Engineering` - 16 edges
4. `HomePage()` - 15 edges
5. `react` - 15 edges
6. `formatPrice()` - 14 edges
7. `lucide-react` - 13 edges
8. `LA ESQUINA DEL TUNCHE` - 12 edges
9. `DesignSystemGenerator` - 11 edges
10. `CartSheet()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Imágenes` --references--> `DishImage()`  [INFERRED]
  README.md → components/DishImage.tsx
- `RootLayout()` --calls--> `CartProvider()`  [EXTRACTED]
  app/layout.tsx → lib/cart.tsx
- `HomePage()` --calls--> `Footer()`  [EXTRACTED]
  app/page.tsx → components/Footer.tsx
- `CartSheet()` --calls--> `useBottomSheetViewport()`  [EXTRACTED]
  components/CartSheet.tsx → lib/useBottomSheetViewport.ts
- `CartSheet()` --calls--> `buildWhatsAppMessage()`  [EXTRACTED]
  components/CartSheet.tsx → lib/whatsapp.ts

## Import Cycles
- None detected.

## Communities (29 total, 5 thin omitted)

### Community 0 - "page.tsx"
Cohesion: 0.08
Nodes (51): dishesById, featuredDishes, HomePage(), normalize(), searchableDishFields, CartButton(), CartSheet(), CategoryNav() (+43 more)

### Community 1 - "package.json"
Cohesion: 0.08
Nodes (30): eslintConfig, devDependencies, cross-env@^10.1.0, eslint@^9, eslint-config-next@16.4.0, tailwindcss@^4, @tailwindcss/postcss@^4.3.3, @tailwindcss/turbopack@^4 (+22 more)

### Community 2 - "ui-ux-pro-max"
Cohesion: 0.07
Nodes (29): Accessibility, Available Domains, Available Stacks, Common Rules for Professional UI, Example Workflow, How to Use This Skill, Icons & Visual Elements, Interaction (+21 more)

### Community 3 - "cart.tsx"
Cohesion: 0.11
Nodes (21): cinzel, dmSans, metadata, RootLayout(), viewport, CartButtonProps, CartAction, CartContext (+13 more)

### Community 4 - "LA ESQUINA DEL TUNCHE"
Cohesion: 0.09
Nodes (22): ◇ Arquitectura, Autoría, ◎ Calidad y rendimiento, Carta digital · Sabores de la selva y del mar, Comandos disponibles, ▲ Despliegue, ⚡ Experiencia, Flujo del pedido (+14 more)

### Community 5 - "DesignSystemGenerator"
Cohesion: 0.13
Nodes (3): detect_domain(), search(), DesignSystemGenerator

### Community 6 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 7 - "patch-readlink.cjs"
Cohesion: 0.15
Nodes (11): fs, fsp, _origReadlink, _origReadlinkSync, ARTIFACTS_DIR, runQA(), evaluate(), sendCommand() (+3 more)

### Community 8 - "design_system.py"
Cohesion: 0.19
Nodes (5): _detect_page_type(), format_master_md(), format_page_override_md(), _generate_intelligent_overrides(), persist_design_system()

### Community 9 - "Footer.tsx"
Cohesion: 0.18
Nodes (12): FacebookIcon(), Footer(), InstagramIcon(), TikTokIcon(), nextConfig, dependencies, lucide-react@^1.56.0, next@16.4.0 (+4 more)

### Community 10 - "manifest.json"
Cohesion: 0.17
Nodes (11): background_color, categories, description, display, icons, lang, name, orientation (+3 more)

### Community 13 - "Design Engineering"
Cohesion: 0.22
Nodes (8): Accessibility, Design Engineering, Initial Response, prefers-reduced-motion, Review Checklist, Review Format (Required), Stagger Animations, Touch device hover states

### Community 15 - "Component Building Principles"
Cohesion: 0.25
Nodes (8): Animate enter states with @starting-style, Buttons must feel responsive, Component Building Principles, Make popovers origin-aware, Never animate from scale(0), Tooltips: skip delay on subsequent hovers, Use blur to mask imperfect transitions, Use CSS transitions over keyframes for interruptible UI

### Community 16 - "generate_design_system"
Cohesion: 0.29
Nodes (3): format_ascii_box(), format_markdown(), generate_design_system()

### Community 17 - "useBottomSheetViewport.ts"
Cohesion: 0.43
Nodes (6): BottomSheetViewportMetrics, DEFAULT_METRICS, getServerSnapshot(), getSnapshot(), subscribe(), useBottomSheetViewport()

### Community 18 - "The Animation Decision Framework"
Cohesion: 0.33
Nodes (6): 1. Should this animate at all?, 2. What is the purpose?, 3. What easing should it use?, 4. How fast should it be?, Perceived performance, The Animation Decision Framework

### Community 19 - "clip-path for Animation"
Cohesion: 0.33
Nodes (6): clip-path for Animation, Comparison sliders, Hold-to-delete pattern, Image reveals on scroll, Tabs with perfect color transitions, The inset shape

### Community 20 - "Performance Rules"
Cohesion: 0.33
Nodes (6): CSS animations beat JS under load, CSS variables are inheritable, Framer Motion hardware acceleration caveat, Only animate transform and opacity, Performance Rules, Use WAAPI for programmatic CSS animations

### Community 21 - "Gesture and Drag Interactions"
Cohesion: 0.33
Nodes (6): Damping at boundaries, Friction instead of hard stops, Gesture and Drag Interactions, Momentum-based dismissal, Multi-touch protection, Pointer capture for drag

### Community 22 - "CSS Transform Mastery"
Cohesion: 0.40
Nodes (5): 3D transforms for depth, CSS Transform Mastery, scale() scales children too, transform-origin, translateY with percentages

### Community 23 - "The Sonner Principles (Building Loved Components)"
Cohesion: 0.40
Nodes (5): Asymmetric enter/exit timing, Cohesion matters, Review your work the next day, The opacity + height combination, The Sonner Principles (Building Loved Components)

### Community 24 - "Spring Animations"
Cohesion: 0.40
Nodes (5): Interruptibility advantage, Spring Animations, Spring-based mouse interactions, Spring configuration, When to use springs

### Community 25 - "Core Philosophy"
Cohesion: 0.50
Nodes (4): Beauty is leverage, Core Philosophy, Taste is trained, not innate, Unseen details compound

### Community 26 - "Debugging Animations"
Cohesion: 0.50
Nodes (4): Debugging Animations, Frame-by-frame inspection, Slow motion testing, Test on real devices

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `DishImage()` connect `page.tsx` to `LA ESQUINA DEL TUNCHE`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Should `page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08056265984654731 - nodes in this community are weakly interconnected._
- **Why does `Imágenes` connect `LA ESQUINA DEL TUNCHE` to `page.tsx`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0846774193548387 - nodes in this community are weakly interconnected._
- **Why does `react` connect `page.tsx` to `useBottomSheetViewport.ts`, `cart.tsx`, `package.json`, `Footer.tsx`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `ui-ux-pro-max` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `cart.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11076923076923077 - nodes in this community are weakly interconnected._