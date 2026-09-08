import type { Meta, StoryObj } from "@storybook/react-vite";
import { HvTextArea, type HvTextAreaProps } from "@pentaho/uikit-react-core";

const meta: Meta<typeof HvTextArea> = {
  title: "Components/Text Area",
  component: HvTextArea,
  decorators: [(Story) => <div style={{ maxWidth: 600 }}>{Story()}</div>],
};

export default meta;

export const Main: StoryObj<HvTextAreaProps> = {
  args: {
    label: "Label",
    placeholder: "Enter value",
    rows: 5,
    resizable: false,
    description: "Textarea description",
    hideCounter: false,
    blockMax: false,
    autoScroll: false,
    minCharQuantity: 0,
    maxCharQuantity: 160,
    middleCountLabel: "of",
    statusMessage: "Oops, something's gone wrong!",
  },
  argTypes: {
    classes: { control: { disable: true } },
    countCharProps: { control: { disable: true } },
  },
  render: (args) => {
    return <HvTextArea {...args} />;
  },
};

export const Variants: StoryObj<HvTextAreaProps> = {
  decorators: [
    (Story) => (
      <div className="flex flex-wrap gap-xs [&>*]:w-130px">{Story()}</div>
    ),
  ],
  render: () => {
    return (
      <>
        <HvTextArea
          rows={5}
          label="Required"
          placeholder="Enter value"
          maxCharQuantity={200}
          required
        />
        <HvTextArea
          rows={5}
          label="Disabled"
          placeholder="Enter value"
          maxCharQuantity={200}
          disabled
        />
        <HvTextArea
          rows={5}
          label="Readonly"
          placeholder="Enter value"
          maxCharQuantity={200}
          readOnly
        />
        <HvTextArea
          rows={5}
          label="Invalid"
          placeholder="Enter value"
          maxCharQuantity={200}
          status="invalid"
          statusMessage="Oh no!"
        />
      </>
    );
  },
};

/** Text areas with custom labels & limits */
export const Limited: StoryObj<HvTextAreaProps> = {
  render: () => {
    const validationMessages = {
      requiredError: "This text area can't be empty",
      maxCharError: "Too many characters",
    };

    return (
      <div className="flex gap-md">
        <HvTextArea
          rows={5}
          label="Soft-limited textarea"
          description="You can write past the limit"
          placeholder="Enter value"
          middleCountLabel="of"
          validationMessages={validationMessages}
          required
          maxCharQuantity={10}
        />
        <HvTextArea
          defaultValue="Some text"
          rows={5}
          label="Hard-limited textarea"
          placeholder="Enter value"
          maxCharQuantity={10}
          blockMax
        />
      </div>
    );
  },
};
