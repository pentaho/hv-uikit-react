import { useState } from "react";
import { css } from "@emotion/css";
import {
  HvBreadCrumb,
  HvButton,
  HvContainer,
  HvDropDownMenu,
  HvGlobalActions,
  HvTab,
  HvTabs,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";
import { Backwards, Home } from "@hitachivantara/uikit-react-icons";

import preview from "../../../../.storybook/preview";

const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus faucibus ornare suspendisse sed nisi lacus sed. Tortor at risus viverra adipiscing at in tellus. Et netus et malesuada fames ac turpis. Sed blandit libero volutpat sed cras ornare arcu. Arcu odio ut sem nulla pharetra diam sit amet. Sagittis purus sit amet volutpat consequat mauris nunc congue. Sed vulputate mi sit amet mauris commodo quis imperdiet massa. Dictum varius duis at consectetur. Lorem sed risus ultricies tristique nulla aliquet enim tortor at. Turpis egestas maecenas pharetra convallis posuere morbi. Eget sit amet tellus cras adipiscing. Egestas erat imperdiet sed euismod nisi. Morbi tincidunt augue interdum velit euismod in pellentesque massa. At augue eget arcu dictum varius duis at. Tellus elementum sagittis vitae et. In est ante in nibh mauris cursus mattis. Faucibus nisl tincidunt eget nullam non. Cursus metus aliquam eleifend mi in nulla posuere.";

const data = [
  { label: "Label 1", path: "route1" },
  { label: "Label 2", path: "route2" },
  { label: "Label 3", path: "route3" },
  { label: "Label 4", path: "route4" },
  { label: "Label 5", path: "route5" },
];

const meta = preview.meta({
  title: "Components/Global Actions",
  component: HvGlobalActions,
  decorators: [
    (Story) => (
      <HvContainer className="max-h-400px overflow-auto" maxWidth="md">
        {Story()}
      </HvContainer>
    ),
  ],
});

export const Main = meta.story({
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
});

export const GlobalVariant = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "GlobalActions is of variant `global` by default, meaning that an `h1` element will be rendered and it will be sticky by default. Users sure ensure there aren't multiple in the page. <br /> \
          When more than two secondary actions are in place, they should be grouped in a dropdown menu, ordered from the most to least used.",
      },
    },
  },
  render: () => {
    const customTitle = (
      <HvTypography variant="title2" component="h1">
        Detail Page Title
      </HvTypography>
    );

    const backButton = (
      <HvButton aria-label="Back" icon>
        <Backwards />
      </HvButton>
    );

    return (
      <>
        <HvGlobalActions title={customTitle} backButton={backButton}>
          <HvButton variant="primary">Primary</HvButton>
          <HvButton variant="secondarySubtle">Secondary</HvButton>
        </HvGlobalActions>
        <br />
        <HvTypography>{lorem}</HvTypography>
        <br />
        <HvTypography>{lorem}</HvTypography>
      </>
    );
  },
});

export const SectionVariant = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The `section` variant of Global Actions should be used to group related blocks of information. Use with parsimony, you might not need such a clear separator.",
      },
    },
  },
  render: () => {
    const customTitle = (
      <HvTypography variant="title3" component="h2">
        Detail Page Title
      </HvTypography>
    );

    return (
      <>
        <HvGlobalActions variant="section" title={customTitle}>
          <HvButton variant="secondaryGhost">Primary</HvButton>
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
        <HvGlobalActions variant="section" title="Section Title" />
      </>
    );
  },
});

export const CustomContent = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The content of the Global Actions can be customized. This is useful when you want to add different elements other than the title and actions.",
      },
    },
  },
  render: () => {
    const classes = {
      tab: css({ height: 42, ...theme.typography.title4 }),
      wrapper: css({
        display: "flex",
        justifyContent: "space-between",
        height: 48,
      }),
      actions: css({ marginLeft: "unset" }),
      backButton: css({
        display: "flex",
        alignItems: "center",
        gap: theme.space.xs,
      }),
    };

    const [value, setValue] = useState(0);

    const customTitle = (
      <HvTabs value={value} onChange={(_, newValue) => setValue(newValue)}>
        <HvTab className={classes.tab} label="Tab 1" />
        <HvTab className={classes.tab} label="Tab 2" />
        <HvTab className={classes.tab} label="Tab 3" />
      </HvTabs>
    );

    return (
      <HvGlobalActions
        title={customTitle}
        classes={{
          wrapper: classes.wrapper,
          actions: classes.actions,
        }}
        backButton={
          <div className={classes.backButton}>
            <HvButton aria-label="Go back" icon>
              <Backwards />
            </HvButton>
            <Home title="Home" />
            <HvBreadCrumb listRoute={data} maxVisible={2} />
          </div>
        }
      >
        <HvButton variant="secondaryGhost">Primary</HvButton>
        <HvDropDownMenu
          placement="left"
          dataList={[
            { label: "Action 2" },
            { label: "Action 3" },
            { label: "Action 4" },
          ]}
        />
      </HvGlobalActions>
    );
  },
});

export const Test = meta.story({
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
});
