export type MenuItem = {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  available?: boolean
}

// Urutan di sini adalah urutan tampil di website. Kelompok harga dibuat otomatis dari `price`.
// Stok habis: ganti `available: true` menjadi `available: false`. Stok ada lagi: kembalikan ke `true`.
// Foto: taruh file di public/menu/<id>.jpg lalu tambahkan `image: "/menu/<id>.jpg"`.
export const menu: MenuItem[] = [
  { id: "katsu-ori", name: "Katsu Ori", price: 18000, available: true },
  { id: "bbq", name: "BBQ", price: 18000, available: true },
  { id: "teriyaki", name: "Teriyaki", price: 18000, available: true },
  { id: "cabe-garam", name: "Cabe Garam", price: 18000, available: true },
  { id: "blackpepper", name: "Blackpepper", price: 18000, available: true },
  { id: "honey-lemon", name: "Honey Lemon", price: 18000, available: true },
  { id: "katsu-curry", name: "Katsu Curry", price: 25000, available: true },
  { id: "kungpao", name: "Kungpao", price: 25000, available: true },
  { id: "yakiniku-beef", name: "Yakiniku Beef", price: 25000, available: true },
  { id: "salted-egg", name: "Salted Egg", price: 25000, available: true },
]
