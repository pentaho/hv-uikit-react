import { useTranslation } from "react-i18next";

import type { UseCreateNewContentAction } from "../types";

const useCreateNewReportAction: UseCreateNewContentAction = () => {
  const { t } = useTranslation();

  return {
    id: "default-app/actions/createNewReport",
    label: t("action.createNewReport.label", "Create new Report"),
    onAction: () => {
      console.log("Creating a new report...");
    },
  };
};

export default useCreateNewReportAction;
