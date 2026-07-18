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
  HvCard,
  HvCardContent,
  HvIconContainer,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

export const ActiveUsers = () => {
  return (
    <HvCard
      statusColor="positive"
      bgcolor="bgContainer"
      className="dark:!outline-border"
    >
      <HvCardContent className="grid gap-sm pb-xs!">
        <div className="flex items-center gap-xxs">
          <HvIconContainer
            size="xs"
            className="p-4px rounded-round bg-bgPage border-borderSubtle"
          >
            <div className="i-ph-copy-simple" />
          </HvIconContainer>
          <HvTypography variant="title3">Monthly Active Users</HvTypography>
        </div>
        <div className="flex items-baseline">
          <HvTypography variant="title3">24,583</HvTypography>
          <HvTypography variant="caption2" className="text-textSubtle">
            unique users
          </HvTypography>
        </div>
      </HvCardContent>
    </HvCard>
  );
};
