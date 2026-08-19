import { Select } from "@base-ui/react/select";
import {
  createClasses,
  useDefaultProps,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";

import { HvListItem, type HvListItemProps } from "../ListContainer";
import { fixedForwardRef } from "../types/generic";
import { outlineStyles } from "../utils/focusUtils";

const setRef = (ref: any, value: any) => {
  if (typeof ref === "function") {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
};

const mergeEventHandlers = (
  baseHandler: ((...args: any[]) => void) | undefined,
  consumerHandler: ((...args: any[]) => void) | undefined,
) => {
  if (!baseHandler) return consumerHandler;
  if (!consumerHandler) return baseHandler;
  return (...args: any[]) => {
    baseHandler(...args);
    consumerHandler(...args);
  };
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
          {...itemProps}
          {...others}
          ref={(instance) => {
            setRef(itemProps.ref, instance);
            setRef(ref, instance);
          }}
          onClick={mergeEventHandlers(itemProps.onClick, others.onClick)}
          onMouseDown={mergeEventHandlers(
            itemProps.onMouseDown,
            others.onMouseDown,
          )}
          onMouseUp={mergeEventHandlers(itemProps.onMouseUp, others.onMouseUp)}
          onKeyDown={mergeEventHandlers(itemProps.onKeyDown, others.onKeyDown)}
          onFocus={mergeEventHandlers(itemProps.onFocus, others.onFocus)}
          onBlur={mergeEventHandlers(itemProps.onBlur, others.onBlur)}
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
