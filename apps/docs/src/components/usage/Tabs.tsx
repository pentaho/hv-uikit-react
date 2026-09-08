"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HvTab, HvTabs } from "@pentaho/uikit-react-core";

import type { ComponentMeta } from "../../utils/component";
import { Playground, type PlaygroundProps } from "../code/Playground";
import { Classes } from "./Classes";
import { Props } from "./Props";

type TabId = "usage" | "props" | "classes";

const isTabId = (value: string | null): value is TabId => {
  return value === "usage" || value === "props" || value === "classes";
};

export function Tabs({
  meta,
  playgroundProps,
}: {
  meta: ComponentMeta;
  playgroundProps: PlaygroundProps;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabFromQuery = searchParams?.get("tab") ?? null;
  const tab = isTabId(tabFromQuery) ? tabFromQuery : "usage";

  return (
    <>
      <HvTabs
        variant="fullWidth"
        value={tab}
        onChange={(_, value) => {
          const newParams = new URLSearchParams(searchParams?.toString());
          newParams.set("tab", value);
          router.push(`${pathname}?${newParams}`);
        }}
        className="mt-sm mb-md w-360px"
      >
        <HvTab value="usage" label="Usage" />
        <HvTab value="props" label="Props" />
        <HvTab value="classes" label="Classes" />
      </HvTabs>
      <div className="mb-lg" data-tab={tab}>
        {tab === "usage" && playgroundProps && (
          <Playground {...playgroundProps} />
        )}
        {tab === "props" && <Props meta={meta} />}
        {tab === "classes" && <Classes meta={meta} />}
      </div>
    </>
  );
}
