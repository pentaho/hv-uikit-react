import { createContext, useContext } from "react";

import {
  AskAction,
  HvQueryBuilderAttribute,
  HvQueryBuilderLabels,
  HvQueryBuilderQueryCombinator,
  HvQueryBuilderQueryOperator,
  HvQueryBuilderRenderers,
  QueryAction,
} from "./types";

export const defaultOperators = {
  numeric: [
    {
      operator: "greaterThan",
      label: "Greater than (>)",
      combinators: ["and"],
    },
    {
      operator: "lessThan",
      label: "Less than (<)",
      combinators: ["and"],
    },
    {
      operator: "equalsTo",
      label: "Equal to (=)",
      combinators: ["and", "or"],
    },
    {
      operator: "greaterThanEq",
      label: "Greater than or equal to (>=)",
      combinators: ["and"],
    },
    {
      operator: "lessThanEq",
      label: "Less than or equal to (<=)",
      combinators: ["and"],
    },
    {
      operator: "notEqual",
      label: "Not equal to (!=)",
      combinators: ["and"],
    },
    {
      operator: "range",
      label: "Range",
      combinators: ["and"],
    },
  ],
  text: [
    {
      operator: "equals",
      label: "Equals",
      combinators: ["and", "or"],
    },
    {
      operator: "equalsIgnoreCase",
      label: "Equals Ignore Case",
      combinators: ["and", "or"],
    },
    {
      operator: "Contains",
      label: "Contains",
      combinators: ["and", "or"],
    },
    {
      operator: "StartsWith",
      label: "A string begins with",
      combinators: ["and", "or"],
    },
    {
      operator: "EndsWith",
      label: "A string ends with",
      combinators: ["and", "or"],
    },
    {
      operator: "IsNotEmpty",
      label: "Is Not empty",
      combinators: ["and"],
    },
    {
      operator: "IsNot",
      label: "Is Not",
      combinators: ["and"],
    },
    {
      operator: "Empty",
      label: "Empty",
      combinators: ["and"],
    },
  ],
  textarea: [
    {
      operator: "equals",
      label: "Equals",
      combinators: ["and", "or"],
    },
    {
      operator: "equalsIgnoreCase",
      label: "Equals Ignore Case",
      combinators: ["and", "or"],
    },
    {
      operator: "Contains",
      label: "Contains",
      combinators: ["and", "or"],
    },
    {
      operator: "StartsWith",
      label: "A string begins with",
      combinators: ["and", "or"],
    },
    {
      operator: "EndsWith",
      label: "A string ends with",
      combinators: ["and", "or"],
    },
    {
      operator: "IsNotEmpty",
      label: "Is Not empty",
      combinators: ["and"],
    },
    {
      operator: "IsNot",
      label: "Is Not",
      combinators: ["and"],
    },
    {
      operator: "Empty",
      label: "Empty",
      combinators: ["and"],
    },
  ],
  boolean: [
    {
      operator: "equalsTo",
      label: "=",
      combinators: ["and", "or"],
    },
  ],
  dateandtime: [
    {
      operator: "greaterThan",
      label: "Greater than",
      combinators: ["and"],
    },
    {
      operator: "lessThan",
      label: "Less than",
      combinators: ["and"],
    },
    {
      operator: "equalsTo",
      label: "Equal to",
      combinators: ["and", "or"],
    },
    {
      operator: "greaterThanEq",
      label: "Greater than or equal to",
      combinators: ["and"],
    },
    {
      operator: "lessThanEq",
      label: "Less than or equal to",
      combinators: ["and"],
    },
    {
      operator: "notEqual",
      label: "Not equal to",
      combinators: ["and"],
    },
    {
      operator: "range",
      label: "Range",
      combinators: ["and"],
    },
  ],
};

export const defaultCombinators = [
  { operand: "and", label: "AND" },
  { operand: "or", label: "OR" },
];

