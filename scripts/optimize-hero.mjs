// One-off: turn the source illustration (which ships with a baked-in
// checkerboard "transparency" background) into a clean transparent PNG, then
// emit responsive, optimized AVIF + WebP at three widths.
//
// Background removal: clear every "light" pixel (the white + light-grey
// checkerboard tiles, plus the artwork's own white interior fills) to alpha 0
// globally. Only the black strokes and the pastel-blue fills are kept. Doing
// this globally — rather than flood-filling from the edges — also removes
// background pockets fully enclosed by line art (e.g. behind the laptop or
// under the desk). The artwork's interior whites that also clear simply become
// the off-white page colour behind them, which is visually identical, so the
// result reads as a clean transparent line illustration.
//
// Run: node scripts/optimize-hero.mjs [sourcePath]
import sharp from 'sharp'

// Default source is the cleaned, transparent master committed to the repo.
// (The background-clearing pass below is idempotent, so re-running on the
// already-transparent master is harmless.)
const SRC =
  process.argv[2] || new URL('../assets/hero-illustration.png', import.meta.url).pathname
const OUT = new URL('../public/', import.meta.url).pathname
const WIDTHS = [600, 850, 1100]

// A pixel counts as removable background when it's bright and near-neutral
// (white tile ~255 or grey tile ~226). Pastel blue (min channel ~181) and the
// dark strokes both fail this test, so they're preserved.
function isBg(r, g, b) {
  const min = Math.min(r, g, b)
  const max = Math.max(r, g, b)
  return min >= 200 && max - min <= 28
}

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width: W, height: H, channels: C } = info
console.log(`source: ${W}x${H} channels=${C}`)

let cleared = 0
for (let p = 0; p < W * H; p++) {
  const i = p * C
  if (isBg(data[i], data[i + 1], data[i + 2])) {
    data[i + 3] = 0 // make transparent
    cleared++
  }
}
console.log(`cleared ${(cleared / (W * H) * 100).toFixed(1)}% of pixels to transparent`)

// Rebuild a clean transparent master, then export responsive variants.
const master = sharp(data, { raw: { width: W, height: H, channels: C } }).png()
const masterBuf = await master.toBuffer()

for (const w of WIDTHS) {
  const base = sharp(masterBuf).resize({ width: w, withoutEnlargement: true })
  const avif = await base
    .clone()
    .avif({ quality: 52, effort: 6 })
    .toFile(`${OUT}hero-illustration-${w}.avif`)
  const webp = await base
    .clone()
    .webp({ quality: 72, effort: 6 })
    .toFile(`${OUT}hero-illustration-${w}.webp`)
  console.log(
    `w=${w}  avif ${(avif.size / 1024).toFixed(1)}KB  webp ${(
      webp.size / 1024
    ).toFixed(1)}KB`
  )
}
console.log('done')
