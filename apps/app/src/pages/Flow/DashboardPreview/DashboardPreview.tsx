import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
  HvContainer,
  HvGlobalActions,
  HvLoading,
} from "@hitachivantara/uikit-react-core";
import {
  HvDashboard,
  type HvDashboardProps,
} from "@hitachivantara/uikit-react-lab";
import { HvVizProvider } from "@hitachivantara/uikit-react-viz";

import {
  DASHBOARDS_STORAGE_KEY,
  type DashboardSpecs,
  type DashboardsStorage,
} from "../types";
import { Renderer, type RendererProps } from "./Renderers";

interface DashboardConfig extends Pick<HvDashboardProps, "layout" | "cols"> {
  items?: RendererProps[] & Record<string, any>;
}

const buildContent = (items?: DashboardSpecs["items"]) => {
  if (!items) return;

  return items.reduce<RendererProps[]>((acc, node) => {
    if (node.type) {
      acc.push({ ...node, type: node.type });
    }

    return acc;
  }, []);
};

const DashboardPreview = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const isMounted = useRef<boolean>(false);

  const [config, setConfig] = useState<DashboardConfig>();

  const buildDashboard = useCallback(
    (value: string | null) => {
      if (!id) return;

      const dashboards: DashboardsStorage = value
        ? JSON.parse(value)
        : undefined;
      const dashboard = dashboards?.[id];

      if (!dashboard) return;

      const { layout, items, cols } = dashboard;

      setConfig({ cols, layout, items: buildContent(items) });
    },
    [id],
  );

  const onStorageUpdate = useCallback(
    (e: StorageEvent) => {
      const { key, newValue } = e;

      if (key === DASHBOARDS_STORAGE_KEY) {
        buildDashboard(newValue);
      }
    },
    [buildDashboard],
  );

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;

      const value = localStorage.getItem(DASHBOARDS_STORAGE_KEY);

      buildDashboard(value);
    }

    // Listen for updates
    window.addEventListener("storage", onStorageUpdate);

    return () => {
      // Unmount
      window.removeEventListener("storage", onStorageUpdate);
    };
  }, [buildDashboard, onStorageUpdate]);

  return (
    <HvVizProvider>
      <div className="pt-md">
        <HvGlobalActions position="relative" title="Dashboard Preview" />
        {config?.items && config?.layout && (
          <HvDashboard
            {...config}
            rowHeight={120}
            margin={[16, 16]}
            containerPadding={[0, 16]}
            isDraggable={false}
            isResizable={false}
            useCSSTransforms={false}
          >
            {config.items.map((item) => (
              <div key={item.id} className="flex">
                <Renderer key={item.id} {...item} />
              </div>
            ))}
          </HvDashboard>
        )}
      </div>
    </HvVizProvider>
  );
};

export const Component = () => (
  <Suspense fallback={<HvLoading />}>
    <HvContainer component="main" maxWidth="xl" className="w-full">
      <DashboardPreview />
    </HvContainer>
  </Suspense>
);
