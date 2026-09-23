import { forwardRef } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { getColor, type HvColorAny } from "@pentaho/uikit-styles";

import type { HvBaseProps } from "../types/generic";
import { staticClasses, useClasses } from "./Card.styles";

export { staticClasses as cardClasses };

export type HvCardClasses = ExtractNames<typeof useClasses>;

export interface HvCardProps extends HvBaseProps {
  /** The renderable content inside the icon slot of the header. */
  icon?: React.ReactNode;
  /** Whether the card is selectable. */
  selectable?: boolean;
  /** Whether the card is currently selected. */
  selected?: boolean;
  /** The background color of the card. */
  bgcolor?: "sema0" | HvColorAny;
  /** The border color at the top of the card. */
  statusColor?: "sema0" | HvColorAny;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvCardClasses;
}

/**
 * A Card is a container for short, related content—similar in shape to a playing card—and serves as an entry point to more detailed information.
 *
 * @stateRules
 * - always use `bgcolor="bgContainer"` unless a different background color is required for a specific design context
 * - "selected": adds a 4px bar at the top of the card in the text color; use it to mark a chosen card in a selectable set
 * - "statusColor": sets the top bar color and takes precedence over the selected bar color; use a semantic color
 *
 * @tokenConstraints
 * - color: bgcolor and statusColor use theme color tokens only; never raw hex or rgb values
 *
 * @antiPatterns
 * - Do not put the title in plain text or a heading directly in HvCard; the title layout and spacing are skipped — Use HvCardHeader with the title prop
 * - Do not place body content directly in HvCard; content spacing is not applied — Wrap body content in HvCardContent
 * - Do not place action buttons outside HvActionBar; the action layout breaks — Put every action inside HvActionBar
 * - Do not use more than one primary button in HvActionBar; the main action must be unambiguous — Use one variant="primary" HvButton for the main action
 * - Do not pass an icon other than HvStatusIcon to an icon prop of HvCard or HvCardHeader; icons must stay consistent — Use HvStatusIcon in the icon prop of HvCard or HvCardHeader
 * - Do not use the icon prop of HvCard for decorative or informative content; that prop conveys card status — Use HvStatusIcon with a status in the icon prop of HvCard with weight="duotone" andtype="simple"
 * - Do not use raw hex or rgb values for bgcolor or statusColor; they bypass the theme — Use a color token from the theme
 *
 * @a11y
 * role: none (HvCard renders a plain div and implies no landmark)
 * - title: the title from HvCardHeader is the visible name of the card; keep it short and specific
 * - status icon: HvCard icon conveys status, so the status must also be readable as text in the content
 * - decorative icon: icons passed to HvCardHeader must be hidden from assistive technology unless they convey information; informative icons need an accessible label
 * - selected state: the top bar is visual only; expose the selected state through the selection control of the set
 *
 * @validationRules
 * - title: each card must render its title with HvCardHeader, not plain text or a heading (error)
 * - content: body content must be wrapped in HvCardContent (warn)
 * - actions: every button in a card must be inside HvActionBar (error)
 * - primary: HvActionBar must contain at most one variant="primary" HvButton for the main action (error)
 * - status icon: the icon prop of HvCard must contain an HvStatusIcon that conveys the card status (warn)
 * - header icon: the icon prop of HvCardHeader must contain an HvStatusIcon that is decorative or informative (warn)
 * - color: bgcolor and statusColor must be theme tokens, never raw hex or rgb values (error)
 */
export const HvCard = forwardRef<
  // no-indent
  React.ComponentRef<"div">,
  HvCardProps
>(function HvCard(props, ref) {
  const {
    classes: classesProp,
    style,
    className,
    children,
    icon,
    selectable,
    selected,
    statusColor = "sema0",
    bgcolor,
    ...others
  } = useDefaultProps("HvCard", props);
  const { classes, cx } = useClasses(classesProp);

  const barColor =
    (statusColor !== "sema0" && statusColor) ||
    (selected && "text") ||
    undefined;

  return (
    <div
      ref={ref}
      style={mergeStyles(style, {
        "--bg-color": getColor(bgcolor),
        "--bar-height": selected && "4px",
        "--bar-color": getColor(barColor),
      })}
      data-color={statusColor}
      className={cx(
        "HvIsCardGridElement",
        classes.root,
        {
          [classes.selectable]: selectable,
          [classes.selected]: selected,
        },
        className,
      )}
      {...others}
    >
      <div className={classes.semanticContainer}>
        <div className={classes.semanticBar} />
        <div className={classes.icon}>{icon}</div>
      </div>
      {children}
    </div>
  );
});
