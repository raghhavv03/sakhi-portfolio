# Sakhi Rana — portfolio site

A personal portfolio for a UI/UX & product designer. The site itself is a work
sample, so the craft of the UI *is* the pitch: minimal, calm, confident, with
one signature interaction (the custom label cursor).

Most visitors are hiring managers and recruiters, and most of them arrive on a
phone. Mobile is not a fallback here — it is the primary case.

---

## Commands

```bash
npm run dev        # vite dev server on :5173
npm run build      # production build
npm run lint       # eslint (must pass clean before committing)
npm run preview    # serve the production build on :4173
```

`npm run optimize:scene` regenerates the two hero scenes from
`assets/hero-scene-light.png` / `assets/hero-scene-dark.png` into AVIF + WebP
at three widths (840 / 1280 / 1672).

`npm run optimize:about` regenerates the thirteen About photographs from
`assets/about/*.jpg` into `public/images/about/*.webp`, cover-cropped to the
four card shapes the page actually renders (`make` / `cat` / `trip` /
`portrait`). The masters in `assets/` are already downscaled to 1400px — the
phone originals are not in the repo.

---

## Architecture

- **React + Vite**, **Tailwind** for styling, **Framer Motion** for motion,
  **React Router** for routing. No backend — the contact form is UI-only.
- **All copy lives in `src/data/portfolio.js`.** Components never hardcode
  content. If a change is wording, it is a data change, not a component change.
- **All colour lives in `tailwind.config.js`, and its values live in
  `src/index.css`.** Every themed token is `rgb(var(--x) / <alpha-value>)`, so
  `bg-bg` / `text-text` / `border-border` already mean the right thing in both
  themes and **no component ever writes a `dark:` colour variant**. The two
  blocks of variables — `:root` and `html.dark` — are the entire palette. No
  ad-hoc hex in components.
- **The site has two themes and one switch.** `ThemeProvider` owns the
  decision, `useTheme()` reads it, and both controls (the hero lamp and the
  header toggle) call the same `toggleTheme`, so they cannot disagree. An
  explicit choice is stored in `localStorage` and wins; with no choice the site
  follows the OS and keeps following it. The inline script in `index.html`
  sets the class before first paint — keep it in sync with `src/lib/theme.js`.
- **Two type colours, one type scale, one family — site-wide.** Every heading
  on every route is `text-text`; every paragraph, label, list and
  caption is `text-text-muted`. Sizes come from the named scale in
  `tailwind.config.js` — `display h1 h2 h3 h4 lead body body-sm caption` — and
  each entry carries its own line height and tracking, so a component sets a
  size and nothing else. The family is Inter everywhere. See the conventions
  section below for the three sanctioned exceptions.
- **All motion timing lives in `src/lib/animations.js`.** `EASE` and `DUR` are
  the only curves and durations on the site.
- **Empty means "don't render".** Every consumer of `portfolio.js` treats an
  empty string or empty array as a missing value and hides the affordance: no
  résumé URL hides the Resume button, no email hides every mailto, an empty
  `education` array hides that section, a photo with no `caption` simply never
  names itself. So leave a field empty until it's real — never a placeholder
  string, which ships as visible filler.
- **Footer is a centred sign-off, not a sitemap.** Copy lives in `footer` +
  `site.copyright`; the connect row is a set of round hairline icon buttons
  assembled from `links` and `contact.email` inside `Footer.jsx`, each hidden
  until real. "Say hello" → `/contact` is the one that never hides, so the row
  is never empty. Résumé stays a `Button`, not an icon — the frame has no glyph
  for it and a hand-drawn one would be a guess. Back to top is footer-only — no
  floating control. The old dark multi-column footer and the case-study
  `BackHome` buttons are gone.

