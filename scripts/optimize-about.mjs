// About-page photographs → cropped, right-sized WebP.
//
// These are phone photos of real objects and real trips, so each one is
// cover-cropped to the aspect its card actually renders at — the card never
// letterboxes, and the browser never downloads pixels the crop throws away.
// Widths are ~2.2× the largest CSS size the card reaches (a lifted card in the
// desktop stack), which is enough for a 2× screen without paying for a 3× one.
//
// Run: npm run optimize:about
import sharp from 'sharp'

const SRC = new URL('../assets/about/', import.meta.url).pathname
const OUT = new URL('../public/images/about/', import.meta.url).pathname

// One entry per card shape on the page. `ratio` is the card's aspect in the
// Figma frame; `width` is the exported pixel width.
const SHAPES = {
  make: { width: 440, ratio: 200 / 217 },
  cat: { width: 460, ratio: 1 },
  trip: { width: 480, ratio: 256 / 341 },
  portrait: { width: 720, ratio: 338 / 435 },
}

const IMAGES = [
  ['make-coasters', 'make'],
  ['make-bucket-hat', 'make'],
  ['make-caroline-top', 'make'],
  ['make-cardigan', 'make'],
  ['make-tote', 'make'],
  ['cat-1', 'cat'],
  ['cat-2', 'cat'],
  ['cat-3', 'cat'],
  ['trip-kayaking', 'trip'],
  ['trip-aquarium', 'trip'],
  ['trip-sunset', 'trip'],
  ['trip-rainier', 'trip'],
  ['portrait', 'portrait'],
]

for (const [name, shape] of IMAGES) {
  const { width, ratio } = SHAPES[shape]
  const height = Math.round(width / ratio)
  const info = await sharp(`${SRC}${name}.jpg`)
    .rotate()
    .resize({ width, height, fit: 'cover', position: 'attention' })
    .webp({ quality: 76, effort: 6 })
    .toFile(`${OUT}${name}.webp`)
  console.log(
    `${name}: ${info.width}x${info.height} · ${(info.size / 1024).toFixed(1)}KB`
  )
}
