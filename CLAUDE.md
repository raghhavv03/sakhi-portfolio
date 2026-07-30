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
  section below for the sanctioned exceptions.
- **All motion timing lives in `src/lib/animations.js`** (`EASE`, `DUR`) and
  **every CTA's size, motion and hover live in `src/lib/interactions.js`**
  (`CTA_SHAPE`, `CTA_ICON`, `CTA_HOVER`, `CTA_HOVER_FILL`,
  `CTA_HOVER_FILL_SOLID`). Those are the only durations, box sizes and hover
  states.
- **Empty means "don't render".** Every consumer of `portfolio.js` treats an
  empty string or empty array as a missing value and hides the affordance: no
  résumé URL hides the Resume button, no email hides every mailto, an empty
  `education` array hides that section, a photo with no `caption` simply never
  names itself. So leave a field empty until it's real — never a placeholder
  string, which ships as visible filler.
  **`PREVIEW_UNPUBLISHED` at the top of `portfolio.js` is the one exception**,
  and it is temporary: it feeds the still-outstanding links dead `#` hrefs so
  the placement of the Resume / Behance / shop controls can be reviewed at all.
  The hiding logic is untouched — flip it to `false` and they all vanish again.
  **It must be off before the site goes live**, or the site ships buttons that
  go nowhere. Email and LinkedIn are real values now and no longer pass through
  it.
- **The contact form posts to Formspree, and degrades to UI-only.**
  `contact.formEndpoint` in `portfolio.js` holds the `https://formspree.io/f/…`
  URL; Formspree forwards the fields to `contact.email`. There is no backend and
  no secret — the endpoint id is public by design. **Empty means UI-only**: the
  same form still validates and acknowledges, and its confirmation says nothing
  was delivered, rather than posting into nowhere and claiming success. A
  failed POST leaves the typed message in place, re-enables the button as "Try
  again", and names the mailto fallback. The hidden `_subject` / `_gotcha`
  inputs are Formspree's own (notification subject, honeypot).
- **Footer is a centred sign-off, not a sitemap.** Copy lives in `footer` +
  `site.copyright`; the connect row is a set of round hairline icon buttons
  assembled from `links` and `contact.email` inside `Footer.jsx`, each hidden
  until real. "Say hello" → `/contact` is the one that never hides, so the row
  is never empty — except on `/contact` itself, where it becomes a real
  `<button>` that scrolls back to the form, because a link that lands you where
  you already are reads as broken. Back to top is footer-only — no floating
  control. **It is the one band that does not take the page's section rhythm**
  (`py-10 md:py-12`, not `py-section*`): a full section band under a page that
  has already ended reads as a second empty screen. **The résumé is not in the
  footer** — the header already carries it, and repeating a header action in
  the sign-off is redundancy, not convenience.

```
src/
  App.jsx                    ThemeProvider + Router + Header/Footer/Cursor shell
  pages/                     Home · About · Contact · CaseStudy
  components/
    Header Footer Cursor Button Badge SectionHeader ProjectCard
    Logo.jsx                 the SR monogram, inline SVG on `currentColor`
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
    interactions.js          CTA_SHAPE, CTA_ICON, CTA_HOVER, CTA_HOVER_FILL,
                             CTA_HOVER_FILL_SOLID — every CTA's size + hover
  data/portfolio.js          every string on the site
```

---

## Conventions that are easy to get wrong

- **Every CTA is the same box, and the box is one import.** `CTA_SHAPE` (a
  44px-minimum pill: `min-h-[44px] px-6 py-2 text-body-sm font-semibold`) and
  `CTA_ICON` (the same 44px made square) in `src/lib/interactions.js` are what
  the pill `Button`, the header `ThemeToggle`, the footer's round icon buttons
  and the contact form's submit all size themselves from — so the header's
  toggle, Resume and LinkedIn are one 44px row rather than three near-misses.
  `CTA_SHAPE`'s `py-2` sits *under* the 44px floor on purpose: at `body-sm` the
  padding alone makes a 47px pill, three taller than the icon buttons beside
  it. Let `min-h` set the height.
