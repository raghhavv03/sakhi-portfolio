import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLargeScreen, useReducedMotion, useReveal } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'

// About's photo groups — the Crochet Curio makes, the cats, the trips.
//
// One interaction, and it is the Figma prototype's: the card under the pointer
// lifts out of the group, straightens, and names itself in a small pill. A
// `pile` (cats, trips) also opens while it is being explored — its other cards
// slide aside and fan wider — which is what the frame's overlay states show. A
// `fan` (the makes) is already open, so it only lifts.
//
// Below `lg` the group is a snap-scrolling strip instead. Five 200px cards
// fanned across a phone would be five slivers, and there is no hover to reveal
// a caption with, so every caption is simply visible.
//
// The cards are decorative and are not focus stops: each caption is a real
// `<figcaption>` and each photo a real `alt`, so the content is already there
// for a screen reader whether or not the pill has faded in.

// Card tilts in degrees, cycled. These are the frame's own angles — uneven on
// purpose, because a handful of photos is never a grid.
const TILT = [-6.4, 4.8, -4.6, 2.3, -5.2, 11.7, -0.7, -4.7]

// A fan's cards also sit at slightly different heights (px, `lg` only).
const DRIFT = [16, -12, 6, -22, 12]

// Caption pill fills, cycled — the frame's five highlighter hues. Read in the
// order the frame labels the makes in (coasters yellow, bucket hat sky, custom
// top mint, cardigan orange, tote pink), so the fan matches it card for card.
// Each shape starts at a different offset below, so no two groups open on the
// same colour.
// `lg:` only — below that the caption is plain copy under the photo, not a
// pill, and a fill behind unpadded text would read as a highlight gone wrong.
const HUES = [
  'lg:bg-caption-1',
  'lg:bg-caption-2',
  'lg:bg-caption-3',
  'lg:bg-caption-4',
  'lg:bg-caption-5',
]

// How far a lifted card rises, and how much bigger it gets.
const LIFT = -14
const LIFT_SCALE = 1.06

// While a pile is open its resting cards slide apart by this much per step and
// splay to this multiple of their tilt. A pile is dealt almost on top of
// itself, so this is also what makes the buried cards reachable at all — it
// has to be wider than the sliver each card shows at rest.
const SPREAD = { cat: 52, trip: 30 }
const SPLAY = 1.8

// Per-shape card geometry. `width`/`height` are the exported pixel size of the
// image — see scripts/optimize-about.mjs, which crops to exactly these ratios.
// `hue` is where this group starts reading HUES.
const SHAPES = {
  make: {
    width: 440,
    height: 477,
    aspect: 'aspect-[440/477]',
    card: 'lg:w-[196px]',
    overlap: 'lg:-ml-6',
    hue: 0,
  },
  cat: {
    width: 460,
    height: 460,
    aspect: 'aspect-square',
    card: 'lg:w-[204px]',
    overlap: 'lg:-ml-[188px]',
    hue: 1,
  },
  trip: {
    width: 480,
    height: 639,
    aspect: 'aspect-[480/639]',
    card: 'lg:w-[224px]',
    overlap: 'lg:-ml-[208px]',
    hue: 3,
  },
}

export default function PhotoStack({ items, shape, layout = 'fan', label }) {
  const reveal = useReveal()
  const large = useLargeScreen()
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(null)
  const [exploring, setExploring] = useState(false)

  if (!items?.length) return null

  const { width, height, aspect, card, overlap, hue } = SHAPES[shape]
  // A pile opens when the pointer reaches the group, not when it reaches a
  // card: at rest every card but the top one is buried, so opening on the
  // card would leave the ones underneath permanently out of reach.
  const opened = layout === 'pile' && large && exploring
  const spread = opened ? (SPREAD[shape] ?? 0) : 0

  return (
    <motion.div
      {...reveal}
      role="group"
      aria-label={label}
      onPointerEnter={() => setExploring(true)}
      onPointerLeave={() => {
        setExploring(false)
        setActive(null)
      }}
      className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-2 lg:mx-0 lg:snap-none lg:justify-center lg:gap-0 lg:overflow-visible lg:px-0 lg:pb-0"
    >
      {items.map((item, i) => {
        const lifted = large && active === i
        const tilt = TILT[i % TILT.length]
        const centred = i - (items.length - 1) / 2

        // Below `lg` the strip is a plain row: tilt only, no lift, no spread.
        const pose = large
          ? {
              rotate: lifted ? 0 : tilt * (spread ? SPLAY : 1),
              // A lifted card keeps its place in the spread. Sliding it back
              // to centre would walk it out from under the pointer, which
              // un-hovers it, which slides it back — a card that flickers.
              x: centred * spread,
              y: (lifted ? LIFT : 0) + (layout === 'fan' ? DRIFT[i % DRIFT.length] : 0),
              scale: lifted ? LIFT_SCALE : 1,
            }
          : { rotate: tilt, x: 0, y: 0, scale: 1 }

        return (
          <motion.figure
            key={item.src}
            initial={false}
            animate={pose}
            transition={
              reducedMotion ? { duration: 0 } : { duration: DUR.reveal, ease: EASE }
            }
            style={{ zIndex: lifted ? 30 : i }}
            onPointerEnter={() => setActive(i)}
            className={`relative w-[58vw] max-w-[240px] shrink-0 snap-center ${card} ${
              i > 0 ? overlap : ''
            }`}
          >
            <div className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_10px_30px_-18px_rgb(var(--shadow)/0.45)]">
              <img
                src={item.src}
                alt={item.alt}
                width={width}
                height={height}
                loading="lazy"
                draggable="false"
                className={`block w-full object-cover ${aspect}`}
              />
            </div>

            {/* Below `lg` this is plain muted copy under the photo — there is
                no hover to reveal it with, so it is simply always there. At
                `lg` it becomes the frame's own highlighter pill: its own hue,
                fixed dark ink, and no hairline, because a border on a
                saturated fill reads as an outline the frame never drew. */}
            {item.caption && (
              <figcaption
                className={`mt-3 text-center text-caption font-normal text-text-muted lg:pointer-events-none lg:absolute lg:left-1/2 lg:top-0 lg:mt-0 lg:-translate-x-1/2 lg:-translate-y-[calc(100%+12px)] lg:whitespace-nowrap lg:rounded-full lg:px-3 lg:py-1 lg:text-caption-ink lg:shadow-[0_6px_20px_-10px_rgb(var(--shadow)/0.4)] lg:transition-opacity lg:duration-200 lg:motion-reduce:transition-none ${
                  HUES[(hue + i) % HUES.length]
                } ${lifted ? 'lg:opacity-100' : 'lg:opacity-0'}`}
              >
                {item.caption}
              </figcaption>
            )}
          </motion.figure>
        )
      })}
    </motion.div>
  )
}
