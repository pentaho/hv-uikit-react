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
import { useState } from "react";
import {
  HvVerticalNavigation,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
} from "@hitachivantara/uikit-react-core";
import { BarChart, Deploy, Open } from "@hitachivantara/uikit-react-icons";

const navigationData = [
  {
    id: "menu1",
    label: "Menu 1",
    path: "",
    icon: <Open />,
    data: [
      {
        id: "menu1-1",
        label: "Menu 1-1",
        path: "",
        icon: <Open />,
        parent: null,
      },
      {
        id: "menu1-2",
        label: "Menu 1-2",
        path: "",
        icon: <BarChart />,
        data: [
          {
            id: "menu1-2-1",
            label: "Menu 1-2-1",
            path: "",
            icon: <Open />,
            parent: null,
          },
          {
            id: "menu1-2-2",
            label: "Menu 1-2-2",
            path: "",
            icon: <BarChart />,
            parent: null,
          },
          {
            id: "menu1-2-3",
            label: "Menu 1-2-3",
            path: "",
            icon: <Deploy />,
            parent: null,
          },
        ],
        parent: null,
      },
      {
        id: "menu1-3",
        label: "Menu 1-3",
        path: "",
        icon: <Deploy />,
        parent: null,
      },
    ],
    parent: null,
  },
  {
    id: "menu2",
    label: "Menu 2 with a very big name that should be truncated",
    path: "",
    icon: <BarChart />,
    parent: null,
  },
  {
    id: "menu3",
    label: "Menu 3",
    path: "",
    icon: <Deploy />,
    parent: null,
  },
];

export const SliderMode = () => {
  const [value, setValue] = useState("menu1-3");

  return (
    <HvVerticalNavigation open slider>
      <HvVerticalNavigationHeader title="Menu" />
      <HvVerticalNavigationTree
        collapsible
        defaultExpanded
        aria-label="Example 4 Slider Mode"
        selected={value}
        onChange={(event, data) => setValue(data.id)}
        data={navigationData}
      />
    </HvVerticalNavigation>
  );
};
