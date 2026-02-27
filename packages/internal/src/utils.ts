// eslint-disable-next-line import/no-extraneous-dependencies

type ThemeOption = `${"next" | "pentaho"} ${"light" | "dark"}`;

export const allModes = {
  "pentaho light": {
    theme: "pentaho light",
  },
  "pentaho dark": {
    theme: "pentaho dark",
  },
  "next light": {
    theme: "next light",
  },
  "next dark": {
    theme: "next dark",
  },
} satisfies Record<ThemeOption, { theme: ThemeOption }>;

type Mode = keyof typeof allModes;

const customModes = {
  light: ["next light", "pentaho light"],
  dark: ["next dark", "pentaho dark"],
  next: ["next light", "next dark"],
  pentaho: ["pentaho light", "pentaho dark"],
  default: ["next light"],
  all: ["next light", "next dark", "pentaho light", "pentaho dark"],
} satisfies Record<string, Mode[]>;

type Values = keyof typeof customModes | Mode | Mode[];

/**
 * Builds the Chromatic object needed to enable snapshots in Storybook stories
 */
export const setupChromatic = (
  values: Values = "default",
  options: Record<string, any> | number = 0,
) => {
  const resolvedValues: Mode[] = (Array.isArray(values) && values) ||
    (values in customModes &&
      customModes[values as keyof typeof customModes]) || [values as Mode];

  const modes = resolvedValues.reduce<Record<string, object>>((acc, cur) => {
    acc[cur] = allModes[cur];
    return acc;
  }, {});

  const delay = typeof options === "number" ? options : 0;
  const others = typeof options === "number" ? {} : options;

  return {
    chromatic: {
      disableSnapshot: false, // enable Chromatic snapshot
      delay,
      modes,
      ...others,
    },
  };
};

export const renderStory = (story: any, ctx: any) => {
  return story.render?.(story.args, ctx);
};
