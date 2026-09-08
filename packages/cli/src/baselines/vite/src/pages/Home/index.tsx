import { useTranslation } from "react-i18next";
import { HvTypography } from "@pentaho/uikit-react-core";

export function Component() {
  const { t } = useTranslation("home");

  return (
    <div className="grid gap-sm">
      <HvTypography variant="title1">{t("title")}</HvTypography>
      <HvTypography>{t("description")}</HvTypography>
    </div>
  );
}
