import {
  HvDialog,
  useDefaultProps,
  type ExtractNames,
  type HvBaseProps,
  type HvDialogProps,
} from "@hitachivantara/uikit-react-core";

import { staticClasses, useClasses } from "./WizardContainer.styles";

export { staticClasses as wizardContainerClasses };

export type HvWizardContainerClasses = ExtractNames<typeof useClasses>;

export interface HvWizardContainerProps
  extends
    Omit<HvBaseProps, "onClose">,
    Pick<HvDialogProps, "maxWidth" | "fullWidth"> {
  /** Current state of the Wizard. */
  open: boolean;
  /** Function executed on close. */
  handleClose: HvDialogProps["onClose"];
  /** A Jss Object used to override or extend the styles applied to the empty state Wizard. */
  classes?: HvWizardContainerClasses;
}

export const HvWizardContainer = (props: HvWizardContainerProps) => {
  const {
    classes: classesProp,
    children,
    handleClose,
    ...others
  } = useDefaultProps("HvWizardContainer", props);
  const { classes } = useClasses(classesProp);

  return (
    <HvDialog
      classes={{
        root: classes.root,
        closeButton: classes.closeButton,
        paper: classes.paper,
      }}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      {...others}
    >
      {children}
    </HvDialog>
  );
};
