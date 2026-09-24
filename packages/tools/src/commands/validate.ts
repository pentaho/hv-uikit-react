/**
 * Validate code against HV UI Kit contracts.
 * Checks component usage against validation rules extracted from JSDoc contracts.
 */

import { globSync } from "glob";

import {
  formatViolations,
  getExitCode,
  validateFiles,
} from "../validation/validator.js";

export async function validate(
  patterns: string[],
  options?: Record<string, unknown>,
): Promise<void> {
  try {
    // Resolve glob patterns to file list
    const allFiles: string[] = [];
    for (const pattern of patterns) {
      const files = globSync(pattern, { cwd: process.cwd() });
      allFiles.push(...files);
    }

    if (allFiles.length === 0) {
      // eslint-disable-next-line no-console
      console.error(`No files matching patterns: ${patterns.join(", ")}`);
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }

    if (options?.verbose) {
      // eslint-disable-next-line no-console
      console.log(`Validating ${allFiles.length} file(s)...`);
    }

    // Run validation
    const violations = validateFiles(allFiles);

    // Format and print output
    const formatted = formatViolations(violations);
    // eslint-disable-next-line no-console
    console.log(formatted);

    // Return appropriate exit code
    const exitCode = getExitCode(violations);
    // eslint-disable-next-line no-process-exit
    process.exit(exitCode);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Validation error:", error);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
