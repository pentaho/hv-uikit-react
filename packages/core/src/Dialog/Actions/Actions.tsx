import MuiDialogActions, {
  DialogActionsProps as MuiDialogActionsProps,
} from "@mui/material/DialogActions";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useDialogContext } from "../context";
import { staticClasses, useClasses } from "./Actions.styles";

export { staticClasses as dialogActionClasses };

export type HvDialogActionClasses = ExtractNames<typeof useClasses>;

export interface HvDialogActionsProps
  extends Omit<MuiDialogActionsProps, "classes"> {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvDialogActionClasses;
}

export const HvDialogActions = (props: HvDialogActionsProps) => {
  const {
    classes: classesProp,
    className,
    children,
    ...others
  } = useDefaultProps("HvDialogActions", props);
  const { fullScreen } = useDialogContext();
  const { classes, cx } = useClasses(classesProp);

  return (
    <MuiDialogActions
      className={className}
      classes={{
        root: cx(classes.root, { [classes.fullscreen]: fullScreen }),
        spacing: classes.spacing,
      }}
      {...others}
    >
      {children}
    </MuiDialogActions>
  );
};
