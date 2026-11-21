# RCCG Spring of Life · Abuja

Church website built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4. Fraunces + DM Sans typography, Lucide icons.

## Run locally

```sh
cd frontend
npm ci
cp .env.example .env.local   # optional: Paystack keys, webhook
npm run dev
```

Root scripts forward into `frontend/` (`npm run dev | build | lint | typecheck | test:e2e`).

## Features

| Route | What it does |
| --- | --- |
| `/` | Video hero, live countdown to next service, quick actions, service times, latest message, upcoming events, ministries, house fellowships, project progress, giving & prayer |
| `/visit` | Service times, map + directions, WhatsApp, what to expect, **RSVP form**, FAQ |
| `/live` | Livestream embed (set `site.live.youtubeChannelId`) or countdown + YouTube/Facebook links, online first-timer form |
| `/sermons`, `/sermons/[slug]` | Searchable library (series, speaker), YouTube lite player, key points, discussion questions, WhatsApp share |
| `/events`, `/events/[slug]` | Calendar by month with category filters, **registration**, Google Calendar + `.ics` download, directions |
| `/ministries`, `/ministries/[slug]` | Ministry directory and **"get involved" form** |
| `/groups` | **House fellowship finder** (area/day/type) with join request |
| `/give` | Fund + amount picker, fee cover, **Paystack checkout** (when keys are set), bank transfer with copy buttons |
| `/projects`, `/projects/[slug]` | Kingdom projects with live funding progress and milestones |
| `/prayer` | **Prayer request form** + public **prayer wall** with "I prayed" counter |
| `/connect` | Digital connect card / next steps (salvation, baptism, membership, serving) |
| `/about`, `/contact` | Story, beliefs, leadership; contact channels + **contact form** |
| Sitewide | Top bar showing "Live now" / next service, newsletter signup, mobile menu, scroll reveal (respects reduced motion) |

## Design & motion system

**Design language:** navy / blue / crimson brand palette with colourful accents (`frontend/src/app/globals.css`). DM Sans with DM Mono for metadata, numbered section headers with hairline rules, near-square corners (3–4px), film grain on dark surfaces. Primitives live in `components/ui.tsx`.

**Motion** (GSAP + ScrollTrigger + SplitText, Lenis smooth scroll, React `<ViewTransition>`). All of it is disabled for `prefers-reduced-motion`, and content stays visible without JavaScript.

| Effect | Where |
| --- | --- |
| Opening ripple: a drop falls, rings spread, the page opens through the ripple (once per session) | `components/motion/spring-intro.tsx` |
| Hero lines rise from masks, hand-drawn wave under "Become", film sinks on scroll | `components/home-hero.tsx` |
| Liquid buttons: fill floods in from the pointer's entry point, ring on click | `.btn` + `MotionProvider` |
| Rolling odometer countdown | `components/motion/odometer.tsx` |
| Ribbon that speeds up / reverses / skews with scroll velocity | `components/motion/velocity-marquee.tsx` |
| Event photo that trails the cursor | `components/motion/hover-preview.tsx` |
| Pinned sideways ministries track | `components/motion/horizontal-scroll.tsx` |
| Sermon / event / project image morphs into the next page's hero | `Morph` in `components/cards.tsx` |
| Smart header (hides on scroll down), cursor "Watch" label, magnetic CTAs | `site-header.tsx`, `MotionProvider` |

Declarative attributes handled by `components/motion/motion-provider.tsx`: `data-reveal`, `data-reveal-group`, `data-split` (`="load"`), `data-clip`, `data-parallax="8"`, `data-scrub-words`, `data-count="96.5"` (+ `data-prefix`, `data-suffix`, `data-decimals`), `data-fill`, `data-magnetic`, `data-cursor="Watch"`, `data-delay="0.2"`. Content that mounts later (filters, dialogs) is picked up automatically.

## Editing content

Everything the church edits lives in `frontend/src/content/`:

- `site.ts` — name, address, phone/WhatsApp/email, socials, livestream, **weekly service times**, navigation
- `sermons.ts`, `events.ts`, `community.ts` (ministries, fellowships, leaders, beliefs, FAQ), `giving.ts` (funds, bank accounts, projects)
- `media.ts` — photo paths (replace `public/media/v5/*` with real church photography)

Values marked `CONFIRM` are **sample content** (names, times, contacts, bank details, project figures). While `site.preview` is `true`, search indexing is disabled and the footer notes that details are pending confirmation.

## Forms & integrations

All forms post to server actions in `frontend/src/app/actions.ts` (validation + honeypot spam protection). Submissions are appended to `frontend/.data/<kind>.jsonl` and, if `SUBMISSIONS_WEBHOOK_URL` is set, POSTed as JSON — connect it to Zapier/Make, Google Sheets, Slack or email. On serverless hosts (read-only disk) the webhook is the delivery channel.

Online giving uses Paystack Inline when `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is set; payments are verified server-side (`/api/paystack/verify`, needs `PAYSTACK_SECRET_KEY`). Without keys, the page directs givers to bank transfer — no payment is simulated.

## Checks

```sh
npm run lint && npm run typecheck && npm run build
PLAYWRIGHT_BASE_URL=http://localhost:3001 npm run test:e2e -- --workers=3
```

Screenshots from the e2e run are saved in `docs/screens/`. The previous V5 design source is archived at `docs/archive/frontend-v5-src-backup.tar.gz`.

## Before launch

- Replace every `CONFIRM` value and the illustrative photos/video with approved church content and official logo.
- Add Paystack keys and a submissions webhook (or the planned backend).
- Prayer-wall posts appear immediately — add moderation if the church prefers approval first.
- Set `site.preview = false` and `NEXT_PUBLIC_SITE_URL` to enable indexing.