- **Every CTA hovers identically, and the hover is one import.** `CTA_HOVER`
  carries the motion — **a colour move only: no zoom, no lift, no shadow, no
  pointer-tracking drift** (the `Magnetic` component is deleted; do not
  reintroduce a second hover mechanism, and do not reintroduce a
  `hover:scale`/`active:scale` transform — it was tried and removed because it
  read as a "magnifying" effect the buttons didn't need). The focus ring rides
  along in the same string. It is **CSS, not a Framer `whileHover`**, because
  half those controls are plain `<button>`/`<a>` elements — one mechanism is
  the only way "consistent" survives the next control someone adds. A new CTA
  imports the strings; it does not write its own hover.
- **There is no accent colour, and a CTA hovers into the theme's own ink.**
  The palette is two inks and its surfaces; hover is a move *inside* it, not a
  hue that exists nowhere else on the page. `CTA_HOVER_FILL` fills with `text`
  and flips the label to `bg` — the same pairing the primary pill and the
  cursor pill already rest at. The primary pill already rests there, so it
  cannot hover to it: `CTA_HOVER_FILL_SOLID` softens it to `text-muted`
  instead. Measured on the hovered fill: **16.3:1 light / 15.3:1 dark**
  (outline) and **8.9:1 light / 8.8:1 dark** (solid). The `accent` /
  `accent-hover` tokens are **gone** from `index.css` and `tailwind.config.js`
  — do not reintroduce a pastel-blue hover, in either theme. Focus rings are
  the heading ink — `focus-visible:ring-2 focus-visible:ring-text/25
  focus-visible:ring-offset-2` everywhere. The lightbox is the one control set
  outside this, because it sits on the fixed dark band: it hovers to
  `dark-text` with `dark-bg` ink, the same rule in that band's fixed tokens.
- **The header's LinkedIn and Resume pills are the exact same control.** Both
  render `Button` with `variant="secondary"` — same rest colour, same hover
  fill, same everything. `Button`'s `primary` variant (solid ink fill) still
  exists in `interactions.js`/`Button.jsx` as the filled option, but nothing
  currently uses it; don't reach for it in the header without a reason, since
  the whole point here is that the two pills read as one pair, not two
  different weights of emphasis.
- **`lamp` is the hero lamp's own light, not an accent.** Its one
  remaining job is the journey trail's milestone glow. The lamp in the hero is
  lit by the artwork, not by this token — nothing is painted over the lamp.
  Never type, never a surface.
- **Never add a `dark:` colour class.** If something looks wrong in dark mode
  the token is wrong, not the component. There are **no** sanctioned
  exceptions: the last one was the wordmark PNG, and the mark is an inline SVG
  on `currentColor` since.
- **Nothing is painted over the hero lamp.** No halo, no hover ring, no
  caption pointing it out. The glow in dark mode is the artwork's own, and the
  cursor label is how the lamp announces itself.
- **The hero wash is measured, not eyeballed, and it is deliberately partial.**
  Two frames painted in two lights already do most of the work — the day room's
  wall is cream, the night room's near-black, so `text` / `text-muted` land the
  right way round on their own. The gradient only has to carry the copy across
  the potted plant and the shadowed wall it crosses, so it tops out at 85% and
  **clears completely by 70% of the width**: the lamp, the shelf and the whole
  right side of the picture are untouched. At those values the heading holds
  7.6:1 and the paragraph 4.6:1 at their *worst* pixel, with no part of either
  box under 4.5:1. If you move the hero copy or reshape the wash, re-measure —
  draw the live frame to a canvas, composite the gradient's alpha at each x, and
  check the boxes the copy actually occupies. Do not just make the gradient
  darker until it looks fine; that is what washes the picture out. Confining it
  to the left 58% was tried and *hurt*: the paragraph's right end reaches 46%.
- **The header keeps a frosted bar even over the hero.** The nav sits over the
  *window*, where the sky is 0.9 luminance and the tree canopy 0.08 — no single
  ink survives both, and the wash cannot reach that far right without covering
  the part of the artwork worth showing. Measured without the bar, "Contact"
  has ~11% of its box under 4.5:1; with it, every nav item clears 6.9:1.
- **The cursor pill is the site's ink inverted** — `bg-text` with `text-bg`, the
  same pairing the primary button uses, so it flips with the theme and reads as
  part of the page — the same pairing every outlined CTA now hovers into. It is
  not a pastel and not a vivid blue; both read as an extra colour dropped on
  top. 15.5:1 in both themes.
- **Two font weights only** — 400 and 600, no exceptions. Sentence case
  everywhere.
- **The only text that is neither `text` nor `text-muted`** is: type inverted
  on a coloured brand band (`text-on-brand` over `mfp-blue` — white in both
  themes, because the fill under it does not change), the case study's
  one blue framing question (`cs-quote`), the two research panels' data
  hues, and About's photo caption pills (`caption-ink` on `caption-1..5`).
  Everything else — including every case-study heading, label and
  caption — uses the two site colours. A new grey is not an option; if
  something needs to recede further, make it smaller.
- **The photo caption pills are the Figma frame's five highlighter hues**
  (#FFFB00 #6FC8FF #54FFA1 #FFA96B #FB80FF on #1E1E1E), fixed in both themes —
  a highlighter does not change colour when the lights go out, which is why the
  ink on them is fixed too. They live only in `PhotoStack`, are `lg:` only
  (below that a caption is plain copy under the photo, not a pill), and each
  group starts at a different offset into `HUES` so no two open on the same
  colour. No border: a hairline on a saturated fill is an outline the frame
  never drew.
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
- **The cursor pill follows the attribute, not the pointer.** A control that
  flips state rewrites its own `data-cursor` (the lamp and the header toggle
  both read "Night mode" / "Day mode" — the theme you would *get*), so
  `Cursor.jsx` watches `data-cursor` with a `MutationObserver` and re-reads
  `elementFromPoint` at the last known pointer position. Do not replace that
  with a click handler: a click fires before React commits, so the pill would
  show the old label until the pointer next moved. The observer is also why it
  still works when `requestAnimationFrame` is throttled in a hidden tab.
- **`Trail` must never key anything off `trackRef` being present.** That ref
  belongs to an *ancestor* in `Journey`, and React attaches refs bottom-up, so
  it is still null while `Trail`'s own layout effect runs. So the measurement
  observes the **rail** — `Trail`'s own node, always attached, and `inset-y-0`
  inside the track so its height *is* the track's height — and reads the track
  lazily inside `measure`. The ResizeObserver's first callback is what actually
  measures; the synchronous call is only an optimisation. `useScroll` needs
  `layoutEffect: false` for the same reason, or Framer warns that the target
  "is not yet hydrated" and silently falls back to the whole page. Do not
  "simplify" this back to an early `if (!track) return` with two stable refs as
  deps: that bail-out is permanent and the trail never draws.
- **The trail's curve is four constants**, all in `Journey.jsx`: `BEND_MAX` (96)
  caps the sweep, `BEND_RATIO` scales it down on a narrow rail, `BELLY` (0.62)
  is how vertically each belly leaves and rejoins the centre line, and
  `MAX_SPAN` (620) is when a gap gets subdivided. The rail is `md:w-56` — the
  full 14rem gap between the card columns — so at 1440 the curve swings 72px off
  centre and still never runs under a card. Raising `MAX_SPAN` is what stopped
  it reading as a chain of arcs; more bends is what makes it look busy.
- **The case study's chart bars are the Figma frame's drawn lengths, not
  value × a scale.** That chart is drawn, not plotted — don't "fix" the bars to
  be proportional. Charts grow via `useInViewOnce` + a CSS transition, not a
  Framer in-view gesture — one observer per chart so all bars move together.
  The friction chart grows with `scaleX`, not `width`, because its labels are
  right-aligned in a shared grid and animating width would re-measure them.
  `casestudy/ScaleToFit` scales both panels as a unit below their natural width.
- **Prototype screens are shown as-designed and must not be restyled** — they
  are the deliverable.
- Every image needs explicit `width`/`height` and `alt`. Below-the-fold images
  lazy-load.
- **A stacked photo card must not move out from under the pointer.** In
  `PhotoStack` a lifted card keeps its `x` in the spread and only rises,
  straightens and scales. Sliding it back to centre un-hovers it, which slides
  it back, which re-hovers it — a card that flickers forever. Same reason a
  pile opens on the *group's* `pointerenter`, not a card's: at rest every card
  but the top one is buried, so opening on the card leaves the rest unreachable.

---

## Sources

- About page + footer copy and photographs: the "Website changes" Figma file,
  `dZb2Q6tMIGKgg2Xozpb1Nk`, frame `2023:105`.
- Case study: the MyFitnessPal frame `46RjVrGHqQvJtK1uPSRdtH`, node `728:2865`
  (1440 × 16574). Section measures are the frame's own: `cs-prose` 948,
  `cs-wide` 1003.76, `cs-full` 1182. A few paragraphs wrap one line differently
  from Figma — the family, size, weight, line height, tracking and box width are
  all verified identical, Figma's text shaper simply breaks a few pixels
  differently. Not worth altering extracted values to chase.
- Hero + Journey structure: a Stitch frame ("The Designer's Odyssey"). The
  palette is that frame's warm-cream *character* applied to this site's own
  token roles, not its material palette.
- The prediction-card phone export is 4.613px larger on every side than its
  node box (that device frame's stroke sits outside it), so it renders at the
  export's size with a matching negative margin.

---

## Open work

**Turn this off before launch:**
- `PREVIEW_UNPUBLISHED` in `portfolio.js` is `true`, which is why Resume,
  Behance and "Visit Crochet Curio" are all visible right now. They are dead
  `#` hrefs, on for layout review only. Setting it to `false` restores the
  empty-means-hidden behaviour; supplying the real values below makes the
  switch irrelevant. Email and LinkedIn are real and no longer go through it.

**Needs one paste, then the form delivers:**
- `contact.formEndpoint` in `portfolio.js` is empty, so the contact form is
  still UI-only. Create a Formspree form pointed at `sakhiiirana@gmail.com`,
  confirm the address in the email Formspree sends, and paste the
  `https://formspree.io/f/<id>` URL in. Both branches of the submit are already
  built and tested — nothing else changes.

**Blocked on facts only Sakhi has:**
- `links.behance` in `portfolio.js`. (`contact.email` and `links.linkedin` are
  in — `sakhiiirana@gmail.com` and the `sakhi-rana-717548212` profile.)
- `resume.pdf` into `public/`, then `links.resume = '/resume.pdf'`.
- `about.education` entries — `{ institution, qualification, years }`. The
  About copy already says "an MBA in Marketing, 2025", so the institution is
  the only missing fact.
- Case-study `meta` has no timeline; the source PDF's Timeline field was blank.
- `about.background.link` — the Crochet Curio shop URL. The copy names
  `@crochetcurioo` but nothing links to it, and inventing the URL is not ours
  to do. Fills the "Visit Crochet Curio" button.
- Two of the three cats and two of the four trip photos have an empty
  `caption`, so those cards never name themselves. Fine as-is; better with her
  words.

**Doable without her:**
- Per-route `<title>` / description — every route shares `index.html`'s, so a
  shared case-study link previews as the home page.
- Absolute `og:url` / `og:image` once the production domain is settled.
- Project two, still a `coming-soon` placeholder.
- The "About me" badge over About's intro is ours rather than hers — the two
  other invented kickers on that page are already gone.
- Route-level code splitting — bundle is ~378KB / 121KB gzipped, most of it
  Framer Motion; the case study is the only page that needs the heavy parts,
  and it's also the LCP-heaviest route (hero is a single 107KB WebP — a
  `srcset` would pay for itself).
- Home loads **both** hero scenes (the inactive one lazily). A ~60KB AVIF is
  cheap, but a `<link rel="prefetch">` on the other theme, or dropping the
  eager frame once switched, would be cheaper.
- Charts' internal labels sit on `text` rather than `text-muted` — deliberate
  at 8–12px inside `ScaleToFit`, but worth a look if the panels are redrawn.
- `public/og-image.png` is still the old wordmark set as type, so a shared link
  previews a mark the site no longer uses. Regenerate it from the monogram.
- The favicon repeats the monogram's path data and hardcodes both ink values,
  because a tab icon cannot read `currentColor` or a CSS variable. Two copies of
  the same paths is the cost of that; if the mark changes, change both.
- `DUR.tap` is dead now — harmless, but it can go with the next tidy.
  (`Button`'s unused `dark` variant is already gone.)

**Copy that is a first draft, not Sakhi's own words:** `site.bio`,
`hero.opening`, `contact.invite`, and the whole `journey` block — its four
chapters are written from the Stitch frame's outline (crochet → shop → MBA →
UX), so the dates, the order and the wording all need her confirmation. **The
entire `about` block and `footer` are hers**, lifted verbatim from the Figma
file; the only strings on that page we wrote are the "About me" badge and the
image `alt` text.

---

## Progress log

Newest first, one entry per session — what shipped, and only what a later
session could not read off the code.

### 2026-07-30 — CTA hover loses its zoom, LinkedIn becomes Resume's twin
The zoom (`hover:scale-[1.03]`, `active:scale-[0.98]`) came out of `CTA_HOVER`
site-wide — it read as a magnifying effect the buttons didn't need, and every
CTA shares the one import so removing it there was the whole fix. The header's
LinkedIn pill switched from `Button`'s `primary` variant (solid ink fill) to
`secondary` — the exact same variant Resume already uses, so the two pills are
now one control rendered twice: identical rest colour, identical hover fill,
nothing left to compare.

- **Verified** with `npm run lint`, `npm run build`, and a dev-server pass:
  read the live computed classes on both header pills (byte-identical
  `className`; no `scale`/`transform` anywhere on any CTA site-wide) and
  screenshotted the header.
- **Files touched:** `src/lib/interactions.js`, `Button.jsx`, `Header.jsx`,
  `pages/Contact.jsx` (dropped a now-dead `disabled:hover:scale-100`),
  `CLAUDE.md`.

### Earlier sessions — what they settled
Condensed; the reasoning that still matters is in **Conventions** above.

- **2026-07-30** — every CTA's size and hover unified behind
  `src/lib/interactions.js` (`CTA_SHAPE`/`CTA_ICON` for a shared 44px box,
  `CTA_HOVER`/`CTA_HOVER_FILL`/`CTA_HOVER_FILL_SOLID` for one hover
  mechanism); `Magnetic.jsx` deleted; the `accent` token removed in favour of
  hovering into the theme's own ink; the contact form wired to Formspree
  (endpoint still blank, pending Sakhi); real email/LinkedIn facts landed; the
  footer shrank ~165px and lost its Resume button.
- **2026-07-30** — the hero wash re-tuned by measurement and the copy centred
  again; cursor pill switched to `bg-text`/`text-bg`; the trail's four curve
  constants tuned to their current values (verified by sampling the rendered
  path: every milestone within 0.3px, largest tangent turn 8.5°, never under a
  card); two `Trail` ref-timing bugs fixed; `PREVIEW_UNPUBLISHED` added; the
  case-study thumbnail became the two-phone render on MyFitnessPal blue.
- **2026-07-30** — everything painted over the hero artwork removed (lamp halo,
  breathing animation, hover ring, tooltip, the "tap the lamp" hint); cursor
  labels became the destination state and flip via `MutationObserver`; the
  header mark became `Logo.jsx` (inline SVG on `currentColor`), retiring the
  site's last `dark:` class and both logo PNGs; About's caption pills took the
  Figma frame's five hues.
- **2026-07-30** — About rebuilt from the Figma frame in Sakhi's own words and
  photographs; `PhotoStack` (fan / pile / lift-to-name, scrolling strip below
  `lg`) and `useLargeScreen()` added; footer became the frame's centred
  sign-off; the journey trail's path became measured rather than a hardcoded
  `d`; `optimize:about` added. Deleted `Doodle.jsx`.
- **2026-07-29** — light + dark themes (CSS-variable palette, `darkMode:
  'class'`, `ThemeProvider`, pre-paint inline script, 400ms cross-fade), the new
  two-frame hero with the lamp as the switch, and the Journey section.
  Superseded `HeroImage.jsx` and the old hero exports.
- **2026-07-29** — the case study and the rest of the site stopped being two
  design systems: two inks, one nine-step scale, one family, two weights, one
  rhythm, three section measures. Deleted the whole `cs-*` colour/size block
  and `font-cs`. Line heights raised a step across the scale.
- **2026-07-28** — the case study rebuilt section-by-section against the current
  Figma frame, with both research charts redrawn at the frame's literal
  geometry and all assets re-exported at 2–3×.
- **2026-07-27** — the MyFitnessPal case study first authored; `RichText`,
  `Figure`, `Lightbox`, `casestudy/Blocks.jsx` and both charts built for it;
  home's grid dropped to two-up. Every `[square bracket]` placeholder removed
  site-wide and the empty-means-hidden rule introduced; real metadata + OG tags
  added.
