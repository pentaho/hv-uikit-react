import "uno.css";

import type { Preview } from "@storybook/react-vite";
import type { Viewport } from "storybook/viewport";
import { theme, type HvColor } from "@hitachivantara/uikit-styles";

import DocsContainer from "./blocks/DocsContainer";
import { DocsPage } from "./blocks/DocsPage";
import { getInitialMode } from "./decorators/utils";
import { withThemeDecorator } from "./decorators/withThemeDecorator.decorator";

const backgrounds: HvColor[] = ["bgPage", "bgContainer", "bgPageSecondary"];

export const parameters: Preview["parameters"] = {
  layout: "fullscreen",
  docs: {
    source: { type: "dynamic" },
    container: DocsContainer,
    page: DocsPage,
  },
  backgrounds: {
    options: Object.fromEntries(
      backgrounds.map((bg) => [bg, { name: bg, value: theme.colors[bg] }]),
    ),
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
  viewport: {
    options: {
      xs: {
        name: "mobile",
        type: "mobile",
        styles: { height: "768px", width: "480px" },
      },
      split: {
        name: "split",
        type: "desktop",
        styles: { height: "1080px", width: "960px" },
      },
      desktop: {
        name: "desktop",
        type: "desktop",
        styles: { height: "1080px", width: "1920px" },
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
    theme: `pentaho ${getInitialMode()}`,
  },
} satisfies Preview;
