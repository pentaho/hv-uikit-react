import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import {
  CONFIG_TRANSLATIONS_NAMESPACE,
  useHvAppShellRuntimeContext,
  type HvAppShellConfig,
} from "@hitachivantara/app-shell-shared";

import { Hitachi, Lumada, Pentaho } from "./logos";

const LogoContainer = styled("div")({
  height: 20,
  svg: {
    height: "inherit",
  },
});

interface BrandLogoProps extends React.ComponentProps<typeof LogoContainer> {
  logo?: HvAppShellConfig["logo"];
}

export const BrandLogo = ({ logo, ...others }: BrandLogoProps) => {
  const { i18n } = useHvAppShellRuntimeContext();
  const { t: tConfig } = useTranslation(CONFIG_TRANSLATIONS_NAMESPACE, {
    i18n,
  });

  const LogoComponent = useMemo(() => {
    const logoName = logo && logo.name?.toUpperCase();
    switch (logoName) {
      case "LUMADA":
        return Lumada;
      case "PENTAHO":
      case "PENTAHO+":
        return Pentaho;
      default:
        return Hitachi;
    }
  }, [logo]);

  // When the user explicitly passes "null" to the logo, we don't use any logo
  if (logo === null) return null;

  return (
    <LogoContainer {...others}>
      <LogoComponent
        // Rules out explicit null value or non-existent prop but assumes empty string
        description={logo?.description && tConfig(logo.description)}
      />
    </LogoContainer>
  );
};
