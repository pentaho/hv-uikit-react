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
  HvBaseSwitch,
  HvButtonBase,
  theme,
} from "@hitachivantara/uikit-react-core";

export default function Demo() {
  const [checked, setChecked] = useState(false);

  return (
    <HvButtonBase
      className="relative items-center rounded-full [&_.HvBaseSwitch-root]:bg-transparent"
      onClick={() => setChecked((prev) => !prev)}
      component="div"
    >
      <HvBaseSwitch
        size="medium"
        value="on"
        checked={checked}
        aria-label="Switch"
        onChange={(_evt, newChecked) => setChecked(newChecked)}
        color={checked ? "warning" : "border"}
      />
      <div
        className="bg-white border-1 border-borderString rounded-full w-28px h-28px flex items-center justify-center absolute top-[calc-(50%-14px)] cursor-pointer transition-left duration-200 ease"
        style={{
          left: checked ? "calc(100% - 32px)" : "calc(0% + 4px)",
          borderColor: checked
            ? theme.colors.warning
            : theme.colors.borderStrong,
        }}
      >
        {checked ? <div className="i-ph-sun" /> : <div className="i-ph-moon" />}
      </div>
    </HvButtonBase>
  );
}
