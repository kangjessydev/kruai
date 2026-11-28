# Panduan Proyek Animasi Video — Iklan Produk Fisik (`v1 Beta`)

> **Status: `v1 Beta (Eksperimental)`** — Jalur uji coba terarah untuk pembuatan video animasi iklan produk fisik berbasis kode. Fokus utama starter KruAI `v0.2.x` tetap pada pengembangan Website/Aplikasi; pemisahan profil fisik penuh (`--profile video-animation`) dijadwalkan untuk `v0.3.0`.

---

## 1. *Domain Lock Beta* (Aturan Eksklusifitas Proyek)
- Saat `role-asisten` dipanggil lewat `/role-asisten video` (atau `/role-asisten animasi`), proyek ini ditandai sebagai `Domain: video-animation (v1 Beta)` di `docs/project-brief.md`.
- **Wajib dilewati:** Seluruh referensi website (`website-archetypes.md`, `anti-ai-slop-ui.md`) serta peran aplikasi web (`role-database`, `role-backend`, `role-frontend`).
- **Dilarang campur aduk:** Di dalam repositori `video-animation`, AI tidak boleh membangun halaman website/dashboard/database web. Jika user menginginkan keduanya, arahkan membuat folder terpisah.

---

## 2. Alur Greenfield vs Brownfield & 5 Paket Iklan Siap Pilih
1. **Deteksi Kondisi Folder:**
   - **Folder kosong / belum ada proyek video → Mode Greenfield Video:** Pandu dari nol. Jika user belum punya gambaran gaya video, tawarkan **5 Paket Siap Pilih** di bawah (*anti blank-page*).
   - **Sudah ada kode video / komposisi → Mode Brownfield Video:** Lewati wawancara dasar, langsung fokus membaca struktur scene, menambah/merevisi scene, mengganti data/aset, atau verifikasi render.
2. **5 Paket Iklan Produk Fisik Siap Pilih (*Anti Blank-Page*):**
   - **Paket 1 — *E-Commerce Punchy* (12–15 detik, `9:16`):** *(Rekomendasi uji coba awal / pilot)* Foto produk 2D transparan + teks kinetik cepat + badge diskon + CTA. *(Stack: Remotion)*
   - **Paket 2 — *Premium / Minimalist Showcase* (15–20 detik, `9:16` / `16:9`):** Gerak halus elegan, spotlight/bayangan lembut (cocok skincare, parfum, jam tangan). *(Stack: Remotion atau Motion Canvas)*
   - **Paket 3 — *Explainer Cara Kerja Produk* (20–30 detik):** Diagram vektor 2D & anotasi komponen produk sinkron narasi. *(Stack: Motion Canvas)*
   - **Paket 4 — *UGC / Klip Kamera / AI Video Hybrid* (15–30 detik):** Merakit klip manusia/demo nyata + subtitle animasi & kartu promo. *(Stack: Remotion atau FFmpeg)*
   - **Paket 5 — *Luxury 3D Commercial* (15 detik):** Render 3D fotorealistis (kaca, cairan, logam) + overlay promo 2D. *(Stack: Hybrid Blender `bpy` + Remotion)*

---

## 3. Matriks 5 Stack Video & *Stack Disclosure Gate* (Wajib Sebelum Konfirmasi)

| Stack | Bahasa & Engine | Lisensi Komersial | Cocok Untuk | Efisiensi Token AI |
|---|---|---|---|---|
| **Remotion** | TypeScript/React → Headless Chromium + FFmpeg | **Custom (bukan MIT):** Gratis ($0, tanpa watermark) untuk individu, non-profit, & perusahaan **≤ 3 total anggota**. Tim **≥ 4 anggota** wajib lisensi berbayar. | Motion ad foto produk 2D, katalog multi-SKU (JSON/CSV), multi-rasio `9:16` & `16:9`, overlay klip AI/UGC. | **Sangat Tinggi** (LLM paling akurat di React/Tailwind) |
| **Motion Canvas** | TypeScript → HTML5 2D Canvas (`function*`/`yield*`) | **MIT** (100% gratis komersial semua ukuran tim). | Explainer cara kerja produk (diagram vektor 2D), alternatif 2D gratis tim ≥ 4 orang. | **Menengah** |
| **Blender Python (`bpy`)** | Python → Blender 3D (**Cycles** / **Eevee**) | **GPL** (aplikasi gratis; hasil video render 100% bebas komersial). | Klip produk **3D mewah fotorealistis** (sering dipadukan dengan Remotion untuk teks & CTA). | **Rendah–Menengah** (API verbose & koordinat 3D rawan revisi) |
| **Manim (CE)** | Python → Cairo / OpenGL vektor | **MIT** (100% gratis komersial). | Video edukasi matematika, rumus LaTeX, algoritma (bukan iklan produk). | **Menengah** |
| **FFmpeg** | CLI / C (`filter_complex`) | **LGPL/GPL** (hasil video bebas komersial). | Potong-sambung klip cepat, resize, audio mixing, subtitle polos (buruk untuk motion graphics rumit). | **Tinggi** tugas simpel; **Buruk** untuk grafis rumit |

