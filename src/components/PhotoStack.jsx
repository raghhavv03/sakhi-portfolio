import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLargeScreen, useReducedMotion, useReveal } from '../lib/hooks'
import { EASE, DUR } from '../lib/animations'
import { tapHaptic } from '../lib/haptics'

// About's photo groups — the Crochet Curio makes, the cats, the trips.
//
// Two interactions, one per pointer.
//
// On a fine pointer (`lg` and up) it is the Figma prototype's: the card under
// the pointer lifts out of the group, straightens, and names itself in a small
// pill. A `pile` (cats, trips) also opens while it is being explored — its
// other cards slide aside and fan wider. A `fan` (the makes) is already open,
// so it only lifts.
//
// Below `lg` it is a deck you swipe: the top card follows the thumb, throws off
// screen, and the next one is already underneath. The last card has nothing
// behind it, so tapping it deals the whole group back in — every card returns
// along the arc it left on.
//
// The cards are decorative and are not focus stops: each caption is a real
// `<figcaption>` and each photo a real `alt`, so the whole group is already
// there for a screen reader whether or not a pill has faded in.

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
const HUES = [
  'bg-caption-1',
  'bg-caption-2',
  'bg-caption-3',
  'bg-caption-4',
  'bg-caption-5',
]

// How far a lifted card rises, and how much bigger it gets (`lg` only).
const LIFT = -14
const LIFT_SCALE = 1.06

// While a pile is open its resting cards slide apart by this much per step and
// splay to this multiple of their tilt. A pile is dealt almost on top of
// itself, so this is also what makes the buried cards reachable at all — it
// has to be wider than the sliver each card shows at rest.
const SPREAD = { cat: 52, trip: 30 }
const SPLAY = 1.8

// The deck, below `lg`. A thrown card clears the widest phone and takes a
// little spin with it.
const THROW_X = 520
const THROW_SPIN = 18
// The cards still in the deck step down, across and open a little further out
// of true with each layer. A deck that sits perfectly square looks like one
// photograph, and nobody swipes one photograph — the corners underneath are
// the whole invitation, so they are deliberately wide enough to read as more
// pictures rather than as a thick border.
const DECK_STEP_X = 11
const DECK_STEP_Y = 10
const DECK_STEP_SCALE = 0.035
const DECK_STEP_TILT = 0.45
// Past this much drag, or this much flick, letting go throws the card.
const SWIPE_DISTANCE = 70
const SWIPE_VELOCITY = 450

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
  const large = useLargeScreen()
  if (!items?.length) return null

  return large ? (
    <Spread items={items} shape={shape} layout={layout} label={label} />
  ) : (
    <Deck items={items} shape={shape} label={label} />
  )
}

// The photo itself — identical in both layouts, so neither can drift.
function Photo({ item, shape }) {
  const { width, height, aspect } = SHAPES[shape]
  return (
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
  )
}

