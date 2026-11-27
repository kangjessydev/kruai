# Panduan Model Orchestrator & Lifecycle Hooks

Panduan praktis untuk memaksimalkan **KruAI** pada mode pemilihan model **Orchestrator** di Google Antigravity serta mengaktifkan **Lifecycle Hooks** (`.agents/hooks.json`) secara aman.

---

## 1. Memilih Model (Orchestrator vs Standalone) untuk KruAI

Mode **Orchestrator** otomatis membagi tugas dalam satu sesi antara **Planner** (penalaran arsitektur & tinjauan) dan **Executor** cepat (*Hydrogen* di belakang layar). Pola ini selaras langsung dengan prinsip *Progressive Reading* (`docs/conventions.md`) dan *Phase-Gating* di KruAI.

| Model | Karakter Utama | Peran KruAI yang Paling Cocok | Kapan Dipakai? |
| :--- | :--- | :--- | :--- |
| **`Orchestrator (Neon)`** *(Default / Rekomendasi 90% sesi)* | Seimbang antara kepatuhan aturan lintas file, kecepatan, dan efisiensi kuota | `role-asisten`, `role-blueprint`, `role-database`, `role-backend`, `role-frontend`, `role-copywriter`, `role-devops` | Pekerjaan harian: wawancara kebutuhan, bangun fitur *vertical slice*, perbaiki bug lintas file, dan rilis terpandu |
| **`Orchestrator (Argon)`** | Penalaran mendalam untuk keputusan arsitektur & analisis risiko rumit | `role-blueprint` (skema kompleks), `role-inspektur` (*Multi-Pass Skeptical Audit* modul transaksi/uang), evaluasi ADR sulit | Sebelum mengunci kontrak arsitektur kritis atau audit pra-rilis sistem bernilai uang/keamanan ketat |
| **`Hydrogen`** *(Standalone)* | Super cepat dan paling hemat kuota | Tugas kecil non-kompleks atau *Fast-Track Hotfix* 1 file terisolasi | Edit typo dokumentasi, pembaruan ringan `CHANGELOG.md` / `README.md`, atau perbaikan kecil yang cakupannya sudah pasti |

### Praktik Terbaik di Mode Orchestrator
1. **Manfaatkan `docs/conventions.md`:** Planner (*Neon*/*Argon*) cukup membaca `docs/conventions.md` dan `docs/contract/` untuk merancang rencana presisi, sehingga *Executor* dapat langsung mengeksekusi implementasi sesuai pola tanpa menebak-nebak.
2. **Jangan Mematikan *Phase-Gating*:** Jika sebuah tugas melintasi **DB + Backend + Frontend** sekaligus, tetap jalankan dalam fase terpisah per peran agar konteks Planner dan Executor tetap bersih.
3. **Audit dengan Mindset Skeptis:** Saat memakai `role-inspektur` untuk modul transaksi/pembayaran, gunakan `Orchestrator (Argon)` atau `Orchestrator (Neon)` agar 3 Pass audit (*Concurrency/Webhook*, *User Journey/IDOR*, *Console Tampering/DB*) ditelusuri hingga ke level `file:baris`.

---

## 2. Mengaktifkan Lifecycle Hooks (`.agents/hooks.json`)

Google Antigravity mendukung otomasi berbasis siklus hidup agen lewat berkas `.agents/hooks.json`. Starter template tersedia di `.agents/templates/hooks.json` dengan seluruh hook berstatus `"enabled": false` agar tidak mengganggu proyek sebelum Anda sesuaikan.

### Cara Memasang
- **Saat inisialisasi proyek baru:**
  ```bash
  npx kruai init --with-hooks
  ```
- **Atau salin manual pada proyek yang sudah ada:**
  Salin `.agents/templates/hooks.json` ke `.agents/hooks.json`, sesuaikan perintah lint/test proyek Anda, lalu ubah `"enabled": false` menjadi `"enabled": true`.

### Struktur Starter di `.agents/templates/hooks.json`
1. **`kruai-destructive-command-guard` (`PreToolUse` pada `run_command`):**
   - Membaca payload JSON dari `stdin` (`toolCall.args.CommandLine`) dan mengembalikan `{"decision":"force_ask","reason":"..."}` apabila mendeteksi perintah berisiko tinggi (`git push --force`, `DROP TABLE`, `TRUNCATE`, `rm -rf /`), atau `{"decision":"allow"}` selainnya.
2. **`kruai-post-edit-lint` (`PostToolUse` pada `edit_file|write_file`):**
   - Kerangka hook pasca-edit. Ganti `command` dengan skrip lint cepat proyek Anda (misal `eslint --quiet` atau `pint --test`) yang tetap mencetak `{}` ke `stdout` di akhir eksekusi sesuai kontrak `PostToolUse`.

### Aturan Kontrak & Keamanan Hooks
- **Kontrak `stdin` / `stdout` JSON:**
  - `PreToolUse` membaca JSON di `stdin` dan **wajib** mencetak JSON ber-field `"decision"` (`"allow"`, `"deny"`, `"ask"`, atau `"force_ask"`) ke `stdout`.
  - `PostToolUse` menerima JSON di `stdin` dan mengharapkan output `{}` di `stdout`.
- **Eksekusi Sinkron:** Hook berjalan **sinkron** dan memblokir loop agen selama berjalan. Jaga perintah agar selesai dalam beberapa detik dengan `timeout` singkat (`10`–`20` detik), dan hindari menjalankan full test suite yang lama di setiap edit kecil.
