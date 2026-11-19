import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadMetadata } from "../core/metadata.js";

export interface InitOptions {
  /** Comma-separated agent names, or `all`; default claude and copilot. */
  agents?: string;
}

const TOOLS = "@pentaho/uikit-tools";
/** The UI Kit rule files in `templates/rules`, in reading order. */
export const RULE_FILES = [
  "principles.md",
  "setup.md",
  "tokens.md",
  "content.md",
  "accessibility.md",
  "components.md",
  "forms.md",
  "layout.md",
  "actions.md",
  "anti-patterns.md",
  "workflow.md",
];
const START = "<!-- uikit-tools:start -->";
const END = "<!-- uikit-tools:end -->";
const SERVER = { command: "npx", args: ["--no-install", "uikit-tools", "mcp"] };
const HOOK = "npx --no-install uikit-tools hook";
/** What Claude Code may run without asking: the read-only lookups and MCP tools. */
const CLAUDE_ALLOW = [
  "Bash(npx --no-install uikit-tools info *)",
  "Bash(npx --no-install uikit-tools components*)",
  "Bash(npx --no-install uikit-tools rule *)",
  "Bash(npx --no-install uikit-tools rules)",
  "Bash(npx --no-install uikit-tools tokens*)",
  "Bash(npx --no-install uikit-tools lint*)",
  "mcp__hv-uikit",
];
const CODEX_SERVER = `[mcp_servers.hv-uikit]\ncommand = "npx"\nargs = ["--no-install", "uikit-tools", "mcp"]\n`;
/** The Agent Skills this package ships (`skills/<name>/SKILL.md`); Claude Code gets a copy in `.claude/skills`. */
const SKILLS_DIR = fileURLToPath(new URL("../../skills", import.meta.url));
export const SKILLS = readdirSync(SKILLS_DIR).toSorted();

/** The AGENTS.md block: pointers to the rules shipped in the installed uikit-tools, never a copy. */
export function agentsBlock(rulesPath: string) {
  const toolsPath = rulesPath.replace(/\/templates\/rules$/, "");
  return [
    START,
    "## HV UI Kit",
    "",
    "This app's UI is built with HV UI Kit. Before writing or changing UI, read the UI Kit design rules. They ship with the installed `@pentaho/uikit-tools`, so they are always the version this project uses:",
    "",
    ...RULE_FILES.map((file) => `@${rulesPath}/${file}`),
    "",
    "- Look up a component before using it: `npx --no-install uikit-tools info <Component>`; a token by what it's for: `npx --no-install uikit-tools tokens <word>`.",
    "- For a component's exact types, open the declaration file `info` names (`node_modules/@pentaho/uikit-react-core/dist/<Component>/<Component>.d.ts`), not the package's `index.d.ts`.",
    "- If your tool doesn't load the files above, list the rules with `npx --no-install uikit-tools rules` (MCP: `list_rules`) and read each with `rule <id>` (MCP: `get_rule`).",
    "- The `hv-uikit` MCP server answers the same lookups: `list_components`, `get_component`, `list_rules`, `get_rule`, `find_tokens` and `lint`.",
    "- Check what you changed with `npx --no-install uikit-tools lint <paths>` (MCP: `lint`) and fix every finding; `uikit-tools rule <id>` explains the rule a finding cites.",
    "",
    "Skills, for work in Figma (Claude Code loads them from `.claude/skills`):",
    "",
    ...SKILLS.map(
      (name) => `- \`${name}\`: ${toolsPath}/skills/${name}/SKILL.md`,
    ),
    "",
    "This block is written by `uikit-tools init`. Re-run it instead of editing the block.",
    END,
  ].join("\n");
}

