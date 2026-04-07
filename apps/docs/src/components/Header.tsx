import { Suspense } from "react";

import { getComponentData, type ComponentDataParams } from "../utils/component";
import type { PlaygroundProps } from "./code/Playground";
import { Description } from "./usage/Description";
import { Tabs } from "./usage/Tabs";

interface HeaderProps extends PlaygroundProps {
  params: ComponentDataParams;
}

/**
 * The `Header` component manages a tab-based layout
 * and dynamically displays specific sections based on the selected tab.
 */
export async function Header({ params, ...playgroundProps }: HeaderProps) {
  const meta = await getComponentData(params);

  return (
    <div className="[&:not(:has([data-tab=usage]))_~_*]:hidden">
      <Description meta={meta} />
      <Suspense fallback={null}>
        <Tabs meta={meta} playgroundProps={{ ...playgroundProps, meta }} />
      </Suspense>
    </div>
  );
}
