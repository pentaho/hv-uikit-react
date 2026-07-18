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
import { Link } from "react-router-dom";
import { HvTypography } from "@hitachivantara/uikit-react-core";

export default function Page2() {
  return (
    <>
      <HvTypography variant="title2">Page 2</HvTypography>
      <HvTypography link component={Link} to="/">
        Go back
      </HvTypography>
    </>
  );
}
