"use client"

import { useState } from "react"

type Category = {
  id: string
  label: string
  count: number
}

type Props = {
  categories: Category[]
  menuId: string
}

const ALL = "semua"

// Tanpa JavaScript, chip tetap berfungsi sebagai link ke section. Dengan JavaScript, chip menjadi filter.
export function CategoryNav({ categories, menuId }: Props) {
  const [active, setActive] = useState(ALL)
  const [status, setStatus] = useState("")

  const total = categories.reduce((sum, category) => sum + category.count, 0)
  const items = [{ id: ALL, label: "Semua", count: total }, ...categories]

  function select(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const menu = document.getElementById(menuId)
    if (!menu) return
    event.preventDefault()

    for (const section of menu.querySelectorAll<HTMLElement>(":scope > section")) {
      section.hidden = id !== ALL && section.id !== id
    }
    setActive(id)

    const picked = items.find((item) => item.id === id)
    setStatus(
      id === ALL ? `Menampilkan semua ${total} rasa` : `Menampilkan ${picked?.count} rasa ${picked?.label}`,
    )

    if (menu.getBoundingClientRect().top < 0 || id !== ALL) {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      menu.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" })
    }
  }

  return (
    <nav
      aria-label="Kategori menu"
      className="sticky top-0 z-20 border-y-[2.5px] border-ink bg-cream pt-[env(safe-area-inset-top)]"
    >
      <ul className="page-gutter mx-auto flex h-[var(--nav-height)] w-full max-w-[1100px] items-center gap-2.5 sm:gap-3">
        {items.map((item) => {
          const isActive = item.id === active
          return (
            <li key={item.id} className="min-w-0 flex-1 sm:flex-none">
              <a
                href={`#${item.id === ALL ? menuId : item.id}`}
                aria-current={isActive ? "true" : undefined}
                onClick={(event) => select(event, item.id)}
                className={`press flex min-h-11 w-full items-center justify-center rounded-[var(--radius-chip)] border-[2.5px] border-ink px-2 font-display text-[1.05rem] leading-none tracking-wide whitespace-nowrap shadow-[var(--shadow-sticker)] sm:px-5 sm:text-lg ${
                  isActive ? "bg-orange hover:bg-orange-deep" : "bg-paper hover:bg-peach"
                }`}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
      <p role="status" className="sr-only">
        {status}
      </p>
    </nav>
  )
}
