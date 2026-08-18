import { Children, isValidElement, useRef } from "react";
import { Select } from "@base-ui/react/select";
import { useControlled, useForkRef } from "@mui/material/utils";
import { clsx, type ClassValue } from "clsx";
import { useDefaultProps, type ExtractNames } from "@pentaho/uikit-react-utils";

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
import { fixedForwardRef } from "../types/generic";
import { setId } from "../utils/setId";
import { HvOption } from "./Option";
import { staticClasses, useClasses } from "./Select.styles";

type HvSelectOption<Value> = {
  value: Value;
  label: React.ReactNode;
  disabled?: boolean;
};

type HvSelectValue<
  Value,
  Multiple extends boolean = false,
> = Multiple extends true
  ? HvSelectOption<Value>[]
  : HvSelectOption<Value> | null;

function defaultRenderValue<Value>(
  options: HvSelectOption<Value> | HvSelectOption<Value>[] | null,
): React.ReactNode {
  if (Array.isArray(options)) {
    return <>{options.map((o) => o.label).join(", ")}</>;
  }

  return options?.label ?? null;
}

const mergeIds = (...ids: ClassValue[]) => clsx(ids) || undefined;

function renderOptions(options?: HvSelectProps<any>["options"]) {
  return options?.map((option) => (
    <HvOption
      key={option.value}
      value={option.value}
      disabled={option.disabled}
    >
      {option.label}
    </HvOption>
  ));
}

function getOptionLabel(children: React.ReactNode): string | undefined {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  return undefined;
}

function extractOptionsFromChildren<Value>(
  children: React.ReactNode,
): HvSelectOption<Value>[] {
  return Children.toArray(children).reduce<HvSelectOption<Value>[]>(
    (acc, child) => {
      if (!isValidElement(child)) return acc;

      const props = child.props as {
        value?: Value;
        label?: React.ReactNode;
        disabled?: boolean;
        children?: React.ReactNode;
      };

      if (props.value !== undefined) {
        const label = props.label ?? getOptionLabel(props.children);
        if (label != null) {
          return [
            ...acc,
            { value: props.value, label, disabled: props.disabled },
          ];
        }
      }

      if (props.children != null) {
        return [...acc, ...extractOptionsFromChildren<Value>(props.children)];
      }

      return acc;
    },
    [],
  );
}

function serializeValue<Value>(
  value: HvSelectValue<Value, any>,
  multiple?: boolean,
) {
  if (multiple) {
    return JSON.stringify(
      (value as HvSelectOption<Value>[]).map((v) => v.value),
    );
  }

  const singleValue = (value as HvSelectOption<Value> | null)?.value;
  return singleValue == null ? "" : String(singleValue);
}

export { staticClasses as selectClasses };

export type HvSelectClasses = ExtractNames<typeof useClasses>;

export interface HvSelectProps<
  OptionValue extends {},
  Multiple extends boolean = false,
