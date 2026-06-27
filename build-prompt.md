# Portfolio website — build spec

Build a personal portfolio website for a UI/UX / Product Designer. Multi-page, minimal, editorial. Production-quality, responsive, accessible, and fast.

Everything in `[SQUARE BRACKETS]` is placeholder content to be filled in. The hero illustration is supplied separately as `hero-illustration.png` — leave a responsive image slot for it.

## Tech
React + Tailwind CSS + Framer Motion (for scroll reveals and the custom cursor) + React Router for client-side routing. A short home page (hero, brand strip, projects), with About, Contact, and each case study as their own routes. Each project's case study is its own route (e.g. `/work/[project-slug]`) so clicking a thumbnail opens it instantly with no full page reload. If you can't use Framer Motion, use CSS transitions and a small vanilla JS cursor — but keep all motion subtle.

## Design system (use exactly these tokens)
Light is the primary theme; the contact/footer section is a dark band (like a premium footer).

**Light surfaces**
- Page background: `#FAFAF8` (off-white — never pure white)
- Cards / raised surfaces: `#FFFFFF`
- Primary text: `#1A1A1A` (off-black — never pure black)
- Secondary text: `#6B6B6B`
- Hairline borders: `#E6E6E2` (barely visible)

**Accent (pastel blue) — used in combination with the neutrals, sparingly**
- Pastel blue: `#A7C7E7`. It has two roles only: (1) accent fills inside the hero illustration / vector art, and (2) the **hover state** for buttons and interactive elements.
- Buttons by default use the neutral scheme — an off-black `#1A1A1A` fill with off-white text (primary) or a hairline outline (secondary) — and shift to a pastel-blue fill/wash on hover. Text/icons sitting on a pastel-blue surface are `#1A1A1A` (dark — pastel blue is too light for white text).
- **Text is never blue.** All text uses the colors already defined: primary `#1A1A1A`, secondary `#6B6B6B` (light text in the dark band). Links are off-black, distinguished by weight or an underline, not color.
- Section badges stay neutral (hairline outline pills), not blue.

**Dark band (contact + footer section only)**
- Background: `#121212`
- Raised surface within it: `#1C1C1E`
- Text: `#EDEDED`
- Secondary text: `#A1A1A1`
- Border: `#2A2A2C`

**Typography** — use **SF Pro Text** with only two weights: Regular (400) and Semibold (600). Headings and the hero use Semibold; body and captions use Regular. SF Pro is Apple's system typeface — it is not on Google Fonts and is absent from Windows/Android by default, so set the family as `font-family: "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, sans-serif;`. This renders as SF Pro on Apple devices and degrades to the matching system sans elsewhere; if you want pixel-identical rendering on every platform, self-host SF Pro under Apple's license or substitute Inter. The hero headline is huge, Semibold, with tight leading — the single biggest element on the page. Sentence case everywhere; never ALL CAPS, never Title Case. Body line-height ~1.7.

**Layout & spacing** — generous whitespace, max content width ~1200px centered, consistent vertical rhythm between sections. Section labels are small pill badges (e.g. a rounded outline pill reading "About Me", "Portfolio") sitting above each section's heading.

**Responsive (required) — the site must adapt fluidly to desktop, tablet, and phone**
- **Desktop (≥ 1024px):** full layouts as described — projects 3 per row, hero name beside the illustration, header shows all buttons inline.
- **Tablet (768–1023px):** projects 2 per row; hero may keep side-by-side if it fits or stack; comfortable padding reduced from desktop; header buttons still inline (condense spacing).
- **Phone (< 768px):** single column throughout — projects 1 per row, hero name and illustration stacked (name first), footer buttons wrap into a tidy stacked group. Collapse the header nav into a hamburger menu that opens a simple full-width panel with Home, About, Contact, Resume, LinkedIn. Tap targets ≥ 44px. The hero name scales down with viewport (use fluid `clamp()` sizing) so it never overflows.
- Use a mobile-first approach with fluid type (`clamp()`) and percentage/`max-width` containers; test at 1440px, 768px, and 375px. No horizontal scrolling at any width.

