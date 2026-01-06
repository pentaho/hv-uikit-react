import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { css } from "@emotion/css";
import { uid } from "uid";
import { HvAppShellEventNotification } from "@hitachivantara/app-shell-events";
import { HvBanner, theme, useTheme } from "@hitachivantara/uikit-react-core";

import { useLayoutContext } from "./LayoutProvider";
import { useNavigationContext } from "./NavigationProvider";

export type BannerProviderProps = {
  children: React.ReactNode;
};

export interface Banner extends Omit<HvAppShellEventNotification, "type"> {
  id: string;
}

export interface BannerContextValue {
  show: (notification: HvAppShellEventNotification) => void;
  dismiss: (id: string) => void;
}

export const BannerContext = createContext<BannerContextValue>({
  show: () => {
    // Empty function
  },
  dismiss: () => {
    // Empty function
  },
});

export const BannerProvider = ({ children }: BannerProviderProps) => {
  const { t } = useTranslation(undefined, {
    keyPrefix: "notifications.banner",
  });
  const { activeTheme } = useTheme();
  const { showHeaderSubMenu, isCompactMode } = useNavigationContext();
  const { verticalNavigationWidth, setBannerMaxHeight } = useLayoutContext();
  const [banners, setBanners] = useState<Banner[]>([]);

  const isPentahoTheme = activeTheme?.name === "pentahoPlus";

  const show = (notification: HvAppShellEventNotification) => {
    const id = uid();

    const newBanner: Banner = {
      id,
      ...notification,
      variant: notification.variant ?? "default",
    };
    setBanners((prevBanners) => [...prevBanners, newBanner]);
  };

  const dismiss = (id: string) => {
    setBanners((prevBanners) =>
      prevBanners.filter((banner) => banner.id !== id),
    );
  };

  const value = useMemo(
    () => ({
      show,
      dismiss,
    }),
    [],
  );

  useEffect(() => {
    if (banners.length > 0) {
      // Get all heights from the rendered banners
      const bannerHeights = banners.map((item) => {
        const bannerElement = document.getElementById(item.id);
        return bannerElement ? bannerElement.clientHeight : 0;
      });

      // Find the 'tallest' banner
      const maxBannerHeight = Math.max(...bannerHeights);

      // Update padding value
      setBannerMaxHeight(maxBannerHeight);
    } else {
      setBannerMaxHeight(0);
    }
  }, [banners, setBannerMaxHeight]);

  const { root, topCenter, bottomCenter } = useMemo(() => {
    const paddingY = theme.space.xs; // should be aligned with `Main`'s paddingTop
    const paddingX = theme.space.sm;

    return {
      root: css({
        left: `calc(${verticalNavigationWidth}px + ${paddingX})`,
        width: `calc(100% - (${verticalNavigationWidth}px + ${paddingX}) - ${paddingX})`,
        transform: "unset",
        minWidth: "unset",
        zIndex: theme.zIndices.banner,
        ...(isPentahoTheme && {
          maxWidth: 540,
          left: `calc(${verticalNavigationWidth}px + (100% - ${verticalNavigationWidth}px) / 2)`,
          transform: `translateX(-50%)`,
        }),
      }),
      topCenter: css({
        marginTop:
          showHeaderSubMenu && !isCompactMode
            ? `calc(${theme.header.height} + ${theme.header.secondLevelHeight} + ${paddingY})`
            : `calc(${theme.header.height} + ${paddingY})`,
      }),
      bottomCenter: css({
        marginBottom: theme.space.md,
      }),
    };
  }, [
    isCompactMode,
    isPentahoTheme,
    showHeaderSubMenu,
    verticalNavigationWidth,
  ]);

  return (
    <BannerContext.Provider value={value}>
      {banners.map((banner) => (
        <HvBanner
          classes={{
            root,
            anchorOriginBottomCenter: bottomCenter,
            anchorOriginTopCenter: topCenter,
          }}
          id={banner.id}
          key={banner.id}
          offset={0}
          open
          onClose={() => dismiss(banner.id)}
          variant={banner.variant}
          label={banner.message}
          showIcon
          actions={banner.actions}
          onAction={banner.onAction}
          bannerContentProps={{
            actionProps: { "aria-label": t("close") },
          }}
          anchorOrigin={isPentahoTheme ? "bottom" : undefined}
          transitionDirection={isPentahoTheme ? "up" : undefined}
        />
      ))}
      {children}
    </BannerContext.Provider>
  );
};

export const useBannerContext = () => {
  const context = useContext(BannerContext);

  if (!context) {
    console.error("BannerContext was used outside of its Provider");
  }

  return context;
};
