# KruAI 🚀

> **The Production-Grade Engineering Crew for Vibe Coders.**  
> Bangun aplikasi nyata dengan AI tanpa AI-Slop, tanpa fast-working asal jadi, dan tanpa kehilangan konteks.

---

## 🌟 Apa itu KruAI?

**KruAI** adalah sistem tim peran (*role-based agent system*) yang dirancang khusus untuk **Vibe Coder**, solopreneur, dan kreator produk.

Ketika membangun aplikasi menggunakan AI, masalah klasik yang sering terjadi:
1. **AI Slop Visual:** Tampilan generic membosankan, tombol `<div onClick>` tanpa aksesibilitas keyboard, layout melompat (*CLS*), dan animasi CPU yang berat.
2. **Fast Working Asal Jadi:** Form admin disunat menjadi sekadar edit nama dan harga di tabel; logika bisnis ditumpuk langsung di controller.
3. **Lupa Konteks pada Skala Besar:** AI melupakan aturan dan merusak kode lama saat file proyek mulai membesar.
4. **Jebakan Fundamental Vibe Coder:** Lupa mitigasi *Race Condition*, lupa *Idempotency* transaksi, dan membiarkan query database mengalami *N+1*.

**KruAI hadir sebagai Kru Engineering & Design Senior pribadi Anda di dalam editor.** Setiap peran memiliki batas wewenang tegas, bekerja berdasarkan bukti konkret (`file:baris`), dan saling berkomunikasi secara aman melalui artefak tugas (*Handoffs*).

---

## ⚡ Instalasi Cepat (Untuk Vibe Coder)

Pasang seluruh tim peran dan standar rekayasa KruAI ke dalam proyek Anda **tanpa perlu git clone manual**, cukup dengan **satu baris perintah**:

```bash
npx github:kangjessydev/kruai init
```

Opsi tambahan saat instalasi atau pembaruan:
```bash
npx github:kangjessydev/kruai init --ide cursor         # Tambah AGENTS.md & .cursor/rules/
npx github:kangjessydev/kruai init --ide copilot        # Tambah AGENTS.md & .github/copilot-instructions.md
npx github:kangjessydev/kruai init --ide all --with-hooks  # Semua bridge IDE + starter .agents/hooks.json
npx github:kangjessydev/kruai update                    # Perbarui sistem KruAI tanpa menimpa kustomisasi user
```

Atau jika ingin memeriksa kelengkapan instalasi KruAI di proyek Anda kapan saja:
```bash
npx github:kangjessydev/kruai doctor
```

Setelah terpasang, buka proyek di **Google Antigravity IDE**, **Cursor**, atau **GitHub Copilot**, lalu panggil di chat:
```text
/role-asisten          # Proyek Website / Aplikasi (Default)
/role-asisten video    # Proyek Animasi Video — Iklan Produk Fisik (v1 Beta)
```

### 🔄 Memperbarui KruAI di Proyek yang Sedang Jalan (Smart Update)
Saat KruAI merilis versi baru, proyek yang sudah berjalan dapat diperbarui secara aman tanpa merusak kustomisasi lokal maupun keputusan arsitektur (`docs/decisions.md`):
```bash
npx github:kangjessydev/kruai update --dry-run   # Pratinjau file BARU, UPDATE, dan KONFLIK LOKAL
npx github:kangjessydev/kruai update             # Perbarui aman; file yang diubah lokal otomatis dipertahankan
npx github:kangjessydev/kruai update --force     # Paksa timpa file konflik dengan versi starter terbaru
```
KruAI menyimpan sidik jari SHA-256 berkas bawaan di `.agents/.kruai-meta.json`. Untuk pembaruan yang sadar konteks penuh terhadap `docs/decisions.md`, `docs/conventions.md`, dan handoff `open`, panggil **`/role-asisten update`** di chat AI agar konflik diaudit dan dikonfirmasi terlebih dahulu.

---

