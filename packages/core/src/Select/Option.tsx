import { Select } from "@base-ui/react/select";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";

import { HvListItem, type HvListItemProps } from "../ListContainer";
import { fixedForwardRef } from "../types/generic";
import { outlineStyles } from "../utils/focusUtils";

const setRef = <ElementType,>(
  ref:
    | React.Ref<ElementType>
    | React.MutableRefObject<ElementType | null>
    | undefined,
  value: ElementType | null,
) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    (ref as React.MutableRefObject<ElementType | null>).current = value;
  }
};

const { staticClasses, useClasses } = createClasses("HvOption", {
  root: {},
  highlighted: {
    ...outlineStyles,
  },
});

export { staticClasses as optionClasses };

export type HvOptionClasses = ExtractNames<typeof useClasses>;

export interface HvOptionProps<OptionValue extends {}>
  extends
    Omit<HvListItemProps, "value" | "disabled">,
    Pick<Select.Item.Props, "disabled" | "label"> {
  value: OptionValue;
  classes?: HvOptionClasses;
}

export const HvOption = fixedForwardRef(function HvOption<
  OptionValue extends {},
>(props: HvOptionProps<OptionValue>, ref: React.Ref<HTMLLIElement>) {
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

  return (
    <Select.Item
      nativeButton={false}
      value={value}
      disabled={disabled}
      label={label}
      render={(itemProps, state) => (
        <HvListItem
          {...others}
          {...itemProps}
          ref={(instance) => {
            setRef(ref, instance);
            setRef(itemProps.ref, instance);
          }}
          selected={state.selected}
          disabled={state.disabled}
          className={cx(classes.root, className, itemProps.className, {
            [classes.highlighted]: state.highlighted,
          })}
        >
          {children}
        </HvListItem>
      )}
    />
  );
});
