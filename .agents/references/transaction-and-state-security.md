# Panduan Keamanan Transaksi, Concurrency & Integritas State

> **Atribusi Sumber Referensi:**
> Standar dalam dokumen ini disintesis dan diselaraskan secara terbuka dari:
> 1. **Keamanan API & Otorisasi:** *OWASP API Security Top 10* (BOLA/IDOR, Server-Side Trust Boundaries, Broken Function Level Authorization).
> 2. **Integritas Transaksi & Concurrency:** Prinsip *ACID Database Transactions* dan *Pessimistic / Optimistic Concurrency Control* pada sistem basis data relasional (PostgreSQL, MySQL/MariaDB, SQLite).
> 3. **Audit Forensik Produksi:** Pelajaran operasional nyata dari kegagalan integrasi pihak ketiga, manipulasi state klien/Console, dan kondisi balapan (*race condition*) pada aplikasi transaksi & multi-subdomain.

Dokumen ini menjadi acuan **On-Demand** bagi `role-inspektur`, `role-backend`, `role-database`, `role-blueprint`, dan `role-devops` — terutama untuk modul yang menyentuh **uang, stok, kuota, autentikasi, webhook, atau API eksternal**.

---

## 1. Zero-Trust Frontend Payload & Console Tampering

Prinsip dasar: **Browser, aplikasi mobile, DevTools Console, dan request HTTP klien sepenuhnya berada di bawah kendali penyerang.**

1. **Jangan Pernah Percaya Nominal & Status dari Klien:**
   - **DILARANG** menerima harga satuan (`price`), `subtotal`, `shipping_cost`, nominal `discount`, `grand_total`, `is_paid`, atau `approved_by_supervisor` mentah dari request JSON/Form klien.
   - Semua kalkulasi uang dan kelayakan promo wajib dihitung ulang di server berdasarkan data otoritatif di database.
2. **Kunci State Sensitif pada Framework *Stateful Server-Component*:**
   - Pada framework yang mengekspos state komponen ke klien (misal Laravel Livewire, Phoenix LiveView, Blazor), properti sensitif seperti tarif ongkir (`$shippingRates`), subtotal, ID order aktif, atau status otorisasi wajib dikunci dari mutasi klien (contoh di Livewire: atribut `#[Locked]`).
   - Pada API REST/GraphQL/RPC tradisional (Node/TS, Python, Go, PHP): lakukan validasi skema ketat (*allowlist* field yang boleh diisi) agar penyerang tidak bisa menyuntikkan field tambahan (*Mass Assignment*).
3. **Allowlist Metode Pembayaran, Status & Otorisasi Diskon/Void:**
   - Validasi `payment_method` dan transisi status terhadap daftar yang diizinkan oleh server (jangan hanya mengandalkan dropdown UI yang tersembunyi).
   - Batas diskon manual, refund, atau void transaksi (misal di POS/Admin) wajib ditegakkan di server. Jika memerlukan persetujuan supervisor, terbitkan token sesi otorisasi sekali pakai yang berumur singkat (misal 15 menit) dan terikat pada aksi spesifik — bukan sekadar boolean `is_authorized: true` dari klien.

---

## 2. Concurrency, Race Condition & Idempotency

Dua request yang datang di milidetik yang sama (klik ganda, retry jaringan, atau dua kasir/user berebut stok terakhir) tidak boleh merusak saldo, stok, atau laporan.

1. **Wajib Transaksi Atomik + Row Locking:**
   - Setiap mutasi multi-tabel atau pengurangan stok/saldo/kuota wajib dibungkus **Database Transaction**.
   - Gunakan **Pessimistic Locking** (`SELECT ... FOR UPDATE` / `lockForUpdate()` di ORM) atau **Atomic Conditional Update** (`UPDATE products SET stock = stock - :qty WHERE id = :id AND stock >= :qty`).
2. **Pola *Double-Checked Locking* yang Benar:**
   - Pengecekan kondisi (misal: apakah order masih `pending`, apakah stok cukup, apakah belum di-void) **WAJIB diulang di dalam transaksi SETELAH lock baris diperoleh** — bukan sebelum `BEGIN` / di luar lock.
   - *Salah:* Cek `if ($order->status !== 'void')` di luar lock → mulai transaksi → lock → langsung ubah status.
   - *Benar:* Mulai transaksi → ambil baris dengan `FOR UPDATE` → **cek ulang** `if ($order->status === 'void')` → eksekusi mutasi → commit.
3. **Flag Idempotensi Persisten:**
   - Operasi kritis (checkout, pembayaran, pengembalian stok, void/refund, callback webhook) wajib memiliki kunci/penanda idempotensi di database:
     - `idempotency_key` unik pada tabel order/transaksi untuk mencegah order ganda akibat retry.
     - Penanda status idempoten seperti `is_stock_restored` / `stock_restored_at` atau `voided_at` agar aksi cancel/void yang terpanggil 2x tidak pernah mengembalikan stok dua kali atau mengacaukan *Z-Report* / buku besar (*ledger*).

---

## 3. Payment Gateway & Webhook State Machine

Webhook pembayaran bersifat asinkronus, bisa datang berulang (*at-least-once delivery*), terlambat, atau bertabrakan dengan aksi manual pengguna.

1. **Verifikasi Signature & Integritas Sumber:**
   - Wajib verifikasi tanda tangan kriptografis (HMAC/signature header) menggunakan secret resmi sebelum memproses payload webhook apa pun.
