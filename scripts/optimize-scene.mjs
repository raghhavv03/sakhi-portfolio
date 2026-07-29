// Hero scene (light + dark room) → responsive AVIF + WebP at three widths.
// These are photographic artwork, not line art, so — unlike optimize-hero —
// nothing is keyed out: the frame is shown edge to edge behind the hero copy.
//
// Run: npm run optimize:scene
import sharp from 'sharp'

const OUT = new URL('../public/', import.meta.url).pathname
const WIDTHS = [840, 1280, 1672]

const SOURCES = [
  { name: 'hero-scene-light', src: '../assets/hero-scene-light.png' },
  { name: 'hero-scene-dark', src: '../assets/hero-scene-dark.png' },
]

for (const { name, src } of SOURCES) {
  const file = new URL(src, import.meta.url).pathname
  const { width, height } = await sharp(file).metadata()
  console.log(`${name}: ${width}x${height}`)

  for (const w of WIDTHS) {
    const base = sharp(file).resize({ width: w, withoutEnlargement: true })
    const avif = await base
      .clone()
      .avif({ quality: 50, effort: 6 })
      .toFile(`${OUT}${name}-${w}.avif`)
    const webp = await base
      .clone()
      .webp({ quality: 74, effort: 6 })
      .toFile(`${OUT}${name}-${w}.webp`)
    console.log(
      `  w=${w}  avif ${(avif.size / 1024).toFixed(1)}KB  webp ${(
        webp.size / 1024
      ).toFixed(1)}KB`
    )
  }
}
console.log('done')
