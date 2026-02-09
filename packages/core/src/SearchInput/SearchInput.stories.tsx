import { HvSearchInput } from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";

const meta = preview.meta({
  title: "Components/Search Input",
  component: HvSearchInput,
});

export const Main = meta.story({
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
});
