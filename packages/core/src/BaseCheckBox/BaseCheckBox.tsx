/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { forwardRef, useCallback, useState } from "react";
import MuiCheckbox, {
  type CheckboxProps as MuiCheckboxProps,
} from "@mui/material/Checkbox";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";
import type { HvColorAny } from "@hitachivantara/uikit-styles";

import { staticClasses, useClasses } from "./BaseCheckBox.styles";
import { HvCheckBoxIcon } from "./CheckBoxIcon";

export { staticClasses as baseCheckBoxClasses };

export type HvBaseCheckBoxClasses = ExtractNames<typeof useClasses>;

export interface HvBaseCheckBoxProps extends Omit<
  MuiCheckboxProps,
  "onChange" | "classes" | "color"
> {
  /**
   * The input name.
   */
  name?: string;
  /**
   * The value of the input.
   *
   * Is up to the application's logic when to consider the submission of this value.
   * Generally it should be used only when the checkbox is neither unchecked nor indeterminate.
   *
   * The default value is "on".
   */
  value?: any;
  /**
   * Indicates that the input is disabled.
   */
  disabled?: boolean;
  /**
   * Indicates that the input is not editable.
   */
  readOnly?: boolean;
  /**
   * Indicates that user input is required.
   */
  required?: boolean;
  /**
   * If `true` the checkbox is selected, if set to `false` the checkbox is not selected.
   *
   * When defined the checkbox state becomes controlled.
   */
  checked?: boolean;
  /**
   * When uncontrolled, defines the initial checked state.
   */
  defaultChecked?: boolean;
  /**
   * If `true` the checkbox visually shows the indeterminate state.
   */
  indeterminate?: boolean;
  /**
   * The callback fired when the checkbox is pressed.
   */
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    value: any,
  ) => void;
  /**
   * Whether the selector should use semantic colors.
   */
  semantic?: boolean;
  /**
   * Properties passed on to the input element.
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  /**
   * Callback fired when the component is focused with a keyboard.
   * We trigger a `onFocus` callback too.
   */
  onFocusVisible?: (event: React.FocusEvent<any>) => void;
  /**
   * Callback fired when the component is blurred.
   */
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  /**
   * Color applied to the check box.
   */
  color?: HvColorAny;
  /**
   * A Jss Object used to override or extend the styles applied to the checkbox.
   */
  classes?: HvBaseCheckBoxClasses;
}

/**
 * A Checkbox is a mechanism that allows user to select one or more options.
 *
 * The Base Checkbox is a building block of the Checkbox form element. Don't use unless
 * implementing a custom use case not covered by the Checkbox form element.
 */
export const HvBaseCheckBox = forwardRef<
  HTMLButtonElement,
  HvBaseCheckBoxProps
>(function HvBaseCheckBox(props, ref) {
  const {
    classes: classesProp,
    className,
    inputProps,
    onChange,
    onFocusVisible,
    onBlur,
    checked,
    indeterminate,
    defaultChecked,
    value = "on",
    required = false,
    readOnly = false,
    disabled = false,
    semantic = false,
    color,
    style,
    ...others
  } = useDefaultProps("HvBaseCheckBox", props);

  const { classes, cx } = useClasses(classesProp);

  const [focusVisible, setFocusVisible] = useState<boolean>(false);

  const onChangeCallback = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (readOnly) {
        return;
      }

      onChange?.(event, event.target.checked, value);
    },
    [onChange, readOnly, value],
  );

  const onBlurCallback = useCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      setFocusVisible(false);
      onBlur?.(event);
    },
    [onBlur],
  );

  const onFocusVisibleCallback = useCallback(
    (event: React.FocusEvent<any>) => {
      setFocusVisible(true);
      onFocusVisible?.(event);
    },
    [onFocusVisible],
  );

  const params = { indeterminate, disabled, semantic, color };

  return (
    <MuiCheckbox
      ref={ref}
      value={value}
      className={cx(
        classes.root,
        {
          [classes.focusVisible]: focusVisible,
          [classes.checked]: checked,
          [classes.indeterminate]: indeterminate,
          [classes.semantic]: semantic,
          [classes.disabled]: disabled,
        },
        className,
      )}
      icon={<HvCheckBoxIcon {...params} />}
      indeterminateIcon={<HvCheckBoxIcon variant="indeterminate" {...params} />}
      checkedIcon={<HvCheckBoxIcon variant="checked" {...params} />}
      disabled={disabled}
      required={required}
      readOnly={readOnly}
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      inputProps={inputProps}
      onChange={onChangeCallback}
      onFocusVisible={onFocusVisibleCallback}
      onBlur={onBlurCallback}
      color="default"
      {...others}
    />
  );
});
