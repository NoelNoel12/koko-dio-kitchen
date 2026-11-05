# Koko Dio Kitchen: menu digital

Website menu rice box Koko Dio Kitchen. Dibuka pelanggan lewat HP dari QR code di kasir atau di meja. Satu halaman statis: Next.js (App Router), TypeScript strict, Tailwind CSS v4.

## Menjalankan di komputer sendiri

Butuh Node.js 20.9 atau lebih baru.

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

Perintah lain:

| Perintah | Fungsi |
|---|---|
| `npm run build` lalu `npm start` | Build produksi dan jalankan hasilnya |
| `npm run lint` | Cek kode dengan ESLint |
| `npm run typecheck` | Cek tipe TypeScript |
| `npm run assets` | Buat ulang logo, favicon, ikon, dan gambar OG dari file di `assets-source/` |
| `npm run print` | Buat ulang QR code dan file cetak di folder `print/` (lihat bagian QR code) |
| `npm run og` | Buat ulang gambar preview link `public/og.png` (lihat bagian Gambar preview link) |
| `npm run screenshots -- http://localhost:3000` | Screenshot di 360, 375, 390, 430, 768, 1280 px ke folder `screenshots/`, sekaligus cek horizontal scroll, ukuran target sentuh, dan filter kategori. Butuh `npx playwright install chromium` sekali. |

## Mengganti menu dan harga

Semua menu ada di satu file: `src/data/menu.ts`.

```ts
{ id: "katsu-ori", name: "Katsu Ori", price: 18000 },
```

- **Ganti harga**: ubah angka `price` (tanpa titik, tanpa "Rp"). Tampilan `Rp18.000` dibuat otomatis.
- **Tambah menu**: tambah satu baris baru. `id` huruf kecil dan tanda hubung, harus unik.
- **Urutan**: urutan baris = urutan tampil.
- **Kelompok harga** dibuat otomatis dari `price`. Kalau nanti ada harga baru (misalnya 30000), section dan tombol kategori `Rp30.000` muncul sendiri.
- **Stok habis**: ganti `available: true` menjadi `available: false`. Kartu tetap tampil, meredup, dengan stiker "Habis". Saat acara, ini bisa dilakukan dari HP lewat github.com: lihat [PANDUAN-STOK-HABIS.md](PANDUAN-STOK-HABIS.md).
- **Deskripsi** (opsional): tambahkan `description: "..."`. Kalau kosong, kartu tetap rapi.

Teks di hero ("10 rasa, mulai Rp18.000.") dan deskripsi untuk Google juga dihitung dari file ini, jadi tidak perlu diedit manual.

### Isi rice box (nasi, lauk, saus, pelengkap)

Setiap kartu menu bisa ditekan untuk membuka panel detail. Isinya diatur di `src/data/menu-detail.ts`, dicocokkan lewat `id` yang sama dengan `menu.ts`:

```ts
"katsu-ori": { nasi: "", lauk: "", saus: "", pelengkap: "" },
```

- Isian yang masih kosong tampil sebagai kotak **"Menyusul"**, ditambah catatan "Detail isi sedang dilengkapi". Jadi aman ditayangkan sebelum info aslinya didapat, karena tidak ada isi yang dikarang.
- Isi teksnya begitu info asli sudah ada, misalnya `nasi: "Nasi putih"`.
- Nama dan urutan baris (Nasi, Lauk utama, Saus, Pelengkap) diatur di `detailFields` di file yang sama.
- Data ini sengaja dipisah dari `menu.ts`, supaya file yang diedit dari HP saat acara (stok habis) tetap pendek dan mudah dicari.

> Kalau menu pernah diedit lewat github.com (misalnya menandai "Habis" saat acara), jalankan `git pull` dulu sebelum mengedit di komputer, supaya perubahan dari HP tidak tertimpa.

### Cara bayar dan jadwal jualan

Di `src/data/site.ts`:

```ts
payment: ["tunai", "QRIS"],
event: { date: "2026-11-27", place: "kampus" },
```

