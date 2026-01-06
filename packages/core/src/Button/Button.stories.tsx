import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StoryObj } from "@storybook/react-vite";
import { HvButton, HvButtonProps } from "@hitachivantara/uikit-react-core";
import {
  Delete,
  Favorite,
  Link as LinkIcon,
  MoreOptionsVertical,
  Pause,
  Play,
  Point,
  Refresh,
  Stop,
} from "@hitachivantara/uikit-react-icons";

export default { title: "Components/Button", component: HvButton };

export const Main: StoryObj<HvButtonProps> = {
  args: {
    children: "Primary",
    variant: "primary",
    disabled: false,
    size: undefined,
    radius: undefined,
    selected: false,
    onClick: () => console.log("clicked"),
  },
  argTypes: {
    classes: { control: { disable: true } },
    component: { control: { disable: true } },
    ref: { control: { disable: true } },
    size: { control: { type: "select" } },
    radius: { control: { type: "select" } },
  },
};

export const Variants: StoryObj<HvButtonProps> = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(3, 140px)",
        }}
      >
        {Story()}
      </div>
    ),
  ],
  render: () => (
    <>
      <HvButton variant="primary">Primary</HvButton>
      <HvButton variant="primarySubtle">Primary Subtle</HvButton>
      <HvButton variant="primaryGhost">Primary Ghost</HvButton>
      <HvButton disabled variant="primary">
        Disabled
      </HvButton>
      <HvButton disabled variant="primarySubtle">
        Disabled Subtle
      </HvButton>
      <HvButton disabled variant="primaryGhost">
        Disabled Ghost
      </HvButton>
      <div />
      <HvButton variant="secondarySubtle">Secondary Subtle</HvButton>
      <HvButton variant="secondaryGhost">Secondary Ghost</HvButton>
      <HvButton variant="positive">Positive</HvButton>
      <HvButton variant="positiveSubtle">Positive Subtle</HvButton>
      <HvButton variant="positiveGhost">Positive Ghost</HvButton>
      <HvButton variant="warning">Warning</HvButton>
      <HvButton variant="warningSubtle">Warning Subtle</HvButton>
      <HvButton variant="warningGhost">Warning Ghost</HvButton>
      <HvButton variant="negative">Negative</HvButton>
      <HvButton variant="negativeSubtle">Negative Subtle</HvButton>
      <HvButton variant="negativeGhost">Negative Ghost</HvButton>
      <HvButton color="rebeccapurple">Custom</HvButton>
      <HvButton color="rebeccapurple" variant="subtle">
        Custom Subtle
      </HvButton>
      <HvButton color="rebeccapurple" variant="ghost">
        Custom Ghost
      </HvButton>
    </>
  ),
};

export const Sizes: StoryObj<HvButtonProps> = {
  decorators: [
    (Story) => <div className="flex flex-wrap gap-sm">{Story()}</div>,
  ],
  render: () => (
    <>
      <HvButton variant="primary" size="sm">
        Small
      </HvButton>
      <HvButton variant="warningSubtle" size="md">
        Medium
      </HvButton>
      <HvButton variant="positive" size="lg">
        Large
      </HvButton>
      <HvButton icon variant="negativeGhost" size="md" aria-label="Play">
        <Play />
      </HvButton>
      <HvButton icon variant="primarySubtle" size="lg" aria-label="Play">
        <Play />
      </HvButton>
    </>
  ),
};

export const FocusableWhenDisabled: StoryObj<HvButtonProps> = {
  decorators: [
    (Story) => (
      <div
        style={{
          display: "grid",
          gap: 20,
          gridTemplateColumns: "repeat(3, 140px)",
        }}
      >
        {Story()}
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "If you still need the button to be focusable when disabled for accessibility purposes, you can set the `focusableWhenDisabled` property to `true`. When using this property, the buttons will continue be read by screen readers when disabled.",
      },
    },
  },
  render: () => (
    <>
      <HvButton variant="primary" disabled focusableWhenDisabled>
        Primary
      </HvButton>
      <HvButton variant="primarySubtle" disabled focusableWhenDisabled>
        Primary Subtle
      </HvButton>
      <HvButton variant="primaryGhost" disabled focusableWhenDisabled>
        Primary Ghost
      </HvButton>
      <div />
      <HvButton variant="secondarySubtle" disabled focusableWhenDisabled>
        Secondary Subtle
      </HvButton>
      <HvButton variant="secondaryGhost" disabled focusableWhenDisabled>
        Secondary Ghost
      </HvButton>
    </>
  ),
};

