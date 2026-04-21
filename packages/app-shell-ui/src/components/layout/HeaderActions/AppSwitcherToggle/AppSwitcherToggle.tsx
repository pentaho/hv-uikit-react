import { useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellModel,
  type HvAppShellAppSwitcherConfig,
  type HvAppShellAppSwitcherItemConfig,
  type UseDynamicApps,
} from "@hitachivantara/app-shell-shared";
import {
  HvAppSwitcher,
  HvAppSwitcherActionApplication,
  HvIconButton,
  HvTypography,
  theme,
} from "@hitachivantara/uikit-react-core";

import createAppContainerElement from "../../../../utils/documentUtil";
import IconUiKit from "../../../IconUiKit";
import { BrandLogo } from "../../BrandLogo/BrandLogo";
import StyledAppShellPanelWrapper from "./styles";

const useDynamicApps = (
  dynamicAppsConfig: HvAppShellAppSwitcherConfig["dynamicApps"],
): HvAppShellAppSwitcherItemConfig[] => {
  const { preloadedBundles } = useHvAppShellModel();

  const dynamicAppsHook = dynamicAppsConfig?.bundle
    ? (preloadedBundles.get(dynamicAppsConfig.bundle) as
        | UseDynamicApps
        | undefined)
    : undefined;

  const hookResult = dynamicAppsHook?.(dynamicAppsConfig?.config);

  if (!hookResult || hookResult.isPending || hookResult.error) return [];

  return hookResult.result ?? [];
};

const AppSwitcherToggle: React.FC<HvAppShellAppSwitcherConfig> = ({
  title,
  apps: staticApps,
  dynamicApps: dynamicAppsConfig,
  showLogo = false,
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "header.appSwitcher" });
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const appSwitcherPanelId = useId();
  const { logo } = useHvAppShellModel();

  const dynamicApps = useDynamicApps(dynamicAppsConfig);

  const apps = useMemo(
    () => [...(staticApps ?? []), ...dynamicApps],
    [staticApps, dynamicApps],
  );

  /** Creates the apps list to be sent to the HvAppSwitcherPanel. */
  const appsList = useMemo<HvAppSwitcherActionApplication[]>(() => {
    if (apps.length === 0) return [];
    return apps.map((app: HvAppShellAppSwitcherItemConfig) => ({
      name: tConfig(app.label),
      description: app.description
        ? tConfig(app.description).toString()
        : undefined,
      url: app.url?.includes(":") ? app.url : tConfig(app.url).toString(),
      target: app.target === "NEW" ? "_blank" : "_top",
      iconElement: app.icon && <IconUiKit name={app.icon.name} />,
    }));
  }, [apps, tConfig]);

  if (apps.length === 0) return null;

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
          <IconUiKit name="AppSwitcher" />
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
