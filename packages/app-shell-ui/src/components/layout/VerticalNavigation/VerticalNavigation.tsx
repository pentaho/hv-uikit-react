import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { css, cx } from "@emotion/css";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import {
  HvVerticalNavigation,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
  theme,
  useTheme,
  verticalNavigationTreeClasses,
} from "@hitachivantara/uikit-react-core";

import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useLayoutContext } from "../../../providers/LayoutProvider";
import { useNavigationContext } from "../../../providers/NavigationProvider";
import { NavigationMenuItem } from "../../../types";
import { NavigationCollapse } from "./NavigationCollapse";
import { NavigationHeader } from "./NavigationHeader";

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

export const VerticalNavigation = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "verticalNavigation" });
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

  useResizeObserver(ref, (width) => {
    setVerticalNavigationWidth(isCompactMode ? 0 : width);
  });

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
        <div>
          {isPentahoTheme && <NavigationHeader isOpen={open} />}

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
        </div>

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
