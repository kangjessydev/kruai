# Catatan Perubahan (Changelog) KruAI 📜

Semua perubahan penting pada proyek **KruAI** dicatat secara kronologis dalam berkas ini.  
Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan menganut [Semantic Versioning](https://semver.org/).

> [!IMPORTANT]
> **Aturan Jejak Penghapusan (Anti-Regresi AI):**  
> Jika suatu fitur, file, atau konsep dihapus/ditiadakan, bagian **Dihapus & Alasan** WAJIB menyertakan konteks dan alasannya. AI/Agen di masa depan **DILARANG KERAS** menambahkan kembali apa yang sudah sengaja dihapus tanpa izin eksplisit dari User.

---

## [Unreleased] - Persiapan Rilis v0.2.0

### Ditambahkan (Added)
- **Peran Pembangun Inti & Auditor (Core Builders & Inspector Skills):**
  - `.agents/skills/role-database/SKILL.md`: Arsitek skema DDL, migrasi idempoten, relasi foreign key, indexing performa, RLS, protokol *zero data loss*, dan sinkronisasi kontrak skema.
  - `.agents/skills/role-backend/SKILL.md`: Pembangun logika bisnis 4-lapis (Controller, Service, Repository, Schema), Vertical Slice, mitigasi *race condition & idempotency*, pencegahan N+1 query, dan *live registry ping*.
  - `.agents/skills/role-frontend/SKILL.md`: Pembangun antarmuka anti-slop, aturan *Schema Mirroring* (form admin 100% cermin DB), mikro-interaksi 120–250ms, aksesibilitas keyboard, dan angka `tabular-nums`.
  - `.agents/skills/role-inspektur/SKILL.md`: Auditor mutu murni (*read-only*): melacak aliran data UI ➔ API ➔ DB, deteksi data dummy/mocking tersembunyi, dan audit kepatuhan anti-slop.

- **Paket NPM CLI Scaffolder (`kruai`):**
  - `package.json`: Konfigurasi paket npm publik untuk executable CLI `kruai`.
  - `bin/kruai.js`: Skrip CLI *zero-dependency* Node.js untuk mengeksekusi `npx kruai init` (scaffolding otomatis `.agents/` dan template `docs/` ke proyek tujuan) dan `npx kruai doctor` (pemeriksaan kelengkapan sistem tim peran).

### Diubah (Changed)
- **`README.md`:** Menambahkan panduan instalasi cepat `npx kruai init` dan `npx kruai doctor`, memperbarui tabel roster peran aktif, dan menandai Fase 2 roadmap selesai.
- **`.agents/roster.md`:** Memperbarui status `role-frontend`, `role-backend`, `role-database`, dan `role-inspektur` dari 📝 (direncanakan) menjadi ✅ (aktif).
- **`.agents/rules/team-protocol.md`:** Menambahkan pasal *Disiplin Jejak Perubahan & Anti-Regresi (CHANGELOG Discipline)* untuk mewajibkan pencatatan perubahan dan mencegah amnesia AI.

### Rencana Selanjutnya
- Publikasi paket `kruai` ke NPM Registry (`npm publish`).
- Eksplorasi Fase 3: Server Model Context Protocol (MCP) untuk memori terpusat.

---

## [0.1.0] - 2026-10-27

### Ditambahkan (Added)
- **Penamaan Resmi Proyek:** Diresmikan nama **`KruAI`** (*The Production-Grade Engineering Crew for Vibe Coders*).
- **README Utama (`README.md`):** Dokumentasi visi, perbandingan masalah AI vs solusi KruAI, diagram alur, dan roadmap.
- **Standar & Doktrin Desain Anti-Slop:**
  - `.agents/references/anti-ai-slop-ui.md`: Standar mikroskopis UI (keyboard navigation, zero layout shift, visual density, feedback interaksi) diadopsi terbuka dari *Vercel Web Interface Guidelines v1.0*.
  - `.agents/references/design-styles.md`: Katalog gaya visual independen (Minimalist Clean, Luxury, Dark Studio, Neo-Brutalism, Earthy).
  - `.agents/references/asset-types.md`: Panduan aset visual (Fotografi, 3D Spline, 2D Vector, Generative AI).
  - `.agents/references/typography-styles.md`: Aturan tipografi, font pairing, dan kewajiban `tabular-nums` untuk angka/harga.
  - `.agents/references/motion-guidelines.md`: Durasi mikro-animasi (120–250ms), kurva `cubic-bezier`, dan `prefers-reduced-motion`.
- **Standar Rekayasa & Arsitektur Backend:**
  - `.agents/references/backend-architecture-best-practices.md`: Pemisahan 4 lapis (Controller, Service, Repository, Schema), Vertical Slice, mitigasi race condition/idempotency, dan database query optimization (Supabase & Postgres best practices).
- **Matriks Fitur & Definition of Done:**
  - `.agents/references/feature-matrix.md`: Pemilahan ketat antara **Fitur Fundamental** (Pondasi Wajib) vs **Fitur Lanjutan** (Ekstensi) untuk Autentikasi, Katalog, Checkout/Keranjang, dan Studio Media.
- **Arketipe Website (`.agents/references/website-archetypes.md`):** 7 jenis arketipe website umum beserta blindspot teknis vibe coder.
- **Sintesis Konvensi (`.agents/templates/conventions.md`):** Cetak biru konvensi stack spesifik untuk dikonsumsi peran pembangun tanpa perlu membaca ratusan file referensi.
- **Dokumen Rekaman Memori & Arsitektur:**
  - `.agents/docs/role-architecture.md`: Dokumen arsitektur teknis sistem tim peran.
  - `.agents/docs/discussion-records.md`: Arsip keputusan diskusi dan Architecture Decision Records (ADR).

### Diubah (Changed)
- **`.agents/rules/team-protocol.md`:**
  - Menambahkan **Aturan Cermin Skema (Schema Mirroring Rule)**: Form admin dilarang disunat menjadi sekadar input nama/harga; wajib mencerminkan 100% kolom database.
  - Menambahkan **Aturan Keterbukaan Sumber (Open Attribution Rule)**: Dilarang mengklaim standar pihak ketiga sebagai buatan internal; wajib menyebutkan nama sumber dan versi secara transparan.
  - Menambahkan **Verifikasi Versi Real-Time (Live Registry Ping)**: Dilarang menebak versi stack dari memori training; wajib cek registry resmi (`npm view`, `curl pypi`, dll.).
  - Menambahkan **Mode Audit Saja (Audit-Only Mode)**: Peran auditor dilarang keras mengubah kode saat dipanggil dengan kata kunci "audit".
  - Menambahkan **Context Window Guard & Phase-Gating**: Tugas >3 file atau >200 baris kode wajib dipecah menjadi fase-fase terpisah.
- **`.agents/skills/role-asisten/SKILL.md`:** Diperbarui menjadi gerbang utama non-invasif: melakukan wawancara multi-dimensi (desain, aset, tipografi), memilah fitur fundamental vs lanjutan, dan melakukan audit rekonsiliasi folder `.agents/` eksisting tanpa merusak skill kustom pengguna.
- **`.agents/roster.md` & `.agents/planned-roles.md`:** Standardisasi awalan `role-` untuk seluruh peran agar terkelompok rapi di menu slash IDE.
- **Repository Remote:** Remote Git diperbarui dari `kangjessydev/diskusi-ai` menjadi `kangjessydev/kruai`.

### Dihapus & Alasan (Removed & Rationale)
- **`tanya.md` (DIHAPUS):**
  - *Alasan Penghapusan:* Awalnya dibuat sebagai scratch file sementara untuk draft pertanyaan user. User dan arsitek menyepakati bahwa proses penggalian kebutuhan wajib dilakukan langsung secara interaktif oleh `role-asisten` di jendela chat dan disintesis ke `docs/project-brief.md`, bukan lewat file `tanya.md` yang membuat root repository berantakan.
  - *Instruksi Anti-Regresi:* **JANGAN membuat kembali file `tanya.md` di root repo.** Pertanyaan alur proyek ditangani oleh `role-asisten`.

---

[Unreleased]: https://github.com/kangjessydev/kruai/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/kangjessydev/kruai/releases/tag/v0.1.0
