import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const CLI_PATH = path.join(REPO_ROOT, 'bin', 'kruai.js');

function runCli(args, cwd = REPO_ROOT) {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd,
    encoding: 'utf8',
  });
}

function makeTempDir(prefix = 'kruai-test-') {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

test('CLI help, version, unknown command, and invalid --ide flag', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8'));

  const helpRes = runCli(['--help']);
  assert.equal(helpRes.status, 0);
  assert.match(helpRes.stdout, /PENGGUNAAN:/);
  assert.match(helpRes.stdout, /update/);
  assert.match(helpRes.stdout, /--ide/);
  assert.match(helpRes.stdout, /--with-hooks/);

  const verRes = runCli(['--version']);
  assert.equal(verRes.status, 0);
  assert.equal(verRes.stdout.trim(), `v${pkg.version}`);

  const unknownRes = runCli(['perintah-ngawur']);
  assert.equal(unknownRes.status, 1);

  const badIdeRes = runCli(['init', '--ide', 'vscode-unknown']);
  assert.equal(badIdeRes.status, 1);
  assert.match(badIdeRes.stderr, /tidak valid/);
});

test('Guard src === dest rejects init and update on KruAI source repo', () => {
  const initSelf = runCli(['init', '.']);
  assert.equal(initSelf.status, 1);
  assert.match(initSelf.stderr, /repositori sumber KruAI sendiri/);

  const updateSelf = runCli(['update', '.']);
  assert.equal(updateSelf.status, 1);
  assert.match(updateSelf.stderr, /repositori sumber KruAI sendiri/);
});

