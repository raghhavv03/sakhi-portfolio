# Product Requirements — Sakhi Rana Portfolio

Personal portfolio site for Sakhi Rana, a UI/UX and product designer. The site
itself is a work sample: craft, restraint, and one signature interaction are
part of the pitch.

---

## 1. Overview

| | |
|---|---|
| **Product** | Static personal portfolio (no backend) |
| **Owner** | Sakhi Rana |
| **Primary devices** | Phone first; desktop second |
| **Primary visitors** | Hiring managers and recruiters |
| **Hosting** | Static (Vite build; Vercel-ready) |

The site presents who Sakhi is, how she got here, a deep case study, and a way
to get in touch — without marketing clutter or a second design system for the
case study.

---

## 2. Goals

1. **Make a strong first impression on a phone** — first viewport and navigation
   must work without a desktop mindset.
2. **Show craft through the UI** — calm layout, consistent type and colour,
   thoughtful motion; no decorative noise.
3. **Prove design process** — at least one full case study (MyFitnessPal)
   with research, process, and outcomes.
4. **Make contact easy** — clear path to email / form; LinkedIn and résumé
   when available.
5. **Ship as a coherent brand** — light and dark themes, one type family,
   one CTA language, empty fields hidden until real.

### Success looks like

- A recruiter can understand role, taste, and depth of work in under two
  minutes on a phone.
- The custom cursor label (desktop fine-pointer only) feels intentional, not
  gimmicky.
- Contact works (Formspree or clear mailto fallback).
- No placeholder copy or dead links ship to production.

---

## 3. Audience & jobs-to-be-done

| Who | Job |
|---|---|
| Hiring manager / recruiter | Decide whether to interview; skim work and tone |
| Design peer / hiring loop | Evaluate process depth via the case study |
| Sakhi | Keep copy and links in one data file; update without a CMS |

---

## 4. Scope

### Routes

| Path | Purpose |
|---|---|
| `/` | Hero (illustrated room + theme lamp), journey trail, work grid |
| `/about` | Bio, background, photo stacks, education when present |
| `/contact` | Invite + form (Formspree when endpoint set) |
| `/work/:slug` | Case study (live projects only) |

### In scope features

- **Light / dark theme** — OS preference by default; explicit choice in
  `localStorage`. Hero lamp and header toggle share one switch.
- **Custom label cursor** — decorative; gated on `(pointer: fine)`; every
  `data-cursor` control also has real text or `aria-label`.
- **Journey** — scroll-drawn trail + four chapters on Home.
- **Work cards** — live projects link to case studies; coming-soon projects
  are non-clickable with clear state.
- **About PhotoStack** — fan / pile on large screens; horizontal strip below
  `lg`.
- **Case study** — structured sections, figures with lightbox (transform pan /
  pinch), research charts.
- **Contact form** — client-side validation; posts to Formspree when
  `contact.formEndpoint` is set; otherwise UI-only with honest confirmation.
- **Footer** — centred sign-off + icon connect row (not a sitemap). Résumé
  lives in the header only.

### Out of scope (non-goals)

- CMS, auth, accounts, or a backend of any kind
- Blog, shop, or multi-author content
- Required analytics / cookie banners (may add later without changing product
  shape)
- Sitemap-style footer or floating “back to top” (footer control only)
- A third “accent” brand colour for hover or CTAs

---

## 5. Design system (product view)

These are product rules, not implementation trivia.

| Rule | Meaning |
|---|---|
| **Two themes, one palette** | Tokens in CSS variables; components never use `dark:` colour classes |
| **Two type colours** | Headings = `text`; body / labels / captions = `text-muted` |
| **One type scale** | Named sizes (`display` … `caption`); never pair a size with extra `leading-*` / `tracking-*` |
| **Two weights** | 400 and 600 only; sentence case |
| **Shared CTAs** | One size (44px min) and one hover (colour move only — no scale/lift). Contact submit is an action button: glassy opacity hover, not CTA unfill |
| **No accent hue** | Hover uses the theme’s own ink |
| **Empty means hidden** | Empty strings/arrays hide Resume, mailto, education, captions, etc. |
| **Mobile-first hero** | Scene is cropped height on small screens; solid copy card (`bg-bg`) — not the nav frost |
| **Sanctioned colour exceptions** | Brand band inverse type (`on-brand`), case-study quote/chart hues, About caption highlighter pills |

