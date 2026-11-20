import { forwardRef, useMemo } from "react";
import MuiDialog, {
  type DialogProps as MuiDialogProps,
} from "@mui/material/Dialog";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";

import { HvIconButton } from "../IconButton";
import { HvIcon } from "../icons";
import { getElementById } from "../utils/document";
import { DialogContext } from "./context";
import { staticClasses, useClasses } from "./Dialog.styles";

export { staticClasses as dialogClasses };

export type HvDialogClasses = ExtractNames<typeof useClasses>;

export interface HvDialogProps extends Omit<
  MuiDialogProps,
  "classes" | "open"
> {
  /** Current state of the Dialog. */
  open?: boolean;
  /** Callback fired when the component requests to be closed. */
  onClose?: (
    event: React.MouseEvent<HTMLButtonElement> | {},
    reason?: "escapeKeyDown" | "backdropClick",
  ) => void;
  /** @inheritdoc */
  maxWidth?: MuiDialogProps["maxWidth"];
  /** @inheritdoc */
  fullWidth?: MuiDialogProps["fullWidth"];
  /** If true, the dialog stretches vertically, limited by the margins. @default false */
  fullHeight?: boolean;
  /** Title for the button close. */
  buttonTitle?: string;
  /** Prevent closing the dialog when clicking on the backdrop. */
  disableBackdropClick?: boolean;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvDialogClasses;
  /** Variant of the dialog. Adds a status bar to the top of the dialog. If not provided, no status bar is added. */
  variant?: "success" | "error" | "warning";
  /** @ignore */
  ref?: MuiDialogProps["ref"];
  /** @ignore */
  component?: MuiDialogProps["component"];
}

/**
 * A Dialog is a graphical control element in the form of a small panel that communicates information and prompts for a response.
 *
 * @variantSemantics
 * - "success": a top bar in positive, for a dialog that confirms a completed action
 * - "error": a top bar in negative, for a dialog that reports a failure
 * - "warning": a top bar in warning, for a dialog that asks people to review a risky or irreversible step
 *
 * @stateRules
 * - "open": controlled by the consumer; the dialog is visible only while open is true
 * - "onClose": when provided, renders a close icon button named by buttonTitle and runs on Escape and backdrop click; when omitted, only the dialog's own actions close it
 * - "disableBackdropClick": when true, backdrop clicks and Escape are both ignored; the close button still calls onClose
 *
 * @a11y
 * role: dialog (set by the underlying modal); pass role="alertdialog" for a must-answer confirmation
 * - name: HvDialogTitle names the dialog automatically (the dialog's aria-labelledby points at it); without a title, pass aria-label
 * - focus: focus moves into the dialog on open, stays inside while open, and returns to the trigger on close
 * - keyboard: Escape closes the dialog when onClose is provided, unless disableBackdropClick is true
 * - close button: its accessible name is buttonTitle ("Close" by default); translate it
 * - background: content behind the dialog is hidden from assistive technology while open
 */
export const HvDialog = forwardRef<
  // no-indent
  HTMLDivElement,
  HvDialogProps
>((props, ref) => {
  const {
    variant,
    classes: classesProp,
    className,
    children,
    open = false,
    onClose,
    buttonTitle = "Close",
    fullHeight,
    fullScreen = false,
    disableBackdropClick = false,
    ...others
  } = useDefaultProps("HvDialog", props);

  const { classes, cx } = useClasses(classesProp);
  const { rootId } = useTheme();

  const contextValue = useMemo(() => ({ fullScreen }), [fullScreen]);

  return (
    <MuiDialog
      container={getElementById(rootId)}
      className={className}
      classes={{
        root: classes.root,
        paper: cx(classes.paper, classes[variant!], {
          [classes.fullHeight]: fullHeight,
          [classes.statusBar]: !!variant,
          [classes.fullScreen]: fullScreen,
        }),
      }}
      ref={ref}
      open={open}
      fullScreen={fullScreen}
      onClose={(event, reason) => {
        // `disableBackdropClick` property was removed in MUI5
        // and we want to maintain that functionality
        if (disableBackdropClick) return;

        onClose?.(event, reason);
      }}
      slotProps={{
        backdrop: {
          classes: {
            root: classes.background,
          },
        },
      }}
      {...others}
    >
      {onClose && (
        <HvIconButton<"button">
          title={buttonTitle}
          className={classes.closeButton}
          onClick={(event) => onClose?.(event, undefined)}
        >
          <HvIcon name="Close" compact />
        </HvIconButton>
      )}
      <DialogContext.Provider value={contextValue}>
        {children}
      </DialogContext.Provider>
    </MuiDialog>
  );
});
