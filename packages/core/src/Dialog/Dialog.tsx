import { forwardRef, useMemo } from "react";
import MuiDialog, { DialogProps as MuiDialogProps } from "@mui/material/Dialog";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIconButton } from "../IconButton";
import { HvIcon } from "../icons";
import { getElementById } from "../utils/document";
import { DialogContext } from "./context";
import { staticClasses, useClasses } from "./Dialog.styles";

export { staticClasses as dialogClasses };

export type HvDialogClasses = ExtractNames<typeof useClasses>;

export interface HvDialogProps
  extends Omit<MuiDialogProps, "fullScreen" | "classes" | "open"> {
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
  /** Set the dialog to fullscreen mode. */
  fullscreen?: boolean;
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
    fullscreen: fullScreen = false, // TODO: rename to `fullScreen` in v6
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
          [classes.fullscreen]: fullScreen,
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
