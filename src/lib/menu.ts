import type { MenuItem } from "@/data/menu"

export type TierTone = "orange" | "ink"

export type PriceTier = {
  id: string
  price: number
  tone: TierTone
  items: MenuItem[]
}

const thousands = new Intl.NumberFormat("id-ID")

export function formatPrice(price: number) {
  return `Rp${thousands.format(price)}`
}

export function groupByPrice(items: MenuItem[]): PriceTier[] {
  const tiers = new Map<number, MenuItem[]>()
  for (const item of items) {
    tiers.set(item.price, [...(tiers.get(item.price) ?? []), item])
  }
  return [...tiers.entries()]
    .sort(([a], [b]) => a - b)
    .map(([price, tierItems], index) => ({
      id: `harga-${price}`,
      price,
      tone: index % 2 === 0 ? "orange" : "ink",
      items: tierItems,
    }))
}

// Price chips and tags share these so a tier reads the same everywhere on the page.
export const toneClasses: Record<TierTone, string> = {
  orange: "bg-orange text-ink",
  ink: "bg-ink text-orange",
}
