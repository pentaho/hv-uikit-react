import { useMemo } from "react";
import {
  createClasses,
  mergeStyles,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { getColor, theme, type HvColorAny } from "@hitachivantara/uikit-styles";

import { SvgBase } from "../icons";
import type { HvBaseCheckBoxProps } from "./BaseCheckBox";

const { useClasses } = createClasses("HvCheckBoxIcon", {
  root: {
    color: theme.colors.bgContainer,
    borderRadius: theme.radii.base,
    border: `1px solid ${theme.colors.borderStrong}`,
  },
  checked: {
    borderColor: "transparent",
    backgroundColor: `var(--bg-color, ${theme.colors.primaryStrong})`,
    color: theme.colors.bgContainer,
  },
  indeterminate: {
    color: theme.colors.textSubtle,
    backgroundColor: theme.colors.bgContainer,
  },
  semantic: {
    "&[data-variant=indeterminate]": {
      backgroundColor: theme.colors.bgContainer,
      borderColor: theme.colors.borderStrong,
    },
  },
  disabled: {
    color: theme.colors.bgDisabled,
    borderColor: theme.colors.borderDisabled,
    backgroundColor: theme.colors.bgDisabled,
    "&[data-variant=checked],&[data-variant=indeterminate]": {
      color: theme.colors.textDisabled,
      borderColor: "currentcolor",
    },
  },
});

export type HvCheckBoxIconClasses = ExtractNames<typeof useClasses>;

export interface HvCheckBoxIconProps
  extends Pick<HvBaseCheckBoxProps, "className" | "disabled" | "semantic"> {
  variant?: "default" | "checked" | "indeterminate";
  color?: HvColorAny;
  classes?: HvCheckBoxIconClasses;
}

export const HvCheckBoxIcon = (props: HvCheckBoxIconProps) => {
  const {
    className,
    classes: classesProp,
    variant,
    disabled,
    semantic,
    color,
  } = useDefaultProps("HvCheckBoxIcon", props);
  const { classes, cx } = useClasses(classesProp, false);

  const d = useMemo(() => {
    switch (variant) {
      case "checked":
        return "m5.03,12.06l-3.76,-3.75l1.42,-1.42l2.24,2.25l6.3,-7.2l1.5,1.31l-7.7,8.81z";
      case "indeterminate":
        return "m3,8l8,0l0,-2l-8,0l0,2z";
      case "default":
      default:
        return "m0,0l16,0l0,16l-16,0l0,-16z";
    }
  }, [variant]);

  return (
    <SvgBase
      viewBox="0 0 14 14"
      data-variant={variant}
      className={cx(classes.root, className, {
        [classes.checked]: variant === "checked",
        [classes.indeterminate]: variant === "indeterminate",
        [classes.semantic]: semantic,
        [classes.disabled]: disabled,
      })}
      style={mergeStyles({}, { "--bg-color": getColor(color) })}
    >
      <path d={d} />
    </SvgBase>
  );
};
