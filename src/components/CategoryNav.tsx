"use client"

import { useEffect, useState } from "react"
import { flushSync } from "react-dom"

type Category = {
  id: string
  label: string
  count: number
}

type Props = {
  categories: Category[]
  menuId: string
  heroLogoId: string
}

const ALL = "semua"

// Tanpa JavaScript, chip tetap berfungsi sebagai link ke section. Dengan JavaScript, chip menjadi filter.
export function CategoryNav({ categories, menuId, heroLogoId }: Props) {
  const [active, setActive] = useState(ALL)
  const [status, setStatus] = useState("")
  const [showLogo, setShowLogo] = useState(false)

  useEffect(() => {
    const heroLogo = document.getElementById(heroLogoId)
    if (!heroLogo) return
    const observer = new IntersectionObserver(([entry]) => setShowLogo(!entry?.isIntersecting))
    observer.observe(heroLogo)
    return () => observer.disconnect()
  }, [heroLogoId])

  const total = categories.reduce((sum, category) => sum + category.count, 0)
  const items = [{ id: ALL, label: "Semua", count: total }, ...categories]

  function select(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const menu = document.getElementById(menuId)
    if (!menu) return
    event.preventDefault()
    const navBottom = event.currentTarget.closest("nav")?.getBoundingClientRect().bottom ?? 0
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // flushSync keeps the DOM change inside the view transition callback, so old and new states are captured.
    const apply = () => {
      for (const section of menu.querySelectorAll<HTMLElement>(":scope > section")) {
        section.hidden = id !== ALL && section.id !== id
      }
      flushSync(() => setActive(id))
    }

    const scrollToMenu = () => {
      if (menu.getBoundingClientRect().top < navBottom - 1 || id !== ALL) {
        menu.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
      }
    }

    if (document.startViewTransition && !reduceMotion) {
      // Scroll after the morph so the page does not move under the transition snapshot.
      document.startViewTransition(apply).finished.then(scrollToMenu, scrollToMenu)
    } else {
      apply()
      scrollToMenu()
    }

    const picked = items.find((item) => item.id === id)
    setStatus(
      id === ALL ? `Menampilkan semua ${total} rasa` : `Menampilkan ${picked?.count} rasa ${picked?.label}`,
    )
  }

  return (
    <nav
      aria-label="Kategori menu"
      className="sticky top-0 z-20 border-y-[2.5px] border-ink bg-cream pt-[env(safe-area-inset-top)]"
    >
      <div className="page-gutter mx-auto flex h-[var(--nav-height)] w-full max-w-[1100px] items-center gap-2.5 sm:gap-3">
        <a href="#top" data-shown={showLogo} className="nav-logo flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
          {/* Pre-sized 1x/2x files from scripts/prepare-assets.mjs, so the image optimizer adds nothing here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-header.webp"
            srcSet="/brand/logo-header.webp 82w, /brand/logo-header@2x.webp 163w"
            sizes="31px"
            width={31}
            height={46}
            alt="Koko Dio Kitchen, kembali ke atas"
            className="h-[46px] w-auto max-w-none"
          />
        </a>
        <ul className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {items.map((item) => {
            const isActive = item.id === active
            return (
              <li key={item.id} className="min-w-0 flex-1 sm:flex-none">
                <a
                  href={`#${item.id === ALL ? menuId : item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  onClick={(event) => select(event, item.id)}
                  className={`chip press group relative isolate flex min-h-11 w-full items-center justify-center rounded-[var(--radius-chip)] border-[2.5px] border-ink bg-paper px-1.5 font-display text-[clamp(0.95rem,4.3vw,1.05rem)] leading-none tracking-wide whitespace-nowrap shadow-[var(--shadow-sticker)] sm:px-5 sm:text-lg ${
                    isActive ? "" : "hover:bg-peach"
                  }`}
                >
                  {/* One orange block that moves between chips during the view transition. */}
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      style={{ viewTransitionName: "chip-active" }}
                      className="absolute inset-0 -z-10 rounded-[calc(var(--radius-chip)-2.5px)] bg-orange group-hover:bg-orange-deep"
                    />
                  ) : null}
                  {/* Its own transition layer keeps the label painted above the moving orange block. */}
                  <span style={{ viewTransitionName: `chip-label-${item.id}` }}>{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
      <div aria-hidden="true" className="scroll-progress absolute inset-x-0 bottom-0 h-[5px] bg-orange" />
      <p role="status" className="sr-only">
        {status}
      </p>
    </nav>
  )
}
