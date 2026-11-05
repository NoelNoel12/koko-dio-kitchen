import type { MenuItem } from "@/data/menu"

export type PriceTier = {
  id: string
  price: number
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
    .map(([price, tierItems]) => ({ id: `harga-${price}`, price, items: tierItems }))
}
