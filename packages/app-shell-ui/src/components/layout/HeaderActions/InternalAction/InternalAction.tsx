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
import { lazy, memo, Suspense } from "react";
import type {
  HvAppShellAppSwitcherConfig,
  HvAppShellHelp,
} from "@hitachivantara/app-shell-shared";

export const internalActions = [
  {
    bundle: "@hv/theming-client/colorModeSwitcher.js",
    component: () =>
      import("../ColorModeSwitcher").then((module) => ({
        default: module.default as React.ComponentType<Record<string, unknown>>,
      })),
  },
  {
    bundle: "@hv/help-client/button.js",
    component: () =>
      import("../HelpButton/HelpButton").then((module) => ({
        default: module.default as React.ComponentType<HvAppShellHelp>,
      })),
  },
  {
    bundle: "@hv/app-switcher-client/toggle.js",
    component: () =>
      import("../AppSwitcherToggle/AppSwitcherToggle").then((module) => ({
        default:
          module.default as React.ComponentType<HvAppShellAppSwitcherConfig>,
      })),
  },
];

export interface InternalActionProps {
  bundle: string;
}

const InternalAction = ({ bundle, ...others }: InternalActionProps) => {
  const { component } =
    internalActions.find(
      (internalAction) => internalAction.bundle === bundle,
    ) ?? {};

  if (!component) {
    return null;
  }

  const Action = lazy(
    () =>
      component() as Promise<{
        default:
          | React.ComponentType<Record<string, unknown>>
          | React.ComponentType<HvAppShellHelp>
          | React.ComponentType<HvAppShellAppSwitcherConfig>;
      }>,
  );

  return (
    <Suspense fallback={null}>
      <Action {...others} />
    </Suspense>
  );
};

export default memo(InternalAction);