```
src/
  App.jsx                    ThemeProvider + Router + Header/Footer/Cursor shell
  pages/                     Home · About · Contact · CaseStudy
  components/
    Header Footer Cursor Magnetic Button Badge SectionHeader
    ProjectCard
    ThemeProvider.jsx        owns light/dark; wraps the whole app
    ThemeToggle.jsx          header switch (desktop actions + mobile bar)
    HeroScene.jsx            the two hero frames + the lamp that switches them
    Journey.jsx              home's scroll-drawn trail + its four chapters
    PhotoStack.jsx           About's fan / pile of photos + the lift-to-name
                             interaction (strip that scrolls below `lg`)
    RichText.jsx             **bold** inline emphasis for copy from the data file
    Figure.jsx               case-study visual + Enlarge affordance
    Lightbox.jsx             full-bleed image viewer (Esc / backdrop / focus return)
    casestudy/Blocks.jsx     CSSection CSLabel CSHeading CSSubheading CSBody
                             CSList CSCard CSCallout CSQuote + the card grids
    charts/                  SentimentPanel, FrictionChart
  lib/
    hooks.js                 useFinePointer useReducedMotion useReveal
                             useInViewOnce useActiveSection useLargeScreen
    theme.js                 ThemeContext, useTheme, storage + applyTheme
    animations.js            EASE, DUR, fadeUp, stagger
  data/portfolio.js          every string on the site
```

---

## Conventions that are easy to get wrong

- **Text is never blue.** Pastel blue (`accent`) has one job in both themes:
  hover states. It is never a resting colour and never type. Its *value*
  changes in dark mode (deepened to #3D5C80) precisely so the light ink that
  lands on a hover fill keeps its contrast — the role is what stays fixed, not
  the hex. Focus rings are the heading ink — `focus-visible:ring-2
  focus-visible:ring-text/25 focus-visible:ring-offset-2` everywhere.
- **`lamp` is the hero lamp's own light, not a third accent.** It appears on
  the lamp toggle's halo, the journey milestones, and the hero's one-line hint
  dot. Never type, never a surface.
- **Never add a `dark:` colour class.** If something looks wrong in dark mode
  the token is wrong, not the component. The three sanctioned `dark:` uses are
  the header wordmark (`dark:brightness-0 dark:invert`, a flat PNG) and
  nothing else so far.
- **Two font weights only** — 400 and 600, no exceptions. Sentence case
  everywhere.
- **The only text that is neither `text` nor `text-muted`** is: type inverted
  on a coloured brand band (`text-on-brand` over `mfp-blue` — white in both
  themes, because the fill under it does not change), the case study's
  one blue framing question (`cs-quote`), and the two research panels' data
  hues. Everything else — including every case-study heading, label and
  caption — uses the two site colours. A new grey is not an option; if
  something needs to recede further, make it smaller.
- **Never pair a size class with `leading-*` or `tracking-*`.** The `text-*`
  token already sets both. Adding `leading-tight` next to `text-h2` is how the
  page drifts out of the scale.
- **One vertical rhythm.** `py-section-sm md:py-section-md lg:py-section`
  between page sections on every route, `gap-6` (24px) between blocks inside
  one, and `p-6` inside every card. The case study uses these too.
- **Scroll reveals fire once** (`viewport={{ once: true }}`) and are disabled
  entirely under `prefers-reduced-motion` (that is what `useReveal` handles).
- **The custom cursor is decorative.** Every `data-cursor` element must also
  carry real link text or an `aria-label`. It is gated on `(pointer: fine)`.
- **Charts grow their bars via `useInViewOnce` + a CSS transition**, not a
  Framer in-view gesture — one observer per chart so all bars move together.
  The friction chart grows with `scaleX`, not `width`, because its labels are
  right-aligned in a shared grid and animating width would re-measure them.
- Every image needs explicit `width`/`height` and `alt`. Below-the-fold images
  lazy-load.
- **A stacked photo card must not move out from under the pointer.** In
  `PhotoStack` a lifted card keeps its `x` in the spread and only rises,
  straightens and scales. Sliding it back to centre un-hovers it, which slides
  it back, which re-hovers it — a card that flickers forever. Same reason a
  pile opens on the *group's* `pointerenter`, not a card's: at rest every card
  but the top one is buried, so opening on the card leaves the rest unreachable.

---

## Open work

Consolidated from the progress log below so it isn't repeated in every entry.
Update this list, not each session's write-up, when an item is done.

**Blocked on facts only Sakhi has:**
- `contact.email`, `links.linkedin`, `links.behance` in `portfolio.js` — the
  site has no way to reach her except the UI-only contact form until these land.
- `resume.pdf` into `public/`, then `links.resume = '/resume.pdf'` — the
  Resume button stays hidden (header, mobile panel, footer) until then.
- `about.education` entries — `{ institution, qualification, years }`. The
  About copy now says "an MBA in Marketing, 2025", so the institution is the
  only missing fact.
- Case-study `meta` has no timeline; the source PDF's Timeline field was blank.
- `about.background.link` — the Crochet Curio shop URL. The copy names
  `@crochetcurioo` but nothing links to it, and inventing the URL is not ours
  to do. Fills the "Visit Crochet Curio" button.
- Two of the three cats and two of the four trip photos have an empty
  `caption`, so those cards never name themselves. Fine as-is; better with her
  words.

**Doable without her:**
- Wire the contact form (Formspree or a Vercel function).
- Per-route `<title>` / description — every route shares `index.html`'s, so a
  shared case-study link previews as the home page.
- Absolute `og:url` / `og:image` once the production domain is settled.
- Project two, still a `coming-soon` placeholder.
- The About section kickers are ours, not hers: the frame gives one heading per
  section ("Background", "When I'm not designing"), and the site's
  `SectionHeader` wants a badge above it. "Background" became the badge over
  "Crochet Curio", and "Beyond design" sits over "When I'm not designing".
  Worth her confirming.
- Route-level code splitting — bundle is ~369KB / 119KB gzipped, most of it
  Framer Motion; the case study is the only page that needs the heavy parts,
  and it's also the LCP-heaviest route (hero is a single 107KB WebP — a
  `srcset` would pay for itself).