- `payment` tampil di hero sebagai "Bayar langsung di booth: tunai atau QRIS". Website ini hanya untuk melihat menu, tidak ada pembayaran lewat website.
- `event` tampil sebagai "Jualan di kampus: Jumat, 27 November 2026". Pada hari-H tulisannya berubah menjadi "Hari ini jualan di kampus", dan setelah tanggalnya lewat info ini hilang sendiri. Pengecekan tanggal dilakukan di browser pengunjung dengan zona waktu WIB. Untuk acara berikutnya, cukup ganti tanggalnya. Untuk menyembunyikan, isi `date: ""`.

### Nomor WhatsApp dan Instagram

Edit `src/data/site.ts`:

```ts
whatsapp: "6281234567890",   // format internasional, tanpa + dan spasi
instagram: "kokodiokitchen", // tanpa @
```

Selama kosong, tombol "Pesan lewat WhatsApp" dan link Instagram tidak tampil sama sekali. Setelah diisi, tombol WhatsApp muncul di hero dan footer dengan pesan pembuka "Halo Koko Dio Kitchen, saya mau pesan rice box.", dan link Instagram muncul di footer.

## Memasang foto menu

1. Foto dengan **rasio 4:3 landscape**. Ini rasio bawaan kamera HP, jadi biasanya tidak perlu dipotong. Ukuran yang disarankan **1200 × 900 px**, format JPG, di bawah 300 KB.
2. Beri nama file sesuai `id` menu, lalu taruh di `public/menu/`. Contoh: `public/menu/katsu-ori.jpg`.
3. Isi field `image` di `src/data/menu.ts`:

   ```ts
   { id: "katsu-ori", name: "Katsu Ori", price: 18000, image: "/menu/katsu-ori.jpg" },
   ```

Bingkai gambar sudah dikunci 4:3, jadi saat foto masuk tidak ada pergeseran layout. Foto dengan rasio lain otomatis dipotong di tengah. Next.js mengecilkan dan mengonversi foto ke AVIF/WebP secara otomatis. Empat foto pertama dimuat langsung, sisanya dimuat saat di-scroll.

## Push ke GitHub

Project ini sudah punya commit lokal. Langkahnya:

1. Buat repository baru di https://github.com/new. Jangan centang "Add a README" supaya repository kosong.
2. Di folder project, jalankan (ganti `USERNAME` dan `NAMA-REPO`):

   ```bash
   git remote add origin https://github.com/USERNAME/NAMA-REPO.git
   git branch -M main
   git push -u origin main
   ```

## Deploy ke Vercel

1. Masuk ke https://vercel.com dengan akun GitHub.
2. Klik **Add New → Project**, pilih repository tadi, lalu **Import**.
3. Framework preset **Next.js** terdeteksi otomatis. Build command, output, dan root directory biarkan default. Tidak perlu `vercel.json`.
4. Klik **Deploy**. Setelah selesai, Vercel memberi URL seperti `https://nama-repo.vercel.app`.

Setiap kali ada `git push` ke `main`, Vercel otomatis deploy ulang. Jadi mengganti harga cukup dengan edit `menu.ts`, commit, lalu push.

Folder `assets-source/` (logo resolusi penuh, 3,7 MB) tidak di-import oleh kode dan tidak ada di `public/`, jadi tidak pernah masuk ke hasil build. Folder ini juga tercantum di `.vercelignore`.

### Variabel environment (opsional)

Lihat `.env.example`. Hanya ada satu:

| Nama | Isi | Kapan perlu |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL final, misalnya `https://menu.kokodiokitchen.com` | Kalau memakai domain sendiri. Dipakai untuk link preview (Open Graph) saat URL dibagikan di WhatsApp atau Instagram. |

Kalau tidak diisi, website memakai domain produksi Vercel (`VERCEL_PROJECT_PRODUCTION_URL`, otomatis tersedia di Vercel), dan di komputer lokal memakai `http://localhost:3000`.

Cara mengisi di Vercel: **Project → Settings → Environment Variables**, tambahkan nama dan nilainya, lalu **Redeploy**.

