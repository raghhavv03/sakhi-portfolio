# Sakhi Rana — portfolio site

Personal portfolio for a UI/UX & product designer. The site is a work sample:
minimal, calm, confident, with one signature interaction (the custom label
cursor). Mobile is the primary case.

Product goals, launch checklist, and content ownership: **[PRD.md](PRD.md)**.

---

## Commands

```bash
npm run dev      # vite on :5173
npm run build    # production build
npm run lint     # must pass clean before committing
npm run preview  # production build on :4173
```

`npm run optimize:scene` — regenerates hero scenes from
`assets/hero-scene-light.png` / `assets/hero-scene-dark.png` into AVIF + WebP
at 840 / 1280 / 1672.

`npm run optimize:about` — regenerates About photos from `assets/about/*.jpg`
into `public/images/about/*.webp`, cover-cropped to `make` / `cat` / `trip` /
`portrait`.

---

## Architecture

- **React + Vite**, Tailwind, Framer Motion, React Router. No backend.
- **All copy** lives in `src/data/portfolio.js`. Wording changes are data
  changes, not component changes.
- **All colour** lives in `tailwind.config.js`; values live in `src/index.css`
  as `rgb(var(--x) / <alpha-value>)`. **Never write a `dark:` colour class.**
- **One theme switch** — `ThemeProvider` / `useTheme()`; hero lamp and header
  toggle call the same `toggleTheme`. Keep the pre-paint script in
  `index.html` in sync with `src/lib/theme.js`.
- **Two type colours, one scale, one family** — headings `text-text`; body /
  labels / captions `text-text-muted`. Sizes from the named scale in
  `tailwind.config.js` (`display` … `caption`). Inter everywhere; weights 400
  and 600 only.
- **Motion** — `src/lib/animations.js` (`EASE`, `DUR`). **CTAs** —
  `src/lib/interactions.js` (`CTA_SHAPE`, `CTA_ICON`, `CTA_HOVER`,
  `CTA_HOVER_FILL`, `CTA_HOVER_UNFILL`).
- **Empty means don't render** — empty string/array hides the affordance.
  `PREVIEW_UNPUBLISHED` in `portfolio.js` is a temporary exception for dead
  `#` hrefs; **off before launch** (see PRD).
- **Contact** — Formspree when `contact.formEndpoint` is set; otherwise
  UI-only with honest confirmation. Failed POST keeps the message and offers
  mailto.
- **Footer** — centred sign-off + icon row, not a sitemap. Résumé is header-
  only. Uses `py-10 md:py-12`, not `py-section*`.

```
src/
  App.jsx                 ThemeProvider + Router + Header/Footer/Cursor
  pages/                  Home · About · Contact · CaseStudy
  components/
    Header Footer Cursor Button Badge SectionHeader ProjectCard
    Logo ThemeProvider ThemeToggle HeroScene Journey PhotoStack
    Figure Lightbox
    casestudy/Blocks.jsx  section primitives + CSRich
    charts/               SentimentPanel, FrictionChart
  lib/
    hooks.js              useFinePointer useReducedMotion useReveal
                          useInViewOnce useLargeScreen
    theme.js animations.js interactions.js haptics.js
  data/portfolio.js       every string on the site
```

---

## Hard conventions

- **Every CTA imports size + hover** from `interactions.js`. Colour move only —
  no `hover:scale`, lift, shadow, or pointer-tracking drift. CSS, not Framer
  `whileHover`. Focus: `focus-visible:ring-2 focus-visible:ring-text/25
  focus-visible:ring-offset-2`. Lightbox uses the fixed dark-band tokens.
- **Contact submit** is the only reverse hover (`CTA_HOVER_UNFILL`) — it rests
  filled and empties on hover.
- **Header LinkedIn + Resume** are both `Button` (outlined). Do not split their
  visual weight.
- **`lamp`** is for the journey trail glow only — never type, never a surface.
  Nothing is painted over the hero lamp (no halo, ring, or caption).
- **No hero wash.** Artwork edge to edge; copy on a frosted card matching the
  nav: `bg-bg/70 backdrop-blur-md`, `border`, `rounded-2xl`. Home uses `h1` +
  `body` (case-study banner keeps `display` + `lead`). Do not reintroduce a
  gradient over the artwork. Mobile scene stays `h-[62svh]`, not full-bleed
  cover.
- **Header** keeps the frosted bar even over the hero.
- **Cursor pill** is `bg-text` / `text-bg`. Labels follow `data-cursor` via
  `MutationObserver` (not click) so theme flips update immediately.
- **Never pair** a `text-*` size with `leading-*` or `tracking-*`.
- **One vertical rhythm** — `py-section-sm md:py-section-md lg:py-section`
  between sections; `gap-6` inside; `p-6` in cards.
- **Scroll reveals** fire once; disabled under `prefers-reduced-motion`
  (`useReveal`).
- **Custom cursor is decorative** — every `data-cursor` needs real text or
  `aria-label`; gated on `(pointer: fine)`.
- **`Trail` in Journey** — never key measurement off `trackRef` (ancestor,
  still null on first layout). Observe the rail; `useScroll` with
  `layoutEffect: false`. Curve constants: `BEND_MAX`, `BEND_RATIO`, `BELLY`,
  `MAX_SPAN` — all in `Journey.jsx`.
- **Charts** — bar lengths are the Figma frame’s drawn lengths, not value ×
  scale. Grow via `useInViewOnce` + CSS; friction chart uses `scaleX`.
- **Prototype screens** — show as-designed; do not restyle.
- **Lightbox** pans by transform (`translate3d` + scale), never by
  `overflow-auto` scroll. One pointer pans, two pinch; frame is `touch-none`.
- **Project card names** use `text-text`. No bottom scrim over the thumbnail.
- Images need explicit `width` / `height` and `alt`; below-fold lazy-load.
- **PhotoStack** — lifted card keeps its `x` (no slide-to-centre flicker);
  pile opens on the group’s `pointerenter`, not a buried card’s.
- **Colour exceptions only:** `on-brand` on brand bands, `cs-quote` /
  chart hues, About caption pills (`caption-ink` on `caption-1..5`).

Sanctioned product exceptions and launch items: **[PRD.md](PRD.md)**.
