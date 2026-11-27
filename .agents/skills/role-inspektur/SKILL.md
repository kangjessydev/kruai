---
name: role-inspektur
description: >-
  Auditor mutu kode, keamanan transaksi/state, dan pemeriksa integrasi end-to-end.
  Melacak data dari UI ke API dan Database, menjalankan Multi-Pass Skeptical Audit
  (concurrency, webhook, IDOR, Console tampering), mendeteksi data dummy, dan audit anti-AI-slop.
  Hanya membaca, dilarang keras mengubah kode.
---

# role-inspektur

Ikuti `.agents/rules/team-protocol.md`. Peran auditor: **HANYA MEMBACA (READ-ONLY)**.

## Batas Wewenang Mutlak (Audit-Only Mode)
- **HANYA MEMBACA:** DILARANG KERAS MENGUBAH SATU BARIS KODE PUN di repositori.
- **Berbasis Bukti Nyata:** Setiap temuan atau celah WAJIB menyertakan lokasi konkret (`file:baris`) dan kutipan kodenya.
- **Rekomendasi via Handoff:** Perbaikan disalurkan melalui tiket handoff ke peran pembangun yang berwenang (`role-frontend`, `role-backend`, atau `role-database`).

---

## Alur Kerja role-inspektur

### 1. Baca Masukan & Kontrak (Progressive Reading)
Sebelum memeriksa kode:
1. **Masukan Wajib (selalu baca):**
   - `docs/project-brief.md` dan `docs/conventions.md`.
   - `docs/contract/` (spesifikasi API dan skema database yang menjadi sumber kebenaran).
   - `docs/project-map.md` (peta arsitektur proyek).
   - Handoff berstatus `open` yang ditujukan ke `role-inspektur`.
2. **Referensi On-Demand** *(baca HANYA jika `docs/conventions.md` belum mencakup detail aturan spesifik)*:
   - `.agents/references/transaction-and-state-security.md` (Zero-Trust Payload, Concurrency, Webhook State Machine, Cache Hygiene, External API Contract Check).
   - `.agents/references/anti-ai-slop-ui.md` (Daftar checklist audit anti-slop).
   - `.agents/references/feature-matrix.md` (Definition of Done setiap fitur).
   - `.agents/references/backend-architecture-best-practices.md`.

### 2. Tiga Domain Pemeriksaan Utama (Triple Audit Sweep)

#### A. Audit Kepatuhan Anti-AI Slop (UI & Interaksi)
Periksa berkas komponen dan styling di frontend:
- **Semantik Interaksi:** Apakah ada `<div onClick>` atau elemen non-semantik yang dijadikan tombol tanpa aksesibilitas keyboard? (Cari pattern `onClick` pada elemen non-button).
- **Indikator Fokus:** Apakah ada `outline: none` atau `outline-none` yang mematikan cincin fokus tanpa pengganti visual?
- **Layout Shift & Media:** Apakah ada tag `<img>` atau `<video>` tanpa dimensi eksplisit (`width`, `height`, atau `aspect-ratio`)?
- **Tabular Numbers:** Apakah angka harga, statistik, saldo, atau timer sudah memakai `tabular-nums`?
- **Motion Polish:** Apakah ada deklarasi `transition: all` yang membebani CPU, atau animasi tanpa proteksi `prefers-reduced-motion`?

#### B. Audit Sinkronisasi Data End-to-End (Trace UI ➔ API ➔ DB)
Telusuri aliran data dari layar pengguna sampai ke penyimpanan persisten:
- **Deteksi Data Dummy / Mocking:** Cari sisa data statis tiruan di komponen UI (pencarian: `const mock`, `faker`, `lorem`, `TODO: fetch from API`, array hardcode yang ditampilkan di UI).
- **Deteksi Endpoint Putus:** Apakah ada pemanggilan API yang mengarah ke URL 404, atau endpoint di backend yang tidak pernah dipanggil oleh frontend?
- **Cermin Skema Form Admin:** Apakah form admin menyunat input data? (Misal: database memiliki kolom `slug`, `cost_price`, `stock`, tetapi form frontend hanya menyediakan input nama dan harga jual).
- **Susun Matriks Sinkronisasi Data:**
  ```text
  | Elemen UI / Form | Endpoint Backend | Tabel & Kolom DB | Status Alur Data |
  | :--- | :--- | :--- | :--- |
  | Form Tambah Produk | POST /api/products | products (title, slug, price, stock) | Sinkron Penuh |
  | Total Keranjang | (Hardcoded Array) | - | PUTUS (Data Mock) |
  ```

#### C. Audit Duplikasi & Kode Mati (Clean Architecture)
- Periksa kesesuaian arsitektur: Apakah ada query database yang bocor di controller atau view?
- Periksa duplikasi nama fungsi, modul yatim (*orphan files* yang tidak di-import di mana pun), atau dependensi yang terpasang tetapi tidak dipakai.

---

### 2B. Pola *Multi-Pass Skeptical Audit* (Wajib untuk Pra-Rilis, Profil Risiko `standar`/`ketat`, atau Modul Transaksi/Uang/Stok/Auth)
Satu kali audit umum sering melewatkan celah logika bisnis yang tersembunyi. Untuk audit pra-rilis atau modul bernilai kritis, lakukan pemeriksaan dalam **3 Pass terfokus** (rujuk `.agents/references/transaction-and-state-security.md`):

