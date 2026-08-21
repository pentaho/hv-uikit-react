import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseInput,
  HvFormElement,
  HvLabel,
  HvSuggestions,
  type HvBaseInputProps,
  type HvSuggestionsProps,
} from "@pentaho/uikit-react-core";

import { allCountries } from "../../Input/stories/countries";

const meta: Meta<typeof HvSuggestions> = {
  title: "Components/Form Element Blocks/Suggestions",
  component: HvSuggestions,
  decorators: [
    (Story) => <div style={{ width: 500, height: 320 }}>{Story()}</div>,
  ],
};
export default meta;

export const Main: StoryObj<HvSuggestionsProps> = {
  args: {
    open: true,
  },
  argTypes: {
    classes: { control: { disable: true } },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [suggestionList, setSuggestionList] = useState<string[]>([]);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLElement>(null);

    const handleChange: HvBaseInputProps["onChange"] = (e, val) => {
      const matches = allCountries.filter((v) =>
        v.toUpperCase().startsWith(val.toUpperCase()),
      );
      const newList = val.length >= 1 ? matches : [];
      setSuggestionList(newList);
      setOpen(newList.length > 0);
      setValue(val);
    };

    const handleSelection: HvSuggestionsProps["onSuggestionSelected"] = (
      e,
      val,
    ) => {
      console.log(val);
      setOpen(false);
      setValue(val.label as any);
      inputRef?.current?.focus();
    };

    const handleSuggestionsKey: HvSuggestionsProps["onKeyDown"] = (evt) => {
      if (evt.code === "Escape") {
        inputRef?.current?.focus();
        setOpen(false);
      } else if (evt.code === "Tab") {
        if (evt.shiftKey) {
          setTimeout(() => inputRef?.current?.focus());
        } else {
          setOpen(false);
        }
      }
    };

    const values = suggestionList
      .map((label, id) => ({ id: String(id), label }))
      .slice(0, 6);

    return (
      <HvFormElement>
        <HvLabel id="countries" label="Select country">
          <HvBaseInput
            value={value}
            inputRef={inputRef}
            placeholder="Insert country"
            onChange={handleChange}
            inputProps={{ "aria-labelledby": "countries" }}
          />
          <HvSuggestions
            open={open}
            anchorEl={inputRef.current?.parentElement}
            onClose={() => setOpen(false)}
            onKeyDown={handleSuggestionsKey}
            onSuggestionSelected={handleSelection}
            suggestionValues={values}
          />
        </HvLabel>
      </HvFormElement>
    );
  },
};
