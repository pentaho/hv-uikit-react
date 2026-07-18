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
import { lazy, memo, Suspense, useEffect, useState } from "react";

export interface DynamicActionProps {
  bundle: string;
}

const DynamicAction = ({ bundle, ...others }: DynamicActionProps) => {
  // Create a state to keep track of errors for each component
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setLoadError(null);
  }, [bundle]);

  const Action = lazy(() =>
    import(/* @vite-ignore */ bundle).catch((error) => {
      console.error(error);
      // Update the state to track the error for this component
      setLoadError(error);
      return { default: () => null };
    }),
  );

  return (
    <Suspense fallback={null}>
      {/* Render the component only if there was no error while loading it */}
      {!loadError && <Action {...others} />}
    </Suspense>
  );
};

export default memo(DynamicAction);
