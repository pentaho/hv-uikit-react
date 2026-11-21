import { existsSync, globSync, readFileSync, realpathSync } from "node:fs";
import path from "node:path";

import { lint } from "../core/lint.js";

/** Whether `dir` holds code oxlint would read (none yet in a new project's empty `src`). */
const hasCode = (dir: string) =>
  globSync("**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}", {
    cwd: dir,
    exclude: (name) => path.basename(name) === "node_modules",
  }).length > 0;

/**
 * The design problems in the project's code (its `src`, else the whole project) as `uikit-tools lint` reports them,
 * when a Claude Code `Stop` input arrives ("" when clean); undefined when nothing was linted: this stop already follows
 * the hook's own report (so the agent is never held in a loop), or there's no code yet. Throws when the linter fails.
 */
export function hookProblems(
  input: string,
  project: string,
): string | undefined {
  try {
    if ((JSON.parse(input) as { stop_hook_active?: boolean }).stop_hook_active)
      return undefined;
  } catch {
    return undefined;
  }
  const root = realpathSync(project);
  const target = existsSync(path.join(root, "src")) ? "src" : ".";
  if (!hasCode(path.join(root, target))) return undefined;
  const { report, ok } = lint([target], root);
  return ok ? "" : report;
}

/**
 * `uikit-tools hook`: Claude Code's `Stop` hook, which `init` adds. When the agent is about to finish with code that
 * breaks a design rule, whichever way it wrote the files, the problems go back to it (exit 2) to fix first. When the
 * linter can't run, the agent isn't held up (exit 1: Claude Code shows the error to the person, not the agent).
 */
export function hook() {
  const project = process.env.CLAUDE_PROJECT_DIR ?? process.cwd();
  try {
    const problems = hookProblems(readFileSync(0, "utf8"), project);
    if (problems) {
      process.stderr.write(
        `${problems}\nFix these UI Kit design problems before finishing; \`npx --no-install uikit-tools rule uikit/<name>\` explains a finding's rule, \`uikit-tools info <Component>\` a component.\n`,
      );
      process.exitCode = 2;
    }
  } catch (error) {
    process.stderr.write(
      `The UI Kit design rules weren't checked: ${(error as Error).message}\n`,
    );
    process.exitCode = 1;
  }
}
