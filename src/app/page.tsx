import { menu } from "@/data/menu"
import { formatPrice, groupByPrice } from "@/lib/menu"
import { CategoryNav } from "@/components/CategoryNav"
import { Hero } from "@/components/Hero"
import { MenuSection } from "@/components/MenuSection"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"

const ABOVE_FOLD_CARDS = 4

export default function Home() {
  const tiers = groupByPrice(menu)
  const categories = tiers.map((tier) => ({
    id: tier.id,
    label: formatPrice(tier.price),
    count: tier.items.length,
  }))

  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <CategoryNav categories={categories} menuId="menu" />
        <div id="menu" className="page-gutter mx-auto w-full max-w-[1100px]">
          {tiers.map((tier, index) => (
            <MenuSection
              key={tier.id}
              tier={tier}
              variant={index % 2 === 0 ? "orange" : "ink"}
              eagerCount={index === 0 ? ABOVE_FOLD_CARDS : 0}
            />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
