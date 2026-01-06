import { Children, cloneElement, isValidElement, useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { HvSize } from "@hitachivantara/uikit-styles";

import { HvButtonVariant } from "../Button";
import { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./MultiButton.styles";

export { staticClasses as multiButtonClasses };
export type HvMultiButtonClasses = ExtractNames<typeof useClasses>;

export interface HvMultiButtonProps extends HvBaseProps {
  /** If all the buttons are disabled. */
  disabled?: boolean;
  /** If the MultiButton is to be displayed vertically. */
  vertical?: boolean;
  /** Button variant to use when in `split` mode */
  variant?: HvButtonVariant;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvMultiButtonClasses;
  /** Button size when in `split` mode. */
  size?: HvSize;
  /** Add a split between buttons */
  split?: boolean;
}

/**
 * Multi-buttons are grouped sets of buttons displayed horizontally or vertically in the same container.
 */
export const HvMultiButton = (props: HvMultiButtonProps) => {
  const {
    className,
    children,
    classes: classesProp,
    disabled = false,
    vertical = false,
    variant = "secondarySubtle",
    size,
    split,
    ...others
  } = useDefaultProps("HvMultiButton", props);
  const { classes, cx } = useClasses(classesProp);

  // Filter children: remove invalid and undefined/null
  const buttons = useMemo(() => {
    const btns: React.ReactElement[] = [];
    Children.forEach(children, (child) => {
      if (child && isValidElement(child)) {
        btns.push(child);
      }
    });
    return btns;
  }, [children]);

  return (
    <div
      className={cx(
        classes.root,
        {
          [classes.multiple]: !split,
          [classes.vertical]: !split && vertical,
          [classes.splitGroup]: split,
          [classes.splitGroupDisabled]: split && disabled,
        },
        className,
      )}
      {...others}
    >
      {buttons.map((child, index) => {
        return cloneElement(child, {
          key: index,
          variant,
          disabled: disabled || child.props.disabled,
          size,
          className: cx(classes.button, child.props.className, {
            [classes.firstButton]: index === 0,
            [classes.lastButton]: index === buttons.length - 1,
            [classes.selected]: child.props.selected,
          }),
        });
      })}
    </div>
  );
};
