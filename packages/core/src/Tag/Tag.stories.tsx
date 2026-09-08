import { css } from "@emotion/css";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvTag, theme, type HvTagProps } from "@pentaho/uikit-react-core";
import { Abacus } from "@pentaho/uikit-react-icons";

const meta: Meta<typeof HvTag> = {
  title: "Components/Tag",
  component: HvTag,
  decorators: [
    (Story) => <div style={{ display: "flex", gap: 20 }}>{Story()}</div>,
  ],
};
export default meta;

export const Main: StoryObj<HvTagProps> = {
  args: {
    label: "Tag Label",
    type: "semantic",
    color: "positive",
    disabled: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    deleteIcon: { control: { disable: true } },
    deleteButtonProps: { control: { disable: true } },
    type: { control: { type: "radio" }, options: ["semantic", "categorical"] },
  },
  render: (args) => {
    return <HvTag {...args} />;
  },
};

export const Test: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-xs">
      <HvTag label="Informational" />
      <HvTag label="Informational" disabled />
      <HvTag label="This is a very very very very very very very very long text for a tag" />
      <HvTag color="positive" label="Success" />
      <HvTag color="warning" label="Warning" />
      <HvTag color="negative" label="Error" />
      <HvTag label="Success" color="positive" onDelete={() => {}} />
      <HvTag label="Feat" type="categorical" />
      <HvTag label="Feat" type="categorical" disabled />
      <HvTag label="Docs" type="categorical" color="cat2" />
      <HvTag label="Asset 1" selectable color="cat1" />
      <HvTag
        label="Asset 2"
        selectable
        selected
        color="negative"
        classes={{ root: css({ color: theme.colors.negativeDimmed }) }}
      />
      <HvTag label="default" />
      <HvTag selectable label="selectable" />
      <HvTag selectable size="sm" label="positive" color="positive" />
      <HvTag selectable size="sm" label="warning" color="warning" />
      <HvTag selectable size="sm" label="negative" color="negative" />
      <HvTag selectable size="sm" label="info" color="info" />
      <HvTag selectable size="sm" label="info" color="info" disabled />
      <HvTag selectable showSelectIcon size="sm" label="Select" />
      <HvTag selectable showSelectIcon size="sm" label="Select" disabled />
      <HvTag
        selectable
        size="sm"
        label="Tag"
        showSelectIcon={false}
        icon={<Abacus size="xs" className="size-12px" />}
        onDelete={() => {}}
      />
      <HvTag
        disabled
        selectable
        size="sm"
        label="Tag"
        showSelectIcon={false}
        icon={<Abacus size="xs" className="size-12px" />}
        onDelete={() => {}}
      />
      <HvTag selectable size="md" label="orange" color="orange" />
      <HvTag selectable size="md" label="lime" color="lime" />
      <HvTag selectable size="md" label="yellow" color="yellow" />
      <HvTag selectable size="md" label="green" color="green" />
      <HvTag selectable size="md" label="teal" color="teal" />
      <HvTag selectable size="md" label="cyan" color="cyan" />
      <HvTag selectable size="md" label="blue" color="blue" />
      <HvTag selectable size="md" label="indigo" color="indigo" />
      <HvTag selectable size="md" label="violet" color="violet" />
      <HvTag selectable size="md" label="purple" color="purple" />
      <HvTag selectable size="md" label="fuchsia" color="fuchsia" />
      <HvTag selectable size="md" label="pink" color="pink" />
      <HvTag selectable size="md" label="rose" color="rose" />
      <HvTag selectable size="md" label="rebeccapurple" color="rebeccapurple" />
    </div>
  ),
};
