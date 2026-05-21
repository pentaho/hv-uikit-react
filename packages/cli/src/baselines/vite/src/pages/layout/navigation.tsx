import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  HvButton,
  HvContainer,
  HvHeader,
  HvHeaderBrand,
  HvHeaderNavigation,
  theme,
  type HvContainerProps,
} from "@hitachivantara/uikit-react-core";
import { Menu } from "@hitachivantara/uikit-react-icons";

import { HitachiLogo } from "../../assets/HitachiLogo";
import { Loading } from "../../components/common/Loading";
import {
  NavigationProvider,
  useNavigationContext,
} from "../../context/NavigationContext";
import { navigationData } from "../../routes";

export function Component() {
  return (
    <NavigationProvider navigation={navigationData}>
      <Header />
      <Container maxWidth="xl">
        <Outlet />
      </Container>
    </NavigationProvider>
  );
}

function Header() {
  const navigate = useNavigate();
  const { breakpoints } = useTheme();
  const { activePath, navigation } = useNavigationContext();

  const isMdUp = useMediaQuery(breakpoints.up("md"));
  const isXs = useMediaQuery(breakpoints.only("xs"));

  return (
    <HvHeader>
      {!isMdUp && (
        <div>
          <HvButton variant="primaryGhost" icon>
            <Menu />
          </HvButton>
        </div>
      )}

      <HvHeaderBrand
        logo={<HitachiLogo />}
        name={!isXs ? "Lumada App" : undefined}
      />

      {isMdUp && (
        <HvHeaderNavigation
          data={navigation}
          selected={activePath?.id}
          onClick={(event, selection) => {
            if (selection.path) navigate(selection.path);
          }}
        />
      )}
    </HvHeader>
  );
}

function Container({ maxWidth = "lg", children }: HvContainerProps) {
  return (
    <div
      className="flex pb-lg min-h-screen"
      style={{ paddingTop: `calc(${theme.header.height} + ${theme.space.lg})` }}
    >
      <HvContainer maxWidth={maxWidth} component="main">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </HvContainer>
    </div>
  );
}
