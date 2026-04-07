import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvTypography, type HvTypographyProps } from "../../Typography";
import { setId } from "../../utils/setId";
import { HvFormElementContext } from "../context";
import { staticClasses, useClasses } from "./InfoMessage.styles";

export { staticClasses as infoMessageClasses };

export type HvInfoMessageClasses = ExtractNames<typeof useClasses>;

export interface HvInfoMessageProps extends HvTypographyProps<"label"> {
  /** If `true` the label is disabled. */
  disabled?: boolean;
  /** If `true` the info message won't have margins. */
  disableGutter?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvInfoMessageClasses;
}

/**
 * Provides the user with additional descriptive text for the form element.
 */
export const HvInfoMessage = (props: HvInfoMessageProps) => {
  const {
    id: idProp,
    classes: classesProp,
    className,
    children,
    disabled: disabledProp,
    disableGutter,
    ...others
  } = useDefaultProps("HvInfoMessage", props);
  const { classes, cx } = useClasses(classesProp);

  const context = useContext(HvFormElementContext);
  const disabled = disabledProp ?? context.disabled;
  const id = idProp ?? setId(context.id, "description");

  return (
    <HvTypography
      id={id}
      className={cx(
        classes.root,
        {
          [classes.infoDisabled]: !!disabled,
          [classes.gutter]: !disableGutter,
        },
        className,
      )}
      variant="body"
      component="label"
      {...others}
    >
      {children}
    </HvTypography>
  );
};
