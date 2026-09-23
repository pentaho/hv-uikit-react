#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/**
 * Parse JSDoc tags from a source file
 */
function parseJSDocTags(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Find the export const Hv... statement
  const exportMatch = content.match(/export\s+const\s+(Hv\w+)\s*=/);
  if (!exportMatch) {
    return {};
  }
  const componentName = exportMatch[1];

  // Find all JSDoc blocks before the export
  const beforeExport = content.substring(0, exportMatch.index);
  const jsdocMatches = Array.from(beforeExport.matchAll(/\/\*\*[\s\S]*?\*\//g));

  if (jsdocMatches.length === 0) {
    return {};
  }

  // Find the JSDoc block that's closest to the export (last one)
  // AND has component contract tags (@variantSemantics, @stateRules, etc.)
  let jsdoc = null;
  for (let i = jsdocMatches.length - 1; i >= 0; i--) {
    const candidate = jsdocMatches[i][0];
    // Check if this block has any component contract tags
    if (
      candidate.includes("@variantSemantics") ||
      candidate.includes("@stateRules") ||
      candidate.includes("@tokenConstraints") ||
      candidate.includes("@antiPatterns") ||
      candidate.includes("@a11y") ||
      candidate.includes("@validationRules")
    ) {
      jsdoc = candidate;
      break;
    }
  }

  // If no tagged block found, use the last JSDoc before export
  if (!jsdoc && jsdocMatches.length > 0) {
    jsdoc = jsdocMatches[jsdocMatches.length - 1][0];
  }

  if (!jsdoc) {
    return {};
  }

  const tags = {};

  // Extract the main description (text before first @tag)
  // Capture everything from /** to first @tag, handling multi-line descriptions
  const descMatch = jsdoc.match(
    /\/\*\*\s*\n\s*\*\s*([\s\S]*?)(?:\n\s*\*\s*@|\n\s*\*\/)/,
  );
  if (descMatch) {
    // Clean up the description: remove leading/trailing whitespace and line prefixes
    const desc = descMatch[1]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter((line) => line) // Remove empty lines
      .join(" "); // Join multi-line descriptions with space
    if (desc) {
      tags.purpose = desc;
    }
  }

  // Match @tagName followed by content until next @ or end of comment
  const tagRegex = /@(\w+)\s+([\s\S]*?)(?=@\w+|$)/g;

  let tagMatch;
  while ((tagMatch = tagRegex.exec(jsdoc)) !== null) {
    const tagName = tagMatch[1];
    const tagContent = tagMatch[2]
      .split("\n")
      .map((line) => line.replace(/^\s*\*\s?/, "").trim())
      .filter((line) => line && !line.startsWith("*"))
      .join("\n")
      .trim();

    tags[tagName] = tagContent;
  }

  return tags;
}

/**
 * Parse variant semantics from @variantSemantics tag
 */
function parseVariantSemantics(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));

  return lines
    .map((line) => {
      const match = line.match(/^-\s*"([^"]+)"\s*(?:\(([^)]+)\))?:\s*(.+)$/);
      if (match) {
        return {
          name: match[1],
          semanticMeaning: match[2] || undefined,
          description: match[3],
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Parse state rules from @stateRules tag
 */
function parseStateRules(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));

  const rules = {};

  lines.forEach((line) => {
    const match = line.match(/^-\s*"([^"]+)"\s*:\s*(.+)/);
    if (match) {
      const name = match[1];
      const description = match[2];
      if (!rules[name]) {
        rules[name] = { description, rules: [] };
      }
    }
  });

  return Object.entries(rules)
    .map(([name, data]) => ({
      name,
      ...data,
    }))
    .filter(Boolean);
}

/**
 * Parse token constraints from @tokenConstraints tag
 */
function parseTokenConstraints(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));

  return lines
    .map((line) => {
      const match = line.match(/^-\s*([^:]+):\s*(.+)/);
      if (match) {
        return {
          category: match[1].trim(),
          notes: match[2].trim(),
          allowedValues: [],
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Parse anti-patterns from @antiPatterns tag
 */
function parseAntiPatterns(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));

  return lines
    .map((line) => {
      // Match format: - Pattern; Reason — Correction (or without correction)
      const match = line.match(/^-\s*(.+?);\s*(.+?)(?:\s*—\s*(.+))?$/);
      if (match) {
        return {
          pattern: match[1],
          why: match[2],
          correct: match[3] || "",
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Parse accessibility requirements from @a11y tag
 */
function parseA11y(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);

  return {
    role: lines[0]?.replace(/^role:\s*/, "") || "button",
    requirements: lines.slice(1).map((line) => line.replace(/^-\s*/, "")),
  };
}

/**
 * Parse validation rules from @validationRules tag
 */
function parseValidationRules(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("-"));

  return lines
    .map((line) => {
      const match = line.match(/^-\s*(.+?):\s*(.+?)\s*\(([a-z]+)\)$/);
      if (match) {
        return {
          rule: match[1],
          failureMessage: match[2],
          enforcement: match[3],
        };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Extract component contract from JSDoc
 */
function extractComponentContract(filePath, componentName) {
  const tags = parseJSDocTags(filePath);

  if (!tags.purpose) {
    return null;
  }

  return {
    name: componentName,
    displayName: componentName.replace("Hv", ""),
    purpose: tags.purpose || "No description",

    variantSemantics: tags.variantSemantics
      ? parseVariantSemantics(tags.variantSemantics)
      : undefined,
    stateRules: tags.stateRules ? parseStateRules(tags.stateRules) : undefined,
    tokenConstraints: tags.tokenConstraints
      ? parseTokenConstraints(tags.tokenConstraints)
      : undefined,
    antiPatterns: tags.antiPatterns
      ? parseAntiPatterns(tags.antiPatterns)
      : undefined,
    a11y: tags.a11y ? parseA11y(tags.a11y) : undefined,
    validationRules: tags.validationRules
      ? parseValidationRules(tags.validationRules)
      : undefined,

    tags: tags,
  };
}

const TS_COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  noEmit: true,
  skipLibCheck: true,
  esModuleInterop: true,
};

/**
 * Find the first parameter of the first function inside a declaration.
 * For `fixedForwardRef(function HvButton(props, ref) {...})` this is `props`.
 */
function findPropsParameter(node) {
  let found = null;
  const visit = (child) => {
    if (found) return;
    if (ts.isParameter(child) && ts.isFunctionLike(child.parent)) {
      found = child;
      return;
    }
    ts.forEachChild(child, visit);
  };
  ts.forEachChild(node, visit);
  return found;
}

/**
 * Read the props of an exported component from its TypeScript types.
 * Only props declared inside the package's src folder are kept, so React's
 * built-in HTML attributes are left out.
 */
function extractProps(program, componentFile, componentName, srcDir) {
  const checker = program.getTypeChecker();
  const sourceFile = program.getSourceFile(componentFile);
  if (!sourceFile) return [];

  const declaration = sourceFile.statements
    .filter(ts.isVariableStatement)
    .flatMap((statement) => statement.declarationList.declarations)
    .find(
      (decl) => ts.isIdentifier(decl.name) && decl.name.text === componentName,
    );
  if (!declaration) return [];

  const param = findPropsParameter(declaration);
  if (!param) return [];

  const propsType = checker.getNonNullableType(
    checker.getTypeAtLocation(param),
  );
  const srcPrefix = srcDir.split(path.sep).join("/") + "/";

  return checker
    .getPropertiesOfType(propsType)
    .filter((symbol) =>
      (symbol.declarations ?? []).some((decl) =>
        decl.getSourceFile().fileName.startsWith(srcPrefix),
      ),
    )
    .map((symbol) => ({
      name: symbol.name,
      type: checker.typeToString(
        checker.getNonNullableType(checker.getTypeOfSymbol(symbol)),
      ),
      // Symbol flags are a bit mask; the flag check also covers optional
      // props produced by mapped types such as Partial<T>.
      // eslint-disable-next-line no-bitwise
      required: !(symbol.flags & ts.SymbolFlags.Optional),
      description: ts
        .displayPartsToString(symbol.getDocumentationComment(checker))
        .trim(),
    }));
}

/**
 * Attach props to each contract. One TypeScript program is shared by all
 * component files so the source is parsed only once.
 */
function attachProps(components, componentFiles, srcDir) {
  const program = ts.createProgram(
    [...componentFiles.values()],
    TS_COMPILER_OPTIONS,
  );
  for (const component of components) {
    const file = componentFiles.get(component.name);
    if (!file) continue;
    const props = extractProps(program, file, component.name, srcDir);
    if (props.length > 0) {
      component.props = props;
    }
  }
}

/**
 * Main extraction function
 */
async function extractMetadata() {
  const srcDir = path.join(projectRoot, "src");
  const components = [];
  const missingPurpose = [];
  const componentFiles = new Map();

  // Scan src directory for component folders
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const componentName = entry.name;
    const componentFile = path.join(
      srcDir,
      componentName,
      `${componentName}.tsx`,
    );

    // Check if component file exists
    if (!fs.existsSync(componentFile)) continue;

    // Extract component name (e.g., Button -> HvButton)
    const hvComponentName = `Hv${componentName}`;

    const contract = extractComponentContract(componentFile, hvComponentName);

    if (contract) {
      components.push(contract);
      componentFiles.set(hvComponentName, componentFile);
    } else {
      missingPurpose.push(hvComponentName);
    }
  }

  if (components.length === 0) {
    console.error("No components found with contracts");
    process.exit(1);
  }

  attachProps(components, componentFiles, srcDir);

  const metadata = {
    version: process.env.npm_package_version || "7.0.0",
    generatedAt: new Date().toISOString(),
    components: components,
    missingPurpose: missingPurpose,
  };

  const outputDir = path.join(projectRoot, "dist");
  const outputPath = path.join(outputDir, "component-metadata.json");

  // Ensure dist directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));

  // Full: purpose plus at least one contract tag.
  const contractTags = [
    "variantSemantics",
    "stateRules",
    "tokenConstraints",
    "antiPatterns",
    "a11y",
    "validationRules",
  ];
  const full = [];
  for (const component of components) {
    const hasContract = contractTags.some((key) => key in component.tags);
    if (hasContract) {
      full.push(component.name);
    }
  }

  // Print a heading followed by one indented name per line.
  const printList = (heading, names) => {
    if (names.length === 0) {
      console.log(`  ${heading} none`);
      return;
    }
    console.log(`  ${heading}`);
    for (const name of names) {
      console.log(`    - ${name}`);
    }
  };

  console.log(`Total components: ${components.length + missingPurpose.length}`);
  console.log(`✓ Metadata extracted to ${outputPath}`);
  printList("Full metadata extracted for:", full);
  printList("No purpose found for:", missingPurpose);
}

// Run if called directly
extractMetadata().catch((err) => {
  console.error("Error extracting metadata:", err);
  process.exit(1);
});
