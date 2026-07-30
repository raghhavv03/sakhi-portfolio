import { useTheme } from '../lib/theme'
import { tapHaptic } from '../lib/haptics'
import { hero } from '../data/portfolio'

// The hero artwork: one room, painted twice — daylight and lamplight. Both
// frames are stacked and cross-faded, so switching the theme reads as the
// light in the room changing rather than as two different pictures.
//
// The desk lamp is the switch. Its hotspot is placed in the artwork's own
// coordinates (the frame is 1672 × 941 and is never cropped vertically), so
// the button sits on the lamp head at every width.
const SCENE = { width: 1672, height: 941 }
const LAMP = { x: 87.4, y: 55.5 } // % of the frame — the lamp's shade

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

  return (
    <div className={`relative overflow-hidden ${className}`}>
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

      {/* The lamp. An invisible hotspot over the lamp head — no halo, no ring,
          no tooltip. The only light in the picture is the light the artwork
          paints, and the cursor label is what says the lamp is a control. */}
      <button
        type="button"
        onClick={() => {
          tapHaptic()
          toggleTheme()
        }}
        aria-label={isDark ? 'Turn the lamp off — switch to light mode' : 'Turn the lamp on — switch to dark mode'}
        aria-pressed={isDark}
        data-cursor={isDark ? 'Day mode' : 'Night mode'}
        style={{ left: `${LAMP.x}%`, top: `${LAMP.y}%` }}
        className="absolute z-10 h-[9%] min-h-[44px] w-[9%] min-w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
      />
    </div>
  )
}
