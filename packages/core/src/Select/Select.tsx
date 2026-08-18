import { Children, isValidElement, useRef } from "react";
import { Select } from "@base-ui/react/select";
import { useControlled } from "@mui/material/utils";
import { clsx, type ClassValue } from "clsx";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@pentaho/uikit-react-utils";

import type { HvButtonProps } from "../Button";
import { HvDropdownButton } from "../DropdownButton";
import {
  HvFormElement,
  HvWarningText,
  type HvFormElementProps,
  type HvFormStatus,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvListContainer } from "../ListContainer";
import { HvPanel } from "../Panel";
import { fixedForwardRef } from "../types/generic";
import { getContainerElement } from "../utils/document";
import { setId } from "../utils/setId";
import { HvOption } from "./Option";
import { HvOptionGroup } from "./OptionGroup";
import { staticClasses, useClasses } from "./Select.styles";

interface HvSelectOption<OptionValue extends {}> {
  value: OptionValue;
  label: React.ReactNode;
  disabled?: boolean;
}

interface HvSelectOptionGroup<OptionValue extends {}> {
  label?: React.ReactNode;
  items: HvSelectOption<OptionValue>[];
}

type HvSelectItems<OptionValue extends {}> = Array<
  HvSelectOption<OptionValue> | HvSelectOptionGroup<OptionValue>
>;

type HvSelectValue<
  OptionValue extends {},
  Multiple extends boolean = false,
> = Multiple extends true
  ? HvSelectOption<OptionValue>[]
  : HvSelectOption<OptionValue> | null;

function defaultRenderValue<OptionValue extends {}>(
  options: HvSelectValue<OptionValue, boolean>,
): React.ReactNode {
  if (Array.isArray(options)) {
    return (
      <>
        {options
          .map((option: HvSelectOption<OptionValue>) => option.label)
          .join(", ")}
      </>
    );
  }

  return options?.label ?? null;
}

const mergeIds = (...ids: ClassValue[]) => clsx(ids) || undefined;

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

function renderOptions<OptionValue extends {}>(
  options?: HvSelectProps<OptionValue>["options"],
) {
  return options?.map((option) => (
    <HvOption
      key={
        typeof option.value === "string" ||
        typeof option.value === "number" ||
        typeof option.value === "boolean"
          ? String(option.value)
          : typeof option.label === "string" || typeof option.label === "number"
            ? String(option.label)
            : JSON.stringify(option.value)
      }
      disabled={option.disabled}
      label={typeof option.label === "string" ? option.label : undefined}
      value={option.value}
    >
      {option.label}
    </HvOption>
  ));
}

function isOptionGroupElement(
  child: React.ReactNode,
): child is React.ReactElement<{
  label?: React.ReactNode;
  children?: React.ReactNode;
}> {
  return isValidElement(child) && child.type === HvOptionGroup;
}

function isOptionElement(child: React.ReactNode): child is React.ReactElement<{
  disabled?: boolean;
  label?: React.ReactNode;
  value: any;
  children?: React.ReactNode;
}> {
  return isValidElement(child) && child.type === HvOption;
}

function normalizeItems<OptionValue extends {}>(
  options?: HvSelectProps<OptionValue>["options"],
  children?: React.ReactNode,
): HvSelectItems<OptionValue> {
  if (options) {
    return options.map(({ disabled, label, value }) => ({
      disabled,
      label,
      value,
    }));
  }

  return Children.toArray(children).flatMap((child) => {
    if (isOptionGroupElement(child)) {
      return {
        items: normalizeItems<OptionValue>(
          undefined,
          child.props.children,
        ).flatMap((item) => ("items" in item ? item.items : item)),
        label: child.props.label,
      };
    }

    if (isOptionElement(child)) {
      return {
        disabled: child.props.disabled,
        label: child.props.label ?? child.props.children,
        value: child.props.value as OptionValue,
      };
    }

    return [];
  });
}

