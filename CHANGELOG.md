# Catatan Perubahan (Changelog) KruAI 📜

Semua perubahan penting pada proyek **KruAI** dicatat secara kronologis dalam berkas ini.  
Format penulisan mengacu pada [Keep a Changelog](https://keepachangelog.com/id/1.1.0/) dan menganut [Semantic Versioning](https://semver.org/).

> [!IMPORTANT]
> **Aturan Jejak Penghapusan (Anti-Regresi AI):**  
> Jika suatu fitur, file, atau konsep dihapus/ditiadakan, bagian **Dihapus & Alasan** WAJIB menyertakan konteks dan alasannya. AI/Agen di masa depan **DILARANG KERAS** menambahkan kembali apa yang sudah sengaja dihapus tanpa izin eksplisit dari User.

---

## [Unreleased]

### Ditambahkan (Added)
- **Jalur Uji Coba Proyek Animasi Video (`v1 Beta`):**
  - `.agents/references/video-animation-v1-beta.md`: Referensi *on-demand* (0 beban token pada proyek web) berisi *Domain Lock Beta*, 5 paket iklan produk fisik siap pilih, matriks 5 stack video + ***Stack Disclosure Gate***, arsitektur multi-scene frame lokal `0`, 6 aturan wajib *Anti-AI-Slop* `1080 × 1920`, Audit 2 Lapis (*Contact Sheet*), dan alur 6 peran video beta (`role-asisten`, `role-director`, `role-animator`, `role-inspektur`, `role-producer`, `role-onboard`).
  - `tests/kruai.test.js`: Menambahkan test otomatis untuk kelengkapan referensi `video-animation-v1-beta.md`, routing `/role-asisten video`, dan dokumentasi `v1 Beta` di `README.md`.

### Diubah (Changed)
- **`.agents/skills/role-asisten/SKILL.md`:** Menambahkan routing cepat `/role-asisten video` (dan `/role-asisten animasi`), *Domain Lock Beta*, serta seksi panduan alur `Jalur Proyek Animasi Video (/role-asisten video — v1 Beta)` yang otomatis melewati wawancara website.
- **`.agents/roster.md`:** Menambahkan tautan ke [references/video-animation-v1-beta.md](./references/video-animation-v1-beta.md).
- **`README.md`:** Menambahkan cara memanggil `/role-asisten video` langsung ke jalur animasi video (bukan web), seksi khusus **Proyek Animasi Video (v1 Beta — Eksperimental)**, tautan perpustakaan referensi baru, serta roadmap menuju `Core + Exclusive Profile Pack (v0.3.0)`.

---

## [0.2.1] - 2026-11-27

### Ditambahkan (Added)
- **Smart Update (`--dry-run`, `--force`, `.agents/.kruai-meta.json`, & `/role-asisten update`):**
  - `bin/kruai.js`: Pelacakan hash SHA-256 berkas bawaan di `.agents/.kruai-meta.json` untuk membedakan berkas standar vs berkas yang dimodifikasi lokal oleh proyek; mendukung `update --dry-run` (pratinjau tanpa menulis ke disk), proteksi otomatis `KONFLIK LOKAL` (termasuk proyek legacy tanpa metadata), dan `--force` untuk menimpa paksa.
  - `.agents/skills/role-asisten/SKILL.md`: Menambahkan alur **`/role-asisten update`** untuk menjalankan *dry-run*, mengaudit bentrokan aturan baru terhadap `docs/decisions.md` (ADR), `docs/conventions.md`, dan handoff `open`, lalu meminta konfirmasi resolusi user sebelum rekonsiliasi.
  - `tests/kruai.test.js`: Menambahkan suite uji otomatis untuk `.kruai-meta.json`, `--dry-run`, proteksi konflik lokal, `--force`, auto-update berkas tak termodifikasi, proyek legacy tanpa metadata, dan verifikasi alur `/role-asisten update`.

### Diubah (Changed)
- **`README.md`:** Menambahkan sub-seksi panduan **Smart Update** (`update --dry-run`, `update`, `--force`, `.kruai-meta.json`, dan `/role-asisten update`).

---

## [0.2.0] - 2026-11-27

### Ditambahkan (Added)
- **Peran Pembangun Inti & Auditor (Core Builders & Inspector Skills):**
  - `.agents/skills/role-database/SKILL.md`: Arsitek skema DDL, migrasi idempoten, relasi foreign key, indexing performa, RLS, protokol *zero data loss*, dan sinkronisasi kontrak skema.
  - `.agents/skills/role-backend/SKILL.md`: Pembangun logika bisnis 4-lapis (Controller, Service, Repository, Schema), Vertical Slice, mitigasi *race condition & idempotency*, pencegahan N+1 query, dan *live registry ping*.
  - `.agents/skills/role-frontend/SKILL.md`: Pembangun antarmuka anti-slop, aturan *Schema Mirroring* (form admin 100% cermin DB), mikro-interaksi 120–250ms, aksesibilitas keyboard, dan angka `tabular-nums`.
  - `.agents/skills/role-inspektur/SKILL.md`: Auditor mutu murni (*read-only*): melacak aliran data UI ➔ API ➔ DB, deteksi data dummy/mocking tersembunyi, dan audit kepatuhan anti-slop.
  - `.agents/skills/role-copywriter/SKILL.md`: Penulis teks produk, microcopy antarmuka, headline penjualan, dan pembasmi klise AI (*AI text slop*) dengan 6 opsi kerangka acuan.
  - `.agents/skills/role-blueprint/SKILL.md`: Arsitek kontrak proyek yang menyusun dan mengunci skema database (`docs/contract/database-schema.md`) dan spesifikasi API (`docs/contract/api-specs.md`) secara *read-only* sebelum kode ditulis.
  - `.agents/skills/role-devops/SKILL.md`: Peran rilis & operasional produksi *stack-agnostic* dengan alur 4 fase (*Local Release Gate & Read-Only Server Audit* ➔ *Release Tag* ➔ *Backup & Deploy Terkendali + Post-Deploy Live Smoke Check* ➔ *Rollback Plan & Security Lock*), termasuk *Server File Ownership Guard*, *Pre-Migration Row-Count Guard*, dan *IP/Secret Redaction Rule*.
- **Standar Keamanan Transaksi, Concurrency & Integritas State:**
  - `.agents/references/transaction-and-state-security.md`: Referensi produksi baru (*Zero-Trust Payload & Console Tampering*, *ACID Row Locking & Idempotency*, *Payment Webhook State Machine*, *Canonical URL & Anti-Negative Caching*, serta *External API Contract Check & Production Data Sanity `COUNT(*)`*).
- **Standar & Kerangka Copywriting Antarmuka:**
  - `.agents/references/copywriting-frameworks.md`: Standar penulisan manusiawi merujuk terbuka pada 5 kerangka komunitas (`marketingskills`, `ux-writing-skill`, `ux-microcopy-audit`, `design-system-tone`, `tech-docs`) serta Opsi 6 Sintesis Mandiri berprotokol deklarasi kejujuran (*confidence & blindspot declaration*).
- **3 Mode Kerja Resmi & Siklus Penutupan Handoff:**
  - `.agents/rules/team-protocol.md` & `.agents/skills/role-asisten/SKILL.md`: Memisahkan alur kerja menjadi **Mode Greenfield** (Proyek Baru), **Mode Brownfield / Stabilisasi** (Proyek Lanjutan), dan **Mode Fast-Track Hotfix** (≤2 file dengan 3 pagar besi).
  - Penambahan protokol penutupan siklus handoff (`Status: open` → `Status: done` + field `Diselesaikan di:`) pada seluruh peran dan `.agents/templates/handoff.md`.
- **Pola Generik Lintas Domain (`feature-matrix.md`):**
  - `.agents/references/feature-matrix.md`: Menambahkan **Seksi 0 (Pola Generik Lintas Domain)** mencakup pola *Generic CRUD Admin*, *Dashboard & Reporting*, dan *File Upload & Media Handling* (Fundamental vs Lanjutan).
- **Panduan Orchestrator, Starter Lifecycle Hooks & Test Suite:**
  - `.agents/references/orchestrator-and-hooks-guide.md`: Panduan memilih model `Orchestrator (Neon/Argon)` vs `Hydrogen` untuk peran KruAI serta tata cara penggunaan `.agents/hooks.json`.
  - `.agents/templates/hooks.json`: Starter hooks non-aktif default (`"enabled": false`) untuk *destructive command guard* (`PreToolUse`) dan placeholder *post-edit lint* (`PostToolUse`).
  - `tests/kruai.test.js`: Automated test suite *zero-dependency* berbasis `node:test` yang menguji CLI (`init`, `update`, `doctor`, `--ide`, `--with-hooks`, guard `src === dest`), validitas frontmatter YAML seluruh skill, integritas tautan/status `roster.md`, validitas template `hooks.json`, dan cek anti-regresi.

- **Paket NPM CLI Scaffolder (`kruai`):**
  - `package.json`: Konfigurasi paket npm publik untuk executable CLI `kruai` dan test script `node --test tests/*.test.js`.
  - `bin/kruai.js`: Skrip CLI *zero-dependency* Node.js untuk mengeksekusi `npx kruai init`, `npx kruai update` (pembaruan non-destruktif tanpa menimpa `docs/`, `hooks.json`, `Custom Project Tools`, maupun bridge IDE kustom), dan `npx kruai doctor`, dilengkapi dukungan multi-IDE lewat flag `--ide <antigravity|cursor|copilot|all>` (generator `AGENTS.md`, `.cursor/rules/kruai-protocol.mdc`, `.github/copilot-instructions.md` ber-marker `<!-- KRUAI:MANAGED -->`), flag `--with-hooks`, pengecualian folder internal `.agents/docs/`, serta guard `src === dest`.

### Diubah (Changed)
- **`bin/kruai.js`:** Menyelaraskan pembuatan starter `docs/glossary.md` ke format tabel 4 kolom sesuai `.agents/templates/glossary.md`, mengecualikan `.agents/docs/` dari penyalinan `init`/`update`, menambahkan pengecekan `role-blueprint`, `role-devops`, `transaction-and-state-security.md`, dan `orchestrator-and-hooks-guide.md` pada `doctor` (`17` komponen), menambahkan `update`, `--ide`, `--with-hooks`, serta mengembalikan exit code `1` jika `doctor` gagal atau perintah/opsi tidak dikenali.
- **`README.md`:** Menambahkan panduan instalasi langsung tanpa clone (`npx github:kangjessydev/kruai init`), opsi `--ide cursor|copilot|all`, `--with-hooks`, dan `update`, seksi cara berkontribusi via GitHub Issues, pembaruan diagram Fase 1 (3 mode kerja + `role-blueprint` aktif), pengaktifan `role-copywriter`, `role-blueprint`, dan `role-devops`, perampingan `/role-motion`, penambahan referensi `transaction-and-state-security.md` & `orchestrator-and-hooks-guide.md`, penyeragaman durasi motion (`120-250ms`), serta penyelarasan *Context Window Guard* berbasis *vertical slice*.
- **`.agents/skills/role-asisten/SKILL.md`:** Menambahkan alur konfirmasi gaya bahasa dan copywriting (6 opsi), pemilihan 3 Mode Kerja Resmi (melebur alur proyek baru ke Mode Greenfield untuk menutup dead-end `/role-init`), memperbaiki duplikasi sub-poin `F.`, dan menyeragamkan nama file handoff menjadi `YYYY-MM-DD-asisten-to-<peran>-<topik>.md`.
- **`.agents/skills/role-backend/SKILL.md`:** Dirombak menjadi 100% *stack-agnostic* (menghapus istilah hardcoded JS/Node seperti `Zod`/`Vitest`/`src/`), mendukung pemisahan lapisan adaptif (*component-driven* & profil risiko), menambahkan aturan *Zero-Trust Payload*, webhook & *cache hygiene*, kalibrasi skala *vertical slice*, serta mewajibkan *External API Contract Check*.
- **`.agents/skills/role-inspektur/SKILL.md`:** Diperkuat dengan pola **Multi-Pass Skeptical Audit** (3 pass: Transaksi/Concurrency/Webhook, Fundamental Journey/IDOR/Subdomain, Console Tampering/Skema DB), audit status verifikasi kontrak API eksternal, serta **Mode Investigasi & Reproduksi Bug** (peleburan `role-bug-hunter`).
- **`.agents/skills/role-onboard/SKILL.md`:** Mewajibkan pembuatan `docs/conventions.md` saat onboarding proyek lanjutan serta penutupan handoff masuk (`open` → `done`).
- **`.agents/roster.md`:** Memperbarui status `role-frontend`, `role-backend`, `role-database`, `role-inspektur`, `role-copywriter`, `role-blueprint`, dan `role-devops` menjadi ✅ (aktif), merampingkan daftar menjadi 14 peran (menghapus `role-motion`, `role-bug-hunter`, `role-help`), menambahkan tautan `transaction-and-state-security.md`, `orchestrator-and-hooks-guide.md`, & `copywriting-frameworks.md`, menghapus tautan internal `.agents/docs/` agar tidak terjadi *broken link* di proyek target, serta memperjelas batas wewenang dan ringkasan tugas peran.
- **`.agents/rules/team-protocol.md`:** Menambahkan *Cakupan Aktivasi (Scope Guard)* agar obrolan umum di luar `/role-*` tidak dibebani birokrasi peran, mengkalibrasi *Context Window Guard* berbasis *vertical slice* / 1 layer (≤8 file / ≤400 baris; ≤3–5 file kritis untuk risiko `ketat`), merampingkan duplikasi *Kualitas kode & Standar Produksi*, menambahkan pasal *CHANGELOG Discipline*, menyelaraskan wewenang `role-copywriter`, menyeragamkan format & penutupan handoff, memperbarui contoh auditor *Audit-Only Mode*, serta menambahkan *3 Mode Kerja Resmi*.
- **`.agents/skills/role-{database,frontend}/SKILL.md` & `.agents/references/anti-ai-slop-ui.md`:** Menyelaraskan kalibrasi skala *vertical slice*, merampingkan duplikasi checklist UI di `role-frontend`, dan menegaskan simbol tipografi (`…`, `“` `”`) di `anti-ai-slop-ui.md` hanya untuk copy/teks UI pengguna (bukan kode/JSON).
- **`.agents/docs/{role-architecture,discussion-records}.md` & `.agents/planned-roles.md`:** Menyinkronkan status peran aktif (`role-blueprint`, `role-frontend`, `role-backend`, `role-database`, `role-copywriter`, `role-inspektur`, `role-devops`), menyeragamkan durasi motion ke `120-250ms`, serta mencatat peleburan `role-init`, `role-motion`, `role-bug-hunter`, `role-help`, dan kalibrasi *Context Window Guard*.
- **`.agents/skills/role-{copywriter,inspektur}/SKILL.md` & `.agents/templates/handoff.md`:** Memisahkan masukan wajib vs referensi *on-demand* agar selaras dengan prinsip *Progressive Reading*, menyelaraskan wewenang `role-copywriter`, serta mewajibkan penutupan status handoff masuk (`open` → `done`).

### Dihapus & Alasan (Removed & Rationale)
- **`role-init` (rencana peran di `.agents/roster.md` & `README.md`):**
  - *Alasan Penghapusan:* Menimbulkan *dead-end* bagi pengguna proyek baru karena berkas `SKILL.md`-nya belum ada, dan fungsinya tumpang tindih dengan wawancara kebutuhan milik `role-asisten`. Dilebur langsung menjadi **Mode Greenfield** di dalam `role-asisten` yang langsung menyiapkan dokumen awal proyek lalu mengarahkan ke `role-blueprint`.
  - *Instruksi Anti-Regresi:* **JANGAN membuat kembali peran terpisah `role-init`** tanpa izin eksplisit dari User.
- **`role-motion` (rencana peran di `.agents/roster.md`, `README.md` & `.agents/docs/role-architecture.md`):**
  - *Alasan Penghapusan:* Terlalu mikro untuk dijadikan peran terpisah; standar timing `120-250ms` dan kepatuhan GPU/reduced-motion sudah melekat langsung di checklist `role-frontend` dan `.agents/references/motion-guidelines.md`.
  - *Instruksi Anti-Regresi:* **JANGAN pisahkan kembali menjadi peran mandiri** kecuali proyek menuntut tim animasi khusus dan disetujui eksplisit oleh User.
- **`role-bug-hunter` (rencana peran di `.agents/roster.md` & `.agents/docs/role-architecture.md`):**
  - *Alasan Penghapusan:* Tugas investigasi dan reproduksi bug secara *read-only* selaras langsung dengan wewenang auditor `role-inspektur`, sehingga dilebur sebagai *Mode Investigasi & Reproduksi Bug* di dalam `role-inspektur`.
  - *Instruksi Anti-Regresi:* **JANGAN buat ulang sebagai peran terpisah** tanpa izin eksplisit dari User.
- **`role-help` (rencana peran di `.agents/roster.md` & `.agents/docs/role-architecture.md`):**
  - *Alasan Penghapusan:* Tidak memerlukan skill terpisah karena daftar peran sudah dapat diakses melalui `/role-asisten`, `.agents/roster.md`, dan CLI `kruai doctor`.
  - *Instruksi Anti-Regresi:* **JANGAN buat ulang sebagai peran terpisah** tanpa izin eksplisit dari User.

### Rencana Selanjutnya
- Uji coba nyata alur end-to-end KruAI di proyek riil.

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

[Unreleased]: https://github.com/kangjessydev/kruai/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/kangjessydev/kruai/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/kangjessydev/kruai/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/kangjessydev/kruai/releases/tag/v0.1.0
