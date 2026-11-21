#!/usr/bin/env node
/* eslint-disable no-console, no-await-in-loop -- a command-line script whose steps run one after another */
/**
 * End-to-end check in an app outside the repo:
 *
 * 1. The CLI and the MCP server return the same text; the docs page names only commands and MCP tools that exist;
 *    `lint` and the Claude Code hook report a design problem.
 * 2. AGENTS.md points to the UI Kit rules in the installed uikit-tools, and upgrades
 *    reach agents without re-running init.
 *
 * Needs built packages: `npm run build -w packages/styles -w packages/core -w packages/tools`.
 * Usage: node packages/tools/scripts/e2e-outside-repo.ts [--keep]
 */
import {
  execFileSync,
  type ExecFileSyncOptionsWithStringEncoding,
} from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const repo = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../..",
);
const work = mkdtempSync(path.join(tmpdir(), "uikit-tools-e2e-"));
const packs = path.join(work, "packs");
const app = path.join(work, "app");
const keep = process.argv.includes("--keep");

const run = (
  cmd: string,
  args: string[],
  cwd: string,
  options: Partial<ExecFileSyncOptionsWithStringEncoding> = {},
) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
const tool = (
  args: string[],
  options?: Partial<ExecFileSyncOptionsWithStringEncoding>,
): { code: number; out: string; err?: string } => {
  try {
    return {
      code: 0,
      out: run("npx", ["--no-install", "uikit-tools", ...args], app, options),
    };
  } catch (error) {
    const failed = error as { status: number; stdout: string; stderr: string };
    return { code: failed.status, out: failed.stdout, err: failed.stderr };
  }
};

let failures = 0;
function assert(ok: boolean, message: string) {
  console.log(`${ok ? "✓" : "✗"} ${message}`);
  if (!ok) failures += 1;
}

function pack(workspace: string, destination: string) {
  mkdirSync(destination, { recursive: true });
  const out = run(
    "npm",
    ["pack", "-w", workspace, "--pack-destination", destination, "--json"],
    repo,
  );
  return path.join(destination, JSON.parse(out)[0].filename);
}

/** A tarball as a later release would ship it: new version, with `change` applied to its files. */
function upgraded(
  tgz: string,
  name: string,
  change: (dir: string, version: string) => void,
) {
  const dir = path.join(work, `${name}-next`);
  mkdirSync(dir, { recursive: true });
  run("tar", ["-xzf", tgz, "-C", dir], work);
  const pkgDir = path.join(dir, "package");
  const pkgFile = path.join(pkgDir, "package.json");
  const pkg = JSON.parse(readFileSync(pkgFile, "utf8"));
  pkg.version = `${pkg.version}-e2e.1`;
  writeFileSync(pkgFile, JSON.stringify(pkg, null, 2));
  change(pkgDir, pkg.version);
  const out = run("npm", ["pack", "--pack-destination", dir, "--json"], pkgDir);
  return {
    tgz: path.join(dir, JSON.parse(out)[0].filename),
    version: pkg.version,
  };
}

/** `session` with an MCP client connected to the app's `uikit-tools mcp`. */
async function withMcp<T>(session: (client: Client) => Promise<T>) {
  const transport = new StdioClientTransport({
    command: "sh",
    args: ["-c", `cd "${app}" && exec npx --no-install uikit-tools mcp`],
    stderr: "ignore",
  });
  const client = new Client(
    { name: "e2e", version: "0" },
    { capabilities: {} },
  );
  await client.connect(transport);
  try {
    return await session(client);
  } finally {
    await client.close();
  }
}

/** The tool names the app's MCP server offers. */
const mcpToolNames = () =>
  withMcp(async (client) =>
    (await client.listTools()).tools.map((t) => t.name),
  );

/** A tool call's text. */
const mcpCall = (name: string, args: Record<string, unknown>) =>
  withMcp(async (client) => {
    const result = await client.callTool({ name, arguments: args });
    return (result.content as { text: string }[]).map((c) => c.text).join("\n");
  });

