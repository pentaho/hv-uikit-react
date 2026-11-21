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
  /** Also the `hv-uikit` MCP server (the same lookups as the CLI), for agents that prefer tools to commands. */
  mcp?: boolean;
  /** Also the skills for Figma screens and design reviews. */
  figma?: boolean;
}

const TOOLS = "@pentaho/uikit-tools";
/** The UI Kit rule files in `templates/rules`, in reading order; `setup.md` only by pointer, since a project from
 * the UI Kit's templates is already set up. */
export const RULE_FILES = [
  "principles.md",
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
  "Bash(npx --no-install uikit-tools components *)",
  "Bash(npx --no-install uikit-tools rule *)",
  "Bash(npx --no-install uikit-tools rules)",
  "Bash(npx --no-install uikit-tools tokens *)",
  "Bash(npx --no-install uikit-tools lint *)",
  "Bash(npm run shots *)",
  "Bash(npx --no-install uikit-cli shots *)",
];
const CODEX_SERVER = `[mcp_servers.hv-uikit]\ncommand = "npx"\nargs = ["--no-install", "uikit-tools", "mcp"]\n`;
/** The Agent Skills this package ships (`skills/<name>/`); init copies them where the agents load skills. */
const SKILLS_DIR = fileURLToPath(new URL("../../skills", import.meta.url));
export const SKILLS = readdirSync(SKILLS_DIR).toSorted();
/** The skills a project gets: the plugin ones only in a Pentaho plugin (it has a plugin.json), the Figma ones only with `--figma`. */
const skillsFor = (figma = false, plugin = false) =>
  SKILLS.filter(
    (name) =>
      (figma || !name.startsWith("pentaho-figma")) &&
      (plugin || !name.startsWith("pentaho-plugin")),
  );

