import type { Decorator } from "@storybook/react-vite";
import { HvPanel } from "@pentaho/uikit-react-core";
import { HvVizProvider } from "@pentaho/uikit-react-viz";

export const vizDecorator: Decorator = (Story) => (
  <HvVizProvider>
    <HvPanel className="flex flex-col" style={{ height: 500 }}>
      {Story()}
    </HvPanel>
  </HvVizProvider>
);
