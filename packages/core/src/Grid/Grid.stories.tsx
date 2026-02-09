import styled from "@emotion/styled";
import {
  HvGrid,
  HvTypography,
  theme,
  useWidth,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Grid",
  component: HvGrid,
});

const StyledItem = styled("div", { label: "StyledItem" })({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 100,
  color: theme.colors.textDark,
  backgroundColor: theme.colors.infoDimmed,
});

export const Main = meta.story({
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
          <HvGrid item xl={2} lg={3} md={4} sm={6} xs={12}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={2} lg={3} md={4} sm={6} xs={12}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={2} lg={3} md={4} sm={6} xs={12}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={2} lg={3} md={4} sm={6} xs={12}>
            <StyledItem>xl=2 lg=3 md=4 sm=6 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={1} lg={2} md={3} xs={12}>
            <StyledItem>xl=6 lg=4 md=3 sm=2 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={1} lg={2} md={3} xs={12}>
            <StyledItem>xl=6 lg=4 md=3 sm=2 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={1} lg={2} md={3} xs={12}>
            <StyledItem>xl=6 lg=4 md=3 sm=2 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={3} lg={3} md={6} sm={12} xs={12}>
            <StyledItem>xl=6 lg=6 md=3 sm=2 xs=1</StyledItem>
          </HvGrid>
          <HvGrid item xl={3} lg={3} md={6} sm={12} xs={12}>
            <StyledItem>xl=6 lg=4 md=3 sm=2 xs=1</StyledItem>
          </HvGrid>
        </HvGrid>
      </>
    );
  },
});

const BREAKPOINT_GUTTERS = {
  xs: "15px",
  sm: "15px",
  md: "30px",
  lg: "30px",
  xl: "30px",
};

export const The12Columns = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Grid using the default 12 columns. You can resize the browser to see the gutters' size change.",
      },
    },
  },
  render: () => {
    const width = useWidth();

    const columns = Array.from({ length: 24 }, (_, index) => index + 1);

    return (
      <>
        <HvTypography variant="label">{`Current width: ${width} (gutter size: ${BREAKPOINT_GUTTERS[width]})`}</HvTypography>
        <HvGrid container>
          {columns.map((value) => (
            <HvGrid key={value} item xs={1}>
              <StyledItem>{value.toString()}</StyledItem>
            </HvGrid>
          ))}
        </HvGrid>
      </>
    );
  },
});

const BREAKPOINT_COLUMNS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 12,
  xl: 12,
};

export const TheDesignSystemColumns = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Grid using the Design System's column definitions. The number of columns is based on the current breakpoint. Resize the browser to see the number of columns change.",
      },
    },
  },
  render: () => {
    const width = useWidth();

    const columns = Array.from({ length: 24 }, (_, index) => index + 1);

    return (
      <div>
        <HvTypography variant="label">{`Current width: ${width} (${BREAKPOINT_COLUMNS[width]} columns)`}</HvTypography>
        <HvGrid container columns="auto">
          {columns.map((value) => (
            <HvGrid key={value} item xs={1}>
              <StyledItem>{value.toString()}</StyledItem>
            </HvGrid>
          ))}
        </HvGrid>
      </div>
    );
  },
});
