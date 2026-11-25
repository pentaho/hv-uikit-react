import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** The design rules' preset as the CLI runs it (oxlint.cli.json: oxlint.json alone), shipped beside `dist`. */
const PRESET = fileURLToPath(new URL("../../oxlint.cli.json", import.meta.url));
/** The oxlint this package depends on, so linting works in any project, set up for it or not. */
const OXLINT = path.join(
  path.dirname(createRequire(import.meta.url).resolve("oxlint/package.json")),
  "bin",
  "oxlint",
);

/** A finding in oxlint's `unix` format. */
const FINDING = /^.+:\d+:\d+: /m;

export interface LintResult {
  /** oxlint's report, in its `unix` format: `file:line:col: message [Error/uikit(rule)]`. */
  report: string;
  ok: boolean;
}

/**
 * The UI Kit design rules over `paths` (files or folders, relative to `cwd`), with the shipped preset only: the
 * project's own lint config is its business. Throws when oxlint itself fails (a bad path, a crash).
 */
export function lint(paths: string[], cwd = process.cwd()): LintResult {
  // `--`: a path is never read as a flag (`--fix`, `-c`); oxlint refuses `..` in a path, so those go absolute
  const args = [
    "-c",
    PRESET,
    "--format",
    "unix",
    "--",
    ...(paths.length ? paths : ["."]).map((p) =>
      p.split(/[\\/]/).includes("..") ? path.resolve(cwd, p) : p,
    ),
  ];
  try {
    // through Node: oxlint's launcher is a script, which Windows can't execute directly
    const out = execFileSync(process.execPath, [OXLINT, ...args], {
      cwd,
      encoding: "utf8",
    });
    return { report: out.trim(), ok: true };
  } catch (error) {
    const { status, stdout, stderr } = error as {
      status?: number;
      stdout?: string;
      stderr?: string;
    };
    // exit 1 is findings only when there are some: oxlint also exits 1 when a path matches no files
    if (status === 1 && stdout && FINDING.test(stdout))
      return { report: stdout.trim(), ok: false };
    throw new Error(
      `oxlint failed: ${(stderr || stdout || String(error)).trim()}`,
      { cause: error },
    );
  }
}

/** What `uikit-tools lint` and the MCP `lint` tool print. */
export function lintText({ report, ok }: LintResult): string {
  if (ok) return "No UI Kit design problems.";
  return `${report}\n\nRun \`uikit-tools rule uikit/<name>\` for the rule a finding cites (\`uikit(<name>)\`), \`uikit-tools info <Component>\` for a component.`;
}
