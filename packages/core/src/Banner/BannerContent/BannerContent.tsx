import { forwardRef } from "react";
import { SnackbarContentProps as MuiSnackbarContentProps } from "@mui/material/SnackbarContent";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvActionsGenericProps } from "../../ActionsGeneric";
import { HvButtonProps } from "../../Button";
import {
  HvCallout,
  HvCalloutProps,
  HvCalloutVariant,
} from "../../utils/Callout";
import { staticClasses, useClasses } from "./BannerContent.styles";

export { staticClasses as bannerContentClasses };

export type HvBannerVariant = HvCalloutVariant;

export type HvBannerActionPosition = "auto" | "inline" | "bottom-right";

export type HvBannerContentClasses = ExtractNames<typeof useClasses>;

export interface HvBannerContentProps
  extends Omit<MuiSnackbarContentProps, "variant" | "classes" | "onClose"> {
  /** The message to display. @deprecated use `children` instead */
  content?: string;
  /** The message to display. */
  children?: React.ReactNode;
  /** Variant of the snackbar. */
  variant?: HvBannerVariant;
  /** Controls if the associated icon to the variant should be shown. */
  showIcon?: boolean;
  /** Custom icon to replace the variant default. */
  customIcon?: React.ReactNode;
  /** Function called when clicking on the close button. */
  onClose?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Actions to display on the right side. */
  actions?: HvActionsGenericProps["actions"];
  /** The callback function called when an action is triggered, receiving `action` as parameter. */
  onAction?: HvActionsGenericProps["onAction"];
  /** The position property of the header. */
  actionsPosition?: HvBannerActionPosition;
  /** The props to pass down to the Action Container. */
  actionProps?: Partial<HvButtonProps>;
  /** The size of the banner. */
  size?: HvCalloutProps["size"];
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBannerContentClasses;
}

export const HvBannerContent = forwardRef<
  // no-indent
  HTMLDivElement,
  HvBannerContentProps
>(function HvBannerContent(props, ref) {
  const {
    id,
    classes: classesProp,
    className,
    showIcon,
    customIcon,
    variant = "default",
    onClose,
    actions,
    onAction,
    actionsPosition = "auto",
    content,
    children,
    actionProps,
    size,
    ...others
  } = useDefaultProps("HvBannerContent", props);
  const { classes, cx } = useClasses(classesProp);

  return (
    <HvCallout
      ref={ref}
      id={id}
      variant={variant}
      showClose={onClose !== undefined}
      showIcon={showIcon}
      customIcon={customIcon}
      classes={{
        root: cx(classes.root, classes[variant], className),
        message: classes.message,
        action: classes.action,
        messageIcon: classes.iconContainer,
        messageContent: classes.messageContainer,
        actionCustom: classes.messageActions,
        actionContent: classes.actionContainer,
        actionClose: classes.closeAction,
      }}
      actions={actions}
      actionsPosition={actionsPosition}
      actionProps={actionProps}
      onClose={(evt) => onClose?.(evt as React.MouseEvent<any>)}
      onAction={onAction}
      size={size}
      {...others}
    >
      {children ?? content}
    </HvCallout>
  );
});
