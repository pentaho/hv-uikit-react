import { css } from "@emotion/css";
import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";
import { theme } from "@hitachivantara/uikit-react-core";
import { AppSwitcher } from "@hitachivantara/uikit-react-icons";

import BrandLogo from "../BrandLogo/BrandLogo";

const classes = {
  root: css({
    display: "flex",
    width: "100%",
    alignItems: "center",
    "& svg path": {
      fill: theme.colors.textLight,
    },
    gap: theme.space.xs,
  }),
};

type NavigationHeaderProps = {
  isOpen: boolean;
};

export const NavigationHeader = ({ isOpen }: NavigationHeaderProps) => {
  const { logo } = useHvAppShellModel();

  return (
    <div className={classes.root}>
      <AppSwitcher />
      {isOpen && <BrandLogo logo={logo} />}
    </div>
  );
};
