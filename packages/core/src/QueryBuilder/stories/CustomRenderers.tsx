import { useEffect, useMemo } from "react";
import { css } from "@emotion/css";
import {
  HvDropdown,
  HvQueryBuilder,
  hvQueryBuilderDefaultOperators,
  HvSlider,
  HvTagsInput,
  theme,
  useQueryBuilderContext,
  type HvQueryBuilderProps,
  type HvQueryBuilderRendererProps,
  type HvTagsInputProps,
} from "@hitachivantara/uikit-react-core";

const attributes: HvQueryBuilderProps["attributes"] = {
  month: {
    label: "Month",
    type: "select",
  },
  weekday: {
    label: "Weekday",
    type: "select",
  },
  name: {
    label: "Name",
    type: "text",
  },
  age: {
    label: "Age",
    type: "slider",
  },
};

const operators = {
  text: [...hvQueryBuilderDefaultOperators.text],
  select: [
    {
      operator: "equalsTo",
      label: "Equal to (=)",
      combinators: ["and", "or"],
    },
    {
      operator: "notEqual",
      label: "Not equal to (!=)",
      combinators: ["and"],
    },
    {
      operator: "range",
      label: "Range",
      combinators: ["and", "or"],
    },
    {
      operator: "Empty",
      label: "Empty",
      combinators: ["and", "or"],
    },
  ],
  slider: [
    {
      operator: "equalsTo",
      label: "Equal to (=)",
      combinators: ["and", "or"],
    },
    {
      operator: "notEqual",
      label: "Not equal to (!=)",
      combinators: ["and"],
    },
    {
      operator: "Empty",
      label: "Empty",
      combinators: ["and", "or"],
    },
  ],
};

const selectRenderers = {
  month: {
    values: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    label: "Month",
    labelStart: "Start month",
    labelEnd: "End month",
    placeholder: "Select a month",
  },
  weekday: {
    values: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    label: "Weekday",
    labelStart: "Start weekday",
    labelEnd: "End weekday",
    placeholder: "Select a weekday",
  },
};

const classes = {
  selectRoot: css({
    display: "flex",
    gap: theme.space.xs,
  }),
};

type SelectValue = string | { start?: string; end?: string };

const SelectRenderer = ({
  id,
  operator,
  value,
  attribute: attributeProp,
}: HvQueryBuilderRendererProps<SelectValue>) => {
  const { dispatchAction } = useQueryBuilderContext();

  const attribute = attributeProp as keyof typeof selectRenderers;

  const values = useMemo(
    () =>
      selectRenderers[attribute].values.map((val) => ({
        id: val,
        label: val,
      })),
    [attribute],
  );

  const handleUpdateRange = (type: "start" | "end", val?: string) => {
    if (typeof value !== "string") {
      const newValue = {
        start: value?.start,
        end: value?.end,
      };
      newValue[type] = val;

      dispatchAction({
        type: "set-value",
        id,
        value: newValue,
      });
    }
  };

  if (operator === "range") {
    return (
      <div className={classes.selectRoot}>
        <HvDropdown
          required
          label={selectRenderers[attribute].labelStart}
          placeholder={selectRenderers[attribute].placeholder}
          values={values}
          onChange={(selected) => {
            handleUpdateRange("start", selected?.id);
          }}
          maxHeight={200}
        />
        <HvDropdown
          required
          label={selectRenderers[attribute].labelEnd}
          placeholder={selectRenderers[attribute].placeholder}
          values={values}
          onChange={(selected) => {
            handleUpdateRange("end", selected?.id);
          }}
          maxHeight={200}
        />
      </div>
    );
  }

  return (
    <HvDropdown
      required
      label={selectRenderers[attribute].label}
      placeholder={selectRenderers[attribute].placeholder}
      values={values}
      onChange={(selected) => {
        dispatchAction({
          type: "set-value",
          id,
          value: selected?.id || null,
        });
      }}
      maxHeight={200}
    />
  );
};

const sliderRenderers = {
  age: {
    label: "Age (years)",
  },
};

const SliderRenderer = ({
  id,
  attribute: attributeProp,
}: HvQueryBuilderRendererProps<SelectValue>) => {
  const { dispatchAction } = useQueryBuilderContext();
  const attribute = attributeProp as keyof typeof sliderRenderers;
  return (
    <HvSlider
      required
      label={sliderRenderers[attribute].label}
      onChange={(value) => {
        dispatchAction({
          type: "set-value",
          id,
          value: value ? value[0] : null,
        });
      }}
    />
  );
};

const textContainsRenderers = {
  name: {
    label: "Value",
  },
};

const TextContainsRenderer = ({
  id,
  attribute: attributeProp,
  value,
}: HvQueryBuilderRendererProps<HvTagsInputProps["value"] | string>) => {
  const { dispatchAction } = useQueryBuilderContext();

  const attribute = attributeProp as keyof typeof textContainsRenderers;

  // Clear value when "Contains" is unselected and the renderer unmounts
  useEffect(() => {
    return () => {
      dispatchAction({
        type: "set-value",
        id,
        value: null,
      });
    };
  }, [dispatchAction, id]);

  return (
    <HvTagsInput
      label={textContainsRenderers[attribute].label}
      defaultValue={
        typeof value === "string" ? [{ label: value, type: "semantic" }] : value
      }
      onChange={(event, tags) => {
        dispatchAction({
          type: "set-value",
          id,
          value: tags.length > 0 ? tags : null,
        });
      }}
    />
  );
};

const renderers = {
  // Renderers for the custom attribute types "select" and "slider"
  select: SelectRenderer,
  slider: SliderRenderer,

  // Renderer to customize the "Contains" operator of the "text" attribute type
  text: {
    Contains: TextContainsRenderer,
  },
};

export const CustomRenderers = () => (
  <HvQueryBuilder
    attributes={attributes}
    operators={operators}
    renderers={renderers}
    maxDepth={0}
  />
);
