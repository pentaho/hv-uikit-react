import { useState } from "react";
import {
  HvFormStatus,
  HvTagProps,
  HvTagsInput,
  HvTypography,
} from "@hitachivantara/uikit-react-core";

import preview from "../../../../.storybook/preview";
import countryNamesArray from "./countries";
import { ControlledTagArray as ControlledTagArrayStory } from "./stories/ControlledTagArray";

const meta = preview.meta({
  title: "Components/Tags Input",
  component: HvTagsInput,
  decorators: [
    (storyFn) => <div style={{ maxWidth: "600px" }}>{storyFn()}</div>,
  ],
});

export const Main = meta.story({
  args: {
    label: "Enter your tags",
    description: "This is where you enter your tags",
    placeholder: "Enter value",
    disabled: false,
    readOnly: false,
    required: false,
    multiline: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    inputProps: { control: { disable: true } },
    countCharProps: { control: { disable: true } },
    suggestionListCallback: { control: { disable: true } },
  },
  render: (args) => {
    return <HvTagsInput {...args} />;
  },
});

export const Variants = meta.story({
  decorators: [(Story) => <div className="grid gap-sm">{Story()}</div>],
  render: () => {
    return (
      <>
        <HvTagsInput
          label="Required"
          placeholder="Enter value"
          required
          value={[{ label: "tag 1" }, { label: "tag 2" }, { label: "tag 3" }]}
        />
        <HvTagsInput
          label="Disabled"
          placeholder="Enter value"
          disabled
          value={[
            { label: "tag 4", disabled: true },
            { label: "tag 5", disabled: true },
            { label: "tag 6", disabled: true },
          ]}
        />
        <HvTagsInput
          label="Readonly"
          placeholder="Enter value"
          readOnly
          value={[{ label: "tag 7" }, { label: "tag 8" }, { label: "tag 9" }]}
        />
        <HvTagsInput
          label="Invalid"
          placeholder="Enter value"
          status="invalid"
          statusMessage="Oh no!"
          value={[
            { label: "tag 10" },
            { label: "tag 11" },
            { label: "tag 12" },
          ]}
        />
      </>
    );
  },
});

export const ControlledStringArray = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Controlled Tags Input with string array.",
      },
    },
  },
  render: () => {
    const [currValueStr, setCurrValueStr] = useState<string[]>([
      "tag 1",
      "tag 2",
    ]);

    return (
      <>
        <HvTagsInput
          label="Controlled with array of strings"
          description="A list of strings will result in semantic tags"
          placeholder="Enter value"
          value={currValueStr}
          onChange={(event, value: any) => {
            setCurrValueStr(value);
          }}
        />
        <HvTypography variant="label">Current value:</HvTypography>
        <HvTypography>{JSON.stringify(currValueStr)}</HvTypography>
      </>
    );
  },
});

export const ControlledTagArray = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Controlled Tags Input with Tags array",
      },
    },
  },
  render: () => <ControlledTagArrayStory />,
});

export const ControlledWithValidation = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Controlled Tags Input with validation.",
      },
    },
  },
  render: () => {
    const [currValueStr, setCurrValueStr] = useState(["tag 1", "tag 2"]);
    const [status, setStatus] = useState<HvFormStatus>("valid");
    const [statusMsg, setStatusMsg] = useState("");

    const isInvalidTag = (tag: any) => tag?.includes("-");

    return (
      <>
        <HvTagsInput
          label="Controlled with validation"
          description="A tag with a dash (-) will be invalid"
          placeholder="Enter value"
          value={currValueStr}
          status={status}
          statusMessage={statusMsg}
          onAdd={(event, value) => {
            if (value && isInvalidTag(value.label)) {
              setStatus("invalid");
              setStatusMsg("Oops, that tag has a dash (-)");
            } else {
              setStatus("valid");
              setStatusMsg("");
              setCurrValueStr([...currValueStr, value.label as string]);
            }
          }}
          onDelete={(_, value) => {
            const newArr = currValueStr.filter((t) => t !== value);
            setCurrValueStr(newArr);
          }}
        />
        <HvTypography variant="label">Current value:</HvTypography>
        <HvTypography>{JSON.stringify(currValueStr)}</HvTypography>
      </>
    );
  },
});

