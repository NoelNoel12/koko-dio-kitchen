import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(import.meta.dirname, "..")
const source = path.join(root, "assets-source", "Koko_Dio_Kitchen_LOGO_FINAL.png")
const publicDir = path.join(root, "public")
const appDir = path.join(root, "src", "app")
const CREAM = { r: 255, g: 249, b: 234, alpha: 1 }

// The source is ~20k px square, far above sharp's default pixel guard.
const open = (input) => sharp(input, { limitInputPixels: false })

async function loadWorkingCopy() {
  const { data, info } = await open(source)
    .resize({ width: 4000 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

function edgeIsTransparent({ data, width, height }) {
  let clear = 0
  let total = 0
  const check = (x, y) => {
    total++
    if (data[(y * width + x) * 4 + 3] < 16) clear++
  }
  for (let x = 0; x < width; x += 8) {
    check(x, 0)
    check(x, height - 1)
  }
  for (let y = 0; y < height; y += 8) {
    check(0, y)
    check(width - 1, y)
  }
  return clear / total > 0.95
}

// Only near-white pixels connected to the border are cleared, so the white
// chef hat stays because the black outline walls it off.
function floodFillBackground({ data, width, height }) {
  const isBackground = (i) => data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235
  const seen = new Uint8Array(width * height)
  const stack = []
  const push = (x, y) => {
    const p = y * width + x
    if (seen[p]) return
    seen[p] = 1
    if (isBackground(p * 4)) stack.push(p)
  }
  for (let x = 0; x < width; x++) {
    push(x, 0)
    push(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    push(0, y)
    push(width - 1, y)
  }
  while (stack.length) {
    const p = stack.pop()
    data[p * 4 + 3] = 0
    const x = p % width
    const y = (p - x) / width
    if (x > 0) push(x - 1, y)
    if (x < width - 1) push(x + 1, y)
    if (y > 0) push(x, y - 1)
    if (y < height - 1) push(x, y + 1)
  }
}

function contentBox({ data, width, height }) {
  let minX = width
  let minY = height
  let maxX = 0
  let maxY = 0
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 8) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 }
}

function withPadding(box, ratio, image) {
  const pad = Math.round(Math.max(box.width, box.height) * ratio)
  const left = Math.max(0, box.left - pad)
  const top = Math.max(0, box.top - pad)
  return {
    left,
    top,
    width: Math.min(image.width - left, box.width + pad * 2),
    height: Math.min(image.height - top, box.height + pad * 2),
  }
}

// ICO files may embed PNG payloads directly, which every current browser reads.
function buildIco(pngs) {
  const header = Buffer.alloc(6 + pngs.length * 16)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(pngs.length, 4)
  let offset = header.length
  pngs.forEach(({ size, buffer }, i) => {
    const entry = 6 + i * 16
    header.writeUInt8(size >= 256 ? 0 : size, entry)
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1)
    header.writeUInt8(0, entry + 2)
    header.writeUInt8(0, entry + 3)
    header.writeUInt16LE(1, entry + 4)
    header.writeUInt16LE(32, entry + 6)
    header.writeUInt32LE(buffer.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += buffer.length
  })
  return Buffer.concat([header, ...pngs.map((p) => p.buffer)])
}

async function main() {
  const image = await loadWorkingCopy()

  if (edgeIsTransparent(image)) {
    console.log("Background sudah transparan, flood-fill dilewati.")
  } else {
    console.log("Background tidak transparan, menjalankan flood-fill dari tepi.")
    floodFillBackground(image)
  }

  const raw = { raw: { width: image.width, height: image.height, channels: 4 } }
  const box = withPadding(contentBox(image), 0.02, image)
  const logo = await sharp(image.data, raw).extract(box).png().toBuffer()
  const meta = await sharp(logo).metadata()
  console.log(`Logo setelah crop: ${meta.width} x ${meta.height}`)

  await mkdir(path.join(publicDir, "brand"), { recursive: true })

  await sharp(logo).resize({ width: 900 }).webp({ quality: 86, alphaQuality: 90 })
    .toFile(path.join(publicDir, "brand", "logo-hero.webp"))
  await sharp(logo).resize({ height: 120 }).webp({ quality: 88 })
    .toFile(path.join(publicDir, "brand", "logo-header.webp"))
  await sharp(logo).resize({ height: 240 }).webp({ quality: 88 })
    .toFile(path.join(publicDir, "brand", "logo-header@2x.webp"))

  // Head and hat sit in the top third; this square leaves out the spatula and most of the thumb.
  const headSize = Math.round(meta.width * 0.67)
  const head = await sharp(logo)
    .extract({ left: Math.round(meta.width * 0.09), top: 0, width: headSize, height: headSize })
    .png()
    .toBuffer()

  const square = async (size, background) => {
    const inner = Math.round(size * (background ? 0.84 : 1))
    const art = await sharp(head).resize(inner, inner).png().toBuffer()
    return sharp({
      create: { width: size, height: size, channels: 4, background: background ?? { r: 0, g: 0, b: 0, alpha: 0 } },
    })
      .composite([{ input: art, gravity: "center" }])
      .png({ compressionLevel: 9 })
      .toBuffer()
  }

  const icoSizes = [16, 32, 48]
  const icoPngs = await Promise.all(icoSizes.map(async (size) => ({ size, buffer: await square(size) })))
  await writeFile(path.join(appDir, "favicon.ico"), buildIco(icoPngs))
  await writeFile(path.join(appDir, "apple-icon.png"), await square(180, CREAM))
  await writeFile(path.join(appDir, "icon.png"), await square(512, CREAM))

  console.log("Aset selesai dibuat. Gambar preview link dibuat terpisah dengan npm run og.")
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
