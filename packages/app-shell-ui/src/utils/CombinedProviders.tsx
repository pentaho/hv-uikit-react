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
import { useMemo } from "react";
import type { HvAppShellProvidersComponent } from "@hitachivantara/app-shell-shared";

interface CombinedProvidersProps extends React.PropsWithChildren {
  providers?: HvAppShellProvidersComponent[];
}

const CombinedProviders = ({
  children: mainChildren,
  providers,
}: CombinedProvidersProps) => {
  const combined = useMemo(() => {
    if (!providers || providers.length === 0) {
      return mainChildren;
    }

    return providers.reduceRight(
      (Acc, { component: Curr, config, key }) => (
        <Curr key={key} {...config}>
          {Acc}
        </Curr>
      ),
      mainChildren,
    );
  }, [providers, mainChildren]);

  return <>{combined}</>;
};

export default CombinedProviders;
