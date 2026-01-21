// eslint-disable-next-line no-restricted-imports
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as reactHookForm from "react-hook-form";
import { importCode, type Scope } from "react-live-runner";
import * as reactTable from "react-table";
import * as DndKitCore from "@dnd-kit/core";
import * as DndKitModifiers from "@dnd-kit/modifiers";
import * as DndKitSortable from "@dnd-kit/sortable";
import * as DndKitUtilities from "@dnd-kit/utilities";
import * as emotionCss from "@emotion/css";
import * as hookFormZod from "@hookform/resolvers/zod";
import * as muiBase from "@mui/base";
// oxlint-disable-next-line no-restricted-imports
import * as muiMaterial from "@mui/material";
import * as muiUtils from "@mui/utils";
import * as clsx from "clsx";
import * as echartsCharts from "echarts/charts";
import * as echartsCore from "echarts/core";
import * as reactflow from "reactflow";
import useSWR from "swr";
import * as zod from "zod";
import * as HvCodeEditor from "@hitachivantara/uikit-react-code-editor";
import * as HvCore from "@hitachivantara/uikit-react-core";
import * as HvIcons from "@hitachivantara/uikit-react-icons";
import * as HvLab from "@hitachivantara/uikit-react-lab";
import * as HvPentaho from "@hitachivantara/uikit-react-pentaho";
import * as HvViz from "@hitachivantara/uikit-react-viz";
import * as HvStyles from "@hitachivantara/uikit-styles";

type ResolveContext = {
  files: Record<string, string>;
  baseScope: Scope;
  imports: Scope;
  resolvedFiles: Map<string, unknown>;
  dependencyStack: string[];
};

// Base scope with initial imports
const defaultScope: Scope = {
  import: {
    react: React,
    "react-dom": ReactDOM,
    "@hitachivantara/uikit-react-core": HvCore,
    "@hitachivantara/uikit-react-icons": HvIcons,
    "@hitachivantara/uikit-react-code-editor": HvCodeEditor,
    "@hitachivantara/uikit-react-lab": HvLab,
    "@hitachivantara/uikit-react-viz": HvViz,
    "@hitachivantara/uikit-react-pentaho": HvPentaho,
    "@hitachivantara/uikit-styles": HvStyles,
    "@emotion/css": emotionCss,
    "@mui/base": muiBase,
    "@mui/material": muiMaterial,
    "@mui/utils": muiUtils,
    "react-table": reactTable,
    "react-hook-form": reactHookForm,
    "@hookform/resolvers/zod": hookFormZod,
    zod,
    clsx,
    reactflow,
    swr: useSWR,
    "echarts/core": echartsCore,
    "echarts/charts": echartsCharts,
    "@dnd-kit/core": DndKitCore,
    "@dnd-kit/modifiers": DndKitModifiers,
    "@dnd-kit/sortable": DndKitSortable,
    "@dnd-kit/utilities": DndKitUtilities,
  },
};

/**
 * Extracts all unique component and hook names from the provided code.
 *
 * It uses two regex patterns:
 * - One to capture JSX component tags (e.g., <HvButton)
 * - One to capture hooks (e.g., useWidth)
 *
 * Each identifier is then resolved from HvCore, HvIcons, HvCodeEditor, HvLab, or HvViz if available.
 */
