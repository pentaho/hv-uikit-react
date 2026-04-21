import { useMemo } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useUniqueId } from "../hooks/useUniqueId";
import type { HvBaseProps } from "../types/generic";
import {
  HvFormElementContext,
  HvFormElementDescriptorsContext,
  HvFormElementValueContext,
  type HvFormElementContextValue,
} from "./context";
import { staticClasses, useClasses } from "./FormElement.styles";
import { findDescriptors } from "./utils";

export { staticClasses as formElementClasses };

export type HvFormElementClasses = ExtractNames<typeof useClasses>;

export type HvFormStatus = "standBy" | "valid" | "invalid" | "empty";

export interface HvFormElementProps
  extends
    HvFormElementContextValue,
    HvBaseProps<HTMLDivElement, "onChange" | "onToggle"> {
  /**
   * Current value of the form element.
   *
   * Part of a name/value pair, should be the value property of the underling native input.
   */
  value?: any;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided instead.
   */
  label?: React.ReactNode;
  /** Provide additional descriptive text for the form element. */
  description?: React.ReactNode;
  /** The error message to show when `status` is "invalid". */
  statusMessage?: string;
  /** The callback fired when the value changes. */
  onChange?: (event: React.FormEvent<HTMLDivElement>) => void;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFormElementClasses;
}

/**
 * Provides form-related context (ie. required/disabled/readOnly) for building form components,
 * analogous to MUI's [`FormControl`](https://mui.com/material-ui/api/form-control/) component.
 *
 * It is used internally to build UI Kit's form components (eg. `HvInput`, `HvDatePicker`), and can be used to build custom form components.
 *
 * It exposes the common properties to be shared between all form components: `required`, `disabled`, `readOnly`, and `status`.
 *
 * Along with the properties above, form components also share the `value`/`defaultValue` and `onChange` props,
 * used to control the value of the form component, analogous to the native `input` component.
 */
export const HvFormElement = (props: HvFormElementProps) => {
  const {
    classes: classesProp,
    className,
    children,
    id: idProp,
    name,
    value,
    disabled,
    required,
    readOnly,
    status = "standBy",
    ...others
  } = useDefaultProps("HvFormElement", props);

  const { classes, cx } = useClasses(classesProp);

  const id = useUniqueId(idProp);

  const contextValue = useMemo<HvFormElementContextValue>(
    () => ({ id, name, status, disabled, required, readOnly }),
    [id, name, status, disabled, required, readOnly],
  );

  const descriptors = useMemo(() => findDescriptors(children), [children]);

  return (
    <div id={id} className={cx(classes.root, className)} {...others}>
      <HvFormElementContext.Provider value={contextValue}>
        <HvFormElementValueContext.Provider value={value}>
          <HvFormElementDescriptorsContext.Provider value={descriptors}>
            {children}
          </HvFormElementDescriptorsContext.Provider>
        </HvFormElementValueContext.Provider>
      </HvFormElementContext.Provider>
    </div>
  );
};

HvFormElement.formElementType = "formelement";
