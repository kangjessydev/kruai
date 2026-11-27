# Arsitektur & Peta Jalan Tim Peran (Developer Reference)

Dokumen ini ditujukan untuk **pengembang sistem tim peran** (arsitek), menjelaskan struktur, alasan keberadaan, dan pembagian tugas seluruh peran di Antigravity.

---

## 1. Mental Model & Alur Kerja Antar-Peran

Sistem ini dirancang dengan prinsip **Decoupled Autonomous Agents via Artifact Handoffs**:
Peran tidak saling berbicara langsung dalam satu sesi, melainkan berkomunikasi melalui file kontrak (`docs/contract/`) dan rekomendasi tugas (`docs/handoff/`).

```
                    ┌─────────────────────────┐
                    │      USER / KREATOR     │
                    └────────────┬────────────┘
                                 │ Keputusan Utama
                                 ▼
                     [ 🚪 Pintu Masuk / Intake ]
                           /role-asisten
               (Greenfield / Brownfield / Hotfix)
                    /                  \
       (Proyek Baru: Mode Greenfield)   (Proyek Lama)
                   ▼                     ▼
      docs/project-brief.md &       /role-onboard
        docs/conventions.md              /
                   \                    /
                    ▼                  ▼
              [ 📐 Perencanaan & Riset ]
              /role-research & /role-blueprint
                                 │
                     ┌───────────┴───────────┐
                     ▼                       ▼
            [ 🔨 Pembangun ]        [ 🎨 UI & Konten ]
            /role-backend           /role-frontend (incl. motion)
            /role-database          /role-copywriter
                     │                       │
                     └───────────┬───────────┘
                                 ▼
                         [ 🔍 Penguji & Audit ]
                         /role-inspektur (Multi-Pass, UI-API-DB & Bug Repro)
                         /role-security 📝
                                 │
                                 ▼
                         [ 🚀 Rilis & Optimasi ]
                         /role-devops & /role-simplifier 📝
                                 │
                                 ▼
                         [ 🔄 Evaluasi Berkala ]
                         /role-retro 📝
```

---

## 2. Rincian Peran, Alasan Keberadaan & Tugasnya

### Kelompok 1: Pintu Masuk (Intake)
| Peran | Status | Alasan Keberadaan | Tugas Utama |
|---|---|---|---|
| `/role-asisten` | ✅ Aktif | Mencegah AI langsung melompat mengetik kode tanpa memahami maksud user; memilih mode kerja (*Greenfield* / *Brownfield* / *Hotfix*); mengarahkan ke peran tepat. | Interview kebutuhan user (termasuk inisialisasi proyek baru pada Mode Greenfield), tentukan profil risiko, sintesis `conventions.md`, buat brief tugas, pandu pembuatan peran baru. |
| `/role-onboard` | ✅ Aktif | Mencegah peran melakukan pemindaian (scan) ulang seluruh proyek di setiap sesi; menjaga agar AI tidak merusak konvensi lama. | Baca kode lama, ekstraksi stack + alasannya, hasilkan `docs/conventions.md`, buat `project-map.md`, bangun `glossary.md`, catat baseline tes. |

*(Catatan: `role-init` dilebur ke **Mode Greenfield** `/role-asisten`; `role-motion` dilebur ke `/role-frontend`; `role-bug-hunter` dilebur ke `/role-inspektur`; `role-help` dilebur ke `/role-asisten`, `.agents/roster.md` & CLI `kruai` — lihat `CHANGELOG.md`.)*

### Kelompok 2: Perencana (Planners)
| Peran | Status | Alasan Keberadaan | Tugas Utama |
|---|---|---|---|
| `/role-research` | 📝 Rencana | Menghindari AI merekomendasikan library/stack hanya karena populer atau data training lama. | Riset berbasis data real-time terkini (Context7/web), cek rilis & maintenance repo, catat keputusan di `decisions.md`. |
| `/role-blueprint` | ✅ Aktif | Menjadi satu-satunya sumber kebenaran (Single Source of Truth) antara Frontend dan Backend agar tidak terjadi asumsi data yang berbeda. | Menghasilkan dan mengunci skema kontrak API dan DB di `docs/contract/` secara *read-only* sebelum kode aplikasi ditulis. |