/** Insert or replace the block, keeping everything else in the file. */
export function upsertBlock(existing: string, block: string) {
  const start = existing.indexOf(START);
  const end = start === -1 ? -1 : existing.indexOf(END, start);
  if (start !== -1 && end < start) {
    throw new Error(
      `AGENTS.md has "${START}" without a matching "${END}". Fix the block by hand and run init again.`,
    );
  }
  if (start !== -1) {
    return `${existing.slice(0, start)}${block}${existing.slice(end + END.length)}`;
  }
  const trimmed = existing.trimEnd();
  return `${trimmed}${trimmed ? "\n\n" : ""}${block}\n`;
}

export interface InitResult {
  written: string[];
  /** Path from the project to the rule files, through node_modules. */
  rulesPath: string;
}

/**
 * Path from `dir` to the installed uikit-tools' rules through `node_modules/@pentaho/uikit-tools`,
 * never through the resolved real path: pnpm's real path contains the version
 * (`node_modules/.pnpm/@pentaho+uikit-tools@1.0.0/...`), which an upgrade removes.
 */
function rulesPointer(dir: string) {
  for (let base = dir; ; base = path.dirname(base)) {
    const linked = path.join(base, "node_modules", ...TOOLS.split("/"));
    if (existsSync(path.join(linked, "templates", "rules"))) {
      return path
        .relative(dir, path.join(linked, "templates", "rules"))
        .split(path.sep)
        .join("/");
    }
    if (path.dirname(base) === base) break;
  }
  throw new Error(
    `Couldn't find node_modules/${TOOLS}/templates/rules from ${dir}. Install ${TOOLS} in the project: npm i -D ${TOOLS}`,
  );
}

type Json = Record<string, any>;
/** A file's new text from its current one ("" when missing). */
type Edit = (old: string) => string;

const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/**
 * JSON with comments and trailing commas, as VS Code's and Gemini's settings allow: both are dropped, since the file is
 * rewritten as plain JSON.
 */
const parseJsonc = (text: string) =>
  JSON.parse(
    text
      .replaceAll(
        /("(?:[^"\\]|\\.)*")|\/\/[^\n]*|\/\*[\s\S]*?\*\//g,
        (_, str) => str ?? "",
      )
      .replaceAll(
        /("(?:[^"\\]|\\.)*")|,(\s*[\]}])/g,
        (_, str, end) => str ?? end,
      ),
  ) as Json;

/** A JSON file edited in place; one that isn't valid JSON (with comments) stops init before anything is written. */
const editJson =
  (file: string, edit: (config: Json) => Json): Edit =>
  (old) => {
    if (!old.trim()) return json(edit({}));
    try {
      return json(edit(parseJsonc(old)));
    } catch (error) {
      throw new Error(
        `Cannot update ${file}: it is not valid JSON. Fix or remove it and run init again.`,
        { cause: error },
      );
    }
  };

/** The `hv-uikit` server under `key` (mcpServers, servers), keeping the others. */
const withServer = (key: string, server: Json) => (config: Json) => ({
  ...config,
  [key]: { ...config[key], "hv-uikit": server },
});

/** `line` (importing AGENTS.md) appended once. */
const withLine =
  (line: string): Edit =>
  (old) =>
    old.split("\n").some((l) => l.trim() === line)
      ? old
      : `${old.trimEnd()}${old.trim() ? "\n\n" : ""}${line}\n`;

const union = (list: string[] | undefined, more: string[]) => [
  ...new Set([...(list ?? []), ...more]),
];

/** Claude Code's settings: the lint hook after each edit, and the read-only lookups pre-approved. */
function claudeSettings(settings: Json): Json {
  const post: Json[] = settings.hooks?.PostToolUse ?? [];
  const hasHook = post.some((h) =>
    h.hooks?.some((x: Json) => x.command === HOOK),
  );
  const hook = {
    matcher: "Write|Edit|MultiEdit",
    hooks: [{ type: "command", command: HOOK, timeout: 30 }],
  };
  return {
    ...settings,
    permissions: {
      ...settings.permissions,
      allow: union(settings.permissions?.allow, CLAUDE_ALLOW),
    },
    hooks: {
      ...settings.hooks,
      PostToolUse: hasHook ? post : [...post, hook],
    },
  };
}

