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
import { createClasses } from "@hitachivantara/uikit-react-utils";

import { HvBaseSwitch, type HvBaseSwitchProps } from "../../BaseSwitch";
import { HvTypography } from "../../Typography";

const switchStyle = {
  cursor: "pointer",
  display: "inline-flex",
  marginLeft: "10px",
};

const { useClasses } = createClasses("HvSwitchColumnCell", {
  switchNo: switchStyle,
  switchYes: switchStyle,
});

export interface HvSwitchColumnCellProp {
  /** Whether the switch is checked or not. */
  checked: boolean;
  /** The switch label. */
  value: number | string | undefined;
  /** The value of the switch. */
  switchLabel: string;
  /** The right switch label. */
  falseLabel?: string;
  /** The left switch label. */
  trueLabel?: string;
  /** Extra props to be passed to the switch. */
  switchProps?: HvBaseSwitchProps;
}

export const HvSwitchColumnCell = ({
  checked,
  value,
  switchLabel,
  falseLabel,
  trueLabel,
  switchProps,
}: HvSwitchColumnCellProp) => {
  const { classes } = useClasses();

  return (
    <>
      {falseLabel != null && (
        <HvTypography
          aria-hidden="true"
          variant="body"
          className={classes.switchNo}
        >
          {falseLabel}
        </HvTypography>
      )}
      <HvBaseSwitch
        checked={checked}
        value={value}
        {...switchProps}
        inputProps={{ "aria-label": switchLabel, ...switchProps?.inputProps }}
      />
      {trueLabel != null && (
        <HvTypography
          aria-hidden="true"
          variant="body"
          className={classes.switchYes}
        >
          {trueLabel}
        </HvTypography>
      )}
    </>
  );
};
