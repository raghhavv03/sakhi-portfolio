// Source illustration → transparent PNG → responsive AVIF + WebP at three widths.
// Background removal: flood-fill from image borders through light/neutral pixels.
//
// Run: npm run optimize:hero
import sharp from 'sharp'

const SRC =
  process.argv[2] || new URL('../assets/hero-illustration.png', import.meta.url).pathname
const OUT = new URL('../public/', import.meta.url).pathname
const WIDTHS = [600, 850, 1100]

// Bright, near-neutral pixels (backdrop + white) are cleared; saturated fills and strokes stay.
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

const visited = new Uint8Array(W * H)
const queue = new Int32Array(W * H)
let qlen = 0

function seed(x, y) {
  const p = y * W + x
  if (visited[p]) return
  const i = p * C
  if (isBg(data[i], data[i + 1], data[i + 2])) {
    visited[p] = 1
    queue[qlen++] = p
  }
}

for (let x = 0; x < W; x++) {
  seed(x, 0)
  seed(x, H - 1)
}
for (let y = 0; y < H; y++) {
  seed(0, y)
  seed(W - 1, y)
}

let cleared = 0
while (qlen > 0) {
  const p = queue[--qlen]
  const x = p % W
  const y = (p - x) / W
  data[p * C + 3] = 0
  cleared++
  const neighbours = [
    x > 0 ? p - 1 : -1,
    x < W - 1 ? p + 1 : -1,
    y > 0 ? p - W : -1,
    y < H - 1 ? p + W : -1,
  ]
  for (const np of neighbours) {
    if (np < 0 || visited[np]) continue
    const i = np * C
    if (isBg(data[i], data[i + 1], data[i + 2])) {
      visited[np] = 1
      queue[qlen++] = np
    }
  }
}
console.log(`cleared ${(cleared / (W * H) * 100).toFixed(1)}% of pixels to transparent`)

// Rebuild a clean transparent master, then export responsive variants.
const masterBuf = await sharp(data, {
  raw: { width: W, height: H, channels: C },
})
  .png()
  .toBuffer()

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
