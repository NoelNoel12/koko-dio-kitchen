import { site } from "@/data/site"

export function whatsappUrl() {
  const number = site.whatsapp.replace(/\D/g, "")
  if (!number) return null
  const text = encodeURIComponent(`Halo ${site.name}, saya mau pesan rice box.`)
  return `https://wa.me/${number}?text=${text}`
}

export function instagramUrl() {
  const handle = site.instagram.replace(/^@/, "").trim()
  if (!handle) return null
  return { href: `https://instagram.com/${handle}`, handle }
}
