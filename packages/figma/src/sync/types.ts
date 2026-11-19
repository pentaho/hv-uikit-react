// What the plugin applies: the sync file (figma-sync.json: the library's variables and text styles, from the tokens)
// and the documentation pages it carries (content/: frames, text and instances of the library's components by name,
// colored by token name).
type Sizing = "FIXED" | "HUG" | "FILL";
/** A color: a token by name; `rgb` only for one the code has no token for. */
export type Paint = {
  variable?: string;
  rgb?: [number, number, number];
  opacity?: number;
};
/** A library component by name; `variant` picks one of a set's variants. */
export type ComponentRef = {
  component: string;
  variant?: Record<string, string>;
};
export type ImageFill = { image: string; scale: string }; // an image already in the file, by its hash
export type PropertyValue = string | boolean | ComponentRef;
/** The designers' page template (content/page-template.json): page layers whose values may be `{{placeholders}}`,
 * with `slot`, `if` and `each` marking where and whether a page's content goes. */
export type TemplateNode = Record<string, unknown> & {
  name?: string;
  children?: TemplateNode[];
};
type Base = {
  name: string;
  sizing: [Sizing, Sizing];
  size: [number, number];
  at?: [number, number];
  absolute?: true;
};
/** Properties Figma names the same in its file and its Plugin API, set as they are. */
type Settings = Record<string, string | number>;
export type Override = {
  path: number[];
  images?: ImageFill[];
  font?: { family: string; style: string; size: number }; // a label given a font of its own
  swap?: ComponentRef; // the component a nested instance is swapped to
  properties?: Record<string, PropertyValue>;
  fills?: Paint[];
  strokes?: Paint[];
  set?: Settings;
};
export type TextLayer = Base & {
  type: "text";
  characters: string;
  style?: string;
  fill?: Paint;
  align?: string;
  truncate?: true;
};
export type InstanceLayer = Base &
  ComponentRef & {
    type: "instance";
    properties?: Record<string, PropertyValue>;
    overrides?: Override[];
  };
export type FrameLayer = Base & {
  type: "frame";
  direction?: "HORIZONTAL" | "VERTICAL";
  wrap?: true;
  gap?: number;
  rowGap?: number; // between wrapped rows
  padding?: [number, number, number, number];
  main?: string;
  cross?: string;
  radius?: number | number[];
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  clips?: true;
  set?: Settings;
  children: Layer[];
};
export type Layer = TextLayer | InstanceLayer | FrameLayer;
type SetItem = { type: "set"; name: string; at: [number, number] };
export interface ComponentsArea {
  name: string;
  at: [number, number]; // from the documentation frame
  size: [number, number];
  items: (Layer | SetItem)[];
}
export interface DocPage {
  name: string; // the Figma page it goes on
  page: FrameLayer;
  components?: ComponentsArea;
}

export type Value =
  | { alias: string }
  | { color: [number, number, number, number] }
  | { value: number | string };
export interface FigmaVariable {
  path: string; // the token's path in code: colors.primary
  collection: string;
  name: string; // in its collection: Primary/primary
  type: "COLOR" | "FLOAT" | "STRING";
  values: Record<string, Value>; // by mode name
  scopes: string[];
  code?: string; // the WEB code syntax: var(--uikit-colors-primary)
  description?: string;
}
export interface TextStyle {
  name: string; // Typography/body
  family: string;
  weight: number;
  size: number;
  lineHeight: number; // px
  letterSpacing: number; // a percentage of the size, as Figma takes it
}
/** A library component by its key: imported where the file doesn't have it (a file that uses the library rather
 * than the library itself). */
export type LibraryKey = { key: string; type: "set" | "component" };
/** figma-sync.json. */
export interface Bundle {
  version: 1;
  collections: { name: string; modes: string[] }[];
  variables: FigmaVariable[];
  textStyles: TextStyle[];
}
