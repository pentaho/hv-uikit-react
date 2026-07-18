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
import type { HvAppShellIcon } from "@hitachivantara/app-shell-shared";
import { HvIconContainer } from "@hitachivantara/uikit-react-core";

import IconUiKit from "./IconUiKit/IconUiKit";

export interface ConfigIconProps {
  icon?: HvAppShellIcon;
}

/** Renders the icons according to the {@link HvAppShellIcon} Config specification */
export function ConfigIcon({ icon }: ConfigIconProps) {
  if (icon?.iconType === "unocss") {
    return (
      // TODO(minor): remove once "uikit" & ""unocss" icon types aren't used interchangeably
      <HvIconContainer size="sm" style={{ margin: 4 }}>
        <div className={icon.name} />
      </HvIconContainer>
    );
  }

  if (icon?.iconType === "uikit") {
    return <IconUiKit name={icon.name} />;
  }

  return null;
}
