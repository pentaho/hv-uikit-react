import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

export interface VariantSemantics {
  name: string;
  semanticMeaning?: string;
  description: string;
}

export interface StateRule {
  name: string;
  description: string;
  rules: string[];
}

export interface TokenConstraint {
  category: string;
  notes: string;
  allowedValues?: string[];
}

export interface AntiPattern {
  pattern: string;
  why: string;
  correct: string;
}

export interface A11yRequirement {
  role?: string;
  requirements: string[];
}

export interface ValidationRule {
  rule: string;
  failureMessage: string;
  enforcement: "error" | "warn" | "info";
}

export interface ComponentContract {
  name: string;
  displayName: string;
  purpose: string;
  variantSemantics?: VariantSemantics[];
  stateRules?: StateRule[];
  tokenConstraints?: TokenConstraint[];
  antiPatterns?: AntiPattern[];
  a11y?: A11yRequirement;
  validationRules?: ValidationRule[];
}

export interface ComponentMetadata {
  version: string;
  generatedAt: string;
  components: ComponentContract[];
}

/**
 * Load component metadata from the installed @pentaho/uikit-react-core package.
 * Resolves the metadata JSON file from node_modules.
 */
export function loadMetadata(): ComponentMetadata {
  try {
    // When installed via npm, try to load from node_modules
    const nodeModulesPath = join(
      fileURLToPath(import.meta.url),
      "../../../../node_modules/@pentaho/uikit-react-core/dist/component-metadata.json",
    );

    try {
      const content = readFileSync(nodeModulesPath, "utf-8");
      return JSON.parse(content);
    } catch {
      // Fallback for development: try to load from workspace
      const devPath = join(
        fileURLToPath(import.meta.url),
        "../../../../core/dist/component-metadata.json",
      );
      const content = readFileSync(devPath, "utf-8");
      return JSON.parse(content);
    }
  } catch (error) {
    throw new Error(
      `Failed to load component metadata. Ensure @pentaho/uikit-react-core is installed with component-metadata.json in dist/. Error: ${error}`,
      { cause: error },
    );
  }
}

/**
 * Find a component by name in the metadata.
 */
export function findComponent(
  metadata: ComponentMetadata,
  name: string,
): ComponentContract | undefined {
  return metadata.components.find(
    (c) => c.name === name || c.displayName === name,
  );
}