## 🧭 Cara Kerja Setiap Peran (Visual Workflow)

KruAI bekerja layaknya sebuah studio rekayasa perangkat lunak profesional dengan pemisahan tugas tegas agar AI tidak halusinasi atau merusak kode:

```text
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           FASE 1: PERENCANAAN                          │
  │                                                                        │
  │    [ 🚪 /role-asisten ] ──► Pilih Mode: Greenfield / Brownfield / Hotfix│
  │            │               (Proyek Baru: Desain, Fitur, conventions.md)│
  │            ▼               (Proyek Lanjutan: langsung ke target / audit)│
  │    [ 📐 /role-blueprint ] ─► Aktif: Kunci Kontrak Skema di docs/contract/│
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                         FASE 2: PEMBANGUNAN KODE                       │
  │                                                                        │
  │  [ 💾 /role-database ]                                                 │
  │  Buat DDL, relasi, migrasi idempoten, foreign key index, & RLS.        │
  │  Protokol Zero Data Loss. Update docs/contract/database-schema.md.     │
  │            │                                                           │
  │            ▼ (Handoff via docs/handoff/)                               │
  │  [ ⚙️ /role-backend ]                                                  │
  │  Stack-agnostic: arsitektur adaptif sesuai docs/conventions.md.        │
  │  Validasi zero-trust, row locking, webhook guard & live registry ping. │
  │            │                                                           │
  │            ▼ (Handoff via docs/handoff/)                               │
  │  ┌───────────────────────────────────┬───────────────────────────────┐ │
  │  │ [ 🎨 /role-frontend ]             │ [ ✍️ /role-copywriter ]       │ │
  │  │ Eksekusi UI Anti-AI Slop.         │ Tulis microcopy tombol aktif, │ │
  │  │ Form 100% cermin kolom database.  │ pesan error solutif, headline,│ │
  │  │ Micro-interactions 120-250ms.     │ & basmi klise AI (6 opsi).    │ │
  │  └───────────────────────────────────┴───────────────────────────────┘ │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                     FASE 3: PENJAMINAN MUTU (QA AUDIT)                 │
  │                                                                        │
  │    [ 🔍 /role-inspektur ] (Audit Murni - Dilarang Ubah Kode)           │
  │    1. Multi-Pass Skeptical Audit (Concurrency, Webhook, IDOR, Console) │
  │    2. Audit UI ──► API ──► DB, Anti-Slop, & Mode Reproduksi Bug.       │
  │    3. Keluarkan Laporan Temuan (file:baris) & Tiket Perbaikan Handoff. │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
  ┌────────────────────────────────────────────────────────────────────────┐
  │                    FASE 4: STABILISASI & CATATAN JEJAK                 │
  │                                                                        │
  │    [ 🚀 /role-devops ]  ──► Audit server, tag semver, backup & deploy  │
  │    [ 📜 CHANGELOG.md ]  ──► Catat penambahan, ubahan, & alasan hapus   │
  └────────────────────────────────────────────────────────────────────────┘
```

---

### 🌐 Bagaimana KruAI Mengonsumsi Skill / Standar Luar? (Apakah Didownload?)

> [!NOTE]
> **Prinsip Ringan & Bebas Sampah (Zero Bloat):**  
> KruAI **TIDAK mendownload seluruh repositori pihak ketiga** ke proyek Anda.
> 
> 1. **Intisari Emas (The Core Principles):** Standar terbaik komunitas (seperti *Vercel Guidelines*, *Supabase Best Practices*, dan *Marketing Skills*) sudah kami sarikan ke berkas panduan ringan di folder `.agents/references/`. Beratnya hanya beberapa kilobyte!
> 2. **Pencarian Real-Time (Just-In-Time):** Jika sebuah peran membutuhkan referensi pustaka khusus yang sangat spesifik, AI hanya membaca halaman web resminya secara dinamis saat diperlukan, lalu menerapkan kodenya ke proyek Anda.
> 3. **Hasilnya:** Proyek Anda tetap bersih, ringan, dan tidak dipenuhi oleh ribuan file sampah repositori luar.