- Home loads **both** hero scenes (the inactive one lazily). A ~60KB AVIF is
  cheap, but a `<link rel="prefetch">` on the other theme, or dropping the
  eager frame once switched, would be cheaper.
- `public/logo.png` (gradient wordmark) is unreferenced — `logo-wordmark.png`
  is the one the header uses, and dark mode inverts it rather than shipping a
  light variant. Delete it or find it a job.
- Charts' internal labels sit on `text` rather than `text-muted` — deliberate
  at 8–12px inside `ScaleToFit`, but worth a look if the panels are redrawn.

**Copy that is a first draft, not Sakhi's own words:** `site.bio`,
`hero.opening`, `hero.scene.lampHint`, `contact.invite`, and the whole
`journey` block — its four chapters are written from the Stitch frame's
outline (crochet → shop → MBA → UX), so the dates, the order and the wording
all need her confirmation. **The entire `about` block and `footer` are now
hers**, lifted verbatim from the "Website changes" Figma file; the only strings
on that page we wrote are the two section badges and the image `alt` text.

## Progress log

Newest first. Add an entry per working session — what shipped. Open TODOs go
in **Open work** above, not in each entry.

### 2026-07-30 — About rebuilt from Figma, one footer everywhere, curvier journey trail
The About page is now Sakhi's own words and her own photographs, from the
"Website changes" Figma file (`dZb2Q6tMIGKgg2Xozpb1Nk`, frame `2023:105`), and
the footer is that frame's sign-off on every route.

- **About** follows the frame's order: intro beside the portrait, the Crochet
  Curio makes, the background behind them, then what happens off duty.
  Education keeps its slot and stays hidden. The old placeholder page is gone —
  `about.statement` / `about.paragraph` / `crochetCurio` / the six `interests`
  cards were all drafts written for her, and every one is replaced. `Doodle.jsx`
  was only ever used by those interest cards, so it's deleted along with
  `public/about-sakhi-saree.png`.
- **`PhotoStack.jsx`** carries the frame's interaction. A `fan` (the five
  makes) spreads across the row; a `pile` (three cats, four trip photos) is
  dealt almost on top of itself and opens while explored. Either way the card
  under the pointer rises, straightens, scales and names itself in a pill —
  the frame's yellow caption bubbles, re-drawn as the site's own card
  (`surface` + `border`), because `#fffb00` is not in this palette. Below `lg`
  it is a snap-scrolling strip with every caption visible, since a phone has
  no hover and five 200px cards fanned across 342px would be five slivers.
  New `useLargeScreen()` in `hooks.js` is what tells the two apart.
- **Footer** is the frame's: hairline, "Thanks for stopping by!", the subtext,
  a row of round hairline icon buttons, the copyright. The mail and chat glyphs
  are the frame's own paths re-pointed at `currentColor`; LinkedIn stays set in
  type, as the frame sets it, rather than shipping a redrawn brand mark. "Say
  hello" → `/contact` is always present so the row is never empty.
