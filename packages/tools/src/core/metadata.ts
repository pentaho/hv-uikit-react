import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

/**
 * Shape of `@pentaho/uikit-react-core/dist/component-metadata.json`, which the core build
 * extracts from the component JSDoc (`scripts/extract-contracts.js`).
 */
export interface Metadata {
  /** The file's format; this package reads `SCHEMA_VERSION`. */
  schemaVersion: number;
  version: string;
  generatedAt: string;
  components: Component[];
}

export interface Prop {
  name: string;
  type: string;
  required: boolean;
  description?: string;
  defaultValue?: string;
  allowedValues?: string[];
}

/** A component's design note, written by designers beside the component (`<File>.md`). */
export interface Note {
  status?: string;
  related: string[];
  /** The lint rules that check it: `uikit/<name>`. */
  rules?: string[];
  sections: { title: string; body: string }[];
}

export interface Component {
  name: string;
  purpose: string;
  note?: Note;
  /** Its declaration file in the package: `dist/Button/Button.d.ts`. */
  types?: string;
  props?: Prop[];
  /** `semanticMeaning`: the variant's alias, `"secondary" (subtle)` in the JSDoc. */
  variantSemantics?: {
    name: string;
    semanticMeaning?: string;
    description: string;
  }[];
  stateRules?: { name: string; description: string; rules?: string[] }[];
  a11y?: { role?: string; requirements: string[] };
}

export interface LoadOptions {
  /** Project folder to resolve `@pentaho/uikit-react-core` from. Defaults to the current directory. */
  cwd?: string;
  /** Explicit metadata file; skips package resolution. */
  metadataPath?: string;
}

export const CORE = "@pentaho/uikit-react-core";
const METADATA = "dist/component-metadata.json";

export class MetadataError extends Error {}

/** A lookup that matched nothing; its message says what to try instead. */
export class LookupError extends Error {}

/**
 * Find the component metadata of the UI Kit installed in the project, so lookups always
 * match the version the app uses. There is deliberately no fallback to another copy: a
 * missing or older UI Kit is reported, not silently replaced.
 */
function resolveMetadataPath({
  cwd = process.cwd(),
  metadataPath,
}: LoadOptions = {}) {
  if (metadataPath) {
    const resolved = path.resolve(cwd, metadataPath);
    if (!existsSync(resolved))
      throw new MetadataError(`No metadata file at ${resolved}.`);
    return resolved;
  }

  try {
    const pkg = createRequire(
      path.join(path.resolve(cwd), "package.json"),
    ).resolve(`${CORE}/package.json`);
    const file = path.join(path.dirname(pkg), METADATA);
    if (existsSync(file)) return file;
  } catch {
    // reported below
  }

  throw new MetadataError(
    `Couldn't find ${CORE}/${METADATA} from ${path.resolve(cwd)}. ` +
      `Install a version of ${CORE} that ships component metadata.`,
  );
}

/** The metadata format this package reads (core's `extract-contracts.js` writes it). */
const SCHEMA_VERSION = 1;

/** The metadata, or a clear error when its format isn't the one this package reads. */
export function checkSchema(metadata: Metadata, file: string): Metadata {
  const found = metadata.schemaVersion;
  if (found === SCHEMA_VERSION) return metadata;
  const upgrade =
    found === undefined || found < SCHEMA_VERSION
      ? `Upgrade ${CORE}: its metadata predates this @pentaho/uikit-tools`
      : "Upgrade @pentaho/uikit-tools: it predates this UI Kit's metadata";
  throw new MetadataError(
    `${file} has metadata format ${found ?? "none"}, and this @pentaho/uikit-tools reads ${SCHEMA_VERSION}. ${upgrade}.`,
  );
}

export function loadMetadata(options: LoadOptions = {}): {
  metadata: Metadata;
  /** The metadata file, in the installed package's `dist`. */
  file: string;
} {
  const file = resolveMetadataPath(options);
  const metadata = JSON.parse(readFileSync(file, "utf8")) as Metadata;
  return { metadata: checkSchema(metadata, file), file };
}
