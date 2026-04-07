import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvSearchInput,
  type HvInputProps,
} from "@hitachivantara/uikit-react-core";

const meta: Meta<typeof HvSearchInput> = {
  title: "Components/Search Input",
  component: HvSearchInput,
};
export default meta;

export const Main: StoryObj<HvInputProps> = {
  args: {
    label: "Search",
    description: "Please enter a search term",
    placeholder: "Insert search term...",
    disabled: false,
    readOnly: false,
    required: false,
    status: "valid",
    statusMessage: "My status message",
    autoFocus: false,
    showValidationIcon: false,
  },
  argTypes: {
    type: { control: { disable: true } },
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
    disableRevealPassword: { control: { disable: true } },
    disableSearchButton: { control: { disable: true } },
    minCharQuantity: { control: { disable: true } },
    maxCharQuantity: { control: { disable: true } },
  },
};
