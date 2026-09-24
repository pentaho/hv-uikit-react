import type { HvComponentDoc } from "../types/doc";

export const docs: HvComponentDoc = {
  name: "HvBreadCrumb",
  category: "Navigation",
  keywords: ["path", "trail", "hierarchy"],
  usage: {
    description:
      "Shows where the current page sits in the hierarchy, and how to get back up it.",
  },
  decisions: [
    {
      change: "`classes.a` and the `HvBreadCrumbPage` namespace were removed.",
      status: "current",
      since: "v7",
      migrate: "use `classes.link` or `classes.currentPage`",
    },
    {
      change:
        "`classes.centerContainer` and `classes.separatorContainer` moved to `HvPathElement`.",
      status: "current",
      since: "v7",
      migrate:
        "target `.HvPathElement-centerContainer` / `-separatorContainer`",
    },
  ],
};