>
  extends
    Omit<HvFormElementProps, "value" | "defaultValue" | "onChange">,
    Pick<
      Select.Root.Props<OptionValue, Multiple>,
      | "name"
      | "required"
      | "disabled"
      | "multiple"
      | "open"
      | "defaultOpen"
      | "value"
      | "defaultValue"
    >,
    Pick<HvButtonProps, "size" | "variant"> {
  classes?: HvSelectClasses;
  buttonRef?: React.Ref<HTMLButtonElement>;
  options?: HvSelectOption<OptionValue>[];
  getSerializedValue?: (option: HvSelectValue<OptionValue, Multiple>) => string;
  onChange?: (
    event: React.SyntheticEvent | Event | null,
    value: Multiple extends true ? OptionValue[] : OptionValue | null,
  ) => void;
  onOpenChange?: (open: boolean) => void;
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
  /**  If enabled the panel will be rendered using a portal , if disabled will be under the DOM hierarchy of the parent component. */
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
    buttonRef: buttonRefProp,
    placeholder,
    inputProps,
    enablePortal,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    description,
    "aria-describedby": ariaDescribedBy,
    status,
    statusMessage,
    "aria-errormessage": ariaErrorMessage,
    getSerializedValue,
    onClick,
    onChange,
    onOpenChange,
    ...others
  } = useDefaultProps("HvSelect", props);
  const { classes, cx } = useClasses(classesProp);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleButtonRef = useForkRef(useForkRef(ref, buttonRef), buttonRefProp);

  const [open, setOpen] = useControlled({
    controlled: openProp,
    default: defaultOpen ?? false,
    name: "HvSelect.open",
  });
  const [selection, setSelection] = useControlled<
    OptionValue | OptionValue[] | null
  >({
    controlled: valueProp as OptionValue | OptionValue[] | null,
    default:
      (defaultValue as OptionValue | OptionValue[] | null | undefined) ??
      (multiple ? [] : null),
    name: "HvSelect.value",
  });

  const renderValue = renderValueProp ?? defaultRenderValue;

  const id = useUniqueId(idProp);
  const labelId = useUniqueId(setId(idProp, "label"));
  const descriptionId = useUniqueId(setId(idProp, "description"));
  const errorMessageId = useUniqueId(setId(idProp, "error"));

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

  const options =
    optionsProp ?? extractOptionsFromChildren<OptionValue>(childrenProp);

  const resolveMetadata = (
    rawValue: OptionValue | null | undefined,
  ): HvSelectOption<OptionValue> | null => {
    if (rawValue == null) return null;

    return (
      options.find((option) => Object.is(option.value, rawValue)) ?? {
        value: rawValue,
        label: String(rawValue),
      }
    );
  };

  const actualValue = multiple
    ? ((selection as OptionValue[])
        .map((v) => resolveMetadata(v))
        .filter(
          (v): v is HvSelectOption<OptionValue> => v != null,
        ) as HvSelectValue<OptionValue, Multiple>)
    : (resolveMetadata(selection as OptionValue | null) as HvSelectValue<
        OptionValue,
        Multiple
      >);

  const serializedValue =
    getSerializedValue?.(actualValue) ?? serializeValue(actualValue, multiple);

  function handleOpenChange(newOpen: boolean) {
    setOpen(newOpen);

    if (!newOpen) {
      const currentValue = (openProp !== undefined ? valueProp : selection) as
        | OptionValue
        | OptionValue[]
        | null
        | undefined;
      const hasValue = multiple
        ? ((currentValue as OptionValue[] | undefined)?.length ?? 0) > 0
        : !!currentValue;
      setValidationState(required && !hasValue ? "invalid" : "valid");
    }

    onOpenChange?.(newOpen);
  }

  const handleValueChange: Select.Root.Props<
    OptionValue,
    Multiple
  >["onValueChange"] = (nextValue, eventDetails) => {
    setSelection(nextValue as OptionValue | OptionValue[] | null);
    onChange?.(eventDetails.event ?? null, nextValue as any);
  };

  // the error message area will only be created if:
  // - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and required is true
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined && required));

  const isInvalid = validationState === "invalid";

  const children = childrenProp ?? renderOptions(optionsProp);
  const isOpen = open && !!children;
  const shouldUsePortal = enablePortal ?? true;

  const popup = (
    <Select.Positioner
      side="bottom"
      align="start"
      alignItemWithTrigger={false}
      className={cx(classes.popper, {
        [classes.popperVariableWidth]: variableWidth,
      })}
    >
      <Select.Popup className={classes.panel}>
        <Select.List
          render={
            <HvListContainer
              condensed
              selectable
              data-is-dropdown
              className={classes.listContainer}
            />
          }
        >
          {children}
        </Select.List>
      </Select.Popup>
    </Select.Positioner>
  );

  return (
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
      <Select.Root<OptionValue, Multiple>
        id={id}
        required={required}
        disabled={disabledProp}
        readOnly={readOnly}
        multiple={multiple}
        open={open}
        value={selection as any}
        items={options.map(({ value, label }) => ({ value, label }))}
        onOpenChange={(nextOpen) => handleOpenChange(nextOpen)}
        onValueChange={handleValueChange}
      >
        <Select.Trigger
          onClick={onClick as any}
          aria-label={ariaLabel}
          aria-labelledby={mergeIds(ariaLabelledBy, { [labelId]: label })}
          aria-invalid={isInvalid ? true : undefined}
          aria-errormessage={errorMessageId}
          aria-describedby={mergeIds(ariaDescribedBy, {
            [descriptionId]: description,
          })}
          render={(triggerProps, state) => (
            // Keep Base UI's internal trigger ref so popup anchoring remains correct.
            // Merge it with external refs used by HvSelect consumers.
            <HvDropdownButton
              {...(triggerProps as any)}
              id={id}
              ref={useForkRef((triggerProps as any).ref, handleButtonRef)}
              open={state.open && isOpen}
              disabled={disabledProp}
              readOnly={readOnly}
              className={cx(classes.select, {
                [classes.invalid]: validationState === "invalid",
              })}
              data-popper-placement={`${state.popupSide ?? "bottom"}-start`}
              size={size}
              variant={variant}
            />
          )}
        >
          <Select.Value>
            {() => renderValue(actualValue as any) ?? placeholder}
          </Select.Value>
        </Select.Trigger>
        {shouldUsePortal ? <Select.Portal>{popup}</Select.Portal> : popup}
      </Select.Root>
      <input
        type="hidden"
        name={name}
        readOnly
        value={serializedValue}
        autoComplete={autoComplete}
        {...inputProps}
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
  );
});
