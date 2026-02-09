import { css } from "@emotion/css";
import { HvTag, theme } from "@hitachivantara/uikit-react-core";
import { Abacus } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Tag",
  component: HvTag,
  decorators: [
    (Story) => <div style={{ display: "flex", gap: 20 }}>{Story()}</div>,
  ],
});

export const Main = meta.story({
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
});

export const Variants = meta.story({
  decorators: [
    (Story) => <div className="grid grid-cols-6 gap-sm">{Story()}</div>,
  ],
  render: () => {
    return (
      <>
        <HvTag label="Informational" />
        <HvTag label="Success" color="positive_20" />
        <HvTag label="Warning" color="warning_20" />
        <HvTag label="Error" color="negative_20" />
        <HvTag label="Custom" color="#22FF45" />
        <HvTag label="Disabled" disabled />
        <HvTag label="Categorical" type="categorical" />
        <HvTag label="Docs" type="categorical" color="cat2" />
        <HvTag label="Fix" type="categorical" color="cat3" />
        <HvTag label="Deprecated" type="categorical" color="cat5" />
        <HvTag label="Custom" type="categorical" color="#22FF45" />
        <HvTag label="Disabled" type="categorical" disabled />
      </>
    );
  },
});

export const WithActions = meta.story({
  render: () => {
    return (
      <>
        <HvTag label="Click me!" onClick={() => alert("Clicked!")} />
        <HvTag label="Delete me!" onDelete={() => alert("Deleted!")} />
      </>
    );
  },
});

export const Test = meta.story({
  render: () => (
    <div className="flex flex-wrap gap-xs">
      <HvTag label="Informational" />
      <HvTag label="Informational" disabled />
      <HvTag label="This is a very very very very very very very very long text for a tag" />
      <HvTag color="positive_20" label="Success" />
      <HvTag color="warning_20" label="Warning" />
      <HvTag color="negative_20" label="Error" />
      <HvTag label="Success" color="positive_20" onDelete={() => {}} />
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
});
