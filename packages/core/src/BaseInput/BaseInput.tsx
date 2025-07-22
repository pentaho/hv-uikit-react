import { forwardRef, useContext } from "react";
import MuiInputBase, { type InputBaseProps } from "@mui/material/InputBase";
import { useForkRef } from "@mui/material/utils";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  buildAriaPropsFromContext,
  buildFormElementPropsFromContext,
  HvFormElementContext,
  HvFormElementDescriptorsContext,
} from "../FormElement";
import { staticClasses, useClasses } from "./BaseInput.styles";

export { staticClasses as baseInputClasses };

export type HvBaseInputClasses = ExtractNames<typeof useClasses>;

export interface HvBaseInputProps
  extends Omit<
    InputBaseProps,
    "onChange" | "classes" | "ref" | "color" | "size" | "inputProps"
  > {
  /** The input name. */
  name?: string;
  /** The value of the input, when controlled. */
  value?: React.InputHTMLAttributes<HTMLInputElement>["value"];
  /** The initial value of the input, when uncontrolled. */
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>["value"];
  /** If `true` the input is disabled. */
  disabled?: boolean;
  /** Indicates that the input is not editable. */
  readOnly?: boolean;
  /** If true, the input element will be required. */
  required?: boolean;
  /**
   * Callback fired when the value is changed.
   *
   * You can pull out the new value by accessing `event.target.value` (string),
   * or using the second callback argument.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value: string,
  ) => void;
  /** If true, a textarea element will be rendered. */
  multiline?: boolean;
  /** If true and multiline is also true the textarea element will be resizable. */
  resizable?: boolean;
  /** Denotes if the input is in an invalid state. */
  invalid?: boolean;
  /**
   * Allows passing a ref to the underlying input
   * @deprecated Use `ref` directly instead
   * */
  inputRef?: InputBaseProps["inputRef"];
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   */
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement
  >;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvBaseInputClasses;
}

/**
 * An Input component that only posses the most basic functionalities.
 * It should be used alongside the other form elements to construct a proper accessible form.
 */
export const HvBaseInput = forwardRef<
  // no-indent
  React.ElementRef<"input">,
  HvBaseInputProps
>(function HvBaseInput(props, ref) {
  const {
    classes: classesProp,
    className = "",
    id,
    name,
    value,
    defaultValue,
    required,
    readOnly,
    disabled,
    onChange,
    type = "text",
    placeholder,
    multiline,
    resizable,
    invalid: invalidProp,
    inputRef,
    inputProps = {},
    ...others
  } = useDefaultProps("HvBaseInput", props);
  const { classes, cx } = useClasses(classesProp);
  const formElementContext = useContext(HvFormElementContext);
  const formElementProps = buildFormElementPropsFromContext(
    name,
    disabled,
    readOnly,
    required,
    formElementContext,
  );

  const forkedRef = useForkRef(ref, inputRef);

  const invalid = invalidProp || formElementProps.status === "invalid";

  const formElementDescriptorsContext = useContext(
    HvFormElementDescriptorsContext,
  );
  const ariaProps = buildAriaPropsFromContext(
    inputProps,
    formElementDescriptorsContext,
    invalid,
    id,
  );

  return (
    <MuiInputBase
      id={id}
      name={formElementProps.name}
      value={value}
      defaultValue={defaultValue}
      placeholder={placeholder}
      readOnly={!!formElementProps.readOnly}
      disabled={formElementProps.disabled}
      onChange={(event) => onChange?.(event, event.target.value)}
      className={cx(classes.root, className, {
        [classes.multiline]: multiline,
        [classes.invalid]: invalid,
        [classes.readOnly]: formElementProps.readOnly,
        [classes.disabled]: formElementProps.disabled,
      })}
      classes={{
        focused: classes.focused,
        input: cx(classes.input, {
          [classes.inputResizable]: !formElementProps.disabled && resizable,
          [classes.inputDisabled]: formElementProps.disabled,
          [classes.inputReadOnly]: formElementProps.readOnly,
        }),
      }}
      inputProps={{
        // Avoid the required attribute at the root node
        required: formElementProps.required,
        ...inputProps,
        ...ariaProps,
      }}
      inputRef={forkedRef}
      multiline={multiline}
      {...(multiline ? { rows: 10 } : { type })}
      {...others}
    />
  );
});
