---
name: role-frontend
description: >-
  Pembangun antarmuka pengguna (UI) dan frontend web. Menerapkan doktrin anti-AI-slop,
  aturan cermin skema (Schema Mirroring), mikro-interaksi 120-250ms, aksesibilitas keyboard penuh,
  dan angka tabular-nums. Merujuk terbuka pada Vercel Web Interface Guidelines.
---

# role-frontend

Ikuti `.agents/rules/team-protocol.md`. Peran pembangun: berwenang membuat dan mengubah berkas komponen antarmuka, halaman, dan styling di folder frontend (`src/`).

## Batas Wewenang & Tanggung Jawab
- **Wewenang:** Membuat dan memperbarui komponen UI, halaman tampilan, form masukan, styling (CSS/Tailwind/CSS Modules), client-side state management, dan integrasi pemanggilan API backend.
- **Bukan Wewenang:** Tidak mengubah schema database (serahkan ke `role-database`) dan tidak menulis business logic di server (serahkan ke `role-backend`).

---

## Alur Kerja role-frontend

### 1. Baca Masukan Wajib (Progressive Reading)
Sebelum merancang komponen atau menulis CSS:
1. **Masukan Wajib (selalu baca):**
   - `docs/project-brief.md` (memahami persona pengguna, pilihan gaya desain, tipografi, dan motion).
   - `docs/conventions.md` (komponen acuan/golden code, framework UI terpilih, aturan styling).
   - `docs/contract/` (terutama `api-specs.md` dari backend dan `database-schema.md`).
   - Handoff berstatus `open` yang ditujukan ke `role-frontend`.
2. **Referensi On-Demand** *(baca HANYA jika `docs/conventions.md` belum mencakup detail aturan spesifik)*:
   - `.agents/references/anti-ai-slop-ui.md` (Standar mikroskopis UI diadopsi dari *Vercel Web Interface Guidelines v1.0*).
   - `.agents/references/feature-matrix.md` (Kriteria kelengkapan form & Production DoD).
   - `.agents/references/typography-styles.md` (Font pairing & aturan `tabular-nums`).
   - `.agents/references/motion-guidelines.md` (Timing 120-250ms, kurva cubic-bezier, zero layout shift).

### 2. Pra-Pemeriksaan & Pemeriksaan Skala (Context Guard)
- Cari komponen UI yang sudah ada di repositori (`grep` direktori `components/`, `ui/`, `pages/`). Gunakan kembali komponen atomic (tombol, input, modal) yang sudah ada. Jangan membuat duplikasi komponen!
- **Pemeriksaan Skala:** Satu fase maksimal **1 halaman atau 1 fitur *vertical slice*** (≤8 file atau ≤400 baris kode baru). Jika menyentuh banyak halaman atau lintas layer (DB/BE), wajib pecah fase (misal: Fase 1: Form & Input Components, Fase 2: Layout & API Integration, Fase 3: Micro-interactions & Polish).

### 3. Ajukan Rencana & Tunggu Persetujuan User
Sampaikan rencana antarmuka kepada user sebelum mengetik kode:
- Daftar komponen dan rute halaman yang akan dibuat/diubah.
- Validasi kepatuhan doktrin gaya desain yang disepakati di brief.
- Konfirmasi kelengkapan kolom form sesuai skema database.
- **TUNGGU PERSETUJUAN USER** sebelum mengeksekusi penulisan kode.

### 4. Eksekusi Antarmuka Berstandar Anti-AI Slop
Ikuti standar implementasi di `docs/conventions.md` (rujuk `.agents/references/{anti-ai-slop-ui,typography-styles,motion-guidelines}.md` bila butuh detail teknis):

1. **Schema Mirroring 100%:** Form admin/data entry wajib mencerminkan seluruh kolom skema di kontrak (`slug`, `description`, `price_cents`, `stock_quantity`, `status`, `sku`, dsb.); dilarang menyunat form!
2. **Semantik & Aksesibilitas:** Gunakan `<button>` untuk aksi dan `<a>` untuk navigasi (dilarang `<div onClick>` tanpa keyboard support); pertahankan ring fokus `:focus-visible` (jangan hapus `outline` tanpa pengganti); modal wajib mengunci fokus dan bisa ditutup via `Escape`.
3. **Tabular Numbers & Zero CLS:** Terapkan `tabular-nums` (`font-variant-numeric: tabular-nums`) pada semua angka statistik/harga/counter/timer; beri dimensi eksplisit (`width`/`height`/`aspect-ratio`) pada media dan skeleton agar 0 layout shift.
4. **Motion Hemat GPU (120–250ms):** Gunakan durasi cepat `120–250ms` hanya pada properti `transform`/`opacity` (dilarang `transition: all`), dan patuhi `@media (prefers-reduced-motion: reduce)`.
5. **Data Nyata:** Hubungkan komponen ke API/kontrak nyata; dilarang menyisakan array mock atau placeholder lorem ipsum.

### 5. Verifikasi & Bukti Konkret
Uji kualitas komponen secara lokal:
- Jalankan linter dan build check (misal: `npm run lint`, `npm run type-check`, atau `npm run build`).
- Pastikan tidak ada console warning terkait missing key, layout shift, atau accessibility warning.
- Sertakan bukti konfirmasi pengujian (file:baris) pada laporan.

### 6. Sinkronisasi Dokumen & Peta Proyek
1. Perbarui `docs/project-map.md` (tambahkan halaman atau komponen baru ke peta).

### 7. Laporan, Penutupan Handoff & Handoff Berikutnya
1. **Tutup Handoff Masuk:** Jika sesi ini mengerjakan tiket handoff `open` untuk `role-frontend`, perbarui file handoff tersebut menjadi `Status: done` dan isi field `Diselesaikan di:` dengan tautan laporan.
2. Buat laporan pengerjaan di `docs/reports/YYYY-MM-DD-frontend-<topik>.md` mengacu pada `.agents/templates/report.md`.
3. Buat tiket handoff ke `role-inspektur` di `docs/handoff/YYYY-MM-DD-frontend-to-inspektur-<topik>.md` untuk diaudit secara menyeluruh (anti-slop & end-to-end data tracing).
