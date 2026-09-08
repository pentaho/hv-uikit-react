import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { withDefaultConfig, type Props } from "react-docgen-typescript";

export interface ComponentMeta {
  component: string;
  source: string;
  package: string;
  docgen: Docgen;
  classes: Record<string, string>;
  subComponents?: string[];
  subComponentsDocgen?: Record<string, unknown>;
  componentPath?: string;
}

export interface Docgen {
  description: string;
  displayName: string;
  props: Props;
}

function cleanUndefinedValues(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(cleanUndefinedValues);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => {
          if (k === "parent" && v === undefined) {
            return [k, null];
          }
          return [k, cleanUndefinedValues(v)];
        }),
    );
  }
  return obj;
}

function filterInheritedProps(props: Props, componentName: string): Props {
  return Object.fromEntries(
    Object.entries(props).filter(([, prop]) => {
      return prop.parent
        ? prop.parent?.fileName?.includes(componentName)
        : prop.declarations?.some((d) => d.fileName?.includes(componentName));
    }),
  );
}

const parser = withDefaultConfig({
  shouldExtractLiteralValuesFromEnum: true,
  savePropValueAsString: true,
});

const getParsedDocgen = (path: string) => {
  return parser.parse(resolve("../..", path));
};

const getSubComponentLocation = (
  packageName: string,
  componentPath: string,
  subComponent: string,
) => {
  const candidates = [
    `packages/${packageName}/src/${componentPath}/${subComponent}/${subComponent}.tsx`,
    `packages/${packageName}/src/${componentPath}/${subComponent}.tsx`,
  ];

  return candidates.find((candidate) =>
    existsSync(resolve("../..", candidate)),
  );
};

export interface ComponentDataParams {
  name: string;
  packageName?: string;
  componentPath?: string;
  classes?: Record<string, string>;
  subComponents?: string[];
  showAllProps?: boolean;
}

export const getComponentData = async ({
  name,
  packageName = "core",
  componentPath = name,
  classes = {},
  subComponents = [],
  showAllProps = false,
}: ComponentDataParams): Promise<ComponentMeta> => {
  const componentLocation = `packages/${packageName}/src/${componentPath}/${name}.tsx`;
  const source = `https://github.com/pentaho/hv-uikit-react/blob/master/${componentLocation}`;

  const parsed = getParsedDocgen(componentLocation);

  const cleanedDocgen = cleanUndefinedValues(parsed[0]) as Docgen;
  if (!showAllProps) {
    cleanedDocgen.props = filterInheritedProps(cleanedDocgen.props, name);
  }

  const parsedSubComponents: Record<string, Docgen> = {};
  for (const subComponent of subComponents) {
    const subComponentLocation = getSubComponentLocation(
      packageName,
      componentPath,
      subComponent,
    );

    if (!subComponentLocation) continue;

    const parsedSubComponent = getParsedDocgen(subComponentLocation);
    const cleanedSubComponentDocgen = cleanUndefinedValues(
      parsedSubComponent[0],
    ) as Docgen;
    cleanedSubComponentDocgen.props = filterInheritedProps(
      cleanedSubComponentDocgen.props,
      name,
    );

    parsedSubComponents[subComponent] = cleanedSubComponentDocgen;
  }

  return {
    component: name,
    source,
    package: packageName,
    docgen: cleanedDocgen || {},
    classes,
    subComponents: subComponents || [],
    subComponentsDocgen: parsedSubComponents,
  };
};
