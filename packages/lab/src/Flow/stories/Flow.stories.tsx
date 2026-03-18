import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvFlow,
  HvFlowBackground,
  HvFlowControls,
  HvFlowMinimap,
  HvFlowProps,
  HvFlowSidebar,
} from "@hitachivantara/uikit-react-lab";
import { HvVizProvider } from "@hitachivantara/uikit-react-viz";

import { BaseHook as BaseHookStory } from "./BaseHook";
import { CustomDrop as CustomDropStory } from "./CustomDrop";
import { Dynamic as DynamicStory } from "./Dynamic";
import { DynamicHandles as DynamicHandlesStory } from "./DynamicHandles";
import { InitialState as InitialStateStory } from "./InitialState";
import { Main as MainStory } from "./Main";
import { NoGroups as NoGroupStory } from "./NoGroups";
import { SubFlow as SubFlowStory } from "./SubFlow";
import { Visualizations as VisualizationsStory } from "./Visualizations";

const meta: Meta<typeof HvFlow> = {
  title: "Lab/Flow",
  component: HvFlow,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: {
    HvFlowBackground,
    HvFlowControls,
    HvFlowMinimap,
    HvFlowSidebar,
  } as unknown,
  parameters: {
    a11y: {
      config: {
        rules: [{ id: "nested-interactive", enabled: false }],
      },
    },
  },
  decorators: [(Story) => <HvVizProvider>{Story()}</HvVizProvider>],
};
export default meta;

export const Main: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {},
    ...setupChromatic("next"),
  },
  play: async ({ canvas, userEvent, step }) => {
    await step("opens sidebar and displays node groups", async () => {
      await userEvent.click(canvas.getByRole("button", { name: /add node/i }));
      await userEvent.click(
        canvas.getAllByRole("button", { name: /expand group/i })[0],
      );
      await expect(
        canvas.getByRole("searchbox", { name: /search node/i }),
      ).toBeInTheDocument();
    });

    await step("should allow to drag node to canvas", async () => {
      await userEvent.click(
        canvas.getAllByRole("button", { name: /expand group/i })[1],
      );

      // Select ML Model node
      const mlModelButton = canvas.getByRole("button", {
        name: "ML Model Prediction",
      });
      expect(mlModelButton).toBeInTheDocument();

      await userEvent.click(mlModelButton);
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard("{ArrowLeft}".repeat(20));
      await userEvent.keyboard("{Enter}");
    });
  },
  render: () => <MainStory />,
};

export const InitialState: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story: "A Flow with an initial state",
      },
    },
    ...setupChromatic("next"),
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("should render nodes and edges from initial state", async () => {
      await waitFor(
        () => {
          // Check for nodes
          const nodes = canvas.getAllByRole("button");
          expect(nodes.length).toBeGreaterThan(0);

          // Should have edges/connections
          const edges = canvas.queryAllByRole("button", { name: /Edge/ });
          expect(edges.length).toBeGreaterThan(0);
        },
        { timeout: 2000 },
      );
    });

    await step("should not show empty state", async () => {
      const emptyMessage = canvas.queryByText("Empty Flow");
      expect(emptyMessage).not.toBeInTheDocument();
    });
  },
  render: () => <InitialStateStory />,
};

export const Visualizations: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story: `The HvFlowNode component can take any content as children. In this sample, we created visualizations based on the JSON output of the first node.
        <br /><br />Please refer to the [code samples](https://github.com/pentaho/hv-uikit-react/blob/master/packages/lab/src/components/Flow/stories/Visualizations/Visualizations.tsx) in our repository for more details.`,
      },
    },
  },
  play: async ({ canvas, userEvent, step }) => {
    await step("should allow deleting a connection", async () => {
      const initialEdges = canvas.getAllByRole("button", { name: /Edge from/ });

      // Click on the specific edge
      const edgeToDelete = canvas.getByRole("button", {
        name: "Edge from jsonInput to lineChart",
      });
      await userEvent.click(edgeToDelete);

      // Delete with keyboard
      await userEvent.keyboard("{Backspace}");

      // Wait for update
      await waitFor(
        () => {
          const edges = canvas.queryAllByRole("button", { name: /Edge from/ });
          expect(edges.length).toBeLessThan(initialEdges.length);
        },
        { timeout: 2000 },
      );
    });

    await step(
      "interactive button should be present and toggleable",
      async () => {
        const interactiveBtn = canvas.getByRole("button", {
          name: "Interactive",
        });
        expect(interactiveBtn).toBeInTheDocument();
        expect(
          interactiveBtn.querySelector("[data-name=Unlock]"),
        ).toBeVisible();

        await userEvent.click(interactiveBtn);
        expect(interactiveBtn.querySelector("[data-name=Lock]")).toBeVisible();
      },
    );

    await step("connection count respects maximum limit", async () => {
      // After deletion, count should be one less
      const edges = canvas.getAllByRole("button", { name: /Edge from/ });
      expect(edges.length).toBe(3);
    });
  },
  render: () => <VisualizationsStory />,
};

export const DynamicNodes: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {},
  },
  render: () => <DynamicStory />,
};

export const CustomDrop: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "If necessary, the drop event can be customized through the `onDndDrop` property. This callback is used to override the custom UI Kit drop event. Thus, when defined, you are responsible for adding nodes to the flow. In this sample, the drop event was overridden to show a dialog to configure the node.",
      },
    },
  },
  render: () => <CustomDropStory />,
};

export const NoGroups: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "You don't need to use groups. If you don't use them, the sidebar will show a list of nodes.",
      },
    },
  },
  render: () => <NoGroupStory />,
};

export const DynamicHandles: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "In this sample nodes' inputs and outputs are dynamically generated.",
      },
    },
  },
  render: () => <DynamicHandlesStory />,
};

export const BaseHook: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "This sample demonstrate the use of the `useHvNode` hook to create a node with a custom look and feel",
      },
    },
  },
  render: () => <BaseHookStory />,
};

export const SubFlow: StoryObj<HvFlowProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "This sample demonstrate the use of a sub flow to create groups of nodes. Drag the node to the group node to add it, drag out of it to remove it.",
      },
    },
  },
  render: () => <SubFlowStory />,
};
