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
import { HvLoading } from "@hitachivantara/uikit-react-core";

export interface LoadingProps {
  label?: string;
}

/** _Fullscreen_ `HvLoading` component to use with `Suspense` and other loading fallbacks */
export const Loading: React.FC<LoadingProps> = ({ label }) => (
  <HvLoading
    role="progressbar"
    label={label}
    aria-valuetext={label}
    className="size-full z-overlay"
  />
);
