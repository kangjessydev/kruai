#!/usr/bin/env node

/**
 * KruAI CLI - The Production-Grade Engineering Crew for Vibe Coders
 * Zero external dependencies for instant, lightning-fast execution.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');

const CUSTOM_SECTION_MARKER = '## Custom Project Tools';
const MANAGED_MARKER = '<!-- KRUAI:MANAGED -->';
const META_FILENAME = '.kruai-meta.json';
const EXCLUDED_AGENT_DIRS = new Set(['docs']);
const EXCLUDED_AGENT_FILES = new Set([META_FILENAME]);
const VALID_IDES = new Set(['antigravity', 'cursor', 'copilot', 'all']);

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
 |_|\_\\_|   \\__,_/_/   \\_\\___|${colors.reset}
${colors.magenta}${colors.bold} The Production-Grade Engineering Crew for Vibe Coders 🚀${colors.reset}
`);
}

function getPackageVersion() {
  try {
    const pkgPath = path.join(PACKAGE_ROOT, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    return pkg.version || '0.2.0';
  } catch {
    return '0.2.0';
  }
}

function printHelp() {
  printBanner();
  console.log(`
${colors.bold}PENGGUNAAN:${colors.reset}
  $ ${colors.green}npx kruai${colors.reset} <perintah> [target] [opsi]

${colors.bold}PERINTAH:${colors.reset}
  ${colors.green}init${colors.reset} [target]     Memasang tim peran KruAI (.agents/) ke dalam proyek Anda (Default: .)
  ${colors.green}update${colors.reset} [target]   Memperbarui KruAI secara cerdas tanpa menimpa modifikasi lokal (Default: .)
  ${colors.green}doctor${colors.reset}           Memeriksa kesehatan dan kelengkapan instalasi KruAI di proyek
  ${colors.green}version${colors.reset}, -v      Menampilkan versi KruAI saat ini
  ${colors.green}help${colors.reset}, -h         Menampilkan panduan ini

${colors.bold}OPSI:${colors.reset}
  ${colors.cyan}--ide <mode>${colors.reset}      Target IDE bridge: antigravity (default), cursor, copilot, atau all
  ${colors.cyan}--with-hooks${colors.reset}      Pasang starter .agents/hooks.json (non-aktif default; aman untuk diedit)
  ${colors.cyan}--dry-run${colors.reset}         Pratinjau perubahan/konflik lokal tanpa menulis file apa pun ke disk
  ${colors.cyan}--force${colors.reset}           Paksa timpa file .agents/ yang berkonflik dengan versi starter terbaru

${colors.bold}CONTOH:${colors.reset}
  $ ${colors.cyan}npx kruai init${colors.reset}                        # Pasang untuk Antigravity di folder aktif
  $ ${colors.cyan}npx kruai init ./my-app --ide cursor${colors.reset}  # Pasang + AGENTS.md & .cursor/rules/
  $ ${colors.cyan}npx kruai init --ide all --with-hooks${colors.reset} # Semua bridge IDE + starter hooks.json
  $ ${colors.cyan}npx kruai update --dry-run${colors.reset}            # Cek file baru, update, & konflik lokal dulu
  $ ${colors.cyan}npx kruai update${colors.reset}                      # Perbarui aman (file konflik lokal dipertahankan)
  $ ${colors.cyan}npx kruai update --force${colors.reset}              # Timpa paksa seluruh file .agents/ ke versi starter
  $ ${colors.cyan}npx kruai doctor${colors.reset}                      # Cek kelengkapan KruAI di proyek
`);
}

function sha256Text(data) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function sha256File(filePath) {
  return sha256Text(fs.readFileSync(filePath));
}

function readMeta(destAgentsDir) {
  const metaPath = path.join(destAgentsDir, META_FILENAME);
  if (!fs.existsSync(metaPath)) {
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function writeMeta(destAgentsDir, version, fileHashes) {
  const sortedFiles = {};
  for (const key of Object.keys(fileHashes).sort()) {
    sortedFiles[key] = fileHashes[key];
  }

  const payload = {
    version,
    updatedAt: new Date().toISOString(),
    files: sortedFiles,
  };

  fs.mkdirSync(destAgentsDir, { recursive: true });
  fs.writeFileSync(
    path.join(destAgentsDir, META_FILENAME),
    `${JSON.stringify(payload, null, 2)}\n`,
    'utf8'
  );
}

/**
 * Parse CLI arguments supporting flags before or after positional arguments
 */