Full agent-facing implementation rules live in [CLAUDE.md](CLAUDE.md).

---

## 6. Content ownership

**All visitor-facing copy lives in** [`src/data/portfolio.js`](src/data/portfolio.js).
Components do not hardcode marketing strings.

| Content | Status |
|---|---|
| About body + footer + About photos | Sakhi’s (from Figma) |
| Email, LinkedIn, Crochet Curio Instagram | Real |
| Case study (MyFitnessPal) | Authored against Figma frame |
| Formspree endpoint | Wired (`contact.formEndpoint`) |
| `site.bio`, `hero.opening`, `contact.invite`, `journey` | First draft — needs Sakhi’s confirmation (`site.bio` not yet on-page) |
| Resume PDF, Behance URL, education institution | Missing — see launch checklist |
| Project two | `coming-soon` placeholder |

**Temporary layout flag:** `PREVIEW_UNPUBLISHED` in `portfolio.js` feeds dead
`#` hrefs for Resume / Behance so placement can be reviewed. Behance has no UI
consumer yet (footer builds its own connect row). **Must be `false`
(or replaced with real URLs) before launch.**

---

## 7. Technical constraints

| Choice | Detail |
|---|---|
| Stack | React 18, Vite, Tailwind 3, Framer Motion, React Router |
| Backend | None |
| Contact delivery | Formspree (`contact.formEndpoint`); public endpoint id by design |
| Theming | Class on `<html>`; pre-paint script in `index.html` must stay in sync with `src/lib/theme.js` |
| Assets | Masters in `assets/`; optimized outputs in `public/` via `npm run optimize:scene` / `optimize:about` |
| Deploy | Static `dist/`; `vercel.json` present |

---

## 8. Launch checklist

### Must before go-live

- [ ] Set `PREVIEW_UNPUBLISHED` to `false`, **or** supply real Resume + Behance URLs
- [ ] Add `public/resume.pdf` and set `links.resume = '/resume.pdf'`
- [ ] Set `links.behance` to the real profile URL
- [x] Create Formspree form for `sakhirana03@gmail.com`, confirm email, paste
      `https://formspree.io/f/<id>` into `contact.formEndpoint`
- [ ] Confirm draft copy with Sakhi (`hero.opening`, `journey`, `site.bio`,
      `contact.invite`)

### Nice to have (blocked on Sakhi)

- [ ] `about.education` entries (`institution`, `qualification`, `years`)
- [ ] Captions for About photos that currently have none
- [ ] Case-study timeline in `meta` if she has one

### Nice to have (engineering)

- [ ] Per-route `<title>` / meta description
- [ ] Absolute `og:url` / `og:image` once production domain is known
- [ ] Regenerate `public/og-image.png` from the monogram (current file is the old wordmark)
- [ ] Second project when ready
- [ ] Route-level code splitting / case-study hero `srcset` if LCP needs it

---

## 9. Sources

| Area | Source |
|---|---|
| About + footer copy and photographs | Figma “Website changes” `dZb2Q6tMIGKgg2Xozpb1Nk`, frame `2023:105` |
| MyFitnessPal case study | Figma `46RjVrGHqQvJtK1uPSRdtH`, node `728:2865` (1440 × 16574). Section widths: `cs-prose` 948, `cs-wide` 1003.76, `cs-full` 1182 |
| Hero + Journey structure | Stitch frame “The Designer's Odyssey” (warm-cream *character* mapped onto this site’s tokens) |

---

## 10. Document map

| Doc | Audience | Role |
|---|---|---|
| [README.md](README.md) | Anyone cloning the repo | Quick start |
| **PRD.md** (this file) | Humans (Sakhi, collaborators, reviewers) | What the product is and what “done” means |
| [CLAUDE.md](CLAUDE.md) | Coding agents / implementers | Architecture and hard UI conventions |
