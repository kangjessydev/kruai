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
/role-asisten
```

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

## 📚 Perpustakaan Referensi Terbuka (Atribusi Transparan)

KruAI mengadopsi standar rekayasa kelas dunia secara terbuka tanpa klaim sepihak:
* **Anti-AI Slop UI:** Diadopsi dari *Vercel Web Interface Guidelines* & W3C WCAG 2.1 ([references/anti-ai-slop-ui.md](.agents/references/anti-ai-slop-ui.md)).
* **Copywriting & UX Writing (Anti-AI Text Slop):** 5 kerangka komunitas (`marketingskills`, `ux-writing-skill`, dll.) + Opsi Sintesis Mandiri berkejujuran ([references/copywriting-frameworks.md](.agents/references/copywriting-frameworks.md)).
* **Arsitektur Backend & Database:** Diadopsi dari *agent-skills-hub* & *Supabase Postgres Best Practices* ([references/backend-architecture-best-practices.md](.agents/references/backend-architecture-best-practices.md)).
* **Keamanan Transaksi, Concurrency & State:** Prinsip *Zero-Trust Payload*, *ACID Row Locking*, *Payment Webhook State Machine*, *Cache Hygiene*, & *External API Contract Check* ([references/transaction-and-state-security.md](.agents/references/transaction-and-state-security.md)).
* **Panduan Model Orchestrator & Lifecycle Hooks:** Panduan memilih `Orchestrator (Neon/Argon)` vs `Hydrogen` dan konfigurasi `.agents/hooks.json` ([references/orchestrator-and-hooks-guide.md](.agents/references/orchestrator-and-hooks-guide.md)).
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
- [x] **Fase 2: NPM CLI Scaffolder (`bin/kruai.js`)** (Selesai — Mendukung `init`, `update`, `doctor`, Multi-IDE `--ide`, `--with-hooks`, dan test suite `node:test`, siap publish ke npm).
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