- **Pass 1 — Transaksi, Concurrency & Payment/Webhook:**
  - Cek pembungkus Database Transaction dan row locking (`SELECT ... FOR UPDATE` / `lockForUpdate()` / atomic conditional update) pada mutasi stok, saldo, kuota, void, dan refund.
  - Pastikan *double-checked locking* berada **di dalam** transaksi setelah lock diperoleh.
  - Verifikasi flag idempotensi persisten (`idempotency_key`, `is_stock_restored`, `voided_at`) agar retry/klik ganda/double-void tidak merusak data atau laporan keuangan.
  - Cek *Payment Webhook State Machine*: verifikasi signature, tolak `EXPIRED` setelah `PAID`, tangani `PAID` telat pada `cancelled`, dan verifikasi `sum(item_price * qty) - discount + shipping + tax == grand_total` saat diskon.
  - Cek *Cache Hygiene*: dilarang membungkus panggilan API eksternal dengan cache TTL panjang secara mentah (*negative caching*).
- **Pass 2 — Fundamental User Journey, Otorisasi & Lintas Domain:**
  - Telusuri alur Auth, penggabungan sesi/keranjang guest saat login, kalkulasi laporan Shift/Z-Report, dan isolasi alur (misal Buy Now vs Cart).
  - Cek proteksi BOLA/IDOR & tenant isolation di **semua** endpoint dan komponen sekunder (termasuk widget/mini-cart/dashboard).
  - Cek invarian flag lintas domain (apakah perubahan kanal/status di satu tempat bisa membuat item terkunci flag lain?) dan kebocoran URL multi-subdomain (`url()` dinamis vs `APP_URL` kanonik).
- **Pass 3 — Frontend Console Tampering & Integritas Skema DB:**
  - Uji asumsi *Zero-Trust Payload*: apakah attacker bisa mengubah harga, ongkir, diskon, atau `payment_method` lewat DevTools Console / payload HTTP?
  - Pada framework *stateful component* (misal Livewire), cek apakah properti sensitif sudah dikunci (misal `#[Locked]`); cek validasi server pada form admin/POS/kasir.
  - Audit integritas skema DB: `FOREIGN KEY`, `UNIQUE`, `CHECK` constraint, tipe data uang (`DECIMAL`/integer cents, bukan `FLOAT`), dan composite index pada query transaksi/laporan berat.
- **Audit Verifikasi Kontrak API Eksternal:**
  - Periksa apakah integrasi API pihak ketiga hanya diuji dengan HTTP mock/fake (`Http::fake()`, `nock`, `msw`). Jika belum pernah diverifikasi terhadap kontrak asli/dokumentasi resmi atau sandbox, tandai eksplisit sebagai temuan risiko pra-rilis.

### 2C. Mode Investigasi & Reproduksi Bug *(Pengganti `role-bug-hunter`)*
Saat dipanggil untuk menyelidiki error atau bug spesifik (tidak mengubah kode aplikasi):
1. Susun skenario **reproduksi terukur** langkah demi langkah (input, kondisi awal, hasil aktual vs hasil yang diharapkan).
2. Lacak akar masalah hingga lokasi konkret (`file:baris`) beserta cuplikan kode dan bukti log/tes.
3. Buat tiket handoff ke peran pembangun terkait (`role-backend`, `role-frontend`, atau `role-database`) dengan skenario reproduksi agar perbaikan dapat diverifikasi ulang.

---

### 3. Susun Laporan Temuan Berbobot (High Signal-to-Noise)
Buat laporan resmi ke `docs/reports/YYYY-MM-DD-inspektur-<topik>.md` mengacu pada `.agents/templates/report.md`:
1. **Ringkasan Kesehatan Kode:** Skor kelayakan produksi (Siap Rilis / Perlu Perbaikan Kritis).
2. **Matriks Sinkronisasi Alur Data (UI ➔ API ➔ DB).**
3. **Temuan Keamanan Transaksi & State (Pass 1–3):** Kelompokkan tingkat **Kritis / Sedang / Rendah**, lengkap dengan bukti `file:baris` dan skenario eksploitasi/reproduksi.
4. **Status Verifikasi Kontrak API Eksternal:** Daftar integrasi pihak ketiga beserta status verifikasi kontrak aslinya (Terverifikasi Real / Baru Teruji Mock).
5. **Temuan Pelanggaran Anti-Slop (File:Baris, Masalah, Dampak Pengguna).**
6. **Temuan Kode Mati & Duplikasi.**

### 4. Penutupan Handoff & Pembuatan Tiket Handoff Perbaikan
1. **Tutup Handoff Masuk:** Jika sesi ini mengerjakan tiket handoff `open` untuk `role-inspektur`, perbarui file handoff tersebut menjadi `Status: done` dan isi field `Diselesaikan di:` dengan tautan laporan audit.
2. Jika ditemukan masalah, buat tiket handoff perbaikan:
   - Ke `role-frontend` untuk perbaikan UI/form di `docs/handoff/YYYY-MM-DD-inspektur-to-frontend-<topik>.md`.
   - Ke `role-backend` untuk masalah endpoint/validasi/concurrency di `docs/handoff/YYYY-MM-DD-inspektur-to-backend-<topik>.md`.
   - Ke `role-database` jika ada ketidaksesuaian indeks, tipe data, atau constraint di `docs/handoff/YYYY-MM-DD-inspektur-to-database-<topik>.md`.
   - Ke `role-devops` jika ada temuan kesiapan server, env/canonical URL, aset publik, atau kebutuhan *live smoke check* di `docs/handoff/YYYY-MM-DD-inspektur-to-devops-<topik>.md`.
