import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  AGENT_NAMES,
  agentsBlock,
  RULE_FILES,
  runInit,
  SKILLS,
  upsertBlock,
} from "./init.js";

const created: string[] = [];
/** A temp folder outside the repo, removed after each test. */
function tempDir(prefix: string) {
  const dir = mkdtempSync(path.join(tmpdir(), prefix));
  created.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of created.splice(0))
    rmSync(dir, { recursive: true, force: true });
});

/** A fake app with core's component metadata and uikit-tools' rules installed, outside the repo. */
function makeApp() {
  const dir = tempDir("uikit-tools-init-");
  const core = path.join(dir, "node_modules/@pentaho/uikit-react-core");
  mkdirSync(path.join(core, "dist"), { recursive: true });
  writeFileSync(
    path.join(dir, "package.json"),
    JSON.stringify({ name: "app", private: true }),
  );
  writeFileSync(
    path.join(core, "package.json"),
    JSON.stringify({
      name: "@pentaho/uikit-react-core",
      version: "7.0.0",
      type: "module",
      exports: { "./package.json": "./package.json" },
    }),
  );
  writeFileSync(
    path.join(core, "dist/component-metadata.json"),
    JSON.stringify({
      schemaVersion: 1,
      version: "7.0.0",
      generatedAt: "",
      components: [],
    }),
  );
  const rules = path.join(
    dir,
    "node_modules/@pentaho/uikit-tools/templates/rules",
  );
  mkdirSync(rules, { recursive: true });
  for (const file of RULE_FILES)
    writeFileSync(path.join(rules, file), "# rules\n");
  return dir;
}

const read = (dir: string, file: string) =>
  readFileSync(path.join(dir, file), "utf8");

