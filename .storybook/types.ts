import type { A11yParameters } from "@storybook/addon-a11y";
import type { StorybookParameters } from "storybook/internal/types";

interface ChromaticParameters {
  disableSnapshot?: boolean;
  delay?: number;
  modes?: Record<string, any>;
  diffThreshold?: number;
}

interface DocsParameters extends Record<string, any> {
  disable?: boolean;
  description?: { story?: string };
  source?: {
    code?: string;
    type?: "auto" | "code" | "dynamic";
  };
  inlineStories?: boolean;
}

// https://github.com/storybookjs/storybook/issues/22860
declare module "@storybook/react-vite" {
  interface Parameters
    extends StorybookParameters, A11yParameters, Record<string, any> {
    docs?: DocsParameters;
    chromatic?: ChromaticParameters;
  }
}