const skillText = (name: string) =>
  readFileSync(path.join(SKILLS_DIR, name, "SKILL.md"), "utf8");

/** Each agent's own files. Every agent reads AGENTS.md; these add the MCP server and what the agent loads itself. */
const AGENTS: Record<string, [file: string, edit: Edit][]> = {
  claude: [
    ["CLAUDE.md", withLine("@AGENTS.md")],
    [
      ".mcp.json",
      editJson(
        ".mcp.json",
        withServer("mcpServers", { type: "stdio", ...SERVER }),
      ),
    ],
    [
      ".claude/settings.json",
      editJson(".claude/settings.json", claudeSettings),
    ],
    ...SKILLS.map((name): [string, Edit] => [
      `.claude/skills/${name}/SKILL.md`,
      () => skillText(name),
    ]),
  ],
  copilot: [
    [
      ".vscode/mcp.json",
      editJson(
        ".vscode/mcp.json",
        withServer("servers", { type: "stdio", ...SERVER }),
      ),
    ],
  ],
  cursor: [
    [
      ".cursor/mcp.json",
      editJson(".cursor/mcp.json", withServer("mcpServers", SERVER)),
    ],
  ],
  codex: [
    [
      ".codex/config.toml",
      (old) =>
        /^\[mcp_servers\.hv-uikit\]/m.test(old)
          ? old
          : `${old.trimEnd()}${old.trim() ? "\n\n" : ""}${CODEX_SERVER}`,
    ],
  ],
  gemini: [
    ["GEMINI.md", withLine("@./AGENTS.md")],
    [
      ".gemini/settings.json",
      editJson(".gemini/settings.json", withServer("mcpServers", SERVER)),
    ],
  ],
};
export const AGENT_NAMES = Object.keys(AGENTS);

function agentsNamed(named = "claude,copilot") {
  if (named === "all") return AGENT_NAMES;
  const agents = named.split(",").map((a) => a.trim());
  const unknown = agents.filter((a) => !AGENTS[a]);
  if (unknown.length > 0)
    throw new Error(
      `Unknown agent "${unknown.join(", ")}". Use: ${AGENT_NAMES.join(", ")}, or all.`,
    );
  return agents;
}

export function runInit(
  targetDir: string,
  options: InitOptions = {},
): InitResult {
  const dir = path.resolve(targetDir);
  const agents = agentsNamed(options.agents);

  // The lookups read the installed UI Kit; fail now rather than on the agent's first lookup.
  loadMetadata({ cwd: dir });
  const rulesPath = rulesPointer(dir);
  const edits: [string, Edit][] = [
    ["AGENTS.md", (old) => upsertBlock(old, agentsBlock(rulesPath))],
    ...agents.flatMap((a) => AGENTS[a]),
  ];

  // Work out every file before writing any, so a bad file can't leave a half-done setup.
  const changes = edits.flatMap(([file, edit]) => {
    const abs = path.join(dir, file);
    const old = existsSync(abs) ? readFileSync(abs, "utf8") : "";
    const next = edit(old);
    return next === old ? [] : [{ file, abs, next }];
  });
  for (const { abs, next } of changes) {
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, next);
  }
  return { written: changes.map((c) => c.file), rulesPath };
}

export function init(targetDir: string | undefined, options: InitOptions) {
  try {
    const { written, rulesPath } = runInit(targetDir ?? ".", options);
    process.stdout.write(
      [
        "✓ HV UI Kit agent setup",
        ...written.map((file) => `  wrote ${file}`),
        `  rules: ${rulesPath} (from the installed uikit-tools; upgrades update them, no need to re-run init)`,
        "",
      ].join("\n"),
    );
  } catch (error) {
    process.stderr.write(
      `✗ ${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exitCode = 2;
  }
}
