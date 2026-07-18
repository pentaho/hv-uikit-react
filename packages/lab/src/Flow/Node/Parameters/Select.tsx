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
import { useState } from "react";
import {
  HvDropdown,
  type HvDropdownProps,
} from "@hitachivantara/uikit-react-core";

import { useFlowNodeUtils } from "../../hooks";
import type { HvFlowNodeSelectParam } from "../../types";

interface SelectProps {
  param: Omit<HvFlowNodeSelectParam, "type">;
  data: any;
}

const Select = ({ param, data }: SelectProps) => {
  const { id, label, multiple = false, options } = param;
  const { setNodeData } = useFlowNodeUtils();

  const [opts, setOpts] = useState<string[] | undefined>(
    data[id] ? (Array.isArray(data[id]) ? data[id] : [data[id]]) : undefined,
  );

  const handleChange: HvDropdownProps["onChange"] = (item) => {
    const newOpts = Array.isArray(item)
      ? item.map((x) => x.id as string)
      : ((item?.id as string) ?? undefined);

    setNodeData((prev) => ({ ...prev, [id]: newOpts }));
    setOpts(
      newOpts ? (Array.isArray(newOpts) ? newOpts : [newOpts]) : undefined,
    );
  };

  return (
    <HvDropdown
      className="nodrag" // Prevents dragging within the select field
      disablePortal
      label={label}
      values={options?.map((option) => {
        const optionId = typeof option === "string" ? option : option.id;
        const optionLabel = typeof option === "string" ? option : option.label;

        return {
          id: optionId,
          label: optionLabel,
          selected: !!opts?.find((opt) => opt === optionId),
        };
      })}
      onChange={handleChange}
      maxHeight={100}
      multiSelect={multiple}
    />
  );
};

export default Select;
