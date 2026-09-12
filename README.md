<img width="1362" height="649" alt="ke github" src="https://github.com/user-attachments/assets/9a5298d4-761f-4059-bba5-b9e90c6c792b" />

DOKUMENTASI TEKNIS NTT CULINARY'S
=================================

Dokumen ini menjelaskan arsitektur, struktur kode, konfigurasi, instalasi,
pengoperasian, pengujian, dan pemeliharaan aplikasi NTT Culinary's.

1. RINGKASAN SISTEM
-------------------
NTT Culinary's adalah aplikasi penjualan kuliner berbasis Laravel.

Fitur utama:
- Katalog produk aktif untuk pelanggan.
- Filter kategori dan keranjang berbasis session.
- Checkout dengan validasi stok.
- Penyimpanan pesanan.
- Autentikasi pelanggan dan admin.
- Dashboard admin untuk produk, pesanan, stok, dan ringkasan penjualan.

Teknologi:
- Backend       : Laravel 13
- Bahasa        : PHP 8.3+
- Database      : SQLite
- Frontend      : Blade, Tailwind CSS, Alpine.js
- Asset bundler : Vite
- Browser test  : Playwright
- Server lokal  : Laravel Artisan atau Laragon

2. ARSITEKTUR APLIKASI
----------------------
Aplikasi menggunakan pola Laravel. Request dari browser masuk melalui route,
diproses oleh middleware dan model Eloquent, lalu menghasilkan Blade view.

Alur komponen:

Browser pelanggan/admin
        |
        v
routes/web.php
        |
        +--> Middleware session dan auth
        |
        +--> Model User, Product, Order
        |          |
        |          v
        |      SQLite database
        |
        +--> Blade views dan Alpine.js
                       |
                       v
                 Vite/Tailwind assets

Alur pelanggan:
1. Pelanggan membuka /menu.
2. Route mengambil produk aktif dari database.
3. Katalog ditampilkan melalui Blade.
4. POST /keranjang/tambah memvalidasi produk dan menyimpan item ke session.
5. Pelanggan membuka /checkout.
6. Sistem mengunci baris produk, memeriksa stok, mengurangi stok,
   dan membuat order di dalam database transaction.
7. Pelanggan diarahkan kembali ke /menu setelah checkout berhasil.

Alur admin:
1. Admin membuka halaman login.
2. Laravel memvalidasi kredensial dan flag is_admin.
3. Middleware auth memastikan user sudah login.
4. Route dashboard memeriksa kembali Auth::user()->is_admin.
5. Admin dapat membuat produk dan memperbarui status pesanan.

3. STRUKTUR DIREKTORI PENTING
-----------------------------
app/Models/              Model User, Product, dan Order
bootstrap/               Konfigurasi bootstrap aplikasi
config/                  Konfigurasi Laravel
database/migrations/     Struktur tabel dan katalog awal
public/                  Entry point dan asset publik
resources/css/           Tailwind CSS
resources/js/            Entry point Vite
resources/views/         Blade view pelanggan dan admin
routes/web.php           Route halaman, autentikasi, cart, checkout, admin
tests/Feature/           Test Laravel
tests/Unit/              Unit test
tests/e2e/               Runner Playwright
docs/                    Dokumentasi dan laporan pengujian

4. MODEL DAN DATABASE
---------------------
Tabel users:
Menyimpan akun pelanggan dan admin. Kolom khusus aplikasi adalah is_admin
dan avatar.

Tabel products:
- name       : nama produk.
- category   : Makanan atau Minuman.
- price      : harga dalam Rupiah tanpa pecahan.
- stock      : stok non-negatif.
- image      : path gambar opsional.
- is_active  : penanda produk tampil di katalog.

Tabel orders:
- user_id        : pemilik pesanan.
- items          : snapshot item dalam JSON.
- total          : total pesanan.
- payment_method : transfer, e-wallet, atau cod.
- status         : Menunggu, Diproses, Dikirim, Selesai, atau Dibatalkan.

Checkout memakai transaction dan lockForUpdate() ketika mengurangi stok agar
pemeriksaan stok dan pembuatan pesanan berjalan atomik.

5. PRASYARAT INSTALASI
----------------------
Pastikan tersedia:
- PHP 8.3 atau lebih baru.
- Composer.
- Node.js dan npm.
- SQLite dengan ekstensi PHP SQLite aktif.
- Git, bila proyek diambil dari repository.

Pada Windows dengan Laragon, executable PHP dapat berada di:
D:\laragon\bin\php\php-8.3.30-Win32-vs16-x64\php.exe

Contoh menggunakan perintah php jika PHP sudah ada di PATH. Jika belum,
ganti php dengan path executable Laragon.

6. INSTALASI DARI AWAL
----------------------
Jalankan PowerShell dari folder proyek:

cd D:\laragon\www\TUGAS_PPL_SP
composer install
Copy-Item .env.example .env
php artisan key:generate

