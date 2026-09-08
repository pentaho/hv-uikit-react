import { useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellModel,
  useHvAppShellRuntimeContext,
  type HvAppShellAppSwitcherConfig,
  type HvAppShellAppSwitcherItemConfig,
} from "@pentaho/app-shell-shared";
import {
  HvAppSwitcher,
  HvIconButton,
  HvTypography,
  SvgBase,
  theme,
  type HvAppSwitcherActionApplication,
} from "@pentaho/uikit-react-core";

import createAppContainerElement from "../../../../utils/documentUtil";
import { ConfigIcon } from "../../../ConfigIcon";
import { BrandLogo } from "../../BrandLogo/BrandLogo";
import StyledAppShellPanelWrapper from "./styles";

const AppSwitcher = () => (
  <SvgBase viewBox="0 0 16 16">
    <path d="M0 0h4v4H0zm0 10h4V6H0zm0 6h4v-4H0zM6 4h4V0H6zm0 6h4V6H6zm0 6h4v-4H6zm6-12h4V0h-4zm0 6h4V6h-4zm0 6h4v-4h-4z" />
  </SvgBase>
);

const AppSwitcherToggle: React.FC<HvAppShellAppSwitcherConfig> = ({
  title,
  apps,
  showLogo = false,
}) => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "header.appSwitcher",
  });
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE, {
    i18n,
  });
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const appSwitcherPanelId = useId();
  const { logo } = useHvAppShellModel();

  /** Creates the apps list to be sent to the HvAppSwitcherPanel. */
  const appsList = useMemo<HvAppSwitcherActionApplication[]>(() => {
    if (!apps) return [];
    return apps.map((app: HvAppShellAppSwitcherItemConfig) => ({
      name: tConfig(app.label),
      description: app.description
        ? tConfig(app.description).toString()
        : undefined,
      url: app.url?.includes(":") ? app.url : tConfig(app.url).toString(),
      target: app.target === "NEW" ? "_blank" : "_top",
      iconElement: app.icon && <ConfigIcon icon={app.icon} />,
    }));
  }, [apps, tConfig]);

  if (!apps || apps.length === 0) return null;

  const finalTitle: string = title ? tConfig(title) : t("title");

  return (
    <ClickAwayListener onClickAway={() => setIsPanelOpen(false)}>
      <div style={{ display: "flex", margin: 0 }}>
        <HvIconButton
          title={finalTitle}
          aria-expanded={isPanelOpen}
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          {...(isPanelOpen && { "aria-controls": appSwitcherPanelId })}
        >
          <AppSwitcher />
          {showLogo && (
            <BrandLogo logo={logo} style={{ paddingRight: theme.space.xs }} />
          )}
        </HvIconButton>
        {isPanelOpen &&
          createPortal(
            <StyledAppShellPanelWrapper
              id={appSwitcherPanelId}
              role="region"
              aria-label={t("ariaLabel")}
            >
              <HvAppSwitcher
                applications={appsList}
                onActionClickedCallback={() => setIsPanelOpen(false)}
                header={
                  <HvTypography variant="label">{finalTitle}</HvTypography>
                }
              />
            </StyledAppShellPanelWrapper>,
            createAppContainerElement(),
          )}
      </div>
    </ClickAwayListener>
  );
};

export default AppSwitcherToggle;
