import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE, DUR } from '../lib/animations'
import { tapHaptic } from '../lib/haptics'
import { useReducedMotion } from '../lib/hooks'

// Shared button/link. Rests neutral; hover shifts to a pastel-blue fill/wash.
// Never rests pastel. `cursorLabel` sets the custom-cursor pill text.
//
// variant: 'primary' (off-black fill) | 'secondary' (hairline outline)
// Renders as <Link> (to), <a> (href), or <button> depending on props.
//
// Motion: hover lifts 1px + scales to 1.02 with a soft neutral shadow; tap
// presses to 0.98 and recovers instantly. Transform/shadow only (GPU-cheap),
// fully disabled under prefers-reduced-motion. Color shifts stay in CSS.

const MotionLink = motion.create(Link)

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 ' +
  'text-sm font-semibold transition-colors duration-200 min-h-[44px] ' +
  'whitespace-nowrap'

const variants = {
  primary:
    'bg-text text-bg hover:bg-accent hover:text-text',
  secondary:
    'border border-border text-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
  // For use on the dark band.
  dark:
    'border border-dark-border text-dark-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
}

// Neutral elevation only — no color, so it works on light and dark bands.
const restShadow = '0 0 0 0 rgba(26,26,26,0)'
const hoverShadow = '0 4px 14px -4px rgba(26,26,26,0.18)'

export default function Button({
  children,
  variant = 'primary',
  to,
  href,
  cursorLabel,
  className = '',
  ...rest
}) {
  const reducedMotion = useReducedMotion()
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`
  const cursorProps = cursorLabel ? { 'data-cursor': cursorLabel } : {}

  // Interaction props shared by all three render targets.
  const motionProps = reducedMotion
    ? {}
    : {
        initial: { boxShadow: restShadow },
        whileHover: { scale: 1.02, y: -1, boxShadow: hoverShadow },
        whileTap: { scale: 0.98, y: 0, transition: { duration: DUR.tap } },
        transition: { duration: DUR.hover, ease: EASE },
      }

  const shared = {
    className: classes,
    onPointerDown: tapHaptic,
    ...motionProps,
    ...cursorProps,
    ...rest,
  }

  if (to) {
    return (
      <MotionLink to={to} {...shared}>
        {children}
      </MotionLink>
    )
  }

  if (href) {
    return (
      <motion.a href={href} {...shared}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button {...shared}>
      {children}
    </motion.button>
  )
}
