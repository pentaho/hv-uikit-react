import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Leaf } from "@hitachivantara/uikit-react-icons";
import {
  HvCanvasToolbarTabs,
  HvCanvasToolbarTabsProps,
} from "@hitachivantara/uikit-react-pentaho";

import { ControlledStory } from "./stories/Controlled";

const meta: Meta<typeof HvCanvasToolbarTabs> = {
  title: "Pentaho/Canvas/Toolbar Tabs",
  component: HvCanvasToolbarTabs,
};
export default meta;

export const Main: StoryObj<HvCanvasToolbarTabsProps> = {
  args: {
    // Only for testing purposes
    icon: <Leaf data-testid="leaf" />,
    defaultTabs: [
      { id: "tab1", label: "My first tab", icon: <Leaf /> },
      { id: "tab2", label: "My tab with a very long label", icon: <Leaf /> },
    ],
  },
  argTypes: {
    tabs: { control: { disable: true } },
    defaultTabs: { control: { disable: true } },
    selectedTabId: { control: { disable: true } },
    labels: { control: { disable: true } },
    icon: { control: { disable: true } },
    classes: { control: { disable: true } },
    onTabChange: { control: { disable: true } },
    onChange: { control: { disable: true } },
  },
  play: async ({ canvas, canvasElement, userEvent, step }) => {
    await step("renders all components when there are tabs", async () => {
      expect(canvas.getByRole("button", { name: "Create new" })).toBeVisible();
      expect(canvas.getByRole("tablist")).toBeVisible();
      expect(
        canvas.getByRole("tab", { name: "My first tab", selected: true }),
      ).toBeVisible();
      expect(
        canvas.getByRole("tab", {
          name: "My tab with a very long label",
          selected: false,
        }),
      ).toBeVisible();
      expect(canvas.getAllByRole("tab")).toHaveLength(2);
      expect(
        canvasElement.querySelectorAll("[data-name=CloseXS]"),
      ).toHaveLength(2);
    });

    await step("renames selected tab", async () => {
      expect(
        canvas.getByRole("tab", { name: "My first tab", selected: true }),
      ).toBeInTheDocument();

      const labelEditor = canvas.getByText("My first tab");
      await userEvent.click(labelEditor);
      await userEvent.clear(labelEditor);
      await userEvent.type(labelEditor, "My new label");
      await userEvent.keyboard("{Enter}");

      expect(
        canvas.getByRole("tab", { name: "My new label", selected: true }),
      ).toBeInTheDocument();
    });

    await step("adds tab with icon", async () => {
      const createBtn = canvas.getByRole("button", { name: "Create new" });
      await userEvent.click(createBtn);

      const leaf = canvas.getByTestId("leaf");
      expect(leaf).toBeInTheDocument();
      expect(canvas.getAllByRole("tab")).toHaveLength(3);
    });

    await step("changes selected tab", async () => {
      const secondTab = canvas.getByText("My tab with a very long label");
      await userEvent.click(secondTab);

      const selectedTab = canvas.getByRole("tab", { selected: true });
      expect(selectedTab).toHaveTextContent("My tab with a very long label");
    });

    await step("selects previous tab when tab is closed", async () => {
      const closeBtns = canvasElement.querySelectorAll("[data-name=CloseXS]");
      await userEvent.click(closeBtns[1]); // Close "My tab with a very long label"

      const selectedTab = canvas.getByRole("tab", { selected: true });
      expect(selectedTab).toHaveTextContent("My new label");
    });

    await step("selects next tab when first tab is closed", async () => {
      const closeBtns = canvasElement.querySelectorAll("[data-name=CloseXS]");
      await userEvent.click(closeBtns[0]); // Close first tab

      const selectedTab = canvas.getByRole("tab", { selected: true });
      expect(canvas.getAllByRole("tab")).toHaveLength(1);
      expect(selectedTab).toBeInTheDocument();
    });

    await step("can close remaining tab", async () => {
      const closeBtn = canvasElement.querySelector("[data-name=CloseXS]");
      await userEvent.click(closeBtn!);

      expect(canvas.queryByRole("tab")).not.toBeInTheDocument();
    });

    await step(
      "uses previous value when trying to clear a tab label",
      async () => {
        // Add a new tab first
        const createBtn = canvas.getByRole("button", { name: "Create new" });
        await userEvent.click(createBtn);

        const labelEditor = canvas.getByText(/Undefined/);
        await userEvent.click(labelEditor);
        await userEvent.clear(labelEditor);
        await userEvent.keyboard("{Enter}");

        const selectedTab = canvas.getByRole("tab", { selected: true });
        expect(selectedTab).toHaveTextContent(/Undefined/);
      },
    );

    await step(
      "uses previous value when clicking escape while editing label",
      async () => {
        const labelEditor = canvas.getByText(/Undefined/);
        await userEvent.click(labelEditor);
        await userEvent.type(labelEditor, "123");
        await userEvent.keyboard("{Escape}");

        const selectedTab = canvas.getByRole("tab", { selected: true });
        expect(selectedTab).toHaveTextContent(/Undefined/);
      },
    );
  },
  render: (args) => {
    return <HvCanvasToolbarTabs {...args} />;
  },
};

