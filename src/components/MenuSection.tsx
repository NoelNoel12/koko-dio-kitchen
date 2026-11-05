import type { PriceTier } from "@/lib/menu"
import { formatPrice } from "@/lib/menu"
import { MenuCard } from "@/components/MenuCard"

type Props = {
  tier: PriceTier
  variant: "orange" | "ink"
  eagerCount: number
}

const tagStyles = {
  orange: { tag: "bg-orange text-ink -rotate-2", kicker: "text-ink" },
  ink: { tag: "bg-ink text-orange rotate-[1.5deg]", kicker: "text-paper" },
}

// Di layar lebar pilih 3 atau 4 kolom, mana yang menyisakan slot kosong paling sedikit di baris terakhir.
function desktopColumns(count: number) {
  const gaps = (columns: number) => (columns - (count % columns)) % columns
  return gaps(3) < gaps(4) ? "lg:grid-cols-3" : "lg:grid-cols-4"
}

export function MenuSection({ tier, variant, eagerCount }: Props) {
  const style = tagStyles[variant]
  const headingId = `${tier.id}-judul`

  return (
    <section id={tier.id} aria-labelledby={headingId} className="pt-8 pb-6 sm:pt-10 sm:pb-10">
      <div className="mb-6 flex items-end gap-4 sm:mb-8">
        <h2
          id={headingId}
          className={`inline-flex flex-col rounded-[var(--radius-sticker)] border-[2.5px] border-ink px-4 pt-2 pb-2.5 shadow-[var(--shadow-sticker-lg)] sm:px-6 sm:pt-3 sm:pb-3.5 ${style.tag}`}
        >
          <span className={`text-sm font-bold sm:text-base ${style.kicker}`}>Rice box</span>
          <span className="font-display text-[clamp(2.4rem,11vw,3.75rem)] leading-[0.9] tracking-[-0.01em] tabular-nums">
            {formatPrice(tier.price)}
          </span>
        </h2>
        <p className="pb-1 text-base font-semibold sm:text-lg">{tier.items.length} rasa</p>
      </div>
      <ul className={`grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:gap-6 ${desktopColumns(tier.items.length)}`}>
        {tier.items.map((item, index) => (
          <li key={item.id}>
            <MenuCard item={item} index={index} eager={index < eagerCount} />
          </li>
        ))}
      </ul>
    </section>
  )
}
