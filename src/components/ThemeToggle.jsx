import { useTheme } from '../lib/theme'
import { tapHaptic } from '../lib/haptics'
import { CTA_HOVER, CTA_HOVER_FILL } from '../lib/interactions'

// Header theme control — the same switch the hero lamp throws, so the two are
// always showing the same state. Icon shows the theme you would get, which is
// what the label says too.
export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const toDark = theme === 'light'

  return (
    <button
      type="button"
      onClick={() => {
        tapHaptic()
        toggleTheme()
      }}
      aria-label={toDark ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={!toDark}
      data-cursor={toDark ? 'Night mode' : 'Day mode'}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-text-muted ${CTA_HOVER} ${CTA_HOVER_FILL} ${className}`}
    >
      {toDark ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="block"
    >
      <path
        d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="block"
    >
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.2 5.2l1.4 1.4M17.4 17.4l1.4 1.4M18.8 5.2l-1.4 1.4M6.6 17.4l-1.4 1.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
