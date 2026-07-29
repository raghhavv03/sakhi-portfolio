import { motion } from 'framer-motion'
import { useReveal } from '../lib/hooks'

// A case-study visual. Every figure on this page is exported from the Figma
// frame with its own surface already on it — the teardown boards and the
// prototype boards each carry the frame's #fafafa card, #e7e7e7 hairline and
// 10px radius baked into the image — so this adds no card of its own. Adding
// one would double the border.
//
// Clicking opens the Lightbox: the boards are dense enough that reading them
// in place isn't always possible, so every figure carries a real "Enlarge"
// affordance (button + aria-label + cursor label) rather than relying on the
// custom cursor alone.
//
// `caption` renders the frame's own 12/20 caption underneath, centred, at
// 16px clear — the only figures that have one are the two discovery boards.
export default function Figure({ figure, onOpen, caption, className = '' }) {
  const reveal = useReveal()
  if (!figure?.src) return null

  return (
    <motion.figure
      {...reveal}
      className={`flex w-full flex-col items-center justify-center gap-4 ${className}`}
    >
      <button
        type="button"
        onClick={() => onOpen(figure)}
        data-cursor="Enlarge"
        aria-label={`Enlarge: ${figure.alt}`}
        className="block w-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
        style={{ maxWidth: figure.width }}
      >
        <img
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </button>
      {caption && (
        <figcaption className="text-caption font-normal text-text-muted">
          {caption}
        </figcaption>
      )}
    </motion.figure>
  )
}
