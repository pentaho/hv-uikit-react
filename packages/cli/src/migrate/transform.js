/**
 * jscodeshift transform: UI Kit v6 → v7.
 *
 * Applies the changes that can be made mechanically, and records anything
 * needing a human decision on `options.report`.
 */
import {
  CLASS_RENAMES,
  MOVED_EXPORTS,
  PROP_RENAMES,
  REMOVED_COMPONENTS,
  REMOVED_PACKAGES,
  RENAMED_EXPORTS,
  RENAMED_PACKAGES,
  REVIEW_CLASSES,
  REVIEW_PROPS,
  SCOPE_FROM,
  SCOPE_TO,
  THEME_NAME_FROM,
  THEME_NAME_TO,
} from "./rules.js";

const GRID_BREAKPOINTS = ["xs", "sm", "md", "lg", "xl"];

export default function transformer(file, api, options = {}) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const report = options.report ?? { review: [], introduced: new Set() };
  report.introduced ??= new Set();
  let dirty = false;

  const note = (line, message) =>
    report.review.push({ file: file.path, line, message });

  /**
   * Adds `name={{...props}}`, merging into an existing attribute when it already
   * holds an object literal so we never emit a duplicate JSX attribute.
   */
  const addOrMerge = (attrs, name, props, line, component) => {
    const existing = attrs.find(
      (a) => a.type === "JSXAttribute" && a.name?.name === name,
    );
    if (!existing) {
      attrs.push(
        j.jsxAttribute(
          j.jsxIdentifier(name),
          j.jsxExpressionContainer(j.objectExpression(props)),
        ),
      );
      return true;
    }
    const expr = existing.value?.expression;
    if (expr?.type !== "ObjectExpression") {
      note(
        line,
        `<${component}>: could not merge into the existing \`${name}\` prop — left the original props in place`,
      );
      return false;
    }
    const present = new Set(
      expr.properties.map((p) => p.key?.name ?? p.key?.value),
    );
    props.forEach((p) => {
      if (!present.has(p.key.name)) expr.properties.push(p);
    });
    return true;
  };

  const elementName = (path) => {
    const name = path.node.name;
    return name?.type === "JSXIdentifier" ? name.name : undefined;
  };

  // ---- imports: scope rename, package rename, removed packages -------------
  /** Matches "@scope/pkg" and any subpath such as "@scope/pkg/prettier". */
  const removedPackageFor = (source) =>
    Object.keys(REMOVED_PACKAGES).find(
      (name) => source === name || source.startsWith(`${name}/`),
    );

  root.find(j.ImportDeclaration).forEach((path) => {
    const source = path.node.source.value;
    if (typeof source !== "string") return;

    const removed = removedPackageFor(source);
    if (removed) {
      const line = path.node.loc?.start.line;
      const specs = path.node.specifiers ?? [];
      const moved = specs.filter((s) => MOVED_EXPORTS[s.imported?.name]);
      const stranded = specs.filter((s) => !MOVED_EXPORTS[s.imported?.name]);

      // exports that simply live somewhere else can be repointed
      const byTarget = new Map();
      moved.forEach((s) => {
        const target = MOVED_EXPORTS[s.imported.name];
        if (!byTarget.has(target)) byTarget.set(target, []);
        byTarget.get(target).push(s);
      });

      if (byTarget.size) {
        const replacements = [...byTarget].map(([target, ss]) => {
          report.introduced.add(target);
          return j.importDeclaration(ss, j.stringLiteral(target));
        });
        if (stranded.length) {
          path.node.specifiers = stranded;
          j(path).insertAfter(replacements);
        } else {
          j(path).replaceWith(replacements);
        }
        dirty = true;
      }

      if (stranded.length || !specs.length) {
        note(line, `${source}: ${REMOVED_PACKAGES[removed]}`);
      }
      return;
    }
    if (RENAMED_PACKAGES[source]) {
      path.node.source.value = RENAMED_PACKAGES[source];
      dirty = true;
      return;
    }
    if (source.startsWith(SCOPE_FROM)) {
      path.node.source.value = source.replace(SCOPE_FROM, SCOPE_TO);
      dirty = true;
    }
  });

  // ---- renamed exports: rename the binding and every reference ------------
  root
    .find(j.ImportSpecifier)
    .filter((p) => RENAMED_EXPORTS[p.node.imported?.name])
    .forEach((p) => {
      const from = p.node.imported.name;
      const to = RENAMED_EXPORTS[from];
      const aliased = p.node.local && p.node.local.name !== from;
      p.node.imported = j.identifier(to);
      if (!aliased) {
        p.node.local = j.identifier(to);
        root
          .find(j.Identifier, { name: from })
          .filter((ref) => {
            const parent = ref.parent.node;
            return (
              parent.type !== "ImportSpecifier" &&
              !(
                parent.type === "MemberExpression" &&
                parent.property === ref.node
              ) &&
              !(parent.type === "ObjectProperty" && parent.key === ref.node)
            );
          })
          .forEach((ref) => {
            ref.node.name = to;
          });
      }
      dirty = true;
    });

  // ---- removed components: flag imports as well as JSX usage --------------
  root.find(j.ImportDeclaration).forEach((path) => {
    // a removed package is already reported above; don't warn twice
    if (REMOVED_PACKAGES[path.node.source.value]) return;
    path.node.specifiers?.forEach((spec) => {
      const imported = spec.imported?.name ?? spec.local?.name;
      if (imported && REMOVED_COMPONENTS[imported]) {
        note(
          path.node.loc?.start.line,
          `import ${imported}: ${REMOVED_COMPONENTS[imported]}`,
        );
      }
    });
  });

  // ---- removed components: flag every usage -------------------------------
  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = elementName(path);
    if (name && REMOVED_COMPONENTS[name]) {
      note(path.node.loc?.start.line, `<${name}>: ${REMOVED_COMPONENTS[name]}`);
    }
  });

  // ---- prop renames + props needing review --------------------------------
  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = elementName(path);
    if (!name) return;
    const renames = PROP_RENAMES[name];
    const reviews = REVIEW_PROPS[name];
    if (!renames && !reviews) return;

    path.node.attributes?.forEach((attr) => {
      if (attr.type !== "JSXAttribute" || attr.name?.type !== "JSXIdentifier")
        return;
      const prop = attr.name.name;
      if (renames?.[prop]) {
        attr.name.name = renames[prop];
        dirty = true;
      } else if (reviews?.[prop]) {
        note(attr.loc?.start.line, `<${name} ${prop}>: ${reviews[prop]}`);
      }
    });
  });

  // ---- HvGrid: item / breakpoints -> size, zeroMinWidth -> style ----------
  root.find(j.JSXOpeningElement).forEach((path) => {
    if (elementName(path) !== "HvGrid") return;
    const attrs = path.node.attributes ?? [];
    const sizeProps = [];
    const sizeAttrs = [];
    const keep = [];
    let needsMinWidth = false;

    attrs.forEach((attr) => {
      if (attr.type !== "JSXAttribute" || attr.name?.type !== "JSXIdentifier") {
        keep.push(attr);
        return;
      }
      const prop = attr.name.name;
      if (prop === "item") {
        dirty = true; // dropped: items are implicit in the current Grid API
        return;
      }
      if (GRID_BREAKPOINTS.includes(prop)) {
        sizeAttrs.push(attr);
        const v = attr.value;
        const value =
          v == null
            ? j.booleanLiteral(true)
            : v.type === "JSXExpressionContainer"
              ? v.expression
              : v;
        sizeProps.push(j.objectProperty(j.identifier(prop), value));
        dirty = true;
        return;
      }
      if (prop === "zeroMinWidth") {
        needsMinWidth = true;
        dirty = true;
        return;
      }
      keep.push(attr);
    });

    if (
      sizeProps.length &&
      !addOrMerge(keep, "size", sizeProps, path.node.loc?.start.line, "HvGrid")
    ) {
      keep.push(...sizeAttrs); // nothing was merged — keep the originals
    }
    if (needsMinWidth) {
      addOrMerge(
        keep,
        "style",
        [j.objectProperty(j.identifier("minWidth"), j.numericLiteral(0))],
        path.node.loc?.start.line,
        "HvGrid",
      );
    }
    path.node.attributes = keep;
  });

  // ---- classes keys: renames + ones needing review ------------------------
  root.find(j.JSXOpeningElement).forEach((path) => {
    const name = elementName(path);
    if (!name) return;
    const renames = CLASS_RENAMES[name];
    const reviews = REVIEW_CLASSES[name];
    if (!renames && !reviews) return;

    path.node.attributes?.forEach((attr) => {
      if (attr.type !== "JSXAttribute" || attr.name?.name !== "classes") return;
      const expr = attr.value?.expression;
      if (expr?.type !== "ObjectExpression") return;
      expr.properties.forEach((prop) => {
        const key = prop.key?.name ?? prop.key?.value;
        if (renames?.[key]) {
          prop.key = j.identifier(renames[key]);
          dirty = true;
        } else if (reviews?.[key]) {
          note(
            prop.loc?.start.line,
            `<${name} classes.${key}>: ${reviews[key]}`,
          );
        }
      });
    });
  });

  // ---- theme identifier ---------------------------------------------------
  root.find(j.StringLiteral, { value: THEME_NAME_FROM }).forEach((path) => {
    path.node.value = THEME_NAME_TO;
    dirty = true;
  });

  return dirty
    ? root.toSource({ quote: "double", lineTerminator: "\n" })
    : null;
}