function parseArgs(rawArgs) {
  const positionals = [];
  const options = {
    ide: 'antigravity',
    ideExplicit: false,
    withHooks: false,
    dryRun: false,
    force: false,
  };
  let quickAction = null;

  for (let i = 0; i < rawArgs.length; i++) {
    const arg = rawArgs[i];

    if (arg === '-h' || arg === '--help') {
      quickAction = 'help';
      continue;
    }
    if (arg === '-v' || arg === '--version') {
      quickAction = 'version';
      continue;
    }
    if (arg === '--with-hooks') {
      options.withHooks = true;
      continue;
    }
    if (arg === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (arg === '--force') {
      options.force = true;
      continue;
    }
    if (arg === '--ide' || arg.startsWith('--ide=')) {
      let value = '';
      if (arg.startsWith('--ide=')) {
        value = arg.slice('--ide='.length).trim();
      } else {
        const next = rawArgs[i + 1];
        if (!next || next.startsWith('-')) {
          return {
            error: `Opsi '--ide' membutuhkan nilai (${[...VALID_IDES].join(', ')}).`,
          };
        }
        value = next.trim();
        i++;
      }

      if (!VALID_IDES.has(value)) {
        return {
          error: `Nilai --ide '${value}' tidak valid. Pilihan: ${[...VALID_IDES].join(', ')}.`,
        };
      }
      options.ide = value;
      options.ideExplicit = true;
      continue;
    }
    if (arg.startsWith('-')) {
      return { error: `Opsi '${arg}' tidak dikenali.` };
    }

    positionals.push(arg);
  }

  if (quickAction) {
    return { command: quickAction, target: '.', options };
  }

  const first = positionals[0];
  if (!first) {
    return { command: 'init', target: '.', options };
  }

  if (['init', 'update', 'doctor', 'check', 'version', 'help'].includes(first)) {
    return { command: first, target: positionals[1] || '.', options };
  }

  if (first.startsWith('.') || first.startsWith('/')) {
    return { command: 'init', target: first, options };
  }

  return { command: 'unknown', rawCommand: first, target: '.', options };
}

function collectSourceFiles(srcDir, rootSrc = srcDir, results = []) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relPath = path.relative(rootSrc, srcPath).split(path.sep).join('/');

    if (entry.isDirectory()) {
      if (EXCLUDED_AGENT_DIRS.has(relPath)) {
        continue;
      }
      collectSourceFiles(srcPath, rootSrc, results);
    } else if (!EXCLUDED_AGENT_FILES.has(relPath)) {
      results.push({ srcPath, relPath });
    }
  }
  return results.sort((a, b) => a.relPath.localeCompare(b.relPath));
}

/**
 * Synchronize .agents/ directory with hash-based conflict detection and dry-run support
 */
