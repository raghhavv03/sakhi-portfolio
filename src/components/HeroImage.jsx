// Responsive hero illustration. Serves AVIF with a WebP fallback across three
// widths via srcset; the browser picks the smallest sufficient file. Explicit
// width/height (the source's 2752×1536 ratio, expressed at 1100×614) reserve
// the aspect box so there's no layout shift while it loads. Every variant is
// under ~150KB; the transparent background is baked in by scripts/optimize-hero.mjs.
//
// On the home hero this is the LCP element — pass `priority` there to load it
// eagerly with high fetch priority; elsewhere it lazy-loads.
const ALT =
  'Line illustration of a woman working at a laptop, surrounded by the things she loves — crochet and yarn, a sleeping cat, a dog, potted plants, a camera, jingle bells, and a kathak dancer.'

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
        height="614"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
