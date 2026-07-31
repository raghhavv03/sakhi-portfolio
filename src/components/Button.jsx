import { Link } from 'react-router-dom'
import { tapHaptic } from '../lib/haptics'
import {
  CTA_HOVER,
  CTA_HOVER_FILL,
  CTA_SHAPE,
} from '../lib/interactions'

// Shared button/link — one 44px outlined pill that fills with `text` on hover.
// `cursorLabel` sets the custom-cursor pill text.
//
// Renders as <Link> (to), <a> (href), or <button> depending on props.
// Size, motion and hover are all imports — same as the header toggle and the
// footer's icon buttons. `variant` is accepted for call-site clarity but
// only the outlined style exists.

const base = `${CTA_SHAPE} ${CTA_HOVER}`
const outlined = `border border-border text-text bg-transparent ${CTA_HOVER_FILL}`

export default function Button({
  children,
  variant = 'secondary',
  to,
  href,
  cursorLabel,
  className = '',
  ...rest
}) {
  // `variant` kept so call sites stay explicit; only one style ships.
  void variant
  const classes = `${base} ${outlined} ${className}`

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
