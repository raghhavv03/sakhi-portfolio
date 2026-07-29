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

      {/* The lamp. A real button with a real label — the halo is only the
          affordance that says it can be pressed. */}
      <button
        type="button"
        onClick={() => {
          tapHaptic()
          toggleTheme()
        }}
        aria-label={isDark ? 'Turn the lamp off — switch to light mode' : 'Turn the lamp on — switch to dark mode'}
        aria-pressed={isDark}
        data-cursor={isDark ? 'Lights on' : 'Lights off'}
        title={hero.scene.lampHint}
        style={{ left: `${LAMP.x}%`, top: `${LAMP.y}%` }}
        className="group absolute z-10 h-[9%] min-h-[44px] w-[9%] min-w-[44px] -translate-x-1/2 -translate-y-1/2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text/25 focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-lamp/30 blur-md animate-lamp-breathe group-hover:animate-none group-hover:bg-lamp/50 group-focus-visible:animate-none motion-reduce:animate-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-[18%] rounded-full border border-lamp/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
      </button>
    </div>
  )
}
