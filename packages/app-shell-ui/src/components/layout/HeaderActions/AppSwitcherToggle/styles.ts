import styled from "@emotion/styled";
import { theme } from "@hitachivantara/uikit-react-core";

// zIndex calculation is needed so that the Header shadow goes on top of the panel and not the other way around.
const StyledAppShellPanelWrapper = styled("div")({
  position: "fixed",
  maxHeight: `calc(100vh - ${theme.header.height})`,
  top: theme.header.height,
  right: 0,
  display: "flex",
  boxShadow: theme.colors.shadow,
  zIndex: `calc(${theme.zIndices.banner} - 1)`,
});

export default StyledAppShellPanelWrapper;
