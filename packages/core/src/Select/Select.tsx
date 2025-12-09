import { useRef, useState } from "react";
import {
  Popper,
  SelectProvider,
  useSelect,
  type SelectOption,
  type SelectValue,
  type UseSelectParameters,
} from "@mui/base";
import { useControlled, useForkRef } from "@mui/material/utils";
import type { Placement } from "@popperjs/core";
import { clsx, type ClassValue } from "clsx";
import {
  useDefaultProps,
  useTheme,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvButtonProps } from "../Button";
import { HvDropdownButton } from "../DropdownButton";
import {
  HvFormElement,
  HvFormElementProps,
  HvFormStatus,
  HvWarningText,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvListContainer } from "../ListContainer";
import { fixedForwardRef } from "../types/generic";
import { getContainerElement } from "../utils/document";
import { setId } from "../utils/setId";
import { HvOption } from "./Option";
import { staticClasses, useClasses } from "./Select.styles";

function defaultRenderValue<Value>(
  options: SelectOption<Value> | SelectOption<Value>[] | null,
): React.ReactNode {
  if (Array.isArray(options)) {
    return <>{options.map((o) => o.label).join(", ")}</>;
  }

  return options?.label ?? null;
}

const mergeIds = (...ids: ClassValue[]) => clsx(ids) || undefined;

function renderOptions(options?: HvSelectProps<any>["options"]) {
  return options?.map((option) => (
    <HvOption key={option.value} {...option}>
      {option.label}
    </HvOption>
  ));
}

export { staticClasses as selectClasses };

export type HvSelectClasses = ExtractNames<typeof useClasses>;

export interface HvSelectProps<
  OptionValue extends {},
  Multiple extends boolean = false,
> extends Omit<HvFormElementProps, "value" | "defaultValue" | "onChange">,
    Pick<
      UseSelectParameters<OptionValue, Multiple>,
      | "name"
      | "required"
      | "disabled"
      | "multiple"
      | "open"
      | "defaultOpen"
      | "value"
      | "defaultValue"
      | "buttonRef"
      | "options"
      | "getSerializedValue"
      | "onChange"
      | "onOpenChange"
    >,
    Pick<HvButtonProps, "size" | "variant"> {
  classes?: HvSelectClasses;
  placeholder?: React.ReactNode;
  autoComplete?: string;
  /** Custom render function for rendering the selected value. */
  renderValue?: (
    option: SelectValue<SelectOption<OptionValue>, Multiple>,
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

  const { rootId } = useTheme();

  const [placement, setPlacement] = useState<Placement>("bottom-start");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleButtonRef = useForkRef(ref, buttonRef);

  const {
    contextValue,
    disabled,
    getButtonProps,
    getListboxProps,
    getHiddenInputProps,
    getOptionMetadata,
    value,
    open,
  } = useSelect<OptionValue, Multiple>({
    componentName: "HvSelect",
    name,
    required,
    disabled: disabledProp,
    multiple,
    open: openProp,
    defaultOpen,
    value: valueProp,
    defaultValue,
    options: optionsProp,
    buttonRef: handleButtonRef,
    getSerializedValue,
    onChange,
    onOpenChange: handleOpenChange,
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

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      const hasValue = multiple ? (value as OptionValue[]).length > 0 : !!value;
      setValidationState(required && !hasValue ? "invalid" : "valid");
    }
    onOpenChange?.(newOpen);
  }

  // the error message area will only be created if:
  // - an external element that provides an error message isn't identified via aria-errormessage AND
  //   - both status and statusMessage properties are being controlled OR
  //   - status is uncontrolled and required is true
  const canShowError =
    ariaErrorMessage == null &&
    ((status !== undefined && statusMessage !== undefined) ||
      (status === undefined && required));

  const isInvalid = validationState === "invalid";

  const actualValue = multiple
    ? (value as OptionValue[])
        .map((v) => getOptionMetadata(v))
        .filter((v): v is SelectOption<OptionValue> => v !== undefined)
    : (getOptionMetadata(value as OptionValue) ?? null);

  const children = childrenProp ?? renderOptions(optionsProp);
  const isOpen = open && !!children;

  return (
    <HvFormElement
      name={name}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      status={validationState}
      className={cx(classes.root, className, {
        [classes.readOnly]: readOnly,
        [classes.disabled]: disabled,
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
      <HvDropdownButton
        id={id}
        open={isOpen}
        disabled={disabled}
        readOnly={readOnly}
        className={cx(classes.select, {
          [classes.invalid]: validationState === "invalid",
        })}
        placement={placement}
        size={size}
        variant={variant}
        aria-label={ariaLabel}
        aria-labelledby={mergeIds(ariaLabelledBy, { [labelId]: label })}
        aria-invalid={isInvalid ? true : undefined}
        aria-errormessage={errorMessageId}
        aria-describedby={mergeIds(ariaDescribedBy, {
          [descriptionId]: description,
        })}
        {...getButtonProps()}
      >
        {renderValue(actualValue as any) ?? placeholder}
      </HvDropdownButton>
      <Popper
        role="none"
        open={isOpen}
        keepMounted
        disablePortal={!enablePortal}
        container={enablePortal ? getContainerElement(rootId) : undefined}
        anchorEl={buttonRef.current}
        className={classes.popper}
        placement={placement}
        modifiers={[
          {
            enabled: true,
            phase: "main",
            fn: ({ state }) => setPlacement(state.placement),
          },
        ]}
      >
        <HvListContainer
          condensed
          selectable
          style={{
            width: variableWidth
              ? "auto"
              : (buttonRef.current?.clientWidth || 0) + 2,
          }}
          className={classes.panel}
          {...getListboxProps()}
        >
          <SelectProvider value={contextValue}>{children}</SelectProvider>
        </HvListContainer>
      </Popper>
      <input
        {...getHiddenInputProps()}
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