- **Journey trail** (home) — the dots were HTML pinned to the column centre
  while the path was a hardcoded `d` in a stretched viewBox, so wrapped copy
  walked them off the curve. The path is now measured: a `ResizeObserver` reads
  each dot's centre and `buildTrail` threads a curve through those exact
  points (max dot-to-path gap 1.3px at 1440 and 390). It is also much curvier —
  alternating symmetric bellies, which stay tangent-continuous at every dot, so
  it reads as one long wave; long gaps subdivide so a tall mobile card doesn't
  flatten the wave into a line.
- **Assets**: thirteen photographs exported from the frame's originals into
  `assets/about/` (downscaled masters, 4.5MB) and `public/images/about/`
  (WebP, 728KB total, largest 98KB) via the new `npm run optimize:about`.
- **Verified** with `npm run lint`, `npm run build`, and a Playwright pass over
  all four routes × light/dark × 1440/390 × normal and reduced motion: no
  console errors, no horizontal overflow, no broken images, theme class
  correct, connect row non-empty everywhere. Two real bugs were caught and
  fixed in that pass — a React key-spread warning in the footer, and a lifted
  pile card that slid out from under the pointer and flickered.
- **Files touched:** `About.jsx`, `Footer.jsx`, `Journey.jsx`, `portfolio.js`,
  `hooks.js`, `package.json`, `CLAUDE.md`, plus new `PhotoStack.jsx` and
  `scripts/optimize-about.mjs`. Deleted `Doodle.jsx`,
  `public/about-sakhi-saree.png`.

### 2026-07-29 — light + dark themes, new hero scene, the Journey section
Home is now hero → journey → work, and the site has two themes with the hero
lamp as the switch. Structural inspiration for both came from a Stitch frame
("The Designer's Odyssey"); the palette is that frame's warm-cream character
applied to this site's own token roles, not its gold/sage material palette.

- **Theme system.** Every themed colour is a CSS variable of RGB channels read
  by Tailwind as `rgb(var(--x) / <alpha-value>)`, `darkMode: 'class'`. That is
  why the whole site went dark without a single `dark:` class: the ~120
  existing `bg-bg` / `text-text` / `border-border` / `ring-text/25` usages were
  already correct. `ThemeProvider` + `useTheme` own the state; the inline
  script in `index.html` sets the class pre-paint; `theme-transition` (added
  for 400ms around a switch, off under reduced motion) cross-fades the change.
- **Palette.** Light warmed to the scene: canvas #FBF9F5, hairline #E2DCCE,
  ink #1B1C1A, muted ink #4D4635 (8.9:1). Dark: canvas #0F172A, card #172033,
  hairline #2A354C, ink #F0EDE6 (15.5:1), muted #AFB6C4 (8.6:1). New tokens:
  `on-brand` (white, for type on the MyFitnessPal band and the sentiment
  bars), `lamp`, `shadow`, plus `--shine`/`--shine-alpha` for the card sweep.
- **Hero** is the Stitch frame's layout: the artwork edge to edge with the copy
  sitting in its light — full-bleed behind the copy on desktop (left-to-right
  wash), stacked above it on mobile (bottom-up wash). `HeroScene` cross-fades
  the day and night frames; the desk lamp is a real `<button>` (aria-pressed,
  aria-label, `data-cursor` "Lights off"/"Lights on") placed in the artwork's
  own coordinates — 87.4% / 55.5% of a frame that is never cropped vertically.
  A one-line hint under the opening says the lamp is a control. The header
  toggle is the same state, so the two are always in step.
- **Journey** (`Journey.jsx`, copy in `portfolio.js`): four chapters
  alternating either side of a trail that draws with scroll — a dashed
  hairline for the route ahead, a solid path whose `pathLength` is tied to
  `useScroll` (spring-smoothed) for the route walked. Milestones are HTML dots
  (the SVG is vertically stretched, so an SVG circle would arrive an ellipse)
  that light once via `useInViewOnce`. Under reduced motion the trail renders
  fully drawn and nothing animates.
