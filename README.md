## STILE Frontend Prototype

This Next.js application renders the STILE control center homepage inspired by the provided Figma exploration.  
It uses the App Router, Tailwind CSS v4, and glassmorphism-driven UI primitives to mirror the Apple-like spatial canvas requested for Phase 1.

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Structure

- `src/app/layout.tsx` – Global metadata and font wiring using `next/font`.
- `src/app/globals.css` – Tailwind base plus custom radial/utility declarations for glass layers.
- `src/app/page.tsx` – Sectioned homepage (`Hero`, `FeatureShowcase`, `CaseStudies`, `Insights`, `Cta`) with responsive layout tokens.
- `public/grid.svg` – Subtle grid background overlay referenced by the spatial canvas.

## Design Notes

- Layout follows the Figma reference: glass cards, dynamic island-inspired hub, and hero metrics.
- Tailwind utility scale is extended inline to support large corner radii and gradient overlays.
- Content is stored in local arrays (`features`, `caseStudies`, `metrics`) so copy and visuals can be swapped quickly once final assets are exported from Figma.

## Next Steps

1. Replace placeholder copy/metrics with final messaging from the design team.
2. Export high-fidelity imagery, iconography, and any motion textures from Figma and drop them in `public/`.
3. Wire interactions (scroll-based camera moves, section reveals) using `framer-motion` once timing curves are confirmed.
4. Connect CMS or configuration layer if marketing needs self-serve edits during Phase 2.
