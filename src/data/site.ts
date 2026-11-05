export const site = {
  name: "Koko Dio Kitchen",
  // Nomor WhatsApp format internasional tanpa + atau spasi, contoh: "6281234567890".
  // Tombol "Pesan lewat WhatsApp" hanya muncul kalau ini diisi.
  whatsapp: "",
  // Username Instagram tanpa @, contoh: "kokodiokitchen". Link hanya muncul kalau ini diisi.
  instagram: "",
  // Cara bayar di booth. Website ini hanya menampilkan menu, pembayaran tidak lewat website.
  payment: ["tunai", "QRIS"],
  // Jadwal jualan berikutnya, format tahun-bulan-tanggal. Kosongkan date ("") untuk menyembunyikan.
  // Setelah tanggalnya lewat, info ini otomatis hilang dari website.
  event: {
    date: "2026-11-27",
    place: "kampus",
  },
}
