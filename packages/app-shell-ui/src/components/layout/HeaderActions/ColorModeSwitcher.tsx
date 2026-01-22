import { useTranslation } from "react-i18next";
import {
  HvAppShellEventTheme,
  HvAppShellEventThemeTrigger,
} from "@hitachivantara/app-shell-events";
import { HvIconButton, useTheme } from "@hitachivantara/uikit-react-core";

import IconUiKit from "../../IconUiKit";

const ColorModeSwitcher: React.FC = () => {
  const { t } = useTranslation(undefined, {
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
