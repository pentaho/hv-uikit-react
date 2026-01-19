// eslint-disable-next-line import/no-extraneous-dependencies

export const allModes = {
  "Pentaho dawn": {
    theme: "pentaho light",
  },
  "Pentaho wicked": {
    theme: "pentaho dark",
  },
  "DS5 dawn": {
    theme: "next light",
  },
  "DS5 wicked": {
    theme: "next dark",
  },
};

type Mode = keyof typeof allModes;

const customModes = {
  light: ["DS5 dawn", "Pentaho dawn"],
  dark: ["DS5 wicked", "Pentaho wicked"],
  next: ["DS5 dawn", "DS5 wicked"],
  pentaho: ["Pentaho dawn", "Pentaho wicked"],
  default: ["DS5 dawn"],
  all: ["DS5 dawn", "DS5 wicked", "Pentaho dawn", "Pentaho wicked"],
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