2. **Penjaga Transisi State (*State Machine Guard*):**
   - Definisikan graf transisi status yang sah secara eksplisit.
   - **Tolak Mundur Status:** Abaikan atau tolak event `EXPIRED`, `FAILED`, atau `UNPAID` yang datang **setelah** transaksi berstatus `PAID` / `COMPLETED`.
   - **Pembayaran Terlambat pada Order `CANCELLED`:** Jika webhook `PAID` datang setelah order terlanjur dibatalkan/kedaluwarsa, **jangan menimpa status atau mengurangi stok secara diam-diam**. Catat sebagai anomali/rekonsiliasi eksplisit (flag butuh refund/review admin) dengan guard transaksi + row lock agar tidak balapan dengan fungsi `cancelOrder`.
3. **Rekonsiliasi Item Gateway vs `grand_total`:**
   - Sebelum mengirim payload rincian item ke payment gateway, pastikan persamaan berikut tepat 100%:
     ```text
     SUM(item_price * qty) - total_discount + shipping_cost + tax_amount == grand_total
     ```
   - Jika ada diskon level keranjang/voucher atau pembulatan, representasikan sebagai baris item negatif/penyesuaian yang sesuai kontrak gateway agar transaksi tidak ditolak (*amount mismatch*).

---

## 4. Multi-Subdomain, Canonical URL & Cache Hygiene

1. **Canonical Base URL pada Arsitektur Multi-Subdomain:**
   - Pada sistem yang memisahkan subdomain (misal `www.`, `admin.`, `pos.`, `api.`), helper URL dinamis yang membaca header `Host` request saat ini (seperti `url()` di PHP/Laravel atau `req.headers.host` di Node/Express) berisiko membocorkan link `admin.` atau `pos.` ke sitemap, email notifikasi, gambar produk, atau callback publik.
   - **Aturan Wajib:** Selalu bangun URL publik dan aset kanonik menggunakan konfigurasi statis terpusat (`APP_URL` / `PUBLIC_BASE_URL`), bukan host dari request yang sedang aktif.
2. **Anti-*Negative Caching* pada API Eksternal:**
   - **DILARANG KERAS** membungkus pemanggilan API pihak ketiga (ongkos kirim, daftar wilayah, kurs, payment, AI) dengan cache TTL panjang secara buta (misal `Cache::remember($key, 6 * 3600, fn () => ...)`).
   - Jika API eksternal mengembalikan HTTP `4xx`/`5xx`, timeout, atau payload kosong/fallback, respons gagal tersebut akan ikut tersimpan di cache selama berjam-jam dan melumpuhkan fitur meski kendala sudah teratasi.
   - **Aturan Wajib:** Cache **HANYA** jika respons terverifikasi `2xx` dan struktur datanya valid serta tidak kosong. Gunakan TTL singkat atau fallback terpisah tanpa meng-cache error.
3. **Invarian Flag Lintas Domain di Satu Titik:**
   - Jika dua atau lebih kolom/flag saling bergantung (misal kanal penjualan `online_only` / `pos_only` vs flag `is_custom` / `is_active`), jangan hanya mengandalkan form UI admin untuk menjaga konsistensinya.
   - Tegakkan invarian tersebut di satu titik terpusat (model lifecycle hook/observer, Domain Service, atau constraint DB) serta sediakan query scope tunggal (*Single Source of Truth*) agar produk internal/POS tidak pernah bocor ke storefront atau sitemap.

---

## 5. External API Contract Verification & Production Data Anomaly Check

Automated test dengan HTTP mock (`Http::fake()`, `nock`, `msw`, `responses`) **hanya menguji asumsi kode kita sendiri**, bukan perilaku API pihak ketiga di dunia nyata.

1. **Protokol Verifikasi Kontrak Asli API Eksternal:**
   - Setiap kali menambah atau mengubah integrasi API eksternal (payment gateway, ekspedisi/ongkir, kode wilayah, WhatsApp/email, AI), wajib lakukan **minimal 1x verifikasi kontrak asli** terhadap dokumentasi resmi terbaru atau respons sandbox/live nyata:
     - Pastikan format parameter/ID cocok (misal perbedaan kode wilayah Kemendagri vs kode internal vendor seperti `village_xxxx`).
     - Verifikasi struktur respons sukses, respons HTTP `4xx`/`5xx`, batas rate-limit, dan skenario timeout.
   - Jika pengujian real tidak dapat dijalankan di lingkungan lokal (karena tidak ada kredensial/akses jaringan), **wajib catat eksplisit di bagian `Belum terverifikasi`** pada laporan agar diuji pada *Post-Deploy Live Smoke Check*.
2. **Sanity Check Anomali Data Produksi (`COUNT(*)`):**
   - Sebelum migrasi destruktif (drop tabel/kolom): wajib jalankan `SELECT COUNT(*)` di lingkungan target untuk memastikan tabel/kolom benar-benar kosong (`0 rows`) atau sudah dimigrasikan, dan minta izin eksplisit user.
   - Sebelum & sesudah deploy perubahan aturan visibilitas/filter bisnis: jalankan query `SELECT COUNT(*)` untuk mendeteksi data eksisting yang terjebak kombinasi flag lama yang tidak valid (contoh: item `online_only` yang masih terkunci flag `is_custom = 1`).
