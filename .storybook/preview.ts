import type { Preview } from "@storybook/react-vite";
import type { Viewport } from "storybook/viewport";

import DocsContainer from "./blocks/DocsContainer";
import { DocsPage } from "./blocks/DocsPage";
import { withThemeDecorator } from "./decorators/withThemeDecorator.decorator";

import "uno.css";

export const parameters: Preview["parameters"] = {
  layout: "fullscreen",
  docs: {
    source: { type: "dynamic" },
    container: DocsContainer,
    page: DocsPage,
  },
  controls: {},
  options: {
    storySort: {
      order: ["Tests", "Components", "Visualizations"],
    },
  },
  a11y: {
    test: "error",
    options: {
      rules: {
        // Disable color contrast rule
        "color-contrast": { enabled: false },
        // Disabled because tests have repeated components (eg. `HvHeader`)
        "landmark-unique": { enabled: false },
        "landmark-no-duplicate-banner": { enabled: false },
      },
    },
  },
  // Disables Chromatic's snapshotting on a global level
  // Snapshots are to be enabled individually at the component or story level
  chromatic: {
    disableSnapshot: true,
  },
  // Chromatic default viewport
  viewport: {
    options: {
      desktop: {
        name: "desktop",
        type: "desktop",
        styles: {
          height: "1080px",
          width: "1920px",
        },
      },
    } satisfies Record<string, Viewport>,
  },
};

export default {
  parameters,
  decorators: [withThemeDecorator()],
  tags: ["autodocs"],
  initialGlobals: {
    viewport: { value: "desktop", isRotated: false },
  },
} satisfies Preview;
