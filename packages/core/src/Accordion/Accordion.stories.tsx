import {
  HvAccordion,
  HvListContainer,
  HvListItem,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const classes = {
  listContainer: "[&>li]:pl-32px",
  formContainer: "px-32px [&>*]:mb-sm",
};

const meta = preview.meta({
  title: "Components/Accordion",
  component: HvAccordion,
});

export const Main = meta.story({
  args: {
    label: "Analytics",
    headingLevel: 1,
    disabled: false,
    defaultExpanded: false,
    labelVariant: "label",
    children: null,
  },
  argTypes: {
    classes: { control: { disable: true } },
    containerProps: { control: { disable: true } },
    children: { control: { disable: true } },
  },
  render: (args) => {
    return (
      <HvAccordion {...args}>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Views</HvListItem>
          <HvListItem>Parameters</HvListItem>
        </HvListContainer>
      </HvAccordion>
    );
  },
});

export const Disabled = meta.story({
  render: () => (
    <div style={{ maxWidth: 300 }}>
      <HvAccordion label="Analytics" headingLevel={3} disabled>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Views</HvListItem>
          <HvListItem>Parameters</HvListItem>
        </HvListContainer>
      </HvAccordion>
      <HvAccordion label="System" headingLevel={3}>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Settings</HvListItem>
          <HvListItem>Network</HvListItem>
        </HvListContainer>
      </HvAccordion>
      <HvAccordion label="Data" headingLevel={3} disabled>
        <HvListContainer
          className={classes.listContainer}
          interactive
          condensed
        >
          <HvListItem>Storage</HvListItem>
          <HvListItem>Memory</HvListItem>
        </HvListContainer>
      </HvAccordion>
    </div>
  ),
});
