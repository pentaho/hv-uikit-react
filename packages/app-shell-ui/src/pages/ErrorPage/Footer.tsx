import { MouseEventHandler } from "react";
import { useErrorBoundary } from "react-error-boundary";
import { Trans, useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useHvNavigation } from "@hitachivantara/app-shell-navigation";
import { useHvAppShellModel } from "@hitachivantara/app-shell-shared";
import { HvTypography } from "@hitachivantara/uikit-react-core";

import { useNavigationContext } from "../../providers/NavigationProvider";

const StyledFooterWrapper = styled("div")({
  textAlign: "center",
});

export const Footer = () => {
  const { t } = useTranslation();
  const { navigate } = useHvNavigation();
  const { navigationMode } = useHvAppShellModel();
  const { resetBoundary } = useErrorBoundary();
  const { items, verticalNavigationItems, isCompactMode } =
    useNavigationContext();

  const getFirstMenuItem = () => {
    if (!isCompactMode && navigationMode !== "ONLY_LEFT") {
      return items.length > 0 ? items[0] : null;
    }

    return verticalNavigationItems.length > 0
      ? verticalNavigationItems[0]
      : null;
  };

  const firstMenuItem = getFirstMenuItem();

  const handleClick: MouseEventHandler<HTMLAnchorElement> | undefined = (
    event,
  ) => {
    event.preventDefault();
    /*
      we need to remove the "." because we might be on a sub path (e.g. https://summyhost/path1/path2/) and we need to
      navigate to the root of the site (check https://hv-eng.atlassian.net/browse/TAP-9647)
     */
    if (firstMenuItem?.href) {
      resetBoundary();
      let path = firstMenuItem.href;
      if (path.startsWith(".")) {
        path = path.slice(1);
      }
      navigate(path);
    }
  };

  return (
    firstMenuItem && (
      <StyledFooterWrapper>
        <HvTypography variant="body">
          <Trans
            t={t}
            i18nKey="errors.footer"
            values={{ label: firstMenuItem.label }}
            components={{
              navigate: (
                <HvTypography
                  link
                  component="a"
                  href={firstMenuItem.href}
                  variant="label"
                  onClick={handleClick}
                >
                  {/* Place the content of the anchor inside the HvTypography */}
                  {firstMenuItem.label}
                </HvTypography>
              ),
            }}
          />
        </HvTypography>
      </StyledFooterWrapper>
    )
  );
};
