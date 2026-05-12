import { useMemo } from "react";

import { HvDropdown } from "../../Dropdown";
import { useQueryBuilderContext } from "../Context";
import { isBigList } from "../utils";

export interface AttributeProps {
  id: React.Key;
  attribute?: string;
  disabled?: boolean;
  isInvalid?: boolean;
}

export const Attribute = ({
  id,
  attribute,
  disabled,
  isInvalid,
}: AttributeProps) => {
  const { dispatchAction, attributes, operators, labels, readOnly } =
    useQueryBuilderContext();

  const values = useMemo(() => {
    if (!attributes) return [];

    return Object.keys(attributes).map((key) => ({
      id: key,
      label: attributes[key].label,
      selected: key === attribute,
    }));
  }, [attributes, attribute]);

  const currentType =
    attribute != null && attributes ? attributes[attribute]?.type : null;

  return (
    <HvDropdown
      singleSelectionToggle={false}
      label={labels.rule.attribute.label}
      placeholder={labels.rule.attribute.placeholder}
      values={values}
      disabled={disabled}
      readOnly={readOnly}
      status={isInvalid ? "invalid" : "valid"}
      style={{ gridArea: "attribute" }}
      statusMessage={labels.rule.attribute.exists}
      onChange={(selected) => {
        if (selected) {
          const attributeId = selected.id;

          const type =
            attributes && attributeId && attributes[attributeId]?.type;
          const typeOperators = type ? operators[type] : undefined;

          let operator;
          if (currentType === type) {
            operator = undefined;
          } else if (typeOperators?.length === 1) {
            operator = typeOperators[0].operator;
          } else {
            operator = null;
          }

          // default boolean attributes to true
          const value = type === "boolean" ? true : undefined;

          dispatchAction({
            type: "set-attribute",
            id,
            attribute: attributeId?.toString(),
            operator,
            value,
          });
        } else {
          dispatchAction({ type: "set-attribute", id, attribute: null });
        }
      }}
      showSearch={isBigList(values)}
      {...(isBigList(values) && { virtualized: true, height: 300 })}
    />
  );
};
