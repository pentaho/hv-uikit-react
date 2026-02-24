import styled from "@emotion/styled";
import { HvLoading, theme } from "@hitachivantara/uikit-react-core";

interface StyledLoadingPageProps {
  showHeaderSubMenu?: boolean;
  isCompactMode?: boolean;
}

/**
 * Calculates the height of the image wrapper based on the header sub menu and compact mode.
 */
const calcHeight = ({
  showHeaderSubMenu,
  isCompactMode,
}: StyledLoadingPageProps) => {
  if (showHeaderSubMenu && !isCompactMode) {
    return `calc(100vh - (${theme.header.height} + ${theme.header.secondLevelHeight}px + ${theme.space.lg} + ${theme.space.lg}))`;
  }
  return `calc(100vh - (${theme.header.height} + ${theme.space.lg} + ${theme.space.lg}))`;
};

export const StyledLoadingPage = styled("div")<StyledLoadingPageProps>(
  {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: theme.space.lg,
  },
  (props) => ({ height: calcHeight(props) }),
);

export const Loading = styled(HvLoading)({
  display: "flex",
  alignItems: "center",
  width: "100%",
  height: "100%",
});
