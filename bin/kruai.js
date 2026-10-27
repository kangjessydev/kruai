#!/usr/bin/env node

/**
 * KruAI CLI - The Production-Grade Engineering Crew for Vibe Coders
 * Zero external dependencies for instant, lightning-fast execution.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

// Terminal colors
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function printBanner() {
  console.log(`
${colors.cyan}${colors.bold}  _  __            _   ___ 
 | |/ /           / \\ |_ _|
 | ' / _ __ _   _/ _ \\ | | 
 | . \\| '__| | | / ___ \\| | 
 |_|\\_\\_|   \\__,_/_/   \\_\\___|${colors.reset}
${colors.magenta}${colors.bold} The Production-Grade Engineering Crew for Vibe Coders 🚀${colors.reset}
`);
}

function getPackageVersion() {
  try {
    const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '0.1.0';
  } catch {
    return '0.1.0';
  }
}

function printHelp() {
  printBanner();
  console.log(`
${colors.bold}PENGGUNAAN:${colors.reset}
  $ ${colors.green}npx kruai${colors.reset} <perintah> [opsi]

${colors.bold}PERINTAH:${colors.reset}
  ${colors.green}init${colors.reset} [target]     Memasang tim peran KruAI (.agents/) ke dalam proyek Anda (Default: .)
  ${colors.green}doctor${colors.reset}           Memeriksa kesehatan dan kelengkapan instalasi KruAI di proyek
  ${colors.green}version${colors.reset}, -v      Menampilkan versi KruAI saat ini
  ${colors.green}help${colors.reset}, -h         Menampilkan panduan ini

${colors.bold}CONTOH:${colors.reset}
  $ ${colors.cyan}npx kruai init${colors.reset}             # Pasang di folder proyek yang sedang aktif
  $ ${colors.cyan}npx kruai init ./my-app${colors.reset}    # Pasang di folder my-app
  $ ${colors.cyan}npx kruai doctor${colors.reset}           # Cek kelengkapan KruAI di proyek
`);
}

/**
 * Copy directory recursively with non-destructive preservation for user files
 */
function copyDirRecursive(src, dest, stats = { copied: 0, preserved: 0 }) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, stats);
    } else {
      // Overwrite KruAI core files to ensure updates, but preserve user custom configs
      fs.copyFileSync(srcPath, destPath);
      stats.copied++;
    }
  }

  return stats;
}

/**
 * Ensure initial starter docs directory exists
 */
