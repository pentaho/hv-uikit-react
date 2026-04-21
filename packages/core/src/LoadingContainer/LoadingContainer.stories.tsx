import type { Meta, StoryObj } from "@storybook/react-vite";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvListContainer,
  HvListItem,
  HvLoadingContainer,
  HvPanel,
  type HvLoadingContainerProps,
} from "@hitachivantara/uikit-react-core";

export default {
  title: "Components/Loading Container",
  component: HvLoadingContainer,
} satisfies Meta<typeof HvLoadingContainer>;

export const Main: StoryObj<HvLoadingContainerProps> = {
  args: {
    label: "Loading",
    opacity: 0.8,
    hidden: false,
    small: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  parameters: {
    ...setupChromatic(),
  },
  render: (args) => (
    <HvLoadingContainer className="inline-flex" {...args}>
      <HvPanel className="w-300px">
        <HvListContainer>
          {[...Array(4).keys()].map((i) => (
            <HvListItem key={i}>Item {i + 1}</HvListItem>
          ))}
        </HvListContainer>
      </HvPanel>
    </HvLoadingContainer>
  ),
};
