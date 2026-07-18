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
import {
  clamp,
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import type { HvBaseProps } from "../types/generic";
import { HvTypography, type HvTypographyProps } from "../Typography";
import { staticClasses, useClasses } from "./ProgressBar.styles";

export { staticClasses as progressBarClasses };

export type HvProgressBarClasses = ExtractNames<typeof useClasses>;

export type HvProgressBarStatus = "inProgress" | "completed" | "error";

export interface HvProgressBarProps extends HvBaseProps {
  /** The value of the progress bar. */
  value: number;
  /**
   * The status of the progress bar.
   *
   * inProgress is black, error is red and completed is green.
   *
   * When uncontrolled and unspecified it will default to "inProgress".
   */
  status?: HvProgressBarStatus;
  /** Aria Properties passed on to the progress bar. */
  labelProps?: HvTypographyProps;
  /** A Jss Object used to override or extend the styles applied to the component. */
  classes?: HvProgressBarClasses;
  /**
   * True if the text label should not be displayed.
   */
  hideLabel?: boolean;
}

/**
 * Progress Bar provides feedback about a process that is taking place in the application.
 */
export const HvProgressBar = (props: HvProgressBarProps) => {
  const {
    className,
    classes: classesProp,
    value = 0,
    status = "inProgress",
    labelProps,
    hideLabel,
    ...others
  } = useDefaultProps("HvProgressBar", props);

  const { classes, cx } = useClasses(classesProp);

  const clampedValue = clamp(value, 100);

  return (
    <div
      className={cx(classes.root, classes.progress, className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={clampedValue}
      {...others}
    >
      <div className={classes.progressContainer}>
        {!hideLabel && (
          <HvTypography
            className={classes.progressBarLabel}
            variant="caption2"
            style={{ width: `${clampedValue}%` }}
            {...labelProps}
          >
            {`${clampedValue}%`}
          </HvTypography>
        )}
        <div className={classes.progressBarContainer}>
          <div
            style={{ width: `${clampedValue}%` }}
            className={cx(classes.progressBar, {
              [classes.progressDone]: status === "completed",
              [classes.progressError]: status === "error",
            })}
          />
        </div>
      </div>
    </div>
  );
};