function syncAgentsDir(
  srcAgentsDir,
  destAgentsDir,
  { mode = 'init', dryRun = false, force = false } = {}
) {
  const stats = {
    copied: 0,
    preserved: 0,
    added: [],
    updated: [],
    unchanged: [],
    conflicts: [],
    notes: [],
  };

  const meta = readMeta(destAgentsDir);
  const metaVersionBefore = meta?.version || null;
  const nextHashes = {};
  const sourceFiles = collectSourceFiles(srcAgentsDir);

  if (!dryRun && !fs.existsSync(destAgentsDir)) {
    fs.mkdirSync(destAgentsDir, { recursive: true });
  }

  for (const { srcPath, relPath } of sourceFiles) {
    const destPath = path.join(destAgentsDir, relPath);
    const destExists = fs.existsSync(destPath);

    if (relPath === 'roster.md') {
      const srcContent = fs.readFileSync(srcPath, 'utf8');
      const srcIdx = srcContent.indexOf(CUSTOM_SECTION_MARKER);
      const srcCoreHash =
        srcIdx !== -1 ? sha256Text(srcContent.slice(0, srcIdx)) : sha256Text(srcContent);

      if (!destExists) {
        stats.added.push(relPath);
        stats.copied++;
        if (!dryRun) {
          fs.mkdirSync(path.dirname(destPath), { recursive: true });
          fs.writeFileSync(destPath, srcContent, 'utf8');
        }
        nextHashes[relPath] = srcCoreHash;
        continue;
      }

      const destContent = fs.readFileSync(destPath, 'utf8');
      const destIdx = destContent.indexOf(CUSTOM_SECTION_MARKER);

      if (destIdx === -1) {
        if (force) {
          stats.updated.push(relPath);
          stats.copied++;
          if (!dryRun) {
            fs.writeFileSync(destPath, srcContent, 'utf8');
          }
          nextHashes[relPath] = srcCoreHash;
        } else {
          stats.preserved++;
          stats.conflicts.push({ path: relPath, reason: 'roster.md kustom' });
          stats.notes.push('File .agents/roster.md kustom dipertahankan tanpa ditimpa.');
          if (meta?.files?.[relPath]) {
            nextHashes[relPath] = meta.files[relPath];
          }
        }
        continue;
      }

      if (srcIdx !== -1) {
        const srcCustom = srcContent.slice(srcIdx);
        const destCustom = destContent.slice(destIdx);
        let mergedContent = srcContent;

        if (destCustom.trim() !== srcCustom.trim()) {
          mergedContent = srcContent.slice(0, srcIdx) + destCustom;
          stats.preserved++;
          stats.notes.push('Bagian Custom Project Tools di .agents/roster.md dipertahankan.');
        }

        if (mergedContent === destContent) {
          stats.unchanged.push(relPath);
        } else {
          stats.updated.push(relPath);
          stats.copied++;
          if (!dryRun) {
            fs.writeFileSync(destPath, mergedContent, 'utf8');
          }
        }
        nextHashes[relPath] = srcCoreHash;
      } else {
        if (srcContent === destContent) {
          stats.unchanged.push(relPath);
        } else {
          stats.updated.push(relPath);
          stats.copied++;
          if (!dryRun) {
            fs.writeFileSync(destPath, srcContent, 'utf8');
          }
        }
        nextHashes[relPath] = srcCoreHash;
      }
      continue;
    }

    const srcHash = sha256File(srcPath);

    if (!destExists) {
      stats.added.push(relPath);
      stats.copied++;
      if (!dryRun) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.copyFileSync(srcPath, destPath);
      }
      nextHashes[relPath] = srcHash;
      continue;
    }

    const destHash = sha256File(destPath);
    if (destHash === srcHash) {
      stats.unchanged.push(relPath);
      nextHashes[relPath] = srcHash;
      continue;
    }

    if (mode === 'init' || force) {
      stats.updated.push(relPath);
      stats.copied++;
      if (!dryRun) {
        fs.copyFileSync(srcPath, destPath);
      }
      nextHashes[relPath] = srcHash;
      continue;
    }

    // mode === 'update' && !force
    const recordedHash = meta?.files?.[relPath];
    if (recordedHash && recordedHash === destHash) {
      stats.updated.push(relPath);
      stats.copied++;
      if (!dryRun) {
        fs.copyFileSync(srcPath, destPath);
      }
      nextHashes[relPath] = srcHash;
    } else {
      const reason = recordedHash ? 'dimodifikasi lokal' : 'tanpa metadata versi sebelumnya';
      stats.conflicts.push({ path: relPath, reason });
      stats.preserved++;
      stats.notes.push(`${relPath} dipertahankan (${reason}).`);
      if (recordedHash) {
        nextHashes[relPath] = recordedHash;
      }
    }
  }

  if (!dryRun) {
    writeMeta(destAgentsDir, getPackageVersion(), nextHashes);
  }

  return { stats, metaVersionBefore };
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

  // Starter file: docs/glossary.md (mengacu pada .agents/templates/glossary.md)
  const glossaryPath = path.join(docsDir, 'glossary.md');
  if (!fs.existsSync(glossaryPath)) {
    const today = new Date().toISOString().slice(0, 10);
    const glossaryTemplatePath = path.join(PACKAGE_ROOT, '.agents', 'templates', 'glossary.md');
    const fallbackTemplate = `# Glossary (nama resmi)

_Terakhir diverifikasi: YYYY-MM-DD_  
Satu konsep = satu nama. Jangan membuat padanan baru; tambahkan di sini jika memang baru.

| Konsep | Nama resmi | Dipakai di (UI / API / DB / kode) | Nama yang DILARANG (alias lama) |
|---|---|---|---|
`;
    const templateRaw = fs.existsSync(glossaryTemplatePath)
      ? fs.readFileSync(glossaryTemplatePath, 'utf8')
      : fallbackTemplate;
    fs.writeFileSync(glossaryPath, templateRaw.replaceAll('YYYY-MM-DD', today), 'utf8');
  }
}

