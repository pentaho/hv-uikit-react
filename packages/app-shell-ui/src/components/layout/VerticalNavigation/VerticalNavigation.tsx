/* eslint-disable react-refresh/only-export-components */
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { cx } from "@emotion/css";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import {
  HvVerticalNavigation,
  HvVerticalNavigationActions,
  HvVerticalNavigationHeader,
  HvVerticalNavigationTree,
  useTheme,
} from "@hitachivantara/uikit-react-core";

import { useResizeObserver } from "../../../hooks/useResizeObserver";
import { useLayoutContext } from "../../../providers/LayoutProvider";
import { useNavigationContext } from "../../../providers/NavigationProvider";
import { NavigationMenuItem } from "../../../types";
import withClickAwayListener from "../../hoc/withClickAwayListener";
import { NavigationCollapse } from "./NavigationCollapse";
import { NavigationHeader } from "./NavigationHeader";
import { classes } from "./styles";

const VerticalNavigation = () => {
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
    <HvVerticalNavigation
      ref={ref}
      className={cx(classes.root, {
        [classes.pentaho]: isPentahoTheme && !isCompactMode,
        [classes.compact]: isCompactMode,
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

      {isPentahoTheme ? (
        <NavigationCollapse
          onClick={() => switchVerticalNavigationMode()}
          isOpen={open}
        />
      ) : (
        <HvVerticalNavigationActions />
      )}
    </HvVerticalNavigation>
  );
};

export default withClickAwayListener(VerticalNavigation);
