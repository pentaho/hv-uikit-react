import { Children, forwardRef } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import type { HvSize } from "@hitachivantara/uikit-styles";

import { HvAvatar } from "../Avatar/Avatar";
import { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./AvatarGroup.styles";
import { HvAvatarGroupProvider } from "./AvatarGroupContext";

export { staticClasses as avatarGroupClasses };

export type HvAvatarGroupClasses = ExtractNames<typeof useClasses>;

export interface HvAvatarGroupProps extends HvBaseProps {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvAvatarGroupClasses;
  /** The avatar size. */
  size?: HvSize;
  /** The spacing between avatars. */
  spacing?: "compact" | "loose";
  /** The direction of the group. */
  direction?: "row" | "column";
  /** Whether the avatars display behind the previous avatar or on top. */
  toBack?: boolean;
  /**
   * The maximum number of visible avatars. If there are more avatars then the value of this property, an added avatar will
   * be added to the end of the list, indicating the number of hidden avatars.
   */
  maxVisible?: number;
  /**
   * What to show as an overflow representation.
   * If `undefined` a default `HvAvatar` will be displayed along with a HvTooltip with the count of overflowing items.
   * */
  overflowComponent?: (overflowCount: number) => React.ReactNode;
  /**
   * If `true` the avatars will be brought to the front when hovered.
   */
  highlight?: boolean;
}

const getSpacingValue = (
  spacing: HvAvatarGroupProps["spacing"],
  size: HvAvatarGroupProps["size"],
) => {
  switch (size) {
    case "xl":
      return spacing === "compact" ? 40 : 16;
    case "lg":
    case "md":
      return spacing === "compact" ? 32 : 20;
    case "xs":
    case "sm":
    default:
      return spacing === "compact" ? 24 : 12;
  }
};

/**
 *The Avatar Group displays a collection of avatars, often used to represent groups or teams.
 */
export const HvAvatarGroup = forwardRef<HTMLDivElement, HvAvatarGroupProps>(
  function HvAvatarGroup(props, ref) {
    const {
      className,
      style,
      classes: classesProp,
      children,
      size = "sm",
      spacing = "loose",
      direction = "row",
      maxVisible = 3,
      overflowComponent,
      highlight = false,
      toBack = false,
      ...others
    } = useDefaultProps("HvAvatarGroup", props);
    const { classes, cx } = useClasses(classesProp);

    const totalChildren = Children.count(children);
    const willOverflow = totalChildren > maxVisible;
    const overflowValue = totalChildren - maxVisible;

    const childrenToShow = Children.toArray(children).slice(0, maxVisible);

    // Since the `HvAvatar` components are displayed in reverse order using `row-reverse`, we need to reverse the array.
    if (toBack) childrenToShow.reverse();

    const overflowElement = (
      <div>
        {overflowComponent?.(overflowValue) || (
          <HvAvatar
            size={size}
            avatarProps={{ ["data-color" as string]: "neutral" }}
            backgroundColor="border"
          >
            {`+${overflowValue}`}
          </HvAvatar>
        )}
      </div>
    );

    return (
      <div
        className={cx(
          classes.root,
          classes[direction],
          {
            [classes.highlight]: highlight,
            [classes.toBack]: toBack,
          },
          className,
        )}
        style={mergeStyles(style, {
          "--spacing": `-${getSpacingValue(spacing, size)}px`,
        })}
        ref={ref}
        {...others}
      >
        <HvAvatarGroupProvider size={size}>
          {toBack && willOverflow && overflowElement}
          {childrenToShow}
          {!toBack && willOverflow && overflowElement}
        </HvAvatarGroupProvider>
      </div>
    );
  },
);
