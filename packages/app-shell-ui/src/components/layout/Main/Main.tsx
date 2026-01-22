import { css } from "@emotion/css";
import { theme, useTheme } from "@hitachivantara/uikit-react-core";

import { useLayoutContext } from "../../../providers/LayoutProvider";
import { useNavigationContext } from "../../../providers/NavigationProvider";
import VerticalNavigation from "../VerticalNavigation/VerticalNavigation";
import { StyledContainer, StyledMain } from "./styles";

export type MainProps = {
  children: React.ReactNode;
};

const Main = ({ children }: MainProps) => {
  const {
    hasVerticalNavigation,
    verticalNavigationMode,
    showHeaderSubMenu,
    isCompactMode,
    switchVerticalNavigationMode,
  } = useNavigationContext();
  const { bannerMaxHeight, verticalNavigationWidth } = useLayoutContext();
  const { activeTheme } = useTheme();

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";

  return (
    <StyledContainer
      style={{
        ["--vNavWidth" as string]: `${verticalNavigationWidth}px`,
        ["--headerHeight" as string]:
          showHeaderSubMenu && !isCompactMode
            ? `calc(${theme.header.height} + ${theme.header.secondLevelHeight})`
            : theme.header.height,
      }}
    >
      {hasVerticalNavigation && verticalNavigationMode !== "CLOSED" && (
        <VerticalNavigation
          onClickAway={isCompactMode ? switchVerticalNavigationMode : undefined}
        />
      )}

      <StyledMain
        className={
          isPentahoTheme
            ? undefined
            : css({
                paddingTop: bannerMaxHeight
                  ? `calc(${bannerMaxHeight}px + ${theme.space.xs})`
                  : undefined,
              })
        }
      >
        {children}
      </StyledMain>
    </StyledContainer>
  );
};

export default Main;
