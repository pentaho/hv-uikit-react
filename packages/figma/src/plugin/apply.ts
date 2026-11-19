// The sync inside Figma (the plugin runs it): reads the file's variables and the baseline each keeps (shared plugin
// data, what the last sync wrote), plans with diff.ts, and with `apply` writes what the plan allows (writesOf):
// creates, updates, and a missing or stale baseline. A Figma edit or a conflict is never written; nothing is deleted.
// The collections it makes are marked; a collection it didn't make gets no mode added, the missing one is reported.
/* eslint-disable no-await-in-loop -- Figma's API calls run one after another */
import type { Bundle, FigmaVariable } from "../sync/types.ts";
import {
  descriptionText,
  fieldsOf,
  planSync,
  scopesText,
  valueText,
  writesOf,
  type Current,
  type Fields,
} from "./diff.ts";

export const NS = "pentaho_uikit"; // the plugin's shared plugin data
const BASELINE = "baseline";
const MADE = "made"; // on a collection the sync made

type Ctx = {
  collections: Map<string, VariableCollection>;
  byName: Map<string, Variable>;
};
type Baseline = NonNullable<Current["baseline"]>;

const baselineOf = (v: Variable): Baseline | undefined => {
  const stored = v.getSharedPluginData(NS, BASELINE);
  return stored ? JSON.parse(stored) : undefined;
};

/** A Figma value as diff.ts writes values; an alias by its target's name in the code (`names`), so a rename in Figma
 * isn't a change. */
async function figmaValueText(
  v: VariableValue,
  names: Map<string, string>,
): Promise<string> {
  if (typeof v === "object" && "type" in v && v.type === "VARIABLE_ALIAS")
    return `alias:${names.get(v.id) ?? (await figma.variables.getVariableByIdAsync(v.id))?.name}`;
  if (typeof v === "object" && "r" in v)
    return valueText({ color: [v.r, v.g, v.b, "a" in v ? v.a : 1] });
  return String(v);
}

async function currentOf(
  v: Variable,
  c: VariableCollection,
  names: Map<string, string>,
): Promise<Current> {
  const fields: Fields = {
    description: descriptionText(v.description),
    scopes: scopesText(v.scopes),
    code: v.codeSyntax.WEB ?? "",
  };
  for (const m of c.modes)
    fields[m.name] = await figmaValueText(v.valuesByMode[m.modeId], names);
  const baseline = baselineOf(v);
  return {
    id: v.id,
    collection: c.name,
    name: v.name,
    fields,
    ...(baseline && { baseline }),
  };
}

/** The file's variables; each also by its name in the code (from what the last sync wrote, else its Figma name). */
async function readFile(bundle: Bundle) {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const variables = await figma.variables.getLocalVariablesAsync();
  const byId = new Map(collections.map((c) => [c.id, c]));

  const nameOfPath = new Map(bundle.variables.map((v) => [v.path, v.name]));
  const names = new Map(
    variables.map((v) => [
      v.id,
      nameOfPath.get(baselineOf(v)?.path ?? "") ?? v.name,
    ]),
  );
  const current = await Promise.all(
    variables.map((v) =>
      currentOf(v, byId.get(v.variableCollectionId)!, names),
    ),
  );
  const byName = new Map(
    variables.map((v) => [
      `${byId.get(v.variableCollectionId)!.name}/${names.get(v.id)}`,
      v,
    ]),
  );
  return { current, collections, byName };
}

const madeBySync = (c: VariableCollection) =>
  c.getSharedPluginData(NS, MADE) === "1";

/** The modes the bundle needs that a collection the sync didn't make lacks: never added, a person decides. */
function missingModes(bundle: Bundle, existing: VariableCollection[]) {
  return bundle.collections.flatMap((spec) => {
    const c = existing.find((x) => x.name === spec.name);
    if (!c || madeBySync(c)) return [];
    return spec.modes
      .filter((mode) => !c.modes.some((m) => m.name === mode))
      .map((mode) => `${spec.name}: no ${mode} mode`);
  });
}

