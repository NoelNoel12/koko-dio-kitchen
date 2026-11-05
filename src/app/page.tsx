import { menu } from "@/data/menu"
import { menuDetail } from "@/data/menu-detail"
import { formatPrice, groupByPrice } from "@/lib/menu"
import { CategoryNav } from "@/components/CategoryNav"
import { Hero, HERO_LOGO_ID } from "@/components/Hero"
import { MenuDetailProvider } from "@/components/MenuDetail"
import { MenuSection } from "@/components/MenuSection"
import { SiteFooter } from "@/components/SiteFooter"

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
      <Hero />
      <main>
        <CategoryNav categories={categories} menuId="menu" heroLogoId={HERO_LOGO_ID} />
        <MenuDetailProvider items={menu} details={menuDetail}>
          <div id="menu" className="page-gutter mx-auto w-full max-w-[1100px]">
            {tiers.map((tier, index) => (
              <MenuSection key={tier.id} tier={tier} eagerCount={index === 0 ? ABOVE_FOLD_CARDS : 0} />
            ))}
          </div>
        </MenuDetailProvider>
      </main>
      <SiteFooter />
    </>
  )
}