- **Superseded and removed:** `HeroImage.jsx`, `scripts/optimize-hero.mjs`,
  `assets/hero-illustration.png` and the six `public/hero-illustration-*`
  exports. `Doodle.jsx` now paints from the theme variables instead of hex.
  Button's hover shadow moved from a Framer value to a CSS token (Framer
  cannot interpolate a colour held in a variable).
- **Verified** with `npm run lint`, `npm run build`, and a Playwright pass at
  1440 and 390 over all four routes in both themes plus a reduced-motion run:
  no console errors, theme survives reload, both controls report the same
  `aria-pressed`.
- **Files touched:** `tailwind.config.js`, `index.css`, `index.html`,
  `package.json`, `App.jsx`, `Home.jsx`, `Header.jsx`, `Cursor.jsx`,
  `Button.jsx`, `ProjectCard.jsx`, `Doodle.jsx`, `SentimentPanel.jsx`,
  `CaseStudy.jsx`, `Contact.jsx`, `portfolio.js`, plus new `ThemeProvider.jsx`,
  `ThemeToggle.jsx`, `HeroScene.jsx`, `Journey.jsx`, `lib/theme.js`,
  `scripts/optimize-scene.mjs`.

### 2026-07-29 — type consistency audit, line-height bump, background section reorder
- Audited the whole site against the one-type-system rules below: no stray
  `leading-*`/`tracking-*` beside a `text-*` size, no `cs-primary`-era tokens
  left, no ad-hoc hex in components (the chart pixel values and `Doodle.jsx`'s
  SVG fills are the two sanctioned exceptions — literal frame geometry and
  token-matching SVG paint, respectively). Confirmed clean via `npm run lint`
  and `npm run build`.
- **Line height raised a step across the whole scale** — `tailwind.config.js`
  `fontSize` and `index.css`'s base `body` rule: `body`/`body-sm` 1.7 → 1.75,
  `lead`/`caption` 1.6 → 1.65, `h4` 1.45 → 1.5, `h3` 1.4 → 1.45, `h2` 1.25 →
  1.3, `h1` 1.15 → 1.2. `display` stays at 0.95 — the hero sizes are large
  enough that tight leading is the point, not a gap to close.
- **Case study Background section**: the fact rail (My Role / Status / Type /
  Tools Used) now sits above the badge + heading instead of below them —
  `BackgroundMeta` renders first in `CaseStudy.jsx`, then `CSLabel` +
  `CSHeading`, then the body paragraph.
- **Files touched:** `tailwind.config.js`, `index.css`, `CaseStudy.jsx`.

### 2026-07-29 — one type system across every route
The case study and the rest of the site had been two separate design systems
sharing a shell: SF Pro vs Inter, `text-3xl sm:text-4xl` vs `text-cs-l`,
`#6B6B6B` vs `#575757` vs `#333333` vs `#666666`. They are now one.

- **Two colours.** `text` #1A1A1A for every heading, `text-muted` — retuned
  from #6B6B6B to **#575757** — for every paragraph, label, list and caption.
  6.7:1 on the canvas. `body` in `index.css` now *defaults* to the muted ink
  and the base `h1–h6` rule lifts headings back to `text`, so a component that
  forgets a colour still lands on a sanctioned one. Deleted the whole
  `cs-primary / cs-secondary / cs-tertiary / cs-disabled / cs-inverse / cs-bg*
  / cs-border* / cs-copy / cs-card*` block. Kept: `cs-quote`, `cs-callout`, the
  sentiment trio and the four friction hues.
- **One scale.** `display h1 h2 h3 h4 lead body body-sm caption` in
  `tailwind.config.js`, each carrying its own line height and tracking. The
  three headline sizes `clamp()` rather than stepping through `sm:` / `md:`
  variants, which is what makes the ramp identical on every route. Deleted
  `text-hero`, all thirteen `cs-*` sizes, and the `leading-body` / `leading-hero`
  tokens; no component sets `leading-*` or `tracking-*` beside a size any more.
- **One family, two weights.** `font-sans` is Inter; the `font-cs` family and
  all 39 of its usages are gone, as is Inter 700 — case-study inline emphasis
  is now Semibold on `text`, the same as `RichText`'s `Rich`.