export const AddTagOnBlur = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Sample showcasing how to add tags when the input is blurred.",
      },
    },
  },
  render: () => {
    const [currValueArr, setCurrValueArr] = useState<HvTagProps[]>([
      { label: "tag 1", color: "#7ed69e" },
      {
        label: "tag 2 - click me!",
        color: "#7eccd6",
        type: "categorical",
        onClick: () => alert("Hello"),
      },
      { label: "tag 3", color: "#eba000" },
    ]);

    return (
      <HvTagsInput
        label="Adding tags on blur"
        placeholder="Enter value"
        value={currValueArr}
        onChange={(event, value) => {
          setCurrValueArr(value);
        }}
        onBlur={(event, value) => {
          if (value === "") return;
          setCurrValueArr([...currValueArr, { label: value }]);
        }}
      />
    );
  },
});

export const Multiline = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Tags Input in multi line mode.",
      },
    },
  },
  render: () => {
    return (
      <HvTagsInput
        classes={{ tagsList: "h-100px" }}
        label="MultiLine"
        placeholder="Enter value"
        multiline
        resizable
      />
    );
  },
});

export const TagsCounterValidation = meta.story({
  parameters: {
    docs: {
      description: {
        story: "Tags Input with tags counter.",
      },
    },
  },
  render: () => {
    const [tagsLength, setTagsLength] = useState(0);

    return (
      <HvTagsInput
        label="Tags"
        description="Maximum 3 tags"
        placeholder="Enter value"
        onChange={(event, value) => setTagsLength(value.length)}
        validationMessages={{
          maxCharError: "Too many tags",
        }}
        maxTagsQuantity={3}
        countCharProps={{
          "aria-label": `You have inserted ${tagsLength} tags`,
          role: "status",
        }}
      />
    );
  },
});

export const Suggestions = meta.story({
  parameters: {
    docs: {
      description: {
        story: "With a list of suggestions.",
      },
    },
  },
  render: () => {
    const [currValueStr, setCurrValueStr] = useState<HvTagProps[]>([]);
    const countries = countryNamesArray;

    const suggestionHandler = (val: string) => {
      if (typeof val !== "string" || !val) return null;
      const foundCountries = countries.filter((country) =>
        country.toUpperCase().startsWith(val.toUpperCase()),
      );

      if (foundCountries.length === 0) return null;

      return foundCountries.map((country, idx) => ({
        id: `c_${idx}`,
        label: country,
      }));
    };

    return (
      <HvTagsInput
        label="Suggestions"
        description="A list of suggestions is presented when text is entered."
        placeholder="Enter value"
        onChange={(event, value) => {
          setCurrValueStr(value);
        }}
        value={currValueStr}
        suggestionListCallback={suggestionHandler}
      />
    );
  },
});

export const UnrestrictedSuggestions = meta.story({
  parameters: {
    docs: {
      description: {
        story: `Typically when using a suggestions list the goal is to have the tags
        being selected from amongst the options in the list. But sometimes it
        might be useful to allow the user to enter a tag that is not in the
        list. In this case you can use the \`suggestionValidation\` callback to
        validate the tag. You should also set the \`suggestionsLoose\` property
        to \`true\`.`,
      },
    },
  },
  render: () => {
    const [options, setOptions] = useState([
      "Option 1.1",
      "Option 1.2",
      "Option 1.3",
      "Option 2.1",
      "Option 2.2",
      "Option 2.3",
    ]);
    const [currValueStr, setCurrValueStr] = useState<HvTagProps[]>([]);
    const [status, setStatus] = useState<HvFormStatus>("valid");
    const [statusMsg, setStatusMsg] = useState("");

    const suggestionHandler = (val: string) => {
      if (typeof val !== "string" || !val) return null;
      const foundOptions = options.filter((option) =>
        option.toUpperCase().startsWith(val.toUpperCase()),
      );

      if (foundOptions.length === 0) return null;

      return foundOptions.map((option, idx) => ({
        id: `c_${idx}`,
        label: option,
      }));
    };

    const suggestionValidation = (val: string) => {
      if (typeof val !== "string" || !val) return false;

      if (!val.startsWith("Option")) {
        setStatus("invalid");
        setStatusMsg(
          "Oops, that's not an option. Your tag must start with 'Option'",
        );
        return false;
      }
      setOptions((prev) => [...prev, val]);
      setStatus("valid");
      setStatusMsg("");
      return true;
    };

    return (
      <HvTagsInput
        label="Suggestions"
        description="Enter a tag starting with 'Option'."
        placeholder="Enter value"
        onChange={(event, value) => {
          setCurrValueStr(value);
        }}
        value={currValueStr}
        suggestionListCallback={suggestionHandler}
        suggestionValidation={suggestionValidation}
        suggestionsLoose
        status={status}
        statusMessage={statusMsg}
      />
    );
  },
});
