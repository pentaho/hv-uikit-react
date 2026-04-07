import { useTranslation } from "react-i18next";

import type { UseCreateNewContentAction } from "../types";

const useCreateNewDashboardAction: UseCreateNewContentAction = () => {
  const { t } = useTranslation();

  return {
    id: "default-app/actions/createNewDashboard",
    label: t("action.createNewDashboard.label", "New Dashboard"),
    onAction: () => {
      console.log("Creating a new dashboard...");
    },
  };
};

export default useCreateNewDashboardAction;
