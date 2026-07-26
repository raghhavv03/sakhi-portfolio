import { motion } from 'framer-motion'
import { useReveal, useReducedMotion } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

// A case-study visual: the artwork on a hairline-bordered surface with its
// caption underneath. Clicking opens the Lightbox — the prototype screens are
// dense enough that reading them in place isn't always possible, so every
// figure carries a real "Enlarge" affordance (button + aria-label + cursor
// label) rather than relying on the custom cursor alone.
export default function Figure({ figure, onOpen, className = '', padded = true }) {
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()
  if (!figure?.src) return null

  return (
    <motion.figure {...reveal} className={className}>
      <motion.button
        type="button"
        onClick={() => onOpen(figure)}
        data-cursor="Enlarge"
        aria-label={`Enlarge: ${figure.alt}`}
        whileHover={reducedMotion ? undefined : { y: -3 }}
        transition={{ duration: DUR.hover, ease: EASE }}
        className={`block w-full overflow-hidden rounded-2xl border border-border bg-surface transition-[border-color,box-shadow] duration-300 hover:border-text/20 hover:shadow-[0_18px_36px_-20px_rgba(26,26,26,0.22)] focus-visible:outline-offset-4 ${
          padded ? 'p-3 sm:p-5' : ''
        }`}
      >
        <img
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="lazy"
          decoding="async"
          className="h-auto w-full rounded-xl"
        />
      </motion.button>
      {figure.caption && (
        <figcaption className="mt-3 text-sm font-normal leading-body text-text-muted">
          {figure.caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