try {
  console.log(`Working in ${work}`);
  const stylesTgz = pack("packages/styles", packs);
  const coreTgz = pack("packages/core", packs);
  const toolsTgz = pack("packages/tools", packs);

  mkdirSync(path.join(app, "src/pages/Assets"), { recursive: true });
  // a page with one design problem, for `lint` and the hook outside the repo
  writeFileSync(
    path.join(app, "src/pages/Assets/Assets.tsx"),
    'export const Assets = () => <button type="button">Add</button>;\n',
  );
  writeFileSync(
    path.join(app, "package.json"),
    JSON.stringify({ name: "e2e-app", private: true, type: "module" }),
  );
  // --legacy-peer-deps: lookups and checks don't need React or MUI installed
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--legacy-peer-deps",
      stylesTgz,
      coreTgz,
      toolsTgz,
    ],
    app,
  );

  // 1. CLI and MCP return the same result
  const pairs: [string[], string, Record<string, unknown>][] = [
    [["info", "HvDialog"], "get_component", { name: "HvDialog" }],
    [["components"], "list_components", {}],
    [
      ["components", "--limit", "5", "--offset", "10"],
      "list_components",
      { limit: 5, offset: 10 },
    ],
    [["rules"], "list_rules", {}],
    [["rule", "tokens/colors"], "get_rule", { id: "tokens/colors" }],
    [["tokens", "border"], "find_tokens", { query: "border" }],
    [["lint", "src"], "lint", { paths: ["src"] }],
  ];
  for (const [cli, mcp, args] of pairs) {
    const fromCli = tool(cli).out.trim();
    const fromMcp = (await mcpCall(mcp, args)).trim();
    assert(
      fromCli.length > 0 && fromCli === fromMcp,
      `uikit-tools ${cli.join(" ")} = MCP ${mcp} (${fromCli.length} chars)`,
    );
  }

  // The docs page names exactly the commands and MCP tools that exist
  const page = readFileSync(
    path.join(repo, "apps/docs/src/content/docs/working-with-ai.mdx"),
    "utf8",
  );
  const rows = page
    .split("\n")
    .filter((line) => /^\| .*`uikit-tools /.test(line));
  const documented = new Set(
    rows.map((line) => line.match(/`uikit-tools (\w+)/)?.[1] ?? ""),
  );
  const documentedTools = new Set(
    rows.flatMap((line) => {
      const cell = (line.split("|").at(-2) ?? "").trim();
      return cell.startsWith("`") ? [cell.replaceAll("`", "")] : [];
    }),
  );
  const help = tool(["--help"]).out;
  const commands = new Set(
    [...help.matchAll(/^ {2}(\w+)(?: |\[|<)/gm)]
      .map((m) => m[1])
      .filter((c) => c !== "help"),
  );
  const tools = new Set(await mcpToolNames());
  const same = (a: Set<string>, b: Set<string>) =>
    a.size === b.size && [...a].every((x) => b.has(x));
  assert(
    documented.size > 0 && [...documented].every((c) => commands.has(c)),
    `every command on the docs page exists: ${[...documented].join(", ")}`,
  );
  assert(
    same(documentedTools, tools),
    `the docs page lists the MCP tools: ${[...tools].join(", ")}`,
  );

  // Claude Code's hook: before the agent finishes, the project's findings go back to it (exit 2)
  const hooked = tool(["hook"], {
    input: JSON.stringify({ hook_event_name: "Stop", stop_hook_active: false }),
    env: { ...process.env, CLAUDE_PROJECT_DIR: app },
    stdio: ["pipe", "pipe", "pipe"],
  });
  assert(
    hooked.code === 2 && Boolean(hooked.err?.includes("uikit(raw-elements)")),
    "uikit-tools hook returns the project's design problems before the agent finishes",
  );

  // 2. init points at the installed rules; upgrades reach agents with no re-init
  const init = tool(["init"]);
  assert(init.code === 0, "init succeeds outside the repo");
  const agentsMd = readFileSync(path.join(app, "AGENTS.md"), "utf8");
  const ruleRefs = [...agentsMd.matchAll(/^@(.+\.md)$/gm)].map((m) => m[1]);
  const rulesDir = "node_modules/@pentaho/uikit-tools/templates/rules";
  assert(
    // every rule file but setup.md, which AGENTS.md points to instead
    ruleRefs.length ===
      readdirSync(path.join(repo, "packages/tools/templates/rules")).length -
        1 && ruleRefs.every((ref) => ref.startsWith(`${rulesDir}/`)),
    `AGENTS.md points at the ${ruleRefs.length} rule files in ${rulesDir}`,
  );
  assert(
    ruleRefs.every(
      (ref) =>
        readFileSync(path.join(app, ref), "utf8") ===
        readFileSync(
          path.join(repo, "packages/tools/templates/rules", path.basename(ref)),
          "utf8",
        ),
    ),
    "the rule files are the UI Kit rules as written",
  );
  assert(
    readFileSync(path.join(app, "CLAUDE.md"), "utf8").includes("@AGENTS.md"),
    "CLAUDE.md imports AGENTS.md",
  );

  const nextTools = upgraded(toolsTgz, "tools", (dir) => {
    const tokens = path.join(dir, "templates/rules/tokens.md");
    writeFileSync(
      tokens,
      `${readFileSync(tokens, "utf8")}\n<!-- e2e: upgraded rules -->\n`,
    );
  });
  const nextCore = upgraded(coreTgz, "core", (dir, version) => {
    const meta = path.join(dir, "dist/component-metadata.json");
    writeFileSync(
      meta,
      JSON.stringify({ ...JSON.parse(readFileSync(meta, "utf8")), version }),
    );
  });
  run(
    "npm",
    [
      "install",
      "--no-audit",
      "--no-fund",
      "--legacy-peer-deps",
      nextTools.tgz,
      nextCore.tgz,
    ],
    app,
  );
  assert(
    readFileSync(path.join(app, "AGENTS.md"), "utf8") === agentsMd,
    "AGENTS.md unchanged by the upgrades",
  );
  assert(
    readFileSync(path.join(app, rulesDir, "tokens.md"), "utf8").includes(
      "e2e: upgraded rules",
    ),
    `the rules AGENTS.md points at are the upgraded ones (${nextTools.version})`,
  );
  assert(
    tool(["components"]).out.includes(nextCore.version),
    `lookups read the upgraded UI Kit ${nextCore.version}`,
  );
} catch (error) {
  failures += 1;
  console.error((error as { stderr?: string }).stderr ?? error);
} finally {
  if (!keep) rmSync(work, { recursive: true, force: true });
}

console.log(
  failures === 0
    ? "\nAll end-to-end checks passed."
    : `\n${failures} end-to-end check(s) failed.`,
);
process.exit(failures === 0 ? 0 : 1);
