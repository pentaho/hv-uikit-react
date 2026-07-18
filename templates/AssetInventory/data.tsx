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
import {
  HvSkeleton,
  HvTooltip,
  type HvBulkActionsProps,
  type HvColor,
  type HvControlsProps,
  type HvRightControlProps,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import {
  Add,
  Cards,
  Delete,
  Level0Good,
  Level1,
  Level2Average,
  Level3Bad,
  List,
  Preview,
} from "@hitachivantara/uikit-react-icons";

import {
  useServerPagination,
  type DataObject,
  type ServerPaginationProps,
} from "./usePaginationData";

// --- Table data utils ---

export interface AssetInventoryEntry extends DataObject {
  id?: string;
  name?: string;
  eventType?: string;
  status?: string;
  severity?: string;
  priority?: string;
  time?: string;
  temperature?: string;
  statusColor?: HvColor;
  image?: string;
}

const images = [
  "https://images.unsplash.com/photo-1513828583688-c52646db42da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1589320011103-48e428abcbae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1567789884554-0b844b597180?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1647427060118-4911c9821b82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1612685180313-bdfe1d6896cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1190&q=80",
  "https://images.unsplash.com/photo-1566930665082-4ae9dbbb5b6b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80",
  "https://images.unsplash.com/photo-1513828742140-ccaa28f3eda0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
  "https://images.unsplash.com/photo-1622534376374-fe4480328daa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80",
  "https://images.unsplash.com/photo-1618840626133-54463084a141?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=872&q=80",
  "https://images.unsplash.com/photo-1600715502630-c9300abe78a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
];

export const getStatusIcon = (
  color?: AssetInventoryEntry["statusColor"] | string,
) => {
  switch (color) {
    case "positive":
      return <Level0Good color="positive" />;
    case "warning":
      return <Level2Average color="warning" />;
    case "negative":
      return <Level3Bad color="negative" />;
    case "info":
    default:
      return <Level1 color="info" />;
  }
};

const getStatusMessage = (status?: AssetInventoryEntry["statusColor"]) => {
  switch (status) {
    case "positive":
      return "Success";
    case "warning":
      return "Open";
    case "negative":
      return "Error";
    case "info":
    default:
      return "Unassigned";
  }
};

export const getColumns = (
  loading?: boolean,
): HvTableColumnConfig<AssetInventoryEntry, string>[] => [
  {
    Header: "Status",
    accessor: "statusColor",
    style: { width: 60 },
    Cell: ({ value }: { value: any }) =>
      loading ? (
        <HvSkeleton width={32} height={32} variant="circle" animation="wave" />
      ) : (
        <HvTooltip title={getStatusMessage(value)}>
          {getStatusIcon(value)}
        </HvTooltip>
      ),
  },
  {
    Header: "Asset",
    accessor: "image",
    style: { maxWidth: 60 },
    Cell: ({ value, row }: { value: any; row: any }) => {
      return loading ? (
        <HvSkeleton width={60} height={40} variant="square" animation="wave" />
      ) : (
        <HvTooltip
          placement="right"
          title={
            <div style={{ width: 400 }}>
              <img alt={row.original.name} src={value} />
            </div>
          }
        >
          <div style={{ maxWidth: 60 }}>
            <img alt={row.original.name} src={value} />
          </div>
        </HvTooltip>
      );
    },
  },
  {
    Header: "Title",
    accessor: "name",
    style: { minWidth: 140 },
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
  {
    Header: "Event Type",
    accessor: "eventType",
    style: { minWidth: 100 },
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
  {
    Header: "Severity",
    accessor: "severity",
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
  {
    Header: "Priority",
    accessor: "priority",
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
  {
    Header: "Time",
    accessor: "time",
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
  {
    Header: "Temperature",
    accessor: "temperature",
    Cell: ({ value }: { value: any }) => {
      return loading ? <HvSkeleton animation="wave" /> : <span>{value}</span>;
    },
  },
];

export const actions: HvBulkActionsProps["actions"] = [
  { id: "add", label: "Add", icon: <Add /> },
  { id: "delete", label: "Delete", icon: <Delete /> },
  { id: "put", label: "Preview", icon: <Preview /> },
];

export const views: HvControlsProps["views"] = [
  { id: "card", "aria-label": "Select card view", icon: <Cards /> },
  { id: "list", "aria-label": "Select list view", icon: <List /> },
];

export const rightControlValues: HvRightControlProps["values"] = [
  {
    id: "nameAsc",
    accessor: "name",
    label: "Name Ascending",
    desc: false,
  },
  {
    id: "nameDesc",
    accessor: "name",
    label: "Name Descending",
    desc: true,
  },
  {
    id: "eventTypeAsc",
    accessor: "eventType",
    label: "Event Type Ascending",
    desc: false,
  },
  {
    id: "eventTypeDesc",
    accessor: "eventType",
    label: "Event Type Descending",
    desc: true,
  },
  {
    id: "severityAsc",
    accessor: "severity",
    label: "Severity Ascending",
    desc: false,
  },
  {
    id: "severityDesc",
    accessor: "severity",
    label: "Severity Descending",
    desc: true,
  },
];

const getOption = <T,>(opts: T[], i: number) => opts[i % opts.length];

const getTime = (priority: string, index: number) => {
  let i = priority === "High" ? index + 4 : index + 3;
  i = priority === "Medium" ? i + 30 : index + 20;

  return `${i % 12}:${i % 60}:${i % 60}`;
};

const getPriority = (i: number) => getOption(["High", "Medium", "Low"], i);

export const createEntry = (i: number): AssetInventoryEntry => {
  return {
    id: `${i + 1}`,
    name: `Event ${i + 1}`,
    eventType: `Anomaly detection ${i % 4}`,
    status: getOption(["Closed", "Open"], i),
    severity: getOption(["Critical", "Major", "Average", "Minor"], i),
    priority: getPriority(i),
    time: getTime(getPriority(i), i),
    temperature: `${i + 35}º C`,
    statusColor: getOption(["info", "positive", "negative", "warning"], i),
    image: getOption(images, i),
  };
};

// --- Data & Endpoint ---
const db = [...Array(50).keys()].map(createEntry);

export interface PaginationDataProps extends Omit<
  ServerPaginationProps<AssetInventoryEntry>,
  "endpoint" | "db"
> {}

export const usePaginationData = (props: PaginationDataProps) => {
  return useServerPagination({ endpoint: "/events", db, ...props });
};
