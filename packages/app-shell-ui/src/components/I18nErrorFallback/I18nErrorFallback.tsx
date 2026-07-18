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
import { HvTypography } from "@hitachivantara/uikit-react-core";

/**
 * Minimal error fallback used as the Error Boundary around i18n initialization.
 * Must NOT use `useTranslation` or any i18n-dependent hook since it renders
 * precisely when i18n initialization has failed.
 */
const I18nErrorFallback = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      width: "100%",
      textAlign: "center",
      padding: 24,
    }}
  >
    <HvTypography variant="title2">Initialization Error</HvTypography>
    <HvTypography style={{ marginTop: 8 }}>
      Something went wrong during initialization. Please try again later.
    </HvTypography>
  </div>
);

export default I18nErrorFallback;
