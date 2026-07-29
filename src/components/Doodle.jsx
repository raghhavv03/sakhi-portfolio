// Small decorative doodle — a pastel accent fill under a line of heading ink.
// Purely decorative. Paint comes from the theme variables rather than literal
// hex, so the marks follow the canvas into dark mode.
export default function Doodle({ variant = 'circle', className = '' }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    fill: 'none',
    'aria-hidden': true,
    className,
  }

  const accent = 'rgb(var(--accent))'
  const ink = 'rgb(var(--text))'

  if (variant === 'dot') {
    return (
      <svg {...common}>
        <circle cx="20" cy="20" r="12" fill={accent} />
        <circle cx="27" cy="13" r="3" fill={ink} />
      </svg>
    )
  }

  if (variant === 'squiggle') {
    return (
      <svg {...common}>
        <path
          d="M4 24 q 8 -14 16 0 q 8 14 16 0"
          stroke={ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  // circle (default)
  return (
    <svg {...common}>
      <circle cx="18" cy="20" r="14" fill={accent} />
      <path
        d="M10 16 q 6 -6 12 0"
        stroke={ink}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
