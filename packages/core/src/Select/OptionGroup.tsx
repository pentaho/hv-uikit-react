import { forwardRef } from "react";
import { OptionGroup, OptionGroupProps } from "@mui/base";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

const { staticClasses, useClasses } = createClasses("HvOptionGroup", {
  root: {
    listStyle: "none",
    ...theme.typography.label,
  },
});

export { staticClasses as optionGroupClasses };

export type HvOptionGroupClasses = ExtractNames<typeof useClasses>;

export interface HvOptionGroupProps extends OptionGroupProps {
  classes?: HvOptionGroupClasses;
}

export const HvOptionGroup = forwardRef<HTMLLIElement, HvOptionGroupProps>(
  function HvOptionGroup(props, ref) {
    const {
      className,
      classes: classesProp,
      ...others
    } = useDefaultProps("HvOptionGroup", props);
    const { classes, cx } = useClasses(classesProp);

    return (
      <OptionGroup
        ref={ref}
        className={cx(classes.root, className)}
        {...others}
      />
    );
  },
);
