import type { HvColor } from "@hitachivantara/uikit-styles";

import { IconBase, type IconBaseProps } from "./IconBase";
import { isSelector, isSort } from "./utils";

const getSecondaryColor = (iconName: string): HvColor => {
  if (isSelector(iconName)) return "bgContainer"; // atmo1
  if (isSort(iconName)) return "border"; // atmo4

  return "bgPage"; // atmo2
};

export interface HvIconSpriteProps extends Omit<
  IconBaseProps,
  "viewbox" | "inverted" | "semantic"
> {
  /**
   * The URL to the SVG icon sprite, served statically by the application.
   * @example "/public/icons.svg"
   * */
  spriteUrl: string;
  /** The icon `id` to use. Must be present within the sprite sheet. */
  iconName: string;
}

/** The HvIconSprite component is used to display SVG icons from a sprite sheet. */
export const HvIconSprite = ({
  spriteUrl,
  iconName,
  ...others
}: HvIconSpriteProps) => {
  // this color array is fragile... we know it currently covers all the existing icons
  const baseColors: HvColor[] = ["text", getSecondaryColor(iconName)];

  return (
    <IconBase iconName={iconName} palette={baseColors} {...others}>
      <use href={`${spriteUrl}#${iconName}`} />
    </IconBase>
  );
};
