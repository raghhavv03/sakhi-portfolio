// Shared Framer Motion presets. Keep all motion subtle (no motion above ~600ms).
// Scroll reveals fire once and never re-trigger.

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5, ease: 'easeOut' },
}

export const stagger = {
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
}

// Child variant to pair with a staggered parent.
export const fadeUpChild = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: 'easeOut' },
}
