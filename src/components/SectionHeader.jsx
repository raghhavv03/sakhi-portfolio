import { motion } from 'framer-motion'
import { useReveal } from '../lib/hooks'
import Badge from './Badge'

// Badge pill + Semibold heading + optional muted subhead. Fades up once
// (disabled under reduced motion).
export default function SectionHeader({ badge, heading, subhead, className = '' }) {
  const reveal = useReveal()
  return (
    <motion.div {...reveal} className={`max-w-2xl ${className}`}>
      {badge && <Badge>{badge}</Badge>}
      {heading && (
        <h2
          className={`text-h2 font-semibold text-text ${badge ? 'mt-4' : ''}`}
        >
          {heading}
        </h2>
      )}
      {subhead && (
        <p className="mt-3 text-body font-normal text-text-muted">
          {subhead}
        </p>
      )}
    </motion.div>
  )
}
