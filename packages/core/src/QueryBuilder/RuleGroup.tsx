import { useCallback } from "react";
import type { ExtractNames } from "@hitachivantara/uikit-react-utils";

import { HvButton } from "../Button";
import { HvEmptyState } from "../EmptyState";
import { HvIconButton } from "../IconButton";
import { HvIcon } from "../icons";
import { HvMultiButton } from "../MultiButton";
import { HvTypography } from "../Typography";
import { useQueryBuilderContext } from "./Context";
import { useClasses } from "./QueryBuilder.styles";
import { Rule } from "./Rule/Rule";
import { HvQueryBuilderQueryCombinator, Query } from "./types";

export interface RuleGroupProps {
  id: React.Key;
  level?: number;
  combinator?: string;
  rules?: Query["rules"];
  classes?: ExtractNames<typeof useClasses>;
}

export const RuleGroup = ({
  level = 0,
  id,
  combinator = "and",
  rules = [],
  classes: classesProp,
}: RuleGroupProps) => {
  const { classes, cx } = useClasses(classesProp);

  const {
    dispatchAction,
    askAction,
    maxDepth,
    combinators,
    labels,
    readOnly,
    disableConfirmation,
    allowRepeatedAttributes,
  } = useQueryBuilderContext();

  const normalizedMaxDepth = maxDepth - 1;

  const actionButtons = (
    <>
      <div className={classes.buttonBackground}>
        <HvButton
          variant="secondarySubtle"
          onClick={() => {
            dispatchAction({ type: "add-rule", id });
          }}
          disabled={readOnly}
          startIcon={<HvIcon compact name="Add" />}
        >
          {level === 0 && labels.query?.addRule?.label != null
            ? labels.query?.addRule?.label
            : labels.group.addRule.label}
        </HvButton>
      </div>
      {level <= normalizedMaxDepth && (
        <div className={classes.buttonBackground}>
          <HvButton
            variant="secondarySubtle"
            onClick={() => {
              dispatchAction({ type: "add-group", id });
            }}
            disabled={readOnly}
            startIcon={<HvIcon compact name="Add" />}
          >
            {level === 0 && labels.query?.addGroup?.label != null
              ? labels.query?.addGroup?.label
              : labels.group.addGroup.label}
          </HvButton>
        </div>
      )}
    </>
  );

  const onClickCombinator = useCallback(
    (item: HvQueryBuilderQueryCombinator) => {
      dispatchAction({
        type: "set-combinator",
        id,
        combinator: item.operand,
      });
    },
    [dispatchAction, id],
  );

  return (
    <div
      className={cx(classes.root, {
        [classes.topGroup]: level === 0,
        [classes.subGroup]: level > 0,
      })}
    >
      <HvMultiButton
        className={cx(classes.combinator, classes.topCombinator)}
        disabled={readOnly}
        aria-disabled={readOnly}
      >
        {combinators?.map((item) => (
          <HvButton
            key={item.operand}
            className={classes.combinatorButton}
            selected={item.operand === combinator}
            onClick={() => item.operand && onClickCombinator(item)}
            disabled={readOnly}
            size="xs"
          >
            {item.label}
          </HvButton>
        ))}
      </HvMultiButton>
      <div className={cx(classes.buttonBackground, classes.topRemoveButton)}>
        <HvIconButton
          className={classes.removeButton}
          onClick={() =>
            disableConfirmation
              ? dispatchAction({ type: "remove-node", id })
              : askAction({
                  actions: [{ type: "remove-node", id }],
                  dialog:
                    level === 0 && labels.query?.delete != null
                      ? labels.query.delete
                      : labels.group.delete,
                })
          }
          title={
            (level === 0 && labels.query?.delete?.tooltip) ||
            labels.group.delete.tooltip
          }
          disabled={readOnly}
        >
          <HvIcon
            name="Delete"
            className={cx({ [classes.topRemoveButtonDisabled]: readOnly })}
          />
        </HvIconButton>
      </div>
      {rules?.length > 0 && (
        <div
          className={cx(classes.rulesContainer, {
            [classes.subRulesContainer]: level > 0,
            [classes.topRulesContainer]: level === 0,
          })}
        >
          {rules.map((rule, index) => {
            if ("combinator" in rule) {
              return (
                <RuleGroup
                  key={rule.id}
                  level={level + 1}
                  {...rule}
                  id={rule.id}
                  classes={classes}
                />
              );
            }

            const isInvalid = allowRepeatedAttributes
              ? false
              : combinator === "and" &&
                rules.some((r, i) => {
                  if ("attribute" in r) {
                    if (
                      r.attribute === rule.attribute &&
                      r.id !== rule.id &&
                      i < index
                    ) {
                      return true;
                    }
                  }
                  return false;
                });

            return (
              <Rule
                key={rule.id}
                {...rule}
                isInvalid={isInvalid}
                id={rule.id}
                combinator={combinator}
              />
            );
          })}
        </div>
      )}
      {rules?.length === 0 && (
        <HvEmptyState
          title={labels.empty?.title}
          message={
            <>
              <HvTypography
                link
                component="button"
                onClick={() => {
                  dispatchAction({ type: "add-rule", id });
                }}
                className={classes.createConditionButton}
                disabled={readOnly}
                aria-disabled={readOnly}
              >
                {`${labels.empty?.createCondition}`}
              </HvTypography>
              {level <= normalizedMaxDepth && (
                <>
                  {`${labels.empty?.spacer}`}
                  <HvTypography
                    link
                    component="button"
                    onClick={() => {
                      dispatchAction({ type: "add-group", id });
                    }}
                    className={classes.createGroupButton}
                    disabled={readOnly}
                    aria-disabled={readOnly}
                  >
                    {`${labels.empty?.createGroup}`}
                  </HvTypography>
                </>
              )}
            </>
          }
          icon={<HvIcon name="Info" />}
        />
      )}
      <div
        className={cx(
          classes.actionButtonContainer,
          classes.topActionButtonContainer,
        )}
      >
        {actionButtons}
      </div>
    </div>
  );
};
