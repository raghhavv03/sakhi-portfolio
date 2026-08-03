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

Favicon master is `assets/favicon.svg` (Frame 17); served copies are
`public/favicon.svg` + `public/favicon.ico`.
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
  `CTA_HOVER_FILL`). **Contact submit** uses `ACTION_HOVER_GLASS` (action
  button, not a nav CTA). **Floating nav** uses `FLOAT_SHELL` (frosted
  surface) + `FLOAT_Y` (band positions), same file.
- **Empty means don't render** — empty string/array hides the affordance.
  `PREVIEW_UNPUBLISHED` in `portfolio.js` is a temporary exception for dead
  `#` hrefs; **off before launch** (see PRD).
- **Contact** — Formspree when `contact.formEndpoint` is set; otherwise
  UI-only with honest confirmation. Failed POST keeps the message and offers
  mailto.
- **Footer** — centred sign-off + icon row, not a sitemap. Résumé is header-
  only. Uses `py-10 md:py-12`, not `py-section*`. The connect buttons are a
  48px box around an 18px glyph — their own size, not `CTA_ICON`'s 44px, and
  each glyph carries the viewBox its path actually fills so it sits centred.
  They carry **no `data-cursor`** — three marks under the words "reach out"
  need no pill naming each one, same rule as the header's nav row.

```
src/
  App.jsx                 ThemeProvider + Router + Header/Footer/Cursor
                          + the 404 (`NotFound`)
  pages/                  Home · About · Contact · CaseStudy
  components/
    Header Footer Cursor Button Badge SectionHeader ProjectCard
    Logo ThemeProvider ThemeToggle HeroScene PhotoStack
    Figure Lightbox
    casestudy/            Blocks.jsx (section primitives + CSRich),
                          ScaleToFit.jsx, CaseStudyProgressNav.jsx
    charts/               SentimentPanel, FrictionChart
  lib/
    hooks.js              useFinePointer useReducedMotion useReveal
                          useInViewOnce useLargeScreen useNavCollapsed
    theme.js animations.js interactions.js haptics.js
  data/portfolio.js       every string on the site
```

Home is hero → work. The Journey section (trail + chapters) lives on
`journey-branch` with `Journey.jsx` until it ships; `journey` copy stays in
`portfolio.js` for that restore.
---

## Hard conventions

- **Every CTA imports size + hover** from `interactions.js`. Colour move only —
  no `hover:scale`, lift, shadow, or pointer-tracking drift. CSS, not Framer
  `whileHover`. Focus: `focus-visible:ring-2 focus-visible:ring-text/25
  focus-visible:ring-offset-2`. Lightbox uses the fixed dark-band tokens.
- **Contact submit** is an action button (`ACTION_HOVER_GLASS`) — it rests
  filled and softens to a glassy `text/70` wash on hover (not an outline
  unfill).
- **Header is a floating pill group**, not a bar: logo capsule · nav pill
  (Home / Work / About / Contact / CV) · `ThemeToggle`, all three cut from
  `FLOAT_SHELL` and parked at `FLOAT_Y.nav`. Labels drop below 860px and the
  pill goes glyph-only — that is what replaces the hamburger, so every
  destination stays on screen at 360px. LinkedIn is not in this row; the
  footer's connect row carries it. Contact's glyph is a speech bubble, not an
  envelope — the envelope is the footer's "email me", and the same mark for
  two different things reads as a duplicate.
- **The page runs under the nav** — `main` has no top padding. A section that
  opens with artwork (home hero, case-study banner) starts at 0 and lets the
  glass float over it; a section that opens with type takes `pt-nav-clear`
  (112px) instead of its top section padding. Anchors use
  `scroll-mt-nav-clear`. Never reintroduce a header-height offset.
- **The nav hides on real downward scroll** — one shared `useNavCollapsed`
  (140px threshold, 6px jitter floor). Both the header and the case-study rail
  read it; never fork the direction logic. Keyboard focus inside the header
  overrides the hide.