// The frame's own highlighter pill: its own hue, fixed dark ink, and no
// hairline, because a border on a saturated fill reads as an outline the frame
// never drew. Same pill in both layouts — it is what names the card that is
// currently being looked at, whether that is the one under the pointer or the
// one on top of the deck.
function Caption({ item, hue, shown }) {
  if (!item.caption) return null
  return (
    <figcaption
      className={`pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-caption font-normal text-caption-ink shadow-[0_6px_20px_-10px_rgb(var(--shadow)/0.4)] transition-opacity duration-200 motion-reduce:transition-none lg:bottom-auto lg:top-0 lg:mb-0 lg:-translate-y-[calc(100%+12px)] ${hue} ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {item.caption}
    </figcaption>
  )
}

// ── `lg` and up: the hover spread, unchanged.
function Spread({ items, shape, layout, label }) {
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(null)
  const [exploring, setExploring] = useState(false)

  const { card, overlap, hue } = SHAPES[shape]
  // A pile opens when the pointer reaches the group, not when it reaches a
  // card: at rest every card but the top one is buried, so opening on the
  // card would leave the ones underneath permanently out of reach.
  const opened = layout === 'pile' && exploring
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
      className="flex justify-center"
    >
      {items.map((item, i) => {
        const lifted = active === i
        const tilt = TILT[i % TILT.length]
        const centred = i - (items.length - 1) / 2

        return (
          <motion.figure
            key={item.src}
            initial={false}
            animate={{
              rotate: lifted ? 0 : tilt * (spread ? SPLAY : 1),
              // A lifted card keeps its place in the spread. Sliding it back
              // to centre would walk it out from under the pointer, which
              // un-hovers it, which slides it back — a card that flickers.
              x: centred * spread,
              y:
                (lifted ? LIFT : 0) +
                (layout === 'fan' ? DRIFT[i % DRIFT.length] : 0),
              scale: lifted ? LIFT_SCALE : 1,
            }}
            transition={
              reducedMotion ? { duration: 0 } : { duration: DUR.reveal, ease: EASE }
            }
            // A pile deals first card on top, the same way the deck does, so
            // the photograph that names the group — the "pspspsps" cat — is the
            // one you see at both widths instead of the one buried underneath.
            // A fan keeps its left-to-right shingle: there every card is
            // already showing, and reversing it would only flip which edge
            // overlaps which.
            style={{
              zIndex: lifted ? 30 : layout === 'pile' ? items.length - i : i,
            }}
            onPointerEnter={() => setActive(i)}
            className={`relative shrink-0 ${card} ${i > 0 ? overlap : ''}`}
          >
            <Photo item={item} shape={shape} />
            <Caption
              item={item}
              hue={HUES[(hue + i) % HUES.length]}
              shown={lifted}
            />
          </motion.figure>
        )
      })}
    </motion.div>
  )
}

// ── Below `lg`: the swipe deck.
function Deck({ items, shape, label }) {
  const reveal = useReveal()
  const reducedMotion = useReducedMotion()
  const { aspect, hue } = SHAPES[shape]
  // How many have been thrown, and which way each one went — the direction is
  // remembered so a card returns along the arc it left on.
  const [thrown, setThrown] = useState(0)
  const [directions, setDirections] = useState([])

  // The last card has nothing behind it to reveal, so it is the one that deals
  // the group back in rather than another card to throw.
  const lastIndex = items.length - 1

  const throwCard = (index, direction) => {
    tapHaptic()
    setDirections((previous) => {
      const next = [...previous]
      next[index] = direction
      return next
    })
    setThrown(index + 1)
  }

  const dealBack = () => {
    if (!thrown) return
    tapHaptic()
    setThrown(0)
  }

  // A tap does what a swipe does. It has to, because the deck's whole
  // invitation is visual — a reader who has understood "there are more of
  // these under it" will try the shorter gesture first, and a card that
  // ignores it reads as broken rather than as swipe-only.
  //
  // Framer still reports a drag that ended over the card as a click, so a
  // throw that lands under the finger would immediately throw the next one
  // too. The flag is what separates the two: set while a drag is live, and
  // cleared a tick after it ends, which is after the click has been and gone.
  const draggingRef = useRef(false)

  const onCardClick = (index) => () => {
    if (draggingRef.current) return
    if (index === lastIndex) dealBack()
    // Tapped cards leave the way they lean, so the deal-back arc still matches
    // the way each card left.
    else throwCard(index, TILT[index % TILT.length] < 0 ? -1 : 1)
  }

  return (
    <motion.div
      {...reveal}
      role="group"
      aria-label={label}
      className="flex justify-center"
    >
      {/* The pill sits above the deck and the fan falls below and to the right
          of the top card, so the group reserves the room for both rather than
          letting either overlap the copy around it. */}
      <div
        className={`relative mb-4 mt-10 w-[68vw] max-w-[280px] md:max-w-[320px] ${aspect}`}
      >
        {items.map((item, i) => {
          const gone = i < thrown
          const isTop = i === thrown
          const depth = i - thrown

          return (
            <motion.figure
              key={item.src}
              initial={false}
              animate={
                gone
                  ? {
                      x: (directions[i] ?? 1) * THROW_X,
                      rotate: (directions[i] ?? 1) * THROW_SPIN,
                      y: 0,
                      scale: 1,
                      opacity: 0,
                    }
                  : {
                      x: depth * DECK_STEP_X,
                      y: depth * DECK_STEP_Y,
                      rotate: isTop
                        ? 0
                        : TILT[i % TILT.length] * (0.6 + depth * DECK_STEP_TILT),
                      scale: 1 - depth * DECK_STEP_SCALE,
                      opacity: 1,
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : { duration: DUR.reveal, ease: EASE }
              }
              style={{
                zIndex: gone ? 40 : items.length - depth,
                pointerEvents: gone ? 'none' : 'auto',
                touchAction: isTop && i !== lastIndex ? 'pan-y' : undefined,
              }}
              drag={isTop && i !== lastIndex ? 'x' : false}
              dragSnapToOrigin
              dragElastic={0.6}
              onDragStart={() => {
                draggingRef.current = true
              }}
              onDragEnd={(event, info) => {
                setTimeout(() => {
                  draggingRef.current = false
                }, 0)
                const far = Math.abs(info.offset.x) > SWIPE_DISTANCE
                const fast = Math.abs(info.velocity.x) > SWIPE_VELOCITY
                if (!far && !fast) return
                throwCard(i, info.offset.x < 0 ? -1 : 1)
              }}
              onClick={isTop ? onCardClick(i) : undefined}
              className="absolute inset-0 cursor-pointer"
            >
              <Photo item={item} shape={shape} />
              <Caption
                item={item}
                hue={HUES[(hue + i) % HUES.length]}
                shown={isTop}
              />
            </motion.figure>
          )
        })}
      </div>
    </motion.div>
  )
}
