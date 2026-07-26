import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useReveal, useInViewOnce } from '../../lib/hooks'

// Groups are separated by weight, not hue: one off-black stepped down in four
// opacities. A four-colour chart would put more saturation on the page than the
// whole rest of the site carries, and the grouping is already carried by the
// headings — the ramp only has to keep adjacent groups distinguishable.
const GROUP_TONES = ['bg-text', 'bg-text/70', 'bg-text/45', 'bg-text/25']

// Grouped horizontal bar chart: how many reviews raised each specific friction.
// Bars share one scale across all groups so lengths are comparable end to end,
// and a single observer on the plot area grows them together on arrival, so the
// chart reads as one measurement rather than twelve independent animations.
export default function FrictionChart({ data }) {
  const reveal = useReveal()
  const barsRef = useRef(null)
  const grown = useInViewOnce(barsRef)
  if (!data?.groups?.length) return null

  const max = Math.max(...data.groups.flatMap((g) => g.bars.map((b) => b.value)))

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

      {data.callout && (
        <p className="border-b border-border bg-accent/20 px-6 py-4 text-sm font-normal leading-body text-text sm:px-8">
          {data.callout}
        </p>
      )}

      <div ref={barsRef} className="space-y-8 p-6 sm:p-8">
        {data.groups.map((group, gi) => (
          <div key={group.label}>
            <h4 className="flex items-center gap-2.5 text-sm font-semibold">
              <span
                aria-hidden="true"
                className={`h-2.5 w-2.5 rounded-full ${GROUP_TONES[gi % GROUP_TONES.length]}`}
              />
              {group.label}
            </h4>

            <ul className="mt-4 space-y-3.5">
              {group.bars.map((bar) => (
                <li key={bar.label}>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-sm font-normal leading-snug text-text-muted">
                      {bar.label}
                    </span>
                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                      {bar.value}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      style={{
                        width: grown ? `${(bar.value / max) * 100}%` : '0%',
                      }}
                      className={`h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none ${GROUP_TONES[gi % GROUP_TONES.length]}`}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </motion.figure>
  )
}
