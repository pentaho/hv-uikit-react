"use client";

import { HvPanel } from "@pentaho/uikit-react-core";
import { Alert, icons } from "@pentaho/uikit-react-icons";

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