/** The AGENTS.md block: pointers to the rules shipped in the installed uikit-tools, never a copy. */
export function agentsBlock(
  rulesPath: string,
  {
    mcp = false,
    figma = false,
    plugin = false,
  }: Pick<InitOptions, "mcp" | "figma"> & { plugin?: boolean } = {},
) {
  const toolsPath = rulesPath.replace(/\/templates\/rules$/, "");
  const skills = skillsFor(figma, plugin);
  return [
    START,
    "",
    "## HV UI Kit",
    "",
    "This app's UI is built with HV UI Kit. Before writing or changing UI, read the UI Kit design rules. They ship with the installed `@pentaho/uikit-tools`, so they are always the version this project uses:",
    "",
    ...RULE_FILES.map((file) => `@${rulesPath}/${file}`),
    "",
    "- Look up a component before using it: `npx --no-install uikit-tools info <Component>`, or several at once (`info HvTable HvPagination`); a token by what it's for: `npx --no-install uikit-tools tokens <word>`.",
    "- For a component's exact types, open the declaration file `info` names (`node_modules/@pentaho/uikit-react-core/dist/<Component>/<Component>.d.ts`), not the package's `index.d.ts`.",
    `- If your tool doesn't load the files above, read them in one command: \`cat ${rulesPath}/*.md\`.`,
    `- A project without HV UI Kit set up yet (provider, fonts, styles): \`${rulesPath}/setup.md\`.`,
    ...(mcp
      ? [
          "- The `hv-uikit` MCP server answers the same lookups: `list_components`, `get_component`, `list_rules`, `get_rule`, `find_tokens` and `lint`.",
        ]
      : []),
    "- Check what you changed with `npx --no-install uikit-tools lint <paths>` and fix every finding; `uikit-tools rule uikit/<name>` explains the lint rule a finding cites.",
    "",
    ...(skills.length
      ? [
          "Skills (init copies them to `.claude/skills` or `.agents/skills`):",
          "",
          ...skills.map(
            (name) => `- \`${name}\`: ${toolsPath}/skills/${name}/SKILL.md`,
          ),
          "",
        ]
      : []),
    "This block is written by `uikit-tools init`. Re-run it instead of editing the block.",
    "",
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

/** JSON as Prettier prints it: short arrays of strings or numbers on one line, so a formatted project stays formatted. */
const json = (value: unknown) =>
  `${JSON.stringify(value, null, 2).replaceAll(
    /^( *)(.*)\[\n((?:\s*(?:"(?:[^"\\]|\\.)*"|-?\d[\d.e+-]*),?\n)+)\s*\]/gm,
    (whole, indent: string, head: string, items: string) => {
      const line = `${indent}${head}[${items
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .join(" ")}]`;
      return line.length <= 80 ? line : whole;
    },
  )}\n`;

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

const hasOurHook = (entries: Json[] | undefined) =>
  (entries ?? []).some((h) => h.hooks?.some((x: Json) => x.command === HOOK));

/**
 * Claude Code's settings: the design-rule lint when the agent finishes (a `Stop` hook: it sees every file however it
 * was written, which an after-edit hook doesn't), the read-only lookups pre-approved, and the MCP tools with `--mcp`.
 * An after-edit hook from an earlier init is replaced.
 */
const claudeSettings =
  (mcp: boolean) =>
  (settings: Json): Json => {
    const { PostToolUse, Stop, ...otherHooks } = settings.hooks ?? {};
    const post = (PostToolUse as Json[] | undefined)?.filter(
      (h) => !hasOurHook([h]),
    );
    const stop: Json[] = Stop ?? [];
    return {
      ...settings,
      permissions: {
        ...settings.permissions,
        allow: union(settings.permissions?.allow, [
          ...CLAUDE_ALLOW,
          ...(mcp ? ["mcp__hv-uikit"] : []),
        ]),
      },
      hooks: {
        ...otherHooks,
        ...(post?.length ? { PostToolUse: post } : {}),
        Stop: hasOurHook(stop)
          ? stop
          : [
              ...stop,
              { hooks: [{ type: "command", command: HOOK, timeout: 60 }] },
            ],
      },
    };
  };

/** Each agent's own files beyond AGENTS.md, which every agent reads. */
const AGENTS: Record<string, (mcp: boolean) => [file: string, edit: Edit][]> = {
  claude: (mcp) => [
    ["CLAUDE.md", withLine("@AGENTS.md")],
    [
      ".claude/settings.json",
      editJson(".claude/settings.json", claudeSettings(mcp)),
    ],
  ],
  copilot: () => [],
  cursor: () => [],
  codex: () => [],
  gemini: () => [["GEMINI.md", withLine("@./AGENTS.md")]],
};

/** Each agent's MCP config, with `--mcp`. */
const MCP: Record<string, [file: string, edit: Edit][]> = {
  claude: [
    [
      ".mcp.json",
      editJson(
        ".mcp.json",
        withServer("mcpServers", { type: "stdio", ...SERVER }),
      ),
    ],
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
    [
      ".gemini/settings.json",
      editJson(".gemini/settings.json", withServer("mcpServers", SERVER)),
    ],
  ],
};
export const AGENT_NAMES = Object.keys(AGENTS);

/**
 * Where the agents load project skills: Claude Code `.claude/skills`; Codex and Gemini `.agents/skills`; Copilot and
 * Cursor either, so `.agents/skills` only when Claude Code's copy isn't there.
 */
function skillFiles(
  agents: string[],
  figma = false,
  plugin = false,
): [string, Edit][] {
  const claude = agents.includes("claude");
  const dirs = [
    ...(claude ? [".claude/skills"] : []),
    ...(agents.some((a) => a === "codex" || a === "gemini") ||
    (!claude && agents.length > 0)
      ? [".agents/skills"]
      : []),
  ];
  // every file of a skill: SKILL.md and the references it points to
  const files = skillsFor(figma, plugin).flatMap((name) =>
    readdirSync(path.join(SKILLS_DIR, name), {
      recursive: true,
      encoding: "utf8",
    })
      .filter((file) => file.endsWith(".md"))
      .map((file) => `${name}/${file.split(path.sep).join("/")}`),
  );
  return dirs.flatMap((dir) =>
    files.map((file): [string, Edit] => [
      `${dir}/${file}`,
      () => readFileSync(path.join(SKILLS_DIR, ...file.split("/")), "utf8"),
    ]),
  );
}

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
  const plugin = existsSync(path.join(dir, "plugin.json"));
  const edits: [string, Edit][] = [
    [
      "AGENTS.md",
      (old) => upsertBlock(old, agentsBlock(rulesPath, { ...options, plugin })),
    ],
    ...agents.flatMap((a) => [
      ...AGENTS[a](Boolean(options.mcp)),
      ...(options.mcp ? MCP[a] : []),
    ]),
    ...skillFiles(agents, options.figma, plugin),
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
        `  rules: ${rulesPath} (from the installed uikit-tools; upgrades update them; re-run init after one to refresh the copied skills)`,
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
