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

// The hover shadow is CSS rather than a Framer value because its ink is a
// theme variable (off-black on the cream canvas, true black on the night one)
// and Framer would have to interpolate a colour it cannot read.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 ' +
  'text-body-sm font-semibold min-h-[44px] whitespace-nowrap ' +
  'transition-[color,background-color,border-color,box-shadow] duration-200 ' +
  'hover:shadow-[0_4px_14px_-4px_rgb(var(--shadow)/0.28)]'

const variants = {
  primary:
    'bg-text text-bg hover:bg-accent hover:text-text',
  secondary:
    'border border-border text-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
  // For use on the dark band.
  dark:
    'border border-dark-border text-dark-text bg-transparent hover:bg-accent hover:border-accent hover:text-text',
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
  const reducedMotion = useReducedMotion()
  const classes = `${base} ${variants[variant] || variants.primary} ${className}`
  const cursorProps = cursorLabel ? { 'data-cursor': cursorLabel } : {}

  // Interaction props shared by all three render targets.
  const motionProps = reducedMotion
    ? {}
    : {
        whileHover: { scale: 1.02, y: -1 },
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
