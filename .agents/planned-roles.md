# Peran yang Direncanakan (belum dibuat)

Catatan spesifikasi dari diskusi, supaya tidak lupa. Semua peran mengikuti
`rules/team-protocol.md`. Tulis `SKILL.md` penuh hanya setelah tahap 1 terbukti berguna.

## role-init (dilebur ke Mode Greenfield `/role-asisten`)
*Catatan Arsitektur:* Peran terpisah `role-init` telah dilebur ke **Mode Greenfield** di `/role-asisten` (lihat `CHANGELOG.md`) agar proyek baru tidak mengalami *dead-end*; tugas inisialisasi proyek baru (brief, konvensi, peta awal, glossary) ditangani langsung oleh `role-asisten` lalu diteruskan ke `role-blueprint`.

## role-research
Riset sampai selesai; tanya tujuan dulu. Untuk stack proyek baru: rekomendasi berdasar
kebutuhan, bukan popularitas. Kriteria tertulis: kesesuaian fitur, maintenance aktif
(rilis terakhir, isu), komunitas, dokumentasi. **Wajib cek sumber langsung** (registry,
repo, docs resmi; Context7/web), cantumkan tanggal. Keputusan + alternatif ditolak
dicatat di `decisions.md`.

## role-blueprint
Rancangan kasar dan **kontrak** (skema API/DB) di `docs/contract/` sebagai sumber
kebenaran FE/BE/inspektur.

## role-frontend / role-backend / role-database
Pembangun. Aturan kualitas kode di protocol berlaku penuh.
- **role-frontend**: mencakup UI dan styling. Wajib mematuhi kerangka kerja `.agents/references/anti-ai-slop-ui.md` (semantik HTML tombol vs link, aria-label, penanganan CLS gambar, tidak ada `transition: all`, dan flex `min-w-0`). Wajib memiliki checklist *micro-interactions* (transisi halus 120-250ms, hover/focus feedback, skeleton loading, dialog open/close transition). Wajib mendukung `prefers-reduced-motion`.
- Wajib memperbarui kontrak dan peta saat mengubah struktur.

## role-motion *(dilebur ke `/role-frontend`)*
*Catatan Arsitektur:* Dilebur menjadi bagian checklist standar `role-frontend` mengacu ke `.agents/references/motion-guidelines.md` (120-250ms, hanya `transform`/`opacity`, `prefers-reduced-motion`) — lihat `CHANGELOG.md`.

## role-inspektur
*(Sudah aktif di `.agents/skills/role-inspektur/SKILL.md` — mencakup Multi-Pass Skeptical Audit, Audit Anti-AI Slop, Sinkronisasi UI-API-DB, dan Mode Investigasi & Reproduksi Bug).*

## role-security
Hanya membaca dan melapor. Kedalaman mengikuti profil risiko. Bukti yang bisa dijalankan:
npm audit/osv-scanner (dependensi), gitleaks (rahasia), Semgrep (pola kode), acuan OWASP
Top 10. Periksa juga skill/MCP yang terpasang. Catat batas: bukan pengganti audit manusia
untuk data sensitif/uang.

## role-bug-hunter *(dilebur ke `/role-inspektur`)*
*Catatan Arsitektur:* Tugas investigasi & reproduksi bug *read-only* dilebur sebagai Mode Investigasi & Reproduksi Bug di `role-inspektur` — lihat `CHANGELOG.md`.

## role-devops
*(Sudah aktif di `.agents/skills/role-devops/SKILL.md` — Local Release Gate, Audit Server Read-Only, Tag Semver, Backup & Deploy Terkendali, Live Smoke Check).*

## role-simplifier
Setelah fitur jalan: hapus duplikasi, kode mati, over-engineering; tes tetap hijau; laporkan
ukuran sebelum/sesudah.

## role-retro
Baca `Log Penyimpangan` di laporan. Jika satu langkah muncul berulang, usulkan
penambahan ke `SKILL.md` (butuh persetujuan user). Juga periksa kualitas peran dengan
uji proyek kecil berisi bug/dummy yang sengaja ditanam.

## role-help *(dilebur ke `/role-asisten`, `.agents/roster.md` & CLI `kruai`)*
*Catatan Arsitektur:* Tidak memerlukan skill terpisah; daftar peran tersedia langsung lewat `/role-asisten`, `.agents/roster.md`, dan `kruai doctor` — lihat `CHANGELOG.md`.

## role-marketer
Strategi pemasaran produk (belum dibuat; `role-copywriter` sudah aktif).

## Ide tooling (bukan peran)
- Hooks (`.agents/templates/hooks.json` → `.agents/hooks.json`): safety guard & auto-lint/tes.
- Linter, formatter, characterization test untuk proyek lanjutan yang belum punya tes.