function flattenItems<OptionValue extends {}>(
  items: HvSelectItems<OptionValue>,
) {
  return items.flatMap((item) => ("items" in item ? item.items : item));
}

function resolveOption<OptionValue extends {}>(
  value: OptionValue,
  items: HvSelectOption<OptionValue>[],
) {
  return items.find((item) => Object.is(item.value, value)) ?? null;
}

function resolveSelectedOptions<
  OptionValue extends {},
  Multiple extends boolean,
>(
  value: OptionValue | OptionValue[] | null,
  items: HvSelectOption<OptionValue>[],
  multiple?: Multiple,
): HvSelectValue<OptionValue, Multiple> {
  if (multiple) {
    return ((value as OptionValue[] | null) ?? [])
      .map((itemValue) => resolveOption(itemValue, items))
      .filter(
        (item): item is HvSelectOption<OptionValue> => item != null,
      ) as HvSelectValue<OptionValue, Multiple>;
  }

  return ((value == null ? null : resolveOption(value as OptionValue, items)) ??
    null) as HvSelectValue<OptionValue, Multiple>;
}

function serializeValue<OptionValue extends {}, Multiple extends boolean>(
  value: HvSelectValue<OptionValue, Multiple>,
  getSerializedValue?: HvSelectProps<
    OptionValue,
    Multiple
  >["getSerializedValue"],
) {
  if (getSerializedValue) {
    return getSerializedValue(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item.value ?? "")).join(",");
  }

  return value == null ? "" : String(value.value ?? "");
}

export { staticClasses as selectClasses };

export type HvSelectClasses = ExtractNames<typeof useClasses>;

type HvSelectOnChange<OptionValue extends {}, Multiple extends boolean> = (
  event: Event | undefined,
  value: Multiple extends true ? OptionValue[] : OptionValue | null,
) => void;

export interface HvSelectProps<
  OptionValue extends {},
  Multiple extends boolean = false,
>
  extends
    Omit<HvFormElementProps, "value" | "defaultValue" | "onChange">,
    Pick<HvButtonProps, "size" | "variant"> {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: Multiple;
  open?: boolean;
  defaultOpen?: boolean;
  value?: Multiple extends true ? OptionValue[] : OptionValue | null;
  defaultValue?: Multiple extends true ? OptionValue[] : OptionValue | null;
  buttonRef?: React.Ref<HTMLButtonElement>;
  options?: HvSelectOption<OptionValue>[];
  getSerializedValue?: (value: HvSelectValue<OptionValue, Multiple>) => string;
  onChange?: HvSelectOnChange<OptionValue, Multiple>;
  onOpenChange?: (open: boolean) => void;
  classes?: HvSelectClasses;
  placeholder?: React.ReactNode;
  autoComplete?: string;
  /** Custom render function for rendering the selected value. */
  renderValue?: (
    option: HvSelectValue<OptionValue, Multiple>,
  ) => React.ReactNode;
  /** Whether the width of the select panel can vary independently. */
  variableWidth?: boolean;
  /**
   * Properties passed on to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /** If enabled the panel will be rendered using a portal, if disabled it will render under the parent DOM hierarchy. */
  enablePortal?: boolean;
}

/**
 * The `HvSelect` component is a form control for choosing an option from a list.
 *
 * It aligns with the native `<select>` and `<option>` APIs, making it easy to integrate into forms.
 *
 * @example
 * <HvSelect name="pets">
 *   <HvOption value="dog">Dog</HvOption>
 *   <HvOption value="cat">Cat</HvOption>
 * </HvSelect>
 * */
