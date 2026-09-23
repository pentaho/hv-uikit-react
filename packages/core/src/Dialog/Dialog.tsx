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
 * - "success": status bar in the positive color, confirms a completed action
 * - "error": status bar in the negative color, reports a failure or a problem that needs attention
 * - "warning": status bar in the warning color, asks the user to review a risky or irreversible step
 *
 * @stateRules
 * - "open": controlled by the consumer; the dialog is visible only while open is true, so the consumer must own this state
 * - "onClose": when provided, renders a close icon button labeled by buttonTitle and runs on Escape and backdrop click; when omitted, the dialog can only be closed by its actions
 * - "disableBackdropClick": when true, backdrop clicks and the Escape key are both ignored, so the user cannot dismiss the dialog accidentally
 *
 * @tokenConstraints
 * - color: status variants use semantic colors only (success, error, warning); never raw hex or rgb values
 * - spacing: content and custom layout inside the dialog use space tokens (xxs, xs, sm, md, lg, xl), never raw px values
 * - size: use the maxWidth values (xs, sm, md, lg, xl) or fullWidth instead of custom width styles
 *
 * @antiPatterns
 * - Do not render the dialog title as plain text or a heading; the title is then not the dialog name — Use HvDialogTitle for the title
 * - Do not place body content directly in the dialog; spacing and layout are not applied — Wrap body content in HvDialogContent
 * - Do not place buttons outside HvDialogActions; the action area layout breaks — Put every button inside HvDialogActions
 * - Do not put more than 3 buttons in one HvDialogActions; too many choices overwhelm the user — Limit actions to 3 buttons or fewer and move other choices into the content
 * - Do not use more than one primary button in HvDialogActions; the main action must be unambiguous — Use one variant="primary" button for the main action
 * - Do not use a subtle or primary variant for the secondary action; it competes with the main action — Use variant="secondaryGhost" for the secondary action
 * - Do not run a destructive action directly from its trigger button; the user loses the chance to stop — Open a confirmation HvDialog and run the action from its confirm button
 * - Do not use variants other than negativeGhost for destructive buttons; they do not signal the destructive intent — Use variant="negativeGhost" for destructive buttons
 * - Do not set disableBackdropClick for ordinary dialogs; it also blocks Escape — Leave it unset and handle unsaved changes in onClose
 *
 * @a11y
 * role: dialog (set by the underlying modal)
 * - name: the dialog needs an accessible name; set aria-labelledby to the id of HvDialogTitle, or pass aria-label
 * - focus: focus moves into the dialog on open, stays inside while open, and returns to the trigger on close
 * - keyboard: Escape closes the dialog when onClose is provided, unless disableBackdropClick is true
 * - close button: when onClose is provided, the icon close button uses buttonTitle as its accessible name; keep it localized
 * - background: content behind the dialog is hidden from assistive technology while open
 *
 * @validationRules
 * - title: each dialog must contain HvDialogTitle, not plain text or a heading (error)
 * - content: body content must be wrapped in HvDialogContent (warn)
 * - actions: every button must be inside HvDialogActions (error)
 * - button count: HvDialogActions must contain at most 3 buttons (error)
 * - primary: HvDialogActions should contain one variant="primary" button for the main action (warn)
 * - secondary: the secondary action must use variant="secondaryGhost" (error)
 * - destructive: destructive buttons must use variant="negativeGhost" (error)
 * - destructive flow: a destructive action must open a confirmation HvDialog before it runs (warn)
 * - variant: must be one of success, error, or warning (error)
 * - disableBackdropClick: also blocks the Escape key; leave unset unless required (warn)
 * - onClose: without onClose the dialog cannot be dismissed with the close button or Escape (info)
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
