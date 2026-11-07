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
// Real scrollbars, so a page that jumps sideways when the dialog locks scrolling is caught.
const browser = await chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] })
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

  // Scroll-linked entrances start at opacity 0, so prove every item and sticker ends fully visible in view.
  const hiddenInView = []
  const revealed = await page.locator(".scroll-reveal, .sticker-slap").all()
  for (const element of revealed) {
    await element.evaluate((el) => el.scrollIntoView({ block: "center" }))
    await page.waitForTimeout(60)
    const opacity = await element.evaluate((el) => Number(getComputedStyle(el).opacity))
    if (opacity < 0.98) hiddenInView.push(`${(await element.innerText()).split("\n")[0]} (${opacity.toFixed(2)})`)
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  await page.screenshot({ path: path.join(outDir, `${name}-footer.png`) })

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
    // Sample every frame after the tap to catch a section that lingers on screen before hiding.
    await page.evaluate(() => {
      window.__shown = []
      let frames = 0
      const sample = () => {
        window.__shown.push(
          [...document.querySelectorAll("#menu > section")].filter((s) => getComputedStyle(s).display !== "none").length,
        )
        if (++frames < 45) requestAnimationFrame(sample)
      }
      requestAnimationFrame(sample)
    })
    await page.getByRole("link", { name: label, exact: true }).click()
    await page.waitForTimeout(1500)
    navChecks.push(
      await page.evaluate((chip) => {
        const nav = document.querySelector("nav")?.getBoundingClientRect()
        const visible = [...document.querySelectorAll("#menu > section")].filter((s) => !s.hidden)
        const heading = visible[0]?.querySelector("h2")?.getBoundingClientRect()
        const afterTap = window.__shown.slice(window.__shown.findIndex((count) => count !== window.__shown[0]) + 1)
        return {
          chip,
          maxShownAfterTap: chip === "Semua" ? null : Math.max(...(afterTap.length ? afterTap : window.__shown.slice(-5))),
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
  const menuLeftBefore = await page.evaluate(() => document.getElementById("menu")?.getBoundingClientRect().left)
  await page.getByRole("button", { name: /Katsu Ori/ }).click()
  await page.waitForTimeout(500)
  const detail = await page.evaluate((leftBefore) => {
    const dialog = document.querySelector("dialog")
    const box = dialog?.getBoundingClientRect()
    return {
      pageShift: Math.round((document.getElementById("menu")?.getBoundingClientRect().left ?? 0) - (leftBefore ?? 0)),
      open: dialog?.open ?? false,
      title: dialog?.querySelector("h2")?.textContent,
      rows: [...(dialog?.querySelectorAll("dt") ?? [])].map((dt) => `${dt.textContent}: ${dt.nextElementSibling?.textContent}`),
      focused: document.activeElement?.textContent,
      fitsWidth: box ? box.left >= 0 && box.right <= window.innerWidth : false,
      fitsHeight: box ? box.top >= 0 && box.bottom <= window.innerHeight + 1 : false,
      pageScrollLocked: getComputedStyle(document.documentElement).overflow === "hidden",
    }
  }, menuLeftBefore)
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
    detail.pageShift !== 0 ||
    afterClose.open ||
    !afterClose.focusBack?.startsWith("Katsu Ori")

  const filterGlitch = navChecks.filter((check) => check.maxShownAfterTap !== null && check.maxShownAfterTap > 1)

  // Detail sheet browsing: keyboard arrows, the next/previous buttons, a sideways swipe, and drag down to close.
  const title = () => page.evaluate(() => document.querySelector("dialog h2")?.textContent ?? null)
  const touch = (points) =>
    page.evaluate((path) => {
      const dialog = document.querySelector("dialog")
      const make = (x, y) => new Touch({ identifier: 1, target: dialog, clientX: x, clientY: y })
      const fire = (type, x, y) =>
        dialog.dispatchEvent(
          new TouchEvent(type, {
            bubbles: true,
            cancelable: true,
            touches: type === "touchend" ? [] : [make(x, y)],
            changedTouches: [make(x, y)],
          }),
        )
      fire("touchstart", path[0][0], path[0][1])
      for (const [x, y] of path.slice(1)) fire("touchmove", x, y)
      const last = path[path.length - 1]
      fire("touchend", last[0], last[1])
    }, points)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.getByRole("button", { name: /Katsu Ori/ }).click()
  await page.waitForTimeout(400)
  const browse = { opened: await title() }
  await page.keyboard.press("ArrowRight")
  await page.waitForTimeout(350)
  browse.afterArrow = await title()
  await page.getByRole("button", { name: /Berikutnya/ }).click()
  await page.waitForTimeout(350)
  browse.afterNext = await title()
  await page.getByRole("button", { name: /Sebelumnya/ }).click()
  await page.waitForTimeout(350)
  browse.afterPrevious = await title()
  await touch([[300, 400], [260, 402], [200, 404], [150, 405]])
  await page.waitForTimeout(450)
  browse.afterSwipe = await title()
  await page.evaluate(() => document.querySelector("dialog")?.scrollTo({ top: 0 }))
  await touch([[200, 300], [202, 340], [203, 420], [204, 480]])
  await page.waitForTimeout(450)
  browse.closedByDrag = !(await page.evaluate(() => document.querySelector("dialog")?.open))
  const browseBroken =
    browse.opened !== "Katsu Ori" ||
    browse.afterArrow !== "BBQ" ||
    browse.afterNext !== "Teriyaki" ||
    browse.afterPrevious !== "BBQ" ||
    browse.afterSwipe !== "Teriyaki" ||
    !browse.closedByDrag

  // Sticky price sticker: while reading the first tier it sits under the bar, shrunk.
  const firstTier = page.locator("#menu > section").first()
  await firstTier.evaluate((section) => window.scrollTo(0, section.getBoundingClientRect().top + window.scrollY + 260))
  await page.waitForTimeout(400)
  const sticky = await page.evaluate(() => {
    const nav = document.querySelector("nav")?.getBoundingClientRect()
    const holder = document.querySelector("#menu .tier-sticky")?.getBoundingClientRect()
    const scale = getComputedStyle(document.querySelector("#menu .tier-shrink")).scale
    return { navBottom: Math.round(nav?.bottom ?? 0), stickerTop: Math.round(holder?.top ?? 0), scale }
  })
  await page.screenshot({ path: path.join(outDir, `${name}-sticky.png`) })
  const stickyBroken =
    Math.abs(sticky.stickerTop - sticky.navBottom - 8) > 4 || sticky.scale !== (viewport.width >= 640 ? "0.6" : "0.5")

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  const progress = await page.evaluate(() => {
    const bar = document.querySelector(".scroll-progress")
    const nav = document.querySelector("nav")
    return bar && nav ? Math.round((bar.getBoundingClientRect().width / nav.getBoundingClientRect().width) * 100) : 0
  })
  const progressBroken = progress < 98

  // The ticker must stay wider than the screen at every point of its loop, and the footer logo must be whole.
  const extras = await page.evaluate(() => {
    const track = document.querySelector(".ticker-track")
    const half = track?.firstElementChild?.getBoundingClientRect().width ?? 0
    const logo = document.querySelector('footer img[alt^="Logo"]')
    const box = logo?.getBoundingClientRect()
    const natural = logo ? logo.naturalWidth / logo.naturalHeight : 0
    return {
      tickerHalfWidth: Math.round(half),
      tickerCoversScreen: half >= window.innerWidth,
      footerLogoRatioOk: box ? Math.abs(box.width / box.height - natural) < 0.02 : false,
      footerLogoInside: box ? box.left >= 0 && box.right <= window.innerWidth : false,
    }
  })
  const extrasBroken = !extras.tickerCoversScreen || !extras.footerLogoRatioOk || !extras.footerLogoInside

  const coveredHeadings = navChecks.filter((check) => check.headingTop < check.navBottom)
  const wrongActive = navChecks.filter(
    (check) =>
      check.current !== check.chip ||
      (check.chip === "Semua" ? check.visibleSections.length < 2 : check.visibleSections.length !== 1 || !check.visibleSections[0]?.includes(check.chip)),
  )
  if (report.horizontalOverflow > 0 || report.smallTargets.length || report.clipped.length || coveredHeadings.length || wrongActive.length || detailBroken || navLogoBroken || hiddenInView.length || filterGlitch.length || extrasBroken || browseBroken || stickyBroken || progressBroken || errors.length) {
    failed = true
  }

  console.log(JSON.stringify({ width: viewport.width, ...report, navChecks, wrongActive, filterGlitch, extras, browse, sticky, progress, navLogo, hiddenInView, detail, afterClose, detailBroken, errors }, null, 1))
  await page.close()
}

await browser.close()
console.log(failed ? "ADA MASALAH" : "SEMUA CEK LULUS")
process.exit(failed ? 1 : 0)
