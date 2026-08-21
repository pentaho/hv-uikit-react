import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseInput,
  HvInput,
  type HvInputProps,
  type HvValidationMessages,
} from "@pentaho/uikit-react-core";

const showcaseDecorator: Decorator = (Story) => (
  <div className="flex flex-wrap justify-start gap-sm [&>div]:w-200px">
    {Story()}
  </div>
);

const meta: Meta<typeof HvInput> = {
  title: "Components/Input",
  component: HvInput,
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvBaseInput },
};
export default meta;

export const Main: StoryObj<HvInputProps> = {
  args: {
    label: "First name",
    description: "Please enter your first name",
    placeholder: "Insert first name",
    disabled: false,
    readOnly: false,
    required: false,
    type: "text",
    status: "valid",
    statusMessage: "My status message",
    infoMessage: "",
    autoFocus: false,
    hideClear: false,
    hideRevealPassword: false,
    hideSearchButton: false,
    showValidationIcon: false,
    minCharQuantity: undefined,
    maxCharQuantity: undefined,
  },
  argTypes: {
    classes: { control: { disable: true } },
    onChange: { control: { disable: true } },
    onEnter: { control: { disable: true } },
    onBlur: { control: { disable: true } },
    onFocus: { control: { disable: true } },
    onKeyDown: { control: { disable: true } },
    validation: { control: { disable: true } },
    endAdornment: { control: { disable: true } },
    inputProps: { control: { disable: true } },
    suggestionListCallback: { control: { disable: true } },
    inputRef: { control: { disable: true } },
    validationMessages: { control: { disable: true } },
    labels: { control: { disable: true } },
  },
  render: (args) => {
    return <HvInput {...args} />;
  },
};

export const Test: StoryObj<HvInputProps> = {
  decorators: [showcaseDecorator],
  args: {
    description: "Enter name",
    placeholder: "Insert first name",
  },
  render: (args) => {
    const validationMessages: HvValidationMessages = {
      error: "Invalid value!",
      maxCharError: "Value is too long!",
      minCharError: "Value is too short!",
      requiredError: "Value is required!",
      typeMismatchError: "Type is incorrect!",
    };

    return (
      <>
        <HvInput aria-label="default" className="self-end" />
        <HvInput disabled aria-label="default" className="self-end" />
        <HvInput label="Default value" defaultValue="value!" />
        <HvInput required label="Required" {...args} />
        <HvInput disabled label="Disabled" {...args} />
        <HvInput readOnly label="Readonly" {...args} />
        <HvInput
          required
          label="Invalid"
          status="invalid"
          statusMessage="Oh no!"
          {...args}
        />
        <HvInput
          required
          type="email"
          label="Email"
          description="Enter email"
          placeholder="example@domain.com"
          showValidationIcon
          validationMessages={validationMessages}
        />
        <HvInput
          type="password"
          label="Password"
          description="Enter password"
          placeholder="Enter password"
          validationMessages={validationMessages}
        />
        <HvInput
          disabled
          type="password"
          label="Disabled"
          description="Enter password"
          placeholder="Enter password"
          validationMessages={validationMessages}
        />
        <HvInput
          type="search"
          label="Search"
          description="Search for a value"
          placeholder="Search..."
          validationMessages={validationMessages}
          onEnter={(event, value) => console.log("Searching", value)}
        />
        <HvInput
          disabled
          type="search"
          label="Disabled"
          description="Search for a value"
          placeholder="Search..."
          validationMessages={validationMessages}
          onEnter={(event, value) => console.log("Searching", value)}
        />
        <HvInput
          required
          type="number"
          label="Number"
          description="With 2-3 digits"
          placeholder="Pick a number"
          showValidationIcon
          minCharQuantity={2}
          maxCharQuantity={3}
          validationMessages={validationMessages}
        />
        <HvInput
          required
          inputProps={{ type: "number", min: 10, max: 99 }}
          label="Number native"
          placeholder="Pick a number"
        />
        <HvInput
          required
          disabled
          defaultValue="60"
          inputProps={{ type: "number", min: 10, max: 99 }}
          label="Number native"
          placeholder="Pick a number"
        />
        <HvInput
          label="Domain"
          placeholder="domain"
          startAdornment={
            <span className="content-center px-xxs">https://</span>
          }
          endAdornment={
            <span className="h-full content-center px-xxs">.com</span>
          }
        />
        <HvInput
          type="password"
          label="Password"
          value="password"
          status="valid"
          showValidationIcon
          placeholder="Enter password"
          classes={{ inputRoot: "h-48px" }}
        />
      </>
    );
  },
};
