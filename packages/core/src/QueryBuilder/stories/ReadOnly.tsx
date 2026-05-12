import {
  HvQueryBuilder,
  type HvQueryBuilderQueryGroup,
} from "@hitachivantara/uikit-react-core";

const attributes = {
  price: {
    label: "Price",
    type: "numeric",
  },
  category: {
    label: "Category",
    type: "text",
  },
  in_stock: {
    label: "In stock",
    type: "boolean",
  },
  release: {
    label: "Release",
    type: "dateandtime",
  },
};

const initialQuery = {
  combinator: "and",
  rules: [
    {
      attribute: "price",
      operator: "lessThan",
      value: 10,
    },
    {
      combinator: "and",
      rules: [
        {
          attribute: "in_stock",
          operator: "equalsTo",
          value: true,
        },
        {
          attribute: "release",
          operator: "greaterThan",
          value: {
            date: "2021-01-01",
            time: "00:00:00",
          },
        },
      ],
    },
    {
      attribute: "category",
      operator: "IsNotEmpty",
    },
  ],
} satisfies HvQueryBuilderQueryGroup;

export const ReadOnly = () => (
  <HvQueryBuilder
    readOnly
    attributes={attributes}
    defaultValue={initialQuery}
  />
);
