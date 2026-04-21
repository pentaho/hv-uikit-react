import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvInlineEditor,
  type HvInlineEditorProps,
  type HvTypographyVariants,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<HvInlineEditorProps> = {
  title: "Components/Inline Editor",
  component: HvInlineEditor,
};
export default meta;

const variants: HvTypographyVariants[] = [
  "display",
  "title1",
  "title2",
  "title3",
  "title4",
  "body",
  "label",
  "caption1",
  "caption2",
];

export const Main: StoryObj<typeof HvInlineEditor> = {
  args: {
    showIcon: false,
    variant: "body",
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  decorators: [(Story) => <div style={{ width: 300 }}>{Story()}</div>],
  render: (args) => <HvInlineEditor {...args} />,
};

export const Test: StoryObj = {
  render: () => {
    return (
      <div className="flex flex-wrap gap-5px justify-start items-start">
        <HvInlineEditor />
        <HvInlineEditor showIcon />
        <HvInlineEditor disabled />
        <HvInlineEditor disabled showIcon />
        {variants.map((variant) => (
          <div style={{ maxWidth: 300 }} key={variant}>
            <HvInlineEditor
              variant={variant}
              defaultValue="Very very very long text that is likely to be truncated"
            />
          </div>
        ))}
      </div>
    );
  },
};