function getIdeBridgeDescriptors(targetDir) {
  const agentsMdContent = `${MANAGED_MARKER}
# KruAI — Panduan Agen Proyek

Proyek ini menggunakan sistem tim peran **KruAI** di direktori \`.agents/\`.

## Aturan Utama
1. **Protokol Tim:** Baca dan patuhi \`.agents/rules/team-protocol.md\`.
   - Di luar pemanggilan peran \`role-*\`, jawab langsung dan ringkas tanpa ritual birokrasi peran (tetap patuhi Keamanan Agent).
   - Saat peran \`role-*\` dipanggil, pilih mode kerja sesuai konteks (**Mode Greenfield**, **Mode Brownfield / Stabilisasi**, atau **Mode Fast-Track Hotfix**).
2. **Daftar Peran & Skill:** Lihat \`.agents/roster.md\`. Panduan tiap peran berada di \`.agents/skills/<nama-peran>/SKILL.md\`.
3. **Sumber Kebenaran Proyek:** Periksa \`docs/project-brief.md\`, \`docs/conventions.md\`, \`docs/project-map.md\`, \`docs/glossary.md\`, \`docs/decisions.md\`, dan \`docs/contract/\` sebelum mengubah kode.
`;

  const cursorRuleContent = `---
description: Protokol Tim Peran KruAI & standar rekayasa anti-AI-slop
alwaysApply: true
---
${MANAGED_MARKER}

# KruAI Workspace Rules (Cursor Bridge)

- Ikuti protokol kerja di \`.agents/rules/team-protocol.md\` (patuhi Scope Guard: obrolan biasa tanpa \`/role-*\` tetap ringkas).
- Daftar peran tersedia di \`.agents/roster.md\` dan instruksi detail setiap peran berada di \`.agents/skills/*/SKILL.md\`.
- Sebelum menulis kode pada mode peran, selalu baca \`docs/project-brief.md\`, \`docs/conventions.md\`, \`docs/contract/\`, dan handoff \`open\` terkait.
`;

  const copilotInstructionsContent = `${MANAGED_MARKER}
# KruAI Instructions for GitHub Copilot

Proyek ini menerapkan standar tim peran **KruAI** di folder \`.agents/\`:
- **Protokol & Batas Wewenang:** \`.agents/rules/team-protocol.md\` (termasuk Scope Guard, 3 Mode Kerja Resmi, dan disiplin bukti \`file:baris\`).
- **Daftar Peran:** \`.agents/roster.md\` dengan runbook detail di \`.agents/skills/*/SKILL.md\`.
- **Konvensi & Kontrak:** Selalu rujuk \`docs/conventions.md\`, \`docs/project-brief.md\`, \`docs/glossary.md\`, dan \`docs/contract/\` sebelum menghasilkan atau memodifikasi kode.
`;

  return [
    {
      key: 'agents',
      filePath: path.join(targetDir, 'AGENTS.md'),
      label: 'AGENTS.md',
      content: agentsMdContent,
    },
    {
      key: 'cursor',
      filePath: path.join(targetDir, '.cursor', 'rules', 'kruai-protocol.mdc'),
      label: '.cursor/rules/kruai-protocol.mdc',
      content: cursorRuleContent,
    },
    {
      key: 'copilot',
      filePath: path.join(targetDir, '.github', 'copilot-instructions.md'),
      label: '.github/copilot-instructions.md',
      content: copilotInstructionsContent,
    },
  ];
}

