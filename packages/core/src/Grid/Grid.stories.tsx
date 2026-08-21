import styled from "@emotion/styled";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvGrid,
  HvTypography,
  theme,
  useWidth,
  type HvGridProps,
} from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvGrid> = {
  title: "Components/Grid",
  component: HvGrid,
};
export default meta;

const StyledItem = styled("div", { label: "StyledItem" })({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 100,
  color: theme.colors.textDark,
  backgroundColor: theme.colors.infoDimmed,
});

export const Main: StoryObj<HvGridProps> = {
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    const width = useWidth();
    return (
      <>
        <HvTypography variant="label">{`Current width: ${width}`}</HvTypography>
        <br />
        <HvGrid container>
          <HvGrid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 1, lg: 2, md: 3, xs: 12 }}>
            <StyledItem>xl=1 lg=2 md=3 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 1, lg: 2, md: 3, xs: 12 }}>
            <StyledItem>xl=1 lg=2 md=3 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 1, lg: 2, md: 3, xs: 12 }}>
            <StyledItem>xl=1 lg=2 md=3 sm=6 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 3, lg: 3, md: 6, sm: 12, xs: 12 }}>
            <StyledItem>xl=3 lg=3 md=6 sm=12 xs=12</StyledItem>
          </HvGrid>
          <HvGrid size={{ xl: 3, lg: 3, md: 6, sm: 12, xs: 12 }}>
            <StyledItem>xl=3 lg=3 md=6 sm=12 xs=12</StyledItem>
          </HvGrid>
        </HvGrid>
      </>
    );
  },
};