> **Wajib — *Stack Disclosure Gate*:** Sebelum mengunci stack di `docs/conventions.md`, `role-asisten` **WAJIB** memaparkan 4 kartu syarat berikut ke user:
> 1. **Biaya & Lisensi Komersial** (mis. Remotion gratis ≤ 3 orang vs ≥ 4 orang berbayar; cek ulang situs resmi saat dipakai skala tim).
> 2. **Akun & Layanan Eksternal** (100% lokal 0 akun vs butuh API TTS/AI Video/Cloud Render).
> 3. **Kebutuhan Software & Hardware Lokal** (Node.js LTS, FFmpeg, Chromium, atau Python + Blender + GPU).
> 4. **Checklist Aset User** (foto produk `.png` latar transparan, logo, warna brand, naskah harga/USP/CTA, musik `.mp3` bebas royalti — beserta opsi memakai aset *placeholder* SVG sementara untuk tes teknis awal).

### Rekomendasi Paket Uji Coba Perdana (`Proyek Animasi v1 Beta`)
- **Stack:** Remotion (TS + React + Tailwind, 100% lokal, $0 ≤ 3 orang, 0 akun API eksternal).
- **Produk Uji:** 1 produk fisik kemasan botol/tunggal (serum, parfum, kopi botol/kaleng, atau tumbler).
- **Format:** `9:16` (`1080 × 1920`), `30 FPS`, durasi `15 detik` (`450 frame`), **4 Scene Modular**: Hook (`0–3s`), Hero Reveal (`3–7s`), 3 USP bergantian (`7–11s`), Offer & CTA (`11–15s`), dengan 1 musik `.mp3` lokal.

---

## 4. Arsitektur Multi-Scene Hemat Token & 4 Jangkar Konteks
Hindari menaruh seluruh iklan di 1 file raksasa memakai angka frame global. Gunakan `<Sequence>` / `<TransitionSeries.Sequence>` agar di setiap file scene, `useCurrentFrame()` **selalu mulai dari `0`**:
- `docs/contract/storyboard.md` & `docs/contract/timeline-spec.json` — **Jangkar Naratif:** kunci durasi frame, teks final, aset, serta **kondisi masuk (*entry*) dan keluar (*exit*)** antar-scene sebelum ngoding.
- `src/data/ad-config.ts` — **Jangkar Data:** satu sumber untuk copywriting, harga, path `staticFile(...)`, & durasi tiap scene.
- `src/theme/tokens.ts` — **Jangkar Gaya & Fisika:** warna, pairing font, koordinat *safe zone*, dan preset `spring()` / easing.
- `src/components/shared/` — **Jangkar Komponen Bersama:** `<SafeZoneOverlay />`, backdrop studio, bayangan produk, badge harga.
- `src/scenes/Scene*.tsx` — **Batas ~80–120 baris per file scene.** Dilarang menulis `<svg>` ilustrasi kompleks *inline* atau Base64 di kode (simpan aset di `public/assets/`).
- ***Phase-Gating*:** Pondasi (`tokens`, `ad-config`, `shared`) → bangun 1–2 scene per fase → rakit `src/VideoAd.tsx` + audio → Audit 2 Lapis → Render final.

---

