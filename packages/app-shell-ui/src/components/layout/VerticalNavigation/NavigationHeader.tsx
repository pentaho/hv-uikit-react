import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";
import { AppSwitcher } from "@hitachivantara/uikit-react-icons";

import BrandLogo from "../BrandLogo/BrandLogo";
import { classes } from "./styles";

type NavigationHeaderProps = {
  isOpen: boolean;
};

export const NavigationHeader = ({ isOpen }: NavigationHeaderProps) => {
  const { logo } = useHvAppShellModel();

  return (
    <div className={classes.navigationHeader}>
      <AppSwitcher />
      {isOpen && <BrandLogo logo={logo} />}
    </div>
  );
};
