import readline from 'node:readline';
import { getAllKeys, getKey, validatePlan, generateProjectInvariants } from '../core/adytum.js';

export function runMcpServer() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const sendResponse = (id, result = null, error = null) => {
    const payload = { jsonrpc: '2.0', id };
    if (error) {
      payload.error = error;
    } else {
      payload.result = result;
    }
    process.stdout.write(JSON.stringify(payload) + '\n');
  };

  rl.on('line', (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    let req;
    try {
      req = JSON.parse(trimmed);
    } catch {
      sendResponse(null, null, { code: -32700, message: 'Parse error' });
      return;
    }

    const { id, method, params } = req;

    if (method === 'initialize') {
      sendResponse(id, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        serverInfo: {
          name: 'adytum-alchemist-ai-workflow',
          version: '1.0.0'
        }
      });
      return;
    }

    if (method === 'notifications/initialized') {
      // client acknowledgment, no response needed
      return;
    }

    if (method === 'ping') {
      sendResponse(id, {});
      return;
    }

    if (method === 'tools/list') {
      sendResponse(id, {
        tools: [
          {
            name: 'adytum_list_keys',
            description: 'List all 22 Hermetic Ageless Wisdom Keys (0 Fool through 21 World) with Hebrew letters and core invariants.',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'adytum_get_key',
            description: 'Get deep canonical symbolism, Hebrew letter, gematria, and reflection prompt for any Key (0 to 21).',
            inputSchema: {
              type: 'object',
              properties: {
                keyNumber: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 21,
                  description: 'Key Number between 0 and 21'
                }
              },
              required: ['keyNumber']
            }
          },
          {
            name: 'adytum_validate_plan',
            description: 'Validate an engineering plan, architectural proposal, or PRD against the 22 Hermetic Quality Invariants.',
            inputSchema: {
              type: 'object',
              properties: {
                planText: {
                  type: 'string',
                  description: 'Full text or markdown of the architectural specification'
                }
              },
              required: ['planText']
            }
          },
          {
            name: 'adytum_generate_invariants',
            description: 'Generate a 22-point deterministic quality invariant checklist for a project.',
            inputSchema: {
              type: 'object',
              properties: {
                projectName: {
                  type: 'string',
                  description: 'Name of the project or module'
                },
                intention: {
                  type: 'string',
                  description: 'High-level purpose and goals'
                }
              },
              required: ['projectName']
            }
          }
        ]
      });
      return;
    }

    if (method === 'tools/call') {
      const { name, arguments: args = {} } = params || {};

      try {
        if (name === 'adytum_list_keys') {
          const keys = getAllKeys().map((k) => ({
            key: k.key,
            name: k.name,
            letter: k.letter,
            signification: k.signification,
            invariant: k.invariant
          }));
          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify(keys, null, 2) }]
          });
          return;
        }

        if (name === 'adytum_get_key') {
          const key = getKey(args.keyNumber);
          if (!key) {
            sendResponse(id, null, { code: -32602, message: `Key ${args.keyNumber} not found (must be 0-21)` });
            return;
          }
          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify(key, null, 2) }]
          });
          return;
        }

        if (name === 'adytum_validate_plan') {
          const result = validatePlan(args.planText);
          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
          });
          return;
        }

        if (name === 'adytum_generate_invariants') {
          const inv = generateProjectInvariants(args.projectName, args.intention);
          sendResponse(id, {
            content: [{ type: 'text', text: JSON.stringify(inv, null, 2) }]
          });
          return;
        }

        sendResponse(id, null, { code: -32601, message: `Tool not found: ${name}` });
      } catch (err) {
        sendResponse(id, null, { code: -32000, message: err.message || 'Execution error' });
      }
      return;
    }

    sendResponse(id, null, { code: -32601, message: `Method not found: ${method}` });
  });
}
