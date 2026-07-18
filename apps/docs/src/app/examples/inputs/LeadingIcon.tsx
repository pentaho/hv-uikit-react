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
import { HvIconContainer, HvInput } from "@hitachivantara/uikit-react-core";

export default function Demo() {
  return (
    <HvInput
      label="Leading Icon"
      className="w-300px"
      placeholder="Placeholder text..."
      startAdornment={
        <HvIconContainer>
          <div className="i-ph-user" />
        </HvIconContainer>
      }
    />
  );
}
