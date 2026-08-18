import { useTranslation } from "react-i18next";
import { css } from "@emotion/css";
import { useHvAppShellRuntimeContext } from "@pentaho/app-shell-shared";
import { HvIcon, HvVerticalNavigationAction } from "@pentaho/uikit-react-core";

const classes = {
  root: css({
    position: "relative",
  }),
  icon: css({
    position: "absolute",
    pointerEvents: "none",
    right: 0,
  }),
};

type CollapseProps = {
  onClick: () => void;
  isOpen: boolean;
};

export const NavigationCollapse = ({ onClick, isOpen }: CollapseProps) => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t } = useTranslation(undefined, {
    i18n,
    keyPrefix: "verticalNavigation",
  });
  return (
    <div className={classes.root}>
      {isOpen && <HvIcon name="Start" className={classes.icon} />}
      <HvVerticalNavigationAction
        label={t("collapseAction")}
        icon={isOpen ? undefined : <HvIcon name="End" />}
        aria-label={isOpen ? t("ariaLabelCollapse") : t("ariaLabelExpand")}
        onClick={onClick}
      />
    </div>
  );
};