---

## 👥 Roster Tim Peran (Kru)

Ketik `/role` di antarmuka chat AI Anda untuk memanggil kru:

| Shortcut | Status | Tugas Utama | Wewenang Kode |
|---|---|---|---|
| `/role-asisten` | ✅ **Aktif** | Pintu masuk utama (Mode Greenfield, Brownfield, & Fast-Track Hotfix): inisialisasi proyek baru, gali kebutuhan, tulis brief. | ❌ Hanya Baca |
| `/role-onboard` | ✅ **Aktif** | Memahami proyek lanjutan: ekstrak stack, hasilkan `docs/conventions.md`, petakan fitur, bangun glossary, rekonsiliasi `.agents/`. | ❌ Hanya Baca |
| `/role-blueprint`| ✅ **Aktif** | Arsitek kontrak: satu-satunya sumber kebenaran skema API & DB (`docs/contract/`) sebelum koding dimulai. | ❌ Hanya Baca |
| `/role-database` | ✅ **Aktif** | Perancang skema DB, indexing B-Tree/Composite, migrasi idempoten, dan zero data loss. | ✍️ **Ubah Kode** |
| `/role-backend`  | ✅ **Aktif** | Pembangun backend *stack-agnostic*: arsitektur adaptif sesuai `conventions.md`, validasi zero-trust, anti-race condition, & webhook guard. | ✍️ **Ubah Kode** |
| `/role-frontend` | ✅ **Aktif** | Pembangun UI patuh doktrin visual, anti-AI slop, schema mirroring (form lengkap), dan micro-interactions. | ✍️ **Ubah Kode** |
| `/role-copywriter`| ✅ **Aktif** | Penulis teks produk, microcopy antarmuka, headline penjualan, dan pembasmi klise AI (6 opsi kerangka). | ⚠️ Terbatas (Docs/Teks) |
| `/role-inspektur`| ✅ **Aktif** | **Auditor Kunci:** *Multi-Pass Skeptical Audit* (UI → API → DB, concurrency, webhook, Console tampering, dummy, & anti-slop). | ❌ Hanya Baca |
| `/role-devops`   | ✅ **Aktif** | Pengawal build, tes, audit server *read-only*, tag rilis semver, backup, deploy terkendali & *live smoke check*. | ⚠️ Terbatas (Config/CI/Tests) |
| `/role-security` | 📝 Rencana | Penguji celah keamanan OWASP Top 10, validasi IDOR, dan audit kebocoran kredensial. | ❌ Hanya Baca |

---

## 🎬 Proyek Animasi Video (`v1 Beta` — Eksperimental)

> [!NOTE]
> **Status `v1 Beta` (Jalur Uji Coba Non-Web):**  
> Fokus utama starter KruAI saat ini masih pada proyek **Website & Aplikasi**. Untuk pengguna yang ingin bereksperimen membuat **video iklan produk fisik berbasis kode** (misalnya dengan Remotion, Motion Canvas, Blender Python `bpy`, atau FFmpeg), tersedia jalur khusus **`v1 Beta`** yang langsung melewati alur website dan mengunci proyek agar tidak bercampur aduk dengan kode web.  
> Pemisahan paket profil fisik penuh (`--profile web` / `--profile video-animation`) direncanakan hadir pada **`v0.3.0`**.

### Cara Memanggil Langsung ke Proyek Animasi Video (Bukan ke Web)
1. Buat **folder proyek baru terpisah** (jangan digabung dengan folder proyek website Anda) dan pasang KruAI:
   ```bash
   mkdir proyek-animasi-v1-beta && cd proyek-animasi-v1-beta
   npx github:kangjessydev/kruai init
   ```
2. Di chat IDE (**Antigravity / Cursor / Copilot**), panggil langsung:
   ```text
   /role-asisten video
   ```
   *(alias yang juga didukung: `/role-asisten animasi`)*

