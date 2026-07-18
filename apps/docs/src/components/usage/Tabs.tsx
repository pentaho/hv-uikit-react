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

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { HvTab, HvTabs } from "@hitachivantara/uikit-react-core";

import type { ComponentMeta } from "../../utils/component";
import { Playground, type PlaygroundProps } from "../code/Playground";
import { Classes } from "./Classes";
import { Props } from "./Props";

type TabId = "usage" | "props" | "classes";

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

  const tab = (searchParams.get("tab") as TabId) || "usage";

  return (
    <>
      <HvTabs
        variant="fullWidth"
        value={tab}
        onChange={(_, value) => {
          const newParams = new URLSearchParams(searchParams);
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
