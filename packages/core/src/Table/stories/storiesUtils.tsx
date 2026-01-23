import type { HvTableColumnConfig } from "@hitachivantara/uikit-react-core";

const getOption = <T,>(opts: T[], i: number) => opts[i % opts.length];

const makeEvent = (i: number) => {
  return {
    id: `${i + 1}`,
    name: `Event ${i + 1}`,
    createdDate: new Date("2020-03-20").toISOString().slice(0, 10),
    eventType: "Anomaly detection",
    status: getOption(["Closed", "Open"] as const, i),
    riskScore: (i % 100) + 1,
    severity: getOption(["Critical", "Major", "Average", "Minor"] as const, i),
    priority: getOption(["High", "Medium", "Low"] as const, i),
  };
};

/**
 * `AssetEvent` is a dummy data type for HvTable samples
 * In a real-world scenario, this would probably come from the API
 * */
export type AssetEvent = ReturnType<typeof makeEvent>;

export const makeData = (len = 10) => [...Array(len).keys()].map(makeEvent);

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
