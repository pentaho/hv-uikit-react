// The Figma library as the Code Connect generator reads it: code-connect/library.json says which Figma
// components there are, their nodes and keys, and which UI Kit component each is drawn for; properties.json holds
// each one's properties (names without Figma's "#id", a variant's values), captured from the library. Pure, so it is
// tested without Figma.
import type { LibraryKey } from "../sync/types.ts";

export type Property =
  | { type: "VARIANT"; values: string[] }
  | { type: "BOOLEAN" | "TEXT" | "INSTANCE_SWAP" };
export type Properties = Record<string, Record<string, Property>>; // properties.json: by Figma component name
export interface LibraryComponent {
  name: string; // in Figma: Button/Small, Icon/Plus
  id: string; // its node
  key: string;
  element: string; // the UI Kit component (an icon: its @phosphor-icons/react name)
  icon?: true;
  properties: Record<string, Property>;
}
export interface Library {
  file: string;
  components: LibraryComponent[];
}

/** code-connect/library.json. */
type Entry = {
  name: string;
  type: LibraryKey["type"];
  key: string;
  node: string;
  part?: boolean;
};
export interface LibraryJson {
  file: { key: string; name: string };
  components: Record<string, Entry[]>;
  icons: Record<string, { key: string; node: string }>;
}

// byte order, not the locale's: the same file on every machine
const order = (x: string, y: string) => (x < y ? -1 : Number(x > y));

/** The library: every component library.json lists, with its captured properties, sorted by name. */
export function libraryOf(json: LibraryJson, properties: Properties): Library {
  const components: LibraryComponent[] = Object.entries(
    json.components,
  ).flatMap(([element, entries]) =>
    entries.map((e) => ({
      name: e.name,
      id: e.node,
      key: e.key,
      element,
      properties: properties[e.name] ?? {},
    })),
  );
  const icons: LibraryComponent[] = Object.entries(json.icons).map(
    ([name, e]) => ({
      name: `Icon/${name}`,
      id: e.node,
      key: e.key,
      element: name,
      icon: true,
      properties: {},
    }),
  );
  return {
    file: json.file.key,
    components: [...components, ...icons].toSorted((a, b) =>
      order(a.name, b.name),
    ),
  };
}

/** Each component's key: what a page imports in a file that only uses the library. */
export function keysOf(json: LibraryJson): Record<string, LibraryKey> {
  const entries = Object.values(json.components)
    .flat()
    .map((e) => [e.name, { key: e.key, type: e.type }] as const);
  const icons = Object.entries(json.icons).map(
    ([n, e]) => [`Icon/${n}`, { key: e.key, type: "component" }] as const,
  );
  return Object.fromEntries(
    [...entries, ...icons].toSorted(([a], [b]) => order(a, b)),
  );
}
