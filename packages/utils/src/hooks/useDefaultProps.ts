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
import { useMemo } from "react";

import { useCss } from "./useCss";
import { useTheme } from "./useTheme";

/** Filter out `undefined` entries from `props` object. */
function filterProps(props: Record<string, any>) {
  return Object.keys(props).reduce<typeof props>((acc, key) => {
    if (props[key] !== undefined) {
      acc[key] = props[key];
    }
    return acc;
  }, {});
}

/** Injects into `props` the props defined in the theme `componentName`. */
export function useDefaultProps<T extends Record<string, any>>(
  /** Name of the theme component key to inject defaultProps */
  componentName: string, // keyof HvThemeComponents,
  props: T,
): T {
  const { activeTheme } = useTheme();
  const { css, cx } = useCss();

  const themeDefaultProps = activeTheme?.components?.[componentName];

  const classes = useMemo(() => {
    const themeClasses = themeDefaultProps?.classes || {};
    const propsClasses = props?.classes || {};
    const classKeys = [
      ...Object.keys(themeClasses),
      ...Object.keys(propsClasses),
    ];
    if (classKeys.length === 0) return undefined;
    return classKeys.reduce<Record<string, string>>((acc, key) => {
      acc[key] = cx(
        themeClasses[key] && css(themeClasses[key]),
        propsClasses[key],
      );
      return acc;
    }, {});
  }, [css, cx, props?.classes, themeDefaultProps?.classes]);

  return {
    ...themeDefaultProps,
    ...filterProps(props),
    ...(classes && { classes }),
  };
}
