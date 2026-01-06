import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButton, HvButtonProps } from "../../Button";
import { VerticalNavigationContext } from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./Action.styles";

export { staticClasses as actionClasses };

export type HvVerticalNavigationActionClasses = ExtractNames<typeof useClasses>;

export interface HvVerticalNavigationActionProps
  extends Omit<HvButtonProps, "classes" | "icon"> {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvVerticalNavigationActionClasses;
  /** Visual label. */
  label?: string;
  /** Icon. */
  icon?: React.ReactNode;
}

export const HvVerticalNavigationAction = (
  props: HvVerticalNavigationActionProps,
) => {
  const {
    className,
    classes: classesProp,
    id,
    label = "",
    icon,
    ...others
  } = useDefaultProps("HvVerticalNavigationAction", props);

  const { isOpen } = useContext(VerticalNavigationContext);

  const { classes, cx } = useClasses(classesProp);

  return (
    <HvButton
      variant="secondaryGhost"
      icon={!isOpen}
      startIcon={isOpen && icon}
      className={cx(
        classes.action,
        {
          [classes.noIcon]: !icon,
          [classes.minimized]: !isOpen,
        },
        className,
      )}
      {...(!isOpen && { "aria-label": label })}
      {...others}
    >
      {!isOpen && icon}
      {isOpen && label}
    </HvButton>
  );
};
