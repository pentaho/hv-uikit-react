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
import type { Decorator } from "@storybook/react-vite";
import { HvPanel } from "@hitachivantara/uikit-react-core";
import { HvVizProvider } from "@hitachivantara/uikit-react-viz";

export const vizDecorator: Decorator = (Story) => (
  <HvVizProvider>
    <HvPanel className="flex flex-col" style={{ height: 500 }}>
      {Story()}
    </HvPanel>
  </HvVizProvider>
);
