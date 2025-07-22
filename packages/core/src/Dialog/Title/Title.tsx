import MuiDialogTitle, {
  DialogTitleProps as MuiDialogTitleProps,
} from "@mui/material/DialogTitle";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvStatusIcon } from "../../StatusIcon";
import { HvTypography } from "../../Typography";
import { useDialogContext } from "../context";
import { staticClasses, useClasses } from "./Title.styles";

export { staticClasses as dialogTitleClasses };

export type HvDialogTitleClasses = ExtractNames<typeof useClasses>;

export type HvDialogTitleVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default";

export interface HvDialogTitleProps
  extends Omit<MuiDialogTitleProps, "variant" | "classes"> {
  /** Variant of the dialog title. */
  variant?: HvDialogTitleVariant;
  /** Controls if the associated icon to the variant should be shown. */
  showIcon?: boolean;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvDialogTitleClasses;
}

export const HvDialogTitle = (props: HvDialogTitleProps) => {
  const {
    classes: classesProp,
    className,
    children,
    variant,
    showIcon = variant != null,
    customIcon,
    ...others
  } = useDefaultProps("HvDialogTitle", props);

  const { classes, cx } = useClasses(classesProp);
  const { fullScreen } = useDialogContext();

  const icon = customIcon || (showIcon && <HvStatusIcon variant={variant} />);

  return (
    <HvTypography
      component={MuiDialogTitle}
      variant="title4"
      className={cx(
        classes.root,
        {
          [classes.fullscreen]: fullScreen,
          [classes.textWithIcon]: icon,
        },
        className,
      )}
      {...others}
    >
      {icon}
      {children}
    </HvTypography>
  );
};