Buat database SQLite jika belum ada:

New-Item -ItemType File -Path database\database.sqlite -Force

Konfigurasi minimum .env:

APP_ENV=local
APP_DEBUG=true
APP_URL=http://127.0.0.1:8000
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
SESSION_DRIVER=file

Lanjutkan instalasi dependency frontend dan database:

php artisan migrate --seed
npm install
npm run build

Jika .env.example tidak tersedia, buat .env secara manual berdasarkan
konfigurasi di atas, lalu jalankan php artisan key:generate.

7. MENJALANKAN APLIKASI
-----------------------
Mode pengembangan, terminal pertama:

php artisan serve --host=127.0.0.1 --port=8000

Terminal kedua, bila ingin memantau perubahan asset:

npm run dev

Alamat aplikasi:
- Pelanggan    : http://127.0.0.1:8000/menu
- Login user   : http://127.0.0.1:8000/login
- Login admin  : http://127.0.0.1:8000/admin/login

Menggunakan Laragon:
1. Letakkan proyek di D:\laragon\www\TUGAS_PPL_SP.
2. Jalankan Apache/Nginx dan database dari Laragon bila diperlukan.
3. Pastikan .env menunjuk ke database yang benar.
4. Gunakan URL artisan serve atau virtual host Laragon sesuai konfigurasi.

8. PERINTAH OPERASIONAL
-----------------------
php artisan route:list
php artisan migrate:status
php artisan migrate
php artisan view:cache
php artisan optimize:clear
npm run build

Log aplikasi berada di:
storage/logs/laravel.log

9. PENGUJIAN
------------
Test backend:
php artisan test

Test browser, setelah server aktif:
npm run test:e2e

Output Playwright:
reports/playwright-report.html

Laporan pengujian manual dan audit bug:
docs/laporan-pengujian.html

10. KONFIGURASI PRODUKSI
------------------------
1. Set APP_ENV=production dan APP_DEBUG=false.
2. Gunakan database produksi dan backup berkala.
3. Jalankan php artisan config:cache dan php artisan route:cache.
4. Pastikan storage dan bootstrap/cache memiliki permission yang sesuai.
5. Jalankan npm run build.
6. Jangan mengekspos .env, database SQLite, log, atau laporan internal.
7. Gunakan HTTPS dan pengaturan cookie/session yang sesuai.

11. KETERBATASAN DAN RISIKO YANG DIKETAHUI
-------------------------------------------
- Pendaftaran admin masih tersedia melalui endpoint publik.
- Fitur pencarian header belum memfilter kartu produk.
- Link Contact belum memiliki route aktif.
- Halaman riwayat pesanan pelanggan masih berupa placeholder.
- Harga cart berasal dari snapshot session dan perlu dihitung ulang dari
  database saat checkout.
- Cleanup Playwright bergantung pada executable php di PATH.
- Payment gateway eksternal belum diintegrasikan.

Daftar severity, bukti, dan rekomendasi perbaikan tersedia di:
docs/laporan-pengujian.html

USER MANUAL NTT CULINARY'S
==========================

Panduan ini menjelaskan cara menggunakan NTT Culinary's sebagai pelanggan
dan admin.

1. MEMBUKA APLIKASI
-------------------
Buka alamat berikut pada browser:

http://127.0.0.1:8000/menu

Halaman menu menampilkan katalog produk aktif, kategori, harga, dan tombol
untuk menambahkan produk ke keranjang.

2. PANDUAN PELANGGAN
--------------------

2.1 Melihat produk
1. Buka halaman Menu.
2. Gulir ke bagian katalog.
3. Periksa nama, kategori, harga, dan gambar produk.
4. Produk dengan stok kosong memiliki tombol Stok habis dan tidak dapat
   ditambahkan.

2.2 Memfilter kategori
1. Pilih Semua, Makanan, atau Minuman pada filter katalog.
2. Produk ditampilkan sesuai kategori.
3. Pilih Semua untuk menampilkan seluruh produk aktif.

2.3 Menambahkan produk ke keranjang
1. Pilih produk yang diinginkan.
2. Klik Tambah ke keranjang.
3. Sistem menyimpan produk pada keranjang browser/session.
4. Buka Keranjang untuk memeriksa item dan total.
5. Tambahkan produk yang sama kembali untuk menaikkan jumlahnya.

2.4 Memeriksa keranjang
Halaman Keranjang menampilkan:
- nama produk;
- harga satuan;
- jumlah;
- subtotal;
- total belanja.

Untuk menghapus item, klik tombol hapus pada produk tersebut.

2.5 Registrasi pelanggan
1. Klik Register.
2. Isi nama, email, password, dan konfirmasi password.
3. Password minimal 8 karakter.
4. Klik tombol pendaftaran.
5. Setelah berhasil, pengguna masuk dan diarahkan ke menu.

