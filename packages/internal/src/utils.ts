/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
export const allModes = {
  "Pentaho light": {
    theme: "pentaho light",
  },
  "Pentaho dark": {
    theme: "pentaho dark",
  },
  "NEXT light": {
    theme: "next light",
  },
  "NEXT dark": {
    theme: "next dark",
  },
};

type Mode = keyof typeof allModes;

const customModes = {
  light: ["NEXT light", "Pentaho light"],
  dark: ["NEXT dark", "Pentaho dark"],
  next: ["NEXT light", "NEXT dark"],
  pentaho: ["Pentaho light", "Pentaho dark"],
  default: ["NEXT light"],
  all: ["NEXT light", "NEXT dark", "Pentaho light", "Pentaho dark"],
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
