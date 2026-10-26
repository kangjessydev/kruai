# Roster Peran

Ketik `/role` di chat untuk melihat peran yang sudah ada. Mulai hampir selalu dari `/role-asisten`.
- Spesifikasi detail peran yang direncanakan: [planned-roles.md](./planned-roles.md)
- Arsitektur & alasan keberadaan peran (Developer Reference): [docs/role-architecture.md](./docs/role-architecture.md)
- Katalog acuan jenis website: [references/website-archetypes.md](./references/website-archetypes.md)
- Panduan standar animasi/motion: [references/motion-guidelines.md](./references/motion-guidelines.md)

Status: ✅ ada · 📝 direncanakan

| Shortcut | Status | Fungsi satu baris | Boleh ubah kode? |
|---|---|---|---|
| `/role-asisten` | ✅ | Pintu masuk: cek pemahaman proyek, gali kebutuhan, tulis brief ke peran tujuan | Tidak |
| `/role-onboard` | ✅ | Proyek lanjutan: baca kode, pahami stack dan alasannya, buat peta/glossary/baseline | Tidak |
| `/role-init` | 📝 | Proyek baru: kebutuhan, brief, kontrak awal, SOP, glossary | Tidak |
| `/role-research` | 📝 | Riset (termasuk rekomendasi stack berbasis bukti terkini) | Tidak |
| `/role-blueprint` | 📝 | Rancangan kasar dan kontrak API/DB | Tidak |
| `/role-frontend` | 📝 | UI dan frontend (termasuk micro-interactions dasar) | Ya |
| `/role-motion` | 📝 | Konsultan & auditor animasi/motion UI (timing, easing, performa, anti-AI slop) | Tidak |
| `/role-backend` | 📝 | Backend/API | Ya |
| `/role-database` | 📝 | Skema dan data | Ya |
| `/role-inspektur` | 📝 | Cek ketidaksinkronan UI-API-DB-kontrak, data dummy | Tidak |
| `/role-security` | 📝 | Cek keamanan sesuai profil risiko | Tidak |
| `/role-bug-hunter` | 📝 | Cari bug dengan bukti | Tidak |
| `/role-devops` | 📝 | Tes, build, rilis, optimasi sebelum production | Terbatas (config/CI) |
| `/role-simplifier` | 📝 | Hapus duplikasi, kode mati, over-engineering | Ya (tes harus hijau) |
| `/role-retro` | 📝 | Tinjau log penyimpangan, usulkan perbaikan SKILL.md | Tidak |
| `/role-help` | 📝 | Tampilkan kartu contekan ini | Tidak |
| `/role-copywriter` | 📝 | Teks produk/pemasaran | Tidak |
| `/role-marketer` | 📝 | Strategi pemasaran | Tidak |

Peran baru diusulkan lewat handoff `...-to-NEW-ROLE`, lalu ditambahkan ke sini setelah disetujui user.
