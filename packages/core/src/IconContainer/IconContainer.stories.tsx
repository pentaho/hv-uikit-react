import { UserIcon as User } from "@phosphor-icons/react/User";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvIconContainer,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { User as HvUser } from "@hitachivantara/uikit-react-icons";

const meta: Meta<typeof HvIconContainer> = {
  title: "Components/Icon Container",
  component: HvIconContainer,
};
export default meta;

export const Main: StoryObj<typeof HvIconContainer> = {
  args: {
    color: "primary",
    size: "md",
    rotate: false,
  },
  render: (args) => (
    <HvIconContainer {...args}>
      <User />
    </HvIconContainer>
  ),
};

export const Variants: StoryObj<typeof HvIconContainer> = {
  args: {
    color: "warning",
    rotate: false,
  },
  parameters: {
    ...setupChromatic("Pentaho dark"),
  },
  render: (args) => {
    return (
      <div className="grid gap-xs">
        <HvTypography variant="title3">Phosphor Icons</HvTypography>
        <div className="flex gap-xs items-center">
          <HvIconContainer {...args} size="xs">
            <User />
          </HvIconContainer>
          <HvIconContainer {...args} size="sm">
            <User />
          </HvIconContainer>
          <HvIconContainer {...args} size="md">
            <User />
          </HvIconContainer>
          <HvIconContainer {...args} size="lg">
            <User />
          </HvIconContainer>
          <HvIconContainer {...args} size="xl">
            <User />
          </HvIconContainer>
          <HvIconContainer {...args} size={100}>
            <User />
          </HvIconContainer>
        </div>
        <HvTypography variant="title3">NEXT Icons</HvTypography>
        <div className="flex gap-xs items-center">
          <HvUser {...args} size="xs" />
          <HvUser {...args} size="sm" />
          <HvUser {...args} size="md" />
          <HvUser {...args} size="lg" />
          <HvUser {...args} size="xl" />
          <HvUser {...args} size={100} />
        </div>
      </div>
    );
  },
};