export const Icons: StoryObj<HvButtonProps> = {
  decorators: [
    (Story) => (
      <div className="flex flex-col gap-sm [&>div]:flex [&>div]:gap-sm">
        {Story()}
      </div>
    ),
  ],
  render: () => (
    <>
      <div>
        <HvButton icon aria-label="Play" variant="primaryGhost">
          <Play iconSize="M" />
        </HvButton>
        <HvButton icon aria-label="Pause">
          <Pause iconSize="M" />
        </HvButton>
        <HvButton icon disabled aria-label="Stop">
          <Stop iconSize="M" />
        </HvButton>
      </div>
      <div>
        <HvButton startIcon={<Play />} variant="primaryGhost">
          Play
        </HvButton>
        <HvButton startIcon={<Pause />} variant="secondaryGhost">
          Pause
        </HvButton>
        <HvButton disabled startIcon={<Stop />} variant="secondaryGhost">
          Stop
        </HvButton>
      </div>
      <div>
        <HvButton endIcon={<Play />} variant="primaryGhost">
          Play
        </HvButton>
        <HvButton endIcon={<Pause />} variant="secondaryGhost">
          Pause
        </HvButton>
        <HvButton endIcon={<Stop />} disabled variant="secondaryGhost">
          Stop
        </HvButton>
      </div>
    </>
  ),
};

export const Semantic: StoryObj<HvButtonProps> = {
  decorators: [
    (Story) => (
      <div className="flex gap-sm p-sm text-textDark bg-infoDimmed">
        {Story()}
      </div>
    ),
  ],
  render: () => (
    <>
      <HvButton variant="semantic" startIcon={<Favorite />}>
        Favorite
      </HvButton>
      <HvButton variant="semantic" startIcon={<Refresh />}>
        Refresh
      </HvButton>
      <HvButton variant="semantic" startIcon={<Delete />}>
        Delete
      </HvButton>
      <HvButton variant="semantic" icon aria-label="More options">
        <MoreOptionsVertical />
      </HvButton>
    </>
  ),
};

interface CustomLinkProps extends HvButtonProps<"a"> {
  to: string;
}

const CustomLink = ({ to, children, ...others }: CustomLinkProps) => (
  <a href={to} {...others}>
    {children}
  </a>
);

export const CustomRootComponent: StoryObj<HvButtonProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "If necessary the button's root component can be changed by setting the `component` property.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", gap: 20, padding: 20 }}>{Story()}</div>
    ),
  ],
  render: () => (
    <>
      <HvButton startIcon={<Point />}>Button</HvButton>
      <HvButton
        variant="secondaryGhost"
        component="a"
        href="https://lumada-design.github.io/uikit/master"
        startIcon={<LinkIcon />}
      >
        Link
      </HvButton>
      <HvButton
        variant="secondarySubtle"
        component={CustomLink}
        to="https://lumada-design.github.io/uikit/master"
        startIcon={<LinkIcon />}
      >
        Custom link
      </HvButton>
    </>
  ),
};

