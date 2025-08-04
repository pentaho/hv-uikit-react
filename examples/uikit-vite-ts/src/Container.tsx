import { ReactNode } from "react";
import { css } from "@emotion/css";
import { Global, GlobalProps } from "@emotion/react";
import {
  HvContainer,
  HvHeader,
  HvHeaderActions,
  HvIconButton,
  theme,
  useTheme,
} from "@hitachivantara/uikit-react-core";
import { Help, ThemeSwitcher } from "@hitachivantara/uikit-react-icons";

const globalStyles: GlobalProps["styles"] = {
  "code::before, code::after": { content: '"`"' },
};

export const Container = ({ children }: { children: ReactNode }) => {
  const { selectedMode, changeMode } = useTheme();

  const handleChangeTheme = () => {
    changeMode(selectedMode === "dark" ? "light" : "dark");
  };

  return (
    <div>
      <Global styles={globalStyles} />
      <HvHeader>
        <HvHeaderActions>
          <HvIconButton
            title="UI Kit documentation"
            component="a"
            href="https://lumada-design.github.io/uikit/master"
            target="_blank"
          >
            <Help />
          </HvIconButton>
          <HvIconButton title="Change theme" onClick={handleChangeTheme}>
            <ThemeSwitcher />
          </HvIconButton>
        </HvHeaderActions>
      </HvHeader>
      <HvContainer
        component="main"
        maxWidth="lg"
        className={css({
          paddingTop: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: theme.spacing(2),
        })}
      >
        {children}
      </HvContainer>
    </div>
  );
};
