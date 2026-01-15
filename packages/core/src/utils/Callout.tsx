// oxlint-disable complexity
import { forwardRef, useEffect, useState } from "react";
import type { SnackbarProps as MuiSnackbarProps } from "@mui/material/Snackbar";
import SnackbarContent, {
  type SnackbarContentProps as MuiSnackbarContentProps,
} from "@mui/material/SnackbarContent";
import {
  createClasses,
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { HvActionsGeneric, HvActionsGenericProps } from "../ActionsGeneric";
import { HvButton, HvButtonProps } from "../Button";
import { HvIcon } from "../icons";
import { HvStatusIcon } from "../StatusIcon";
import { iconVariant } from "./iconVariant";

const { useClasses } = createClasses("HvCallout", {
  root: {
    position: "relative",
    boxShadow: "none",
    flexWrap: "nowrap",
    borderRadius: theme.radii.round,
    alignItems: "center",
    overflow: "hidden",

    "&[data-size='large']": {
      padding: theme.space.sm,
    },
    "&[data-size='regular']": {
      padding: theme.space.xs,
    },
    "&[data-size='micro']": {
      padding: 0,
    },
  },
  success: {
    backgroundColor: theme.colors.positiveDimmed,
  },
  warning: {
    backgroundColor: theme.colors.warningDimmed,
  },
  error: {
    backgroundColor: theme.colors.negativeDimmed,
  },
  info: {
    backgroundColor: theme.colors.infoDimmed,
  },
  accent: {
    backgroundColor: theme.colors.accentDimmed,
  },
  default: {
    backgroundColor: theme.colors.infoDimmed,
  },
  message: {
    display: "flex",
    alignItems: "center",
    padding: 0,
    color: theme.colors.textDark,
    width: "100%",
  },
  messageContent: {
    textWrap: "balance",
    overflow: "hidden",
    wordBreak: "break-word",
  },
  messageIcon: {},
  messageTitle: {
    display: "block",
    fontWeight: theme.fontWeights.semibold,
  },
  action: {
    marginRight: 0,
  },
  actionContent: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "space-between",
    gap: theme.space.xs,
    alignItems: "flex-start",
  },
  actionCustom: {
    flex: "0 0 auto",
  },
  actionClose: {
    alignSelf: "flex-end",
  },
  messageContainer: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: theme.space.xs,
  },
  progress: {
    height: 4,
    position: "absolute",
    backgroundColor: "var(--icolor)",
    top: 0,
    left: 0,
  },
});

export type HvCalloutVariant =
  | "success"
  | "warning"
  | "error"
  | "default"
  | "info"
  | "accent";

export type HvCalloutActionPosition = "auto" | "inline" | "bottom-right";

export type HvCalloutClasses = ExtractNames<typeof useClasses>;

export interface HvCalloutProps
  extends Omit<
    MuiSnackbarContentProps,
    "title" | "variant" | "classes" | "onClose"
  > {
  /** The title to display. */
  title?: React.ReactNode;
  /** The message to display. */
  children?: React.ReactNode;
  /** Variant of the snackbar. */
  variant?: HvCalloutVariant;
  /** Controls if the associated icon to the variant should be shown. */
  showIcon?: boolean;
  /** Controls whether to show the close icon */
  showClose?: boolean;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** @inheritdoc */
  onClose?: MuiSnackbarProps["onClose"];
  /** Actions to display on the right side. */
  actions?: HvActionsGenericProps["actions"];
  /** The callback function called when an action is triggered, receiving `action` as parameter. */
  onAction?: HvActionsGenericProps["onAction"];
  /** The position property of the header. */
  actionsPosition?: HvCalloutActionPosition;
  /** The props to pass down to the Action Container. */
  actionProps?: Partial<HvButtonProps>;
  /** The number of milliseconds to wait before automatically calling the onClose function.
   * onClose should then set the state of the open prop to hide the Snackbar */
  autoHideDuration?: number;
  /** Whether or not to show a progress bar indicating the auto-hide duration */
  showProgress?: boolean;
  /** Duration of transition in milliseconds. */
  transitionDuration?: number;
  /** The size of the banner. */
  size?: "large" | "regular" | "toast" | "micro";
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvCalloutClasses;
}

const getIconSize = (size: HvCalloutProps["size"]) => {
  switch (size) {
    case "large":
      return "md";
    case "toast":
      return "xs";
    default:
      return "sm";
  }
};

/**
 * `HvCallout` is the internal content handler for the snackbars and banners. Might be promoted to a component.
 * @private @internal
 */
export const HvCallout = forwardRef<
  // no-indent
  HTMLDivElement,
  HvCalloutProps
>(function HvCallout(props, ref) {
  const {
    id,
    classes: classesProp,
    className,
    title,
    showClose,
    showIcon,
    customIcon,
    variant = "default",
    onClose,
    actions,
    onAction,
    actionsPosition: actionsPositionProp = "auto",
    children,
    actionProps,
    autoHideDuration,
    showProgress = false,
    transitionDuration,
    size = "regular",
    ...others
  } = useDefaultProps("HvCallout", props);
  const { classes, cx } = useClasses(classesProp, false);
  const { activeTheme } = useTheme();
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    if (showProgress) {
      // trigger on next tick
      setTimeout(() => {
        requestAnimationFrame(() => {
          setWidth("100%");
        });
      }, transitionDuration || 300);
    }
  }, [showProgress, transitionDuration]);

  const icon = customIcon || (showIcon && iconVariant(variant));

  // TODO: consider making this flex-flow only, so it adapts according to the
  // content length, available space, number of actions, etc.
  const actionsPosition =
    actionsPositionProp === "auto" ? "inline" : actionsPositionProp;

  const actionsContent = (
    <HvActionsGeneric
      id={id}
      className={classes.actionCustom}
      variant={activeTheme?.snackbar.actionButtonVariant as any}
      actions={actions}
      onAction={onAction}
      style={{
        marginTop: actionsPosition === "bottom-right" ? "auto" : undefined,
      }}
    />
  );

  const showCustomActions = actions && actionsPosition === "bottom-right";

  return (
    <SnackbarContent
      ref={ref}
      id={id}
      classes={{
        root: cx(classes.root, classes[variant], className),
        message: classes.message,
        action: classes.action,
      }}
      data-size={size}
      message={
        <>
          {showProgress && (
            <div
              className={classes.progress}
              style={{
                // width: calculate based on the `autoHideDuration` if present
                width,
                transition: autoHideDuration
                  ? `width ${autoHideDuration}ms linear`
                  : "none",
              }}
            />
          )}
          <div className={classes.messageContainer}>
            {icon && (
              <HvStatusIcon
                size={getIconSize(size)}
                className={classes.messageIcon}
                variant={variant === "default" ? "info" : variant}
                customIcon={customIcon}
              />
            )}
            <div className={classes.messageContent}>
              {title && <b className={classes.messageTitle}>{title}</b>}
              {children}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          {actions && actionsPosition === "inline" && actionsContent}
        </>
      }
      action={
        (showClose || showCustomActions) && (
          <div className={classes.actionContent}>
            {showClose && (
              <HvButton
                icon
                className={classes.actionClose}
                variant="semantic"
                aria-label="Close"
                onClick={(evt) => onClose?.(evt, "clickaway")}
                {...actionProps}
              >
                <HvIcon size="xs" name="Close" />
              </HvButton>
            )}
            {showCustomActions && actionsContent}
          </div>
        )
      }
      {...others}
    />
  );
});
