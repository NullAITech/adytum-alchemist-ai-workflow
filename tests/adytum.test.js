import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { getAllKeys, getKey, generateProjectInvariants, validatePlan } from '../src/core/adytum.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const binPath = path.resolve(__dirname, '../bin/adytum.js');

describe('Adytum Core 22-Key Ageless Wisdom Engine', () => {
  test('loads all 22 canonical keys', () => {
    const keys = getAllKeys();
    assert.equal(keys.length, 22);
    assert.equal(keys[0].name, 'The Fool');
    assert.equal(keys[0].letter, 'Aleph');
    assert.equal(keys[21].name, 'The World');
    assert.equal(keys[21].letter, 'Tav');
  });

  test('retrieves individual key by index', () => {
    const magician = getKey(1);
    assert.ok(magician);
    assert.equal(magician.name, 'The Magician');
    assert.equal(magician.letter, 'Beth');
    assert.equal(magician.gematria, 2);

    const invalid = getKey(99);
    assert.equal(invalid, null);
  });

  test('generates 22 project invariants', () => {
    const inv = generateProjectInvariants('Zoth Enclave', 'Air-gapped security');
    assert.equal(inv.projectName, 'Zoth Enclave');
    assert.equal(inv.invariants.length, 22);
    assert.ok(inv.invariants[0].rule.includes('Potentiality'));
  });

  test('validates incomplete plans as failing the gate', () => {
    const weakPlan = 'todo: build an app';
    const result = validatePlan(weakPlan);
    assert.equal(result.passed, false);
    assert.ok(result.score < 50);
    assert.ok(result.blockers.length > 0);
  });

  test('validates hardened plans as passing with high score', () => {
    const strongPlan = `
      # Architecture Specification
      - Scope & Goal: Build an air-gapped zero-egress cryptographic memory daemon.
      - State & Memory: In-memory vector store with no disk leaks.
      - Invariants & Rules: Strict schema validation contracts.
      - Tradeoffs: Exclude cloud sync; bounded local sandbox.
      - Resilience: Graceful error catch and fallback recovery.
      - Verification: Deterministic test suite with 100% test coverage.
      - Budget & Metrics: Equilibrated memory under 30MB RAM.
      - Cleanup: Prune and clean stale cache on exit.
      - Logging: Transparent stdout logging.
      - Release: Integration release gate passing.
      - Sovereignty: Local-first offline autonomy.
    `;
    const result = validatePlan(strongPlan);
    assert.equal(result.passed, true);
    assert.ok(result.score >= 90);
    assert.equal(result.blockers.length, 0);
  });
});

describe('Adytum CLI & MCP Server Endpoints', () => {
  test('CLI list command outputs valid JSON with --json', () => {
    const stdout = execFileSync(binPath, ['list', '--json'], { encoding: 'utf8' });
    const keys = JSON.parse(stdout);
    assert.equal(Array.isArray(keys), true);
    assert.equal(keys.length, 22);
  });

  test('CLI key command outputs valid Key details', () => {
    const stdout = execFileSync(binPath, ['key', '4', '--json'], { encoding: 'utf8' });
    const emperor = JSON.parse(stdout);
    assert.equal(emperor.key, 4);
    assert.equal(emperor.name, 'The Emperor');
    assert.equal(emperor.letter, 'Heh');
  });

  test('CLI validate command outputs structured evaluation', () => {
    let stdout;
    try {
      stdout = execFileSync(binPath, ['validate', 'package.json', '--json'], { encoding: 'utf8' });
    } catch (err) {
      // Exit code 2 is expected when the file does not meet the 70% threshold
      assert.equal(err.status, 2);
      stdout = err.stdout;
    }
    const report = JSON.parse(stdout);
    assert.ok(typeof report.score === 'number');
    assert.ok(Array.isArray(report.checks));
    assert.equal(report.passed, false);
  });

  test('MCP stdio server handles initialize and tool calls', () => {
    const initReq = JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
    const callReq = JSON.stringify({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'adytum_get_key', arguments: { keyNumber: 7 } }
    });

    const stdout = execFileSync(binPath, ['mcp'], {
      input: `${initReq}\n${callReq}\n`,
      encoding: 'utf8'
    });

    const lines = stdout.trim().split('\n').filter(Boolean);
    assert.ok(lines.length >= 2);

    const initRes = JSON.parse(lines[0]);
    assert.equal(initRes.id, 1);
    assert.equal(initRes.result.serverInfo.name, 'adytum-alchemist-ai-workflow');

    const callRes = JSON.parse(lines[1]);
    assert.equal(callRes.id, 2);
    const textContent = JSON.parse(callRes.result.content[0].text);
    assert.equal(textContent.name, 'The Chariot');
    assert.equal(textContent.letter, 'Cheth');
  });
});
