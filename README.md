# Afro Noken

## Deskripsi Proyek
Afro Noken adalah website promosi untuk produk perawatan rambut alami khas Papua. Tema desain mengusung nuansa dark luxury, coklat kayu, dan aksen gold elegant.

## Perubahan Terbaru
Berikut adalah ringkasan perubahan yang telah dibuat pada proyek ini:

### `index.html`
- Mengubah `Katalog Produk` menjadi layout modern dengan header katalog dan filter kategori.
- Menambahkan tombol kategori: `Semua`, `Hair Care`, `Aksesoris`, dan `Lainnya`.
- Menambahkan produk `Sisir Bambu` ke kategori `Aksesoris`.
- Memindahkan dan merapikan footer dengan logo, nama brand, alamat `Kota Jayapura, Papua`, dan icon sosial media.
- Menambahkan modal pemesanan modern untuk tombol `Beli Sekarang`.
- Menyisipkan komentar HTML untuk memudahkan pemahaman developer pemula.

### `css/style.css`
- Menerapkan style footer dark luxury dengan background hitam coklat, border top gold transparan, dan teks cream.
- Menambahkan styling tombol kategori pill glassmorphism dengan efek hover glow gold dan active state.
- Memperbarui tampilan card produk modern dengan hover lift, glow border, image zoom, dan harga yang ditonjolkan.
- Menambahkan responsive behavior untuk mobile: tombol kategori horizontal scroll dan layout card 1 kolom.
- Menambahkan animasi fade-up pada footer dan efek visual smooth untuk interaksi.

### `js/script.js`
- Menambahkan logika filter kategori produk untuk mengontrol tampilan card berdasarkan kategori.
- Menambahkan modal order untuk pemesanan melalui WhatsApp dengan validasi form.
- Menyinkronkan tombol `Beli Sekarang` untuk membuka modal dengan nama produk dan harga otomatis.
- Implementasi pengiriman ke WhatsApp menggunakan `encodeURIComponent` untuk pesan yang aman.
- Menambahkan komentar JavaScript agar lebih mudah dimengerti oleh developer pemula.

## Git
- Branch saat ini: `main`
- Remote origin: `https://github.com/esternumbre/Afro-Noken.git`
## Integrasi WhatsApp + Google Sheets
- Fitur pemesanan otomatis memungkinkan pengunjung mengirim pesanan melalui WhatsApp.
- Data pesanan disiapkan untuk disimpan ke Google Sheets secara otomatis menggunakan Google Apps Script.
- Data yang disimpan meliputi: Nama Pemesan, Nomor WhatsApp, Nama Barang, Jumlah, Harga, Total Pembayaran, Tanggal Pemesanan, Alamat, Catatan, dan Status Pesanan.
- `google-apps-script.gs` berisi contoh Apps Script untuk menerima data dan menambahkan baris baru ke sheet.
- Ganti `GOOGLE_SHEETS_WEBAPP_URL` di `js/script.js` setelah menerbitkan Apps Script sebagai web app.
## Instruksi Push
Perubahan ini telah dikomit dan didorong ke repositori GitHub pada branch `main`.
