"use client"

import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { MenuItem } from "@/data/menu"
import { detailFields, type MenuDetail } from "@/data/menu-detail"
import { formatPrice, groupByPrice, toneClasses, type TierTone } from "@/lib/menu"
import { MenuImage } from "@/components/MenuImage"

const OpenDetail = createContext<(id: string) => void>(() => {})

type ProviderProps = {
  items: MenuItem[]
  details: Record<string, MenuDetail>
  children: React.ReactNode
}

type Direction = "next" | "prev" | null

const CLOSE_DISTANCE = 110
const SWIPE_DISTANCE = 70

export function MenuDetailProvider({ items, details, children }: ProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const actionsRef = useRef<{ step: (delta: number) => void; closeAnimated: () => void }>({
    step: () => {},
    closeAnimated: () => {},
  })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [sequence, setSequence] = useState<string[]>([])
  const [direction, setDirection] = useState<Direction>(null)

  const tiers = groupByPrice(items)
  const item = items.find((entry) => entry.id === selectedId)
  const tone = tiers.find((tier) => tier.price === item?.price)?.tone ?? "orange"
  const position = selectedId ? sequence.indexOf(selectedId) : -1
  const neighbor = (delta: number) => {
    if (position < 0 || sequence.length < 2) return undefined
    const id = sequence[(position + delta + sequence.length) % sequence.length]
    return items.find((entry) => entry.id === id)
  }

  // Browsing follows what is on screen: the display order, minus any tier hidden by the price filter.
  function open(id: string) {
    const visible = tiers
      .filter((tier) => !document.getElementById(tier.id)?.hidden)
      .flatMap((tier) => tier.items.map((entry) => entry.id))
    setSequence(visible)
    setDirection(null)
    setSelectedId(id)
  }

  function step(delta: number) {
    const target = neighbor(delta)
    if (!target) return
    setDirection(delta > 0 ? "next" : "prev")
    setSelectedId(target.id)
    dialogRef.current?.scrollTo({ top: 0 })
  }

  function closeAnimated() {
    const dialog = dialogRef.current
    if (!dialog) return
    dialog.style.transition = "translate 180ms ease-in"
    dialog.style.translate = "0 100%"
    window.setTimeout(() => {
      dialog.close()
      dialog.style.transition = ""
      dialog.style.translate = ""
    }, 180)
  }

  useEffect(() => {
    actionsRef.current = { step, closeAnimated }
  })

  useEffect(() => {
    const dialog = dialogRef.current
    if (item && dialog && !dialog.open) dialog.showModal()
  }, [item])

  // Touch gestures: drag down from the top of the sheet to close, swipe sideways to browse.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    let startX = 0
    let startY = 0
    let dx = 0
    let dy = 0
    let mode: "close" | "swipe" | "scroll" | null = null

    const onStart = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      startX = touch.clientX
      startY = touch.clientY
      dx = 0
      dy = 0
      mode = null
    }

    const onMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (!touch) return
      dx = touch.clientX - startX
      dy = touch.clientY - startY
      if (!mode) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        if (Math.abs(dx) > Math.abs(dy)) mode = "swipe"
        else mode = dy > 0 && dialog.scrollTop <= 0 ? "close" : "scroll"
      }
      if (mode === "close") {
        event.preventDefault()
        dialog.style.transition = "none"
        dialog.style.translate = `0 ${Math.max(0, dy)}px`
      } else if (mode === "swipe" && contentRef.current) {
        event.preventDefault()
        contentRef.current.style.transition = "none"
        contentRef.current.style.translate = `${dx * 0.45}px 0`
      }
    }

    const onEnd = () => {
      const content = contentRef.current
      if (mode === "close") {
        if (dy > CLOSE_DISTANCE) {
          actionsRef.current.closeAnimated()
        } else {
          dialog.style.transition = "translate 200ms ease-out"
          dialog.style.translate = ""
        }
      } else if (mode === "swipe" && content) {
        content.style.transition = "translate 200ms ease-out"
        content.style.translate = ""
        if (dx < -SWIPE_DISTANCE) actionsRef.current.step(1)
        else if (dx > SWIPE_DISTANCE) actionsRef.current.step(-1)
      }
      mode = null
    }

    dialog.addEventListener("touchstart", onStart, { passive: true })
    dialog.addEventListener("touchmove", onMove, { passive: false })
    dialog.addEventListener("touchend", onEnd)
    dialog.addEventListener("touchcancel", onEnd)
    return () => {
      dialog.removeEventListener("touchstart", onStart)
      dialog.removeEventListener("touchmove", onMove)
      dialog.removeEventListener("touchend", onEnd)
      dialog.removeEventListener("touchcancel", onEnd)
    }
  }, [])

  const previous = neighbor(-1)
  const next = neighbor(1)

  return (
    <OpenDetail.Provider value={open}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="detail-judul"
        onClose={() => setSelectedId(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1)
          if (event.key === "ArrowLeft") step(-1)
        }}
        className="menu-sheet"
      >
        {item ? (
          <>
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute top-2 left-1/2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-ink sm:hidden"
              />
              <div
                key={item.id}
                ref={contentRef}
                className={direction === "next" ? "sheet-enter-next" : direction === "prev" ? "sheet-enter-prev" : ""}
              >
                <DetailContent item={item} tone={tone} detail={details[item.id] ?? {}} />
              </div>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="sticker press absolute top-3 right-3 z-10 inline-flex min-h-11 items-center bg-paper px-4 font-bold hover:bg-peach"
              >
                Tutup
              </button>
            </div>
            {previous && next ? (
              <div className="grid grid-cols-2 gap-3 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="sticker press flex min-h-12 flex-col items-start justify-center bg-cream px-3 py-1.5 text-left hover:bg-peach"
                >
                  <span className="text-xs font-semibold">‹ Sebelumnya</span>
                  <span className="font-display text-base leading-tight tracking-wide">{previous.name}</span>
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="sticker press flex min-h-12 flex-col items-end justify-center bg-cream px-3 py-1.5 text-right hover:bg-peach"
                >
                  <span className="text-xs font-semibold">Berikutnya ›</span>
                  <span className="font-display text-base leading-tight tracking-wide">{next.name}</span>
                </button>
              </div>
            ) : null}
            <p aria-live="polite" className="sr-only">
              {direction ? `Menampilkan ${item.name}` : ""}
            </p>
          </>
        ) : null}
      </dialog>
    </OpenDetail.Provider>
  )
}