export const Controlled: StoryObj<HvCanvasToolbarTabsProps> = {
  play: async ({ canvas, userEvent, step }) => {
    await step("renders all components when there are no tabs", async () => {
      const createBtn = canvas.getByRole("button", { name: "Create new" });
      const tabList = canvas.queryByRole("tablist");

      expect(createBtn).toBeInTheDocument();
      expect(tabList).not.toBeInTheDocument();
      expect(canvas.queryByRole("tab")).not.toBeInTheDocument();
    });

    await step("adds and renames tab when controlled", async () => {
      // Add new tab
      const createBtn = canvas.getByRole("button", { name: "Create new" });
      await userEvent.click(createBtn);

      let selectedTab = canvas.getByRole("tab", { selected: true });
      expect(selectedTab).toHaveTextContent(/Undefined/);

      const labelEditor = canvas.getByText(/Undefined/);
      await userEvent.click(labelEditor);
      await userEvent.clear(labelEditor);
      await userEvent.type(labelEditor, "My new label");
      await userEvent.keyboard("{Enter}");

      selectedTab = canvas.getByRole("tab", { selected: true });
      expect(selectedTab).toHaveTextContent("My new label");
    });

    await step(
      "adds tabs and creates dropdown menu when overflowing",
      async () => {
        const createBtn = canvas.getByRole("button", { name: "Create new" });

        // Add second tab
        await userEvent.click(createBtn);
        // Rename it
        let labelEditor = canvas.getByText(/Undefined/);
        await userEvent.click(labelEditor);
        await userEvent.clear(labelEditor);
        await userEvent.type(labelEditor, "Tab 2");
        await userEvent.keyboard("{Enter}");

        // Add third tab
        await userEvent.click(createBtn);
        expect(canvas.getAllByRole("tab")).toHaveLength(3);

        // Add fourth tab (may cause overflow depending on viewport)
        await userEvent.click(createBtn);
        let selectedTab = canvas.getByRole("tab", { selected: true });
        expect(selectedTab).toHaveTextContent(/Undefined/);
      },
    );

    await step("changes selected tab when controlled", async () => {
      const tabs = canvas.getAllByRole("tab");
      await userEvent.click(tabs[0]); // Click first tab

      const selectedTab = canvas.getByRole("tab", { selected: true });
      expect(selectedTab).toHaveTextContent("My new label");
    });

    await step("closes selected tab when controlled", async () => {
      const initialTabCount = canvas.getAllByRole("tab").length;
      const selectedTab = canvas.getByRole("tab", { selected: true });

      await userEvent.click(selectedTab.querySelector("[data-name=CloseXS]")!);
      expect(canvas.getAllByRole("tab")).toHaveLength(initialTabCount - 1);
    });
  },
  render: () => <ControlledStory />,
};

export const NotEditable: StoryObj<HvCanvasToolbarTabsProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "By default all tabs' labels are editable. If this is not desired for your use case, the `disableTabEdit` property should be set to `true`.",
      },
    },
  },
  args: {
    defaultTabs: [
      { id: "tab1", label: "Tab 1", icon: <Leaf /> },
      { id: "tab2", label: "Tab 2", icon: <Leaf /> },
    ],
  },
  render: (args) => (
    <HvCanvasToolbarTabs disableTabEdit icon={<Leaf />} {...args} />
  ),
};

export const NotRemovable: StoryObj<HvCanvasToolbarTabsProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "By default the tabs are removable. If this is not desired for your use case, the `fixed` property should be set to `true` at the tab level. Thus, it's possible to have both removable and not removable tabs. The `hideCreateNew` property also enables you to hide the 'Create new' button if needed.",
      },
    },
  },
  args: {
    defaultTabs: [
      { id: "tab1", label: "Tab 1", fixed: true },
      { id: "tab2", label: "Tab 2" },
    ],
  },
  render: (args) => (
    <HvCanvasToolbarTabs hideCreateNew disableTabEdit {...args} />
  ),
};

// `defaultTabs` passed statically because the icons make storybook freeze
const defaultTabs = [
  { id: "tab1", label: "My tab with a very long label" },
  { id: "tab2", label: "My tab" },
];

const defaultTabs2 = [
  { id: "tab1", label: "My tab with a very long label", fixed: true },
  { id: "tab2", label: "My tab" },
];

const defaultTabs3 = [
  { id: "tab1", label: "My first tab", icon: <Leaf /> },
  { id: "tab2", label: "My tab with a very long label", icon: <Leaf /> },
];

export const Test: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-xs">
      <HvCanvasToolbarTabs />
      <HvCanvasToolbarTabs hideCreateNew />
      <HvCanvasToolbarTabs defaultTabs={defaultTabs} />
      <HvCanvasToolbarTabs hideCreateNew defaultTabs={defaultTabs} />
      <HvCanvasToolbarTabs disableTabEdit defaultTabs={defaultTabs} />
      <HvCanvasToolbarTabs defaultTabs={defaultTabs2} />
      <HvCanvasToolbarTabs defaultTabs={defaultTabs3} />
    </div>
  ),
};
