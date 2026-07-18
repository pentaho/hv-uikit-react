/*! ******************************************************************************
 *
 * Pentaho
 *
 * Copyright (C) 2026 by Pentaho Canada Inc. : http://www.pentaho.com
 *
 * Use of this software is governed by the Business Source License included
 * in the LICENSE.TXT file.
 *
 * Change Date: 2030-06-15
 ******************************************************************************/
import useSWR from "swr";
import {
  HvTooltip,
  type HvBulkActionsProps,
  type HvColor,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import {
  Level0Good,
  Level1,
  Level2Average,
  Level3Bad,
  Refresh,
  type IconType,
} from "@hitachivantara/uikit-react-icons";

import {
  delay,
  useServerPagination,
  type DataObject,
  type ServerPaginationProps,
} from "./usePaginationData";

// --- Table data utils ---

export interface ListViewEntry extends DataObject {
  id?: string;
  name?: string;
  description?: string;
  serverId?: number;
  created?: string;
  build?: string;
  status?: number;
}

const TooltipIcon = ({
  title,
  Icon,
  color,
}: {
  title: string;
  Icon: IconType;
  color: HvColor;
}) => (
  <HvTooltip title={title}>
    <Icon iconSize="XS" color={color} />
  </HvTooltip>
);

export const getStatusIcon = (status?: ListViewEntry["status"]) => {
  switch (status) {
    case 0:
      return <TooltipIcon title="Success" Icon={Level0Good} color="positive" />;
    case 1:
      return <TooltipIcon title="Error" Icon={Level3Bad} color="negative" />;
    case 2:
      return <TooltipIcon title="Open" Icon={Level2Average} color="warning" />;
    default:
      return <TooltipIcon title="Unassigned" Icon={Level1} color="info" />;
  }
};

export const getColumns = (): HvTableColumnConfig<ListViewEntry, string>[] => [
  {
    Header: "Status",
    accessor: "status",
    style: { width: 40 },
    Cell: ({ value }: { value: any }) => getStatusIcon(value),
  },
  { Header: "Name", accessor: "name", style: { minWidth: 200 } },
  { Header: "Description", accessor: "description", style: { minWidth: 200 } },
  { Header: "Server ID", accessor: "serverId", style: { width: 120 } },
  { Header: "Created", accessor: "created" },
  { Header: "Build", accessor: "build", style: { width: 120 } },
];

export const actions: HvBulkActionsProps["actions"] = [
  { id: "refresh", label: "Refresh", icon: <Refresh /> },
];

const entries = [
  { name: "Previous", description: "Clean Data Logs" },
  { name: "Home", description: "Review Log" },
  { name: "Carriage", description: "Deploy Cloud Run" },
  { name: "Black", description: "Clean Session" },
  { name: "Forward", description: "Update Build" },
];

const getDate = (i: number): string => {
  return new Date(2018, 4, i * 3).toISOString().slice(0, 10);
};

const getServerID = (i: number): number => Math.floor(100000000 + 17 * i);

const getOption = <T,>(opts: T[], i: number) => opts[i % opts.length];

export const createEntry = (i: number): ListViewEntry => {
  const entry = getOption(entries, i);
  const serverId = getServerID(i);

  return {
    id: `${i + 1}`,
    name: entry.name,
    description: entry.description,
    serverId,
    created: getDate(i),
    build: btoa(String(serverId)).slice(5),
    status: i % 4,
  };
};

// --- Trend data utils ---

export type TrendData = (string | number)[][];

export const getTrendData = (variation: string): TrendData => {
  if (variation === "up") {
    return [
      ["Count", "Requests"],
      ["1", 265],
      ["2", 734],
      ["3", 1420],
      ["4", 2780],
    ];
  }

  return [
    ["Count", "Requests"],
    ["1", 2780],
    ["2", 1420],
    ["3", 734],
    ["4", 265],
  ];
};

// --- Data & Endpoints ---
const db = [...Array(20).keys()].map(createEntry);

const countByStatus = (status: number) =>
  db.filter((entry) => entry.status === status).length || 0;

const requestsSummary = {
  success: {
    count: countByStatus(0),
    data: getTrendData("up"),
    variation: "up",
  },
  error: {
    count: countByStatus(1),
    data: getTrendData("down"),
    variation: "down",
  },
  open: {
    count: countByStatus(2),
    data: getTrendData("down"),
    variation: "down",
  },
  unassign: {
    count: countByStatus(3),
    data: getTrendData("up"),
    variation: "up",
  },
};

export interface PaginationDataProps extends Omit<
  ServerPaginationProps<ListViewEntry>,
  "endpoint" | "db"
> {}

export const usePaginationData = (props: PaginationDataProps) => {
  return useServerPagination({ endpoint: "/requests", db, ...props });
};

export const useSummaryData = () => {
  return useSWR("/requests/summary", async () => {
    // Loading
    await delay(800);

    return requestsSummary;
  });
};