- **A hidden nav is `pointer-events: none`, so hiding it at the wrong moment
  eats a tap** rather than dimming one — that is the "I had to tap twice" bug
  on a phone. Two guards in `useNavCollapsed` prevent it, and both only ever
  keep the nav on screen: iOS overscroll (`y <= 0` / `y >= max`) is a dead
  zone, because the rubber-band spring is a downward move the reader never
  made; and a touch that has not moved yet is a tap, so `collapsed` is frozen
  from `touchstart` until the first `touchmove` — which means drag-scrolling
  still hides the nav normally. Every control in the row also carries
  `touch-manipulation`, so a tap fires immediately instead of waiting out
  double-tap-to-zoom.
- **`lamp`** is the hero lamp's own light: the dark-mode bloom on the lamp head
  (`HeroScene`) and the journey trail glow (on `journey-branch`) — never type,
  never a surface. The bloom is opacity-only and faint; it says the bulb is on,
  it is not a glow effect on the artwork. Above the lamp sits one small glass
  hint pill (`hero.scene.hint`), rendered inside the lamp button so it tracks
  the hotspot and clears the shade. It wears the same frosted shell as the
  floating nav (`FLOAT_SHELL`, forced `rounded-full`) so day and night match
  the header glass. Nothing else is painted over the lamp — no halo, no ring.
- **The lamp hotspot is measured, never a percentage of its box.** The artwork
  is `object-cover object-right`, so every viewport narrower than 1672 × 941
  crops the left of it and `LAMP` — a point on the *artwork* — lands somewhere
  else entirely on the box (~17% off on a phone). `useLampSpot` observes the
  frame and positions the hotspot, the bloom and the hint in px against the
  drawn rect, so the switch is on the shade at every width and the lamp is
  tappable on a phone. Both scale with the artwork, with a 44px floor.
