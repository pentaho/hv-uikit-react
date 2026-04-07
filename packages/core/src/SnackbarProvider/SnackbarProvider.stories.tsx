import type { Meta, StoryObj } from "@storybook/react-vite";
import type { HvSnackbarProvider } from "@hitachivantara/uikit-react-core";

import { SnackbarProviderButtons } from "./stories/SnackbarProviderButtons";

export default {
  title: "Components/Snackbar Provider",
} as Meta<typeof HvSnackbarProvider>;

export const Provider: StoryObj = {
  render: () => <SnackbarProviderButtons />,
};
