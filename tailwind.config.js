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

        // Cursor — vivid blue (attention color, cursor only)
        cursor: '#2563EB',
      },
      fontFamily: {
        sans: [
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      fontWeight: {
        // Only two weights are permitted across the site.
        normal: '400',
        semibold: '600',
      },
      maxWidth: {
        content: '1200px',
      },
      lineHeight: {
        body: '1.7',
        hero: '0.95',
      },
      fontSize: {
        // Fluid hero display size — scales with viewport, never overflows.
        hero: ['clamp(2.75rem, 9vw, 6.5rem)', { lineHeight: '0.95' }],
      },
      borderColor: {
        DEFAULT: '#E6E6E2',
      },
      spacing: {
        // Section rhythm tokens
        section: '6rem', // py-24 desktop (≥1024px)
        'section-md': '5rem', // py-20 tablet (768–1023px) — condensed from desktop
        'section-sm': '3.5rem', // py-14 mobile
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