export const HvSelect = fixedForwardRef(function HvSelect<
  OptionValue extends {},
  Multiple extends boolean = false,
>(
  props: HvSelectProps<OptionValue, Multiple>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const {
    children: childrenProp,
    classes: classesProp,
    className,
    id: idProp,
    size,
    variant = "secondarySubtle",
    name,
    required,
    disabled: disabledProp,
    readOnly,
    label,
    open: openProp,
    defaultOpen,
    multiple,
    autoComplete,
    renderValue: renderValueProp,
    options: optionsProp,
    variableWidth,
    value: valueProp,
    defaultValue,
    placeholder,
    inputProps,
    enablePortal,
    buttonRef,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    description,
    "aria-describedby": ariaDescribedBy,
    status,
    statusMessage,
    "aria-errormessage": ariaErrorMessage,
    getSerializedValue,
    onChange,
    onOpenChange,
    ...others
  } = useDefaultProps("HvSelect", props);
  const { classes, cx } = useClasses(classesProp);
  const { rootId } = useTheme();

  const emptyValue = (multiple ? [] : null) as Multiple extends true
    ? OptionValue[]
    : OptionValue | null;

  const [currentValue, setCurrentValue] = useControlled<
    Multiple extends true ? OptionValue[] : OptionValue | null
  >({
    name: "HvSelect.value",
    controlled: valueProp,
    default: (defaultValue ?? emptyValue) as Multiple extends true
      ? OptionValue[]
      : OptionValue | null,
  });

  const renderValue = renderValueProp ?? defaultRenderValue<OptionValue>;

  const id = useUniqueId(idProp);
  const labelId = useUniqueId(setId(idProp, "label"));
  const descriptionId = useUniqueId(setId(idProp, "description"));
  const errorMessageId = useUniqueId(setId(idProp, "error"));
  const actualErrorMessageId = ariaErrorMessage ?? errorMessageId;

  const [validationMessage] = useControlled({
    name: "HvSelect.statusMessage",
    controlled: statusMessage,
    default: "Required",
  });
  const [validationState, setValidationState] = useControlled<HvFormStatus>({
    name: "HvSelect.status",
    controlled: status,
    default: "standBy",
  });

  const items = normalizeItems(optionsProp, childrenProp);
  const flatItems = flattenItems(items);
  const children = childrenProp ?? renderOptions(optionsProp);
  const hasOptions = Children.count(children) > 0;
  const hasHighlightedFirstOptionRef = useRef(false);

  const hasCurrentValue = multiple
    ? ((currentValue as OptionValue[] | null) ?? []).length > 0
    : currentValue != null;

  const handleOpenChange: NonNullable<
    Select.Root.Props<OptionValue, Multiple>["onOpenChange"]
  > = (newOpen, _) => {
    if (!newOpen) {
      hasHighlightedFirstOptionRef.current = false;
      setValidationState(required && !hasCurrentValue ? "invalid" : "valid");
    }

    onOpenChange?.(newOpen);
  };

  const handleValueChange: NonNullable<
    Select.Root.Props<OptionValue, Multiple>["onValueChange"]
  > = (newValue, eventDetails) => {
    setCurrentValue(
      newValue as Multiple extends true ? OptionValue[] : OptionValue | null,
    );
    onChange?.(
      eventDetails.event as Event | undefined,
      newValue as Multiple extends true ? OptionValue[] : OptionValue | null,
    );
  };

  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined && required));

  const isInvalid = validationState === "invalid";

  const selectedOptions = resolveSelectedOptions(
    currentValue as OptionValue | OptionValue[] | null,
    flatItems,
    multiple,
  );
  const serializedValue = serializeValue(selectedOptions, getSerializedValue);

  const popup = (
    <Select.Positioner
      className={classes.popper}
      side="bottom"
      align="start"
      sideOffset={4}
      alignItemWithTrigger={false}
    >
      <Select.Popup
        render={(popupProps) => (
          <HvPanel
            {...popupProps}
            tabIndex={0}
            className={cx(classes.panel, popupProps.className)}
            style={{
              ...popupProps.style,
              ...(variableWidth
                ? { minWidth: "var(--anchor-width)" }
                : {
                    minWidth: "var(--anchor-width)",
                    width: "var(--anchor-width)",
                  }),
            }}
          />
        )}
      >
        <Select.List
          render={(listProps) => (
            <HvListContainer
              {...listProps}
              ref={(instance) => {
                setRef(listProps.ref, instance);

                if (
                  hasHighlightedFirstOptionRef.current ||
                  !instance ||
                  multiple ||
                  hasCurrentValue
                ) {
                  return;
                }

                hasHighlightedFirstOptionRef.current = true;

                const firstEnabledOption = flatItems.find(
                  (option) => !option.disabled,
                );

                if (firstEnabledOption) {
                  setCurrentValue(
                    firstEnabledOption.value as Multiple extends true
                      ? OptionValue[]
                      : OptionValue | null,
                  );
                }

                queueMicrotask(() => {
                  if (!instance.isConnected) return;

                  instance.dispatchEvent(
                    new KeyboardEvent("keydown", {
                      bubbles: true,
                      key: "ArrowDown",
                    }),
                  );
                });
              }}
              condensed
              selectable
              data-is-dropdown
            />
          )}
        >
          {children}
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  );

  return (
    <Select.Root<OptionValue, Multiple>
      disabled={disabledProp}
      readOnly={readOnly}
      required={required}
      multiple={multiple}
      open={openProp}
      defaultOpen={defaultOpen}
      value={
        currentValue as Multiple extends true ? OptionValue[] : OptionValue
      }
      modal={false}
      onOpenChange={handleOpenChange}
      onValueChange={handleValueChange}
    >
      <HvFormElement
        name={name}
        required={required}
        disabled={disabledProp}
        readOnly={readOnly}
        status={validationState}
        className={cx(classes.root, className, {
          [classes.readOnly]: readOnly,
          [classes.disabled]: disabledProp,
        })}
        {...others}
      >
        <HvLabelContainer
          label={label}
          description={description}
          inputId={id}
          labelId={labelId}
          descriptionId={descriptionId}
          classes={{
            root: classes.labelContainer,
            label: classes.label,
            description: classes.description,
          }}
        />
        <Select.Trigger
          render={(triggerProps, state) => (
            <HvDropdownButton
              {...triggerProps}
              ref={(instance) => {
                setRef(ref, instance);
                setRef(buttonRef, instance);
                setRef(triggerProps.ref, instance);
              }}
              id={id}
              open={state.open && hasOptions}
              disabled={disabledProp}
              readOnly={readOnly}
              className={cx(classes.select, triggerProps.className, {
                [classes.invalid]: isInvalid,
              })}
              size={size}
              variant={variant}
              aria-label={ariaLabel}
              aria-labelledby={mergeIds(ariaLabelledBy, { [labelId]: label })}
              aria-invalid={isInvalid ? true : undefined}
              aria-errormessage={actualErrorMessageId}
              aria-describedby={mergeIds(ariaDescribedBy, {
                [descriptionId]: description,
              })}
            />
          )}
        >
          <Select.Value>
            {(value) =>
              renderValue(
                resolveSelectedOptions(
                  value as OptionValue | OptionValue[] | null,
                  flatItems,
                  multiple,
                ) as HvSelectValue<OptionValue, Multiple>,
              ) ?? placeholder
            }
          </Select.Value>
        </Select.Trigger>
        {hasOptions &&
          (enablePortal ? (
            <Select.Portal container={getContainerElement(rootId)}>
              {popup}
            </Select.Portal>
          ) : (
            popup
          ))}
        <input
          {...inputProps}
          type="hidden"
          name={name}
          autoComplete={autoComplete}
          disabled={disabledProp}
          value={serializedValue}
        />
        {canShowError && (
          <HvWarningText
            id={errorMessageId}
            disableBorder
            className={classes.error}
          >
            {validationMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    </Select.Root>
  );
});
