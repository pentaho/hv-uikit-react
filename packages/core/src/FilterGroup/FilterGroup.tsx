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
import { forwardRef } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import {
  HvFormElement,
  HvWarningText,
  type HvFormElementProps,
  type HvFormStatus,
} from "../FormElement";
import { HvLabelContainer } from "../FormElement/LabelContainer";
import { useControlled } from "../hooks/useControlled";
import { useLabels } from "../hooks/useLabels";
import { useUniqueId } from "../hooks/useUniqueId";
import { setId } from "../utils/setId";
import {
  HvFilterGroupContent,
  type HvFilterGroupContentProps,
} from "./FilterContent";
import { staticClasses, useClasses } from "./FilterGroup.styles";
import { HvFilterGroupProvider } from "./FilterGroupContext";
import type {
  HvFilterGroupFilters,
  HvFilterGroupHorizontalPlacement,
  HvFilterGroupValue,
} from "./types";

export { staticClasses as filterGroupClasses };

export type HvFilterGroupClasses = ExtractNames<typeof useClasses>;

export interface HvFilterGroupProps extends Omit<
  HvFormElementProps,
  "classes" | "onChange" | "defaultValue" | "statusMessage"
> {
  /** The initial value of the input when in single calendar mode. */
  filters: HvFilterGroupFilters;
  /** The form element name. */
  name?: string;
  /**
   * The label of the form element.
   *
   * The form element must be labeled for accessibility reasons.
   * If not provided, an aria-label or aria-labelledby must be provided instead.
   */
  label?: React.ReactNode;
  /**  Provide additional descriptive text for the form element. */
  description?: React.ReactNode;
  /** Indicates that the form element is disabled. */
  disabled?: boolean;
  /** Indicates that user input is required on the form element. */
  required?: boolean;
  /**
   * The status of the form element.
   *
   * Valid is correct, invalid is incorrect and standBy means no validations have run.
   *
   * When uncontrolled and unspecified it will default to "standBy" and change to either "valid"
   * or "invalid" after any change to the state.
   */
  status?: HvFormStatus;
  /**  The error message to show when `status` is "invalid". Defaults to "Required". */
  statusMessage?: React.ReactNode;
  /** The callback fired when the cancel button is clicked. */
  onCancel?: (event: React.MouseEvent<HTMLButtonElement> | Event) => void;
  /** The callback fired when the clear filters button is clicked. */
  onClear?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** The callback fired when the value changes. */
  onChange?: (
    event: React.MouseEvent<HTMLButtonElement>,
    value?: HvFilterGroupValue,
  ) => void;
  /** An Object containing the various text associated with the input. */
  labels?: HvFilterGroupLabels;
  /** The placeholder value when nothing is selected. */
  placeholder?: string;
  /** The default value of the filter group. If defined the clear action will reset to it. */
  defaultValue?: HvFilterGroupValue;
  /** The value of the filter group. */
  value?: HvFilterGroupValue;
  /** The placement where the filter group should be placed according to the input. Options are `left` or `right`. */
  horizontalPlacement?: HvFilterGroupHorizontalPlacement;
  /** Disable the portal behavior. The children stay within it's parent DOM hierarchy. */
  disablePortal?: boolean;
  /** Sets if the filter container should be out of the screen or stay visible. */
  escapeWithReference?: boolean;
  /** The height of the filter panel, between 295 and 425. Defaults to 350 */
  height?: number | string;
  /** The filter content props */
  filterContentProps?: Partial<HvFilterGroupContentProps>;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvFilterGroupClasses;
}

const DEFAULT_LABELS = {
  /** Apply button label. */
  applyLabel: "Apply",
  /** Cancel button label. */
  cancelLabel: "Cancel",
  /** Clear button label. */
  clearLabel: "Clear Filters",
  /** Placeholder label. */
  placeholder: "Filters",
  /** SearchBox placeholder label. */
  searchBoxPlaceholder: "Search",
  /** Select All placeholder label. */
  selectAll: "All",
  /** Multi selection conjunction placeholder label. */
  multiSelectionConjunction: "/",
};

export type HvFilterGroupLabels = Partial<typeof DEFAULT_LABELS>;

/**
 A Filter Group is a UI pattern used to organize and apply multiple filters to a dataset, helping users refine and narrow down results.
 */
export const HvFilterGroup = forwardRef<HTMLDivElement, HvFilterGroupProps>(
  function HvFilterGroup(props, ref) {
    const {
      className,
      id,
      name,
      required,
      disabled,
      label,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      description,
      "aria-describedby": ariaDescribedBy,
      onChange,
      onCancel,
      onClear,
      status,
      statusMessage,
      labels: labelsProp,
      defaultValue,
      value,
      filters,
      horizontalPlacement = "right",
      disablePortal = true,
      escapeWithReference = true,
      height = 350,
      filterContentProps,
      classes: classesProp,
      ...others
    } = useDefaultProps("HvFilterGroup", props);

    const { classes, cx } = useClasses(classesProp);
    const [validationMessage] = useControlled(statusMessage, "Required");

    const elementId = useUniqueId(id);

    const labels = useLabels(DEFAULT_LABELS, labelsProp);

    // Error message area will only be needed if the status is being controlled
    // or if required is true
    const canShowError = status !== undefined || required;

    return (
      <HvFormElement
        id={id}
        name={name}
        value={value}
        status={status}
        disabled={disabled}
        required={required}
        className={cx(classes.root, className)}
        {...others}
      >
        <HvLabelContainer
          label={label}
          description={description}
          inputId={setId(elementId, "input")}
          labelId={setId(elementId, "label")}
          descriptionId={setId(elementId, "description")}
          classes={{
            root: classes.labelContainer,
            label: classes.label,
            description: classes.description,
          }}
        />
        <HvFilterGroupProvider
          defaultValue={defaultValue}
          value={value}
          filters={filters}
        >
          <HvFilterGroupContent
            ref={ref}
            id={elementId}
            disabled={disabled}
            disablePortal={disablePortal}
            variableWidth
            placement={horizontalPlacement}
            escapeWithReference={escapeWithReference}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            status={status}
            onChange={onChange}
            onCancel={onCancel}
            onClear={onClear}
            labels={labels}
            height={height}
            {...filterContentProps}
          />
          {canShowError && (
            <HvWarningText
              id={setId(elementId, "error")}
              disableBorder
              className={classes.error}
            >
              {validationMessage}
            </HvWarningText>
          )}
        </HvFilterGroupProvider>
      </HvFormElement>
    );
  },
);
