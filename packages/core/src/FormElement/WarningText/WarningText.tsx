import { useContext } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIcon } from "../../icons";
import { HvBaseProps } from "../../types/generic";
import { setId } from "../../utils/setId";
import { HvFormElementContext } from "../context";
import { staticClasses, useClasses } from "./WarningText.styles";

export { staticClasses as warningTextClasses };

export type HvWarningTextClasses = ExtractNames<typeof useClasses>;

export interface HvWarningTextProps extends HvBaseProps {
  /** Icon to be rendered alongside the warning text. */
  adornment?: React.ReactNode;
  /** If `true` the text is not rendered. */
  isVisible?: boolean;
  /** If `true` the text is disabled. */
  disabled?: boolean;
  /** If `true` the text won't include a gutter. */
  disableGutter?: boolean;
  /** If `true` the text won't include the top border. */
  disableBorder?: boolean;
  /** If `true` the adornment icon isn't shown. */
  disableAdornment?: boolean;
  /** If `true` the text isn't shown. */
  hideText?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvWarningTextClasses;
}

/**
 * Provides the user with a descriptive text, signaling an error, for when the form element is in an invalid state.
 */
export const HvWarningText = (props: HvWarningTextProps) => {
  const {
    children,
    adornment: adornmentProp,
    isVisible: isVisibleProp,
    classes: classesProp,
    className,
    id: idProp,
    disabled: disabledProp,
    disableGutter,
    disableBorder,
    disableAdornment,
    hideText,
    ...others
  } = useDefaultProps("HvWarningText", props);
  const { classes, cx } = useClasses(classesProp);

  const context = useContext(HvFormElementContext);
  const disabled = disabledProp ?? context.disabled;
  const visible = isVisibleProp ?? context.status === "invalid";
  const id = idProp ?? setId(context.id, "error");
  const showWarning = visible && !disabled;
  const adornment = adornmentProp || (
    <HvIcon compact name="Fail" size="xs" className={classes.defaultIcon} />
  );

  return (
    <div
      className={cx(
        classes.root,
        {
          [classes.show]: showWarning,
          [classes.topBorder]: !disableBorder,
        },
        className,
      )}
    >
      {!disableAdornment && adornment}
      <span
        id={id}
        className={cx(classes.warningText, {
          [classes.topGutter]: !disableGutter,
          [classes.hideText]: hideText,
        })}
        role="status"
        aria-live="polite"
        aria-relevant="additions text"
        {...others}
      >
        {showWarning && children}
      </span>
    </div>
  );
};