2.6 Login pelanggan
1. Klik Login.
2. Masukkan email dan password.
3. Aktifkan pilihan ingat saya bila diperlukan.
4. Klik tombol masuk.
5. Jika benar, pengguna diarahkan ke halaman menu.

2.7 Checkout
1. Pastikan keranjang tidak kosong.
2. Klik Checkout.
3. Login terlebih dahulu bila diminta.
4. Periksa daftar produk dan total.
5. Pilih metode pembayaran:
   - Transfer bank
   - E-wallet
   - Bayar di tempat
6. Klik Bayar sekarang.
7. Sistem memeriksa stok, mengurangi stok, dan membuat pesanan.
8. Setelah berhasil, pengguna diarahkan ke menu dengan pesan konfirmasi.

Jika stok tidak mencukupi, checkout dibatalkan dan pesan kesalahan
ditampilkan.

2.8 Pengaturan akun
1. Login sebagai pelanggan.
2. Buka menu profil.
3. Pilih User Setting.
4. Unggah avatar JPG, JPEG, PNG, atau WEBP maksimal 2 MB.
5. Klik tombol simpan.

2.9 Logout
Buka menu profil lalu pilih Log out.

3. PANDUAN ADMIN
---------------

3.1 Membuka halaman admin
Gunakan alamat:
http://127.0.0.1:8000/admin/login

3.2 Login admin
1. Masukkan email akun admin.
2. Masukkan password.
3. Klik Login admin.
4. Jika akun valid dan memiliki flag admin, dashboard terbuka.

Akun pelanggan biasa tidak boleh digunakan untuk mengakses dashboard admin.

3.3 Register admin
Form register admin tersedia pada:
http://127.0.0.1:8000/admin/register

CATATAN KEAMANAN:
Pada versi saat ini endpoint register admin masih terbuka untuk publik.
Untuk produksi, batasi pendaftaran admin melalui undangan, seed data, atau
otorisasi khusus.

3.4 Memahami dashboard
Dashboard menampilkan:
- total penjualan berstatus selesai;
- jumlah pesanan menunggu atau diproses;
- jumlah pelanggan;
- jumlah produk;
- daftar inventori produk;
- tabel operasional pesanan.

Dashboard melakukan refresh berkala untuk mengambil data terbaru.

3.5 Menambahkan produk
1. Login sebagai admin.
2. Buka bagian Tambah produk.
3. Isi nama produk.
4. Pilih kategori Makanan atau Minuman.
5. Isi harga dalam Rupiah tanpa tanda titik, contoh 15000.
6. Isi stok dengan angka non-negatif.
7. Klik Simpan produk.
8. Produk muncul pada inventori dan katalog pelanggan jika aktif.

Produk baru belum menyediakan upload gambar. Jika gambar kosong, katalog
menggunakan gambar default.

3.6 Mengelola status pesanan
1. Temukan pesanan pada tabel operasional.
2. Pilih status baru:
   - Menunggu
   - Diproses
   - Dikirim
   - Selesai
   - Dibatalkan
3. Simpan perubahan status.
4. Ringkasan penjualan menghitung pesanan berstatus Selesai.

3.7 Logout admin
Klik Keluar dari dashboard pada sidebar atau menu mobile.

4. NAVIGASI UTAMA
-----------------
Menu             : Melihat katalog utama dan filter kategori
Product          : Melihat katalog produk alternatif
Keranjang        : Melihat dan menghapus item belanja
About            : Melihat informasi NTT Culinary's
User Setting     : Mengelola avatar akun setelah login
Admin Login      : Masuk ke dashboard admin

5. PESAN KESALAHAN UMUM
-----------------------
Keranjang masih kosong
Penyebab : Belum ada produk ditambahkan.
Tindakan : Kembali ke menu dan pilih produk.

Stok tidak mencukupi
Penyebab : Jumlah permintaan lebih besar dari stok terbaru.
Tindakan : Kurangi jumlah atau pilih produk lain.

Email atau password salah
Penyebab : Kredensial tidak cocok.
Tindakan : Periksa kembali data login.

Validasi form muncul
Penyebab : Data wajib kosong atau format salah.
Tindakan : Perbaiki field yang ditandai.

Akses ditolak
Penyebab : Akun bukan admin.
Tindakan : Login menggunakan akun admin.

6. BATASAN VERSI SAAT INI
--------------------------
- Pencarian produk pada header belum berfungsi sebagai filter katalog.
- Link Contact belum memiliki halaman aktif.
- Halaman riwayat pesanan pelanggan masih dalam pengembangan.
- Payment gateway eksternal belum tersedia.
- Harga dan stok perlu dikonfirmasi kembali saat checkout pada versi berikutnya.

Dokumentasi teknis:
docs/dokumentasi-teknis.txt

Laporan pengujian:
docs/laporan-pengujian.html

