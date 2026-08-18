import { useRef } from "react";
import { Select } from "@base-ui/react/select";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";

import { HvListItem, type HvListItemProps } from "../ListContainer";
import { fixedForwardRef } from "../types/generic";
import { outlineStyles } from "../utils/focusUtils";

const { staticClasses, useClasses } = createClasses("HvOption", {
  root: {},
  highlighted: {
    ...outlineStyles,
  },
});

export { staticClasses as optionClasses };

export type HvOptionClasses = ExtractNames<typeof useClasses>;

export interface HvOptionProps
  extends
    Omit<HvListItemProps, "value" | "disabled">,
    Pick<Select.Item.Props, "disabled" | "label" | "value"> {
  classes?: HvOptionClasses;
}

export const HvOption = fixedForwardRef(function HvOption(
  props: HvOptionProps,
  ref: React.Ref<HTMLLIElement>,
) {
  const {
    classes: classesProp,
    className,
    disabled = false,
    label,
    value,
    children,
    ...others
  } = useDefaultProps("HvOption", props);
  const { classes, cx } = useClasses(classesProp);

  const optionRef = useRef<HTMLElement>(null);

  const computedLabel =
    label ??
    (typeof children === "string"
      ? children
      : optionRef.current?.textContent?.trim());

  return (
    <Select.Item
      value={value}
      disabled={disabled}
      label={computedLabel}
      render={<HvListItem ref={ref as React.Ref<HTMLLIElement>} />}
      className={(state) =>
        cx(classes.root, className, {
          [classes.highlighted]: state.highlighted,
        })
      }
      {...(others as any)}
    >
      {children}
    </Select.Item>
  );
});
