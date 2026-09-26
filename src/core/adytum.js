import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fallback metadata for all 22 keys
const CANONICAL_KEYS_METADATA = [
  { key: 0, name: "The Fool", letter: "Aleph", signification: "Cultural Power, Life-Breath, Creative Energy", color: "Yellow", note: "E", gematria: 1, astrology: "Air", invariant: "Pure Potentiality & Unbounded Ideation" },
  { key: 1, name: "The Magician", letter: "Beth", signification: "House, Location, Attention, Direct Will", color: "Yellow", note: "E", gematria: 2, astrology: "Mercury", invariant: "Focused Intention & Single-Pointed Execution" },
  { key: 2, name: "The High Priestess", letter: "Gimel", signification: "Camel, Memory, Subconscious Storage", color: "Blue", note: "G#", gematria: 3, astrology: "Moon", invariant: "Cryptographic Memory & Zero-Leak Storage" },
  { key: 3, name: "The Empress", letter: "Daleth", signification: "Door, Creative Imagination, Fertility", color: "Green", note: "F#", gematria: 4, astrology: "Venus", invariant: "Generative Architecture & Organic Scalability" },
  { key: 4, name: "The Emperor", letter: "Heh", signification: "Window, Sight, Constitution, Governance", color: "Red", note: "C", gematria: 5, astrology: "Aries", invariant: "Immutable Invariants & Structural Governance" },
  { key: 5, name: "The Hierophant", letter: "Vav", signification: "Nail, Intuition, Unified Schema", color: "Red-Orange", note: "C#", gematria: 6, astrology: "Taurus", invariant: "Standardized Contracts & Semantic Schemas" },
  { key: 6, name: "The Lovers", letter: "Zain", signification: "Sword, Discrimination, Critical Choice", color: "Orange", note: "D", gematria: 7, astrology: "Gemini", invariant: "Binary Tradeoff Discipline & Clean Boundaries" },
  { key: 7, name: "The Chariot", letter: "Cheth", signification: "Fence, Enclosure, Receptive Armor", color: "Orange-Yellow", note: "D#", gematria: 8, astrology: "Cancer", invariant: "Air-Gapped Isolation & Sandbox Enclosures" },
  { key: 8, name: "Strength", letter: "Teth", signification: "Serpent, Digestion, Subconscious Control", color: "Yellow", note: "E", gematria: 9, astrology: "Leo", invariant: "Graceful Error Handling & Self-Healing Loops" },
  { key: 9, name: "The Hermit", letter: "Yod", signification: "Hand, Guidance, Isolated Introspection", color: "Yellow-Green", note: "F", gematria: 10, astrology: "Virgo", invariant: "Deterministic Verification & Zero-Dependency Audits" },
  { key: 10, name: "Wheel of Fortune", letter: "Kaph", signification: "Grasping Hand, Cyclical Rhythm, State Loops", color: "Violet", note: "A#", gematria: 20, astrology: "Jupiter", invariant: "State Loop Determinism & Replayability" },
  { key: 11, name: "Justice", letter: "Lamed", signification: "Ox-Goad, Equilibrium, Balanced Metrics", color: "Green", note: "F#", gematria: 30, astrology: "Libra", invariant: "Strict Verification Tests & Equilibrated Budgets" },
  { key: 12, name: "The Hanged Man", letter: "Mem", signification: "Water, Inverted Perspective, Surrender", color: "Blue", note: "G#", gematria: 40, astrology: "Water", invariant: "Asynchronous Non-Blocking Flow & Calm Pacing" },
  { key: 13, name: "Death", letter: "Nun", signification: "Fish, Transformation, Pruning Dead State", color: "Blue-Green", note: "G", gematria: 50, astrology: "Scorpio", invariant: "Ruthless Cruft Pruning & Resource Cleanup" },
  { key: 14, name: "Temperance", letter: "Samekh", signification: "Tent-Peg, Verification, Harmonious Synthesis", color: "Blue", note: "G#", gematria: 60, astrology: "Sagittarius", invariant: "Rate-Limiting & High-Concurrence Harmony" },
  { key: 15, name: "The Devil", letter: "Ayin", signification: "Eye, Surface Illusion, Material Traps", color: "Indigo", note: "A", gematria: 70, astrology: "Capricorn", invariant: "Anti-Deception Audit & Elimination of Mock State" },
  { key: 16, name: "The Tower", letter: "Peh", signification: "Mouth, Sudden Illumination, Lightning Break", color: "Scarlet", note: "C", gematria: 80, astrology: "Mars", invariant: "Chaos Resilience & Graceful Crash Recovery" },
  { key: 17, name: "The Star", letter: "Tzaddi", signification: "Fish-Hook, Meditation, Clear Intuition", color: "Violet", note: "A#", gematria: 90, astrology: "Aquarius", invariant: "Transparent Telemetry & Clear Logging" },
  { key: 18, name: "The Moon", letter: "Qoph", signification: "Back of Head, Somatic Instinct, Cellular Memory", color: "Red-Violet", note: "B", gematria: 100, astrology: "Pisces", invariant: "Deep Synaptic Retention & Subconscious Caches" },
  { key: 19, name: "The Sun", letter: "Resh", signification: "Head, Radiance, Regenerated Mastery", color: "Orange", note: "D", gematria: 200, astrology: "Sun", invariant: "Production-Grade Elegance & High-Fidelity UI" },
  { key: 20, name: "Judgement", letter: "Shin", signification: "Tooth, Transmutation, Final Realization", color: "Scarlet", note: "C", gematria: 300, astrology: "Fire", invariant: "Comprehensive Integration Sentinel & Release Gate" },
  { key: 21, name: "The World", letter: "Tav", signification: "Mark, Signature, Wholeness, Complete Cycle", color: "Indigo", note: "A", gematria: 400, astrology: "Saturn", invariant: "Hermetic Sovereign Wholeness & Zero-Egress Proof" }
];

