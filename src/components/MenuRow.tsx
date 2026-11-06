import type { MenuItem } from "@/data/menu"
import { formatPrice, toneClasses, type TierTone } from "@/lib/menu"
import { MenuDetailTrigger } from "@/components/MenuDetail"

type Props = {
  item: MenuItem
  tone: TierTone
}

// Compact row used while no menu photos exist, so the whole menu fits in about a screen and a half.
export function MenuRow({ item, tone }: Props) {
  const soldOut = item.available === false

  return (
    <article
      className={`card-tap relative flex min-h-[4.5rem] items-center gap-3 rounded-[var(--radius-sticker)] border-[2.5px] border-ink px-4 py-3 ${
        soldOut ? "bg-cream" : "bg-paper shadow-[var(--shadow-sticker)]"
      }`}
    >
      <div className="min-w-0 flex-1">
        <h3
          className={`font-display text-[1.3rem] leading-[1.05] tracking-wide text-balance ${
            soldOut ? "line-through decoration-[3px]" : ""
          }`}
        >
          <MenuDetailTrigger id={item.id} name={item.name} />
        </h3>
        {item.description ? <p className="mt-0.5 text-sm leading-snug">{item.description}</p> : null}
        <span aria-hidden="true" className="mt-1 inline-block text-[0.8rem] font-semibold underline decoration-2 underline-offset-2">
          Lihat isi
        </span>
      </div>
      <p
        className={`shrink-0 rounded-md border-2 border-ink px-2 py-0.5 font-display text-[1.05rem] leading-snug tracking-wide tabular-nums ${toneClasses[tone]}`}
      >
        {formatPrice(item.price)}
      </p>
      {soldOut ? (
        <p className="sticker-slap pointer-events-none absolute -top-3 right-24 rotate-6 rounded-lg border-[2.5px] border-ink bg-orange px-2.5 py-0.5 font-display text-base tracking-wide shadow-[var(--shadow-sticker)]">
          Habis
        </p>
      ) : null}
    </article>
  )
}
