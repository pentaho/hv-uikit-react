import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

import { getComponentInfo, listComponents, loadMetadata } from "./mcp.js";
import { init } from "./init.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs.splice(0)) {
    rmSync(dir, { recursive: true, force: true });
  }
});

function createTempDir(): string {
  const dir = mkdtempSync(path.join(tmpdir(), "uikit-tools-init-"));
  tempDirs.push(dir);
  return dir;
}

describe("init", () => {
  it("creates a root AGENTS.md for the selected harness", async () => {
    const dir = createTempDir();

    await init(dir, { harness: "copilot" });

    const agentsPath = path.join(dir, "AGENTS.md");
    const content = readFileSync(agentsPath, "utf-8");
    expect(content).toContain("# AGENTS.md");
    expect(content).toContain("Harness: copilot");
    expect(content).toContain(".github/copilot-instructions.md");
    expect(content).toContain(".github/rules/hv-uikit.md");
  });

  it("preserves an existing AGENTS.md in the consumer app", async () => {
    const dir = createTempDir();
    const agentsPath = path.join(dir, "AGENTS.md");
    const original = "Existing consumer AGENTS instructions\n";

    writeFileSync(agentsPath, original, "utf-8");

    await init(dir, { harness: "claude" });

    expect(readFileSync(agentsPath, "utf-8")).toBe(original);
  });
});

describe("component metadata helpers", () => {
  it("lists components with pagination metadata", () => {
    const metadata = loadMetadata();
    const response = listComponents(metadata, { limit: 2, offset: 0 });

    expect(response.components.length).toBe(2);
    expect(response.total).toBeGreaterThan(0);
    expect(response.limit).toBe(2);
    expect(response.offset).toBe(0);
  });

  it("retrieves a component contract by name", () => {
    const metadata = loadMetadata();
    const contract = getComponentInfo(metadata, "HvButton");

    expect(contract).not.toBeNull();
    expect(contract?.name).toBe("HvButton");
    expect(contract?.purpose).toBeTruthy();
  });
});