## QR code dan file cetak untuk booth

File siap cetak ada di folder `print/`. Semua QR berisi https://bit.ly/kokodiokitchen, yang diteruskan ke https://koko-dio-kitchen.vercel.app/:

| File | Pakai untuk |
|---|---|
| `standee-a4.pdf` | Standee atau poster di depan booth, terbaca dari antrean (QR sekitar 8 cm) |
| `kartu-meja-a6.pdf` | Kartu di meja atau kasir (QR sekitar 4 cm) |
| `qr-menu.svg`, `qr-menu.png` | QR polos untuk desain lain, misalnya stiker kemasan atau feed Instagram |
| `*.png` lainnya | Pratinjau 300 dpi dari tiap PDF |

Karena QR berisi link Bitly, tujuan link bisa diubah dari dashboard Bitly tanpa mencetak ulang (misalnya kalau nanti pindah ke domain sendiri). Konsekuensinya, QR yang sudah tercetak bergantung pada link Bitly itu: jangan hapus link atau akun Bitly-nya selama kartu masih dipakai. Kartu juga menulis jelas bahwa QR ini hanya untuk melihat menu, supaya pembeli tidak salah memindainya untuk membayar. Pembayaran tetap lewat QRIS milik toko di kasir.

Kalau harga termurah, jumlah rasa, atau cara bayar berubah, buat ulang semua file dengan:

```bash
npm run print
```

Atau untuk link lain:

```bash
npm run print -- https://menu.kokodiokitchen.com/
```

Script ini juga membaca balik QR di setiap file untuk memastikan hasilnya terbaca dan mengarah ke URL yang benar.

Saat mencetak:
1. Cetak PDF dengan skala **100% / ukuran sebenarnya**, jangan "fit to page".
2. Kertas tebal atau art paper doff lebih baik daripada glossy, karena kilap lampu bisa mengganggu pemindaian.
3. Uji pindai hasil cetak dengan kamera beberapa HP berbeda sebelum mencetak banyak.

## Keputusan desain

1. **Font**: Lilita One untuk judul, karena hurufnya bulat, gemuk, dan rapat seperti wordmark logo. Plus Jakarta Sans untuk teks, karena tetap jelas di ukuran kecil dan dirancang oleh studio tipografi Indonesia.
2. **Gaya sticker, logo apa adanya**: kartu, tombol, dan label memakai border hitam 2,5 px, sudut membulat besar, dan bayangan keras 4 px tanpa blur, meniru outline logo. Logonya sendiri selalu tampil persis seperti file aslinya, tanpa rotasi, bayangan, atau bingkai, baik di website maupun di media cetak. Skill `taste-skill` melarang bayangan dan `design-taste-frontend` melarang hitam murni. Keduanya kalah oleh palet dan gaya logo sesuai aturan prioritas brief.
3. **Dua tier, dua warna**: tiap kelompok dibuka stiker harga besar yang sedikit miring, berisi harga dan jumlah rasa. Tier Rp18.000 orange dengan teks hitam, tier Rp25.000 hitam dengan teks orange. Warna yang sama dipakai di label harga tiap kartu dan di panel detail, jadi tier terbaca dari jauh, tidak hanya di judul section.
4. **Grid**: di HP 2 kolom. Pada lebar 360 px kartu masih 158 px, foto tetap jelas, dan empat menu terlihat sekaligus, jadi kartu horizontal 1 kolom tidak dipakai. Tablet 3 kolom. Desktop memilih 3 atau 4 kolom otomatis supaya baris terakhir tidak bolong (6 menu jadi 3+3, 4 menu jadi 4).
5. **Placeholder**: ilustrasi kotak rice box dengan uap, digambar sendiri dalam SVG memakai warna palet, di atas latar peach dengan label "Foto menyusul". Bukan stock photo dan bukan karakter koki. Rasio dikunci 4:3. Saran `design-taste-frontend` untuk memakai foto stok tidak diikuti karena brief melarang.
6. **Navigasi kategori jadi filter**, bukan lompat ke section. Dengan scroll, "Semua" dan "Rp18.000" berhenti di titik yang sama dan tombolnya jadi membingungkan. Dengan filter, tiap tombol punya arti jelas. Tanpa JavaScript, tombol tetap berfungsi sebagai link ke section. Tidak ada header terpisah di atas logo besar: logo kecil baru muncul di bar kategori setelah logo hero lewat saat di-scroll, jadi layar pertama tidak menampilkan logo dua kali.
7. **Tema terang saja**: `design-taste-frontend` menyarankan dark mode, tapi brief menetapkan tema terang supaya warna logo dan kemasan tampil apa adanya.
8. **Gerak**: hanya satu momen masuk (judul hero naik pelan saat halaman dibuka), efek tekan pada tombol dan kartu, panel detail yang naik dari bawah, dan logo kecil yang meluncur masuk ke bar kategori. Logo hero tidak dianimasikan. Semua gerak mati otomatis kalau HP memakai pengaturan kurangi gerak (`prefers-reduced-motion`).