- **No hero wash.** Artwork edge to edge; copy on a solid card (`bg-bg`, full
  opacity — not the nav's `bg-bg/70` frost), `border`, `rounded-2xl`. Home uses
  `h1` + `body` (case-study banner keeps `display` + `lead`). Do not
  reintroduce a gradient over the artwork. Mobile scene stays `h-[62svh]`,
  not full-bleed cover.
- **Header** keeps its frosted shell even over the hero — it floats above the
  artwork, it never goes transparent.
- **Case-study progress** — `CaseStudyProgressNav` maps the fourteen sections
  into five groups (Overview · Research · Solution · Testing · Learnings), each
  anchored to the id of the section that opens it. Groups stay **contiguous in
  document order** — a non-contiguous group makes the rail run backwards. Rail
  expanded when the nav is hidden, dots when it is back; the sliding indicator
  is a `layoutId`, and the rail keeps only the active label below 720px. The
  rail's buttons carry **no `data-cursor`** — the label is already the word.
- **Cursor pill** is `bg-text` / `text-bg`. Labels follow `data-cursor` via
  `MutationObserver` (not click) so theme flips update immediately. The hero
  lamp draws a 44px glyph disc — the toggle's own `SunIcon` / `MoonIcon`,
  exported from `ThemeToggle.jsx` — not a word. `ThemeToggle` itself carries no
  `data-cursor`, and nothing else in the header does either: a label repeating
  the glyph or link text next to it is noise.
- **Never pair** a `text-*` size with `leading-*` or `tracking-*`.
- **One vertical rhythm** — `py-section-sm md:py-section-md lg:py-section`
  between sections; `gap-6` inside; `p-6` in cards.
- **Scroll reveals** fire once; disabled under `prefers-reduced-motion`
  (`useReveal`).
- **Custom cursor is decorative** — every `data-cursor` needs real text or
  `aria-label`; gated on `(pointer: fine)`.
- **`Trail` in Journey** (`journey-branch`) — never key measurement off
  `trackRef` (ancestor, still null on first layout). Observe the rail;
  `useScroll` with `layoutEffect: false`. Curve constants: `BEND_MAX`,
  `BEND_RATIO`, `BELLY`, `MAX_SPAN` — all in `Journey.jsx`.
- **Charts** — bar lengths are the Figma frame’s drawn lengths, not value ×
  scale. Grow via `useInViewOnce` + CSS; friction chart uses `scaleX`.
- **Prototype screens** — show as-designed; do not restyle.
- **Lightbox** pans by transform (`translate3d` + scale), never by
  `overflow-auto` scroll. One pointer pans, two pinch; frame is `touch-none`.
- **Project card names** sit below the thumbnail as `font-semibold text-text`
  in the same `text-lead` size/family as the description, separated from it by
  ` | ` and continued in the same paragraph. No name overlay on the thumb; no
  bottom scrim.
- Images need explicit `width` / `height` and `alt`; below-fold lazy-load.
- **PhotoStack is two components behind one name**, split on `useLargeScreen`.
  `Spread` (`lg`+) is the hover layout: the lifted card keeps its `x` (no
  slide-to-centre flicker) and a pile opens on the group’s `pointerenter`, not
  a buried card’s. `Deck` (below `lg`) is a swipe deck: drag the top card past
  `SWIPE_DISTANCE`/`SWIPE_VELOCITY` and it goes round to the back of the pile,
  the next is already under it, and the group is a **loop** — no card ever
  leaves and there is nothing to deal back. Order is held as one counter,
  `turns`: card `i` sits at depth `(i - turns) mod count`, so the array never
  moves. Never give the deck a horizontal scroller instead; the page must not
  scroll sideways at 360px — and the tuck arc must not either, which is why
  `TUCK_X` is short and `TUCK_PERSPECTIVE` is long (a near perspective throws
  the near edge of a turning card off screen).
- **The tuck hides the z-swap in the turn.** A card going round has to move
  from the front of the z-order to the back, and `TUCK_TURN` is a quarter turn,
  so at the far point of the arc it is exactly edge-on and draws nothing — the
  swap happens in a frame where there is nothing to see. Keep it at 90°: any
  less and the card is caught changing places. The card animates out on
  `TUCK_DURATION`, and `onAnimationComplete` clears it from `tucking`, which is
  what drops its `zIndex` and sends it home on the ordinary deck transition.
  `tucking` is a map, not one index, because a reader can swipe faster than the
  arc lands; a card on the arc is `pointer-events: none` so it cannot swallow
  the next swipe. Under `prefers-reduced-motion` there is no arc at all — the
  card is never marked tucking and simply reappears at the back.
- **The deck fans, and a tap does what a swipe does.** Resting cards step down,
  across and further out of true (`DECK_STEP_X/Y/SCALE/TILT`) so the ones
  underneath read as more photographs — that visible corner is the only thing
  inviting the gesture. A tap on the top card therefore sends it round too.
  Framer reports a drag that ends over the card as a click, so `draggingRef`
  must stay: without it a throw fires the tap handler and takes the next card
  with it.
- **A pile deals first card on top** at both widths (`layout === 'pile'`
  reverses `zIndex` in `Spread`), so the photograph that names the group — the
  "pspspsps" cat — is the one you see. A fan keeps its left-to-right shingle;
  every card there is already showing.
- **The caption pill is one component** (`Caption`) and is coloured at every
  width — the frame’s highlighter hue, `caption-ink`, no hairline. It names the
  card being looked at: the lifted one on a pointer, the top of the deck on a
  phone. An empty `caption` renders nothing.
- **About is written in the phone frame’s order** — intro, background, makes,
  off-duty copy, trips, cats — and re-ordered at `lg` (makes before background,
  cats before trips) with `order-*` on a `flex-col`. `lg` because that is where
  the decks become the hover spread; keep the two in step.
- **Colour exceptions only:** `on-brand` on brand bands, `cs-quote` /
  chart hues, About caption pills (`caption-ink` on `caption-1..5`).

Sanctioned product exceptions and launch items: **[PRD.md](PRD.md)**.
