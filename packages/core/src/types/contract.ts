/**
 * Component contract schema - defines usage intent and validation rules
 * Extracted from JSDoc and merged with docgen output
 */

export interface VariantSemantics {
  name: string;
  description: string;
  semanticMeaning?: string;
}

export interface StateRule {
  name: string;
  description: string;
  rules: string[];
}

export interface TokenConstraint {
  category: string;
  allowedValues: string[];
  notes: string;
}

export interface Example {
  name: string;
  description: string;
  code?: string;
  variant?: string;
  tokens?: string[];
}

export interface AntiPattern {
  pattern: string;
  why: string;
  correct: string;
}

export interface A11yRequirement {
  role: string;
  requirements: string[];
}

export interface ValidationRule {
  rule: string;
  enforcement: "error" | "warn" | "info";
  failureMessage: string;
}

export interface PropItem {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: string;
  allowedValues?: string[];
}

export interface ComponentContract {
  name: string;
  displayName: string;
  version?: string;
  purpose: string;

  // Extracted from JSDoc
  variantSemantics?: VariantSemantics[];
  stateRules?: StateRule[];
  tokenConstraints?: TokenConstraint[];
  antiPatterns?: AntiPattern[];
  a11y?: A11yRequirement;
  validationRules?: ValidationRule[];

  // From react-docgen-typescript
  props?: PropItem[];

  // Additional
  examples?: Example[];
  tags?: Record<string, string>;
}

export interface ComponentMetadata {
  version: string;
  generatedAt: string;
  components: ComponentContract[];
}