### Apa yang Terjadi Saat `/role-asisten video` Dipanggil?
- **Auto-Skip Jalur Web & *Domain Lock Beta*:** Asisten membaca [references/video-animation-v1-beta.md](.agents/references/video-animation-v1-beta.md) secara *on-demand* (0 beban token pada proyek website), mengunci `Domain: video-animation (v1 Beta)` di `docs/project-brief.md`, dan langsung melewati seluruh wawancara website/database/frontend.
- **Anti *Blank-Page* (5 Paket Rekomendasi):** Jika Anda belum punya bayangan gaya video, asisten menawarkan 5 paket iklan produk fisik siap pilih (*E-Commerce Punchy 2D*, *Premium Showcase*, *Explainer Vektor*, *UGC/AI Video Hybrid*, hingga *Luxury 3D Hybrid*).
- ***Stack Disclosure Gate*:** Sebelum menyetujui stack, asisten wajib menjelaskan secara transparan **biaya & lisensi** (misal Remotion gratis `$0` untuk individu/tim ≤ 3 anggota dan berbayar untuk ≥ 4 anggota, Motion Canvas & Manim `MIT` gratis, Blender `bpy` hasil render bebas komersial), **akun/API eksternal**, **kebutuhan lokal** (Node.js/FFmpeg/GPU), dan **daftar aset** yang perlu disiapkan.
- **Alur 6 Peran Video & Hemat Token:** `role-asisten` → `role-director` (kunci copy + `docs/contract/storyboard.md`) → `role-animator` (komponen modular ber-frame lokal `0` maksimal ~120 baris/scene & *Phase-Gating*) → `role-inspektur` (Audit Lapis 1 CLI + Audit Lapis 2 **1 gambar *Contact Sheet*** terhadap 6 aturan *Anti-AI-Slop* termasuk *Safe Zone* Reels/TikTok) → `role-producer` (ekspor MP4 + verifikasi `ffprobe` dengan izin eksplisit user).
- **Paket Uji Coba yang Disarankan untuk Pemula:** **Remotion** (100% lokal, `$0` ≤ 3 orang, 0 akun API eksternal), **1 produk fisik kemasan botol/tunggal** (serum, parfum, minuman botol, tumbler), format vertikal **`9:16` (`1080 × 1920`, `30 FPS`, `15 detik`)** dalam 4 scene modular + 1 file musik `.mp3` lokal bebas royalti.

---

## 📚 Perpustakaan Referensi Terbuka (Atribusi Transparan)

KruAI mengadopsi standar rekayasa kelas dunia secara terbuka tanpa klaim sepihak:
* **Anti-AI Slop UI:** Diadopsi dari *Vercel Web Interface Guidelines* & W3C WCAG 2.1 ([references/anti-ai-slop-ui.md](.agents/references/anti-ai-slop-ui.md)).
* **Copywriting & UX Writing (Anti-AI Text Slop):** 5 kerangka komunitas (`marketingskills`, `ux-writing-skill`, dll.) + Opsi Sintesis Mandiri berkejujuran ([references/copywriting-frameworks.md](.agents/references/copywriting-frameworks.md)).
* **Arsitektur Backend & Database:** Diadopsi dari *agent-skills-hub* & *Supabase Postgres Best Practices* ([references/backend-architecture-best-practices.md](.agents/references/backend-architecture-best-practices.md)).
* **Keamanan Transaksi, Concurrency & State:** Prinsip *Zero-Trust Payload*, *ACID Row Locking*, *Payment Webhook State Machine*, *Cache Hygiene*, & *External API Contract Check* ([references/transaction-and-state-security.md](.agents/references/transaction-and-state-security.md)).
* **Panduan Model Orchestrator & Lifecycle Hooks:** Panduan memilih `Orchestrator (Neon/Argon)` vs `Hydrogen` dan konfigurasi `.agents/hooks.json` ([references/orchestrator-and-hooks-guide.md](.agents/references/orchestrator-and-hooks-guide.md)).
* **Panduan Proyek Animasi Video (`v1 Beta`):** Matriks 5 stack video, *Stack Disclosure Gate*, arsitektur multi-scene frame lokal, standar *Anti-AI-Slop* `9:16`, dan Audit *Contact Sheet* ([references/video-animation-v1-beta.md](.agents/references/video-animation-v1-beta.md)).
* **Matriks Spesifikasi Fitur:** Pola Generik Lintas Domain (*CRUD Admin*, *Dashboard/Reporting*, *File Upload*) & modul Auth, Katalog, Checkout, Media Studio ([references/feature-matrix.md](.agents/references/feature-matrix.md)).
* **Multi-Dimensional Design Tokens:** Gaya desain independen (Minimalist, Luxury, Studio Dark, Neo-Brutalism) ([references/design-styles.md](.agents/references/design-styles.md)).

