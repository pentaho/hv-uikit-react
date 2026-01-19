import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvAvatar,
  HvButton,
  HvTooltip,
  HvTooltipProps,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Play } from "@hitachivantara/uikit-react-icons";

const meta: Meta<typeof HvTooltip> = {
  title: "Components/Tooltip",
  component: HvTooltip,
};
export default meta;

export const Main: StoryObj<HvTooltipProps> = {
  args: {
    open: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: ({ open }) => {
    return (
      <div className="flex justify-around pt-80px">
        <HvTooltip title="Grid View">
          <HvButton variant="secondaryGhost">Hover or focus here</HvButton>
        </HvTooltip>
        <HvTooltip title="Grid View" open={open}>
          <HvButton variant="secondaryGhost">Tooltip open</HvButton>
        </HvTooltip>
      </div>
    );
  },
};

export const Disabled: StoryObj<HvTooltipProps> = {
  parameters: {
    docs: {
      description: {
        story:
          'To "hide" a Tooltip, remove its `title`; `disableFocusListener` and `disableHoverListener` disable focus or hover, respectively.',
      },
    },
  },
  render: () => (
    <div className="flex justify-around pt-100px">
      <HvTooltip placement="right" title="">
        <HvButton variant="secondaryGhost">No tooltip</HvButton>
      </HvTooltip>
      <HvTooltip
        disableFocusListener
        title="Focusing the button will not open me"
      >
        <HvButton variant="secondaryGhost">Focus ignored</HvButton>
      </HvTooltip>
      <HvTooltip
        disableHoverListener
        title="Hovering the button will not open me"
      >
        <HvButton variant="secondaryGhost">Hover ignored</HvButton>
      </HvTooltip>
    </div>
  ),
};

export const CustomElements: StoryObj<HvTooltipProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "A Tooltip can be attached to any side (see `placement`) of any element or component that holds a `ref` and spreads its props.\
        If the component doesn't do so, a workaround is to wrap it in a `div`.",
      },
    },
    ...setupChromatic(),
  },
  // Open tooltip for visual tests
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const button = canvas.getByRole("button", { name: /concise/i });
    await userEvent.hover(button);
    const tooltip = await canvas.findByRole("tooltip");
    await expect(tooltip).toBeInTheDocument();
  },
  render: () => (
    <div className="flex justify-around py-60px">
      <HvTooltip
        placement="right"
        title="Tooltips can showcase truncated text. The text should be concise and not
        redundant."
      >
        <HvButton>Button</HvButton>
      </HvTooltip>
      <HvTooltip placement="bottom" title="Bottom placement">
        <HvButton icon>
          <Play />
        </HvButton>
      </HvTooltip>
      <HvTooltip title="Wrapped HvAvatar">
        <HvAvatar
          role="img"
          alt="Ryan"
          src="https://avatars.githubusercontent.com/u/80?v=4"
        />
      </HvTooltip>
      <HvTooltip placement="left" title="Left placement link">
        <HvTypography
          link
          component="a"
          href="https://github.com/pentaho/hv-uikit-react"
        >
          UI Kit
        </HvTypography>
      </HvTooltip>
    </div>
  ),
};

export const CustomContent: StoryObj<HvTooltipProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "A Tooltip will grow to the size of its content. Keep in mind that the Tooltip `title` labels the content `children` \
          and is not keyboard-navigable, therefore it shouldn't be too complex or contain interactable elements.",
      },
    },
    ...setupChromatic(),
  },
  decorators: [
    (Story) => <div className="flex justify-around mt-200px">{Story()}</div>,
  ],
  // Open tooltip for visual tests
  play: async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement.parentElement!);
    const button = canvas.getByRole("button", { name: /multiline content 1/i });
    await userEvent.hover(button);
    const tooltip = await canvas.findByRole("tooltip");
    await expect(tooltip).toBeInTheDocument();
  },
  render: () => {
    const classes = {
      verticalTooltip: "flex flex-col gap-xs",
      separator: "-mx-sm my-xs border-b-3px border-bgPage",
      tabularContent: "flex justify-between gap-xs",
    };

    const longTextTooltip = (
      <span style={{ maxWidth: 250 }}>
        Tooltips can showcase truncated text. The text should be concise and not
        redundant.
      </span>
    );

    const multilineContent1 = (
      <div className={classes.verticalTooltip}>
        <HvTypography variant="label">January</HvTypography>
        <div className={classes.separator} />
        {[
          ["Sales", "52,000 units"],
          ["Profit", "50%"],
        ].map(([name, value]) => (
          <div key={name} className={classes.tabularContent}>
            <HvTypography variant="label">{name}</HvTypography>
            <HvTypography>{value}</HvTypography>
          </div>
        ))}
      </div>
    );

    const multilineContent2 = (
      <div className={classes.verticalTooltip}>
        {[
          ["Status", "Open"],
          ["Date", "12/08/2018"],
          ["Assignee", "Management"],
          ["Approval", "Not yet requested"],
        ].map(([name, value]) => (
          <div key={name} className={classes.tabularContent}>
            <HvTypography variant="label">{name}</HvTypography>
            <HvTypography>{value}</HvTypography>
          </div>
        ))}
      </div>
    );

    return (
      <>
        <HvTooltip title={longTextTooltip}>
          <HvButton variant="secondaryGhost">Long text tooltip</HvButton>
        </HvTooltip>
        <HvTooltip title={multilineContent1}>
          <HvButton variant="secondaryGhost">Multiline content 1</HvButton>
        </HvTooltip>
        <HvTooltip title={multilineContent2}>
          <HvButton variant="secondaryGhost">Multiline content 2</HvButton>
        </HvTooltip>
      </>
    );
  },
};
