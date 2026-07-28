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

`npm run optimize:hero` regenerates the responsive hero illustration from
`assets/hero-illustration.png` into AVIF + WebP at three widths.

---

## Architecture

- **React + Vite**, **Tailwind** for styling, **Framer Motion** for motion,
  **React Router** for routing. No backend — the contact form is UI-only.
- **All copy lives in `src/data/portfolio.js`.** Components never hardcode
  content. If a change is wording, it is a data change, not a component change.
- **All colour lives in `tailwind.config.js`** (mirrored as CSS variables in
  `src/index.css` for raw-CSS needs like the cursor). No ad-hoc hex in
  components.
- **All motion timing lives in `src/lib/animations.js`.** `EASE` and `DUR` are
  the only curves and durations on the site.
- **Empty means "don't render".** Every consumer of `portfolio.js` treats an
  empty string or empty array as a missing value and hides the affordance: no
  résumé URL hides the Resume button, no email hides every mailto, an empty
  `education` array hides that section, no Crochet Curio images lets the copy
  span full width. So leave a field empty until it's real — never a placeholder
  string, which ships as visible filler.

```
src/
  App.jsx                    Router + Header/Footer/Cursor shell
  pages/                     Home · About · Contact · CaseStudy
  components/
    Header Footer Cursor Magnetic Button Badge SectionHeader Doodle
    ProjectCard HeroImage
    RichText.jsx             **bold** inline emphasis for copy from the data file
    Figure.jsx               case-study visual + Enlarge affordance
    Lightbox.jsx             full-bleed image viewer (Esc / backdrop / focus return)
    casestudy/Blocks.jsx     Section, PairCards, InfoCards, Question, Note,
                             StatRow, CompareColumns, Subheading
    charts/                  SentimentPanel, FrictionChart
  lib/
    hooks.js                 useFinePointer useReducedMotion useReveal
                             useInViewOnce useActiveSection
    animations.js            EASE, DUR, fadeUp, stagger
  data/portfolio.js          every string on the site
```

---

## Conventions that are easy to get wrong

- **Text is never blue.** Pastel blue (`accent`) has exactly two jobs: hover
  states and the hero illustration's fills. The vivid `cursor` blue is the
  cursor only. Focus rings are off-black.
- **Two font weights only** — 400 and 600. Sentence case everywhere. The one
  exception is the case-study page, whose Figma source sets inline emphasis in
  Inter Bold (700); that weight exists for `font-cs` and nothing else.
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

---

## Progress log

Newest first. Add an entry per working session — what shipped, and what the
next session should pick up.

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
- **Next:** the hero is the LCP image on this route and is still a single
  107KB WebP; a `srcset` would pay for itself. Route-level code splitting is
  still open, and now matters more — this page is much heavier than the rest.

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

**Copy that is a first draft, not Sakhi's own words** — worth a read-through
and edit: `site.bio`, `hero.opening`, `contact.invite`, `about.statement`,
`about.paragraph`, `about.crochetCurio.paragraph`, and all six
`about.interests` blurbs.

**Next suggested steps**

*Blocked on facts only Sakhi has:*
1. `contact.email`, `links.linkedin`, `links.behance` in `portfolio.js`. Until
   these land, the site has no way to reach her except the form — which isn't
   wired to anything (see 4).
2. `resume.pdf` into `public/`, then set `links.resume = '/resume.pdf'`. The
   Resume button is hidden in the header, mobile panel, and footer until then.
3. `about.education` entries — `{ institution, qualification, years }`.
4. Case-study `meta` has no timeline; the PDF's Timeline field was blank.

*Doable without her:*
5. **Wire the contact form.** It's UI-only and says so in its confirmation
   text. Formspree or a Vercel function is an afternoon.
6. **Per-route `<title>` and description.** Every route currently shares the
   index.html title, so a shared case-study link previews as the home page.
7. **Absolute `og:url` / `og:image`** once the production domain is settled —
   most scrapers won't resolve the relative path currently in `index.html`.
8. **Crochet Curio photos** (`about.crochetCurio.images`) — the section reads
   as copy-only without them, and it's the most visual thing on the page.
9. **Project two**, still a `coming-soon` placeholder awaiting real content.
10. **Route-level code splitting.** The bundle is ~355KB / 113KB gzipped, most
    of it Framer Motion, and the case study is the only page that needs the
    heavy parts.
11. `public/logo.png` (gradient wordmark) is unreferenced — `logo-wordmark.png`
    is the one the header uses. It's a distinct colourway, not a duplicate, so
    it was kept. Delete it or find it a job.
