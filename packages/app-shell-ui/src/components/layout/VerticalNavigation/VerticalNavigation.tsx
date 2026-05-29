import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { css, cx } from "@emotion/css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import { useHvAppShellRuntimeContext } from "@hitachivantara/app-shell-shared";
import {
  HvVerticalNavigation,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
  theme,
  useTheme,
  verticalNavigationTreeClasses,
} from "@hitachivantara/uikit-react-core";

import { useLayoutContext } from "../../../providers/LayoutProvider";
import { useNavigationContext } from "../../../providers/NavigationProvider";
import type { NavigationMenuItem } from "../../../types";
import { NavigationCollapse } from "./NavigationCollapse";

const classes = {
  root: css({
    gridArea: "vnav",
    overflowY: "auto",
    position: "relative",
    zIndex: theme.zIndices.overlay,
  }),
  pentaho: css({
    maxHeight: "100vh",
  }),
  floating: css({
    position: "absolute",
    top: theme.header.height,
    bottom: 0,
  }),
  popup: css({
    maxHeight: `calc(100vh - ${theme.header.height})`,
    overflowY: "auto",
    boxShadow: theme.colors.shadow,
    [`& .${verticalNavigationTreeClasses.popup}`]: { boxShadow: "none" },
  }),
};

const PENTAHO_EXPANDED_VERTICAL_NAVIGATION_WIDTH = 280;
const DEFAULT_EXPANDED_VERTICAL_NAVIGATION_WIDTH = 220;
const COLLAPSED_VERTICAL_NAVIGATION_WIDTH = 64;

export const VerticalNavigation = () => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "verticalNavigation",
  });
  const {
    selectedMenuItemId,
    rootMenuItemId,
    verticalNavigationItems,
    isCompactMode,
    verticalNavigationMode,
    switchVerticalNavigationMode,
  } = useNavigationContext();
  const { setVerticalNavigationWidth } = useLayoutContext();
  const { navigate } = useHvNavigation();
  const { activeTheme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const open = verticalNavigationMode === "EXPANDED";

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";

  const changeHandler = (
    event: React.SyntheticEvent<Element, Event>,
    selectedItem: NavigationMenuItem,
  ) => {
    // Due to the change from buttons to links on the navigation tree, we need to prevent the default behaviour of
    // the event to avoid full refreshes when clicking on the links.
    event.preventDefault();

    if (selectedItem.href) {
      navigate(selectedItem.href, {
        state: { selectedItemId: selectedItem.id },
      });

      if (isCompactMode) {
        switchVerticalNavigationMode();
      }
    }
  };

  useEffect(() => {
    if (isCompactMode) {
      setVerticalNavigationWidth(0);
      return;
    }

    setVerticalNavigationWidth(
      open
        ? isPentahoTheme
          ? PENTAHO_EXPANDED_VERTICAL_NAVIGATION_WIDTH
          : DEFAULT_EXPANDED_VERTICAL_NAVIGATION_WIDTH
        : COLLAPSED_VERTICAL_NAVIGATION_WIDTH,
    );
  }, [isCompactMode, open, isPentahoTheme, setVerticalNavigationWidth]);

  return (
    <ClickAwayListener
      onClickAway={() => {
        if (!isCompactMode) return;
        switchVerticalNavigationMode();
      }}
    >
      <HvVerticalNavigation
        ref={ref}
        className={cx(classes.root, {
          [classes.pentaho]: isPentahoTheme,
          [classes.floating]: open && isCompactMode,
        })}
        open={open}
        useIcons
        slider={isCompactMode}
      >
        {(!isPentahoTheme || isCompactMode) && (
          <HvVerticalNavigationHeader
            title={t("title")}
            onCollapseButtonClick={
              !isCompactMode ? switchVerticalNavigationMode : undefined
            }
            collapseButtonProps={{
              "aria-label": t(open ? "ariaLabelCollapse" : "ariaLabelExpand"),
              "aria-expanded": open,
            }}
            backButtonProps={{
              "aria-label": t("ariaLabelHeaderBackButton"),
            }}
          />
        )}

        <HvVerticalNavigationTree
          key={rootMenuItemId}
          mode="navigation"
          collapsible
          aria-label={t("ariaLabelNavigationTree")}
          selected={selectedMenuItemId}
          onChange={changeHandler}
          data={verticalNavigationItems}
          classes={{ navigationPopup: classes.popup }}
          sliderForwardButtonAriaLabel={t("ariaLabelSliderForwardButton")}
        />

        <HvVerticalNavigationActions>
          {isPentahoTheme && (
            <NavigationCollapse
              onClick={switchVerticalNavigationMode}
              isOpen={open}
            />
          )}
        </HvVerticalNavigationActions>
      </HvVerticalNavigation>
    </ClickAwayListener>
  );
};