**Motion** — subtle only. Content fades and rises slightly on scroll into view. Cards lift gently on hover. One auto-scrolling marquee (see brand strip). Respect `prefers-reduced-motion`: when set, disable reveals, marquee, and cursor trailing.

## Custom cursor (desktop only — this is important)
Replace the native cursor on pointer devices with a small custom cursor: a `10px` filled dot in a **vivid blue `#2563EB`** (chosen to stand out and catch the eye — it's the bold sibling of the site's pastel-blue accent), trailed by a thin `30px` ring in the same blue that lags slightly (spring). On hover over any element marked as interactive-important, the cursor expands into a pill — vivid blue `#2563EB` fill with white text — that displays a short guiding label next to/around the pointer, animated with a soft spring. Use a `data-cursor` attribute to set each label. The vivid blue reads clearly on both the off-white canvas and the `#121212` dark band, so the same color is used throughout.

Apply these labels:
- Hero area (the illustration + opening line), for a first-time visitor → `Scroll ↓` — gently nudges them to scroll down to the projects
- In-progress project thumbnail → `Coming soon`
- Live project thumbnail → `View case study`
- Email address / contact email → `Email me`
- Resume button → `View resume`
- LinkedIn button → `Open LinkedIn`
- Back-to-home button (in the footer on every page, and at the top of case-study pages) → `Back home`
- Each social icon → the platform name (e.g. `LinkedIn`, `Behance`)
- Primary contact CTA ("Let's connect" / "Hire me") → `Let's talk`
- External company/brand logos (if linked) → `Visit`

Hard requirements for the cursor:
- On touch devices / when no fine pointer is present, do NOT hide the native cursor and do NOT render the custom one. Detect with `(pointer: fine)`.
- The cursor label is decorative. Every element it labels MUST also carry a real, visible affordance for keyboard and screen-reader users: proper link text and/or an `aria-label` (e.g. the coming-soon project has `aria-label="FitnessPal — coming soon"` and is not a dead link). Never rely on the cursor label alone to convey meaning.
- Disable the trailing ring under `prefers-reduced-motion`.

## Site structure — a multi-page site (keep each page short; avoid long scrolling)
Routes: `/` (home), `/about`, `/contact`, and `/work/[slug]` (one per case study). Use client-side routing so every page opens instantly. The header and footer below appear on **every** page.

**Global header (every page)** — name/logo `[YOUR NAME]` on the left, linking to home. Center or right: nav buttons `Home`, `About`, `Contact` that route to those pages (the current page's button is shown as active). Far right: a `Resume` button that **opens your résumé PDF in a new browser tab for viewing** (browser's built-in PDF viewer — not a download), and a `LinkedIn` button that opens your profile in a new tab (`[linkedin URL]`). Transparent over the home hero, solid subtle background elsewhere and on scroll.

**Global footer (every page, dark band `#121212`)** — light text. Contains the full set of buttons again so the visitor never has to scroll back up: `Home`, `About`, `Contact`, `Resume` (view), `LinkedIn`, and `[Email]` (with the `Email me` cursor) plus social icons. Include a clear **back-to-home button** (e.g. `← Back to home`) that always returns to `/`. Left side: name/logo + one-line bio. Bottom line: `© 2026 [NAME] · all rights reserved`.

---

### Home page (`/`) — deliberately short
**1. Hero (the first thing visible)** — lead with your name `[YOUR NAME]` in the huge display weight, dominating the view with tight leading; the single biggest element on the page. Directly beneath it, an opening line describing what you do, fully visible the moment the site loads — no scroll, no animation delay: `[Hi, I'm [NAME] — a product designer solving complex problems through smart, human experiences.]` To the right (or beside it), the custom illustration asset (`hero-illustration.png` is provided — leave a responsive image slot; on mobile it stacks above or below the name). One primary CTA button (off-black fill, pastel-blue hover) → routes to `/contact`. While the pointer is in this area on first view, the cursor shows the `Scroll ↓` hint.

