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
  /* image component */
  image?: React.ReactNode;
  fullPage?: boolean;
  includeFooter?: boolean;
};

export const ErrorPage = ({
  code,
  title,
  image,
  fullPage,
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
      <StyledImageWrapper>{image}</StyledImageWrapper>
      {includeFooter && <Footer />}
    </StyledErrorPage>
  );
};