---

## ⚡ Prinsip Kerja KruAI

1. **Progressive Reading (Baca 1 Buku Inti):** AI tidak dipaksa membaca ratusan buku referensi sekaligus. Asisten mensintesis aturan ke `docs/conventions.md` khusus untuk stack terpilih (misal: LaraVue, Next.js). Peran pembangun hanya membaca file tersebut.
2. **Context Window Guard & Phase-Gating:** Tugas dibatasi per **1 *vertical slice* fitur atau 1 layer domain** (maksimal ≤8 file / ≤400 baris kode; ≤3–5 file kritis untuk modul transaksi/risiko `ketat`), dan wajib dipecah per fase jika melintasi DB + Backend + Frontend agar AI tidak hilang ingatan.
3. **Schema Mirroring Rule:** Form di sisi admin WAJIB mencerminkan 100% kolom database. Dilarang menyunat form demi mengejar fast-working.
4. **Live Registry Ping:** Dilarang menebak versi dependensi dari data training lama. KruAI memverifikasi versi rilis real-time langsung ke registry resmi (`npm view`, `composer show`, `curl pypi`).

---

## 🗺️ Roadmap Distribusi

- [x] **Fase 1: Core Agent Roles & Protocol** (Selesai — Struktur `.agents/` lokal teruji).
- [x] **Fase 2: NPM CLI Scaffolder (`bin/kruai.js`)** (Selesai — Mendukung `init`, `update`, `doctor`, Smart Update, Multi-IDE `--ide`, `--with-hooks`, dan test suite `node:test`).
- [ ] **Fase 2.5 (`v0.3.0`): Core + Exclusive Profile Pack (`--profile web|video-animation`)** (Pemisahan profil fisik penuh agar tiap proyek 100% terisolasi domain; jalur uji coba `/role-asisten video` **v1 Beta** sudah tersedia saat ini).
- [ ] **Fase 3: KruAI MCP Server** (Menyediakan server Model Context Protocol terpusat di GitHub dengan shared learning database).

---

## 🤝 Cara Berkontribusi & Kirim Masukan (Bikin KruAI Makin Pintar)

KruAI berkembang lewat pengalaman nyata komunitas secara aman dan menjaga privasi:

1. **Punya Trik / Pola Rekayasa Baru?**  
   Jika Anda menemukan pola arsitektur yang bagus atau mengatasi masalah framework tertentu, buka [GitHub Issues](https://github.com/kangjessydev/kruai/issues) dengan label `saran` atau `resep`.
2. **Menemukan Celah / Bug?**  
   Laporkan langsung via [GitHub Issues](https://github.com/kangjessydev/kruai/issues).
3. **Pembaruan Kolektif:**  
   Saran yang disetujui akan dimasukkan ke katalog referensi resmi KruAI. Pengguna lain di seluruh dunia otomatis mendapatkan ilmu baru tersebut cukup dengan memperbarui instalasi mereka!

---

## 📄 Lisensi

Open Source di bawah lisensi MIT.

