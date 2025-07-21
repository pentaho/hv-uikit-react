import { forwardRef, useCallback } from "react";
import Slide, { SlideProps } from "@mui/material/Slide";
import MuiSnackbar, {
  SnackbarProps as MuiSnackbarProps,
  SnackbarCloseReason,
  SnackbarOrigin,
} from "@mui/material/Snackbar";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionGeneric, HvActionsGenericProps } from "../ActionsGeneric";
import { capitalize } from "../utils/helpers";
import { staticClasses, useClasses } from "./Snackbar.styles";
import {
  HvSnackbarContent,
  HvSnackbarContentProps,
  HvSnackbarVariant,
} from "./SnackbarContent";

export { staticClasses as snackbarClasses };

export type HvSnackbarClasses = ExtractNames<typeof useClasses>;

export interface HvSnackbarProps
  extends Omit<MuiSnackbarProps, "action" | "classes" | "children"> {
  /** If true, Snackbar is open. */
  open?: boolean;
  /**
   * Callback fired when the component requests to be closed.
   * Typically onClose is used to set state in the parent component, which is used to control the Snackbar open prop.
   * The reason parameter can optionally be used to control the response to onClose, for example ignoring click away.
   * */
  onClose?: (
    event: Event | React.SyntheticEvent<any, Event>,
    reason: SnackbarCloseReason,
  ) => void;
  /** The message to display. */
  label?: React.ReactNode;
  /**
   * The anchor of the Snackbar. vertical: "top", "bottom" | horizontal: "left", "center", "right".
   * It defines where the snackbar will end his animation */
  anchorOrigin?: SnackbarOrigin;
  /** The number of milliseconds to wait before automatically calling the onClose function. onClose should then set the state of the open prop to hide the Snackbar */
  autoHideDuration?: number;
  /** Variant of the snackbar. */
  variant?: HvSnackbarVariant;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** Controls if the associated icon to the variant should be shown. */
  showIcon?: boolean;
  /** Controls whether to show the close icon */
  showClose?: boolean;
  /** Action to display. */
  action?: React.ReactNode | HvActionGeneric;
  /** The callback function called when an action is triggered, receiving `action` as parameter. */
  onAction?: HvActionsGenericProps["onAction"];
  /** Duration of transition in milliseconds. */
  transitionDuration?: number;
  /** Direction of slide transition. */
  transitionDirection?: "up" | "down" | "left" | "right";
  /** The container the snackbar should slide from. */
  container?: SlideProps["container"];
  /** Custom offset from top/bottom of the page, in px. */
  offset?: number;
  /** Others applied to the content of the snackbar. */
  snackbarContentProps?: HvSnackbarContentProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvSnackbarClasses;
  /** @ignore */
  ref?: MuiSnackbarProps["ref"];
}

/**
 * A Snackbar displays brief messages about app processes and dismisses automatically after a set time.
 *
 * You can build a Snackbar using:
 *
 * - `HvSnackbar` – handles positioning, transitions, auto-hide, and more.
 * - `HvSnackbarContent` – offers fine-grained control over the content and appearance.
 *
 */
export const HvSnackbar = forwardRef<
  React.ComponentRef<typeof MuiSnackbar>,
  HvSnackbarProps
>(function HvSnackbar(props, ref) {
  const {
    classes: classesProp,
    className,
    id,
    title,
    open = false,
    onClose,
    label,
    anchorOrigin = { vertical: "top", horizontal: "right" },
    autoHideDuration = 5000,
    variant,
    showIcon,
    showClose,
    customIcon,
    action,
    onAction,
    transitionDuration = 300,
    transitionDirection = "left",
    container,
    offset = 60,
    snackbarContentProps,
    ...others
  } = useDefaultProps("HvSnackbar", props);
  const { classes } = useClasses(classesProp);

  const anchorOriginOffset = {
    anchorOriginTop: {
      top: `${offset}px`,
    },
    anchorOriginBottom: {
      bottom: `${offset}px`,
    },
  };

  const SlideTransition = useCallback<
    NonNullable<MuiSnackbarProps["TransitionComponent"]>
  >(
    (properties) => (
      <Slide
        {...properties}
        container={container}
        direction={transitionDirection}
      />
    ),
    [container, transitionDirection],
  );

  return (
    <MuiSnackbar
      ref={ref}
      style={
        anchorOriginOffset[`anchorOrigin${capitalize(anchorOrigin.vertical)}`]
      }
      classes={classes}
      className={className}
      id={id}
      anchorOrigin={anchorOrigin}
      open={open}
      onClose={onClose}
      autoHideDuration={autoHideDuration}
      transitionDuration={transitionDuration}
      TransitionComponent={SlideTransition}
      {...others}
    >
      <HvSnackbarContent
        title={title}
        label={label}
        variant={variant}
        customIcon={customIcon}
        showIcon={showIcon}
        showClose={showClose}
        action={action}
        onAction={onAction}
        onClose={onClose}
        {...snackbarContentProps}
      />
    </MuiSnackbar>
  );
});
