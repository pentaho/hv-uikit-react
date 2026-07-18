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
import { useRef, useState } from "react";
import {
  HvBaseInput,
  HvButton,
  HvIconButton,
  HvTypography,
} from "@hitachivantara/uikit-react-core";
import { Check, Close, Edit } from "@hitachivantara/uikit-react-icons";

export default function Demo() {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [cachedValue, setCachedValue] = useState("John Doe");

  return editing ? (
    <form
      className="flex items-center gap-xs w-260px"
      onSubmit={(evt) => {
        evt.preventDefault();
        setCachedValue(inputRef.current?.value || "");
        setEditing(false);
      }}
      onReset={() => setEditing(false)}
    >
      <HvBaseInput ref={inputRef} autoFocus defaultValue={cachedValue} />
      <HvIconButton type="reset" size="xs" variant="negative" title="Cancel">
        <Close />
      </HvIconButton>
      <HvIconButton type="submit" size="xs" variant="positive" title="Save">
        <Check />
      </HvIconButton>
    </form>
  ) : (
    <div className="flex items-center gap-xs w-260px">
      <span className="capitalize">Name:</span>
      <HvTypography variant="label">{cachedValue}</HvTypography>
      <HvButton icon title="Edit" onClick={() => setEditing(true)}>
        <Edit />
      </HvButton>
    </div>
  );
}
