// Figma's REST variables (GET /v1/files/:key/variables/local, Enterprise) as the sync compares them: each variable's
// fields as diff.ts writes them, so the same plan comes out as in the plugin. The REST API has no plugin data, so
// there is no baseline: it says what differs, not who changed it. Pure, so it's tested without Figma.
import {
  descriptionText,
  scopesText,
  valueText,
  type Current,
  type Fields,
} from "./diff.ts";

type Color = { r: number; g: number; b: number; a?: number };
type RestValue =
  | number
  | string
  | boolean
  | Color
  | { type: "VARIABLE_ALIAS"; id: string };
interface RestVariable {
  id: string;
  name: string;
  variableCollectionId: string;
  valuesByMode: Record<string, RestValue>;
  description: string;
  resolvedType?: string;
  scopes: string[];
  codeSyntax: { WEB?: string };
  remote: boolean;
}
interface RestCollection {
  id: string;
  name: string;
  modes: { modeId: string; name: string }[];
}
export interface LocalVariables {
  meta: {
    variables: Record<string, RestVariable>;
    variableCollections: Record<string, RestCollection>;
  };
}

/** A REST value as diff.ts writes values; an alias by its target's name. */
function text(v: RestValue, names: Map<string, string>): string {
  if (typeof v !== "object") return String(v);
  if ("type" in v) return `alias:${names.get(v.id) ?? v.id}`;
  return valueText({ color: [v.r, v.g, v.b, v.a ?? 1] });
}

/** Scopes as the plugin API names them: REST calls a number's FONT_WEIGHT scope FONT_STYLE. */
const scopesOf = (v: RestVariable) =>
  v.resolvedType === "FLOAT"
    ? v.scopes.map((s) => (s === "FONT_STYLE" ? "FONT_WEIGHT" : s))
    : v.scopes;

/** The file's own variables (not ones it uses from another library), as the sync's plan reads them. */
export function currentOf({ meta }: LocalVariables): Current[] {
  const own = Object.values(meta.variables).filter((v) => !v.remote);
  const names = new Map(own.map((v) => [v.id, v.name]));
  return own.map((v) => {
    const collection = meta.variableCollections[v.variableCollectionId];
    const fields: Fields = {
      description: descriptionText(v.description),
      scopes: scopesText(scopesOf(v)),
      code: v.codeSyntax.WEB ?? "",
    };
    for (const m of collection.modes)
      if (m.modeId in v.valuesByMode)
        fields[m.name] = text(v.valuesByMode[m.modeId], names);
    return { id: v.id, collection: collection.name, name: v.name, fields };
  });
}
