# EDF — Landing page « Chèque énergie »

Landing page Next.js (App Router) pour la campagne chèque énergie : écran de
chargement animé, navigation collante, hero, parcours en 3 étapes, grille
d’avantages, FAQ accordéon et scroll inertiel.

## Stack

| Rôle | Choix |
| --- | --- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Styles | Tailwind CSS v4 (tokens dans `src/app/globals.css`) |
| Primitives UI | shadcn/ui — `Button`, `Accordion` (Radix) |
| Animations | Framer Motion |
| Scroll | Lenis (`lenis/react`) |
| Icônes | Lucide React |

## Démarrer

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # build de production
npm run lint
```

## Structure

```
src/
  app/
    layout.tsx              Polices, métadonnées, Lenis + splash
    page.tsx                Assemblage des sections
    globals.css             Tokens de thème (couleurs, rayons, ombres)
  components/
    smooth-scroll.tsx       Provider Lenis (désactivé si « reduced motion »)
    splash-screen.tsx       Préloader + contexte « page prête »
    reveal.tsx              Apparition au scroll (translate + fade)
    site-header.tsx         En-tête collant, backdrop-blur au scroll
    cta-button.tsx          CTA avec lift au survol et scale au tap
    logo.tsx                Logo EDF
    energy-check-visual.tsx Visuel composé d’icônes Lucide (pas de bitmap)
    ui/                     Primitives shadcn/ui
    sections/               Hero, étapes, avantages, bandeau, FAQ, CTA, footer
public/
  brand/                    Logo EDF et photographies
```

## Assets

`public/brand/` contient les fichiers fournis dans la branche `main` :

- `edf-logo.webp` — logo officiel (fond transparent)
- `ville-durable.png` — photographie du hero
- `aix-les-bains.jpg` — panorama utilisé en bandeau pleine largeur

Pour remplacer une photographie, déposer le fichier dans `public/brand/` et
mettre à jour le `src` correspondant (`sections/hero.tsx`). Les visuels non
photographiques sont construits à partir d’icônes Lucide, pas d’images.

## Accessibilité et motion

`prefers-reduced-motion` est respecté partout : Lenis repasse en scroll natif,
les apparitions au scroll sont désactivées et les variantes d’animation du hero
se réduisent à leur état final.

## Contenu

Les montants affichés sont des maximums indicatifs. Les liens légaux du pied de
page (`Mentions légales`, `Données personnelles`, `Cookies`) sont des
placeholders à brancher.
