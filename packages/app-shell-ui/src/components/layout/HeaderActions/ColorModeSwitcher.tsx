import { useTranslation } from "react-i18next";
import {
  HvAppShellEventThemeTrigger,
  type HvAppShellEventTheme,
} from "@hitachivantara/app-shell-events";
import { useHvAppShellRuntimeContext } from "@hitachivantara/app-shell-shared";
import { HvIconButton, useTheme } from "@hitachivantara/uikit-react-core";

import IconUiKit from "../../IconUiKit/IconUiKit";

const ColorModeSwitcher: React.FC = () => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "header.colorModeSwitcher",
  });
  const { colorModes } = useTheme();

  const changeColorModeHandler = () => {
    const customEvent = new CustomEvent<HvAppShellEventTheme>(
      HvAppShellEventThemeTrigger,
      {
        detail: {
          colorMode: undefined,
        },
      },
    );
    globalThis.dispatchEvent(customEvent);
  };

  return colorModes.length > 1 ? (
    <HvIconButton onClick={changeColorModeHandler} title={t("ariaLabel")}>
      <IconUiKit name="ThemeSwitcher" />
    </HvIconButton>
  ) : null;
};

export default ColorModeSwitcher;
