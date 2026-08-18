import { forwardRef } from "react";
import { Select } from "@base-ui/react/select";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

const { staticClasses, useClasses } = createClasses("HvOptionGroup", {
  root: {
    listStyle: "none",
    ...theme.typography.label,
  },
});

export { staticClasses as optionGroupClasses };

export type HvOptionGroupClasses = ExtractNames<typeof useClasses>;

export interface HvOptionGroupProps extends Select.Group.Props {
  label?: React.ReactNode;
  classes?: HvOptionGroupClasses;
}

export const HvOptionGroup = forwardRef<HTMLDivElement, HvOptionGroupProps>(
  function HvOptionGroup(props, ref) {
    const {
      label,
      children,
      className,
      classes: classesProp,
      ...others
    } = useDefaultProps("HvOptionGroup", props);
    const { classes, cx } = useClasses(classesProp);

    return (
      <Select.Group
        ref={ref}
        className={cx(classes.root, className)}
        {...others}
      >
        {label != null && <Select.GroupLabel>{label}</Select.GroupLabel>}
        {children}
      </Select.Group>
    );
  },
);