**2. Brand / tools strip (optional, one row)** — a single horizontal auto-scrolling row of soft rounded pills with logos of tools you use or companies you've worked with. Slow, infinite, pauses on hover. Label honestly ("tools I work with" vs "worked with"). Keep it to one row so the home page stays short. `[LIST: Figma, etc.]`

**3. Portfolio grid** — pill badge "Portfolio"; heading `[Explore my work]`; a responsive grid of project cards (3 per row on desktop, 1 on mobile). Each card: an image thumbnail with the project name on it (clear at a glance what it is), and a short one-to-two-line description directly beneath the thumbnail. Clicking the thumbnail instantly opens that project's case-study page. Live thumbnails show the `View case study` cursor; the in-progress project (`[FitnessPal]`) is non-clickable, shows a subtle "In progress" badge, and shows the `Coming soon` cursor + an `aria-label`. `[LIST PROJECTS: name, one-line description, live/coming-soon, thumbnail image]`

That's the whole home page — hero, a single brand row, and the projects. Keep it tight.

---

### About page (`/about`)
**A1. Intro** — pill badge "About Me"; large statement heading `[Design has always been more than just a job — it's my passion.]`; a short supporting paragraph about who you are `[short paragraph]`. Optionally pair with a photo or the hero illustration.

**A2. Schooling / education** — pill badge "Education"; a clean, compact list or short timeline of your schooling and studies. Each entry: institution, what you studied/qualification, and years. Keep it brief — a few lines, not a long scroll. `[School / degree / field / years]`

**A3. Passion project — Crochet Curio** — pill badge "Passion Project"; heading `Crochet Curio`; a paragraph on what it is and why it matters to you `[describe Crochet Curio]`, alongside an image or small gallery of the work `[image(s)]`. If it has its own page or shop, include a link button (with a `Visit` cursor).

**A4. Personal interests** — pill badge "Beyond design"; a warm, lightweight section on the things that define you outside work — crochet, your cat and dog, plants, photography, and kathak (≈10 years of classical training). Present as a few short blurbs or a small set of cards, ideally echoing the doodle motifs from the hero illustration. `[short blurbs per interest]`

*(Services, experience timeline, and testimonial are intentionally not on this page. Your work history lives in the résumé, which is one click away via the Resume button.)*

---

### Contact page (`/contact`)
**C1.** Huge headline `Let's connect`; a short line inviting people to reach out `[one line]`. A simple contact form (`[name, email, message]`) or, if you prefer no form, a large `Email me` button. A `Hire me now` pill button (shows the `Let's talk` cursor). Your `[Email]`, `[Phone]` (optional), and social buttons including a clear `LinkedIn` button. Keep this page short and direct.

---

### Case-study page (`/work/[slug]`) — opens when a live thumbnail is clicked
A prominent `← Back to home` button at the top-left (in addition to the global header). Structure each case study around four parts: the challenge (problem + constraints), your specific contribution, key design decisions and the reasoning behind them, and measurable outcomes. Lead with the problem and the result before the process. Alternate full-width process visuals with outcome screens; readable on mobile. `[Per project: title, role, challenge, contribution, decisions, outcomes, images]`

## Performance & accessibility (required)
- Lazy-load all images below the fold; set explicit width/height on every image to prevent layout shift (target CLS < 0.1).
- Optimize the hero illustration and any photos to AVIF/WebP, hero asset under ~150KB; target LCP under 2.0s.
- All text meets WCAG AA contrast (body ≥ 4.5:1). The tokens above already pass.
- Fully keyboard-navigable; visible focus states using an off-black `#1A1A1A` outline (pastel blue is too low-contrast against the off-white to serve as a focus indicator); semantic HTML; alt text on every image.
- Mobile-first; verify the layout at 375px width.
