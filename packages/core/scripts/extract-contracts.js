#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/** Every file under `dir` whose name passes `keep`, recursively. */
function walk(dir, keep) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(file, keep);
    return keep(entry.name) ? [file] : [];
  });
}

/** `[A, B]` or a bare word, as a frontmatter value. */
function frontmatterValue(raw) {
  const value = raw.trim();
  if (!value.startsWith("[")) return value;
  return value
    .slice(1, -1)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * A component's design note: `<File>.md` beside `<File>.tsx`, written by designers.
 * Frontmatter names the component, its status, related components and the lint rules that check it; the body is
 * a `# Title`, a purpose paragraph and `## ` sections.
 */
function parseNote(file) {
  const text = fs.readFileSync(file, "utf-8").replaceAll("\r\n", "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;

  const meta = Object.fromEntries(
    match[1]
      .split("\n")
      .map((line) => line.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, key, value]) => [key, frontmatterValue(value)]),
  );
  if (!meta.component) return null;

  const [intro, ...parts] = match[2].split(/^## /m);
  const purpose = intro
    .replace(/^#\s.*$/m, "")
    .trim()
    .split("\n\n")[0]
    .trim();
  const sections = parts.map((part) => {
    const [title, ...body] = part.split("\n");
    return { title: title.trim(), body: body.join("\n").trim() };
  });

  return {
    file,
    component: meta.component,
    status: meta.status,
    related: meta.related ?? [],
    rules: meta.rules ?? [],
    purpose,
    sections,
  };
}

/** The `Hv*` names a source file exports as values. */
function exportedNames(file) {
  const text = fs.readFileSync(file, "utf-8");
  return [...text.matchAll(/export\s+(?:const|function)\s+(Hv\w+)/g)].map(
    (m) => m[1],
  );
}

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
  // Find all JSDoc blocks before the export
  const beforeExport = content.slice(0, exportMatch.index);
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
      candidate.includes("@a11y")
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
      .filter(Boolean) // Remove empty lines
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
      .replace(/\*\/\s*$/, "")
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
 * Parse accessibility requirements from @a11y tag
 */
function parseA11y(content) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  // the `role:` line, with or without a list dash; no role line, no role
  const roleLine = lines.find((line) => /^(-\s*)?role:/.test(line));
  return {
    ...(roleLine && { role: roleLine.replace(/^(-\s*)?role:\s*/, "") }),
    requirements: lines
      .filter((line) => line !== roleLine)
      .map((line) => line.replace(/^-\s*/, "")),
  };
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
    a11y: tags.a11y ? parseA11y(tags.a11y) : undefined,

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

const REACT_NODE =
  /string \| number \| boolean \| ReactElement<any, string \| JSXElementConstructor<any>> \| Iterable<ReactNode> \| ReactPortal/g;

/**
 * The string or number literals a prop's union allows (`HvSize`: "xs" … "xl"), so a reader needn't open the type;
 * undefined when the type isn't such a union. Unions mixing literals with `string` (open colour names) keep the
 * literals, the usual values.
 */
function literalsOf(type) {
  if (!type.isUnion()) return undefined;
  const values = type.types
    .filter((each) => each.isStringLiteral() || each.isNumberLiteral())
    .map((each) => String(each.value));
  return values.length > 1 && values.length <= 40 ? values : undefined;
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
    .map((symbol) => {
      const type = checker.getNonNullableType(checker.getTypeOfSymbol(symbol));
      return { symbol, type, allowedValues: literalsOf(type) };
    })
    .map(({ symbol, type, allowedValues }) => ({
      name: symbol.name,
      // React's ReactNode, which the checker spells out in full
      type: checker.typeToString(type).replace(REACT_NODE, "ReactNode"),
      ...(allowedValues && { allowedValues }),
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
    component.types = typesFile(file, srcDir);
  }
}

/**
 * The component's declaration file in the package, `dist/Button/Button.d.ts`, so a reader opens its types
 * directly. The build writes one beside each module; a missing one fails the extraction.
 */
function typesFile(file, srcDir) {
  const types = path.join(
    "dist",
    path.relative(srcDir, file).replace(/\.tsx?$/, ".d.ts"),
  );
  if (!fs.existsSync(path.join(srcDir, "..", types))) {
    throw new Error(`No declaration file ${types}: build the package first`);
  }
  return types.split(path.sep).join("/");
}

/** A note's `status`: in use, superseded by a related component, or used only inside the UI Kit. */
const STATUSES = ["stable", "prefer-alternative", "internal"];
/** A note's sections, in this order; each is optional. */
const SECTIONS = ["When to use", "What the consumer provides", "Spec", "Don't"];

/**
 * Read every design note under `srcDir` and attach it to its component. A note for a
 * component without JSDoc (a subcomponent, or one not yet tagged) adds that component,
 * with the note's purpose. Returns what doesn't match the code: a note beside a file that
 * doesn't export its component, two notes for one component, an unknown status, a missing
 * purpose, sections outside the standard ones or out of order, or a related component that
 * doesn't exist.
 */
function attachNotes(components, componentFiles, missingPurpose, srcDir) {
  const sources = walk(srcDir, (name) => /\.tsx?$/.test(name));
  const known = new Set(sources.flatMap(exportedNames));
  const notes = walk(srcDir, (name) => name.endsWith(".md"))
    .map(parseNote)
    .filter(Boolean);
  const problems = [];
  const seen = new Set();
  const where = (note) => path.relative(projectRoot, note.file);

  for (const note of notes) {
    const source = note.file.replace(/\.md$/, ".tsx");
    if (
      !fs.existsSync(source) ||
      !exportedNames(source).includes(note.component)
    ) {
      problems.push(
        `${where(note)}: ${note.component} isn't exported by ${path.basename(source)} beside it`,
      );
      continue;
    }
    if (seen.has(note.component)) {
      problems.push(`${where(note)}: a second note for ${note.component}`);
      continue;
    }
    seen.add(note.component);
    if (!STATUSES.includes(note.status)) {
      problems.push(
        `${where(note)}: status "${note.status ?? ""}" isn't one of ${STATUSES.join(", ")}`,
      );
    }
    if (!note.purpose) {
      problems.push(
        `${where(note)}: no purpose: the paragraph under the # title`,
      );
    }
    const order = note.sections.map((s) => SECTIONS.indexOf(s.title));
    if (order.some((i, k) => i === -1 || i <= (order[k - 1] ?? -1))) {
      problems.push(
        `${where(note)}: sections must be ${SECTIONS.join(", ")}, in that order (each optional)`,
      );
    }
    for (const name of note.related) {
      if (!known.has(name)) {
        problems.push(`${where(note)}: related ${name} doesn't exist`);
      }
    }

    let component = components.find((c) => c.name === note.component);
    if (!component) {
      const contract = extractComponentContract(source, note.component);
      component = contract ?? {
        name: note.component,
        displayName: note.component.replace("Hv", ""),
        purpose: note.purpose,
        tags: {},
      };
      components.push(component);
      componentFiles.set(note.component, source);
      const index = missingPurpose.indexOf(note.component);
      if (index !== -1) missingPurpose.splice(index, 1);
    }
    // Designers own the purpose: the note's wins over a JSDoc one.
    if (note.purpose) component.purpose = note.purpose;
    component.note = {
      status: note.status,
      related: note.related,
      rules: note.rules,
      purpose: note.purpose,
      sections: note.sections,
    };
  }

  components.sort((a, b) => a.name.localeCompare(b.name));
  return problems;
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

  const problems = attachNotes(
    components,
    componentFiles,
    missingPurpose,
    srcDir,
  );
  if (problems.length > 0) {
    console.error("Design notes don't match the code:");
    for (const problem of problems) console.error(`  - ${problem}`);
    process.exit(1);
  }

  if (components.length === 0) {
    console.error("No components found with contracts");
    process.exit(1);
  }

  attachProps(components, componentFiles, srcDir);

  const metadata = {
    // the format of this file: bump it when a reader (uikit-tools) would misread the new shape
    schemaVersion: 1,
    version: process.env.npm_package_version || "7.0.0",
    generatedAt: new Date().toISOString(),
    // what readers use: the JSDoc tags, the display name and the note's own copy of the purpose stay here
    components: components.map(
      ({ tags: _tags, displayName: _displayName, ...component }) =>
        component.note
          ? (({ purpose: _purpose, ...note }) => ({ ...component, note }))(
              component.note,
            )
          : component,
    ),
  };

  const outputDir = path.join(projectRoot, "dist");
  const outputPath = path.join(outputDir, "component-metadata.json");

  // Ensure dist directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // read by tools, not people: no indentation
  fs.writeFileSync(outputPath, JSON.stringify(metadata));

  // Full: purpose plus at least one contract tag.
  const contractTags = ["variantSemantics", "stateRules", "a11y"];
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
      console.info(`  ${heading} none`);
      return;
    }
    console.info(`  ${heading}`);
    for (const name of names) {
      console.info(`    - ${name}`);
    }
  };

  console.info(
    `Total components: ${components.length + missingPurpose.length}`,
  );
  console.info(`✓ Metadata extracted to ${outputPath}`);
  printList("Full metadata extracted for:", full);
  printList("No purpose found for:", missingPurpose);
}

// Run if called directly
extractMetadata().catch((err) => {
  console.error("Error extracting metadata:", err);
  process.exit(1);
});
