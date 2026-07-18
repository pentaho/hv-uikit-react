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
import type { IconBaseProps } from "./IconBase";

const selectors = ["Checkbox", "RadioButton"];

const largerIcons = [
  "Level0Good",
  "Level1",
  "Level2Average",
  "Level3Bad",
  "Level4",
  "Level5",
  "Canceled",
  "Running",
  "Pending",
];

/** Whether the component is a selector with special coloring */
export const isSelector = (iconName: string) =>
  selectors.some((el) => iconName.startsWith(el));

export const isSort = (iconName: string) => iconName.startsWith("Sort");

/** Semantic icons have a larger size by default */
export const isSemantic = (iconName: string) => largerIcons.includes(iconName);

export const isXS = (iconName: string) => iconName.endsWith("XS");

// TODO: remove in v6?
const getCustomSize = (size: number, iconName: string) =>
  isSemantic(iconName) ? size + 8 : size;

/** sizes for the <svg> icon */
const getSvgSize = (size: IconBaseProps["size"]) => {
  switch (size) {
    case "xs":
    case "XS":
      return 12;
    case "sm":
    case "S":
    case undefined:
      return 16;
    case "md":
    case "M":
      return 32;
    case "lg":
    case "L":
      return 96;
    case "xl":
      return 112;
    default:
      return size;
  }
};

export const getSizeStyles = (
  iconName: string,
  size: IconBaseProps["size"] = isXS(iconName) ? "XS" : "S",
) => {
  const baseSize = getSvgSize(size);
  const fontSize = getCustomSize(baseSize, iconName);
  if (fontSize === 16) return; // use default values

  const containerSize = baseSize + 2 * (baseSize === 12 ? 10 : 8);

  return {
    fontSize,
    /** icon container size. @private */
    "--icsize": `${containerSize}px`,
  };
};
