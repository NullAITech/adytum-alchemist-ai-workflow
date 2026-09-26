#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getAllKeys, getKey, validatePlan, generateProjectInvariants } from '../src/core/adytum.js';
import { runMcpServer } from '../src/mcp/server.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GOLD = '\x1b[38;2;212;175;55m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const GRAY = '\x1b[90m';

function banner() {
  console.log(`\n${GOLD}${BOLD}⚡ ADYTUM ALCHEMIST // HERMETIC PLANNING ENGINE${RESET}`);
  console.log(`${GRAY}22-Key Sovereign Planning Rite & Invariant Gatekeeper${RESET}\n`);
}

function printHelp() {
  banner();
  console.log(`${BOLD}USAGE:${RESET}`);
  console.log(`  adytum <command> [options]\n`);
  console.log(`${BOLD}COMMANDS:${RESET}`);
  console.log(`  ${CYAN}desktop${RESET}                   Launch the sovereign Electron desktop workstation`);
  console.log(`  ${CYAN}web${RESET}                       Start the local web server on http://127.0.0.1:8103`);
  console.log(`  ${CYAN}list${RESET}                      List all 22 Ageless Wisdom Keys and Invariants`);
  console.log(`  ${CYAN}key <0-21>${RESET}                Display canonical symbolism and attributes for a Key`);
  console.log(`  ${CYAN}validate <file>${RESET}           Audit a software architecture / plan against the 22 invariants`);
  console.log(`  ${CYAN}invariants [name]${RESET}         Generate a 22-point deterministic quality checklist`);
  console.log(`  ${CYAN}mcp${RESET}                       Run Model Context Protocol (MCP) server over stdio for AI agents`);
  console.log(`  ${CYAN}version${RESET}                   Display current engine version\n`);
  console.log(`${BOLD}OPTIONS:${RESET}`);
  console.log(`  ${GRAY}--json${RESET}                    Output machine-readable JSON (ideal for AI agent pipelines)`);
  console.log(`  ${GRAY}--help${RESET}                    Display this help message\n`);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const isJson = args.includes('--json');

  if (!command || command === '--help' || command === '-h' || command === 'help') {
    printHelp();
    process.exit(0);
  }

  if (command === '--version' || command === '-v' || command === 'version') {
    console.log('adytum-alchemist-ai-workflow v1.0.0');
    process.exit(0);
  }

  if (command === 'web' || command === '--web') {
    console.log('⚡ Launching Adytum Alchemist Web UI on http://127.0.0.1:8103 ...');
    const rootDir = path.resolve(__dirname, '..');
    const child = spawn('node', ['server/serve.js'], {
      cwd: rootDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        PORT: '8103',
        ZOTH_ZERO_EGRESS: 'true',
      },
    });
    return;
  }

  if (command === 'desktop' || command === 'app' || command === 'gui' || command === '--desktop' || command === '--gui' || command === '--app') {
    console.log('⚡ Launching Adytum Alchemist Desktop Workstation...');
    const rootDir = path.resolve(__dirname, '..');
    const candidateElectronPaths = [
      path.join(rootDir, 'node_modules', '.bin', 'electron'),
      '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-micro-repos/NullAI-HexStrike-AI-Terminal/node_modules/.bin/electron',
      '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-micro-repos/promptmaster-studio/node_modules/.bin/electron',
      '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-micro-repos/jwt-inspector-guard/node_modules/.bin/electron',
      '/media/neo/f2fdda77-178b-4603-ae80-c7aa4cd97908/zoth-micro-repos/envguard-secrets-vault/node_modules/.bin/electron',
    ];

    let electronCmd = 'electron';
    for (const p of candidateElectronPaths) {
      if (fs.existsSync(p)) {
        electronCmd = p;
        break;
      }
    }

    const child = spawn(electronCmd, ['.'], {
      cwd: rootDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        ELECTRON_ENABLE_LOGGING: '1',
        ZOTH_ZERO_EGRESS: 'true',
      },
    });

    child.on('error', (err) => {
      console.warn(`[Adytum] Electron notice: ${err.message}. Starting web UI on port 8103...`);
      spawn('node', ['server/serve.js'], {
        cwd: rootDir,
        stdio: 'inherit',
        env: {
          ...process.env,
          PORT: '8103',
          ZOTH_ZERO_EGRESS: 'true',
        },
      });
    });
    return;
  }

  if (command === 'mcp') {
    runMcpServer();
    return;
  }

  if (command === 'list') {
    const keys = getAllKeys();
    if (isJson) {
      console.log(JSON.stringify(keys, null, 2));
      return;
    }

    banner();
    for (const k of keys) {
      const numStr = String(k.key).padStart(2, ' ');
      console.log(`  ${GOLD}${numStr}${RESET}  ${BOLD}${k.name.padEnd(20)}${RESET} ${CYAN}${k.letter.padEnd(8)}${RESET} ${GRAY}${k.invariant}${RESET}`);
    }
    console.log(`\n${GREEN}✔ 22 Hermetic Keys active & verified.${RESET}\n`);
    return;
  }

  if (command === 'key') {
    const num = args[1];
    if (num === undefined) {
      console.error(`${RED}Error: Specify a key number between 0 and 21.${RESET}`);
      process.exit(1);
    }

    const key = getKey(num);
    if (!key) {
      console.error(`${RED}Error: Key ${num} not found. Must be between 0 and 21.${RESET}`);
      process.exit(1);
    }

    if (isJson) {
      console.log(JSON.stringify(key, null, 2));
      return;
    }

    banner();
    console.log(`${BOLD}KEY ${key.key}: ${key.name.toUpperCase()}${RESET}`);
    console.log(`  Hebrew Letter  : ${CYAN}${key.letter}${RESET} (Gematria: ${key.gematria})`);
    console.log(`  Signification  : ${key.signification}`);
    console.log(`  Astrology      : ${key.astrology}`);
    console.log(`  Color & Note   : ${key.color} / Note ${key.note}`);
    console.log(`  Core Invariant : ${GOLD}${key.invariant}${RESET}`);
    console.log(`\n${BOLD}CANONICAL SYMBOLISM:${RESET}\n`);
    console.log(key.symbolism);
    console.log('');
    return;
  }

  if (command === 'invariants') {
    const name = args.find((a, i) => i > 0 && !a.startsWith('--')) || 'Sovereign Module';
    const inv = generateProjectInvariants(name);

    if (isJson) {
      console.log(JSON.stringify(inv, null, 2));
      return;
    }

    banner();
    console.log(`${BOLD}22 HERMETIC INVARIANTS: ${name.toUpperCase()}${RESET}\n`);
    for (const item of inv.invariants) {
      console.log(`  ${GOLD}[Key ${String(item.key).padStart(2, ' ')}]${RESET} ${BOLD}${item.rule}${RESET}`);
      console.log(`           ${GRAY}${item.guidance}${RESET}`);
    }
    console.log(`\n${GREEN}✔ Invariants generated for ${name}.${RESET}\n`);
    return;
  }

  if (command === 'validate') {
    const fileArg = args.find((a, i) => i > 0 && !a.startsWith('--'));
    let content = '';

    if (!fileArg || fileArg === '-') {
      // Read from stdin
      content = fs.readFileSync(0, 'utf8');
    } else {
      if (!fs.existsSync(fileArg)) {
        console.error(`${RED}Error: File not found: ${fileArg}${RESET}`);
        process.exit(1);
      }
      content = fs.readFileSync(fileArg, 'utf8');
    }

    const result = validatePlan(content);

    if (isJson) {
      console.log(JSON.stringify(result, null, 2));
      process.exit(result.passed ? 0 : 2);
    }

    banner();
    console.log(`${BOLD}HERMETIC QUALITY GATE REPORT${RESET}`);
    console.log(`Score: ${result.passed ? GREEN : RED}${result.score}/100 (Grade: ${result.grade})${RESET}\n`);

    for (const c of result.checks) {
      const mark = c.passed ? `${GREEN}✔ PASS${RESET}` : `${RED}✖ FAIL${RESET}`;
      console.log(`  ${mark}  ${c.keyName.padEnd(20)} ${GRAY}${c.rule}${RESET}`);
    }

    if (result.blockers.length > 0) {
      console.log(`\n${RED}${BOLD}UNRESOLVED INVARIANT BLOCKERS:${RESET}`);
      for (const b of result.blockers) {
        console.log(`  ${RED}•${RESET} ${b}`);
      }
    }

    console.log(`\n${result.passed ? GREEN : RED}${result.summary}${RESET}\n`);
    process.exit(result.passed ? 0 : 2);
  }

  console.error(`${RED}Unknown command: "${command}". Run "adytum --help" to inspect commands.${RESET}`);
  process.exit(1);
}

main().catch((err) => {
  console.error(`${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