test('init creates clean .agents without internal docs/, 4-col glossary, and doctor validates 17/17', () => {
  const tmpDir = makeTempDir();
  try {
    const emptyDoctor = runCli(['doctor'], tmpDir);
    assert.equal(emptyDoctor.status, 1);

    const initRes = runCli(['init', tmpDir]);
    assert.equal(initRes.status, 0, initRes.stderr);

    assert.equal(fs.existsSync(path.join(tmpDir, '.agents', 'rules', 'team-protocol.md')), true);
    assert.equal(fs.existsSync(path.join(tmpDir, '.agents', 'docs')), false);
    assert.equal(fs.existsSync(path.join(tmpDir, 'docs', 'decisions.md')), true);

    const glossary = fs.readFileSync(path.join(tmpDir, 'docs', 'glossary.md'), 'utf8');
    assert.match(
      glossary,
      /\| Konsep \| Nama resmi \| Dipakai di \(UI \/ API \/ DB \/ kode\) \| Nama yang DILARANG \(alias lama\) \|/
    );

    const okDoctor = runCli(['doctor'], tmpDir);
    assert.equal(okDoctor.status, 0);
    assert.match(okDoctor.stdout, /17\/17 komponen aktif/);

    fs.rmSync(path.join(tmpDir, '.agents', 'skills', 'role-devops', 'SKILL.md'));
    const brokenDoctor = runCli(['doctor'], tmpDir);
    assert.equal(brokenDoctor.status, 1);
    assert.match(brokenDoctor.stdout, /16\/17 komponen aktif/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('update requires prior init and preserves custom roster tools & user docs', () => {
  const tmpDir = makeTempDir();
  try {
    const uninitUpdate = runCli(['update', tmpDir]);
    assert.equal(uninitUpdate.status, 1);
    assert.match(uninitUpdate.stderr, /belum ditemukan/);

    const initRes = runCli(['init', tmpDir]);
    assert.equal(initRes.status, 0);

    const rosterPath = path.join(tmpDir, '.agents', 'roster.md');
    const customRow = '| /custom-deploy | Deploy custom proyek | .agents/skills/custom-deploy/SKILL.md |';
    const updatedRoster = fs
      .readFileSync(rosterPath, 'utf8')
      .replace('| *(Belum ada tool lokal yang diadopsi)* | - | - |', customRow);
    fs.writeFileSync(rosterPath, updatedRoster, 'utf8');

    const decisionsPath = path.join(tmpDir, 'docs', 'decisions.md');
    fs.appendFileSync(decisionsPath, '\n## ADR-001: Keep custom note\n', 'utf8');

    const updateRes = runCli(['update', tmpDir]);
    assert.equal(updateRes.status, 0, updateRes.stderr);
    assert.match(updateRes.stdout, /Custom Project Tools di \.agents\/roster\.md dipertahankan/);

    assert.equal(fs.readFileSync(rosterPath, 'utf8').includes(customRow), true);
    assert.equal(fs.readFileSync(decisionsPath, 'utf8').includes('ADR-001: Keep custom note'), true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('Multi-IDE --ide all generates managed bridges and preserves custom unmanaged AGENTS.md', () => {
  const tmpDir = makeTempDir();
  try {
    const initAll = runCli(['init', tmpDir, '--ide', 'all']);
    assert.equal(initAll.status, 0, initAll.stderr);

    const agentsMdPath = path.join(tmpDir, 'AGENTS.md');
    const cursorRulePath = path.join(tmpDir, '.cursor', 'rules', 'kruai-protocol.mdc');
    const copilotPath = path.join(tmpDir, '.github', 'copilot-instructions.md');

    for (const filePath of [agentsMdPath, cursorRulePath, copilotPath]) {
      assert.equal(fs.existsSync(filePath), true, `Missing bridge file: ${filePath}`);
      const content = fs.readFileSync(filePath, 'utf8');
      assert.equal(content.includes('<!-- KRUAI:MANAGED -->'), true);
    }
    assert.match(fs.readFileSync(cursorRulePath, 'utf8'), /^---\r?\ndescription:/);

    // Modify managed cursor rule & replace AGENTS.md with custom unmanaged content
    fs.appendFileSync(cursorRulePath, '\n<!-- stale managed line -->\n', 'utf8');
    const customAgentsContent = '# My Custom Project AGENTS.md\nDo not overwrite me.\n';
    fs.writeFileSync(agentsMdPath, customAgentsContent, 'utf8');

    // Update without --ide still refreshes existing managed bridges and leaves custom AGENTS.md untouched
    const autoUpdateRes = runCli(['update', tmpDir]);
    assert.equal(autoUpdateRes.status, 0, autoUpdateRes.stderr);
    assert.equal(fs.readFileSync(agentsMdPath, 'utf8'), customAgentsContent);
    assert.equal(fs.readFileSync(cursorRulePath, 'utf8').includes('stale managed line'), false);

    // Update with --ide all preserves custom unmanaged AGENTS.md and logs preservation notice
    const updateAllRes = runCli(['update', tmpDir, '--ide', 'all']);
    assert.equal(updateAllRes.status, 0, updateAllRes.stderr);
    assert.equal(fs.readFileSync(agentsMdPath, 'utf8'), customAgentsContent);
    assert.match(updateAllRes.stdout, /AGENTS\.md kustom dipertahankan/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('--with-hooks installs disabled starter hooks.json and never overwrites user hooks.json', () => {
  const tmpDir = makeTempDir();
  try {
    const initRes = runCli(['init', tmpDir, '--with-hooks']);
    assert.equal(initRes.status, 0, initRes.stderr);

    const hooksPath = path.join(tmpDir, '.agents', 'hooks.json');
    assert.equal(fs.existsSync(hooksPath), true);

    const hooksJson = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    const hookEntries = Object.values(hooksJson);
    assert.equal(hookEntries.length >= 2, true);
    for (const hookCfg of hookEntries) {
      assert.equal(hookCfg.enabled, false);
    }

    // User modifies hooks.json; re-init / update with --with-hooks must preserve it
    hooksJson['kruai-destructive-command-guard'].enabled = true;
    fs.writeFileSync(hooksPath, JSON.stringify(hooksJson, null, 2), 'utf8');

    const updateRes = runCli(['update', tmpDir, '--with-hooks']);
    assert.equal(updateRes.status, 0, updateRes.stderr);
    assert.match(updateRes.stdout, /\.agents\/hooks\.json eksisting dipertahankan/);

    const afterHooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));
    assert.equal(afterHooks['kruai-destructive-command-guard'].enabled, true);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('All skills have valid YAML frontmatter matching folder names', () => {
  const skillsRoot = path.join(REPO_ROOT, '.agents', 'skills');
  const skillDirs = fs
    .readdirSync(skillsRoot, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  assert.equal(skillDirs.length, 9);

  for (const dirName of skillDirs) {
    const skillPath = path.join(skillsRoot, dirName, 'SKILL.md');
    assert.equal(fs.existsSync(skillPath), true, `Missing SKILL.md in ${dirName}`);
    const content = fs.readFileSync(skillPath, 'utf8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert.ok(fmMatch, `Invalid YAML frontmatter in ${dirName}/SKILL.md`);

    const nameMatch = fmMatch[1].match(/^name:\s*(.+)$/m);
    const descMatch = fmMatch[1].match(/^description:/m);
    assert.ok(nameMatch, `Missing name in ${dirName}/SKILL.md`);
    assert.equal(nameMatch[1].trim(), dirName);
    assert.ok(descMatch, `Missing description in ${dirName}/SKILL.md`);
  }
});

test('roster.md has 0 broken relative links and matches active skill folders', () => {
  const agentsDir = path.join(REPO_ROOT, '.agents');
  const rosterPath = path.join(agentsDir, 'roster.md');
  const rosterText = fs.readFileSync(rosterPath, 'utf8');

  const links = [...rosterText.matchAll(/\]\((\.\/[^)]+)\)/g)].map((m) => m[1]);
  assert.equal(links.length > 0, true);
  for (const relLink of links) {
    const resolved = path.resolve(agentsDir, relLink);
    assert.equal(fs.existsSync(resolved), true, `Broken link in roster.md: ${relLink}`);
  }

  const activeInRoster = new Set(
    [...rosterText.matchAll(/^\|\s*`\/(role-[a-z0-9-]+)`\s*\|\s*✅\s*\|/gm)].map((m) => m[1])
  );
  const skillFolders = new Set(
    fs
      .readdirSync(path.join(agentsDir, 'skills'), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
  );

  assert.deepEqual([...activeInRoster].sort(), [...skillFolders].sort());
});

test('templates/hooks.json is valid JSON, disabled by default, and guard script works', () => {
  const hooksTemplatePath = path.join(REPO_ROOT, '.agents', 'templates', 'hooks.json');
  const parsed = JSON.parse(fs.readFileSync(hooksTemplatePath, 'utf8'));

  for (const [name, cfg] of Object.entries(parsed)) {
    assert.equal(cfg.enabled, false, `Hook ${name} should be disabled by default`);
  }

  const guardCmd = parsed['kruai-destructive-command-guard'].PreToolUse[0].hooks[0].command;
  const unsafeOut = execFileSync(guardCmd, {
    shell: true,
    input: JSON.stringify({ toolCall: { args: { CommandLine: 'git push --force origin main' } } }),
    encoding: 'utf8',
  });
  assert.equal(JSON.parse(unsafeOut).decision, 'force_ask');

  const safeOut = execFileSync(guardCmd, {
    shell: true,
    input: JSON.stringify({ toolCall: { args: { CommandLine: 'npm test' } } }),
    encoding: 'utf8',
  });
  assert.equal(JSON.parse(safeOut).decision, 'allow');
});

test('Anti-regression checks across .agents/ and README.md', () => {
  const agentFiles = walkFiles(path.join(REPO_ROOT, '.agents')).filter((f) => f.endsWith('.md'));

  for (const filePath of agentFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    assert.equal(
      /NNN-asisten-to|# Handoff NNN/.test(content),
      false,
      `Legacy handoff pattern found in ${filePath}`
    );
    assert.equal(/150-300ms/.test(content), false, `Outdated 150-300ms timing found in ${filePath}`);
  }

  const readmeContent = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8');
  assert.equal(/150-300ms/.test(readmeContent), false);
  assert.equal(/role-init/.test(readmeContent), false);

  const backendSkill = fs.readFileSync(
    path.join(REPO_ROOT, '.agents', 'skills', 'role-backend', 'SKILL.md'),
    'utf8'
  );
  assert.equal(/vitest|package\.json/i.test(backendSkill), false);
});
