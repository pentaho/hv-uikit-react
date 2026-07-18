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
  HvLoading,
  HvSection,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

interface ChartContainerProps {
  children: React.ReactNode;
  loading: boolean;
  title?: string;
}

export const ChartContainer = ({
  title,
  loading,
  children,
}: ChartContainerProps) => (
  <HvSection
    title={!loading && <HvTypography variant="title4">{title}</HvTypography>}
    className={loading ? "flex items-center justify-center h-full" : undefined}
    classes={{
      content: "h-full",
    }}
  >
    {loading ? <HvLoading small /> : children}
  </HvSection>
);
