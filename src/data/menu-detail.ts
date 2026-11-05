export type MenuDetail = {
  nasi?: string
  lauk?: string
  saus?: string
  pelengkap?: string
}

// Urutan dan nama baris yang tampil di panel detail. Ganti label di sini kalau perlu.
export const detailFields: { key: keyof MenuDetail; label: string }[] = [
  { key: "nasi", label: "Nasi" },
  { key: "lauk", label: "Lauk utama" },
  { key: "saus", label: "Saus" },
  { key: "pelengkap", label: "Pelengkap" },
]

// Isi tiap rice box, dicocokkan lewat id di menu.ts. Isian kosong tampil sebagai "Menyusul".
// Contoh: "katsu-ori": { nasi: "Nasi putih", lauk: "Ayam katsu", saus: "...", pelengkap: "..." },
export const menuDetail: Record<string, MenuDetail> = {
  "katsu-ori": { nasi: "", lauk: "", saus: "", pelengkap: "" },
  bbq: { nasi: "", lauk: "", saus: "", pelengkap: "" },
  teriyaki: { nasi: "", lauk: "", saus: "", pelengkap: "" },
  "cabe-garam": { nasi: "", lauk: "", saus: "", pelengkap: "" },
  blackpepper: { nasi: "", lauk: "", saus: "", pelengkap: "" },
  "honey-lemon": { nasi: "", lauk: "", saus: "", pelengkap: "" },
  "katsu-curry": { nasi: "", lauk: "", saus: "", pelengkap: "" },
  kungpao: { nasi: "", lauk: "", saus: "", pelengkap: "" },
  "yakiniku-beef": { nasi: "", lauk: "", saus: "", pelengkap: "" },
  "salted-egg": { nasi: "", lauk: "", saus: "", pelengkap: "" },
}
