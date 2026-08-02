import { useLayoutEffect, useRef, useState } from 'react'
import { useTheme } from '../lib/theme'
import { tapHaptic } from '../lib/haptics'
import { FLOAT_SHELL } from '../lib/interactions'
import { hero } from '../data/portfolio'

// The hero artwork: one room, painted twice — daylight and lamplight. Both
// frames are stacked and cross-faded, so switching the theme reads as the
// light in the room changing rather than as two different pictures.
//
// The desk lamp is the switch, at every width — tap it on a phone, click it on
// a desktop, or use the header toggle, which is the same state.
const SCENE = { width: 1672, height: 941 }
const LAMP = { x: 87.4, y: 55.5 } // % of the artwork — the lamp's shade

// The hotspot and the bloom, as a fraction of the artwork's drawn width.
const HOTSPOT = 0.09
const BLOOM = 0.24

// Where the lamp actually lands inside the box, in px.
//
// The artwork is `object-cover object-right`: it is scaled to fill the box and
// pinned to its right edge, so at any aspect ratio narrower than 1672 × 941 —
// which is every phone — part of the left of the picture is cropped away.
// LAMP is a point on the *artwork*, so the same percentage of the *box* is a
// different place entirely: on a 393px-wide phone it misses the lamp by ~70px.
// Measuring the drawn rect is what keeps the switch on the shade everywhere.
function useLampSpot(ref) {
  const [spot, setSpot] = useState(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return

    const measure = () => {
      const { width: w, height: h } = el.getBoundingClientRect()
      if (!w || !h) return
      const scale = Math.max(w / SCENE.width, h / SCENE.height)
      const drawnW = SCENE.width * scale
      const drawnH = SCENE.height * scale
      setSpot({
        // `object-right` pins the right edge; the vertical stays centred.
        left: w - drawnW + (drawnW * LAMP.x) / 100,
        top: (h - drawnH) / 2 + (drawnH * LAMP.y) / 100,
        drawnW,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return spot
}

function SceneImage({ name, alt, active, priority }) {
  return (
    <picture>
      <source
        type="image/avif"
        sizes="100vw"
        srcSet={`/${name}-840.avif 840w, /${name}-1280.avif 1280w, /${name}-1672.avif 1672w`}
      />
      <source
        type="image/webp"
        sizes="100vw"
        srcSet={`/${name}-840.webp 840w, /${name}-1280.webp 1280w, /${name}-1672.webp 1672w`}
      />
      <img
        src={`/${name}-1280.webp`}
        alt={active ? alt : ''}
        aria-hidden={active ? undefined : 'true'}
        width={SCENE.width}
        height={SCENE.height}
        loading={priority ? 'eager' : 'lazy'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-right transition-opacity duration-500 motion-reduce:transition-none ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </picture>
  )
}

export default function HeroScene({ className = '' }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const frameRef = useRef(null)
  const spot = useLampSpot(frameRef)

  // Both the hotspot and its bloom scale with the drawn artwork, so the shade
  // keeps the same target on a phone as it does on a desk — with a 44px floor,
  // because a proportional target is still a thumb target.
  const hotspot = spot ? Math.max(44, spot.drawnW * HOTSPOT) : 0
  const bloom = spot ? spot.drawnW * BLOOM : 0

  return (
    <div ref={frameRef} className={`relative overflow-hidden ${className}`}>
      <SceneImage
        name="hero-scene-light"
        alt={hero.scene.altLight}
        active={!isDark}
        priority={!isDark}
      />
      <SceneImage
        name="hero-scene-dark"
        alt={hero.scene.altDark}
        active={isDark}
        priority={isDark}
      />

      {spot && (
        <>
          {/* Lamplight. At night the lamp is on, so a soft amber bloom sits on
              the shade — `--lamp` is that light's own colour. Opacity only, and
              faint: it reads as the bulb being lit, not as a glow effect
              applied to the picture. */}
          <div
            aria-hidden="true"
            style={{
              left: spot.left,
              top: spot.top,
              width: bloom,
              height: bloom,
              background:
                'radial-gradient(circle, rgb(var(--lamp) / 0.28) 0%, rgb(var(--lamp) / 0.10) 45%, transparent 72%)',
            }}
            className={`pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl transition-opacity duration-500 motion-reduce:transition-none ${
              isDark ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* The lamp. An invisible hotspot over the lamp head — no halo, no
              ring. The cursor label says it is a control on a fine pointer; the
              small glass hint above it is what says so everywhere else. */}
          <button
            type="button"
            onClick={() => {
              tapHaptic()
              toggleTheme()
            }}
            aria-label={
              isDark
                ? 'Turn the lamp off — switch to light mode'
                : 'Turn the lamp on — switch to dark mode'
            }
            aria-pressed={isDark}
            data-cursor={isDark ? 'Day mode' : 'Night mode'}
            style={{
              left: spot.left,
              top: spot.top,
              width: hotspot,
              height: hotspot,
            }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
          >
            {/* Rides with the hotspot, so it cannot drift off the lamp at any
                width. The hotspot is the shade's own size, so sitting just
                above its top edge clears the shade on a phone and on a desk
                alike. Decorative — the button's aria-label already carries it —
                and pointer-transparent, so the lamp keeps the whole target.
                Same frosted shell as the floating nav, forced round. */}
            {hero.scene.hint && (
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap px-2.5 py-1 text-caption font-normal text-text-muted ${FLOAT_SHELL} !rounded-full`}
              >
                {hero.scene.hint}
              </span>
            )}
          </button>
        </>
      )}
    </div>
  )
}
