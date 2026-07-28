/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light surfaces (primary theme)
        bg: '#FAFAF8', // off-white page background (never pure #FFF)
        surface: '#FFFFFF', // cards / raised surfaces
        text: '#1A1A1A', // primary text & default buttons (never pure #000)
        'text-muted': '#6B6B6B', // secondary text, captions, labels
        border: '#E6E6E2', // hairline borders (barely visible)

        // Dark band (contact + footer sections only)
        'dark-bg': '#121212',
        'dark-surface': '#1C1C1E',
        'dark-text': '#EDEDED',
        'dark-muted': '#A1A1A1',
        'dark-border': '#2A2A2C',

        // Accent — pastel blue (hover state + illustration fills only)
        accent: '#A7C7E7',
        'accent-hover': '#8FB8DE',

        // MyFitnessPal's own brand blue — case-study hero band only. This is
        // the subject's colour, not Sakhi's palette (same rule as the home
        // thumbnail's saturated blue).
        'mfp-blue': '#0279FF',

        // Cursor — vivid blue (attention color, cursor only)
        cursor: '#2563EB',

        // Case-study content tokens — lifted verbatim from the MyFitnessPal
        // Figma frame's own colour variables (Content/*, Background/*,
        // Border/*) plus the literal hexes the frame uses off-token. Scoped to
        // `cs-` so the case-study page can match its source design
        // pixel-for-pixel without touching Sakhi's own palette above, which
        // the rest of the site still uses.
        'cs-primary': '#1a1a1a',
        'cs-secondary': '#333333',
        'cs-tertiary': '#666666',
        'cs-disabled': '#b2b2b2',
        'cs-inverse': '#ffffff',
        'cs-bg': '#ffffff',
        'cs-bg-inverse': '#1a1a1a',
        'cs-bg-hover': '#f2f2f2',
        'cs-bg-pressed': '#e5e5e5',
        'cs-border': '#666666',
        'cs-border-2': '#999999',
        'cs-border-3': '#cccccc',

        // Body copy, the neutral card, and the one blue callout.
        'cs-copy': '#575757',
        'cs-card': '#fafafa',
        'cs-card-border': '#e7e7e7',
        'cs-quote': '#0278fe', // question text + quote glyph
        'cs-chip': '#0066ec', // "Screens" / "Notes" chips on the boards
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
        sans: [
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        // The case-study page reproduces its Figma source exactly, which is
        // set in Inter — the rest of the site keeps the SF Pro stack above.
        cs: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        // Two weights across the site. `bold` (700) is Tailwind's default and
        // is reserved for the case study, whose Figma source sets its inline
        // emphasis in Inter Bold — nowhere else uses it.
        normal: '400',
        semibold: '600',
      },
      maxWidth: {
        content: '1200px',
        // Every case-study section is centred on the 1440 frame at its own
        // measure. These are those measures, verbatim.
        'cs-593': '593px',
        'cs-880': '880px',
        'cs-928': '928px',
        'cs-948': '948px',
        'cs-1000': '1000px',
        'cs-1004': '1003.76px',
        'cs-1158': '1158px',
        'cs-1182': '1182px',
      },
      lineHeight: {
        body: '1.7',
        hero: '0.95',
      },
      fontSize: {
        // Fluid hero display size — scales with viewport, never overflows.
        hero: ['clamp(2.75rem, 9vw, 6.5rem)', { lineHeight: '0.95' }],

        // Case-study type scale — the exact Heading/* and Text/* styles from
        // the MyFitnessPal Figma variables, by name.
        'cs-5xl': ['72px', { lineHeight: '80px', letterSpacing: '-1px' }],
        'cs-l': ['32px', { lineHeight: '40px', letterSpacing: '-1px' }],
        'cs-m': ['28px', { lineHeight: '36px', letterSpacing: '-0.5px' }],
        'cs-s': ['20px', { lineHeight: '28px', letterSpacing: '-0.5px' }],
        // The tagline and the framing question are the two places the frame
        // sets its own line height rather than taking the style's.
        'cs-tagline': ['28px', { lineHeight: '45px', letterSpacing: '-1px' }],
        'cs-question': ['20px', { lineHeight: '35px' }],
        // Discovery's heading rides a 45px line; every other Heading/L is 40.
        'cs-l-loose': ['32px', { lineHeight: '45px', letterSpacing: '-1px' }],
        'cs-body-xl': ['16px', { lineHeight: '38px' }],
        'cs-body-l': ['16px', { lineHeight: '24px' }],
        'cs-body-m': ['14px', { lineHeight: '38px' }],
        'cs-body-m-tight': ['14px', { lineHeight: '20px' }],
        'cs-body-s': ['12px', { lineHeight: '16px' }],
        'cs-caption': ['12px', { lineHeight: '20px' }],
        // Text/XL Regular at its own 38px line — the strong/weak column labels.
        'cs-label-xl': ['20px', { lineHeight: '38px' }],
      },
      borderColor: {
        DEFAULT: '#E6E6E2',
      },
      spacing: {
        // Section rhythm tokens
        section: '6rem', // py-24 desktop (≥1024px)
        'section-md': '5rem', // py-20 tablet (768–1023px) — condensed from desktop
        'section-sm': '3.5rem', // py-14 mobile

        // The case study's own rhythm: 104px between every section, 24px
        // between every stacked block inside one.
        'cs-gap': '104px',
        'cs-stack': '24px',
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
