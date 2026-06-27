import { brandStrip } from '../data/portfolio'
import { useReducedMotion } from '../lib/hooks'

// One-row auto-scrolling marquee of soft rounded pills. Pauses on hover.
// Under reduced motion the animation is disabled and the row simply wraps/
// scrolls statically (no infinite movement).
export default function BrandStrip() {
  const reducedMotion = useReducedMotion()
  const { label, items } = brandStrip

  // Duplicate the list so the translate loop is seamless.
  const loop = [...items, ...items]

  if (reducedMotion) {
    return (
      <section aria-label={label} className="border-y border-border py-8">
        <div className="mx-auto max-w-content px-6">
          <p className="mb-4 text-xs font-normal text-text-muted">{label}</p>
          <div className="flex flex-wrap gap-3">
            {items.map((item) => (
              <Pill key={item}>{item}</Pill>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section aria-label={label} className="border-y border-border py-8">
      <div className="mx-auto mb-4 max-w-content px-6">
        <p className="text-xs font-normal text-text-muted">{label}</p>
      </div>
      {/* Fade the edges; pause the marquee on hover via group-hover. */}
      <div className="group relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg to-transparent" />
        <div className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]">
          {loop.map((item, i) => (
            <Pill key={`${item}-${i}`} aria-hidden={i >= items.length}>
              {item}
            </Pill>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pill({ children, ...rest }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-normal text-text"
      {...rest}
    >
      {children}
    </span>
  )
}