export const defaultLabels: HvQueryBuilderLabels = {
  query: {
    delete: {
      tooltip: "Reset query",
      dialogTitle: "Remove all conditions?",
      dialogMessage:
        "Are you sure you want to remove all the conditions? They will be removed permanently.",
      dialogConfirm: "Yes",
      dialogCancel: "No",
      dialogCloseTooltip: "Close",
    },
    addRule: {
      label: "Add condition",
    },
    addGroup: {
      label: "Add group",
    },
  },
  rule: {
    attribute: {
      label: "Attribute",
      placeholder: "Select attribute...",
      exists: "Attribute already exists.",
    },
    operator: {
      label: "Operator",
      placeholder: "Select operator...",
    },
    value: {
      distance: {
        label: "Value",
        connectorText: "radius miles from",
        button: "Select location",
        validation: {
          required: "The value is required.",
          invalid: "Value must be a positive number.",
        },
      },
      text: {
        label: "Value",
        placeholder: "Enter value...",
        validation: {
          required: "The value is required.",
        },
      },
      boolean: {
        label: "Value",
        placeholder: "Enter value",
        options: {
          true: "True",
          false: "False",
        },
      },
      numeric: {
        label: "Value",
        placeholder: "Enter value",
        validation: {
          required: "The value is required.",
          invalid: "Value must be a number.",
          equal: "Cannot be equal.",
          greaterThan: "Needs to be greater.",
        },
        range: {
          leftLabel: "From",
          rightLabel: "To",
        },
      },
      datetime: {
        dateLabel: "Date",
        datePlaceholder: "Select Date",
        timeLabel: "Time",
        timePlaceholder: "Select Time",
        startDateLabel: "Start Date",
        startDatePlaceholder: "Select Start Date",
        startTimeLabel: "Start Time",
        startTimePlaceholder: "Select Start Time",
        endDateLabel: "End Date",
        endDatePlaceholder: "Select End Date",
        endTimeLabel: "End Time",
        endTimePlaceholder: "Select End Time",
        validation: {
          required: "The value is required.",
          invalidInterval:
            "End date and time must be after start date and time.",
        },
      },
    },
    delete: {
      tooltip: "Remove condition",
      dialogTitle: "Remove condition?",
      dialogMessage:
        "Are you sure you want to remove the condition? It will be removed permanently.",
      dialogConfirm: "Yes",
      dialogCancel: "No",
      dialogCloseTooltip: "Close",
    },
  },
  group: {
    delete: {
      tooltip: "Remove group",
      dialogTitle: "Remove group?",
      dialogMessage:
        "Are you sure you want to remove the group? It will be removed permanently.",
      dialogConfirm: "Yes",
      dialogCancel: "No",
      dialogCloseTooltip: "Close",
    },
    reset: {
      tooltip: "Change operator",
      dialogTitle: "Change conditional operator?",
      dialogMessage:
        "Do you want to change conditional operator? You won't be able to undo this operation. Conditions and/or groups will be removed.",
      dialogConfirm: "Yes",
      dialogCancel: "No",
      dialogCloseTooltip: "Close",
    },
    addRule: {
      label: "Add condition",
    },
    addGroup: {
      label: "Add group",
    },
  },
  empty: {
    title: "No conditions created yet",
    createCondition: "Create a condition",
    createGroup: "condition group",
    spacer: " or a ",
  },
};

export interface HvQueryBuilderContextValue {
  dispatchAction: React.Dispatch<QueryAction>;
  askAction: React.Dispatch<React.SetStateAction<AskAction | undefined>>;
  attributes?: Record<string, HvQueryBuilderAttribute>;
  operators: Record<string, HvQueryBuilderQueryOperator[]>;
  combinators: HvQueryBuilderQueryCombinator[];
  maxDepth: number;
  labels: HvQueryBuilderLabels;
  initialTouched: boolean;
  readOnly: boolean;
  disableConfirmation: boolean;
  allowRepeatedAttributes?: boolean;
  renderers?: HvQueryBuilderRenderers;
  emptyRenderer?: string[];
}

export const HvQueryBuilderContext = createContext<HvQueryBuilderContextValue>({
  dispatchAction: () => ({}),
  askAction: () => ({}),
  attributes: {},
  operators: defaultOperators,
  combinators: defaultCombinators,
  maxDepth: 1,
  labels: defaultLabels,
  initialTouched: false,
  disableConfirmation: false,
  allowRepeatedAttributes: false,
  readOnly: false,
});

export interface HvQueryBuilderProviderProps {
  value: HvQueryBuilderContextValue;
  children: React.ReactNode;
}

export const HvQueryBuilderProvider = ({
  children,
  value,
}: HvQueryBuilderProviderProps) => {
  return (
    <HvQueryBuilderContext.Provider value={value}>
      {children}
    </HvQueryBuilderContext.Provider>
  );
};

export const useQueryBuilderContext = () => {
  return useContext(HvQueryBuilderContext);
};
