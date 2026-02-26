import type { HvAppShellMenuConfig } from "@hitachivantara/app-shell-shared";
import { HvIconContainer } from "@hitachivantara/uikit-react-core";

import IconUiKit from "./IconUiKit";

export interface MenuIconProps {
  icon?: HvAppShellMenuConfig["icon"];
}

export function MenuIcon({ icon }: MenuIconProps) {
  if (!icon) return null;

  if (icon.iconType === "unocss") {
    return (
      <HvIconContainer size="sm" style={{ margin: 4 }}>
        <div className={icon.name} />
      </HvIconContainer>
    );
  }

  if (icon.iconType === "uikit") {
    return <IconUiKit name={icon.name} />;
  }

  // default no nothing
  return null;
}
