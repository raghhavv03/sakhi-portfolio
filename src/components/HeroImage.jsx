// Responsive hero illustration — AVIF with WebP fallback via srcset.
// Pass `priority` on the home hero (LCP); elsewhere it lazy-loads.
const ALT =
  'Line illustration of a woman working at a laptop with her dog and cat nearby, surrounded by UX design motifs — wireframe screens, a lightbulb, a magnifier, charts, and a cursor.'

export default function HeroImage({
  className = '',
  sizes = '(min-width: 768px) 45vw, 90vw',
  priority = false,
  alt = ALT,
}) {
  return (
    <picture>
      <source
        type="image/avif"
        sizes={sizes}
        srcSet="/hero-illustration-600.avif 600w, /hero-illustration-850.avif 850w, /hero-illustration-1100.avif 1100w"
      />
      <source
        type="image/webp"
        sizes={sizes}
        srcSet="/hero-illustration-600.webp 600w, /hero-illustration-850.webp 850w, /hero-illustration-1100.webp 1100w"
      />
      <img
        src="/hero-illustration-850.webp"
        alt={alt}
        width="1100"
        height="619"
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