## Catatan teknis

- File logo sumber ternyata 20834 × 20834 px (bukan 8000) dan latarnya sudah transparan, jadi `scripts/prepare-assets.mjs` melewati flood-fill. Jalur flood-fill tetap ada dan sudah diuji: topi dan baju putih tidak ikut terhapus.
- Favicon dan ikon memakai crop kepala karakter, karena logo penuh terlalu detail di 32 px.
- Next.js 16 mengganti prop `priority` di `next/image` dengan `preload`. Logo hero memakai `preload`.
- Logo kecil di bar kategori memakai file 1x/2x yang sudah dikecilkan script, jadi tidak lewat image optimizer.
- `npm run print` dan `npm run og` membaca langsung `menu.ts` dan `site.ts`, jadi butuh Node.js 22.18 atau lebih baru (yang bisa menjalankan file TypeScript tanpa build). Website sendiri cukup Node 20.9.

## Gambar preview link

`public/og.png` adalah gambar yang muncul saat link situs dibagikan di WhatsApp, Instagram, atau media sosial lain. Isinya logo, "Rice box mulai Rp18.000", jumlah rasa, cara bayar, tanggal jualan, dan `bit.ly/kokodiokitchen`, semuanya dibaca dari `menu.ts` dan `site.ts`.

Buat ulang setiap kali harga, cara bayar, atau jadwal jualan berubah:

```bash
npm run og
```

Gambar ini statis. Berbeda dengan website, tanggal di gambar preview tidak hilang sendiri setelah acara lewat. Jalankan `npm run og` lagi setelah tanggal 27 November (tanggal yang sudah lewat otomatis tidak dicantumkan), lalu commit dan push. WhatsApp kadang menyimpan preview lama beberapa hari, jadi perubahan gambar ini bisa terlambat terlihat di sana.

## Struktur folder

```
assets-source/          Logo resolusi penuh (tidak ikut build)
public/brand/           Logo besar dan logo kecil hasil script
public/og.png           Gambar preview saat link dibagikan (npm run og)
public/menu/            Foto menu (buat foldernya saat foto pertama masuk)
print/                  QR code, standee A4, dan kartu meja A6 (tidak ikut build)
scripts/                prepare-assets.mjs, print-qr.mjs, og-image.mjs, brand-html.mjs, screenshots.mjs
src/app/                layout, halaman, CSS global, favicon, ikon, manifest
src/components/         Hero, EventDate, CategoryNav, MenuSection, MenuCard, MenuImage, MenuDetail, Footer, WhatsAppButton
src/data/menu.ts        Daftar menu, harga, dan status habis
src/data/menu-detail.ts Isi tiap rice box untuk panel detail
src/data/site.ts        Nama brand, WhatsApp, Instagram, cara bayar, jadwal jualan
PANDUAN-STOK-HABIS.md   Cara menandai rasa habis dari HP saat acara
src/lib/                Format harga, pengelompokan, link kontak, warna untuk metadata
```
