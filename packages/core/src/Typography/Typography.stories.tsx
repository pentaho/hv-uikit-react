import preview from "../../../../.storybook/preview";
import { HvTypography, HvTypographyProps } from "./Typography";

const typographyVariants = [
  "display",
  "title1",
  "title2",
  "title3",
  "title4",
  "body",
  "label",
  "captionLabel",
  "caption1",
  "caption2",
] satisfies HvTypographyProps["variant"][];

const meta = preview.meta({
  title: "Components/Typography",
  component: HvTypography,
});

export const Main = meta.story({
  args: {
    variant: "title1",
    link: false,
    disabled: false,
    noWrap: false,
    paragraph: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    component: { control: { disable: true } },
    ref: { control: { disable: true } },
  },
  decorators: [(Story) => <div style={{ width: 400 }}>{Story()}</div>],
  render: (args) => <HvTypography {...args}>Welcome to UI Kit!</HvTypography>,
});

export const Variants = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "The component supports different variants through the `variant` property as shown below. It's also possible to set the `disabled` or `link` properties if needed.",
      },
    },
  },
  render: () => {
    return (
      <div className="grid gap-sm">
        {typographyVariants.map((variant) => (
          <div key={variant}>
            <HvTypography variant="label">{variant}</HvTypography>
            <br />
            <HvTypography variant={variant}>Welcome to UI Kit!</HvTypography>
          </div>
        ))}
      </div>
    );
  },
});

export const Test = meta.story({
  decorators: [
    (Story) => <div className="flex flex-wrap gap-sm">{Story()}</div>,
  ],
  render: () => (
    <>
      <HvTypography disabled variant="display">
        Welcome to UI-Kit!
      </HvTypography>
      <HvTypography
        link
        variant="display"
        component="a"
        href="https://lumada-design.github.io/uikit/master"
      >
        Welcome to UI-Kit!
      </HvTypography>
      {typographyVariants.map((variant) => (
        <HvTypography key={variant} variant={variant}>
          Welcome to UI-Kit!
        </HvTypography>
      ))}
    </>
  ),
});
