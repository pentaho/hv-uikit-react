import { useState } from "react";
import { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { setupChromatic } from "@hitachivantara/internal";
import {
  HvCalendar,
  HvDatePicker,
  HvDatePickerProps,
  HvListContainer,
  HvListItem,
  HvPanel,
  HvRadio,
  HvRadioGroup,
} from "@hitachivantara/uikit-react-core";

const containerDecorator: Decorator = (Story) => (
  <div className="decorator w-340px min-h-440px">{Story()}</div>
);

const meta: Meta<typeof HvDatePicker> = {
  title: "Components/Date Picker",
  // TODO: HvCalendar should have its own docs
  // @ts-ignore https://github.com/storybookjs/storybook/issues/23170
  subcomponents: { HvCalendar },
  component: HvDatePicker,
};
export default meta;

export const Main: StoryObj<HvDatePickerProps> = {
  args: {
    placeholder: "Select date",
    label: "Date",
    disabled: false,
    readOnly: false,
    required: false,
    status: "standBy",
    locale: "en-US",
    showActions: true,
    showClear: false,
    disablePortal: false,
    escapeWithReference: false,
  },
  argTypes: {
    classes: { control: { disable: true } },
    statusMessage: { control: { disable: true } },
    description: { control: { disable: true } },
    labels: { control: { disable: true } },
    value: { control: { disable: true } },
    startValue: { control: { disable: true } },
    endValue: { control: { disable: true } },
    startAdornment: { control: { disable: true } },
    calendarProps: { control: { disable: true } },
    dropdownProps: { control: { disable: true } },
  },
  decorators: [containerDecorator],
  render: (args) => {
    return <HvDatePicker {...args} />;
  },
};

export const Variants: StoryObj<HvDatePickerProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Date Pickers in their various form state variants. `value` is used to configure the _uncontrolled_ initial value.",
      },
    },
  },
  // For a11y
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const picker = canvas.getByRole("combobox", { name: /required/i });
    await userEvent.click(picker);
    await expect(
      canvas.getByRole("button", { name: "January" }),
    ).toBeInTheDocument();
  },
  render: () => {
    const value = new Date("2023-01-01");

    return (
      <div className="flex gap-sm [&>div]:w-200px">
        <HvDatePicker required label="Required" value={value} />
        <HvDatePicker disabled label="Disabled" value={value} />
        <HvDatePicker readOnly label="Read-only" value={value} />
        <HvDatePicker
          label="Invalid"
          status="invalid"
          statusMessage="This is an invalid date"
          value={value}
        />
      </div>
    );
  },
};

export const Localized: StoryObj<HvDatePickerProps> = {
  parameters: {
    docs: {
      description: {
        story: "Datepicker sample with values localized.",
      },
    },
  },
  decorators: [containerDecorator],
  render: () => {
    const [locale, setLocale] = useState("pt");

    return (
      <>
        <div style={{ marginBottom: "20px", width: "400px" }}>
          <HvRadioGroup
            orientation="horizontal"
            value={locale}
            onChange={(event, value) => setLocale(value)}
          >
            <HvRadio label="🇺🇸" value="en-US" />
            <HvRadio label="🇬🇧" value="en-GB" />
            <HvRadio label="🇫🇷" value="fr" />
            <HvRadio label="🇵🇹" value="pt" />
            <HvRadio label="🇯🇵" value="ja" />
          </HvRadioGroup>
        </div>
        <HvDatePicker
          placeholder={`Select a date in ${locale}`}
          value={new Date("2020-02-10")}
          locale={locale}
          aria-label="Date"
        />
      </>
    );
  },
};

export const RangeMode: StoryObj<HvDatePickerProps> = {
  parameters: {
    docs: {
      description: {
        story:
          "Datepicker in range mode allowing the selection of more than one value.",
      },
    },
  },
  decorators: [containerDecorator],
  render: () => {
    return (
      <HvDatePicker
        aria-label="Date"
        placeholder="Select a range"
        rangeMode
        startValue={new Date("2020-02-02")}
        endValue={new Date("2020-02-10")}
        labels={{
          applyLabel: "Apply",
          cancelLabel: "Cancel",
        }}
      />
    );
  },
};

