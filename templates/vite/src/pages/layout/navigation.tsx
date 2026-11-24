import { Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { List } from "@phosphor-icons/react";
import {
  HvButton,
  HvContainer,
  HvHeader,
  HvHeaderBrand,
  HvHeaderNavigation,
  theme,
  useWidth,
  type HvContainerProps,
} from "@pentaho/uikit-react-core";

import * as logos from "../../assets/logos";
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
  const { activePath, navigation } = useNavigationContext();

  const width = useWidth();
  const isMdUp = ["md", "lg", "xl"].includes(width);

  return (
    <HvHeader>
      {!isMdUp && (
        <div>
          <HvButton variant="primaryGhost" icon aria-label="Open menu">
            <List />
          </HvButton>
        </div>
      )}

      <HvHeaderBrand logo={<logos.Pentaho />} />

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