let cachedKeys = null;

export function getInfoFilePath() {
  const candidates = [
    path.resolve(__dirname, '../../public/tarot/info.txt'),
    path.resolve(process.cwd(), 'public/tarot/info.txt'),
    path.resolve(__dirname, '../public/tarot/info.txt'),
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

export function parseInfoText(text) {
  const keys = [];
  const sections = text.split(/(?=Name\s*\n\s*\n)/gi);

  for (let i = 0; i < CANONICAL_KEYS_METADATA.length; i++) {
    const meta = CANONICAL_KEYS_METADATA[i];
    let symbolism = '';

    // Search for symbolism snippet matching the key
    const rx = new RegExp(`symbolism of (?:the )?${meta.name.replace(/the /i, '')}`, 'i');
    const match = text.match(rx);
    if (match && match.index !== undefined) {
      symbolism = text.slice(match.index, match.index + 1200).replace(/\n\s*\n/g, '\n\n').trim();
    }

    keys.push({
      ...meta,
      symbolism: symbolism || `Symbolic resonance of ${meta.name} (${meta.letter}): ${meta.signification}. Enforces the ${meta.invariant} invariant.`
    });
  }

  return keys;
}

export function getAllKeys() {
  if (cachedKeys) return cachedKeys;
  const infoPath = getInfoFilePath();
  if (infoPath) {
    try {
      const content = fs.readFileSync(infoPath, 'utf8');
      cachedKeys = parseInfoText(content);
      return cachedKeys;
    } catch {
      // Fallback
    }
  }
  cachedKeys = CANONICAL_KEYS_METADATA.map((k) => ({
    ...k,
    symbolism: `Hermetic symbolism of ${k.name} representing ${k.signification} under the astrological sign of ${k.astrology}.`
  }));
  return cachedKeys;
}

export function getKey(num) {
  const keys = getAllKeys();
  const index = parseInt(num, 10);
  if (isNaN(index) || index < 0 || index >= keys.length) {
    return null;
  }
  return keys[index];
}

/**
 * Generate 22 Hermetic Invariants for a software project
 */
export function generateProjectInvariants(projectName = "Project", intention = "") {
  const keys = getAllKeys();
  return {
    projectName,
    intention: intention || "Autonomous, deterministic software system with zero telemetry leak.",
    timestamp: new Date().toISOString(),
    invariants: keys.map((k) => ({
      key: k.key,
      name: k.name,
      letter: k.letter,
      rule: k.invariant,
      guidance: `Verify ${k.signification.toLowerCase()} discipline across architecture.`,
      status: 'MANDATORY'
    }))
  };
}

/**
 * Validates a software plan or specification against the 22 Hermetic Invariants
 */
export function validatePlan(planText = "", options = {}) {
  const keys = getAllKeys();
  const text = (planText || '').toLowerCase();
  const checks = [];
  let scoreTotal = 0;

  // Key heuristics for sovereign architectural planning
  const rules = [
    { key: 0, test: () => text.length > 50, label: "Intention & Purpose Defined", weight: 5 },
    { key: 1, test: () => text.includes('scope') || text.includes('goal') || text.includes('objective'), label: "Single-Pointed Focus (Beth)", weight: 5 },
    { key: 2, test: () => text.includes('memory') || text.includes('store') || text.includes('cache') || text.includes('state'), label: "State & Memory Integrity (Gimel)", weight: 5 },
    { key: 4, test: () => text.includes('invariant') || text.includes('rule') || text.includes('constraint'), label: "Immutable Invariants Enforced (Heh)", weight: 5 },
    { key: 5, test: () => text.includes('schema') || text.includes('json') || text.includes('contract') || text.includes('type'), label: "Standardized Schemas & Interfaces (Vav)", weight: 5 },
    { key: 6, test: () => text.includes('tradeoff') || text.includes('boundary') || text.includes('exclude'), label: "Explicit Tradeoffs & Non-Goals (Zain)", weight: 4 },
    { key: 7, test: () => text.includes('isolate') || text.includes('air-gap') || text.includes('sandbox') || text.includes('zero-egress') || text.includes('local'), label: "Air-Gapped Isolation & Sandbox (Cheth)", weight: 6 },
    { key: 8, test: () => text.includes('error') || text.includes('fail') || text.includes('catch') || text.includes('resilien'), label: "Graceful Error Handling (Teth)", weight: 5 },
    { key: 9, test: () => text.includes('test') || text.includes('audit') || text.includes('verify'), label: "Deterministic Verification Test Suite (Yod)", weight: 6 },
    { key: 11, test: () => text.includes('budget') || text.includes('metric') || text.includes('eval') || text.includes('benchmark'), label: "Performance & Budget Equilibrated (Lamed)", weight: 4 },
    { key: 13, test: () => text.includes('clean') || text.includes('prune') || text.includes('remove') || text.includes('purge'), label: "Resource Pruning & Cleanup (Nun)", weight: 4 },
    { key: 15, test: () => !text.includes('placeholder') && !text.includes('mock_production') && !text.includes('fake_data'), label: "Truth In Advertising / No Fake State (Ayin)", weight: 6 },
    { key: 17, test: () => text.includes('log') || text.includes('telemetry') || text.includes('trace') || text.includes('stdout'), label: "Clear Logging & Diagnostics (Tzaddi)", weight: 4 },
    { key: 20, test: () => text.includes('release') || text.includes('deploy') || text.includes('deliver') || text.includes('ci'), label: "Integration Gate & Release Verification (Shin)", weight: 5 },
    { key: 21, test: () => !text.includes('cloud-only') && (text.includes('offline') || text.includes('local-first') || text.includes('sovereign')), label: "Sovereign Wholeness & Local Autonomy (Tav)", weight: 5 }
  ];

  for (const r of rules) {
    const passed = r.test();
    if (passed) scoreTotal += r.weight;
    const keyMeta = keys.find((k) => k.key === r.key);
    checks.push({
      keyNumber: r.key,
      keyName: keyMeta?.name || `Key ${r.key}`,
      rule: r.label,
      passed,
      weight: r.weight,
      recommendation: passed ? null : `Incorporate explicit ${r.label.toLowerCase()} into specification.`
    });
  }

  const normalizedScore = Math.min(100, Math.round((scoreTotal / 70) * 100));
  const passedGate = normalizedScore >= 70;

  return {
    passed: passedGate,
    score: normalizedScore,
    grade: normalizedScore >= 90 ? 'A+' : normalizedScore >= 80 ? 'A' : normalizedScore >= 70 ? 'B' : 'NEEDS_REVISION',
    summary: passedGate
      ? "Specification passes the Hermetic Quality Gate. Architecture is robust, testable, and bounded."
      : "Specification fails required hermetic invariants. Address missing verification tests, boundaries, and isolation guarantees.",
    checks,
    blockers: checks.filter((c) => !c.passed).map((c) => c.recommendation)
  };
}

/**
 * Universal model query helper (supports Ollama, Claude, and OpenAI)
 */
export async function queryModel({ prompt, systemPrompt = "You are the Adytum Alchemist Gatekeeper.", provider = "ollama", model = "llama3.1:8b", apiKey = "", baseUrl = "http://127.0.0.1:11434" }) {
  if (provider === 'ollama' || provider === 'ollama_local') {
    const url = `${baseUrl.replace(/\/$/, '')}/api/generate`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: model || 'llama3.1:8b',
        prompt,
        system: systemPrompt,
        stream: false
      })
    });
    if (!res.ok) throw new Error(`Ollama error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.response;
  }

  if (provider === 'openai') {
    const url = 'https://api.openai.com/v1/chat/completions';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey || process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ]
      })
    });
    if (!res.ok) throw new Error(`OpenAI error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices[0]?.message?.content || '';
  }

  if (provider === 'claude' || provider === 'anthropic') {
    const url = 'https://api.anthropic.com/v1/messages';
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model || 'claude-3-5-sonnet-20241022',
        system: systemPrompt,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }]
      })
    });
    if (!res.ok) throw new Error(`Anthropic error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content[0]?.text || '';
  }

  throw new Error(`Unsupported model provider: ${provider}`);
}
