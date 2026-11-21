# Updated cinematic design integration

## Source of truth

Implemented `RCCG_Spring_of_Life_Cinematic_HTML_Design update.zip`, README V5 and its motion handoff. The older ZIP is retained for reference. The source prototype was inspected before conversion; its HTML files are not embedded or served as separate static pages.

## What changed

- Replaced the first hero milestone with the updated full-page composition, square buttons, restrained typography, illustrative hero slideshow and two-panel opening curtain.
- Added the complete introduction, asymmetric gatherings layout, faith ribbon, sermons, image-led ministries, Kingdom Projects teaser, testimony placeholder, invitation and full footer.
- Converted project listing to `/projects` and created three distinct `/projects/[slug]` pages. The HTML prototype sent all three cards to the same detail file; each now resolves to the matching project data.
- Preserved unverified funding targets/progress as unpublished. The progress tracks communicate pending verification, never fabricated percentages.
- Implemented an accessible React contribution amount selector with custom values, validation and polite feedback. It sends no requests, persists no records and does not invoke Paystack.
- Removed `hello@example.com`. Visitor, prayer, sermon, ministry and testimony availability actions use the existing native accessible dialog.
- Corrected supplied-image captions/placements to match their actual content. All supplied photos and the MP4 were copied locally, and the hero poster was converted to WebP. Media is illustrative, not documented RCCG Spring of Life activity.
- Kept the moving-text ribbon static to avoid a continuous secondary animation; retained its visual treatment.
- Added root package scripts forwarding into `frontend/`, resolving the previous root-directory `yarn dev` error without introducing another dependency lockfile or package manager.

## Architecture

- App Router pages and static sections remain Server Components.
- The shared layout composes header, footer and server-rendered route content inside a client interaction boundary; children remain server-rendered slots.
- Small Client Components own navigation state, video controls, contribution state and dialog actions.
- GSAP/ScrollTrigger is scoped to a route-aware context, cleaned up on navigation/unmount, and disabled for reduced motion. Each section gets its own reveal trigger.
- The existing video hook attaches sources only after policy checks or explicit Play. It handles autoplay rejection, user pause, viewport visibility and document visibility.
- Church information, repeatable ministry content, project definitions and milestones are in `src/data/`. Repeated project cards share one component. Homepage sections live in `src/components/sections/`.
- Next Image optimizes supplied local images. DM Sans is self-hosted. The updated archive supplies MP4 only; no nonexistent WebM source is advertised.
- No backend, database, admin authentication or payment integration was added. No Supabase.

## Files to review

- `frontend/src/app/layout.tsx`, `frontend/src/components/site-experience.tsx`
- `frontend/src/components/hero.tsx`, `site-header.tsx`, `site-footer.tsx`
- `frontend/src/components/sections/`
- `frontend/src/app/projects/page.tsx`, `projects/[slug]/page.tsx`
- `frontend/src/components/project-card.tsx`, `contribution-preview.tsx`
- `frontend/src/data/`, `frontend/src/hooks/`, `frontend/src/app/globals.css`
- `frontend/public/media/v5/`, `frontend/tests/homepage.spec.ts`
- Root `package.json` and the updated README

## Release boundaries

All project names and images are illustrative. Church identity, contact details, service schedule, project approvals, image rights/provenance and testimony permissions still require church confirmation before release. The ZIP's monogram is an illustrative identity, not a verified official RCCG logo. Search indexing remains disabled. Physical Safari/iOS and field Core Web Vitals remain release checks.

## Completed validation

- ESLint: passed without warnings.
- TypeScript: standalone typecheck and production-build typecheck passed.
- Production build: homepage, project directory and all three detail pages generated successfully.
- Production Chrome checks: **7 passed**, with the desktop run intentionally skipping the mobile-only menu test. Verified full homepage sections, accessible dialog/focus return, playback, reduced-motion/data-saver source suppression, explicit Play, project links and matching detail titles, contribution selection/validation, unknown-project 404, and absence of page runtime errors.
- Reviewed desktop and mobile screenshots: `v5-home-desktop.png`, `v5-home-mobile.png`, `v5-project-desktop.png`, `v5-project-mobile.png`.
- The temporary production test server was stopped after verification. The pre-existing development server on `http://localhost:3001` was left running.
