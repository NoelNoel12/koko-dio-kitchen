export type MenuDetail = {
  nasi?: string
  lauk?: string
  saus?: string
}

// Urutan dan nama baris yang tampil di panel detail. Ganti label di sini kalau perlu.
export const detailFields: { key: keyof MenuDetail; label: string }[] = [
  { key: "nasi", label: "Nasi" },
  { key: "lauk", label: "Lauk utama" },
  { key: "saus", label: "Saus" },
]

const NASI = "Nasi putih berselimut telur dadar"

// Isi tiap rice box, dicocokkan lewat id di menu.ts. Isian kosong tampil sebagai "Menyusul".
// Disusun dari foto menu dan resep umum tiap rasa; cocokkan dengan resep asli Koko Dio sebelum dipakai.
export const menuDetail: Record<string, MenuDetail> = {
  "katsu-ori": {
    nasi: NASI,
    lauk: "Chicken katsu (ayam berbalut tepung roti)",
    saus: "Saus katsu dan mayones, taburan wijen",
  },
  bbq: {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Saus barbeku, taburan wijen",
  },
  teriyaki: {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Saus teriyaki, taburan wijen",
  },
  "cabe-garam": {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Tanpa saus, ditumis bumbu cabe garam (cabai merah, cabai hijau, bawang putih goreng), taburan wijen",
  },
  blackpepper: {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Saus lada hitam, taburan wijen",
  },
  "honey-lemon": {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Saus madu lemon, taburan wijen",
  },
  "katsu-curry": {
    nasi: NASI,
    lauk: "Chicken katsu (ayam berbalut tepung roti)",
    saus: "Saus kari Jepang, taburan wijen",
  },
  kungpao: {
    nasi: NASI,
    lauk: "Ayam goreng potong dadu",
    saus: "Saus kungpao dengan kacang mete, cabai kering, daun bawang, dan bawang bombay",
  },
  "yakiniku-beef": {
    nasi: NASI,
    lauk: "Irisan tipis daging sapi",
    saus: "Saus yakiniku, taburan wijen",
  },
  "salted-egg": {
    nasi: NASI,
    lauk: "Ayam goreng tepung",
    saus: "Saus telur asin dengan irisan cabai merah, taburan wijen",
  },
}
