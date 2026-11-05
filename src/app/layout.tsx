import type { Metadata, Viewport } from "next"
import { Lilita_One, Plus_Jakarta_Sans } from "next/font/google"
import { menu } from "@/data/menu"
import { site } from "@/data/site"
import { browserColors } from "@/lib/colors"
import { formatPrice, groupByPrice } from "@/lib/menu"
import "./globals.css"

const lilita = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lilita",
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
})

function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return new URL(process.env.NEXT_PUBLIC_SITE_URL)
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
  }
  return new URL(`http://localhost:${process.env.PORT ?? 3000}`)
}

const prices = groupByPrice(menu).map((tier) => formatPrice(tier.price))
const title = `Menu Rice Box ${site.name}`
const description = `${menu.length} rasa rice box ${site.name}, harga ${prices.join(" dan ")}. Lihat menu lengkapnya di sini.`

export const metadata: Metadata = {
  metadataBase: siteUrl(),
  title,
  description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: site.name,
    title,
    description,
    url: "/",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `Logo ${site.name}` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
}

export const viewport: Viewport = {
  themeColor: browserColors.orange,
  colorScheme: "light",
  viewportFit: "cover",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${lilita.variable} ${jakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}
