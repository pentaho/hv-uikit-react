import {
  ADDED_PEERS,
  REMOVED_PACKAGES,
  RENAMED_PACKAGES,
  SCOPE_FROM,
  SCOPE_TO,
  VERSION_LINES,
} from "./rules.js";

/** Resolves the v7 range for a renamed package, honouring its release line. */
/**
 * Resolves the v7 range for a renamed package, honouring its release line.
 * Semver ranges do not match prereleases, so `pre` is needed while v7 is
 * still published under the `next` tag.
 */
const rangeFor = (name, { override, pre } = {}) => {
  if (override) return override;
  const line = VERSION_LINES.find((v) => name.startsWith(v.prefix));
  if (!line) return "*";
  return pre ? line.pre : line.range;
};

const DEP_FIELDS = ["dependencies", "devDependencies", "peerDependencies"];

/** Rewrites UI Kit dependency entries in a parsed package.json. Returns notes. */
export function migratePackageJson(pkg, options = {}) {
  const { introduced = [] } = options;
  const notes = [];
  let changed = false;

  DEP_FIELDS.forEach((field) => {
    const deps = pkg[field];
    if (!deps) return;
    const next = {};

    Object.entries(deps).forEach(([name, range]) => {
      if (REMOVED_PACKAGES[name]) {
        notes.push(`${field}: ${name} — ${REMOVED_PACKAGES[name]}`);
        changed = true;
        return; // drop it
      }
      if (RENAMED_PACKAGES[name]) {
        const to = RENAMED_PACKAGES[name];
        next[to] = rangeFor(to, options);
        changed = true;
        return;
      }
      if (name.startsWith(SCOPE_FROM)) {
        const to = name.replace(SCOPE_FROM, SCOPE_TO);
        next[to] = rangeFor(to, options);
        changed = true;
        return;
      }
      next[name] = range;
    });

    // packages an import was repointed to must be declared
    if (field === "dependencies") {
      introduced.forEach((name) => {
        if (!next[name]) {
          next[name] = rangeFor(name, options);
          notes.push(`${field}: added ${name} (imports were repointed to it)`);
          changed = true;
        }
      });
    }

    // v7 adds peers that v6 did not require
    if (field === "dependencies" && next[`${SCOPE_TO}uikit-react-core`]) {
      Object.entries(ADDED_PEERS).forEach(([name, range]) => {
        if (!deps[name] && !next[name]) {
          next[name] = range;
          notes.push(`${field}: added ${name} ${range} (new peer in v7)`);
          changed = true;
        }
      });
    }

    pkg[field] = Object.fromEntries(
      Object.entries(next).toSorted(([a], [b]) => a.localeCompare(b)),
    );
  });

  return { changed, notes };
}