### Kelompok 3: Pembangun (Builders - Boleh Ubah Kode)
| Peran | Status | Alasan Keberadaan | Tugas Utama |
|---|---|---|---|
| `/role-frontend` | ✅ Aktif | Membangun UI yang sesuai identitas brand, responsif, dan bebas dari tampilan generic AI-slop. | Implementasi komponen UI, layout, styling, form 100% cermin skema DB, integrasi API, dan micro-interactions 120–250ms. |
| `/role-backend` | ✅ Aktif | Memastikan logika bisnis, validasi, dan API endpoint berjalan patuh pada kontrak yang disepakati lintas stack. | Implementasi server logic adaptif sesuai `conventions.md`, validasi zero-trust, anti-race condition, webhook guard, dan live registry ping. |
| `/role-database` | ✅ Aktif | Mencegah anomali relasi data, query lambat, atau perubahan skema yang merusak data yang ada. | Desain skema DDL/ORM, migrasi idempoten, indexing FK/composite, RLS, dan protokol *zero data loss*. |
| `/role-copywriter` | ✅ Aktif | Membasmi klise AI (*AI text slop*) pada copy produk, microcopy tombol, pesan error, dan dokumentasi. | Menyusun copy/microcopy & docs (terbatas docs/teks; pemasangan ke UI via handoff `role-frontend` atau edit string langsung dengan izin user). |

### Kelompok 4: Penguji & Auditor (Auditors - Hanya Baca & Lapor)
| Peran | Status | Alasan Keberadaan | Tugas Utama |
|---|---|---|---|
| `/role-inspektur` | ✅ Aktif | **Peran Paling Kritis:** Mendeteksi celah transaksi, manipulasi state, akar bug, dan komponen UI yang datanya masih dummy/putus. | Menjalankan *Multi-Pass Skeptical Audit* (concurrency, webhook, IDOR, Console tampering), reproduksi bug (`file:baris`), serta memetakan UI → API → DB (`nyata`/`dummy`/`putus`) & audit anti-slop. |
| `/role-security` | 📝 Rencana | Memastikan kode tidak membawa celah keamanan OWASP, secret bocor, atau dependensi rentan. | Audit dependensi (`npm audit`/`osv-scanner`), deteksi secret (`gitleaks`), verifikasi sanitasi input & RBAC. |

### Kelompok 5: Operasional & Optimasi (Ops & Maintenance)
| Peran | Status | Alasan Keberadaan | Tugas Utama |
|---|---|---|---|
| `/role-devops` | ✅ Aktif | Menjaga kualitas build/tes dan mengamankan proses audit server, tag rilis, backup, serta deploy terkendali. | Local release gate, audit server *read-only*, tag semver, backup & deploy 4 fase dengan *Ownership Guard* & *Live Smoke Check*. |
| `/role-simplifier` | 📝 Rencana | AI memiliki kecenderungan menulis kode berlebihan (bloatware); peran ini bertugas merampingkan. | Refactoring pasca-fitur selesai: hapus duplikasi kode (`jscpd`), bersihkan kode mati (`knip`), pertahankan tes tetap hijau. |
| `/role-retro` | 📝 Rencana | Memberikan mekanisme belajar dan perbaikan diri bagi tim peran secara aman. | Meninjau `Log Penyimpangan` dari laporan berkala, menyaring pola sukses berulang, mengusulkan update `SKILL.md`. |

---

## 3. Otomasi Generator Role

Untuk mempermudah pembuatan peran baru tanpa mengetik manual, `role-asisten` telah dibekali kapabilitas untuk meng-generate file `SKILL.md` baru di `.agents/skills/<nama-peran>/` secara interaktif dan otomatis memperbarui `roster.md`.
