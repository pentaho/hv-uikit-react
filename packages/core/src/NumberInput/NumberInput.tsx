import { forwardRef, useMemo, useRef } from "react";
import { useForkRef } from "@mui/material/utils";
import { useDefaultProps } from "@hitachivantara/uikit-react-utils";

import { HvAdornment } from "../FormElement";
import { HvIcon } from "../icons";
import { HvInput, type HvInputProps } from "../Input";
import { changeInputValue } from "../Input/utils";
import { useClasses } from "./NumberInput.styles";

export interface HvNumberInputProps extends HvInputProps<HTMLInputElement> {}

/**
 * A Number Input lets users enter numeric values and provides buttons to increment or decrement the value.
 * It extends the HvInput component—refer to its documentation for additional available props.
 *
 * @extends HvInput
 */
export const HvNumberInput = forwardRef<
  // no-indent
  HTMLInputElement,
  HvNumberInputProps
>(function HvNumberInput(props, ref) {
  const {
    classes: classesProp,
    className,
    readOnly,
    ...others
  } = useDefaultProps("HvNumberInput", props);

  const { classes, cx } = useClasses(classesProp);

  const inputRef = useRef<HTMLInputElement>(null);
  const forkedRef = useForkRef(ref, inputRef);

  const buttons = useMemo(() => {
    const handleIncrease = () => {
      if (inputRef.current) {
        inputRef.current.stepUp();
        changeInputValue(inputRef.current, inputRef.current.value);
      }
    };

    const handleDecrease = () => {
      if (inputRef.current) {
        inputRef.current.stepDown();
        changeInputValue(inputRef.current, inputRef.current.value);
      }
    };

    return (
      <>
        <HvAdornment icon={<HvIcon name="Remove" />} onClick={handleDecrease} />
        <HvAdornment icon={<HvIcon name="Add" />} onClick={handleIncrease} />
      </>
    );
  }, []);

  return (
    <HvInput
      ref={forkedRef}
      type="number"
      className={cx(classes.root, className)}
      endAdornment={!readOnly && buttons}
      classes={classes}
      readOnly={readOnly}
      disableClear
      {...others}
    />
  );
});
