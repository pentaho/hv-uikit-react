import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvButton,
  HvContainer,
  HvDropDownMenu,
  HvGlobalActions,
  HvTypography,
  type HvGlobalActionsProps,
} from "@pentaho/uikit-react-core";
import { Backwards } from "@pentaho/uikit-react-icons";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus faucibus ornare suspendisse sed nisi lacus sed. Tortor at risus viverra adipiscing at in tellus. Et netus et malesuada fames ac turpis. Sed blandit libero volutpat sed cras ornare arcu. Arcu odio ut sem nulla pharetra diam sit amet. Sagittis purus sit amet volutpat consequat mauris nunc congue. Sed vulputate mi sit amet mauris commodo quis imperdiet massa. Dictum varius duis at consectetur. Lorem sed risus ultricies tristique nulla aliquet enim tortor at. Turpis egestas maecenas pharetra convallis posuere morbi. Eget sit amet tellus cras adipiscing. Egestas erat imperdiet sed euismod nisi. Morbi tincidunt augue interdum velit euismod in pellentesque massa. At augue eget arcu dictum varius duis at. Tellus elementum sagittis vitae et. In est ante in nibh mauris cursus mattis. Faucibus nisl tincidunt eget nullam non. Cursus metus aliquam eleifend mi in nulla posuere.";

const meta: Meta<typeof HvGlobalActions> = {
  title: "Components/Global Actions",
  component: HvGlobalActions,
  decorators: [
    (Story) => (
      <HvContainer className="max-h-400px overflow-auto" maxWidth="md">
        {Story()}
      </HvContainer>
    ),
  ],
};
export default meta;

export const Main: StoryObj<HvGlobalActionsProps> = {
  args: {
    title: "Details Page Title",
    headingLevel: 1,
    variant: "global",
    position: "sticky",
  },
  argTypes: {
    classes: { control: { disable: true } },
    backButton: { control: { disable: true } },
  },
  render: (args) => {
    const backButton = (
      <HvButton aria-label="Back" icon>
        <Backwards />
      </HvButton>
    );

    return (
      <>
        <HvGlobalActions backButton={backButton} {...args}>
          <HvButton variant="primary">Approve & Share</HvButton>
          <HvButton variant="secondarySubtle">Reset</HvButton>
          <HvDropDownMenu
            placement="left"
            dataList={[
              { label: "Action 2" },
              { label: "Action 3" },
              { label: "Action 4" },
            ]}
          />
        </HvGlobalActions>

        <br />

        <HvTypography style={{ marginBottom: 60 }}>{lorem}</HvTypography>

        <HvGlobalActions title="Section Title" variant="section">
          <HvButton variant="secondarySubtle">Remove</HvButton>
          <HvButton variant="secondarySubtle">Share</HvButton>
          <HvDropDownMenu
            placement="left"
            dataList={[
              { label: "Action 2" },
              { label: "Action 3" },
              { label: "Action 4" },
            ]}
          />
        </HvGlobalActions>

        <HvTypography style={{ marginTop: 20, marginBottom: 30 }}>
          {lorem}
        </HvTypography>

        <HvTypography style={{ marginBottom: 60 }}>{lorem}</HvTypography>

        <HvGlobalActions title="Section Title" variant="section">
          <HvButton variant="secondarySubtle">Remove</HvButton>
          <HvButton variant="secondarySubtle">Share</HvButton>
          <HvDropDownMenu
            placement="left"
            dataList={[
              { label: "Action 2" },
              { label: "Action 3" },
              { label: "Action 4" },
            ]}
          />
        </HvGlobalActions>

        <HvTypography style={{ marginTop: 20, marginBottom: 30 }}>
          {lorem}
        </HvTypography>

        <HvTypography style={{ paddingBottom: 60 }}>{lorem}</HvTypography>
      </>
    );
  },
};

export const Test: StoryObj<HvGlobalActionsProps> = {
  render: () => {
    const backButton = (
      <HvButton aria-label="Back" icon>
        <Backwards />
      </HvButton>
    );

    return (
      <>
        <HvGlobalActions title="Title">
          <HvButton variant="primary">Click</HvButton>
        </HvGlobalActions>
        <HvGlobalActions title="Title" variant="section">
          <HvButton variant="primary">Click</HvButton>
        </HvGlobalActions>
        <HvGlobalActions title="Title" backButton={backButton}>
          <HvButton variant="primary">Click</HvButton>
        </HvGlobalActions>
      </>
    );
  },
};