- **One rhythm.** `cs-gap` (104px) / `cs-stack` (24px) replaced by the site's
  `section` / `section-md` / `section-sm` and plain `gap-6`. Every card on the
  site — About's interests, the case study's literature / signal / result /
  compare cards, every callout — is now `rounded-2xl border-border bg-surface
  p-6`.
- **Case-study section measures** cut from eight (593/880/928/948/1000/1004/
  1158/1182, so every section started on a different left edge) to three:
  `cs-prose` 948, `cs-wide` 1003.76, `cs-full` 1182. `CSSection` takes
  `width="prose|wide|full"`, prose by default.
- **The Background fact rail** was absolutely positioned 606px left of centre,
  which only existed at ≥1440 and overhung the Problem section there. It is
  now a four-up `<dl>` row inside the section, rule-bounded, 2-up on mobile.
- **`CSLabel` is the site `Badge`.** Case-study section kickers ("Background",
  "Problem", "Solution 1: The Today Screen") render as the same pill Home /
  About / Contact put above their headings; the `tone="copy"` variant is gone.
- Smaller consistency fixes: `ProjectCard`'s hand-rolled "In progress" pill now
  uses `Badge`; its focus ring and `Figure`'s (which was `ring-mfp-blue/40`)
  match Header/Footer's `ring-text/25`; Header's duplicated mobile action-link
  strings reuse `mobileNavLinkClass`; Contact's `<dt>`s were `text-xs` where
  its `<label>`s were `text-sm` — both are `text-body-sm`; Footer's band picked
  up the missing `md:py-section-md` step; the charts' off-token `#e9e9e9` and
  `rgba(129,124,255,0.5)` are `border-border` and `bg-cs-callout/50`.
- **Verified** with `npm run lint`, `npm run build`, and a Playwright pass over
  all four routes at 1440 and 390 under `reduced_motion`: zero console errors,
  and a computed-style probe showing every text node resolving to Inter at one
  of the nine scale sizes and one of the two inks (plus the three sanctioned
  exceptions).
- **Files touched:** `tailwind.config.js`, `index.css`, `index.html`, `App.jsx`,
  all four pages, `Header Footer Button Badge SectionHeader ProjectCard
  RichText Figure Lightbox Cursor`, `casestudy/Blocks.jsx`, both charts.

### 2026-07-29 — footer redesign, literature card overflow
- **Footer** replaced the dark multi-column sitemap with a centred sign-off
  band on the light canvas: back-to-top control, `footer.heading` /
  `footer.subtext` from `portfolio.js`, a row of connect links (LinkedIn,
  email, Behance, résumé — each hidden until the fact exists), and
  `site.copyright`. External links carry the small ↗ arrow; the footer
  back-to-top uses the same arrow with a hover nudge. No floating back-to-top
  pill — scroll-up lives in the footer only.
- Case study's old inline `BackHome` buttons were removed; wayfinding is the
  header logo / nav plus the footer sign-off.
- **Literature cards** — `CSLiteratureCards` used a fixed `md:h-[460px]`; card
  03's wrapped citation spilled outside the border. Switched to
  `md:min-h-[460px]` + grid stretch so all three cards grow together.
- **Files touched:** `Footer.jsx`, `portfolio.js` (`footer` object),
  `casestudy/Blocks.jsx`, `CaseStudy.jsx`, `CLAUDE.md`.

### 2026-07-28 — case study rebuilt from the current Figma frame (`case-study`)
- Replaced the entire case-study page with the current MyFitnessPal frame
  (`46RjVrGHqQvJtK1uPSRdtH`, node `728:2865`, 1440 × 16574). Seventeen sections
  in the frame's order, each centred on **its own measure** — 593, 880, 928,
  948, 1000, 1003.76, 1158, 1182 — with the frame's uniform **104px** section
  rhythm and **24px** internal rhythm. Verified section-by-section against the
  frame: every `x` and `width` matches exactly, and every height matches to
  within 2–3px except the two noted below.
- Two paragraphs wrap one line differently from Figma: Problem 1 (Figma 3
  lines, Chrome 4) and the design-challenge question (Figma 3, Chrome 2). The
  family, size, weight, line height, tracking and box width are all verified
  identical to the frame's variables — Figma's text shaper simply breaks a few
  pixels differently. Not worth altering extracted values to chase.
