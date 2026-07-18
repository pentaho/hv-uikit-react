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
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { HvSnackbarProvider } from "@hitachivantara/uikit-react-core";

import { SnackbarProviderButtons } from "./stories/SnackbarProviderButtons";

export default {
  title: "Components/Snackbar Provider",
} as Meta<typeof HvSnackbarProvider>;

export const Provider: StoryObj = {
  render: () => <SnackbarProviderButtons />,
};
