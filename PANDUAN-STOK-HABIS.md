# Panduan tandai "Habis" dari HP

Untuk petugas booth. Kalau satu rasa habis, tandai di website supaya pembeli yang sedang antre tidak memilih rasa itu. Website ter-update sekitar 1 sampai 2 menit setelah disimpan.

Pegang tugas ini oleh **satu orang saja** selama acara, supaya tidak ada dua orang mengedit bersamaan.

## Persiapan (sehari sebelum acara)

1. **Akun GitHub.** Petugas booth butuh akun GitHub yang boleh mengedit repo ini.
   - Kalau memakai akun pemilik (`NoelNoel12`): cukup login di browser HP.
   - Kalau memakai akun sendiri: pemilik repo membuka github.com/NoelNoel12/koko-dio-kitchen, lalu **Settings → Collaborators → Add people**, dan memasukkan username petugas. Petugas lalu menerima undangan yang dikirim lewat email.
2. **Login GitHub di browser HP** (Chrome atau Safari). Aplikasi GitHub tidak bisa mengedit file, jadi pakai browser.
3. **Simpan link ini** sebagai bookmark atau shortcut di layar utama HP:

   https://github.com/NoelNoel12/koko-dio-kitchen/edit/main/src/data/menu.ts

4. **Latihan sekali**: tandai satu rasa habis, cek website, lalu kembalikan lagi.

## Saat satu rasa habis

1. Buka link edit di atas.
2. Cari baris rasa yang habis. Setiap rasa ada di satu baris, contohnya:

   ```
   { id: "katsu-ori", name: "Katsu Ori", price: 18000, available: true },
   ```

3. Ganti **hanya kata `true`** di baris itu menjadi **`false`**:

   ```
   { id: "katsu-ori", name: "Katsu Ori", price: 18000, available: false },
   ```

   Jangan menghapus koma, tanda kutip, atau kurung kurawal.
4. Ketuk tombol hijau **Commit changes...**, isi pesan singkat seperti `Habis: Katsu Ori`, lalu ketuk **Commit changes** lagi.
5. Tunggu 1 sampai 2 menit, lalu buka https://koko-dio-kitchen.vercel.app dan tarik layar ke bawah untuk refresh. Kartu rasa itu sekarang meredup dengan stiker **Habis**.

Pembeli yang sudah membuka website sebelumnya perlu refresh halaman untuk melihat perubahan. Kalau ada yang bertanya, kasir tetap jadi patokan utama.

## Saat stok ada lagi

Lakukan langkah yang sama, tapi ganti `false` kembali menjadi `true`.

## Kalau website tidak berubah setelah 3 menit

Biasanya karena ada salah ketik, misalnya koma terhapus. Website **tidak rusak**: Vercel tetap menampilkan versi terakhir yang benar, hanya perubahan barunya yang tidak masuk.

1. Buka link edit lagi.
2. Bandingkan baris yang tadi diubah dengan contoh di atas. Pastikan ada koma di akhir baris dan semua tanda kutip masih lengkap.
3. Perbaiki, lalu **Commit changes** lagi.

Kalau masih gagal, hubungi pemilik repo. Sementara itu, bilang ke pembeli secara langsung bahwa rasa tersebut habis.
