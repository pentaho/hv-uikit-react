import { useTranslation } from "react-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  HvAppShellHelp,
} from "@hitachivantara/app-shell-shared";
import { HvIconButton } from "@hitachivantara/uikit-react-core";

import IconUiKit from "../../../IconUiKit";

const HelpButton: React.FC<HvAppShellHelp> = ({ url, description }) => {
  const { t } = useTranslation(undefined, { keyPrefix: "header.helpUrl" });
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE);

  if (!url) {
    return null;
  }

  const finalUrl = url.includes(":") ? url : tConfig(url);

  const finalDescription = description
    ? tConfig(description)
    : t("documentationLink");

  return (
    <HvIconButton
      component="a"
      href={finalUrl}
      target="_blank"
      title={finalDescription}
      rel="noopener,noreferrer"
    >
      <IconUiKit name="Help" />
    </HvIconButton>
  );
};

export default HelpButton;
