import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import jsQR from "jsqr"
import QRCode from "qrcode"
import sharp from "sharp"
import { menu } from "../src/data/menu.ts"
import { site } from "../src/data/site.ts"
import { formatPrice } from "../src/lib/menu.ts"
import { brandCss, fileUrl, renderPages, root } from "./brand-html.mjs"

// The short link redirects to the Vercel site, so the printed QR keeps working if the site moves.
const url = process.argv[2] ?? "https://bit.ly/kokodiokitchen"
const outDir = path.join(root, "print")

// Level M survives a scuffed or slightly glared print; no logo is placed over the code.
const qrOptions = { errorCorrectionLevel: "M", margin: 4, color: { dark: "#000000", light: "#ffffff" } }

const formats = [
  { file: "kartu-meja-a6", widthMm: 105, heightMm: 148 },
  { file: "standee-a4", widthMm: 210, heightMm: 297 },
]

const cheapest = formatPrice(Math.min(...menu.map((item) => item.price)))
const payment = site.payment.join(" atau ")
const shortUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "")

function cardHtml(qrSvg, widthMm) {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<style>
  ${brandCss}
  html { font-size: ${widthMm / 26}mm; }
  body { width: 100vw; height: 100vh; overflow: hidden; display: flex; flex-direction: column; align-items: center; }
  .top { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.9rem; padding: 1.4rem 1.6rem 1rem; width: 100%; }
  .logo { height: 7.4rem; }
  h1 { font-size: 2.35rem; line-height: 0.95; text-align: center; }
  .sub { margin-top: -0.35rem; font-size: 0.95rem; font-weight: 600; }
  .qr { width: 13.2rem; padding: 0.5rem; background: #fff; border: 0.16rem solid #000; border-radius: 1rem; box-shadow: 0.3rem 0.3rem 0 #000; }
  .qr svg { display: block; width: 100%; height: auto; }
  .url { font-size: 0.95rem; font-weight: 800; }
  .band { width: 100%; padding: 0.95rem 1.6rem 1.15rem; background: #fa5b17; border-top: 0.16rem solid #000; text-align: center; }
  .band strong { display: block; font-size: 1.35rem; line-height: 1.05; }
  .band span { display: block; margin-top: 0.3rem; font-size: 0.8rem; font-weight: 600; }
</style>
</head>
<body>
  <div class="top">
    <img class="logo" src="${fileUrl("public/brand/logo-hero.webp")}" alt="">
    <h1 class="display">Scan untuk lihat menu</h1>
    <p class="sub">${menu.length} rasa rice box, mulai ${cheapest}</p>
    <div class="qr">${qrSvg}</div>
    <p class="url">${shortUrl}</p>
  </div>
  <div class="band">
    <strong class="display">Bayar di kasir: ${payment}</strong>
    <span>QR ini hanya untuk melihat menu, bukan untuk membayar.</span>
  </div>
</body>
</html>`
}

async function decodeQr(pngPath) {
  const { data, info } = await sharp(pngPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data ?? null
}

async function main() {
  await mkdir(outDir, { recursive: true })

  const qrSvg = await QRCode.toString(url, { ...qrOptions, type: "svg" })
  await writeFile(path.join(outDir, "qr-menu.svg"), qrSvg)
  await QRCode.toFile(path.join(outDir, "qr-menu.png"), url, { ...qrOptions, width: 2048 })

  // 96 css px per inch, scaled by 3.125 for a 300 dpi preview.
  await renderPages(
    formats.map((format) => ({
      html: cardHtml(qrSvg, format.widthMm),
      width: Math.round((format.widthMm / 25.4) * 96),
      height: Math.round((format.heightMm / 25.4) * 96),
      scale: 3.125,
      png: path.join(outDir, `${format.file}.png`),
      pdf: { path: path.join(outDir, `${format.file}.pdf`), width: `${format.widthMm}mm`, height: `${format.heightMm}mm` },
    })),
  )

  for (const file of ["qr-menu.png", ...formats.map((format) => `${format.file}.png`)]) {
    const decoded = await decodeQr(path.join(outDir, file))
    if (decoded !== url) throw new Error(`QR di ${file} terbaca "${decoded}", seharusnya "${url}"`)
    console.log(`${file}: QR terbaca ${decoded}`)
  }
  console.log(`File cetak tersimpan di ${outDir}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