## 5. 6 Aturan Wajib *Anti-AI-Slop* Iklan Video (`9:16` / `1080 × 1920`)
1. ***Safe Zone* Mutlak:** Kosongkan **Atas `220–250 px`**, **Bawah `380–420 px`**, **Kanan `140–160 px`**, **Kiri `60–80 px`**. Wajib pakai `<SafeZoneOverlay visible={DEBUG} />` saat audit visual, lalu matikan saat render final.
2. **Batas Baca & Tipografi Layar HP:** Maks **3–5 kata per headline** (**≤ 2,5 kata/detik**); poin USP muncul bergantian. Ukuran min: Headline `72–110 px`, Harga `84–120 px` (`font-variant-numeric: tabular-nums`), USP `42–56 px`, Micro-label `≥ 28–32 px`. Maks 2 keluarga font dengan kontras tinggi.
3. **Kedalaman Studio 3 Lapis (Foto 2D):** Backdrop radial/*spotlight* (bukan solid polos) + *contact/ground shadow* dinamis di bawah produk + *ambient glow* / *parallax* ringan.
4. **Fisika Gerak, *Stagger*, & Anti *Dead Air*:** Dilarang linear untuk masuk/keluar; gunakan `spring()` dari `tokens.ts` (`damping` `14–18` punchy / `22–28` luxury), *stagger* `4–8 frame`, dan gerak hidup halus (*floating* `±6 px` atau *slow zoom* `1.00 → 1.04`).
5. **Hook 1,5 Detik & Transisi Rapi:** Detik `0.0–0.5` langsung tampilkan visual/headline bergerak (dilarang *fade-in* logo 2 detik di awal). Durasi transisi konsisten `8–15 frame`, maksimal 1–2 gaya.
6. **Determinisme Mutlak:** Semua animasi 100% diturunkan dari `useCurrentFrame()`. **DILARANG** CSS `transition`, `@keyframes`, Tailwind `animate-*`, `setTimeout`, dan `Math.random()` mentah (pakai `random('seed')`).

---

## 6. Alur 6 Peran Video Beta & Audit 2 Lapis

```text
role-asisten ──▶ role-director ──▶ role-animator (per-fase) ──▶ role-inspektur ──▶ role-producer
```

1. **`role-asisten`** *(core)*: *Stack Disclosure Gate*, `project-brief.md`, `conventions.md`.
2. **`role-director`** *(konseptor & kontrak)*: Susun copy ≤ 2,5 kata/detik + kunci `docs/contract/storyboard.md` & `timeline-spec.json`. Tidak menulis kode.
3. **`role-animator`** *(coder animasi)*: Bangun pondasi + 1–2 scene per fase + siapkan skrip CLI pembuat **1 *Contact Sheet* (4×2)** via `npx remotion still`.
4. **`role-inspektur`** *(core, read-only)* — **Audit 2 Lapis:**
   - **Lapis 1 (`0` token gambar):** `tsc --noEmit`, grep larangan render (`animate-`, `transition:`, `setTimeout`, `Math.random`, inline SVG raksasa), cek panjang teks & kecocokan total frame dengan `storyboard.md`.
   - **Lapis 2 (`1` gambar *Contact Sheet*, `DEBUG_SAFE_ZONE = true`):** Cek Safe Zone, tabrakan/terpotong, kontras HP, kontinuitas antar-scene, dan kedalaman bayangan. Setelah lolos, user memutar preview gerak & audio di Remotion Studio.
5. **`role-producer`** *(pipeline render)*: Verifikasi Node/FFmpeg/codec/aset, **minta izin eksplisit user sebelum render berat/batch besar atau cloud render berbayar**, jalankan ekspor MP4 (`out/`) & multi-rasio (`9:16`, `1:1`, `16:9`), lalu lampirkan bukti `ffprobe`.

> **Catatan `v1 Beta` tentang Peran Video:** Untuk menjaga proyek web tetap ringan pada `v0.2.x`, file skill `role-director`, `role-animator`, dan `role-producer` belum dipasang global di starter bawaan. Saat menjalankan proyek video beta, `role-asisten` dapat menawarkan pembuatan 3 skill tersebut secara lokal di proyek video Anda (dengan izin eksplisit user), atau memandu eksekusinya bertahap langsung mengikuti panduan di dokumen ini.
