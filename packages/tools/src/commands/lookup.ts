import { answer, LookupError, type LookupRequest } from "../core/lookup.js";
import { MetadataError } from "../core/metadata.js";

export interface CommonOptions {
  metadata?: string;
}

/** Print a lookup; exit 1 when nothing matches, 2 when the component metadata can't be loaded. */
export function printLookup(
  request: LookupRequest,
  options: CommonOptions = {},
) {
  try {
    process.stdout.write(
      `${answer(request, { metadataPath: options.metadata })}\n`,
    );
  } catch (error) {
    if (error instanceof LookupError || error instanceof MetadataError) {
      process.stderr.write(`${error.message}\n`);
      process.exitCode = error instanceof LookupError ? 1 : 2;
      return;
    }
    throw error;
  }
}
