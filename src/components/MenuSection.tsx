import type { PriceTier } from "@/lib/menu"
import { formatPrice, toneClasses } from "@/lib/menu"
import { MenuCard } from "@/components/MenuCard"
import { MenuRow } from "@/components/MenuRow"

export type MenuLayout = "list" | "grid"

type Props = {
  tier: PriceTier
  layout: MenuLayout
  eagerCount: number
}

const tagStyles = {
  orange: { tilt: "-rotate-2", small: "text-ink" },
  ink: { tilt: "rotate-[1.5deg]", small: "text-paper" },
}

// Di layar lebar pilih 3 atau 4 kolom, mana yang menyisakan slot kosong paling sedikit di baris terakhir.
function desktopColumns(count: number) {
  const gaps = (columns: number) => (columns - (count % columns)) % columns
  return gaps(3) < gaps(4) ? "lg:grid-cols-3" : "lg:grid-cols-4"
}

export function MenuSection({ tier, layout, eagerCount }: Props) {
  const style = tagStyles[tier.tone]
  const headingId = `${tier.id}-judul`
  const listClasses =
    layout === "list"
      ? "grid gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5"
      : `grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:gap-6 ${desktopColumns(tier.items.length)}`

  return (
    <section id={tier.id} aria-labelledby={headingId} className="menu-section pt-8 pb-6 sm:pt-10 sm:pb-10">
      {/* Three layers: the sticky container, a layer that shrinks once stuck, and the sticker with its entrance. */}
      <div className="tier-sticky mb-6 w-fit sm:mb-8">
        <div className="tier-shrink">
          <div
            style={{ viewTransitionName: `tag-${tier.id}` }}
            className={`sticker-slap inline-flex flex-col rounded-[var(--radius-sticker)] border-[2.5px] border-ink px-4 pt-2 pb-2.5 shadow-[var(--shadow-sticker-lg)] sm:px-6 sm:pt-3 sm:pb-3 ${toneClasses[tier.tone]} ${style.tilt}`}
          >
            <h2 id={headingId} className="flex flex-col">
              <span className={`text-sm font-bold sm:text-base ${style.small}`}>Rice box</span>
              <span className="font-display text-[clamp(2.4rem,11vw,3.75rem)] leading-[0.9] tracking-[-0.01em] tabular-nums">
                {formatPrice(tier.price)}
              </span>
            </h2>
            <p className={`mt-1 text-sm font-bold sm:text-base ${style.small}`}>{tier.items.length} rasa</p>
          </div>
        </div>
      </div>
      <ul className={listClasses}>
        {tier.items.map((item, index) => (
          <li
            key={item.id}
            style={{ viewTransitionName: `menu-${item.id}`, viewTransitionClass: "menu-item" } as React.CSSProperties}
            className="scroll-reveal"
          >
            {layout === "list" ? (
              <MenuRow item={item} tone={tier.tone} index={index} />
            ) : (
              <MenuCard item={item} tone={tier.tone} index={index} eager={index < eagerCount} />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
