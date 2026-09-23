import { forwardRef } from "react";
import {
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { getColor, type HvColorAny } from "@pentaho/uikit-styles";

import type { HvBaseProps } from "../types/generic";
import { range } from "../utils/helpers";
import { staticClasses, useClasses } from "./Loading.styles";

export { staticClasses as loadingClasses };

export type HvLoadingClasses = ExtractNames<typeof useClasses>;

export interface HvLoadingProps extends HvBaseProps {
  /** Indicates if the component should be render in a small size. */
  small?: boolean;
  /** The label to be displayed.  */
  label?: React.ReactNode;
  /** Whether the loading animation is hidden. */
  hidden?: boolean;
  /** Color applied to the bars. */
  color?: HvColorAny;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvLoadingClasses;
}

/**
 * Loading provides feedback about a process that is taking place in the application.
 *
 * @stateRules
 * - "hidden": when true, the indicator is removed from layout (display none); toggle it with the real process state instead of unmounting the component
 * - "small": renders a compact indicator for inline or dense contexts; its default color is the text color instead of primary
 * - "label": optional visible text under the indicator; use it to say what is loading when the context is not obvious
 *
 * @tokenConstraints
 * - color: use theme color tokens only, primary by default; never raw hex or rgb values
 *
 * @antiPatterns
 * - Do not use HvLoading as a placeholder for content whose shape is known; it does not reserve the space of the content — Use HvSkeleton shaped like the content it replaces
 * - Do not remove HvLoading or set hidden to a literal true while the process runs; the user loses feedback — Set hidden={!isLoading} tied to the real process state
 * - Do not show HvLoading without a label when the context does not say what is loading; the user cannot tell what is in progress — Add label="Loading results" or similar text
 * - Do not use a raw hex or rgb value for color; it bypasses the theme — Use a color token such as color="primary"
 *
 * @a11y
 * role: HvLoading renders a plain div with no role; add role="progressbar" when it signals a process the user is waiting on
 * - name: give the indicator an accessible name with label or aria-label that describes what is loading
 * - hidden: hidden sets display none, which removes the indicator from assistive technology; hide it only after the process ends
 * - visual only: the animated bars carry no information on their own; the label or a status message elsewhere must convey the process
 *
 * @validationRules
 * - color: must be a theme token, never a raw hex or rgb value (error)
 * - name: must have label or aria-label so the process has an accessible name (warn)
 * - placeholder: use HvSkeleton instead when the shape of the loading content is known (info)
 */
export const HvLoading = forwardRef<
  // no-indent
  React.ComponentRef<"div">,
  HvLoadingProps
>(function HvLoading(props, ref) {
  const {
    color,
    hidden,
    small,
    label,
    classes: classesProp,
    style,
    className,
    ...others
  } = useDefaultProps("HvLoading", props);

  const { classes, cx } = useClasses(classesProp);

  const size = small ? "small" : "regular";

  return (
    <div
      ref={ref}
      hidden={!!hidden}
      data-size={size}
      style={mergeStyles(style, {
        color: getColor(color, small ? "text" : "primary"),
        "--customColor": getColor(color),
      })}
      className={cx(
        classes.root,
        {
          [classes.hidden]: hidden,
        },
        className,
      )}
      {...others}
    >
      <div className={classes.barContainer}>
        {range(3).map((e) => (
          <div key={e} className={classes.loadingBar} />
        ))}
      </div>
      {label && <div className={classes.label}>{label}</div>}
    </div>
  );
});
