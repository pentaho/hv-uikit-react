import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../../types/generic";
import { VerticalNavigationContext } from "../VerticalNavigationContext";
import { staticClasses, useClasses } from "./Actions.styles";

export { staticClasses as actionsClasses };

export type HvVerticalNavigationActionsClasses = ExtractNames<
  typeof useClasses
>;

export interface HvVerticalNavigationActionsProps extends HvBaseProps {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvVerticalNavigationActionsClasses;
}

export const HvVerticalNavigationActions = (
  props: HvVerticalNavigationActionsProps,
) => {
  const {
    className,
    classes: classesProp,
    children,
    ...others
  } = useDefaultProps("HvVerticalNavigationActions", props);

  const { classes, cx } = useClasses(classesProp);

  const { isOpen, useIcons } = useContext(VerticalNavigationContext);

  return (
    <div
      className={cx(
        classes.root,
        {
          [classes.hide]: !isOpen && !useIcons,
        },
        className,
      )}
      {...others}
    >
      {children}
    </div>
  );
};
