/** @type {import('tailwindcss').Config} */
// Every themed colour resolves through a CSS variable holding RGB channels, so
// `bg-bg` / `text-text` / `border-border` mean "light" or "dark" depending on
// the `dark` class on <html> — and every alpha modifier (`ring-text/25`) still
// works. The values themselves live in src/index.css. Nothing in a component
// ever needs a `dark:` variant for colour.
const themed = (name) => `rgb(var(--${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Page surfaces. Light: warm cream canvas / white cards. Dark: deep
        // navy-ink canvas / a lifted navy card, tuned to the night hero scene.
        bg: themed('bg'), // page background (never pure #FFF / #000)
        surface: themed('surface'), // cards / raised surfaces
        border: themed('border'), // hairline borders (barely visible)

        // ── The two type colours. Every heading on every page is `text`;
        //    every paragraph, label, caption and list is `text-muted`. There
        //    is no third grey — if something needs to recede further it uses
        //    a smaller size, not a lighter ink. The only sanctioned exceptions
        //    are inverse text on a coloured band (`on-brand`) and the one blue
        //    quote card in the case study.
        text: themed('text'), // headings, emphasis, default buttons
        'text-muted': themed('text-muted'), // body copy, labels, captions

        // Type that sits on a saturated brand fill (MyFitnessPal's blue band,
        // the sentiment bars). White in both themes — the fill under it does
        // not change with the theme, so neither can the ink on it.
        'on-brand': '#FFFFFF',

        // Fixed dark band — the lightbox overlay, which is dark in both
        // themes because it is a viewer, not a surface.
        'dark-bg': '#121212',
        'dark-surface': '#1C1C1E',
        'dark-text': '#EDEDED',
        'dark-muted': '#A1A1A1',
        'dark-border': '#2A2A2C',

        // Accent — pastel blue. Its job is unchanged in dark mode: hover
        // states only, never resting colour and never type. The value is
        // deepened there so the light ink that lands on a hover fill keeps
        // its contrast (a pastel fill under light type would not).
        accent: themed('accent'),
        'accent-hover': themed('accent-hover'),

        // Lamp amber — the hero lamp's own light, borrowed by the one place
        // that echoes it: the journey trail's milestone glow. The lamp in the
        // artwork is lit by the artwork, not by this token. Never type, never
        // a surface.
        lamp: themed('lamp'),

        // Neutral elevation ink (off-black in light, true black in dark), so
        // one shadow recipe reads correctly on both canvases.
        shadow: themed('shadow'),

        // MyFitnessPal's own brand blue — case-study hero band only. This is
        // the subject's colour, not Sakhi's palette (same rule as the home
        // thumbnail's saturated blue).
        'mfp-blue': '#0279FF',

        // About's photo caption pills — the five highlighter hues the Figma
        // frame labels its photographs with, in the frame's own order. Fixed
        // in both themes, because a highlighter does not change colour when
        // the lights go out, which is also why the ink on them is fixed:
        // `caption-ink`, dark in both themes for the same reason `on-brand`
        // is white in both. These live only inside PhotoStack.
        'caption-1': '#FFFB00', // yellow
        'caption-2': '#6FC8FF', // sky
        'caption-3': '#54FFA1', // mint
        'caption-4': '#FFA96B', // orange
        'caption-5': '#FB80FF', // pink
        'caption-ink': '#1E1E1E',

        // ── Case-study colour exceptions. Everything else on that page now
        //    uses `text` / `text-muted` / `surface` / `border` like the rest
        //    of the site; these four groups survive because they encode
        //    meaning that a neutral could not carry.
        'cs-quote': '#0278fe', // the framing question + its quote glyph
        'cs-callout': '#817cff', // the friction chart's headline band

        // Sentiment split — Sunbeam CX's own negative / neutral / positive.
        'cs-negative': '#bf2600',
        'cs-neutral': '#b2b2b2',
        'cs-positive': '#11af00',

        // Friction chart — one hue per friction type.
        'cs-steps': '#df522f',
        'cs-removed': '#ffe100',
        'cs-visibility': '#da8300',
        'cs-navigation': '#0028ca',
      },
      fontFamily: {
        // One family for the whole site, including the case study.
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontWeight: {
        // Two weights across the entire site — no exceptions.
        normal: '400',
        semibold: '600',
      },
      maxWidth: {
        content: '1200px',
        // The case study's three measures. Its Figma frame gave each section
        // its own width — eight of them, a few pixels apart — so every section
        // started on a different left edge. These snap that set to three, each
        // still wide enough for the artwork exported into it.
        'cs-prose': '948px', // every prose / card-grid section
        'cs-wide': '1003.76px', // the 1000px prototype boards
        'cs-full': '1182px', // the two research panels side by side
      },
      fontSize: {
        // ── The one type scale, used by every page. Each entry carries its
        //    own line height and tracking, so no component ever sets
        //    `leading-*` or `tracking-*` alongside a size. The three headline
        //    sizes clamp instead of stepping through `sm:` / `md:` variants,
        //    which is what keeps the ramp identical on every route.
        display: [
          'clamp(2.75rem, 8vw, 4.5rem)',
          { lineHeight: '0.95', letterSpacing: '-0.02em' },
        ], // hero — home + case-study banner
        h1: [
          'clamp(2rem, 4.5vw, 3rem)',
          { lineHeight: '1.2', letterSpacing: '-0.02em' },
        ], // page title
        h2: [
          'clamp(1.75rem, 3vw, 2rem)',
          { lineHeight: '1.3', letterSpacing: '-0.02em' },
        ], // section heading
        h3: ['1.25rem', { lineHeight: '1.45', letterSpacing: '-0.01em' }], // card title
        h4: ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }], // list-row title
        lead: ['1.25rem', { lineHeight: '1.65', letterSpacing: '-0.01em' }], // standfirst
        body: ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.75' }],
        caption: ['0.75rem', { lineHeight: '1.65' }],
      },
      borderColor: {
        DEFAULT: themed('border'),
      },
      spacing: {
        // The single vertical rhythm. Every page — case study included — puts
        // this much air between two sections and nothing else.
        section: '6rem', // desktop (≥1024px)
        'section-md': '5rem', // tablet (768–1023px)
        'section-sm': '3.5rem', // mobile
      },
      keyframes: {
        // Seamless marquee: the row holds two copies of the list, so a -50%
        // translate lands exactly on the start of the second copy.
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}
