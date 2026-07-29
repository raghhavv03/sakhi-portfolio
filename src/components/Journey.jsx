import { useLayoutEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import { journey } from '../data/portfolio'
import SectionHeader from './SectionHeader'
import Badge from './Badge'
import { useInViewOnce, useReducedMotion, useReveal } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

// Home's journey section: four chapters pinned to a trail that draws itself as
// the section scrolls past, like a route filling in on a map.
//
// The trail is one SVG in a fixed-width column — left of the cards on mobile,
// down the middle between them on desktop. Two paths share the geometry: a
// dashed hairline for the route not walked yet, and a solid one on top whose
// `pathLength` is tied to scroll progress. Milestone dots are HTML, not SVG
// circles, because the SVG is stretched vertically (preserveAspectRatio
// "none") and a circle in it would arrive as an ellipse.
//
// The path is *measured*, not authored: a hardcoded `d` can't know where a
// chapter's dot lands once its copy wraps, so the curve and the dots drift
// apart. `useTrailGeometry` reads the rail's box and each dot's centre, and
// `buildTrail` threads a curve through those exact points.

// Each segment is a symmetric belly between two centred nodes, alternating
// side — which keeps the tangent continuous at every dot, so the whole trail
// reads as one long wave instead of stitched arcs. Chapter 1's card is on the
// left and the first belly leans left, so each bend leans toward the card it
// is introducing. Short segments (the lead-in above the first dot) get a
// proportionally smaller bend rather than a tight hook.
const BEND_RATIO = 0.44
const BEND_MAX = 68
const FULL_BEND_SPAN = 240
// Above ~0.5 the bellies round out and the crossings flatten — a parabola
// strung between the dots rather than a sine through them.
const BELLY = 0.55
const MAX_SPAN = 420

function buildTrail({ width, height, stops }) {
  const cx = width / 2
  const amplitude = Math.min(width * BEND_RATIO, BEND_MAX)

  // A bend can only be as wide as the rail, so on a narrow viewport — where a
  // chapter's card is tall and the gap between dots is several hundred pixels —
  // one belly per gap reads as a straight line. Long gaps get extra crossings
  // so the wave keeps its curvature instead of its width.
  const nodes = [0, ...stops, height].flatMap((y, i, all) => {
    if (i === 0) return [y]
    const prev = all[i - 1]
    const parts = Math.ceil((y - prev) / MAX_SPAN)
    return Array.from(
      { length: parts },
      (_, k) => prev + ((y - prev) * (k + 1)) / parts,
    )
  })

  return nodes.slice(1).reduce((d, y, i) => {
    const prev = nodes[i]
    const span = y - prev
    const bend =
      (i % 2 === 0 ? -1 : 1) *
      amplitude *
      Math.min(1, span / FULL_BEND_SPAN)
    const pull = span * BELLY
    return `${d} C${cx + bend} ${prev + pull}, ${cx + bend} ${y - pull}, ${cx} ${y}`
  }, `M${cx} 0`)
}

function useTrailGeometry(trackRef, railRef) {
  const [geometry, setGeometry] = useState(null)

  useLayoutEffect(() => {
    const track = trackRef.current
    const rail = railRef.current
    if (!track || !rail) return

    const measure = () => {
      const trackBox = track.getBoundingClientRect()
      const stops = Array.from(
        track.querySelectorAll('[data-milestone]'),
        (dot) => {
          const box = dot.getBoundingClientRect()
          return box.top - trackBox.top + box.height / 2
        },
      )
      setGeometry({
        width: rail.getBoundingClientRect().width,
        height: trackBox.height,
        stops,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [trackRef, railRef])

  return geometry
}

function Trail({ trackRef, railRef }) {
  const reducedMotion = useReducedMotion()
  const geometry = useTrailGeometry(trackRef, railRef)

  // Starts drawing as the first card reaches the lower third of the viewport
  // and completes as the last one clears the middle.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 85%', 'end 55%'],
  })
  const drawn = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  const d = geometry ? buildTrail(geometry) : null

  return (
    <div
      ref={railRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-12 md:left-1/2 md:-ml-20 md:w-40"
    >
      {d && (
        <svg
          className="h-full w-full"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d={d}
            className="stroke-border"
            strokeWidth="1.5"
            strokeDasharray="5 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d={d}
            className="stroke-text/45"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={reducedMotion ? { pathLength: 1 } : { pathLength: drawn }}
          />
        </svg>
      )}
    </div>
  )
}

// One milestone. Lights once, when its chapter arrives.
function Milestone() {
  const ref = useRef(null)
  const lit = useInViewOnce(ref)

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="relative col-start-1 row-start-1 mt-7 flex h-10 items-start justify-center md:col-start-2"
    >
      <span
        data-milestone=""
        className="relative flex h-3 w-3 items-center justify-center"
      >
        {/* Halo is sized off the dot, not the cell, so it stays a circle. */}
        <span
          className={`absolute -inset-1.5 rounded-full bg-lamp/30 blur-[5px] transition-opacity duration-500 motion-reduce:transition-none ${
            lit ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <span
          className={`relative h-3 w-3 rounded-full border transition-colors duration-500 motion-reduce:transition-none ${
            lit ? 'border-text bg-text' : 'border-border bg-bg'
          }`}
        />
      </span>
    </span>
  )
}

function Chapter({ chapter, index }) {
  const reveal = useReveal()
  // Chapters alternate sides on desktop; on mobile every card sits to the
  // right of the trail.
  const onRight = index % 2 === 1

  return (
    <li className="grid grid-cols-[3rem_1fr] items-start gap-x-4 md:grid-cols-[1fr_10rem_1fr] md:gap-x-8">
      <Milestone />
      <motion.article
        {...reveal}
        transition={{ ...reveal.transition, delay: index * 0.05 }}
        className={`col-start-2 row-start-1 rounded-2xl border border-border bg-surface p-6 ${
          onRight ? 'md:col-start-3' : 'md:col-start-1'
        }`}
      >
        <Badge>{chapter.label}</Badge>
        <h3 className="mt-4 text-h3 font-semibold text-text">
          {chapter.title}
        </h3>
        <p className="mt-3 text-body font-normal text-text-muted">
          {chapter.body}
        </p>
      </motion.article>
    </li>
  )
}

export default function Journey() {
  const trackRef = useRef(null)
  const railRef = useRef(null)
  const reducedMotion = useReducedMotion()

  if (!journey.chapters?.length) return null

  return (
    <section
      id="journey"
      data-cursor="Scroll ↓"
      className="mx-auto max-w-content scroll-mt-20 px-6 py-section-sm md:py-section-md lg:py-section"
    >
      <SectionHeader
        badge={journey.badge}
        heading={journey.heading}
        subhead={journey.subhead}
      />

      <div ref={trackRef} className="relative mt-12 md:mt-16">
        <Trail trackRef={trackRef} railRef={railRef} />
        <ol className="relative space-y-10 md:space-y-16">
          {journey.chapters.map((chapter, i) => (
            <Chapter key={chapter.label} chapter={chapter} index={i} />
          ))}
        </ol>
      </div>

      {/* The trail ends where the work begins. Hidden if the copy is empty. */}
      {journey.closing && (
        <motion.p
          initial={reducedMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: DUR.reveal, ease: EASE }}
          className="mt-12 pl-16 text-body font-normal text-text-muted md:pl-0 md:text-center"
        >
          {journey.closing}
        </motion.p>
      )}
    </section>
  )
}
