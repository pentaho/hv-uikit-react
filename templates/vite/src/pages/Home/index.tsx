import { useTranslation } from "react-i18next";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { HvTypography } from "@pentaho/uikit-react-core";

export function Component() {
  const { t } = useTranslation("home");

  return (
    // the area below the header: the content centers in it, the docs link at its foot
    <div className="flex min-h-full flex-col items-center gap-md p-md text-center">
      <div className="flex flex-1 flex-col items-center justify-center gap-md">
        <HvTypography variant="title2" component="h1">
          {t("title")}
        </HvTypography>
        <HvTypography>
          {t("start")}{" "}
          <HvTypography
            variant="caption1"
            component="code"
            className="rounded-base bg-bgContainer px-xs py-xxs"
          >
            {t("file")}
          </HvTypography>
        </HvTypography>
      </div>
      <HvTypography
        variant="caption1"
        component="a"
        href="https://pentaho.github.io/uikit-docs/master/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-xxs hover:underline"
      >
        {t("docs")}
        <ArrowSquareOut aria-hidden />
      </HvTypography>
    </div>
  );
}