function ensureStarterDocs(targetDir) {
  const docsDir = path.join(targetDir, 'docs');
  const contractDir = path.join(docsDir, 'contract');
  const handoffDir = path.join(docsDir, 'handoff');
  const reportsDir = path.join(docsDir, 'reports');

  [docsDir, contractDir, handoffDir, reportsDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Starter file: docs/decisions.md
  const decisionsPath = path.join(docsDir, 'decisions.md');
  if (!fs.existsSync(decisionsPath)) {
    fs.writeFileSync(
      decisionsPath,
      `# Catatan Keputusan Arsitektur (ADR)

Dokumen ini mencatat keputusan arsitektur, pilihan stack, dan trade-off yang disepakati bersama User.

---
`,
      'utf8'
    );
  }

  // Starter file: docs/glossary.md
  const glossaryPath = path.join(docsDir, 'glossary.md');
  if (!fs.existsSync(glossaryPath)) {
    fs.writeFileSync(
      glossaryPath,
      `# Glosarium Istilah Proyek

Daftar istilah baku domain bisnis proyek agar AI dan User memiliki bahasa yang selaras.

| Istilah | Arti / Definisi | Catatan |
|---|---|---|
| Admin | Pengelola sistem dengan hak akses penuh | - |
| User | Pelanggan / pengguna umum aplikasi | - |
`,
      'utf8'
    );
  }
}

function handleInit(targetPathArg = '.') {
  printBanner();
  const targetDir = path.resolve(process.cwd(), targetPathArg);
  const sourceAgentsDir = path.join(PACKAGE_ROOT, '.agents');
  const destAgentsDir = path.join(targetDir, '.agents');

  console.log(`${colors.bold}Memasang KruAI ke:${colors.reset} ${colors.cyan}${targetDir}${colors.reset}\n`);

  if (!fs.existsSync(sourceAgentsDir)) {
    console.error(`${colors.red}❌ Error: Direktori sumber .agents tidak ditemukan di paket KruAI.${colors.reset}`);
    process.exit(1);
  }

  const isExisting = fs.existsSync(destAgentsDir);
  if (isExisting) {
    console.log(`${colors.yellow}⚠️  Mendeteksi instalasi KruAI sebelumnya di proyek ini.${colors.reset}`);
    console.log(`${colors.dim}   Memperbarui protokol, referensi anti-slop, dan keterampilan peran...${colors.reset}\n`);
  }

  try {
    const stats = copyDirRecursive(sourceAgentsDir, destAgentsDir);
    ensureStarterDocs(targetDir);

    console.log(`${colors.green}✅ Sukses! ${stats.copied} file KruAI berhasil dipasang.${colors.reset}`);
    console.log(`
${colors.bold}Langkah Selanjutnya untuk Vibe Coder:${colors.reset}
  1. Buka proyek ini di ${colors.bold}Google Antigravity IDE${colors.reset} atau ${colors.bold}Cursor${colors.reset}.
  2. Buka jendela chat AI dan ketik:
     ${colors.cyan}${colors.bold}/role-asisten${colors.reset}
  3. KruAI akan langsung menyapa, mengecek konteks, dan memandu Anda membangun aplikasi berstandar produksi!

${colors.magenta}Selamat berkarya tanpa AI-Slop & tanpa amnesia konteks! 🚀${colors.reset}
`);
  } catch (err) {
    console.error(`${colors.red}❌ Gagal memasang KruAI: ${err.message}${colors.reset}`);
    process.exit(1);
  }
}

function handleDoctor() {
  printBanner();
  const cwd = process.cwd();
  const agentsDir = path.join(cwd, '.agents');

  console.log(`${colors.bold}Memeriksa status KruAI di:${colors.reset} ${colors.cyan}${cwd}${colors.reset}\n`);

  if (!fs.existsSync(agentsDir)) {
    console.log(`${colors.red}❌ Folder .agents/ tidak ditemukan di proyek ini.${colors.reset}`);
    console.log(`   Jalankan: ${colors.green}npx kruai init${colors.reset} untuk memasangnya.\n`);
    return;
  }

  const checks = [
    { name: 'Protokol Tim (team-protocol.md)', path: path.join(agentsDir, 'rules', 'team-protocol.md') },
    { name: 'Roster Tim (roster.md)', path: path.join(agentsDir, 'roster.md') },
    { name: 'Panduan Anti-AI Slop UI', path: path.join(agentsDir, 'references', 'anti-ai-slop-ui.md') },
    { name: 'Arsitektur Backend & Database', path: path.join(agentsDir, 'references', 'backend-architecture-best-practices.md') },
    { name: 'Matriks Fitur (Feature Matrix)', path: path.join(agentsDir, 'references', 'feature-matrix.md') },
    { name: 'Role: role-asisten', path: path.join(agentsDir, 'skills', 'role-asisten', 'SKILL.md') },
    { name: 'Role: role-onboard', path: path.join(agentsDir, 'skills', 'role-onboard', 'SKILL.md') },
    { name: 'Role: role-database', path: path.join(agentsDir, 'skills', 'role-database', 'SKILL.md') },
    { name: 'Role: role-backend', path: path.join(agentsDir, 'skills', 'role-backend', 'SKILL.md') },
    { name: 'Role: role-frontend', path: path.join(agentsDir, 'skills', 'role-frontend', 'SKILL.md') },
    { name: 'Role: role-inspektur', path: path.join(agentsDir, 'skills', 'role-inspektur', 'SKILL.md') },
  ];

  let healthy = 0;
  for (const check of checks) {
    if (fs.existsSync(check.path)) {
      console.log(`  ${colors.green}✔${colors.reset} ${check.name}`);
      healthy++;
    } else {
      console.log(`  ${colors.red}✖${colors.reset} ${check.name} ${colors.dim}(hilang)${colors.reset}`);
    }
  }

  console.log(`\n${colors.bold}Hasil:${colors.reset} ${healthy}/${checks.length} komponen aktif.`);
  if (healthy === checks.length) {
    console.log(`${colors.green}${colors.bold}Semua sistem KruAI sehat dan siap tempur! 🚀${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}Beberapa komponen hilang. Jalankan ${colors.green}npx kruai init${colors.yellow} untuk memperbarui.${colors.reset}\n`);
  }
}

// CLI Argument Routing
const args = process.argv.slice(2);
const command = args[0] || 'init';

switch (command) {
  case 'init':
    handleInit(args[1]);
    break;
  case 'doctor':
  case 'check':
    handleDoctor();
    break;
  case '-v':
  case '--version':
  case 'version':
    console.log(`v${getPackageVersion()}`);
    break;
  case '-h':
  case '--help':
  case 'help':
    printHelp();
    break;
  default:
    // If user passed a directory name directly (e.g. npx kruai ./my-project)
    if (command.startsWith('.') || command.startsWith('/')) {
      handleInit(command);
    } else {
      console.log(`${colors.red}Perintah '${command}' tidak dikenali.${colors.reset}`);
      printHelp();
    }
    break;
}
