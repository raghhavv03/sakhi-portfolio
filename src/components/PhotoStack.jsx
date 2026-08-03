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
// Below `lg` it is a deck you swipe: the top card follows the thumb, swings
// aside, turns away and drops in at the back of the pile, and the next one is
// already underneath. The deck is a loop — it never empties and never needs
// dealing back, so a reader can keep going round it for as long as they like.
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

// The deck, below `lg`. A swiped card is never thrown away — it swings aside,
// turns away from the reader and comes back in at the back of the pile, so the
// group is a loop with no end to reach. TUCK_* is the far point of that arc.
//
// The card has to change z-order somewhere on that arc, and the turn is what
// hides it: `TUCK_TURN` is a quarter turn, so at the far point the card is
// exactly edge-on and draws nothing at all. There is no frame in which a card
// is seen to jump from the front of the pile to the back. That is also why the
// arc can stay narrow enough never to reach the edge of a 360px screen —
// nothing here needs the card to be clear of the deck to hide the swap.
const TUCK_X = 88
const TUCK_Y = 18
const TUCK_SPIN = 12
const TUCK_TURN = 90
const TUCK_SCALE = 0.8
const TUCK_FADE = 0.35
const TUCK_DURATION = 0.34
// Without a perspective the turn is a flat squash rather than a card turning
// away. It is a long one because a short one throws the near edge of a turning
// card a long way out — far enough, on a phone, to reach past the screen and
// give the page a horizontal scroll for as long as the arc lasts.
const TUCK_PERSPECTIVE = 1600
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
  const count = items.length
  // How many cards have gone round. Every card's depth is measured off it —
  // card `i` sits at `(i - turns) mod count` — so the pile reorders itself
  // without the array ever moving and the deck never runs out.
  const [turns, setTurns] = useState(0)
  // The cards mid-tuck and which way each one swung. More than one can be in
  // the air at once, because a reader can swipe faster than the arc lands.
  const [tucking, setTucking] = useState({})

  // Under `prefers-reduced-motion` there is no arc to travel, so the card is
  // never marked as tucking — it simply reappears at the back of the pile.
  const throwCard = (index, direction) => {
    tapHaptic()
    if (!reducedMotion) {
      setTucking((previous) => ({ ...previous, [index]: direction }))
    }
    setTurns((previous) => previous + 1)
  }

  // The out leg has landed: the card is now at the far point of the arc, clear
  // of the deck, so dropping it to the back of the z-order here is unseen. What
  // it animates next is its ordinary resting position — the way in is the
  // normal deck transition, so the card slides home behind the others.
  const landCard = (index) => {
    setTucking((previous) => {
      if (!(index in previous)) return previous
      const next = { ...previous }
      delete next[index]
      return next
    })
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

  // Tapped cards leave the way they lean, so a tap still has a direction.
  const onCardClick = (index) => () => {
    if (draggingRef.current) return
    throwCard(index, TILT[index % TILT.length] < 0 ? -1 : 1)
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
          const depth = (((i - turns) % count) + count) % count
          const isTop = depth === 0
          const direction = tucking[i]
          const tucked = direction !== undefined

          return (
            <motion.figure
              key={item.src}
              initial={false}
              animate={
                tucked
                  ? {
                      x: direction * TUCK_X,
                      y: TUCK_Y,
                      rotate: direction * TUCK_SPIN,
                      rotateY: direction * TUCK_TURN,
                      scale: TUCK_SCALE,
                      opacity: TUCK_FADE,
                    }
                  : {
                      x: depth * DECK_STEP_X,
                      y: depth * DECK_STEP_Y,
                      rotate: isTop
                        ? 0
                        : TILT[i % TILT.length] * (0.6 + depth * DECK_STEP_TILT),
                      rotateY: 0,
                      scale: 1 - depth * DECK_STEP_SCALE,
                      opacity: 1,
                    }
              }
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: tucked ? TUCK_DURATION : DUR.reveal,
                      ease: EASE,
                    }
              }
              onAnimationComplete={tucked ? () => landCard(i) : undefined}
              style={{
                zIndex: tucked ? count + 1 : count - depth,
                // A card on its way round passes over the deck. It is not the
                // one being read, so it must not swallow the next swipe.
                pointerEvents: tucked ? 'none' : 'auto',
                transformPerspective: TUCK_PERSPECTIVE,
                touchAction: isTop ? 'pan-y' : undefined,
              }}
              drag={isTop ? 'x' : false}
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
