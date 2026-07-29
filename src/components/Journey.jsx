import { useRef } from 'react'
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

// Wobble stays inside the trail column (64px wide, centred on 32); the
// vertical stretch is what makes the waves long and lazy rather than a zigzag.
const TRAIL =
  'M32 0 C 62 90, 2 170, 32 260 C 62 350, 2 430, 32 520 C 62 610, 2 690, 32 780 C 62 870, 6 930, 32 1000'

function Trail({ trackRef }) {
  const reducedMotion = useReducedMotion()

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

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 w-10 md:left-1/2 md:-ml-8 md:w-16"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 64 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d={TRAIL}
          className="stroke-border"
          strokeWidth="1.5"
          strokeDasharray="5 7"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          d={TRAIL}
          className="stroke-text/45"
          strokeWidth="1.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={reducedMotion ? { pathLength: 1 } : { pathLength: drawn }}
        />
      </svg>
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
      <span className="relative flex h-3 w-3 items-center justify-center">
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
    <li className="grid grid-cols-[2.5rem_1fr] items-start gap-x-4 md:grid-cols-[1fr_4rem_1fr] md:gap-x-8">
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
        <Trail trackRef={trackRef} />
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
          className="mt-12 pl-14 text-body font-normal text-text-muted md:pl-0 md:text-center"
        >
          {journey.closing}
        </motion.p>
      )}
    </section>
  )
}
