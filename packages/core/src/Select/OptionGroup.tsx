import { forwardRef } from "react";
import { Select } from "@base-ui/react/select";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";
import { theme } from "@pentaho/uikit-styles";

import { HvListContainer } from "../ListContainer";

const { staticClasses, useClasses } = createClasses("HvOptionGroup", {
  root: {
    listStyle: "none",
    ...theme.typography.label,
  },
});

export { staticClasses as optionGroupClasses };

export type HvOptionGroupClasses = ExtractNames<typeof useClasses>;

export interface HvOptionGroupProps extends Omit<
  Select.Group.Props,
  "children"
> {
  label?: React.ReactNode;
  children?: React.ReactNode;
  classes?: HvOptionGroupClasses;
}

export const HvOptionGroup = forwardRef<HTMLDivElement, HvOptionGroupProps>(
  function HvOptionGroup(props, ref) {
    const {
      children,
      label,
      className,
      classes: classesProp,
      ...others
    } = useDefaultProps("HvOptionGroup", props);
    const { classes, cx } = useClasses(classesProp);

    return (
      <Select.Group
        render={(groupProps) => (
          <div
            {...groupProps}
            ref={ref}
            className={cx(classes.root, className, groupProps.className)}
          />
        )}
        {...others}
      >
        {label != null && <Select.GroupLabel>{label}</Select.GroupLabel>}
        <HvListContainer condensed selectable>
          {children}
        </HvListContainer>
      </Select.Group>
    );
  },
);
