import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { useControlled } from "../hooks/useControlled";
import { useLabels } from "../hooks/useLabels";
import { DeepPartial } from "../types/generic";
import { isEqual } from "../utils/helpers";
import { ConfirmationDialog } from "./ConfirmationDialog";
import {
  defaultCombinators,
  defaultLabels,
  defaultOperators,
  HvQueryBuilderProvider,
} from "./Context";
import { staticClasses, useClasses } from "./QueryBuilder.styles";
import { RuleGroup } from "./RuleGroup";
import {
  AskAction,
  defaultRendererKey,
  HvQueryBuilderAttribute,
  HvQueryBuilderLabels,
  HvQueryBuilderQuery,
  HvQueryBuilderQueryCombinator,
  HvQueryBuilderQueryOperator,
  HvQueryBuilderRenderers,
} from "./types";
import { clearNodeIds, emptyGroup, setNodeIds } from "./utils";
import reducer from "./utils/reducer";

export { staticClasses as queryBuilderClasses };

export type HvQueryBuilderClasses = ExtractNames<typeof useClasses>;

export interface HvQueryBuilderProps {
  /** The query attribute types. */
  attributes?: Record<string, HvQueryBuilderAttribute>;
  /** The query rules operators by attribute type and combinator. */
  operators?: Record<string, HvQueryBuilderQueryOperator[]>;
  /** The query combinators operands. */
  combinators?: HvQueryBuilderQueryCombinator[];
  /** The query when the component is controlled. */
  value?: HvQueryBuilderQuery;
  /** The initial query when the component is uncontrolled. */
  defaultValue?: HvQueryBuilderQuery;
  /** Callback fired when the query changes. */
  onChange?: (value: HvQueryBuilderQuery) => void;
  /** Max depth of nested query groups. */
  maxDepth?: number;
  /** Object containing all the labels. */
  labels?: DeepPartial<HvQueryBuilderLabels>;
  /** Whether the query builder is in read-only mode. */
  readOnly?: boolean;
  /**
   * Operators that should use the empty value renderer when selected.
   *
   * When one of the listed operators is selected, the rule value is reset and an empty component is rendered.
   * This property takes priority over `renderers`.
   *
   * @default ["Empty", "IsNotEmpty"]
   * */
  emptyRenderer?: string[];
  /** Custom renderers for the rules' value. */
  renderers?: HvQueryBuilderRenderers;
  /** Whether to opt-out of the confirmation dialogs shown before removing rules and rule groups. @default false. */
  disableConfirmation?: boolean;
  /**
   * Whether to allow attributes to be repeated in AND conditions.
   * By default an error is shown when the selected attribute already exists in an AND conditions.
   * @default false
   */
  allowRepeatedAttributes?: boolean; // TODO - review in v6: should we even have this validation? if needed, we should review its behavior.
  /** A Jss Object used to override or extend the styles applied. */
  classes?: HvQueryBuilderClasses;
}

// TODO - v6
// - "range", "Empty", and "IsNotEmpty" operators with internal/built-in logic
// - review query builder validation

// Notes:
// Deep clone is needed throughout the component to avoid undesired mutations in props, state, and ref values

/**
 * This component allows you to create conditions and group them using logical operators.
 * It outputs a structured set of rules which can be easily parsed to create SQL/NoSQL/whatever queries.
 *
 * Take a look at the [usage page](https://pentaho.github.io/uikit-docs/master/components/query-builder) to learn more about this component.
 */
