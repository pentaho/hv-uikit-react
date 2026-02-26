import { useTranslation } from "react-i18next";
import { css } from "@emotion/css";
import { HvVerticalNavigationAction } from "@hitachivantara/uikit-react-core";
import { End, Start } from "@hitachivantara/uikit-react-icons";

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
  const { t } = useTranslation(undefined, { keyPrefix: "verticalNavigation" });
  return (
    <div className={classes.root}>
      {isOpen && <Start className={classes.icon} />}
      <HvVerticalNavigationAction
        label={t("collapseAction")}
        icon={isOpen ? undefined : <End />}
        aria-label={isOpen ? t("ariaLabelCollapse") : t("ariaLabelExpand")}
        onClick={onClick}
      />
    </div>
  );
};
