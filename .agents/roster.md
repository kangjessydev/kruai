# Roster Peran

Ketik `/role` di chat untuk melihat peran yang sudah ada. Mulai hampir selalu dari `/role-asisten`.
- Spesifikasi detail peran yang direncanakan: [planned-roles.md](./planned-roles.md)
- Kerangka Kerja Anti-AI Slop UI (Vercel Guidelines): [references/anti-ai-slop-ui.md](./references/anti-ai-slop-ui.md)
- Praktik Terbaik Backend & Database (Layered & Postgres): [references/backend-architecture-best-practices.md](./references/backend-architecture-best-practices.md)
- Panduan Keamanan Transaksi, Concurrency & State (Zero-Trust & Webhook): [references/transaction-and-state-security.md](./references/transaction-and-state-security.md)
- Panduan Model Orchestrator & Lifecycle Hooks: [references/orchestrator-and-hooks-guide.md](./references/orchestrator-and-hooks-guide.md)
- Kerangka Copywriting & Anti-AI Text Slop: [references/copywriting-frameworks.md](./references/copywriting-frameworks.md)
- Katalog acuan jenis website: [references/website-archetypes.md](./references/website-archetypes.md)
- Katalog gaya desain: [references/design-styles.md](./references/design-styles.md)
- Katalog jenis aset visual: [references/asset-types.md](./references/asset-types.md)
- Katalog gaya tipografi: [references/typography-styles.md](./references/typography-styles.md)
- Panduan standar animasi/motion: [references/motion-guidelines.md](./references/motion-guidelines.md)
- Matriks spesifikasi fitur & Production DoD: [references/feature-matrix.md](./references/feature-matrix.md)

Status: ✅ ada · 📝 direncanakan

| Shortcut | Status | Fungsi satu baris | Boleh ubah kode? |
|---|---|---|---|
| `/role-asisten` | ✅ | Pintu masuk (Mode Greenfield/Brownfield/Hotfix): inisialisasi proyek baru, gali kebutuhan, tulis brief ke peran tujuan | Tidak |
| `/role-onboard` | ✅ | Proyek lanjutan: baca kode, pahami stack/alasan, buat brief, `conventions.md`, peta, glossary, baseline | Tidak |
| `/role-research` | 📝 | Riset (termasuk rekomendasi stack berbasis bukti terkini) | Tidak |
| `/role-blueprint` | ✅ | Arsitek kontrak: kunci skema DB dan spesifikasi API di `docs/contract/` | Tidak |
| `/role-frontend` | ✅ | UI dan frontend (anti-slop, schema mirroring, micro-interactions 120–250ms) | Ya |
| `/role-backend` | ✅ | Backend/API stack-agnostic (arsitektur adaptif, validasi zero-trust, anti-race condition, live registry ping) | Ya |
| `/role-database` | ✅ | Skema, migrasi aman, relasi, indexing, RLS, zero data loss | Ya |
| `/role-inspektur` | ✅ | Multi-Pass Skeptical Audit (UI-API-DB, dummy, anti-slop, concurrency, webhook, Console tampering, reproduksi bug) | Tidak |
| `/role-security` | 📝 | Cek keamanan sesuai profil risiko | Tidak |
| `/role-devops` | ✅ | Build, tes, audit server read-only, release gate, backup, deploy terkendali & smoke check | Terbatas (config/CI/tests) |
| `/role-simplifier` | 📝 | Hapus duplikasi, kode mati, over-engineering | Ya (tes harus hijau) |
| `/role-retro` | 📝 | Tinjau log penyimpangan, usulkan perbaikan SKILL.md | Tidak |
| `/role-copywriter` | ✅ | Teks produk, microcopy UI, landing page, anti-AI text slop, 6 opsi gaya | Terbatas (docs/teks; kode UI via handoff/izin) |
| `/role-marketer` | 📝 | Strategi pemasaran | Tidak |

Peran baru diusulkan lewat handoff `...-to-NEW-ROLE`, lalu ditambahkan ke sini setelah disetujui user.

---

## Custom Project Tools (Bawaan Proyek Eksisting)
Jika proyek lanjutan ini memiliki skill/tools lokal bawaan (tidak berawalan `role-`), daftarkan di sini agar diakui dan dapat dipanggil oleh tim peran tanpa tertimpa atau campur aduk:

| Shortcut / Skill Name | Fungsi | Sumber File / Path |
|---|---|---|
| *(Belum ada tool lokal yang diadopsi)* | - | - |
