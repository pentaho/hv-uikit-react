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
import { Suspense, useCallback, useEffect, useState } from "react";
import {
  useHvLocation,
  useHvNavigation,
} from "@hitachivantara/app-shell-navigation";
import { HvLoading, HvTab, HvTabs } from "@hitachivantara/uikit-react-core";

import { MainContainer } from "../../components/MainContainer";

const DetailsWithContainer = ({ children }: { children: React.ReactNode }) => {
  const { views } = useHvLocation();

  const selfIndex = views.findIndex(
    (v) => v.bundle === "default-app/pages/TabLayout.js",
  );

  const [value, setValue] = useState(() => {
    if (selfIndex === views.length - 1) {
      return 0;
    }

    const nestedView = views[selfIndex + 1];
    if (nestedView.route === "/") {
      return 0;
    }
    if (nestedView.bundle === "default-app/pages/ListView.js") {
      return 1;
    }
    if (nestedView.bundle === "default-app/pages/AssetInventory.js") {
      return 2;
    }

    return false;
  });

  const { navigate } = useHvNavigation();

  useEffect(() => {
    if (selfIndex === views.length - 1) {
      setValue(0);
    }

    const nestedView = views[selfIndex + 1];
    if (nestedView.route === "/") {
      setValue(0);
    } else if (nestedView.bundle === "default-app/pages/ListView.js") {
      setValue(1);
    } else if (nestedView.bundle === "default-app/pages/AssetInventory.js") {
      setValue(2);
    } else {
      setValue(false);
    }
  }, [selfIndex, views]);

  const onChange = useCallback(
    (event: React.SyntheticEvent, newValue: number) => {
      if (newValue === 0) {
        navigate(".");
      } else if (newValue === 1) {
        navigate("default-app/pages/ListView.js");
      } else if (newValue === 2) {
        navigate("default-app/pages/AssetInventory.js");
      }
    },
    [navigate],
  );

  return (
    <MainContainer>
      <HvTabs
        value={value}
        onChange={onChange}
        classes={{ flexContainer: "justify-center" }}
      >
        <HvTab label="Index Route" />
        <HvTab label="List View" />
        <HvTab label="Asset Inventory" />
      </HvTabs>
      <Suspense fallback={<HvLoading />}>{children}</Suspense>
    </MainContainer>
  );
};

export default DetailsWithContainer;
