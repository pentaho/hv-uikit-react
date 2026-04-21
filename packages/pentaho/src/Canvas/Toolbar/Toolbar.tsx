import { forwardRef } from "react";
import {
  HvIconButton,
  HvTypography,
  useDefaultProps,
  useLabels,
  type ExtractNames,
  type HvBaseProps,
  type HvIconButtonProps,
} from "@hitachivantara/uikit-react-core";
import { Previous } from "@hitachivantara/uikit-react-icons";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";

import { useCanvasContext } from "../CanvasContext";
import { staticClasses, useClasses } from "./Toolbar.styles";

export { staticClasses as canvasToolbarClasses };

export type HvCanvasToolbarClasses = ExtractNames<typeof useClasses>;

const DEFAULT_LABELS = {
  back: "Back",
};

export interface HvCanvasToolbarProps extends HvBaseProps<
  HTMLDivElement,
  "title"
> {
  /** Text to display in the component. */
  title: React.ReactNode;
  /** Fully customized button or false for when the back button should not be rendered. */
  backButton?: React.ReactNode;
  /** An object containing all the labels. */
  labels?: Partial<typeof DEFAULT_LABELS>;
  /* The content that will be rendered within the toolbar. */
  children?: React.ReactNode;
  /** Props for the default back button. */
  backButtonProps?: Partial<HvIconButtonProps>;
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvCanvasToolbarClasses;
}

/**
 * A toolbar component to use in a canvas context.
 */
export const HvCanvasToolbar = forwardRef<HTMLDivElement, HvCanvasToolbarProps>(
  function HvCanvasToolbar(props, ref) {
    const {
      title: titleProp,
      backButton,
      labels: labelsProp,
      className,
      style,
      children,
      backButtonProps,
      classes: classesProp,
      ...others
    } = useDefaultProps("HvCanvasToolbar", props);

    const { classes, cx } = useClasses(classesProp);
    const labels = useLabels(DEFAULT_LABELS, labelsProp);

    const canvasContext = useCanvasContext();
    const sidePanelWidth = canvasContext?.sidePanelWidth ?? 0;

    const title =
      typeof titleProp === "string" ? (
        <HvTypography variant="title4">{titleProp}</HvTypography>
      ) : (
        titleProp
      );

    return (
      <div
        ref={ref}
        className={cx(classes.root, className)}
        style={mergeStyles(style, {
          "--sidepanel-width": `${sidePanelWidth}px`,
          transition: canvasContext?.sidePanelDragging
            ? undefined
            : "width 0.3s ease",
        })}
        {...others}
      >
        <div className={classes.back}>
          {backButton ?? (
            <HvIconButton
              title={labels.back}
              variant="primaryGhost"
              {...backButtonProps}
            >
              <Previous />
            </HvIconButton>
          )}
        </div>
        <div className={classes.title}>{title}</div>
        {children && <div className={classes.actions}>{children}</div>}
      </div>
    );
  },
);
