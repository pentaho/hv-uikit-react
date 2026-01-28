import { setupChromatic } from "@hitachivantara/internal";
import {
  HvListContainer,
  HvListItem,
  HvLoadingContainer,
  HvPanel,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Loading Container",
  component: HvLoadingContainer,
});

export const Main = meta.story({
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
});
