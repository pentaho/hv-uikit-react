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
import { css } from "@emotion/css";
import {
  HvGrid,
  HvLoadingContainer,
  HvPanel,
  theme,
  type HvGridProps,
} from "@hitachivantara/uikit-react-core";

/** A `HvGrid` item + styled `HvPanel` container with a loading `Suspense` boundary */
export const GridPanel = ({
  children,
  height = 300,
  isLoading,
  ...others
}: HvGridProps & { isLoading?: boolean }) => (
  <HvGrid item {...others}>
    <HvLoadingContainer hidden={!isLoading}>
      <HvPanel
        role="region"
        style={{ height: height as number }}
        className={css({
          overflow: "visible",
          position: "relative",
          borderWidth: 1,
          borderRadius: `0 0 ${theme.radii.round} ${theme.radii.round}`,
        })}
      >
        {children}
      </HvPanel>
    </HvLoadingContainer>
  </HvGrid>
);
