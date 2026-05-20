import { makeData, type AssetEvent } from "@hitachivantara/internal";
import type { HvTableColumnConfig } from "@hitachivantara/uikit-react-core";

export { makeData, type AssetEvent };

/**
 * columns object. width is only used if explicitly passed in column.getHeaderProps
 * @see https://react-table-v7-docs.netlify.app/docs/api/useTable#column-options
 */
export const getColumns = (): HvTableColumnConfig<AssetEvent>[] => [
  { Header: "Title", accessor: "name", style: { minWidth: 120 } },
  { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
  { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
  { Header: "Status", accessor: "status", style: { minWidth: 100 } },
  {
    Header: "Probability",
    accessor: "riskScore",
    align: "right", // numeric values should be right-aligned
    Cell: ({ value }) => `${value}%`,
  },
  { Header: "Severity", accessor: "severity" },
  { Header: "Priority", accessor: "priority" },
];
