import { useMemo, useRef, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HvBaseInput,
  HvBaseInputProps,
  HvFormElement,
  HvLabel,
  HvSuggestions,
  HvSuggestionsProps,
} from "@hitachivantara/uikit-react-core";
import { DropDownXS } from "@hitachivantara/uikit-react-icons";

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

export const ServerSideSuggestions: StoryObj<HvSuggestionsProps> = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [suggestionList, setSuggestionList] = useState<string[]>([]);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLElement>(null);

    // Server-side mock function
    const fetchCountries = (input: string) =>
      new Promise<string[]>((resolve) => {
        const countries = allCountries
          .filter((c) => c.toUpperCase().includes(input.toUpperCase()))
          .slice(0, 8);

        setTimeout(() => resolve(countries), 300);
      });

    const handleChange: HvBaseInputProps["onChange"] = (e, val) => {
      setValue(val);
      setOpen(false);
      if (val.length < 1) return;
      fetchCountries(val).then((countries) => {
        setSuggestionList(countries);
        setOpen(countries.length >= 1);
      });
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

export const CustomOpen: StoryObj<HvSuggestionsProps> = {
  parameters: {
    docs: {
      description: {
        story: "Custom opening on focus or down arrow key",
      },
    },
  },
  render: () => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLElement>(null);

    const handleSelection: HvSuggestionsProps["onSuggestionSelected"] = (
      e,
      val,
    ) => {
      console.log(val);
      setOpen(false);
      setValue(val.label as any);
      inputRef?.current?.focus();
    };

    const handleKey: HvBaseInputProps["onKeyDown"] = (e) => {
      if (e.code === "ArrowDown") {
        setOpen(true);
        document.querySelector<HTMLLIElement>("#suggestions li")?.focus();
      }
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

    const values = useMemo(() => {
      return allCountries
        .filter((v) => v.toUpperCase().startsWith(value.toUpperCase()))
        .slice(0, 6)
        .map((label, id) => ({ id: String(id), label }));
    }, [value]);

    return (
      <HvFormElement>
        <HvLabel id="countries" label="Select country">
          <HvBaseInput
            value={value}
            inputRef={inputRef}
            placeholder="Insert country"
            onChange={(evt, val) => {
              if (val.length > 0) setOpen(true);
              setValue(val);
            }}
            onKeyDown={handleKey}
            onClick={(evt) => {
              evt.stopPropagation();
              if (!value) setOpen(true);
            }}
            endAdornment={
              <DropDownXS
                rotate={open}
                style={{ cursor: "pointer" }}
                onClick={(evt) => {
                  evt.stopPropagation();
                  setOpen((v) => !v);
                }}
              />
            }
            inputProps={{ "aria-labelledby": "countries" }}
          />
          <HvSuggestions
            id="suggestions"
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
