import { useMemo } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  useDefaultProps,
  type ExtractNames,
} from "@hitachivantara/uikit-react-utils";

import { HvGrid } from "../../Grid";
import { HvIconButton } from "../../IconButton";
import { HvIcon } from "../../icons";
import { useQueryBuilderContext } from "../Context";
import { Value } from "../Value/Value";
import { Attribute } from "./Attribute";
import { Operator } from "./Operator";
import { useClasses } from "./Rule.styles";

export interface RuleProps {
  id: React.Key;
  combinator: string;
  attribute?: string;
  operator?: string;
  value?: any;
  disabled?: boolean;
  isInvalid: boolean;
  classes?: ExtractNames<typeof useClasses>;
}

export const Rule = (props: RuleProps) => {
  const {
    id,
    combinator,
    attribute,
    operator,
    value,
    disabled,
    isInvalid,
    classes: classesProp,
  } = useDefaultProps("HvQueryBuilderRule", props);

  const { classes, cx } = useClasses(classesProp);

  const {
    askAction,
    dispatchAction,
    attributes,
    operators,
    labels,
    readOnly,
    disableConfirmation,
  } = useQueryBuilderContext();

  const theme = useTheme();

  const isMdDown = useMediaQuery(theme.breakpoints.down("md"));

  const availableOperators = useMemo(() => {
    const attributeSpec =
      attribute != null && attributes ? attributes[attribute] : null;
    if (attributeSpec != null) {
      const typeOperators = operators[attributeSpec.type];
      if (typeOperators != null) {
        return typeOperators.reduce(
          (count, item) =>
            count + (item.combinators.includes(combinator) ? 1 : 0),
          0,
        );
      }
    }

    return -1;
  }, [attribute, attributes, combinator, operators]);

  return (
    <HvGrid
      container
      className={cx(classes.root, { [classes.isMdDown]: isMdDown })}
      spacing={0}
    >
      <HvGrid item xs={12} md={3}>
        <Attribute
          attribute={attribute}
          id={id}
          disabled={disabled}
          isInvalid={isInvalid}
        />
      </HvGrid>
      {attribute != null && availableOperators > 0 && (
        <HvGrid item xs={12} md={3}>
          <Operator
            id={id}
            combinator={combinator}
            attribute={attribute}
            operator={operator}
          />
        </HvGrid>
      )}
      {attribute != null && (operator != null || availableOperators === 0) && (
        <HvGrid item xs={12} md>
          <Value
            attribute={attribute}
            id={id}
            operator={operator}
            value={value}
          />
        </HvGrid>
      )}
      <HvGrid item className={classes.actionsContainer}>
        <HvIconButton
          placement="bottom"
          title={labels.rule.delete.tooltip}
          onClick={() =>
            disableConfirmation
              ? dispatchAction({ type: "remove-node", id })
              : askAction({
                  actions: [{ type: "remove-node", id }],
                  dialog: labels.rule.delete,
                })
          }
          disabled={readOnly}
        >
          <HvIcon name="Delete" />
        </HvIconButton>
      </HvGrid>
    </HvGrid>
  );
};
