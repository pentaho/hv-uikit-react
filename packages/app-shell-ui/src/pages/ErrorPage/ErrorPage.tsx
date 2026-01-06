import { HvTypography } from "@hitachivantara/uikit-react-core";

import { useNavigationContext } from "../../providers/NavigationProvider";
import { Footer } from "./Footer";
import {
  StyledErrorPage,
  StyledImageWrapper,
  StyledTitleWrapper,
} from "./styles";

type ErrorPageProps = {
  code?: string;
  title: string;
  /* Background Image location */
  background: string;
  backgroundLabel: string;
  fullPage?: boolean;
  includeFooter?: boolean;
};

const ErrorPage = ({
  code = undefined,
  title,
  background,
  backgroundLabel,
  fullPage = false,
  includeFooter = true,
}: ErrorPageProps) => {
  const { isCompactMode, showHeaderSubMenu } = useNavigationContext();

  return (
    <StyledErrorPage
      showHeaderSubMenu={showHeaderSubMenu}
      isCompactMode={isCompactMode}
      fullPage={fullPage}
    >
      <StyledTitleWrapper>
        {code && <HvTypography variant="title1">{code}</HvTypography>}
        <HvTypography variant={isCompactMode ? "title3" : "display"}>
          {title}
        </HvTypography>
      </StyledTitleWrapper>
      <StyledImageWrapper
        style={{ backgroundImage: background }}
        role="img"
        aria-label={backgroundLabel}
      />
      {includeFooter && <Footer />}
    </StyledErrorPage>
  );
};

export default ErrorPage;
