import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellModel,
} from "@hitachivantara/app-shell-shared";
import {
  HvButton,
  HvHeader,
  HvHeaderBrand,
  HvHeaderNavigation,
  HvHeaderNavigationProps,
  useTheme,
} from "@hitachivantara/uikit-react-core";

import { useNavigationContext } from "../../../providers/NavigationProvider";
import IconUiKit from "../../IconUiKit";
import { BrandLogo } from "../BrandLogo/BrandLogo";
import HeaderActions from "../HeaderActions/HeaderActions";

export const Header = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "header.navigation" });
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE);
  const { navigationMode, name, logo } = useHvAppShellModel();
  const { activeTheme } = useTheme();
  const { navigate } = useHvNavigation();

  const {
    items,
    selectedMenuItemId,
    rootMenuItemId,
    isCompactMode,
    switchVerticalNavigationMode,
    verticalNavigationMode,
    verticalNavigationItems,
  } = useNavigationContext();

  const isOnlyTopMode = navigationMode === "ONLY_TOP";
  const showNavigation =
    !isCompactMode && navigationMode !== "ONLY_LEFT" && items.length > 0;
  const isVerticalNavigationClosed = verticalNavigationMode === "CLOSED";
  const showVerticalNavigationButton =
    isCompactMode && verticalNavigationItems.length > 0;

  const handleNavigationChange: HvHeaderNavigationProps["onClick"] = (
    event,
    selectedItem,
  ) => {
    if (selectedItem.href) {
      navigate(selectedItem.href, {
        state: { selectedItemId: selectedItem.id },
      });
    }
  };

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";
  const appName = name ? tConfig(name) : "";

  return (
    <HvHeader position="relative" style={{ gridArea: "header" }}>
      <Helmet>
        <title>{appName}</title>
      </Helmet>

      {showVerticalNavigationButton && (
        <HvButton
          icon
          aria-label={
            isVerticalNavigationClosed
              ? t("openNavigationPanel")
              : t("closeNavigationPanel")
          }
          aria-expanded={!isVerticalNavigationClosed}
          onClick={switchVerticalNavigationMode}
        >
          <IconUiKit name={isVerticalNavigationClosed ? "Menu" : "Close"} />
        </HvButton>
      )}

      <HvHeaderBrand
        logo={isPentahoTheme ? undefined : <BrandLogo logo={logo} />}
        name={appName}
      />
      {showNavigation && (
        <HvHeaderNavigation
          data={items}
          selected={isOnlyTopMode ? selectedMenuItemId : rootMenuItemId}
          onClick={handleNavigationChange}
          levels={isOnlyTopMode ? 2 : 1}
        />
      )}

      <HeaderActions />
    </HvHeader>
  );
};
