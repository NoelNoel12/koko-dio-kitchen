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

export function MenuDetailProvider({ items, details, children }: ProviderProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const item = items.find((entry) => entry.id === selectedId)
  const tone = groupByPrice(items).find((tier) => tier.price === item?.price)?.tone ?? "orange"

  useEffect(() => {
    const dialog = dialogRef.current
    if (item && dialog && !dialog.open) dialog.showModal()
  }, [item])

  return (
    <OpenDetail.Provider value={setSelectedId}>
      {children}
      <dialog
        ref={dialogRef}
        aria-labelledby="detail-judul"
        onClose={() => setSelectedId(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close()
        }}
        className="menu-sheet"
      >
        {item ? (
          <DetailContent item={item} tone={tone} detail={details[item.id] ?? {}} onClose={() => dialogRef.current?.close()} />
        ) : null}
      </dialog>
    </OpenDetail.Provider>
  )
}

type ContentProps = {
  item: MenuItem
  tone: TierTone
  detail: MenuDetail
  onClose: () => void
}

function DetailContent({ item, tone, detail, onClose }: ContentProps) {
  const soldOut = item.available === false
  const incomplete = detailFields.some(({ key }) => !detail[key]?.trim())

  return (
    <>
      <div className="relative">
        <MenuImage item={item} variant="sheet" eager tilt="left" />
        <button
          type="button"
          onClick={onClose}
          className="sticker press absolute top-3 right-3 inline-flex min-h-11 items-center bg-paper px-4 font-bold hover:bg-peach"
        >
          Tutup
        </button>
      </div>
      <div className="px-5 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
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
