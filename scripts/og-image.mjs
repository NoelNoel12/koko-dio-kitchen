import path from "node:path"
import sharp from "sharp"
import { menu } from "../src/data/menu.ts"
import { site } from "../src/data/site.ts"
import { formatPrice } from "../src/lib/menu.ts"
import { brandCss, fileUrl, renderPages, root } from "./brand-html.mjs"

const output = path.join(root, "public", "og.png")
const shortLink = "bit.ly/kokodiokitchen"
const cheapest = formatPrice(Math.min(...menu.map((item) => item.price)))

const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date())
const eventLabel =
  site.event.date && site.event.date >= today
    ? `${new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
      }).format(new Date(`${site.event.date}T12:00:00+07:00`))} di ${site.event.place}`
    : null

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<style>
  ${brandCss}
  body { width: 1200px; height: 630px; overflow: hidden; display: grid; grid-template-columns: 340px 1fr; align-items: center; gap: 56px; padding: 0 64px 0 88px; }
  .logo { height: 480px; justify-self: center; }
  h1 { font-size: 92px; line-height: 0.92; letter-spacing: -0.01em; }
  .sub { margin-top: 18px; font-size: 30px; font-weight: 600; }
  .tag { display: inline-block; margin-top: 28px; padding: 12px 22px 14px; background: #fa5b17; border: 4px solid #000; border-radius: 20px; box-shadow: 7px 7px 0 #000; transform: rotate(-2deg); font-size: 32px; line-height: 1.05; white-space: nowrap; }
  .link { margin-top: 32px; font-size: 26px; font-weight: 800; }
</style>
</head>
<body>
  <img class="logo" src="${fileUrl("public/brand/logo-hero.webp")}" alt="">
  <div>
    <h1 class="display">Rice box<br>mulai ${cheapest}</h1>
    <p class="sub">${menu.length} rasa, bayar ${site.payment.join(" atau ")} di booth</p>
    ${eventLabel ? `<p class="tag display">${eventLabel}</p>` : ""}
    <p class="link">${shortLink}</p>
  </div>
</body>
</html>`

async function main() {
  const raw = `${output}.raw.png`
  await renderPages([{ html, width: 1200, height: 630, png: raw }])
  await sharp(raw).png({ compressionLevel: 9, palette: true, quality: 90 }).toFile(output)
  const { rm } = await import("node:fs/promises")
  await rm(raw)
  console.log(`Gambar preview tersimpan di ${output}${eventLabel ? ` (dengan tanggal: ${eventLabel})` : ""}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
