// Small decorative doodle that echoes the hero illustration's motifs
// (pastel-blue accent fills + off-black line work). Purely decorative.
export default function Doodle({ variant = 'circle', className = '' }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: '0 0 40 40',
    fill: 'none',
    'aria-hidden': true,
    className,
  }

  if (variant === 'dot') {
    return (
      <svg {...common}>
        <circle cx="20" cy="20" r="12" fill="#A7C7E7" />
        <circle cx="27" cy="13" r="3" fill="#1A1A1A" />
      </svg>
    )
  }

  if (variant === 'squiggle') {
    return (
      <svg {...common}>
        <path
          d="M4 24 q 8 -14 16 0 q 8 14 16 0"
          stroke="#1A1A1A"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    )
  }

  // circle (default)
  return (
    <svg {...common}>
      <circle cx="18" cy="20" r="14" fill="#A7C7E7" />
      <path
        d="M10 16 q 6 -6 12 0"
        stroke="#1A1A1A"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
