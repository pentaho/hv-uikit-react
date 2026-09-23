import { forwardRef } from "react";
import { useTheme as useMuiTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { HvTypography } from "../Typography";
import {
  getBreakpointStyles,
  staticClasses,
  useClasses,
} from "./GlobalActions.styles";

export { staticClasses as globalActionsClasses };
export type HvGlobalActionsClasses = ExtractNames<typeof useClasses>;

export type HvGlobalActionsVariant = "global" | "section";
export type HvGlobalActionsPosition = "sticky" | "fixed" | "relative";
export type HvGlobalActionsHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HvGlobalActionsProps extends HvBaseProps<
  HTMLDivElement,
  "title"
> {
  /** Text to display in the component. */
  title?: React.ReactNode;
  /** Denotes if this is a global or section component. */
  variant?: HvGlobalActionsVariant;
  /** User can pass in a fully customized button or false for when the back button should not be rendered. */
  backButton?: React.ReactNode;
  /** Heading Level to apply to Title Area. */
  headingLevel?: HvGlobalActionsHeadingLevel;
  /**
   * Position of the Global Actions.
   * @default variant === "global" ? "sticky" : "relative"
   */
  position?: HvGlobalActionsPosition;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvGlobalActionsClasses;
}

/**
 * Global Actions are actions that affect the entire page they live in.
 * They should persist while scrolling down the screen.
 *
 * It uses `variant="global"` by default, rendering an `h1` element and applying sticky positioning.
 * Use `variant="section"` to group related content blocks.
 * Use it sparingly, as it introduces strong visual separation, which may not always be necessary.
 *
 * @variantSemantics
 * - "global": page-level heading; the title renders as an h1 by default, the position is sticky, and it is the only variant that shows backButton
 * - "section": groups related content on the page; the title renders as an h2 by default, and the position is relative
 *
 * @stateRules
 * - "position": sticky by default for global and relative by default for section; fixed applies responsive styles
 * - "backButton": rendered only with variant="global"
 * - "title": a string title is rendered as a heading; other nodes render as provided, without heading semantics
 *
 * @antiPatterns
 * - Do not use variant="global" for a group inside a page; it renders an h1 and sticks to the top — Use variant="section" for groups
 * - Do not put page actions in title; actions belong in children — Pass action buttons as children
 * - Do not choose headingLevel for its look; it changes only the element, while variant sets the style — Set headingLevel to match the page outline
 *
 * @a11y
 * role: heading, level 1 for global and 2 for section unless headingLevel is set
 * - outline: set headingLevel so headings follow the page outline without skipping levels
 * - title: a string title becomes a heading; a custom title node must provide its own heading semantics
 * - actions: children must be focusable controls, such as HvButton
 * - sticky: sticky and fixed bars must not cover focused content; keep them compact
 *
 * @validationRules
 * - variant: variant must be global or section (error)
 * - global: use at most one variant="global" per page (warn)
 * - backButton: backButton is ignored with variant="section" (warn)
 * - headingLevel: headingLevel must not skip levels on the page (warn)
 */
export const HvGlobalActions = forwardRef<
  React.ComponentRef<"div">,
  HvGlobalActionsProps
>(function HvGlobalActions(props, ref) {
  const {
    children,
    classes: classesProp,
    className,
    title,
    variant = "global",
    backButton,
    headingLevel,
    position: positionProp,
    ...others
  } = useDefaultProps("HvGlobalActions", props);
  const muiTheme = useMuiTheme();
  const { classes, cx, css } = useClasses(classesProp);
  const isSmDown = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const isUpMd = useMediaQuery(muiTheme.breakpoints.up("md"));

  const headingLevelToApply = headingLevel || (variant === "global" ? 1 : 2);

  const position =
    positionProp || (variant === "global" ? "sticky" : "relative");

  return (
    <div
      ref={ref}
      className={cx(
        classes.root,
        {
          [classes.positionSticky]: position === "sticky",
          [classes.positionFixed]: position === "fixed",
          [classes.global]: variant === "global",
          [classes.section]: variant === "section",
        },
        position === "fixed" && css(getBreakpointStyles(isUpMd, isSmDown)),
        className,
      )}
      {...others}
    >
      <div className={classes.wrapper}>
        {variant === "global" && backButton && (
          <div className={classes.backButton}>{backButton}</div>
        )}
        {typeof title !== "string" ? (
          title
        ) : (
          <HvTypography
            variant={variant === "global" ? "title3" : "title4"}
            component={`h${headingLevelToApply}`}
            className={classes.name}
          >
            {title}
          </HvTypography>
        )}
        {children && <div className={classes.actions}>{children}</div>}
      </div>
    </div>
  );
});
