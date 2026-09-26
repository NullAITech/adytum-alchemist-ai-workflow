# ⚡ Adytum Alchemist AI Workflow

<p align="center">
  <strong>22-Key Hermetic Ageless Wisdom Planning Rite, Invariant Gatekeeper &amp; Model Context Protocol (MCP) Server</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Security-Zero--Egress%20Air--Gapped-1e8e3e?style=for-the-badge&logoColor=white" alt="Zero-Egress">
  <img src="https://img.shields.io/badge/MCP-Protocol%202.0-9334e6?style=for-the-badge&logo=anthropic&logoColor=white" alt="MCP Ready">
  <img src="https://img.shields.io/badge/Node.js-18%20--%2026+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node Support">
  <img src="https://img.shields.io/badge/Local%20Models-Ollama%20%2F%20vLLM-blue?style=for-the-badge" alt="Local Models">
  <img src="https://img.shields.io/badge/License-Apache%202.0-202124?style=for-the-badge" alt="License">
</p>

---

## 🌟 Overview

**Adytum Alchemist AI Workflow** is an architectural planning discipline, local gatekeeper CLI, and autonomous agent MCP server based on the **22 Major Keys of Ageless Wisdom** (BOTA lineage).

It replaces ad-hoc prompt iteration and unverified coding agent loops with a deterministic **22-step planning rite**:
1. **Intention Formulation (Key 0 The Fool)**
2. **Single-Pointed Focus (Key 1 The Magician)**
3. **Memory & State Invariants (Key 2 The High Priestess)**
4. **Air-Gapped Isolation & Sandboxing (Key 7 The Chariot)**
5. **Deterministic Verification Tests (Key 9 The Hermit)**
6. **Elimination of Mock State (Key 15 The Devil)**
7. **Sovereign Wholeness & Zero-Egress Proof (Key 21 The World)**

It exposes both an interactive CLI (`adytum`), a native Model Context Protocol (MCP) server for AI pair programmers (Claude Desktop, Cursor, Cline, Hermes Agent, OpenCode), and an initiation web cockpit.

---

## 🚀 Key Highlights

- 🛡️ **22-Point Hermetic Invariant Engine:** Audits engineering plans, PRDs, and subagent goals against rigorous structural invariants before code is written.
- 🤖 **Model Context Protocol (MCP) Server:** Exposes 4 standardized tool endpoints (`adytum_list_keys`, `adytum_get_key`, `adytum_validate_plan`, `adytum_generate_invariants`) over stdio for autonomous AI agents.
- ⚡ **Zero-Cloud Local Model First:** Natively evaluates plans using local Ollama (`http://127.0.0.1:11434`) models (Qwen 2.5 Coder, Llama 3.1, DeepSeek-Coder) with optional Anthropic Claude & OpenAI cloud fallback.
- 💻 **Standalone CLI Binary (`adytum`):** Inspect keys, evaluate plans from stdin, and generate project invariants directly in the terminal with `--json` support.
- 🎨 **Zoth Aesthetic Dark UI:** Built with Obsidian Black (`#08080B`) and Sovereign Gold (`#D4AF37`) palette with timed meditation reflection gates.

---

## 📦 Installation & Quickstart

```bash
# Clone the repository
git clone https://github.com/NullAITech/adytum-alchemist-ai-workflow.git
cd adytum-alchemist-ai-workflow

# Install dependencies
npm install

# Run automated test suite
npm test

# Link CLI binary globally (optional)
npm link
```

---

## 🛠️ CLI Usage

```bash
# List all 22 Ageless Wisdom Keys and their engineering invariants
adytum list

# Output full canonical keys in machine-readable JSON
adytum list --json

# Inspect a specific Key (0 to 21)
adytum key 0
adytum key 7 --json

# Generate a 22-point deterministic quality checklist for your project
adytum invariants "MyAuthEnclave"
adytum invariants "MyAuthEnclave" --json

# Audit a plan or PRD against the 22 hermetic quality invariants
adytum validate ./plan.md
cat architectural_spec.json | adytum validate - --json
```

---

## 🤖 Model Context Protocol (MCP) Setup

Connect Adytum directly to your AI agent workflows (Claude Desktop, Cursor, Cline, Hermes Agent, OpenCode):

Add to your `claude_desktop_config.json` or Cursor MCP settings:

```json
{
  "mcpServers": {
    "adytum": {
      "command": "node",
      "args": ["/path/to/adytum-alchemist-ai-workflow/bin/adytum.js", "mcp"],
      "env": {
        "ZOTH_ZERO_EGRESS": "true"
      }
    }
  }
}
```

### Available MCP Tools:
- `adytum_list_keys`: List all 22 Hermetic Keys with Hebrew letters and core invariants.
- `adytum_get_key`: Retrieve deep canonical symbolism, gematria, and reflection prompts for any Key (0–21).
- `adytum_validate_plan`: Validate a software proposal, PRD, or plan text against the 22 invariants.
- `adytum_generate_invariants`: Generate a 22-point invariant checklist for any project.

---

## 🧪 Automated Testing

Adytum uses Node's native test runner with zero third-party test framework overhead:

```bash
npm test
```

Expected output:
```text
▶ Adytum Core 22-Key Ageless Wisdom Engine
  ✔ loads all 22 canonical keys
  ✔ retrieves individual key by index
  ✔ generates 22 project invariants
  ✔ validates incomplete plans as failing the gate
  ✔ validates hardened plans as passing with high score
✔ Adytum Core 22-Key Ageless Wisdom Engine
▶ Adytum CLI & MCP Server Endpoints
  ✔ CLI list command outputs valid JSON with --json
  ✔ CLI key command outputs valid Key details
  ✔ CLI validate command outputs structured evaluation
  ✔ MCP stdio server handles initialize and tool calls
✔ Adytum CLI & MCP Server Endpoints
```

---

## 🌐 Web Dashboard

To run the interactive web interface:

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 📜 License

Apache 2.0. Built for the sovereign agent ecosystem.
Part of the **NullAI & ZothOS Sovereign Tool Matrix**.
