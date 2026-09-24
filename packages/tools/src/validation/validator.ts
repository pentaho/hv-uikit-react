/**
 * Core validation engine
 * Parses JSX and checks component usage against rules
 */

import fs from "fs";
import path from "path";

import type { ValidationRule } from "./rules.js";
import { getKnownComponents, getRulesForComponent } from "./rules.js";

export interface Violation {
  file: string;
  line: number;
  column: number;
  component: string;
  rule: string;
  reason: string;
  failureMessage: string;
  suggestion: string;
  enforcement: "error" | "warn" | "info";
}

/**
 * Simple prop extractor - finds prop="value" and prop={value} patterns
 * Note: This is simplified for the pilot; real implementation would use ts-morph
 */
function extractProps(componentTag: string): Record<string, any> {
  const props: Record<string, any> = {};

  // Match prop="value" (string props)
  const stringPropRegex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = stringPropRegex.exec(componentTag)) !== null) {
    props[match[1]] = match[2];
  }

  // Match prop={...} (dynamic props) - simplified, just detect presence
  const dynamicPropRegex = /(\w+)=\{/g;
  while ((match = dynamicPropRegex.exec(componentTag)) !== null) {
    if (!props[match[1]]) {
      props[match[1]] = "__DYNAMIC__"; // marker for dynamic values
    }
  }

  // Check for boolean props (prop without = means true)
  const booleanPropRegex = /\s(\w+)(?=\s|\/?>)/g;
  while ((match = booleanPropRegex.exec(componentTag)) !== null) {
    const propName = match[1];
    // Skip React/HTML reserved words and props we already found
    if (
      !["return", "if", "else", "for", "while", "children"].includes(
        propName,
      ) &&
      !props.hasOwnProperty(propName)
    ) {
      props[propName] = true;
    }
  }

  return props;
}

/**
 * Find component instances in JSX
 * Returns: { line, column, componentName, fullTag, props }
 */
function findComponentInstances(
  content: string,
): Array<{
  line: number;
  column: number;
  componentName: string;
  fullTag: string;
  props: Record<string, any>;
}> {
  const instances: Array<{
    line: number;
    column: number;
    componentName: string;
    fullTag: string;
    props: Record<string, any>;
  }> = [];
  const knownComponents = getKnownComponents();

  const lines = content.split("\n");

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];

    for (const component of knownComponents) {
      // Match <ComponentName props... > or <ComponentName props... />
      const regex = new RegExp(`<(${component})([^>]*)(/?>)`, "g");
      let match;

      while ((match = regex.exec(line)) !== null) {
        const fullTag = match[0];
        const propsString = match[2];
        const props = extractProps(propsString);

        instances.push({
          line: lineNum + 1, // 1-indexed
          column: match.index + 1,
          componentName: match[1],
          fullTag,
          props,
        });
      }
    }
  }

  return instances;
}

/**
 * Validate a single file
 */
export function validateFile(filePath: string): Violation[] {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const violations: Violation[] = [];

  // Find all component instances
  const instances = findComponentInstances(content);

  // Run rules against each instance
  for (const instance of instances) {
    const rules = getRulesForComponent(instance.componentName);

    for (const rule of rules) {
      const checkResult = rule.check(instance.props);

      if (!checkResult.pass) {
        violations.push({
          file: filePath,
          line: instance.line,
          column: instance.column,
          component: instance.componentName,
          rule: rule.ruleName,
          reason: checkResult.reason || rule.failureMessage,
          failureMessage: rule.failureMessage,
          suggestion: rule.suggestion,
          enforcement: rule.enforcement,
        });
      }
    }
  }

  return violations;
}

/**
 * Validate multiple files (glob pattern or direct paths)
 */
export function validateFiles(filePaths: string[]): Violation[] {
  const allViolations: Violation[] = [];

  for (const filePath of filePaths) {
    const resolvedPath = path.resolve(filePath);
    if (fs.statSync(resolvedPath).isFile()) {
      const violations = validateFile(resolvedPath);
      allViolations.push(...violations);
    }
  }

  return allViolations;
}

/**
 * Format violations for display
 */
export function formatViolations(violations: Violation[]): string {
  if (violations.length === 0) {
    return "✓ No violations found\n";
  }

  // Group by file and sort by line
  const grouped = new Map<string, Violation[]>();
  for (const v of violations) {
    if (!grouped.has(v.file)) {
      grouped.set(v.file, []);
    }
    grouped.get(v.file)!.push(v);
  }

  let output = "";

  for (const [file, fileViolations] of grouped) {
    fileViolations.sort((a, b) => a.line - b.line || a.column - b.column);

    for (const v of fileViolations) {
      output += `${file}:${v.line}:${v.column} - ${v.enforcement} (${v.component})\n`;
      output += `  ${v.reason}\n`;
      output += `  ✓ ${v.suggestion}\n\n`;
    }
  }

  // Summary
  const errorCount = violations.filter((v) => v.enforcement === "error").length;
  const warnCount = violations.filter((v) => v.enforcement === "warn").length;
  const infoCount = violations.filter((v) => v.enforcement === "info").length;

  output += "=================\n";
  output += `${errorCount} errors, ${warnCount} warnings, ${infoCount} info\n`;

  return output;
}

/**
 * Get exit code based on violations
 */
export function getExitCode(violations: Violation[]): number {
  const hasErrors = violations.some((v) => v.enforcement === "error");
  return hasErrors ? 1 : 0;
}