- Tokens: added `cs-copy` (#575757), `cs-card`/`cs-card-border`, the sentiment
  and friction hues, the per-section `max-w-cs-*` measures, and `cs-gap` /
  `cs-stack`. Added Inter 700 (see the weights note above).
- `charts/SentimentPanel` and `charts/FrictionChart` are rebuilt at the frame's
  literal geometry (both 591px wide, 8–9px labels, bars in tenths of a pixel).
  **Their bar lengths are the lengths the frame draws, not value × a scale** —
  the frame's chart is drawn, not plotted, so don't "fix" them to be
  proportional. New `casestudy/ScaleToFit` scales those two panels as a unit
  below their natural width, which is how they stay exact on tablet/mobile.
- Assets re-exported from the frame at 2–3× into `public/images/myfitnesspal/`:
  `ui-teardown`, `repeat-journey`, `today-nutrition`, `day-navigation`,
  `batch-shortcuts`, `inline-diary-edit`, `prediction-card`, `add-more-card`,
  `hero-app-store`, `quote-mark.svg`. The teardown boards and prototype boards
  carry the frame's own card/border/radius baked in, which is why `Figure` no
  longer wraps anything in a card. Deleted the superseded exports.
- The prediction-card phone exports 4.613px larger on every side than its node
  box, because that device frame's stroke sits outside it — it renders at the
  export's size with a matching negative margin so the screen lands exactly
  where the frame puts it.

### 2026-07-27 — home thumbnail is the brand mark
- The MyFitnessPal home-card thumbnail is now the product mark on the
  product's blue (`thumbnail.webp`, 1600×900), not a prototype screenshot.
  Saturated blue is allowed here because it is the *subject's* colour on a
  project card — not Sakhi's palette, and not a full-bleed band on the case
  study page.
- Removed the case-study `cover` band entirely. The case study keeps only the
  small `appIcon` tile beside the title. Deleted the old phone-mockup
  thumbnail and the unused `cover.webp` path (content folded into
  `thumbnail.webp`).

### 2026-07-27 — MyFitnessPal case study
- Replaced the placeholder case-study template with the real MyFitnessPal case
  study, authored from the Figma PDF export. Nine sections: background,
  problem, design challenge, solution, discovery, research, the Today screen,
  repeat logging, testing outcomes.
- Built the pieces that case study needed: `RichText`, `Figure`, `Lightbox`,
  `casestudy/Blocks.jsx`, `charts/SentimentPanel`, `charts/FrictionChart`, plus
  `useInViewOnce` and `useActiveSection` in `lib/hooks.js`.
- Charts are rebuilt in the site's own palette (monochrome ramp + one pastel
  callout) rather than lifted from the PDF. **Prototype screens are shown
  as-designed and must not be restyled** — they are the deliverable.
- Prototype and journey figures extracted from the PDF into
  `public/images/myfitnesspal/` as WebP (each under 90KB).
- Home: third project removed, so the grid is two-up and the cards are larger;
  `ProjectCard` now renders a real thumbnail when a project has one.
- Removed `build-prompt.md` — the original build spec is superseded by this
  file and the `sakhi-portfolio-frontend` skill.

### 2026-07-27 — placeholder sweep, metadata, graceful gaps
- Every `[square bracket]` placeholder is gone from the rendered site. Real
  copy for `site`, `hero`, `work`, and the whole About page. Section headings
  that were hardcoded in JSX (`Explore my work`, `Where I studied`, `The things
  that define me`) now come from `portfolio.js` like everything else.
- Introduced the empty-means-hidden rule above and applied it across Header,
  Footer, Contact, and About, so the unknown facts below degrade to *absent*
  rather than to a dead link or an empty section.
- `index.html`: real title and description, plus Open Graph / Twitter card tags
  and a generated `public/og-image.png` (1200×630, set as type — the wordmark
  PNG is only 261px wide and upscales soft).
- Fixed the `fetchPriority` React 18 warning in `HeroImage` — lowercase
  attribute, spread so it's absent rather than `"auto"` off the LCP image.
  Console is now clean on every route.
- Added `caseStudy.appIcon` — a 64px rounded tile beside the title that hides
  itself when the file is absent. MyFitnessPal uses `app-icon.webp` (3.4KB).
  The same mark on the product's blue is the home-page project thumbnail
  (`thumbnail.webp`).
