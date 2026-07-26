import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useReveal, useInViewOnce } from '../../lib/hooks'

// Tone → fill. The palette stays neutral so the one pastel-blue run reads as
// the positive share rather than as decoration; the site's rule is that blue
// carries meaning sparingly, never fills a chart for variety.
const TONES = {
  strong: 'bg-text',
  muted: 'bg-border',
  accent: 'bg-accent',
}

// Review-sentiment summary: a single 100% stacked bar plus the headline counts
// behind it. The segments grow from zero once, when the bar first scrolls into
// view — one observer on the track drives all three as a CSS width transition,
// so the three segments stay in step and no motion runs off-screen.
export default function SentimentPanel({ data }) {
  const reveal = useReveal()
  const barRef = useRef(null)
  const grown = useInViewOnce(barRef)
  if (!data) return null

  return (
    <motion.figure
      {...reveal}
      className="overflow-hidden rounded-2xl border border-border bg-surface"
    >
      <figcaption className="border-b border-border p-6 sm:p-8">
        <h3 className="text-lg font-semibold leading-tight">{data.title}</h3>
        <p className="mt-2 text-xs font-normal leading-body text-text-muted">
          {data.source}
        </p>
      </figcaption>

      <div className="p-6 sm:p-8">
        <p className="text-xs font-normal text-text-muted">{data.splitLabel}</p>

        <div
          ref={barRef}
          role="img"
          aria-label={data.split
            .map((s) => `${s.label} ${s.value} percent`)
            .join(', ')}
          className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-border"
        >
          {data.split.map((segment) => (
            <div
              key={segment.label}
              style={{ width: grown ? `${segment.value}%` : '0%' }}
              className={`transition-[width] duration-500 ease-out motion-reduce:transition-none ${TONES[segment.tone]}`}
            />
          ))}
        </div>

        <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {data.split.map((segment) => (
            <li
              key={segment.label}
              className="flex items-center gap-2 text-xs font-normal text-text-muted"
            >
              <span
                aria-hidden="true"
                className={`h-2 w-2 rounded-full ${TONES[segment.tone]}`}
              />
              {segment.label}
              <span className="font-semibold text-text">{segment.value}%</span>
            </li>
          ))}
        </ul>
      </div>

      <dl className="grid grid-cols-2 gap-px border-t border-border bg-border lg:grid-cols-4">
        {data.stats.map((stat) => (
          <div key={stat.label} className="bg-surface p-6">
            <dt className="text-xs font-normal text-text-muted">{stat.label}</dt>
            <dd className="mt-2 text-3xl font-semibold leading-none">
              {stat.value}
            </dd>
            <p className="mt-2 text-xs font-normal text-text-muted">{stat.note}</p>
          </div>
        ))}
      </dl>
    </motion.figure>
  )
}
