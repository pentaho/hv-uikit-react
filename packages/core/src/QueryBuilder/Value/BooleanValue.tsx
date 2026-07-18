/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import { HvDropdown } from "../../Dropdown";
import { useQueryBuilderContext } from "../Context";
import { isBigList } from "../utils";

export interface BooleanValueProps {
  id: React.Key;
  value?: boolean;
}

export const BooleanValue = ({ id, value = true }: BooleanValueProps) => {
  const { labels, dispatchAction, readOnly } = useQueryBuilderContext();

  const values = ["true", "false"].map((v) => ({
    id: v,
    label: labels.rule.value.boolean.options[v],
    selected: value === (v === "true"),
  }));

  return (
    <HvDropdown
      required
      status="valid"
      singleSelectionToggle={false}
      label={labels.rule.value.boolean.label}
      placeholder={labels.rule.value.boolean.placeholder}
      values={values}
      readOnly={readOnly}
      onChange={(selected) => {
        if (selected?.id) {
          dispatchAction({
            type: "set-value",
            id,
            value: selected.id === "true",
          });
        } else {
          dispatchAction({ type: "set-value", id, value: null });
        }
      }}
      showSearch={isBigList(values)}
      {...(isBigList(values) && { virtualized: true, height: 300 })}
    />
  );
};