describe("init", () => {
  let app: string;
  beforeEach(() => {
    app = makeApp();
  });

  it("points to every installed rule file, not a copy", () => {
    runInit(app);
    const agents = read(app, "AGENTS.md");
    for (const file of RULE_FILES) {
      expect(agents).toContain(
        `@node_modules/@pentaho/uikit-tools/templates/rules/${file}`,
      );
    }
    expect(agents).not.toContain("# rules");
    expect(read(app, "CLAUDE.md")).toBe("@AGENTS.md\n");
  });

  it("registers the MCP server for Claude Code and Copilot", () => {
    mkdirSync(path.join(app, ".vscode"));
    writeFileSync(
      path.join(app, ".vscode/mcp.json"),
      JSON.stringify({ servers: { other: { command: "x" } } }),
    );
    runInit(app);
    const server = {
      type: "stdio",
      command: "npx",
      args: ["--no-install", "uikit-tools", "mcp"],
    };
    expect(JSON.parse(read(app, ".mcp.json")).mcpServers["hv-uikit"]).toEqual(
      server,
    );
    const vscode = JSON.parse(read(app, ".vscode/mcp.json")).servers;
    expect(vscode["hv-uikit"]).toEqual(server);
    expect(vscode.other).toEqual({ command: "x" });
  });

  it("reads settings with comments and trailing commas, as VS Code writes them", () => {
    mkdirSync(path.join(app, ".vscode"));
    writeFileSync(
      path.join(app, ".vscode/mcp.json"),
      '{\n  // mine\n  "servers": { "other": { "command": "x // not a comment" }, },\n}\n',
    );
    runInit(app);
    expect(JSON.parse(read(app, ".vscode/mcp.json")).servers.other).toEqual({
      command: "x // not a comment",
    });
  });

  it("keeps the rest of AGENTS.md and CLAUDE.md and is idempotent", () => {
    writeFileSync(path.join(app, "AGENTS.md"), "# My app\n\nUse pnpm.\n");
    writeFileSync(path.join(app, "CLAUDE.md"), "Be brief.\n");
    runInit(app);
    const once = {
      agents: read(app, "AGENTS.md"),
      claude: read(app, "CLAUDE.md"),
    };
    runInit(app);
    expect(read(app, "AGENTS.md")).toBe(once.agents);
    expect(read(app, "CLAUDE.md")).toBe(once.claude);
    expect(
      once.agents.startsWith(
        "# My app\n\nUse pnpm.\n\n<!-- uikit-tools:start -->",
      ),
    ).toBe(true);
    expect(once.claude).toBe("Be brief.\n\n@AGENTS.md\n");
  });

  it("tells the agent how to look things up", () => {
    const block = agentsBlock("r");
    expect(block).toContain("uikit-tools info");
    expect(block).toContain("uikit-tools rules");
    expect(block).toContain("uikit-tools lint");
  });

  it("gives Claude Code the lint hook, read-only lookups and the skills", () => {
    mkdirSync(path.join(app, ".claude"));
    writeFileSync(
      path.join(app, ".claude/settings.json"),
      JSON.stringify({ permissions: { allow: ["Bash(ls)"] } }),
    );
    runInit(app);
    runInit(app);
    const settings = JSON.parse(read(app, ".claude/settings.json"));
    expect(settings.permissions.allow).toContain("Bash(ls)");
    expect(settings.permissions.allow).toContain("mcp__hv-uikit");
    expect(settings.hooks.PostToolUse).toEqual([
      {
        matcher: "Write|Edit|MultiEdit",
        hooks: [
          {
            type: "command",
            command: "npx --no-install uikit-tools hook",
            timeout: 30,
          },
        ],
      },
    ]);
    expect(SKILLS).toEqual(["pentaho-figma-review", "pentaho-figma-screens"]);
    for (const name of SKILLS) {
      expect(read(app, `.claude/skills/${name}/SKILL.md`)).toContain(
        `name: ${name}`,
      );
      expect(read(app, "AGENTS.md")).toContain(
        `node_modules/@pentaho/uikit-tools/skills/${name}/SKILL.md`,
      );
    }
  });

  it("sets up every agent with all, and writes nothing new the second time", () => {
    const { written } = runInit(app, { agents: "all" });
    expect(AGENT_NAMES).toEqual([
      "claude",
      "copilot",
      "cursor",
      "codex",
      "gemini",
    ]);
    expect(written).toEqual(
      expect.arrayContaining([
        ".cursor/mcp.json",
        ".codex/config.toml",
        "GEMINI.md",
        ".gemini/settings.json",
      ]),
    );
    expect(read(app, ".codex/config.toml")).toContain("[mcp_servers.hv-uikit]");
    expect(read(app, "GEMINI.md")).toBe("@./AGENTS.md\n");
    expect(
      JSON.parse(read(app, ".cursor/mcp.json")).mcpServers["hv-uikit"].command,
    ).toBe("npx");
    expect(runInit(app, { agents: "all" }).written).toEqual([]);
  });

  it("rejects an unknown agent", () => {
    expect(() => runInit(app, { agents: "vim" })).toThrow(
      /Unknown agent "vim"/,
    );
  });

  it("can target one agent", () => {
    const { written } = runInit(app, { agents: "copilot" });
    expect(written).toEqual(["AGENTS.md", ".vscode/mcp.json"]);
  });

  it("fails clearly when the UI Kit has no component metadata", () => {
    const bare = tempDir("uikit-tools-bare-");
    writeFileSync(path.join(bare, "package.json"), "{}");
    expect(() => runInit(bare)).toThrow(/component metadata/);
  });

  it("finds its end marker after its start, not a stray one before", () => {
    const text = `<!-- uikit-tools:end -->\n${agentsBlock("old/rules")}\n`;
    expect(upsertBlock(text, agentsBlock("new/rules"))).toContain("new/rules");
  });

  it("replaces an older block in place", () => {
    const old = upsertBlock("intro\n", agentsBlock("old/rules"));
    const next = upsertBlock(old, agentsBlock("new/rules"));
    expect(next).not.toContain("old/rules");
    expect(next.match(/uikit-tools:start/g)).toHaveLength(1);
    expect(next.startsWith("intro\n\n")).toBe(true);
  });

  it("points through node_modules, not pnpm's versioned real path", () => {
    const linked = path.join(app, "node_modules/@pentaho/uikit-tools");
    const real = path.join(
      app,
      "node_modules/.pnpm/@pentaho+uikit-tools@1.0.0/node_modules/@pentaho/uikit-tools",
    );
    mkdirSync(path.dirname(real), { recursive: true });
    renameSync(linked, real);
    symlinkSync(real, linked);
    const { rulesPath } = runInit(app);
    expect(rulesPath).toBe("node_modules/@pentaho/uikit-tools/templates/rules");
  });

  it("fails clearly when uikit-tools isn't installed in the project", () => {
    rmSync(path.join(app, "node_modules/@pentaho/uikit-tools"), {
      recursive: true,
    });
    expect(() => runInit(app)).toThrow(/npm i -D @pentaho\/uikit-tools/);
  });

  it("refuses a start marker without an end marker", () => {
    writeFileSync(
      path.join(app, "AGENTS.md"),
      "<!-- uikit-tools:start -->\nhalf a block\n",
    );
    expect(() => runInit(app)).toThrow(/without a matching/);
  });

  it("writes nothing when an MCP config is not valid JSON", () => {
    writeFileSync(path.join(app, ".mcp.json"), "{ not json");
    expect(() => runInit(app)).toThrow(/not valid JSON/);
    expect(existsSync(path.join(app, "AGENTS.md"))).toBe(false);
    expect(existsSync(path.join(app, "CLAUDE.md"))).toBe(false);
  });
});
