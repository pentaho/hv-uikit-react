import { useCallback, useMemo, useRef, useState } from "react";
import {
  HvIconButton,
  HvRowInstance,
  HvSearchInput,
  HvTab,
  HvTableColumnConfig,
  HvTableInstance,
  HvTabs,
} from "@hitachivantara/uikit-react-core";
import { Delete, Duplicate, Preview } from "@hitachivantara/uikit-react-icons";

import { makeData, type AssetEvent } from "./makeData";
import { MyTable } from "./MyTable";

export default function Demo() {
  const [data, setData] = useState(() => makeData(128));
  const [tab, setTab] = useState<string>("");
  const tableRef = useRef<HvTableInstance<AssetEvent>>(null);

  const deleteRow = useCallback((row: HvRowInstance<AssetEvent>) => {
    setData((prev) => prev.filter((r) => r.id !== row.original.id));
  }, []);

  const columns = useMemo<HvTableColumnConfig<AssetEvent>[]>(
    () => [
      { Header: "Title", accessor: "name", style: { minWidth: 120 } },
      { Header: "Time", accessor: "createdDate", style: { minWidth: 100 } },
      { Header: "Event Type", accessor: "eventType", style: { minWidth: 100 } },
      { Header: "Status", accessor: "status", style: { minWidth: 100 } },
      {
        Header: "Probability",
        accessor: "riskScore",
        align: "right",
        Cell: ({ value }) => `${value}%`,
      },
      { Header: "Severity", accessor: "severity" },
      { Header: "Priority", accessor: "priority" },
      {
        id: "delete",
        variant: "actions",
        Cell: ({ row }) => (
          <HvIconButton title="Delete" onClick={() => deleteRow(row)}>
            <Delete />
          </HvIconButton>
        ),
      },
    ],
    [deleteRow],
  );

  return (
    <MyTable<AssetEvent>
      data={data}
      columns={columns}
      tableRef={tableRef}
      raisedHeader
      title={
        <HvTabs
          value={tab}
          onChange={(evt, val) => {
            setTab(val);
            tableRef.current?.setFilter?.("status", val || undefined);
          }}
        >
          <HvTab value="" label="All" />
          <HvTab value="open" label="Open" />
          <HvTab value="closed" label="Closed" />
        </HvTabs>
      }
      actions={
        <HvSearchInput
          placeholder="Search all columns"
          onChange={(evt, val) => tableRef.current?.setGlobalFilter?.(val)}
        />
      }
      bulkActions={[
        { id: "clone", label: "Clone", icon: <Duplicate /> },
        { id: "remove", label: "Remove", icon: <Delete /> },
        { id: "preview", label: "Preview", icon: <Preview />, disabled: true },
      ]}
      onBulkAction={(evt, action, selectedRows) => {
        if (action.id === "remove") {
          selectedRows.forEach(deleteRow);
        } else if (action.id === "clone") {
          const clonedData = selectedRows.map(({ original }) => ({
            ...original,
            id: `${original.id}-copy`,
            name: `${original.name}-copy`,
          }));
          setData((prev) => prev.concat(clonedData));
        }
      }}
      options={{
        initialState: {
          pageSize: 10,
        },
      }}
    />
  );
}
