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
  HvFormElement,
  HvInput,
  HvLabel,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  return (
    <HvFormElement required className="flex gap-xs">
      <HvLabel label="Name" htmlFor="username-input" className="h-fit mt-5px" />
      <HvInput
        id="username"
        className="w-300px"
        required
        placeholder="My label is on the side..."
      />
    </HvFormElement>
  );
}
