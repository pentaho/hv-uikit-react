import { forwardRef, useMemo, useRef, useState } from "react";
import { useTimeField } from "react-aria/useTimeField";
import {
  useTimeFieldState,
  type TimeFieldStateOptions,
} from "react-stately/useTimeFieldState";
import { Time } from "@internationalized/date";
import useForkRef from "@mui/utils/useForkRef";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvBaseDropdown, type HvBaseDropdownProps } from "../BaseDropdown";
import { DEFAULT_LOCALE } from "../Calendar/utils";
import {
  HvFormElement,
  HvWarningText,
  type HvFormElementProps,
  type HvFormStatus,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useUniqueId } from "../hooks/useUniqueId";
import { HvIcon } from "../icons";
import { setId } from "../utils/setId";
import { Placeholder, type PlaceholderProps } from "./Placeholder";
import { staticClasses, useClasses } from "./TimePicker.styles";
import { Unit } from "./Unit";

const toTime = (value?: HvTimePickerValue | null) => {
  if (!value) return value;
  const { hours, minutes, seconds } = value;
  return new Time(hours, minutes, seconds);
};

export { staticClasses as timePickerClasses };

export type TimeFormat = "12" | "24";

export type HvTimePickerClasses = ExtractNames<typeof useClasses>;

export type HvTimePickerClassKey =
  | "root"
  | "input"
  | "label"
  | "placeholder"
  | "timePopperContainer"
  | "separator"
  | "periodContainer"
  | "formElementRoot"
  | "dropdownPlaceholder"
  | "iconBaseRoot"
  | "error"
  | "labelContainer"
  | "description"
  | "dropdownHeaderInvalid"
  | "dropdownPlaceholderDisabled"
  | "dropdownHeaderOpen";

export type HvTimePickerValue = {
  hours: number;
  minutes: number;
  seconds: number;
};

export interface HvTimePickerProps extends Omit<
  HvFormElementProps,
  "classes" | "value" | "defaultValue" | "onChange"
> {
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvTimePickerClasses;
  /** Current value of the element when _controlled_. Follows the 24-hour format. */
  value?: HvTimePickerValue | null;
  /** Initial value of the element when _uncontrolled_. Follows the 24-hour format. */
  defaultValue?: HvTimePickerValue | null;
  /** The placeholder value when no time is selected. */
  placeholder?: string;
  /** The placeholder of the hours input. */
  hoursPlaceholder?: string;
  /** The placeholder of the minutes input. */
  minutesPlaceholder?: string;
  /** The placeholder of the seconds input. */
  secondsPlaceholder?: string;
  /**
   * Whether the time picker should show the AM/PM 12-hour clock or the 24-hour one.
   * If undefined, the component will use a format according to the passed locale.
   */
  timeFormat?: TimeFormat;
  /** Whether to visually show the seconds control */
  showSeconds?: boolean;
  /** Locale that will provide the time format(12 or 24 hour format). It is "overwritten" by `showAmPm` */
  locale?: string;
  /** Whether the dropdown is expandable. */
  disableExpand?: boolean;
  /**
   * Callback function to be triggered when the input value is changed.
   * It is invoked with a `{hours, minutes, seconds}` object, always in the 24h format
   */
  onChange?: (value: HvTimePickerValue) => void;
  /** Callback called when dropdown changes the expanded state. */
  onToggle?: (event: Event, isOpen: boolean) => void;
  /** Disable the portal behavior. The children stay within it's parent DOM hierarchy. */
  disablePortal?: boolean;
  /** Sets if the calendar container should follow the date picker input out of the screen or stay visible. */
  escapeWithReference?: boolean;
  /** Extra properties to be passed to the TimePicker's dropdown. */
  dropdownProps?: Partial<HvBaseDropdownProps>;
}

/**
 * A Time Picker allows the user to choose a specific time or a time range.
 */
