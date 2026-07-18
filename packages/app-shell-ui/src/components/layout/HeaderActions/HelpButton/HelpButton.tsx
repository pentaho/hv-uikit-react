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
import { useTranslation } from "react-i18next";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellRuntimeContext,
  type HvAppShellHelp,
} from "@hitachivantara/app-shell-shared";
import { HvIconButton } from "@hitachivantara/uikit-react-core";

import IconUiKit from "../../../IconUiKit/IconUiKit";

const HelpButton: React.FC<HvAppShellHelp> = ({ url, description }) => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "header.helpUrl",
  });
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE, {
    i18n,
  });

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
