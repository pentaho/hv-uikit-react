import { forwardRef } from "react";
import MuiDrawer, { DrawerProps as MuiDrawerProps } from "@mui/material/Drawer";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvIconButton } from "../IconButton";
import { HvIcon } from "../icons";
import { staticClasses, useClasses } from "./Drawer.styles";

export { staticClasses as drawerClasses };

export type HvDrawerClasses = ExtractNames<typeof useClasses>;

export interface HvDrawerProps extends Omit<MuiDrawerProps, "classes"> {
  /**
   * Class names to be applied.
   */
  className?: string;
  /**
   * Id to be applied to the root node.
   */
  id?: string;
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvDrawerClasses;
  /**
   * Components of the Drawer.
   */
  children?: React.ReactNode;
  /**
   * Current state of the Drawer.
   */
  open?: boolean;
  /**
   * Function executed on close.
   * Extended from Modal from material-ui
   *
   */
  onClose?: (
    event: React.SyntheticEvent,
    reason?: "escapeKeyDown" | "backdropClick",
  ) => void;
  /**
   * The side the drawer opens from.
   */
  anchor?: "left" | "top" | "right" | "bottom";
  /**
   * Title for the button close.
   */
  buttonTitle?: string;
  /**
   * Show backdrop when drawer is open.
   * @deprecated Use `hideBackdrop` instead.
   */
  showBackdrop?: boolean;
  /**
   * Prevent closing the dialog when clicking on the backdrop.
   */
  disableBackdropClick?: boolean;
  /** @ignore */
  ref?: MuiDrawerProps["ref"];
  /** @ignore */
  component?: MuiDrawerProps["component"];
}

/**
 * The Drawer component provides a foundation to create a sliding pane.
 * It only provides the pane with a close button, the rest of the
 * content can be customized.
 */
export const HvDrawer = forwardRef<
  React.ComponentRef<typeof MuiDrawer>,
  HvDrawerProps
>(function HvDrawer(props, ref) {
  const {
    className,
    classes: classesProp,
    children,
    open,
    onClose,
    anchor = "right",
    buttonTitle = "Close",
    showBackdrop = true,
    hideBackdrop,
    disableBackdropClick = false,
    ...others
  } = useDefaultProps("HvDrawer", props);

  const { classes, cx } = useClasses(classesProp);

  const handleOnClose: MuiDrawerProps["onClose"] = (
    event: React.SyntheticEvent,
    reason,
  ) => {
    if (reason === "backdropClick" && disableBackdropClick) return;

    onClose?.(event, reason);
  };

  const shouldHideBackdrop = hideBackdrop ?? !showBackdrop;

  return (
    <MuiDrawer
      ref={ref}
      className={cx(classes.root, className)}
      anchor={anchor}
      open={open}
      classes={{
        paper: classes.paper,
      }}
      hideBackdrop={shouldHideBackdrop}
      {...(!shouldHideBackdrop && {
        slotProps: {
          backdrop: {
            classes: {
              root: classes.background,
            },
          },
        },
      })}
      onClose={handleOnClose}
      {...others}
    >
      {onClose && (
        <HvIconButton
          className={classes.closeButton}
          onClick={onClose}
          title={buttonTitle}
        >
          <HvIcon name="Close" />
        </HvIconButton>
      )}
      {children}
    </MuiDrawer>
  );
});