export const HvQueryBuilder = (props: HvQueryBuilderProps) => {
  const {
    attributes,
    renderers,
    value,
    defaultValue,
    onChange,
    disableConfirmation = false,
    allowRepeatedAttributes = false,
    operators = defaultOperators,
    combinators = defaultCombinators,
    maxDepth = 1,
    labels: labelsProp,
    readOnly = false,
    emptyRenderer = ["Empty", "IsNotEmpty"],
    classes: classesProp,
  } = useDefaultProps("HvQueryBuilder", props);

  if (
    import.meta.env.DEV &&
    [
      Object.values(attributes || {}).map(({ type }) => type),
      Object.values(operators || {}).flatMap((ops) =>
        ops.map(({ operator }) => operator),
      ),
    ]
      .flat()
      ?.find((key) => key === defaultRendererKey)
  ) {
    // eslint-disable-next-line no-console
    console.error(
      `${defaultRendererKey} is a restricted key and shouldn't be used as an attribute or operator type. Update the key to avoid unexpected behaviors.`,
    );
  }

  const { classes } = useClasses(classesProp);

  const currentAttributes = useRef<HvQueryBuilderProps["attributes"] | null>(
    null,
  );

  const controlled = useRef(value != null);
  const initialQuery = useRef(value ?? defaultValue ?? emptyGroup());
  const [query, setQuery] = useControlled(value, initialQuery.current);
  const prevQuery = useRef(query);

  const [pendingAction, setPendingAction] = useState<AskAction>();
  const [initialState, setInitialState] = useState(true);

  const [state, dispatchAction] = useReducer(
    reducer,
    setNodeIds(structuredClone(initialQuery.current)),
  );

  const labels = useLabels(defaultLabels, labelsProp);

  const contextValue = useMemo(
    () => ({
      dispatchAction,
      askAction: setPendingAction,
      attributes,
      operators,
      combinators,
      maxDepth,
      labels,
      initialTouched: initialState,
      readOnly,
      renderers,
      disableConfirmation,
      allowRepeatedAttributes,
      emptyRenderer,
    }),
    [
      attributes,
      operators,
      combinators,
      maxDepth,
      labels,
      readOnly,
      initialState,
      renderers,
      disableConfirmation,
      emptyRenderer,
      allowRepeatedAttributes,
    ],
  );

  // Keep track of attributes
  useEffect(() => {
    if (currentAttributes.current == null) {
      // First run, nothing to do
      currentAttributes.current = attributes;
    } else if (currentAttributes.current !== attributes) {
      // Attributes changed. The existing query is almost certainly invalid, so reset it
      currentAttributes.current = attributes;
      dispatchAction({ type: "reset-query" });
    }
  }, [attributes]);

  useEffect(() => {
    // "value" prop was updated by user (when controlled)
    if (!isEqual(prevQuery.current, query)) {
      dispatchAction({
        type: "set-query",
        query: setNodeIds(structuredClone(query), state),
      });
      prevQuery.current = query;
    } else if (
      !isEqual(
        clearNodeIds(structuredClone(state)),
        clearNodeIds(structuredClone(query)),
      )
    ) {
      setInitialState(false);

      // TODO - remove "true" from clearNodeIds in v6 (only keep else statement)
      // To avoid breaking changes, clearNodeIds will delete all ids provided by the user when uncontrolled
      // In the future if the user provides ids, it doesn't make sense to remove them with onChange
      if (!controlled.current) {
        onChange?.(
          clearNodeIds(structuredClone(state), true) as HvQueryBuilderQuery,
        );
      } else {
        // When controlled, the ids provided by the user are not removed. Only the auto generated ones.
        onChange?.(clearNodeIds(structuredClone(state)) as HvQueryBuilderQuery);
      }

      prevQuery.current = state;
      // This will only run if uncontrolled
      setQuery(state);
    }
  }, [onChange, query, setQuery, state]);

  const handleConfirm = () => {
    if (pendingAction) {
      setPendingAction(undefined);
      pendingAction.actions.forEach((action) => dispatchAction(action));
    }
  };

  const handleCancel = () => {
    setPendingAction(undefined);
  };

  return (
    <HvQueryBuilderProvider value={contextValue}>
      <RuleGroup
        level={0}
        id={state.id}
        combinator={state.combinator}
        rules={state.rules}
        classes={classes}
      />
      <ConfirmationDialog
        open={pendingAction != null}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title={pendingAction?.dialog.dialogTitle}
        message={pendingAction?.dialog.dialogMessage}
        confirmButtonLabel={pendingAction?.dialog.dialogConfirm}
        cancelButtonLabel={pendingAction?.dialog.dialogCancel}
        buttonTitle={pendingAction?.dialog.dialogCloseTooltip}
      />
    </HvQueryBuilderProvider>
  );
};
