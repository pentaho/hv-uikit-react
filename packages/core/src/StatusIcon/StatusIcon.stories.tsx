import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvStatusIcon,
  type HvStatusIconProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvStatusIcon> = {
  title: "Components/Status Icon",
  component: HvStatusIcon,
};
export default meta;

export const Main: StoryObj<HvStatusIconProps> = {
  args: {
    variant: "info",
    size: "sm",
    type: "full",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
};

export const Test: StoryObj = {
  decorators: [
    (Story) => <div className="flex flex-col gap-xs">{Story()}</div>,
  ],
  render: () => (
    <>
      <div className="flex items-start gap-sm">
        <HvStatusIcon variant="success" />
        <HvStatusIcon variant="warning" />
        <HvStatusIcon variant="error" />
        <HvStatusIcon variant="info" />
        <HvStatusIcon
          variant="accent"
          customIcon={<div className="i-ph-tree-structure" />}
        />
        <HvStatusIcon variant="accent" />
        <HvStatusIcon
          variant="default"
          customIcon={<div className="i-ph-tree-structure" />}
        />
        <HvStatusIcon />
        <HvStatusIcon
          type="full"
          customIcon={<div className="i-ph-tree-structure" />}
          className="text-positive bg-bgContainer outline-positive"
        />
        <HvStatusIcon type="simple" variant="success" />
      </div>
      <div className="flex items-start gap-sm">
        <HvStatusIcon variant="success" size="xs" />
        <HvStatusIcon variant="success" size="sm" />
        <HvStatusIcon variant="success" size="md" />
        <HvStatusIcon variant="success" size="lg" />
        <HvStatusIcon variant="success" size="xl" />
      </div>
      <div className="flex items-center gap-sm">
        <HvStatusIcon weight="regular" variant="success" />
        <HvStatusIcon weight="duotone" variant="success" />
        <HvStatusIcon weight="fill" variant="success" />
        <HvStatusIcon weight="regular" variant="warning" />
        <HvStatusIcon weight="duotone" variant="warning" />
        <HvStatusIcon weight="fill" variant="warning" />
        <HvStatusIcon weight="regular" variant="error" />
        <HvStatusIcon weight="duotone" variant="error" />
        <HvStatusIcon weight="fill" variant="error" />
        <HvStatusIcon weight="regular" variant="info" />
        <HvStatusIcon weight="duotone" variant="info" />
        <HvStatusIcon weight="fill" variant="info" />
      </div>
    </>
  ),
};