export const Test: StoryObj = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      <HvButton variant="primary">Primary</HvButton>
      <HvButton variant="primarySubtle">Primary Subtle</HvButton>
      <HvButton variant="primaryGhost">Primary Ghost</HvButton>
      <HvButton variant="secondarySubtle">Secondary Subtle</HvButton>
      <HvButton variant="secondaryGhost">Secondary Ghost</HvButton>
      <div style={{ backgroundColor: "#D8E6F1", padding: 4 }}>
        <HvButton variant="semantic">Semantic</HvButton>
      </div>
      <HvButton variant="positive">Positive</HvButton>
      <HvButton variant="positiveSubtle">Positive Subtle</HvButton>
      <HvButton variant="positiveGhost">Positive Ghost</HvButton>
      <HvButton variant="warning">Warning</HvButton>
      <HvButton variant="warningSubtle">Warning Subtle</HvButton>
      <HvButton variant="warningGhost">Warning Ghost</HvButton>
      <HvButton variant="negative">Negative</HvButton>
      <HvButton variant="negativeSubtle">Negative Subtle</HvButton>
      <HvButton variant="negativeGhost">Negative Ghost</HvButton>
      <HvButton disabled variant="primary">
        Primary
      </HvButton>
      <HvButton disabled variant="primarySubtle">
        Primary Subtle
      </HvButton>
      <HvButton disabled variant="primaryGhost">
        Primary Ghost
      </HvButton>
      <HvButton variant="warning" disabled>
        Warning
      </HvButton>
      <HvButton variant="warningSubtle" disabled>
        Warning Subtle
      </HvButton>
      <HvButton variant="warningGhost" disabled>
        Warning Ghost
      </HvButton>

      {(["sm", "md", "lg"] as const).map((size) => (
        <HvButton size={size} key={size} variant="warning">
          {size}
        </HvButton>
      ))}

      {(["none", "base", "round", "full"] as const).map((radius) => (
        <HvButton radius={radius} key={radius} variant="warning">
          {radius}
        </HvButton>
      ))}

      <HvButton icon aria-label="Play" variant="primary">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="primarySubtle">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="primaryGhost">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="secondarySubtle">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="secondaryGhost">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="warning">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="warningSubtle">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="warningGhost">
        <Play />
      </HvButton>

      <HvButton icon aria-label="Play" variant="primarySubtle" size="sm">
        <Play />
      </HvButton>
      <HvButton icon aria-label="Play" variant="primarySubtle" size="md">
        <Play />
      </HvButton>
      <HvButton icon disabled aria-label="Play" variant="primary" size="lg">
        <Play />
      </HvButton>

      <HvButton icon aria-label="Play">
        <Play size="M" />
      </HvButton>
      <HvButton icon disabled aria-label="Stop">
        <Play size="M" />
      </HvButton>

      <HvButton startIcon={<Play />} variant="primary" size="lg">
        Play
      </HvButton>
      <HvButton startIcon={<Pause />} variant="secondaryGhost" size="lg">
        Pause
      </HvButton>
      <HvButton disabled startIcon={<Stop />} variant="secondaryGhost">
        Stop
      </HvButton>
      <HvButton endIcon={<Play />} variant="primaryGhost">
        Play
      </HvButton>
      <HvButton endIcon={<Pause />} variant="secondaryGhost">
        Pause
      </HvButton>
      <HvButton endIcon={<Stop />} disabled variant="secondaryGhost">
        Stop
      </HvButton>
      <HvButton startIcon={<Play />} color="rebeccapurple">
        rebeccapurple
      </HvButton>
      <HvButton startIcon={<Play />} color="rebeccapurple" variant="subtle">
        rebeccapurple
      </HvButton>
      <HvButton startIcon={<Play />} color="rebeccapurple" variant="ghost">
        rebeccapurple
      </HvButton>
      <HvButton startIcon={<Play />} color="lightcyan">
        lightcyan
      </HvButton>
      <HvButton startIcon={<Play />} color="lightcyan" variant="subtle">
        lightcyan
      </HvButton>
      <HvButton startIcon={<Play />} color="lightcyan" variant="ghost">
        lightcyan
      </HvButton>

      <HvButton icon variant="primary" aria-label="Add">
        <FontAwesomeIcon icon={faAdd} />
      </HvButton>
      <HvButton startIcon={<FontAwesomeIcon icon={faAdd} />}>Add</HvButton>
      <HvButton icon variant="primary" aria-label="Add">
        <div className="i-ph-plus-bold" />
      </HvButton>
      <HvButton startIcon={<div className="i-ph-plus-bold" />}>Add</HvButton>
    </div>
  ),
};
