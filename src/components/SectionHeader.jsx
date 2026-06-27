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
        <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
          {heading}
        </h2>
      )}
      {subhead && (
        <p className="mt-3 text-base font-normal leading-body text-text-muted">
          {subhead}
        </p>
      )}
    </motion.div>
  )
}
