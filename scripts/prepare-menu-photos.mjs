import { mkdir, readdir } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { menu } from "../src/data/menu.ts"

const root = path.resolve(import.meta.dirname, "..")
const sourceDir = path.join(root, "assets-source", "Menu")
const outDir = path.join(root, "public", "menu")

const WIDTH = 1200
const HEIGHT = 900
// The box sits slightly left of center in the source photos; cropping around it keeps both box edges in a 4:3 frame.
const FOCUS_X = 0.487

// "Black Pepper.jpg" and the menu name "Blackpepper" both become "blackpepper".
const normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "")

async function main() {
  const files = (await readdir(sourceDir)).filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
  const byName = new Map(files.map((file) => [normalize(path.parse(file).name), file]))
  await mkdir(outDir, { recursive: true })

  const missing = []
  for (const item of menu) {
    const file = byName.get(normalize(item.name)) ?? byName.get(normalize(item.id))
    if (!file) {
      missing.push(item.name)
      continue
    }
    byName.delete(normalize(path.parse(file).name))

    const image = sharp(path.join(sourceDir, file)).rotate()
    const { width, height } = await image.metadata()
    const cropWidth = Math.min(width, Math.round((height * WIDTH) / HEIGHT))
    const left = Math.max(0, Math.min(width - cropWidth, Math.round(width * FOCUS_X - cropWidth / 2)))
    const output = path.join(outDir, `${item.id}.jpg`)
    const info = await image
      .extract({ left, top: 0, width: cropWidth, height })
      .resize(WIDTH, HEIGHT)
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(output)
    console.log(`${file} -> public/menu/${item.id}.jpg (${Math.round(info.size / 1024)} KB)`)
  }

  if (missing.length) console.warn(`Belum ada foto untuk: ${missing.join(", ")}`)
  if (byName.size) console.warn(`Foto tanpa menu yang cocok: ${[...byName.values()].join(", ")}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
