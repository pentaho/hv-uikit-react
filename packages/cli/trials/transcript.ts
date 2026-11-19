/**
 * A trial's metrics from the agent's Claude Code transcript: either the session file Claude Code keeps
 * (`~/.claude/projects/<folder>/<session>.jsonl`) or the `--output-format stream-json` output `run.ts` writes, which
 * it stamps with a `timestamp` per line.
 */

export interface Tokens {
  input: number;
  cacheWrite: number;
  cacheRead: number;
  output: number;
}

export interface Metrics {
  /** The first and last timestamps, ISO. */
  start?: string;
  end?: string;
  minutes?: number;
  /** The model that answered most of the agent's messages. */
  model?: string;
  /** Unique `tool_use` ids. */
  calls: number;
  /** Each API message counted once (by `message.id`), its last usage kept; a stream-json result's usage if any. */
  tokens: Tokens;
  /** What Claude Code reported: the session's `cost-state` or the stream's `result`. */
  costUsd?: number;
  /** The agent ran `npm run check` itself. */
  ranCheck: boolean;
  /** Bash commands (or tools) that took screenshots. */
  screenshots: number;
}

interface Usage {
  input_tokens?: number;
  cache_creation_input_tokens?: number;
  cache_read_input_tokens?: number;
  output_tokens?: number;
}

interface Block {
  type?: string;
  id?: string;
  name?: string;
  input?: { command?: unknown };
}

interface Entry {
  type?: string;
  uuid?: string;
  timestamp?: string;
  model?: string;
  total_cost_usd?: number;
  usage?: Usage;
  totalCostUSD?: number;
  message?: { id?: string; model?: string; usage?: Usage; content?: unknown };
}

const SHOT_COMMAND = /screenshot|playwright|chromium/i;

export function readTranscript(text: string): Metrics {
  const times: number[] = [];
  const usages = new Map<string, Usage>();
  const models = new Map<string, string>();
  const tools = new Set<string>();
  let initModel: string | undefined;
  let costUsd: number | undefined;
  let resultUsage: Usage | undefined;
  let ranCheck = false;
  let screenshots = 0;

  for (const line of text.split("\n")) {
    let entry: Entry;
    try {
      entry = JSON.parse(line) as Entry;
    } catch {
      continue; // blank or cut short
    }
    if (typeof entry !== "object" || entry === null) continue;
    const time = entry.timestamp ? Date.parse(entry.timestamp) : Number.NaN;
    if (!Number.isNaN(time)) times.push(time);

    if (entry.type === "system" && entry.model) initModel ??= entry.model;
    if (entry.type === "result" && typeof entry.total_cost_usd === "number")
      costUsd = entry.total_cost_usd;
    if (entry.type === "result" && entry.usage) resultUsage = entry.usage;
    if (entry.type === "cost-state" && typeof entry.totalCostUSD === "number")
      costUsd = entry.totalCostUSD;

    const message = entry.message;
    if (entry.type !== "assistant" || !message) continue;
    const id = message.id ?? entry.uuid ?? `line ${times.length}`;
    if (message.usage) usages.set(id, message.usage);
    if (message.model && message.model !== "<synthetic>")
      models.set(id, message.model);
    const blocks = Array.isArray(message.content)
      ? (message.content as Block[])
      : [];
    for (const block of blocks) {
      if (block.type !== "tool_use" || !block.id || tools.has(block.id))
        continue;
      tools.add(block.id);
      const command =
        typeof block.input?.command === "string" ? block.input.command : "";
      if (/\bnpm run check\b/.test(command)) ranCheck = true;
      if (SHOT_COMMAND.test(command) || /screenshot/i.test(block.name ?? ""))
        screenshots += 1;
    }
  }

  const tokens: Tokens = { input: 0, cacheWrite: 0, cacheRead: 0, output: 0 };
  // stream-json's messages carry their usage as of their first block; its result line has the whole run's
  for (const usage of resultUsage ? [resultUsage] : usages.values()) {
    tokens.input += usage.input_tokens ?? 0;
    tokens.cacheWrite += usage.cache_creation_input_tokens ?? 0;
    tokens.cacheRead += usage.cache_read_input_tokens ?? 0;
    tokens.output += usage.output_tokens ?? 0;
  }
  const counts = new Map<string, number>();
  for (const model of models.values())
    counts.set(model, (counts.get(model) ?? 0) + 1);
  const model =
    [...counts].toSorted((a, b) => b[1] - a[1])[0]?.[0] ?? initModel;

  const first = times.length ? Math.min(...times) : undefined;
  const last = times.length ? Math.max(...times) : undefined;
  return {
    start: first === undefined ? undefined : new Date(first).toISOString(),
    end: last === undefined ? undefined : new Date(last).toISOString(),
    minutes:
      first === undefined || last === undefined
        ? undefined
        : Math.round((last - first) / 60_000),
    model,
    calls: tools.size,
    tokens,
    costUsd,
    ranCheck,
    screenshots,
  };
}

/** 4_738_972 → 4.7M, 21_605 → 22k. */
export function compact(n: number): string {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${Math.round(n / 1e3)}k`;
  return String(n);
}

/** The RESULTS.md cell: `108 in · 4.7M cr · 122k cw · 22k out`. */
export const tokensCell = (tokens: Tokens) =>
  `${compact(tokens.input)} in · ${compact(tokens.cacheRead)} cr · ${compact(tokens.cacheWrite)} cw · ${compact(tokens.output)} out`;
