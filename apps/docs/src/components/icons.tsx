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
"use client";

import { HvPanel } from "@hitachivantara/uikit-react-core";
import { Alert, icons } from "@hitachivantara/uikit-react-icons";

import { Playground } from "./code/Playground";

export function IconLibrary() {
  return (
    <HvPanel className="flex flex-wrap gap-xs justify-around px-xs">
      {Object.entries(icons).map(([name, Icon]) => (
        <div
          key={name}
          className="flex flex-col items-center justify-center w-112px"
        >
          <Icon size="S" />
          <code className="text-sm h-2em text-center break-all">{name}</code>
        </div>
      ))}
    </HvPanel>
  );
}

export function IconPlayground() {
  return (
    <Playground
      Component={Alert}
      componentName="Alert"
      controls={{
        color: { type: "color", defaultValue: "warning" },
        size: {
          type: "slider",
          defaultValue: "md",
          values: ["xs", "sm", "md", "lg", "xl"],
        },
      }}
    />
  );
}
