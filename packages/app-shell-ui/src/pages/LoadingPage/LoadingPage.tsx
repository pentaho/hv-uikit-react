import { useNavigationContext } from "../../providers/NavigationProvider";
import { Loading, StyledLoadingPage } from "./styles";

const LoadingPage = () => {
  const { isCompactMode, showHeaderSubMenu } = useNavigationContext();

  return (
    <StyledLoadingPage
      showHeaderSubMenu={showHeaderSubMenu}
      isCompactMode={isCompactMode}
    >
      <Loading />
    </StyledLoadingPage>
  );
};

export default LoadingPage;
