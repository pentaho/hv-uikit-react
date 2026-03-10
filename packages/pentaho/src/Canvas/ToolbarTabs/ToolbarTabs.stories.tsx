import type { Meta, StoryObj } from "@storybook/react-vite";
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
    icon: (
      // Only for testing purposes
      <Leaf data-testid="leaf" />
    ),
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
  render: (args) => {
    return <HvCanvasToolbarTabs {...args} />;
  },
};

export const Controlled: StoryObj<HvCanvasToolbarTabsProps> = {
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
