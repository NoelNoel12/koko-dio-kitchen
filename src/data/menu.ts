export type MenuItem = {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  available?: boolean
}

// Urutan di sini adalah urutan tampil di website. Kelompok harga dibuat otomatis dari `price`.
// Foto: taruh file di public/menu/<id>.jpg lalu isi `image: "/menu/<id>.jpg"`.
// Stok habis: isi `available: false`.
export const menu: MenuItem[] = [
  { id: "katsu-ori", name: "Katsu Ori", price: 18000 },
  { id: "bbq", name: "BBQ", price: 18000 },
  { id: "teriyaki", name: "Teriyaki", price: 18000 },
  { id: "cabe-garam", name: "Cabe Garam", price: 18000 },
  { id: "blackpepper", name: "Blackpepper", price: 18000 },
  { id: "honey-lemon", name: "Honey Lemon", price: 18000 },
  { id: "katsu-curry", name: "Katsu Curry", price: 25000 },
  { id: "kungpao", name: "Kungpao", price: 25000 },
  { id: "yakiniku-beef", name: "Yakiniku Beef", price: 25000 },
  { id: "salted-egg", name: "Salted Egg", price: 25000 },
]
