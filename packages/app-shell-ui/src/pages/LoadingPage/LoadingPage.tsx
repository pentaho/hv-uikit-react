import Loading from "../../components/layout/Loading/Loading";
import { useNavigationContext } from "../../providers/NavigationProvider";
import StyledLoadingPage from "./styles";

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