/** The bundle's collections: made (and marked) where missing; modes added only to those the sync made. */
function ensureCollections(
  bundle: Bundle,
  existing: VariableCollection[],
): Map<string, VariableCollection> {
  const out = new Map(existing.map((c) => [c.name, c]));
  for (const spec of bundle.collections) {
    let c = out.get(spec.name);
    if (!c) {
      c = figma.variables.createVariableCollection(spec.name);
      c.setSharedPluginData(NS, MADE, "1");
      c.renameMode(c.modes[0].modeId, spec.modes[0]);
    }
    if (madeBySync(c))
      for (const mode of spec.modes)
        if (!c.modes.some((m) => m.name === mode)) c.addMode(mode);
    out.set(spec.name, c);
  }
  return out;
}

function figmaValue(
  value: FigmaVariable["values"][string],
  ctx: Ctx,
): VariableValue {
  if ("alias" in value) {
    const target =
      ctx.byName.get(`Primitives/${value.alias}`) ??
      ctx.byName.get(`Color/${value.alias}`);
    if (!target) throw new Error(`No variable ${value.alias} to point at.`);
    return figma.variables.createVariableAlias(target);
  }
  if ("color" in value) {
    const [r, g, b, a] = value.color;
    return { r, g, b, a };
  }
  return value.value;
}

const stamp = (variable: Variable, v: FigmaVariable) =>
  variable.setSharedPluginData(
    NS,
    BASELINE,
    JSON.stringify({ path: v.path, fields: fieldsOf(v) }),
  );

/** Writes `v` (made when `id` is missing), its metadata, and its baseline. */
async function write(v: FigmaVariable, id: string | undefined, ctx: Ctx) {
  const collection = ctx.collections.get(v.collection)!;
  const existing = id ? await figma.variables.getVariableByIdAsync(id) : null;
  const variable =
    existing ?? figma.variables.createVariable(v.name, collection, v.type);
  for (const m of collection.modes)
    if (v.values[m.name])
      variable.setValueForMode(m.modeId, figmaValue(v.values[m.name], ctx));

  variable.scopes = v.scopes as VariableScope[];
  if (v.code) variable.setVariableCodeSyntax("WEB", v.code);
  // Figma throws when removing code syntax a variable doesn't have
  else if (variable.codeSyntax.WEB) variable.removeVariableCodeSyntax("WEB");
  variable.description = v.description ?? "";
  stamp(variable, v);
  ctx.byName.set(`${v.collection}/${v.name}`, variable);
}

/** Plans the sync and, with `apply`, writes it; returns what it found and did. */
export async function sync(bundle: Bundle, apply = false) {
  const file = await readFile(bundle);
  const plan = planSync(bundle, file.current);
  const count = (a: string) =>
    plan.changes.filter((c) => c.action === a).length;
  const report = {
    create: count("create"),
    update: count("update"),
    unchanged: count("unchanged"),
    figmaEdits: plan.changes.filter((c) => c.action === "figma-edit"),
    conflicts: plan.changes.filter((c) => c.action === "conflict"),
    notInCode: plan.notInCode,
    missingModes: missingModes(bundle, file.collections),
    written: 0,
    applied: false,
  };
  if (!apply) return report;

  const ctx: Ctx = {
    collections: ensureCollections(bundle, file.collections),
    byName: file.byName,
  };
  const byPath = new Map(bundle.variables.map((v) => [v.path, v]));
  const { full, baseline } = writesOf(plan.changes);
  for (const c of full) await write(byPath.get(c.path)!, c.id, ctx);
  for (const c of baseline) {
    const variable = await figma.variables.getVariableByIdAsync(c.id!);
    if (variable) stamp(variable, byPath.get(c.path)!);
  }
  return { ...report, written: full.length + baseline.length, applied: true };
}
