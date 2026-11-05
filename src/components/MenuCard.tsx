import type { MenuItem } from "@/data/menu"
import { formatPrice } from "@/lib/menu"
import { MenuImage } from "@/components/MenuImage"

type Props = {
  item: MenuItem
  index: number
  eager?: boolean
}

export function MenuCard({ item, index, eager }: Props) {
  const soldOut = item.available === false

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[var(--radius-sticker)] border-[2.5px] border-ink ${
        soldOut ? "bg-cream" : "bg-paper shadow-[var(--shadow-sticker)]"
      }`}
    >
      <div className={soldOut ? "opacity-55 grayscale" : undefined}>
        <MenuImage item={item} eager={eager} tilt={index % 2 === 0 ? "left" : "right"} />
      </div>
      <div className="flex flex-1 flex-col gap-1 px-3 pt-2.5 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
        <h3 className="font-display text-[1.2rem] leading-[1.05] tracking-wide text-balance sm:text-[1.35rem]">
          {item.name}
        </h3>
        {item.description ? <p className="text-sm leading-snug">{item.description}</p> : null}
        <p className="mt-auto pt-1 text-[0.95rem] font-bold tabular-nums">{formatPrice(item.price)}</p>
      </div>
      {soldOut ? (
        <p className="absolute top-2.5 right-2.5 rotate-6 rounded-lg border-[2.5px] border-ink bg-orange px-2.5 py-0.5 font-display text-base tracking-wide shadow-[var(--shadow-sticker)]">
          Habis
        </p>
      ) : null}
    </article>
  )
}