function writeManagedFile(filePath, content, label, stats, dryRun = false) {
  if (!fs.existsSync(filePath)) {
    stats.added.push(label);
    stats.copied++;
    if (!dryRun) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, content, 'utf8');
    }
    return;
  }

  const existing = fs.readFileSync(filePath, 'utf8');
  if (existing.includes(MANAGED_MARKER)) {
    if (existing === content) {
      stats.unchanged.push(label);
    } else {
      stats.updated.push(label);
      stats.copied++;
      if (!dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  } else {
    stats.preserved++;
    stats.notes.push(`${label} kustom dipertahankan tanpa ditimpa.`);
  }
}

function syncIdeBridges(
  targetDir,
  ideOption,
  stats,
  { refreshExistingManaged = false, dryRun = false } = {}
) {
  const requestedKeys = new Set();
  if (ideOption === 'cursor') {
    requestedKeys.add('agents');
    requestedKeys.add('cursor');
  } else if (ideOption === 'copilot') {
    requestedKeys.add('agents');
    requestedKeys.add('copilot');
  } else if (ideOption === 'all') {
    requestedKeys.add('agents');
    requestedKeys.add('cursor');
    requestedKeys.add('copilot');
  }

  for (const descriptor of getIdeBridgeDescriptors(targetDir)) {
    const shouldRefreshExisting =
      refreshExistingManaged &&
      fs.existsSync(descriptor.filePath) &&
      fs.readFileSync(descriptor.filePath, 'utf8').includes(MANAGED_MARKER);

    if (requestedKeys.has(descriptor.key) || shouldRefreshExisting) {
      writeManagedFile(descriptor.filePath, descriptor.content, descriptor.label, stats, dryRun);
    }
  }
}

function installStarterHooks(targetDir, stats, dryRun = false) {
  const srcHooks = path.join(PACKAGE_ROOT, '.agents', 'templates', 'hooks.json');
  const destHooks = path.join(targetDir, '.agents', 'hooks.json');

  if (!fs.existsSync(srcHooks)) {
    return;
  }

  if (fs.existsSync(destHooks)) {
    stats.preserved++;
    stats.notes.push('.agents/hooks.json eksisting dipertahankan tanpa ditimpa.');
    return;
  }

  stats.added.push('.agents/hooks.json');
  stats.copied++;
  if (!dryRun) {
    fs.mkdirSync(path.dirname(destHooks), { recursive: true });
    fs.copyFileSync(srcHooks, destHooks);
  }
}

function validateSourceAndTarget(targetPathArg) {
  const targetDir = path.resolve(process.cwd(), targetPathArg);
  const sourceAgentsDir = path.join(PACKAGE_ROOT, '.agents');
  const destAgentsDir = path.join(targetDir, '.agents');

  if (!fs.existsSync(sourceAgentsDir)) {
    console.error(`${colors.red}❌ Error: Direktori sumber .agents tidak ditemukan di paket KruAI.${colors.reset}`);
    process.exit(1);
  }

  const isSamePath =
    path.resolve(sourceAgentsDir) === path.resolve(destAgentsDir) ||
    (fs.existsSync(destAgentsDir) &&
      fs.realpathSync(sourceAgentsDir) === fs.realpathSync(destAgentsDir));
  if (isSamePath) {
    console.error(
      `${colors.red}❌ Error: Target adalah repositori sumber KruAI sendiri. Menolak menimpa file sumber (.agents/).${colors.reset}`
    );
    process.exit(1);
  }

  return { targetDir, sourceAgentsDir, destAgentsDir };
}

function printPreservedNotes(stats) {
  if (stats.preserved > 0) {
    console.log(`${colors.cyan}🛡️  ${stats.preserved} kustomisasi proyek dipertahankan:${colors.reset}`);
    for (const note of stats.notes) {
      console.log(`   - ${note}`);
    }
  }
}

function printConflictResolutionGuide(stats) {
  if (stats.conflicts.length === 0) {
    return;
  }

  console.log(
    `\n${colors.yellow}⚠️  KONFLIK LOKAL terdeteksi (${stats.conflicts.length} file dipertahankan agar modifikasi proyek Anda aman):${colors.reset}`
  );
  for (const conflict of stats.conflicts) {
    console.log(`   - ${colors.yellow}${conflict.path}${colors.reset} ${colors.dim}(${conflict.reason})${colors.reset}`);
  }
  console.log(`
${colors.bold}Pilihan Penyelesaian Konflik:${colors.reset}
  1. Jalankan ${colors.cyan}${colors.bold}/role-asisten update${colors.reset} di chat AI untuk rekonsiliasi konflik dengan ${colors.cyan}docs/decisions.md${colors.reset} & ${colors.cyan}docs/conventions.md${colors.reset}.
  2. Atau jalankan ${colors.yellow}npx kruai update --force${colors.reset} jika ingin menimpa paksa file di atas ke versi starter terbaru.`);
}

function printDryRunReport(actionLabel, metaVersionBefore, targetVersion, stats) {
  console.log(`${colors.cyan}${colors.bold}🔍 MODE DRY-RUN (tidak ada file yang diubah)${colors.reset}`);
  console.log(
    `${colors.bold}Perintah:${colors.reset} ${actionLabel} | ${colors.bold}Versi terpasang:${colors.reset} ${
      metaVersionBefore ? `v${metaVersionBefore}` : 'tidak diketahui / legacy'
    } → ${colors.bold}Target:${colors.reset} v${targetVersion}\n`
  );

  console.log(`${colors.green}BARU (${stats.added.length}):${colors.reset}`);
  if (stats.added.length === 0) {
    console.log(`  ${colors.dim}(tidak ada)${colors.reset}`);
  } else {
    for (const item of stats.added) {
      console.log(`  + ${item}`);
    }
  }

  console.log(`\n${colors.blue}UPDATE (${stats.updated.length}):${colors.reset}`);
  if (stats.updated.length === 0) {
    console.log(`  ${colors.dim}(tidak ada)${colors.reset}`);
  } else {
    for (const item of stats.updated) {
      console.log(`  ~ ${item}`);
    }
  }

  console.log(`\n${colors.yellow}KONFLIK LOKAL (${stats.conflicts.length}):${colors.reset}`);
  if (stats.conflicts.length === 0) {
    console.log(`  ${colors.dim}(tidak ada)${colors.reset}`);
  } else {
    for (const item of stats.conflicts) {
      console.log(`  ! ${item.path} (${item.reason})`);
    }
  }

  console.log(`\n${colors.dim}SAMA: ${stats.unchanged.length} file tidak berubah.${colors.reset}`);
  printPreservedNotes(stats);
  printConflictResolutionGuide(stats);
  console.log('');
}

function handleInit(
  targetPathArg = '.',
  options = { ide: 'antigravity', withHooks: false, dryRun: false, force: false }
) {
  printBanner();
  const { targetDir, sourceAgentsDir, destAgentsDir } = validateSourceAndTarget(targetPathArg);

  console.log(`${colors.bold}Memasang KruAI ke:${colors.reset} ${colors.cyan}${targetDir}${colors.reset}\n`);

  const isExisting = fs.existsSync(destAgentsDir);
  if (isExisting && !options.dryRun) {
    console.log(`${colors.yellow}⚠️  Mendeteksi instalasi KruAI sebelumnya di proyek ini.${colors.reset}`);
    console.log(`${colors.dim}   Memperbarui protokol, referensi anti-slop, dan keterampilan peran...${colors.reset}\n`);
  }

  try {
    const { stats, metaVersionBefore } = syncAgentsDir(sourceAgentsDir, destAgentsDir, {
      mode: 'init',
      dryRun: options.dryRun,
      force: options.force,
    });
    if (!options.dryRun) {
      ensureStarterDocs(targetDir);
    }
    syncIdeBridges(targetDir, options.ide, stats, {
      refreshExistingManaged: false,
      dryRun: options.dryRun,
    });
    if (options.withHooks) {
      installStarterHooks(targetDir, stats, options.dryRun);
    }

    if (options.dryRun) {
      printDryRunReport('init', metaVersionBefore, getPackageVersion(), stats);
      return;
    }

    console.log(`${colors.green}✅ Sukses! ${stats.copied} file KruAI berhasil dipasang.${colors.reset}`);
    printPreservedNotes(stats);
    printConflictResolutionGuide(stats);
    console.log(`
${colors.bold}Langkah Selanjutnya untuk Vibe Coder:${colors.reset}
  1. Buka proyek ini di ${colors.bold}Google Antigravity IDE${colors.reset}, ${colors.bold}Cursor${colors.reset}, atau ${colors.bold}GitHub Copilot${colors.reset}.
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

function handleUpdate(
  targetPathArg = '.',
  options = { ide: 'antigravity', ideExplicit: false, withHooks: false, dryRun: false, force: false }
) {
  printBanner();
  const { targetDir, sourceAgentsDir, destAgentsDir } = validateSourceAndTarget(targetPathArg);

  console.log(`${colors.bold}Memperbarui KruAI di:${colors.reset} ${colors.cyan}${targetDir}${colors.reset}\n`);

  if (!fs.existsSync(destAgentsDir)) {
    console.error(
      `${colors.red}❌ Error: Folder .agents/ belum ditemukan di target. Jalankan 'npx kruai init' terlebih dahulu.${colors.reset}`
    );
    process.exit(1);
  }

  try {
    const { stats, metaVersionBefore } = syncAgentsDir(sourceAgentsDir, destAgentsDir, {
      mode: 'update',
      dryRun: options.dryRun,
      force: options.force,
    });
    syncIdeBridges(targetDir, options.ide, stats, {
      refreshExistingManaged: !options.ideExplicit,
      dryRun: options.dryRun,
    });
    if (options.withHooks) {
      installStarterHooks(targetDir, stats, options.dryRun);
    }

    if (options.dryRun) {
      printDryRunReport('update', metaVersionBefore, getPackageVersion(), stats);
      return;
    }

    console.log(
      `${colors.green}✅ Sukses! ${stats.copied} file KruAI berhasil diperbarui (${stats.added.length} baru, ${stats.updated.length} diperbarui, ${stats.unchanged.length} sama).${colors.reset}`
    );
    printPreservedNotes(stats);
    printConflictResolutionGuide(stats);
    console.log(`${colors.dim}   Catatan: folder docs/ dan kustomisasi pengguna tidak ditimpa.${colors.reset}\n`);
  } catch (err) {
    console.error(`${colors.red}❌ Gagal memperbarui KruAI: ${err.message}${colors.reset}`);
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
    process.exit(1);
  }

  const checks = [
    { name: 'Protokol Tim (team-protocol.md)', path: path.join(agentsDir, 'rules', 'team-protocol.md') },
    { name: 'Roster Tim (roster.md)', path: path.join(agentsDir, 'roster.md') },
    { name: 'Panduan Anti-AI Slop UI', path: path.join(agentsDir, 'references', 'anti-ai-slop-ui.md') },
    { name: 'Arsitektur Backend & Database', path: path.join(agentsDir, 'references', 'backend-architecture-best-practices.md') },
    { name: 'Keamanan Transaksi & State (transaction-and-state-security.md)', path: path.join(agentsDir, 'references', 'transaction-and-state-security.md') },
    { name: 'Panduan Orchestrator & Hooks (orchestrator-and-hooks-guide.md)', path: path.join(agentsDir, 'references', 'orchestrator-and-hooks-guide.md') },
    { name: 'Matriks Fitur (Feature Matrix)', path: path.join(agentsDir, 'references', 'feature-matrix.md') },
    { name: 'Kerangka Copywriting (copywriting-frameworks.md)', path: path.join(agentsDir, 'references', 'copywriting-frameworks.md') },
    { name: 'Role: role-asisten', path: path.join(agentsDir, 'skills', 'role-asisten', 'SKILL.md') },
    { name: 'Role: role-onboard', path: path.join(agentsDir, 'skills', 'role-onboard', 'SKILL.md') },
    { name: 'Role: role-blueprint', path: path.join(agentsDir, 'skills', 'role-blueprint', 'SKILL.md') },
    { name: 'Role: role-database', path: path.join(agentsDir, 'skills', 'role-database', 'SKILL.md') },
    { name: 'Role: role-backend', path: path.join(agentsDir, 'skills', 'role-backend', 'SKILL.md') },
    { name: 'Role: role-frontend', path: path.join(agentsDir, 'skills', 'role-frontend', 'SKILL.md') },
    { name: 'Role: role-inspektur', path: path.join(agentsDir, 'skills', 'role-inspektur', 'SKILL.md') },
    { name: 'Role: role-copywriter', path: path.join(agentsDir, 'skills', 'role-copywriter', 'SKILL.md') },
    { name: 'Role: role-devops', path: path.join(agentsDir, 'skills', 'role-devops', 'SKILL.md') },
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
    process.exit(1);
  }
}

// CLI Argument Routing
const parsed = parseArgs(process.argv.slice(2));

if (parsed.error) {
  console.error(`${colors.red}❌ Error: ${parsed.error}${colors.reset}`);
  printHelp();
  process.exit(1);
}

switch (parsed.command) {
  case 'init':
    handleInit(parsed.target, parsed.options);
    break;
  case 'update':
    handleUpdate(parsed.target, parsed.options);
    break;
  case 'doctor':
  case 'check':
    handleDoctor();
    break;
  case 'version':
    console.log(`v${getPackageVersion()}`);
    break;
  case 'help':
    printHelp();
    break;
  default:
    console.log(`${colors.red}Perintah '${parsed.rawCommand}' tidak dikenali.${colors.reset}`);
    printHelp();
    process.exit(1);
}
