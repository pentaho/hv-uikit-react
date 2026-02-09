import { HvTextArea } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Text Area",
  component: HvTextArea,
  decorators: [(Story) => <div style={{ maxWidth: 600 }}>{Story()}</div>],
});

export const Main = meta.story({
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
});

export const Variants = meta.story({
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
});

export const LimitedWithCustomLabels = meta.story({
  parameters: {
    docs: {
      description: { story: "Text area char count with a custom labels." },
    },
  },
  render: () => {
    const validationMessages = {
      requiredError: "This text area can't be empty",
      maxCharError: "Too many characters",
    };

    return (
      <HvTextArea
        rows={5}
        label="Label"
        description="You can write past the limit"
        placeholder="Enter value"
        middleCountLabel="of"
        validationMessages={validationMessages}
        required
        maxCharQuantity={10}
      />
    );
  },
});

export const LimitedBlocking = meta.story({
  parameters: {
    docs: {
      description: {
        story:
          "Text area that limits the quantity of character that can be introduced in the text area.",
      },
    },
  },
  render: () => {
    return (
      <HvTextArea
        defaultValue="Some text"
        rows={5}
        label="Label"
        placeholder="Enter value"
        maxCharQuantity={10}
        blockMax
      />
    );
  },
});
