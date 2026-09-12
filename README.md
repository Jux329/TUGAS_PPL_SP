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