export const resolveComponents = (
  code: Record<string, string> | string,
): Scope => {
  const componentsScope: Scope = {};

  // Regex to capture JSX component tags that start with an uppercase letter
  const jsxComponentRegex = /<([A-Z][A-Za-z0-9]*)/g;
  // Regex to capture hook calls that start with "use" followed by an uppercase letter
  const hookRegex = /\b(use[A-Z][A-Za-z0-9]*)\b/g;
  // Regex to capture utils that start with "hv" followed by an uppercase letter
  const hvRegex = /\b(hv[A-Z][A-Za-z0-9]*)\b/g;

  // Helper to resolve an identifier from available libraries
  const resolveIdentifier = (identifier: string): unknown =>
    HvCore[identifier as keyof typeof HvCore] ||
    HvIcons[identifier as keyof typeof HvIcons] ||
    HvCodeEditor[identifier as keyof typeof HvCodeEditor] ||
    HvLab[identifier as keyof typeof HvLab] ||
    HvViz[identifier as keyof typeof HvViz] ||
    HvPentaho[identifier as keyof typeof HvPentaho];

  // Normalize input to an array of code strings
  const contents = typeof code === "string" ? [code] : Object.values(code);

  contents.forEach((content) => {
    const jsxMatches = extractUniqueMatches(content, jsxComponentRegex);
    const hookMatches = extractUniqueMatches(content, hookRegex);
    const hvMatches = extractUniqueMatches(content, hvRegex);
    // Combine matches from both regex patterns
    const allMatches = new Set<string>([
      ...jsxMatches,
      ...hookMatches,
      ...hvMatches,
    ]);

    allMatches.forEach((identifier) => {
      if (!componentsScope[identifier]) {
        const resolved = resolveIdentifier(identifier);
        if (resolved) {
          componentsScope[identifier] = resolved;
        }
      }
    });
  });

  return componentsScope;
};

/**
 * Resolves additional imports from the provided code files.
 * If a single string is provided, it returns the default scope.
 * Otherwise, it excludes the primary file (assumed to be the first key)
 * and extends the scope with the remaining files.
 */
export const resolveImports = (
  code: Record<string, string> | string,
): Scope => {
  if (typeof code === "string") return defaultScope;

  const additionalFiles = excludePrimaryFile(code);
  return extendScopeWithFiles(defaultScope, additionalFiles);
};

/**
 * Excludes the primary file (the first key) from the files object.
 */
const excludePrimaryFile = (
  files: Record<string, string>,
): Record<string, string> => {
  const fileEntries = Object.entries(files);
  if (fileEntries.length <= 1) return {};
  const [, ...otherEntries] = fileEntries;
  return Object.fromEntries(otherEntries);
};

/**
 * Extracts unique matches from a string using the given regex.
 * Utilizes String.matchAll for a cleaner iteration.
 */
const extractUniqueMatches = (content: string, regex: RegExp): Set<string> => {
  const matches = new Set<string>();
  for (const match of content.matchAll(regex)) {
    if (match[1]) {
      matches.add(match[1]);
    }
  }
  return matches;
};

/**
 * Extends the base scope with additional imports from multiple files.
 * It prevents circular dependencies and caches resolved modules for efficiency.
 */
const extendScopeWithFiles = (
  baseScope: Scope,
  files: Record<string, string>,
): Scope => {
  const imports: Scope = { ...baseScope.import }; // Clone base imports
  const context: ResolveContext = {
    files,
    baseScope,
    imports,
    resolvedFiles: new Map<string, unknown>(),
    dependencyStack: [],
  };

  for (const [fileName] of Object.entries(files)) {
    try {
      imports[fileName] = resolveFile(fileName, context);
    } catch (err) {
      console.error(`Error resolving file "${fileName}":`, err);
      throw new Error(
        `[Error in ${fileName}] ${err instanceof Error ? err.message : String(err)}`,
        { cause: err },
      );
    }
  }

  return { ...baseScope, import: imports };
};

/**
 * Resolves a file's module using importCode.
 * Caches the result and handles circular dependencies.
 */
const resolveFile = (fileName: string, context: ResolveContext): unknown => {
  const { files, baseScope, imports, resolvedFiles, dependencyStack } = context;

  if (resolvedFiles.has(fileName)) {
    return resolvedFiles.get(fileName);
  }

  if (!files[fileName]) {
    throw new Error(`File not found: ${fileName}`);
  }

  if (dependencyStack.includes(fileName)) {
    throw new Error(
      `Circular dependency detected: ${[...dependencyStack, fileName].join(" -> ")}`,
    );
  }

  dependencyStack.push(fileName);

  try {
    const module = importCode(files[fileName], {
      ...baseScope,
      import: imports,
    });
    resolvedFiles.set(fileName, module);
    return module;
  } finally {
    dependencyStack.pop();
  }
};
