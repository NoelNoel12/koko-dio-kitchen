import type { MenuItem } from "@/data/menu"
import { formatPrice, toneClasses, type TierTone } from "@/lib/menu"
import { MenuDetailTrigger } from "@/components/MenuDetail"
import { MenuImage } from "@/components/MenuImage"

type Props = {
  item: MenuItem
  tone: TierTone
  index: number
}

// Compact row with a thumbnail, used while no menu photos exist so the whole menu stays short to scroll.
export function MenuRow({ item, tone, index }: Props) {
  const soldOut = item.available === false

  return (
    <article
      className={`card-tap relative flex min-h-[5.75rem] overflow-hidden rounded-[var(--radius-sticker)] border-[2.5px] border-ink sm:min-h-[6.9rem] ${
        soldOut ? "bg-cream" : "bg-paper shadow-[var(--shadow-sticker)]"
      }`}
    >
      <div className={`w-[7.5rem] shrink-0 sm:w-36 ${soldOut ? "opacity-55 grayscale" : ""}`}>
        <MenuImage item={item} variant="thumb" tilt={index % 2 === 0 ? "left" : "right"} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-3 py-2.5 sm:px-4">
        <h3
          className={`font-display text-[1.25rem] leading-[1.05] tracking-wide text-balance sm:text-[1.35rem] ${
            soldOut ? "line-through decoration-[3px]" : ""
          }`}
        >
          <MenuDetailTrigger id={item.id} name={item.name} />
        </h3>
        {item.description ? <p className="text-sm leading-snug">{item.description}</p> : null}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span aria-hidden="true" className="order-2 text-[0.8rem] font-semibold underline decoration-2 underline-offset-2">
            Lihat isi
          </span>
          <p
            className={`order-1 rounded-md border-2 border-ink px-1.5 py-px font-display text-[0.95rem] leading-snug tracking-wide tabular-nums ${toneClasses[tone]}`}
          >
            {formatPrice(item.price)}
          </p>
        </div>
      </div>
      {soldOut ? (
        <p className="sticker-slap pointer-events-none absolute top-2 left-2 -rotate-6 rounded-lg border-[2.5px] border-ink bg-orange px-2 py-0.5 font-display text-sm tracking-wide shadow-[var(--shadow-sticker)]">
          Habis
        </p>
      ) : null}
    </article>
  )
}