export const NearInvalid: StoryObj<HvDatePickerProps> = {
  parameters: {
    docs: {
      description: {
        story: "Datepicker in range mode with invalid near invalid dates.",
      },
    },
  },
  decorators: [containerDecorator],
  render: () => {
    return (
      <HvDatePicker
        aria-label="Date"
        placeholder="Select date"
        value={new Date("2020-01-15")}
        calendarProps={{
          minimumDate: new Date("2020-01-10"),
          maximumDate: new Date("2020-01-20"),
        }}
      />
    );
  },
};

export const WithSelectionList: StoryObj<HvDatePickerProps> = {
  // For a11y
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("combobox", { name: /date/i }));
    await userEvent.click(canvas.getByRole("button", { name: /october/i }));
    const decemberButton = canvas.getByRole("button", { name: /dec/i });
    await expect(decemberButton).toBeInTheDocument();
  },
  decorators: [containerDecorator],
  render: (args) => {
    const [startDate, setStartDate] = useState(new Date("2020-09-05"));
    const [endDate, setEndDate] = useState(new Date("2020-09-10"));
    const [trueStartDate, setTrueStartDate] = useState(new Date("2020-09-05"));
    const [trueEndDate, setTrueEndDate] = useState(new Date("2020-09-10"));

    const handleClick = (item: string) => {
      console.log(item);
      const today = new Date();
      const [d, m, y] = [
        today.getDate(),
        today.getMonth(),
        today.getFullYear(),
      ];

      switch (item) {
        case "Last 7 days": {
          setStartDate(new Date(y, m, d - 7));
          setEndDate(new Date(y, m, d));
          break;
        }
        case "This month": {
          setStartDate(new Date(y, m, 1));
          setEndDate(new Date(y, m, d));
          break;
        }
        case "This year": {
          setStartDate(new Date(y, 0, 1));
          setEndDate(new Date(y, m, d));
          break;
        }
        default:
          break;
      }
    };

    const options = (
      <HvListContainer role="menu" style={{ minWidth: 100 }} interactive>
        <HvListItem role="menuitem" disabled>
          Today
        </HvListItem>
        <HvListItem role="menuitem" disabled>
          Yesterday
        </HvListItem>
        <HvListItem role="menuitem" onClick={() => handleClick("Last 7 days")}>
          Last 7 days
        </HvListItem>
        <HvListItem role="menuitem" onClick={() => handleClick("This month")}>
          This month
        </HvListItem>
        <HvListItem role="menuitem" onClick={() => handleClick("This year")}>
          This year
        </HvListItem>
      </HvListContainer>
    );

    return (
      <HvDatePicker
        aria-label="Date"
        startAdornment={<HvPanel>{options}</HvPanel>}
        rangeMode
        startValue={startDate}
        endValue={endDate}
        onChange={(sd, ed) => {
          if (sd) {
            setTrueStartDate(sd);
            setStartDate(sd);
          }
          if (ed) {
            setTrueEndDate(ed);
            setEndDate(ed);
          }
        }}
        placeholder="Select date"
        onCancel={() => {
          setStartDate(trueStartDate);
          setEndDate(trueEndDate);
        }}
        showClear
        {...args}
      />
    );
  },
};

export const Test: StoryObj<HvDatePickerProps> = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /october/i }));
  },
  parameters: {
    ...setupChromatic(["DS5 dawn", "Pentaho dawn"], 5000),
  },
  render: (args, context: any) => {
    const value = new Date("2023-01-01");
    return (
      <div className="flex gap-xs">
        <div className="grid w-340px">
          <HvDatePicker disabled label="Disabled" value={value} />
          <HvDatePicker readOnly label="Read-only" value={value} />
          <HvDatePicker
            label="Invalid"
            status="invalid"
            statusMessage="This is an invalid date"
            value={value}
          />
          <HvDatePicker required label="Required" value={value} expanded />
        </div>
        <div>{WithSelectionList.render?.({ expanded: true }, context)}</div>
      </div>
    );
  },
};
