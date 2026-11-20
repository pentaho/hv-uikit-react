import { existsSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";

import { lint } from "../core/lint.js";

const CODE = /\.(tsx?|jsx?|mjs|cjs)$/;

/**
 * The design problems in the file a Claude Code `PostToolUse` input names, as `uikit-tools lint` reports them;
 * none when the file isn't code in the project.
 */
export function hookProblems(input: string, project: string): string {
  let file: string | undefined;
  try {
    file = (JSON.parse(input) as { tool_input?: { file_path?: string } })
      .tool_input?.file_path;
  } catch {
    return "";
  }
  if (!file || !CODE.test(file) || !existsSync(file)) return "";
  const root = realpathSync(project);
  const relative = path.relative(root, realpathSync(file));
  if (relative.startsWith("..") || path.isAbsolute(relative)) return "";
  const { report, ok } = lint([relative], root);
  return ok ? "" : report;
}

/**
 * `uikit-tools hook`: Claude Code's `PostToolUse` hook, which `init` adds. When the agent writes code that breaks
 * a design rule, the problems go back to it (exit 2) so it fixes them before going on.
 */
export function hook() {
  const project = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  const problems = hookProblems(readFileSync(0, "utf8"), project);
  if (!problems) return;
  process.stderr.write(
    `${problems}\nFix these UI Kit design problems; \`npx --no-install uikit-tools rule uikit/<name>\` explains a finding's rule, \`uikit-tools info <Component>\` a component.\n`,
  );
  process.exitCode = 2;
}
