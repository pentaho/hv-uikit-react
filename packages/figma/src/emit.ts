// What every generator shares: a generator is a pure function from its inputs to files (path → text), and `emit`
// writes them formatted as the repository formats them, or with `check` only compares, so the same inputs always give
// the same bytes and CI can tell when a committed file is stale. A generator that owns its folder also removes the
// files there it no longer makes.
import fs from "node:fs";
import path from "node:path";
import { format, resolveConfig } from "prettier";

/** A generator's output: each file's path, relative to where it is emitted, and its text. */
export type Files = Record<string, string>;

/** JSON as every generated file writes it: two-space indent, a final newline. */
export const json = (value: unknown) => `${JSON.stringify(value, null, 2)}\n`;

/** The files in `dir` (recursively), relative to it, with forward slashes as `Files` keys have. */
function filesIn(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .flatMap((e) => {
      if (!e.isFile()) return [];
      return [
        path
          .relative(dir, path.join(e.parentPath, e.name))
          .split(path.sep)
          .join("/"),
      ];
    });
}

async function formatted(file: string, text: string) {
  return format(text, { ...(await resolveConfig(file)), filepath: file });
}

/** Writes `files` under `root`, formatted (with `check`, writes nothing); returns the files that differed. `prune`:
 *  the generator owns `root` whole, so the files there it didn't make are stale (removed, or with `check` reported). */
export async function emit(
  root: string,
  files: Files,
  { check = false, prune = false } = {},
): Promise<string[]> {
  const changed: string[] = [];
  const outputs = await Promise.all(
    Object.entries(files).map(
      async ([f, text]) =>
        [f, await formatted(path.join(root, f), text)] as const,
    ),
  );
  for (const [f, out] of outputs) {
    const file = path.join(root, f);
    if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === out) continue;

    changed.push(f);
    if (check) continue;
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, out);
  }
  const removed = prune ? filesIn(root).filter((f) => !(f in files)) : [];
  if (!check) for (const f of removed) fs.rmSync(path.join(root, f));
  return [...changed, ...removed].toSorted();
}
