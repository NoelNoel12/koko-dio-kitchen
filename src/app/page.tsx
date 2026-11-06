import { menu } from "@/data/menu"
import { menuDetail } from "@/data/menu-detail"
import { formatPrice, groupByPrice } from "@/lib/menu"
import { CategoryNav } from "@/components/CategoryNav"
import { FlavorTicker } from "@/components/FlavorTicker"
import { Hero, HERO_LOGO_ID } from "@/components/Hero"
import { MenuDetailProvider } from "@/components/MenuDetail"
import { MenuSection, type MenuLayout } from "@/components/MenuSection"
import { SiteFooter } from "@/components/SiteFooter"

const ABOVE_FOLD_CARDS = 4

export default function Home() {
  const tiers = groupByPrice(menu)
  const categories = tiers.map((tier) => ({
    id: tier.id,
    label: formatPrice(tier.price),
    count: tier.items.length,
  }))
  // Photo cards only pay off once real photos exist; until then a compact list is faster to scan.
  const layout: MenuLayout = menu.some((item) => item.image) ? "grid" : "list"

  return (
    <>
      <Hero />
      <main>
        <FlavorTicker names={menu.map((item) => item.name)} />
        <CategoryNav categories={categories} menuId="menu" heroLogoId={HERO_LOGO_ID} />
        <MenuDetailProvider items={menu} details={menuDetail}>
          <div id="menu" className="page-gutter mx-auto w-full max-w-[1100px]">
            {tiers.map((tier, index) => (
              <MenuSection
                key={tier.id}
                tier={tier}
                layout={layout}
                eagerCount={index === 0 ? ABOVE_FOLD_CARDS : 0}
              />
            ))}
          </div>
        </MenuDetailProvider>
      </main>
      <SiteFooter />
    </>
  )
}
