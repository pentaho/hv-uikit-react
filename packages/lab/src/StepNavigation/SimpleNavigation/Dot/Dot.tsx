import {
  HvButton,
  type ExtractNames,
  type HvBaseProps,
} from "@hitachivantara/uikit-react-core";
import { mergeStyles } from "@hitachivantara/uikit-react-utils";

import type { HvStepProps } from "../../DefaultNavigation";
import { dotSizes, getColor } from "../utils";
import { staticClasses, useClasses } from "./Dot.styles";

export { staticClasses as dotClasses };

export type HvDotClasses = ExtractNames<typeof useClasses>;

export interface HvDotProps
  extends Pick<
      HvStepProps,
      "size" | "title" | "state" | "onClick" | "disabled"
    >,
    Omit<HvBaseProps, "title" | "onClick"> {
  /** A Jss Object used to override or extend the styles applied to the empty state StepNavigation. */
  classes?: HvDotClasses;
}

export const HvDot = ({
  classes: classesProp,
  className,
  state,
  title,
  size = "sm",
  onClick,
  disabled: disabledProp,
}: HvDotProps) => {
  const { classes, cx } = useClasses(classesProp);

  const dotSize = dotSizes[size] * (state === "Current" ? 1.5 : 1);
  const disabled = disabledProp ?? ["Current", "Disabled"].includes(state);

  return (
    <HvButton
      style={mergeStyles(undefined, {
        "--dotColor": getColor(state),
        "--dotSize": `${dotSize}px`,
      })}
      className={cx(
        classes.root,
        {
          [classes.active]: state === "Current",
          [classes.ghostDisabled]: disabled,
        },
        className,
      )}
      aria-label={title}
      icon
      disabled={disabled}
      onClick={onClick}
    />
  );
};
