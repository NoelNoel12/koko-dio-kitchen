import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { chromium } from "playwright"

export const root = path.resolve(import.meta.dirname, "..")
export const fileUrl = (...parts) => pathToFileURL(path.join(root, ...parts)).href

export const brandCss = `
  @font-face { font-family: "Lilita One"; src: url("${fileUrl("node_modules/@fontsource/lilita-one/files/lilita-one-latin-400-normal.woff2")}") format("woff2"); }
  @font-face { font-family: "Plus Jakarta Sans"; font-weight: 200 800; src: url("${fileUrl("node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2")}") format("woff2"); }
  @page { margin: 0; }
  * { box-sizing: border-box; margin: 0; }
  body { background: #fff9ea; color: #000; font-family: "Plus Jakarta Sans", sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .display { font-family: "Lilita One", sans-serif; font-weight: 400; }
`

// Renders each page through a real HTML file so local fonts and images load from file:// URLs.
export async function renderPages(pages) {
  const work = await mkdtemp(path.join(tmpdir(), "kdk-render-"))
  const browser = await chromium.launch()
  try {
    for (const page of pages) {
      const htmlPath = path.join(work, `${path.basename(page.png)}.html`)
      await writeFile(htmlPath, page.html)
      const tab = await browser.newPage({
        viewport: { width: page.width, height: page.height },
        deviceScaleFactor: page.scale ?? 1,
      })
      await tab.goto(pathToFileURL(htmlPath).href, { waitUntil: "load" })
      await tab.evaluate(() => document.fonts.ready)
      if (page.pdf) {
        await tab.pdf({ path: page.pdf.path, width: page.pdf.width, height: page.pdf.height, printBackground: true })
      }
      await tab.screenshot({ path: page.png })
      await tab.close()
    }
  } finally {
    await browser.close()
    await rm(work, { recursive: true, force: true })
  }
}
