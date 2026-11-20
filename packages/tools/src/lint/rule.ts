/**
 * One UI Kit lint rule: what it says (for the rule list), how it checks, and a failing and a passing example
 * (`bad` must trip it, `good` must not: lint.test.ts). Rules use the ESLint rule API, which oxlint's JS plugins
 * also run, so one plugin serves both.
 */
export interface Context {
  report(problem: { node: any; message: string }): void;
  sourceCode: { getText(node: any): string };
}

export interface LintRule {
  /** The rule's name in the plugin: `uikit/<name>`. */
  name: string;
  say: string;
  bad: string;
  good?: string;
  create(context: Context): Record<string, (node: any) => void>;
}

/** The rule's id in a config and in messages: `uikit/<name>`. */
export const ruleId = (r: LintRule) => `uikit/${r.name}`;
