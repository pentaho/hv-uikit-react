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
import type { FC } from "react";
import { HvContainer, HvTypography } from "@hitachivantara/uikit-react-core";

const ShouldBeVisible: FC = () => {
  return (
    <HvContainer maxWidth="lg">
      <HvTypography variant="title1" style={{ marginBottom: "32px" }}>
        This page is being correctly rendered!
      </HvTypography>
    </HvContainer>
  );
};

export default ShouldBeVisible;
