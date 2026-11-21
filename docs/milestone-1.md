# Milestone 1 — layout, navigation and cinematic hero

## Built

- Empty workspace scaffolded into the requested frontend/backend/docs/assets directories.
- Next.js App Router, TypeScript, Tailwind CSS, GSAP + ScrollTrigger and Lucide installed.
- Locally hosted DM Sans, reusable colour tokens, responsive typography and semantic layout.
- Figma-inspired sticky navy navigation and responsive animated mobile menu.
- Three-line welcome hero, dark gradient overlays, Sunday invitation and working information dialogs.
- Ten-second muted inline looping worship demo, matching poster, WebM and MP4 variants, accessible pause/play button, autoplay rejection fallback.
- Reduced-motion/data-saving preferences prevent automatic source attachment and video requests. Explicit Play opts into playback. Video pauses offscreen and when the document is hidden.
- Scoped curtain reveal, staggered headline entrance and scroll-triggered introduction with reduced-motion alternatives.
- Visit/watch/pray quick links, first introduction section and compact temporary footer.
- Native modal dialogs with Escape, focus containment and focus return. No invented service details or active payment claims.

## Main files

- `frontend/src/components/homepage.tsx` — homepage composition and hero
- `frontend/src/components/site-header.tsx` — responsive navigation
- `frontend/src/components/information-dialog.tsx` — accessible content availability panels
- `frontend/src/hooks/use-hero-motion.ts` — GSAP/ScrollTrigger lifecycle
- `frontend/src/hooks/use-hero-video.ts` — policy-aware playback
- `frontend/src/data/church.ts` — copy, navigation, media and pending information
- `frontend/src/app/globals.css` — tokens, layout, responsive styles and accessibility
- `frontend/src/app/layout.tsx` — local typography and preview metadata
- `frontend/public/media/` — temporary compressed film and poster
- `frontend/tests/homepage.spec.ts` — meaningful playback, preference and navigation checks
- `assets/README.md` — footage provenance and font licence

## Validation

Production build, standalone TypeScript and lint checked. Headless installed Chrome checks passed at desktop 1440px and mobile 390px: playback, pause/play, reduced-motion and data-saver network behavior, visitor dialog, Escape/focus return and mobile menu. Five tests passed; the desktop-only run skips the mobile-menu test intentionally. No browser runtime errors. Horizontal overflow checked at both sizes. Screenshots reviewed at `hero-desktop.png` and `hero-mobile.png`.

The scaffold's Turbopack adapter hit a subprocess-port restriction in this environment. Standard supported Next.js Webpack + Tailwind PostCSS configuration builds successfully and is retained for both development and production. Mobile checks use Chrome emulation; physical iOS/Safari testing and Core Web Vitals field measurements remain for a later release review.

## Next

Build the image-led church introduction, events, sermon library, ministries, Kingdom Projects interfaces, testimonies and full contact/footer with approved content. Supply real church logo, imagery, film, service times, address, contact details and media channels. The current introduction is a first editorial section; its photography treatment remains for the next milestone. Backend, database selection, secure admin and Paystack remain unimplemented as requested.
