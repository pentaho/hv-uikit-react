import { readFileSync } from "node:fs";

/**
 * Deep merge two objects. `override` keys take priority over `base`.
 */
export function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value != null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      result[key] != null &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      result[key] = value;
    }
  }
  return result;
}

/**
 * Parses a JSON file, wrapping parse errors with the file path for
 * actionable diagnostics.
 */
export function readJsonFile(filePath: string) {
  const raw = readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new Error(
      `Failed to parse ${filePath}: ${cause instanceof Error ? cause.message : cause}`,
      { cause },
    );
  }
}
