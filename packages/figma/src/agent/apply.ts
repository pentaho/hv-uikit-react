// The design library's variables from code, one way: the sync file's collections (with their modes) and variables
// (values, scopes, code syntax, description), made where missing and rewritten where they exist, matched by collection
// and name. A designer's edit to one of them is overwritten: keeping those and reporting conflicts is the two-way sync,
// which comes later. Nothing is deleted.
/* eslint-disable no-await-in-loop -- Figma's API calls run one after another */
import type { Bundle, FigmaVariable } from "../sync/types.ts";

export const NS = "pentaho_uikit"; // the namespace of what the agent stores on the file and its nodes

/** What a run wrote: `made` the variables the file lacked, `rewritten` those it had. */
export interface VariablesResult {
  made: number;
  rewritten: number;
}

const keyOf = (collection: string, name: string) => `${collection}/${name}`;

function figmaValue(
  value: FigmaVariable["values"][string],
  byName: Map<string, Variable>,
): VariableValue {
  if ("alias" in value) {
    const target =
      byName.get(keyOf("Primitives", value.alias)) ??
      byName.get(keyOf("Color", value.alias));
    if (!target) throw new Error(`No variable ${value.alias} to point at.`);
    return figma.variables.createVariableAlias(target);
  }
  if ("color" in value) {
    const [r, g, b, a] = value.color;
    return { r, g, b, a };
  }
  return value.value;
}

/** The bundle's collections, made where missing, each with every mode the code has. */
function ensureCollections(
  bundle: Bundle,
  existing: VariableCollection[],
): Map<string, VariableCollection> {
  const out = new Map(existing.map((c) => [c.name, c]));
  for (const spec of bundle.collections) {
    let c = out.get(spec.name);
    if (!c) {
      c = figma.variables.createVariableCollection(spec.name);
      c.renameMode(c.modes[0].modeId, spec.modes[0]);
      out.set(spec.name, c);
    }
    for (const mode of spec.modes)
      if (!c.modes.some((m) => m.name === mode)) c.addMode(mode);
  }
  return out;
}

/** Writes the variables: makes those the file lacks and rewrites those it has. */
export async function applyVariables(bundle: Bundle): Promise<VariablesResult> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const nameOf = new Map(collections.map((c) => [c.id, c.name]));
  const byName = new Map(
    (await figma.variables.getLocalVariablesAsync()).map((v) => [
      keyOf(nameOf.get(v.variableCollectionId) ?? "", v.name),
      v,
    ]),
  );
  const made = bundle.variables.filter(
    (v) => !byName.has(keyOf(v.collection, v.name)),
  ).length;
  const byCollection = ensureCollections(bundle, collections);
  // in the bundle's order: the primitives before the colors that alias them
  for (const v of bundle.variables) {
    const collection = byCollection.get(v.collection)!;
    const variable =
      byName.get(keyOf(v.collection, v.name)) ??
      figma.variables.createVariable(v.name, collection, v.type);
    for (const m of collection.modes)
      if (v.values[m.name])
        variable.setValueForMode(
          m.modeId,
          figmaValue(v.values[m.name], byName),
        );
    variable.scopes = v.scopes as VariableScope[];
    if (v.code) variable.setVariableCodeSyntax("WEB", v.code);
    // Figma throws when removing code syntax a variable doesn't have
    else if (variable.codeSyntax.WEB) variable.removeVariableCodeSyntax("WEB");
    variable.description = v.description ?? "";
    byName.set(keyOf(v.collection, v.name), variable);
  }
  return { made, rewritten: bundle.variables.length - made };
}
