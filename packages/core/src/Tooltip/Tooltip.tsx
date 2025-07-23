import { forwardRef, useEffect, useState } from "react";
import Fade from "@mui/material/Fade";
import Tooltip, {
  TooltipProps as MuiTooltipProps,
} from "@mui/material/Tooltip";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { getElementById } from "../utils/document";
import { staticClasses, useClasses } from "./Tooltip.styles";

export { staticClasses as tooltipClasses };

export type HvTooltipClasses = ExtractNames<typeof useClasses>;
export type HvTooltipPlacementType = MuiTooltipProps["placement"];

export interface HvTooltipProps extends Omit<MuiTooltipProps, "classes"> {
  /**
   * Class names to be applied.
   */
  className?: string;
  /**
   * A Jss Object used to override or extend the styles applied.
   */
  classes?: HvTooltipClasses;
  /**
   * If true, the tooltip is shown.
   */
  open?: boolean;
  /**
   * Tooltip placement.
   */
  placement?: HvTooltipPlacementType;
  /**
   * The number of milliseconds to wait before showing the tooltip.
   * This property won't impact the enter touch delay (enterTouchDelay).
   */
  enterDelay?: number;
  /** @inheritdoc */
  title: MuiTooltipProps["title"];
  /** @inheritdoc */
  TransitionComponent?: MuiTooltipProps["TransitionComponent"];
  /** @inheritdoc */
  TransitionProps?: MuiTooltipProps["TransitionProps"];
  /**
   * Node to apply the tooltip.
   */
  children: React.ReactElement<any>;
  /**
   * Id attribute value of an HTML Element to have the tooltip appended to it.
   */
  containerId?: string;
}

/**
 * Tooltips display informative text on hover, focus, or tap, and automatically label the target element for accessibility.
 *
 * For icon-only buttons, consider using `HvIconButton`, which includes built-in tooltip behavior.
 *
 */
export const HvTooltip = forwardRef<
  // no-indent
  unknown,
  HvTooltipProps
>(function HvTooltip(props, ref) {
  const {
    className,
    classes: classesProp,
    open,
    enterDelay = 300,
    placement = "top",
    children,
    title,
    TransitionComponent = Fade,
    TransitionProps = { timeout: 400, placement: "top" },
    containerId,
    ...others
  } = useDefaultProps("HvTooltip", props);

  const { rootId } = useTheme();
  const { classes } = useClasses(classesProp);
  const [container, setContainer] = useState(() =>
    getElementById(containerId ?? rootId),
  );

  // force extra render to get the correct container DOM element
  useEffect(() => {
    setContainer(getElementById(containerId ?? rootId));
  }, [containerId, rootId]);

  return (
    <Tooltip
      ref={ref}
      open={open}
      enterDelay={enterDelay}
      placement={placement}
      TransitionComponent={TransitionComponent}
      TransitionProps={TransitionProps}
      className={className}
      classes={{
        tooltip: classes.tooltip,
        popper: classes.popper,
      }}
      title={title}
      PopperProps={{ container }}
      {...others}
    >
      {children}
    </Tooltip>
  );
});
