import {
  HvQueryBuilder,
  type HvQueryBuilderProps,
} from "@hitachivantara/uikit-react-core";

const attributes = {
  key1: {
    label: "Numeric",
    type: "numeric",
  },
  key2: {
    label: "Text",
    type: "text",
  },
  key3: {
    label: "Text Area",
    type: "textarea",
  },
  key4: {
    label: "Boolean",
    type: "boolean",
  },
  key5: {
    label: "Date & Time",
    type: "dateandtime",
  },
};

export const Main = (props: HvQueryBuilderProps) => (
  <HvQueryBuilder {...props} attributes={attributes} />
);
