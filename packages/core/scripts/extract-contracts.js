#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    console.warn(`No purpose found for ${componentName}`);
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

/**
 * Main extraction function
 */
async function extractMetadata() {
  const srcDir = path.join(projectRoot, "src");
  const components = [];

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
    }
  }

  if (components.length === 0) {
    console.error("No components found with contracts");
    process.exit(1);
  }

  const metadata = {
    version: process.env.npm_package_version || "7.0.0",
    generatedAt: new Date().toISOString(),
    components: components,
  };

  const outputDir = path.join(projectRoot, "dist");
  const outputPath = path.join(outputDir, "component-metadata.json");

  // Ensure dist directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
  console.log(`✓ Metadata extracted to ${outputPath}`);
  console.log(`  Components: ${components.map((c) => c.name).join(", ")}`);
}

// Run if called directly
extractMetadata().catch((err) => {
  console.error("Error extracting metadata:", err);
  process.exit(1);
});