export const HvTimePicker = forwardRef<HTMLDivElement, HvTimePickerProps>(
  function HvTimePicker(props, ref) {
    const {
      classes: classesProp,
      className,

      id: idProp,
      name,
      required,
      disabled,
      readOnly,
      label,

      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      description,
      "aria-describedby": ariaDescribedBy,
      status,
      statusMessage,
      "aria-errormessage": ariaErrorMessage,

      placeholder,
      hoursPlaceholder = "hh",
      minutesPlaceholder = "mm",
      secondsPlaceholder = "ss",

      value: valueProp,
      defaultValue: defaultValueProp,

      timeFormat,
      showSeconds,
      disableExpand,
      locale = DEFAULT_LOCALE,

      onToggle,
      onChange,

      // misc properties:
      disablePortal = true,
      escapeWithReference = true,
      dropdownProps = {},
      ...others
    } = useDefaultProps("HvTimePicker", props);

    const id = useUniqueId(idProp);

    const { classes, cx } = useClasses(classesProp);

    const timeFieldRef = useRef<HTMLDivElement>(null);

    const { ref: refProp, ...otherDropdownProps } = dropdownProps;
    const dropdownForkedRef = useForkRef(ref, refProp);

    const valueState = useMemo(() => toTime(valueProp), [valueProp]);

    const stateProps: TimeFieldStateOptions = {
      value: valueState,
      defaultValue: toTime(defaultValueProp),
      label,
      locale,
      isRequired: required,
      isReadOnly: readOnly,
      isDisabled: disabled,
      granularity: showSeconds === false ? "minute" : "second",
      hourCycle: timeFormat === "12" ? 12 : 24,
      onChange: (value) => {
        if (!value) return;
        const { hour: hours, minute: minutes, second: seconds } = value;
        onChange?.({ hours, minutes, seconds });
      },
    };
    const state = useTimeFieldState(stateProps);
    const { labelProps, fieldProps, descriptionProps } = useTimeField(
      {
        ...stateProps,
        id,
        "aria-label": ariaLabel,
        "aria-labelledby": ariaLabelledBy,
        "aria-describedby": ariaDescribedBy,
      },
      state,
      timeFieldRef,
    );

    const [open, setOpen] = useState(false);

    const [validationMessage] = useControlled(statusMessage, "Required");
    const [validationState] = useControlled<HvFormStatus>(status, "standBy");

    const placeholders: PlaceholderProps["placeholders"] = useMemo(
      () => ({
        hour: hoursPlaceholder,
        minute: minutesPlaceholder,
        second: secondsPlaceholder,
      }),
      [hoursPlaceholder, minutesPlaceholder, secondsPlaceholder],
    );

    // the error message area will only be created if:
    // - an external element that provides an error message isn't identified via aria-errormessage AND
    //   - both status and statusMessage properties are being controlled OR
    //   - status is uncontrolled and required is true
    const canShowError =
      ariaErrorMessage == null &&
      ((status !== undefined && statusMessage !== undefined) ||
        (status === undefined && required));

    const isStateInvalid = validationState === "invalid";
    const errorMessageId = isStateInvalid
      ? canShowError
        ? setId(id, "error")
        : ariaErrorMessage
      : undefined;

    return (
      <HvFormElement
        name={name}
        required={required}
        disabled={disabled}
        status={validationState}
        className={cx(classes.root, className)}
        {...others}
      >
        <HvLabelContainer
          label={label}
          description={description}
          classes={{
            root: classes.labelContainer,
            label: classes.label,
            description: classes.description,
          }}
          labelProps={labelProps}
          descriptionProps={descriptionProps}
        />
        <HvBaseDropdown
          ref={dropdownForkedRef}
          role="combobox"
          variableWidth
          disabled={disabled}
          readOnly={readOnly}
          placeholder={
            placeholder && !state.value ? (
              placeholder
            ) : (
              <Placeholder
                ref={timeFieldRef}
                name={name}
                state={state}
                placeholders={placeholders}
                className={cx(classes.placeholder, {
                  [classes.placeholderDisabled]: disabled,
                })}
                {...fieldProps}
              />
            )
          }
          classes={{
            header: cx(classes.dropdownHeader, {
              [classes.dropdownHeaderInvalid]: isStateInvalid,
            }),
            panel: classes.dropdownPanel,
            headerOpen: classes.dropdownHeaderOpen,
          }}
          placement="right"
          adornment={<HvIcon name="Time" className={classes.icon} />}
          expanded={open}
          onToggle={(evt, newOpen) => {
            if (disableExpand) return;
            setOpen(newOpen);
            onToggle?.(evt, newOpen);
          }}
          onContainerCreation={(containerRef) => {
            containerRef?.getElementsByTagName("input")[0]?.focus();
          }}
          aria-haspopup="dialog"
          aria-label={ariaLabel}
          aria-labelledby={fieldProps["aria-labelledby"]}
          aria-describedby={fieldProps["aria-describedby"]}
          aria-invalid={isStateInvalid ? true : undefined}
          aria-errormessage={errorMessageId}
          disablePortal={disablePortal}
          popperProps={{
            modifiers: [
              { name: "preventOverflow", enabled: escapeWithReference },
            ],
          }}
          {...otherDropdownProps}
        >
          <div ref={timeFieldRef} className={classes.timePopperContainer}>
            {state.segments.map((segment) => (
              <Unit
                key={segment.type}
                state={state}
                segment={segment}
                placeholder={placeholders[segment.type]}
                onAdd={() => state.increment(segment.type)}
                onSub={() => state.decrement(segment.type)}
                onChange={(evt, val) => {
                  state.setSegment(segment.type, Number(val));
                }}
              />
            ))}
          </div>
        </HvBaseDropdown>

        {canShowError && (
          <HvWarningText
            id={setId(id, "error")}
            disableBorder
            className={classes.error}
          >
            {validationMessage}
          </HvWarningText>
        )}
      </HvFormElement>
    );
  },
);
