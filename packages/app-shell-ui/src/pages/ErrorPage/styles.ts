import styled from "@emotion/styled";
import { theme } from "@hitachivantara/uikit-react-core";

interface StyledErrorPageProps {
  showHeaderSubMenu?: boolean;
  isCompactMode?: boolean;
  fullPage?: boolean;
}
/**
 * Calculates the height of the image wrapper based on the header sub menu and compact mode.
 */
const calcHeight = ({
  showHeaderSubMenu,
  isCompactMode,
  fullPage,
}: StyledErrorPageProps) => {
  if (fullPage) {
    return `100vh`;
  }
  if (showHeaderSubMenu && !isCompactMode) {
    return `calc(100vh - (${theme.header.height} + ${theme.header.secondLevelHeight}px + ${theme.space.lg} + ${theme.space.lg}))`;
  }
  return `calc(100vh - (${theme.header.height} + ${theme.space.lg} + ${theme.space.lg}))`;
};

export const StyledErrorPage = styled("div")<StyledErrorPageProps>(
  {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    marginTop: theme.space.lg,
  },
  (props) => ({ height: calcHeight(props) }),
);

export const StyledImageWrapper = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  height: "100%",
});

export const StyledTitleWrapper = styled("div")({
  textAlign: "center",
});
