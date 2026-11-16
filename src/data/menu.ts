export type MenuItem = {
  id: string
  name: string
  price: number
  image?: string
  description?: string
  available?: boolean
}

// Urutan di sini adalah urutan tampil di website. Kelompok harga dibuat otomatis dari `price`.
// Stok habis: ganti `available: true` di akhir baris menjadi `available: false`. Stok ada lagi: kembalikan ke `true`.
// Foto: taruh foto asli di assets-source/Menu/, jalankan `npm run photos`, lalu isi `image: "/menu/<id>.jpg"`.
export const menu: MenuItem[] = [
  { id: "katsu-ori", name: "Katsu Ori", price: 18000, image: "/menu/katsu-ori.jpg", available: true },
  { id: "bbq", name: "BBQ", price: 18000, image: "/menu/bbq.jpg", available: true },
  { id: "teriyaki", name: "Teriyaki", price: 18000, image: "/menu/teriyaki.jpg", available: true },
  { id: "cabe-garam", name: "Cabe Garam", price: 18000, image: "/menu/cabe-garam.jpg", available: true },
  { id: "blackpepper", name: "Blackpepper", price: 18000, image: "/menu/blackpepper.jpg", available: true },
  { id: "honey-lemon", name: "Honey Lemon", price: 18000, image: "/menu/honey-lemon.jpg", available: true },
  { id: "katsu-curry", name: "Katsu Curry", price: 25000, image: "/menu/katsu-curry.jpg", available: true },
  { id: "kungpao", name: "Kungpao", price: 25000, image: "/menu/kungpao.jpg", available: true },
  { id: "yakiniku-beef", name: "Yakiniku Beef", price: 25000, image: "/menu/yakiniku-beef.jpg", available: true },
  { id: "salted-egg", name: "Salted Egg", price: 25000, image: "/menu/salted-egg.jpg", available: true },
]
