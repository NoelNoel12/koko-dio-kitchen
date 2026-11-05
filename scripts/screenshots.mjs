import { mkdir } from "node:fs/promises"
import path from "node:path"
import { chromium } from "playwright"

const url = process.argv[2] ?? "http://localhost:3000"
const outDir = path.resolve(import.meta.dirname, "..", "screenshots")
const viewports = [
  { width: 360, height: 740 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
]

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch()
let failed = false

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 })
  const errors = []
  page.on("console", (message) => message.type() === "error" && errors.push(message.text()))
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto(url, { waitUntil: "networkidle" })
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(700)

  const name = String(viewport.width)
  await page.screenshot({ path: path.join(outDir, `${name}-first-screen.png`) })
  await page.screenshot({ path: path.join(outDir, `${name}-full.png`), fullPage: true })

  const report = await page.evaluate(() => {
    const doc = document.documentElement
    const smallTargets = [...document.querySelectorAll("a, button")]
      // Card triggers stretch their hit area over the whole card, so measure the card.
      .map((el) => ({
        text: el.textContent?.trim() || el.getAttribute("aria-label"),
        box: (el.matches('[aria-haspopup="dialog"]') ? el.closest("article") ?? el : el).getBoundingClientRect(),
      }))
      .filter(({ box }) => box.width > 0 && (box.height < 44 || box.width < 44))
      .map(({ text, box }) => `${text} (${Math.round(box.width)}x${Math.round(box.height)})`)
    const clipped = [...document.querySelectorAll("h1, h2, h3, p, span:not(.sr-only), a")]
      .filter((el) => el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== "visible" && getComputedStyle(el).visibility !== "hidden")
      .map((el) => el.textContent?.trim())
    const firstCard = document.querySelector("#menu article")?.getBoundingClientRect()
    return {
      horizontalOverflow: doc.scrollWidth - doc.clientWidth,
      smallTargets,
      clipped,
      firstCardTop: firstCard ? Math.round(firstCard.top) : null,
      viewportHeight: window.innerHeight,
      items: [...document.querySelectorAll("#menu article")].map((card) => [
        card.querySelector("h3")?.textContent,
        card.querySelector("p:last-of-type")?.textContent,
      ]),
    }
  })

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2))
  await page.waitForTimeout(400)
  const navLogo = await page.evaluate(() => {
    const link = document.querySelector('nav a[href="#top"]')
    const box = link?.getBoundingClientRect()
    return { shown: link?.getAttribute("data-shown") === "true", width: Math.round(box?.width ?? 0), height: Math.round(box?.height ?? 0) }
  })
  await page.screenshot({ path: path.join(outDir, `${name}-scrolled.png`) })
  const navLogoBroken = !navLogo.shown || navLogo.width < 44 || navLogo.height < 44

  // Scroll deep first so every filter tap has to bring the menu back under the sticky nav.
  const navChecks = []
  for (const label of ["Rp25.000", "Rp18.000", "Semua"]) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.getByRole("link", { name: label, exact: true }).click()
    await page.waitForTimeout(1500)
    navChecks.push(
      await page.evaluate((chip) => {
        const nav = document.querySelector("nav")?.getBoundingClientRect()
        const visible = [...document.querySelectorAll("#menu > section")].filter((s) => !s.hidden)
        const heading = visible[0]?.querySelector("h2")?.getBoundingClientRect()
        return {
          chip,
          current: document.querySelector('nav [aria-current="true"]')?.textContent,
          visibleSections: visible.map((s) => s.querySelector("h2")?.textContent),
          status: document.querySelector('nav [role="status"]')?.textContent,
          navBottom: Math.round(nav?.bottom ?? 0),
          headingTop: Math.round(heading?.top ?? 0),
        }
      }, label),
    )
    if (label === "Rp25.000") await page.screenshot({ path: path.join(outDir, `${name}-filter-25k.png`) })
  }

  await page.evaluate(() => window.scrollTo(0, 0))
  await page.getByRole("button", { name: /Katsu Ori/ }).click()
  await page.waitForTimeout(500)
  const detail = await page.evaluate(() => {
    const dialog = document.querySelector("dialog")
    const box = dialog?.getBoundingClientRect()
    return {
      open: dialog?.open ?? false,
      title: dialog?.querySelector("h2")?.textContent,
      rows: [...(dialog?.querySelectorAll("dt") ?? [])].map((dt) => `${dt.textContent}: ${dt.nextElementSibling?.textContent}`),
      focused: document.activeElement?.textContent,
      fitsWidth: box ? box.left >= 0 && box.right <= window.innerWidth : false,
      fitsHeight: box ? box.top >= 0 && box.bottom <= window.innerHeight + 1 : false,
      pageScrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
    }
  })
  await page.screenshot({ path: path.join(outDir, `${name}-detail.png`) })
  await page.keyboard.press("Escape")
  await page.waitForTimeout(300)
  const afterClose = await page.evaluate(() => ({
    open: document.querySelector("dialog")?.open ?? false,
    focusBack: document.activeElement?.textContent,
  }))
  const detailBroken =
    !detail.open ||
    detail.title !== "Katsu Ori" ||
    detail.rows.length !== 4 ||
    detail.focused !== "Tutup" ||
    !detail.fitsWidth ||
    !detail.fitsHeight ||
    !detail.pageScrollLocked ||
    afterClose.open ||
    !afterClose.focusBack?.startsWith("Katsu Ori")

  const coveredHeadings = navChecks.filter((check) => check.headingTop < check.navBottom)
  const wrongActive = navChecks.filter(
    (check) =>
      check.current !== check.chip ||
      (check.chip === "Semua" ? check.visibleSections.length < 2 : check.visibleSections.length !== 1 || !check.visibleSections[0]?.includes(check.chip)),
  )
  if (report.horizontalOverflow > 0 || report.smallTargets.length || report.clipped.length || coveredHeadings.length || wrongActive.length || detailBroken || navLogoBroken || errors.length) {
    failed = true
  }

  console.log(JSON.stringify({ width: viewport.width, ...report, navChecks, wrongActive, navLogo, detail, afterClose, detailBroken, errors }, null, 1))
  await page.close()
}

await browser.close()
console.log(failed ? "ADA MASALAH" : "SEMUA CEK LULUS")
process.exit(failed ? 1 : 0)
