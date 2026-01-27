import { forwardRef } from "react";
import type { SnackbarProps as MuiSnackbarProps } from "@mui/material/Snackbar";
import type { SnackbarContentProps as MuiSnackbarContentProps } from "@mui/material/SnackbarContent";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionGeneric, HvActionsGenericProps } from "../../ActionsGeneric";
import {
  HvCallout,
  HvCalloutProps,
  HvCalloutVariant,
} from "../../utils/Callout";
import { staticClasses, useClasses } from "./SnackbarContent.styles";

export { staticClasses as snackbarContentClasses };

export type HvSnackbarContentClasses = ExtractNames<typeof useClasses>;

export type HvSnackbarVariant = HvCalloutVariant;

const isActionGeneric = (action: any): action is HvActionGeneric =>
  action && typeof action === "object" && "id" in action && "label" in action;

export interface HvSnackbarContentProps
  extends Omit<MuiSnackbarContentProps, "variant" | "action" | "classes"> {
  /** The message to display. */
  label?: React.ReactNode;
  /** Variant of the snackbar. */
  variant?: HvSnackbarVariant;
  /** Controls if the associated icon to the variant should be shown. */
  showIcon?: boolean;
  /** Controls whether to show the close icon */
  showClose?: boolean;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** Action to display. */
  action?: React.ReactNode | HvActionGeneric;
  /** The callback function called when an action is triggered, receiving `action` as parameter. */
  onAction?: HvActionsGenericProps["onAction"];
  /** @inheritdoc */
  onClose?: MuiSnackbarProps["onClose"];
  /** The number of milliseconds to wait before automatically calling the onClose function.
   * onClose should then set the state of the open prop to hide the Snackbar */
  autoHideDuration?: number;
  /** Whether or not to show a progress bar indicating the auto-hide duration */
  showProgress?: boolean;
  /** Duration of transition in milliseconds. */
  transitionDuration?: number;
  /** The size of the snackbar. */
  size?: HvCalloutProps["size"];
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSnackbarContentClasses;
}

export const HvSnackbarContent = forwardRef<
  HTMLDivElement,
  HvSnackbarContentProps
>(function HvSnackbarContent(props, ref) {
  const {
    className,
    id,
    classes: classesProp,
    label,
    variant = "default",
    showIcon,
    showClose,
    customIcon,
    action,
    onAction,
    onClose,
    showProgress,
    size,
    transitionDuration,
    ...others
  } = useDefaultProps("HvSnackbarContent", props);
  const { classes, cx } = useClasses(classesProp);

  return (
    <HvCallout
      ref={ref}
      id={id}
      variant={variant}
      classes={{
        root: cx(classes.root, classes[variant], className),
        message: classes.message,
        messageIcon: classes.iconVariant,
        messageContent: classes.messageText,
        action: classes.action,
        messageContainer: classes.messageContainer,
      }}
      showIcon={showIcon}
      showClose={showClose}
      customIcon={customIcon}
      actions={isActionGeneric(action) ? [action] : action}
      onClose={onClose}
      onAction={onAction}
      showProgress={showProgress}
      transitionDuration={transitionDuration}
      size={size}
      {...others}
    >
      {label}
    </HvCallout>
  );
});