type ContentProps = {
  item: MenuItem
  tone: TierTone
  detail: MenuDetail
}

function DetailContent({ item, tone, detail }: ContentProps) {
  const soldOut = item.available === false
  const incomplete = detailFields.some(({ key }) => !detail[key]?.trim())

  return (
    <>
      <MenuImage item={item} variant="sheet" eager tilt="left" />
      <div className="px-5 pt-4 pb-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 id="detail-judul" className="font-display text-[1.9rem] leading-none tracking-wide">
            {item.name}
          </h2>
          {soldOut ? (
            <span className="rotate-3 rounded-lg border-[2.5px] border-ink bg-orange px-2.5 py-0.5 font-display text-base tracking-wide">
              Habis
            </span>
          ) : null}
        </div>
        <p className="mt-2 flex items-center gap-2 text-base font-bold">
          Rice box
          <span
            className={`rounded-md border-2 border-ink px-2 py-px font-display text-lg leading-snug tracking-wide tabular-nums ${toneClasses[tone]}`}
          >
            {formatPrice(item.price)}
          </span>
        </p>
        {item.description ? <p className="mt-2 leading-snug">{item.description}</p> : null}

        <h3 className="mt-5 font-display text-xl tracking-wide">Isi rice box</h3>
        <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5">
          {detailFields.map(({ key, label }, index) => {
            const value = detail[key]?.trim()
            return (
              <div
                key={key}
                style={{ "--i": index } as React.CSSProperties}
                className="detail-row col-span-2 grid grid-cols-subgrid items-baseline"
              >
                <dt className="font-bold">{label}</dt>
                <dd>
                  {value ? (
                    value
                  ) : (
                    <span className="inline-block rounded-md border-2 border-dashed border-ink bg-peach px-2 text-sm font-semibold">
                      Menyusul
                    </span>
                  )}
                </dd>
              </div>
            )
          })}
        </dl>
        {incomplete ? <p className="mt-4 text-sm">Detail isi sedang dilengkapi.</p> : null}
      </div>
    </>
  )
}

export function MenuDetailTrigger({ id, name }: { id: string; name: string }) {
  const open = useContext(OpenDetail)

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      onClick={() => open(id)}
      className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
    >
      {name}
      <span className="sr-only">, lihat isi</span>
    </button>
  )
}
