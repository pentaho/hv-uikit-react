import { createClasses } from "@hitachivantara/uikit-react-utils";
import { theme } from "@hitachivantara/uikit-styles";

import { bulkActionsClasses } from "../../BulkActions";
import { paginationClasses } from "../../Pagination";
import { tableCellClasses } from "../TableCell";
import { tableContainerClasses } from "../TableContainer";
import { tableHeaderClasses } from "../TableHeader";
import { tableRowClasses } from "../TableRow";

export const { staticClasses, useClasses } = createClasses("HvTableSection", {
  root: {},
  header: {},
  actions: {},
  content: {
    marginTop: 0,
    padding: 0,

    // Apply border radius to the first child if there's not an header
    "&:first-of-type": {
      "& > :first-of-type": {
        borderTopLeftRadius: "inherit",
        borderTopRightRadius: "inherit",
      },
    },

    "& > :last-child": {
      borderBottomLeftRadius: "inherit",
      borderBottomRightRadius: "inherit",
    },

    [`& .${tableContainerClasses.root}`]: {
      paddingBottom: 0,
      borderTopLeftRadius: "inherit",
      borderTopRightRadius: "inherit",
    },

    [`& .${tableHeaderClasses.head}`]: {
      backgroundColor: theme.colors.bgPage,
      borderBottomColor: theme.colors.bgPageSecondary,
      [`&.${tableHeaderClasses.variantCheckbox}`]: {
        borderRight: "none",
      },
      [`&.${tableHeaderClasses.variantActions}`]: {
        borderLeft: "none",
      },
    },

    // Remove border for the last table row
    [`& .${tableRowClasses.root}`]: {
      "&:last-child": {
        [`& .${tableCellClasses.root}`]: { borderBottom: "none" },
      },
    },

    [`& .${tableCellClasses.root}`]: {
      borderBottomColor: theme.colors.borderSubtle,
    },

    [`& .${tableCellClasses.variantCheckbox}`]: {
      borderRight: "none",
    },

    [`& .${tableCellClasses.variantActions}`]: {
      borderLeft: "none",
    },

    [`& .${bulkActionsClasses.root}`]: {
      marginBottom: 0,
      border: "none",
      borderBottom: `1px solid ${theme.colors.borderSubtle}`,
      padding: theme.spacing("xs", "sm"),
    },

    [`& .${paginationClasses.root}`]: {
      margin: 0,
      backgroundColor: theme.colors.bgPage,
      padding: theme.space.xs,
      borderTop: `1px solid ${theme.colors.borderSubtle}`,
      borderBottomLeftRadius: "inherit",
      borderBottomRightRadius: "inherit",
    },

    [`& .${paginationClasses.pageSizeOptions}`]: {
      left: theme.space.sm,
    },
    [`& .${paginationClasses.pageSizeHeader}`]: {
      border: "none",
      "&:hover": {
        border: "none",
      },
    },
  },
  hidden: {},
  raisedHeader: {
    "& $content": {
      paddingTop: 0,
    },
  },
  hasHeader: {},
});
