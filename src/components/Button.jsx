import { Link } from 'react-router-dom'
import { tapHaptic } from '../lib/haptics'
import { CTA_HOVER, CTA_HOVER_FILL } from '../lib/interactions'

// Shared button/link. Rests neutral; hover fills with the theme's accent and
// zooms very slightly. Never rests accent. `cursorLabel` sets the custom-cursor
// pill text.
//
// variant: 'primary' (off-black fill) | 'secondary' (hairline outline)
// Renders as <Link> (to), <a> (href), or <button> depending on props.
//
// Motion is the shared `CTA_HOVER` and nothing more — same zoom, same duration,
// same focus ring as the header toggle and the footer's icon buttons, and off
// under prefers-reduced-motion.

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 ' +
  'text-body-sm font-semibold min-h-[44px] whitespace-nowrap ' +
  CTA_HOVER

const variants = {
  // The filled pill has no hairline of its own, so it only needs the fill and
  // the ink out of the shared hover paint.
  primary: `bg-text text-bg ${CTA_HOVER_FILL}`,
  secondary: `border border-border text-text bg-transparent ${CTA_HOVER_FILL}`,
  // For use on the dark band.
  dark: `border border-dark-border text-dark-text bg-transparent ${CTA_HOVER_FILL}`,
}

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  cursorLabel,
  className = '',
  ...rest
}) {
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`

  const shared = {
    className: classes,
    onPointerDown: tapHaptic,
    ...(cursorLabel ? { 'data-cursor': cursorLabel } : {}),
    ...rest,
  }

  if (to) {
    return <Link to={to} {...shared}>{children}</Link>
  }

  if (href) {
    return <a href={href} {...shared}>{children}</a>
  }

  return <button {...shared}>{children}</button>
}
