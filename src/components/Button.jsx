import { Link } from 'react-router-dom'
import { tapHaptic } from '../lib/haptics'
import {
  CTA_HOVER,
  CTA_HOVER_FILL,
  CTA_HOVER_FILL_SOLID,
  CTA_SHAPE,
} from '../lib/interactions'

// Shared button/link. Both variants are the same 44px pill in the same two
// theme inks — the outline fills with `text` on hover, the filled one softens
// to `text-muted`. Neither ever rests or hovers on a colour the page does not
// already use. `cursorLabel` sets the custom-cursor pill text.
//
// variant: 'primary' (ink fill) | 'secondary' (hairline outline)
// Renders as <Link> (to), <a> (href), or <button> depending on props.
//
// Size, motion and hover are all imports — same colours, same duration, same
// focus ring as the header toggle and the footer's icon buttons.

const base = `${CTA_SHAPE} ${CTA_HOVER}`

const variants = {
  // Carries a border of its own so it is the exact same box as the outlined
  // pill beside it in the header — an unbordered fill sits 2px shorter.
  primary: `border border-text bg-text text-bg ${CTA_HOVER_FILL_SOLID}`,
  secondary: `border border-border text-text bg-transparent ${CTA_HOVER_FILL}`,
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
