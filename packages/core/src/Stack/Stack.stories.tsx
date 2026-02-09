import styled from "@emotion/styled";
import {
  HvActionBar,
  HvButton,
  HvCard,
  HvCardContent,
  HvCardHeader,
  HvPanel,
  HvStack,
  HvToggleButton,
  HvTypography,
  theme,
  useWidth,
} from "@hitachivantara/uikit-react-core";
import {
  Favorite,
  FavoriteSelected,
  Tool,
} from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const Box = styled(HvPanel)({
  display: "grid",
  placeItems: "center",
  borderWidth: 1,
  width: 150,
  height: 50,
});

const meta = preview.meta({
  title: "Components/Stack",
  component: HvStack,
});

export const Main = meta.story({
  args: {
    divider: true,
    direction: "row",
    spacing: "sm",
  },
  argTypes: {
    classes: { control: { disable: true } },
    dividerProps: { control: { disable: true } },
    direction: { control: { type: "radio" }, options: ["column", "row"] },
    spacing: {
      control: { type: "radio" },
      options: ["xs", "sm", "md", "lg", "xl"],
    },
  },
  decorators: [
    (Story, { args }) => (
      <div style={{ width: args.direction === "column" ? 150 : "100%" }}>
        {Story()}
      </div>
    ),
  ],
  render: (args) => {
    return (
      <HvStack {...args}>
        <Box>1</Box>
        <Box>2</Box>
        <Box>3</Box>
        <Box>4</Box>
      </HvStack>
    );
  },
});

export const Spacing = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "This example illustrates how to configure the Stack to display vertically or horizontally depending on the screen width. In this case, for `xs` and `sm` widths the Stack will be vertical and for `md`, `lg` and `xl` it will be organized horizontally in a row.",
      },
    },
  },
  render: () => {
    const width = useWidth();
    return (
      <>
        <br />
        <div style={{ display: "flex", flexDirection: "row" }}>
          <HvTypography variant="label">Current width:</HvTypography>
          <HvTypography>{width}</HvTypography>
        </div>
        <br />
        <div>
          <HvStack
            direction={{ xs: "column", md: "row" }}
            spacing="xs"
            divider={false}
          >
            <Box>1</Box>
            <Box>2</Box>
            <Box>3</Box>
            <Box>4</Box>
          </HvStack>
        </div>
      </>
    );
  },
});

export const WithNavigation = meta.story({
  decorators: [(Story) => <div style={{ overflow: "auto" }}>{Story()}</div>],
  parameters: {
    docs: {
      description: {
        story:
          "When the stack elements are interactive navigation can be achieved by tabbing into the first element of the stack and using the arrow keys to jump between elements.",
      },
    },
  },
  render: () => {
    return (
      <HvStack
        withNavigation
        direction={{ xs: "column", md: "row" }}
        divider={false}
        dividerProps={{ variant: "middle", light: true }}
      >
        <HvCard
          bgcolor="bgContainer"
          statusColor="negative"
          style={{ width: 275 }}
        >
          <HvCardHeader title="Card 1" icon={<Tool />} />
          <HvCardContent>
            <div style={{ marginTop: "20px" }}>
              <HvTypography variant="label">Last connected</HvTypography>
              <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
            </div>
          </HvCardContent>
          <HvActionBar>
            <div style={{ width: 32, height: 32 }}>
              <HvToggleButton
                aria-label="Star"
                selectedIcon={<FavoriteSelected />}
                notSelectedIcon={<Favorite />}
              />
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <HvButton variant="secondaryGhost">View</HvButton>
            </div>
            <div style={{ flex: 1 }} />
          </HvActionBar>
        </HvCard>
        <HvCard
          bgcolor="bgContainer"
          statusColor="positive"
          style={{ width: 275 }}
        >
          <HvCardHeader title="Card 2" icon={<Tool />} />
          <HvCardContent>
            <div style={{ marginTop: "20px" }}>
              <HvTypography variant="label">Last connected</HvTypography>
              <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
            </div>
          </HvCardContent>
          <HvActionBar>
            <div style={{ width: 32, height: 32 }}>
              <HvToggleButton
                aria-label="Star"
                selectedIcon={<FavoriteSelected />}
                notSelectedIcon={<Favorite />}
              />
            </div>
            <div style={{ width: 32, height: 32 }}>
              <HvButton variant="secondaryGhost">View</HvButton>
            </div>
            <div style={{ flex: 1 }} />
          </HvActionBar>
        </HvCard>
        <HvCard bgcolor="bgContainer" statusColor="info" style={{ width: 275 }}>
          <HvCardHeader title="Card 3" icon={<Tool />} />
          <HvCardContent>
            <div style={{ marginTop: "20px" }}>
              <HvTypography variant="label">Last connected</HvTypography>
              <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
            </div>
          </HvCardContent>
          <HvActionBar>
            <div style={{ width: 32, height: 32 }}>
              <HvToggleButton
                aria-label="Star"
                selectedIcon={<FavoriteSelected />}
                notSelectedIcon={<Favorite />}
              />
            </div>
            <div style={{ width: 32, height: 32 }}>
              <HvButton variant="secondaryGhost">View</HvButton>
            </div>
            <div style={{ flex: 1 }} />
          </HvActionBar>
        </HvCard>
        <HvCard
          bgcolor="bgContainer"
          statusColor="infoDimmed"
          style={{ width: 275 }}
        >
          <HvCardHeader title="Card 4" icon={<Tool />} />
          <HvCardContent>
            <div style={{ marginTop: "20px" }}>
              <HvTypography variant="label">Last connected</HvTypography>
              <HvTypography>Aug 30, 2017 12:27:53 PM</HvTypography>
            </div>
          </HvCardContent>
          <HvActionBar>
            <div style={{ width: 32, height: 32 }}>
              <HvButton variant="secondaryGhost">View</HvButton>
            </div>
            <div style={{ flex: 1 }} />
          </HvActionBar>
        </HvCard>
      </HvStack>
    );
  },
});

export const Test = meta.story({
  render: () => (
    <>
      <div style={{ display: "flex", gap: theme.space.sm }}>
        <HvStack>
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
        <HvStack spacing="md">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
        <HvStack divider>
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
        <HvStack divider spacing="md">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: theme.space.sm,
        }}
      >
        <HvStack divider direction="row">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
        <HvStack direction="row">
          <Box>1</Box>
          <Box>2</Box>
          <Box>3</Box>
          <Box>4</Box>
        </HvStack>
      </div>
    </>
  ),
});
