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
import { useEffect, useMemo, useState } from "react";
import { table } from "arquero";
import type ColumnTable from "arquero/dist/types/table/column-table";
import {
  HvEmptyState,
  HvPagination,
  HvSection,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTypography,
  useHvData,
  useHvFilters,
  useHvPagination,
  useHvSortBy,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";
import { Ban } from "@hitachivantara/uikit-react-icons";

interface TableProps {
  loading: boolean;
  title: string;
  measure: string;
  data?: ColumnTable;
}
export const getColumns = (): HvTableColumnConfig<any, string>[] => [
  {
    Header: "Territory",
    accessor: "Territory",
  },
  { Header: "Country", accessor: "Country" },
  { Header: "State Province", accessor: "State Province" },
  { Header: "City", accessor: "City" },
  { Header: "Years", accessor: "Years" },
  { Header: "Quarters", accessor: "Quarters" },
  { Header: "Months", accessor: "Months" },
  { Header: "Quantity", accessor: "Quantity" },
  { Header: "Sales", accessor: "Sales" },
];

const NoDataRow = ({
  message,
  height = 96,
}: {
  message: React.ReactNode;
  height?: number;
}) => (
  <HvTableRow>
    <HvTableCell colSpan={100} style={{ height }}>
      <HvEmptyState message={message} icon={<Ban />} />
    </HvTableCell>
  </HvTableRow>
);

export const Table = ({
  loading,
  title,
  measure,
  data: dataProp,
}: TableProps) => {
  const columns = useMemo(() => getColumns(), []);
  const [data, setData] = useState<any[]>([]);

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    headerGroups,
    page,
    getHvPaginationProps,
    setFilter,
  } = useHvData<any, string>(
    {
      data,
      columns,
      initialState: {
        filters: [{ id: "Territory", value: measure }],
        hiddenColumns: ["Territory"],
      },
    },
    useHvFilters,
    useHvSortBy,
    useHvPagination,
  );

  useEffect(() => {
    if (dataProp) {
      const tableData = table(dataProp);
      const arr = tableData.objects();
      setData(arr);
    }
  }, [dataProp]);

  useEffect(() => {
    setFilter?.("Territory", measure);
  }, [measure, setFilter]);

  return (
    <HvSection
      title={
        !loading && (
          <HvTypography variant="title4">
            {title}: {measure}
          </HvTypography>
        )
      }
      className={
        loading ? "flex items-center justify-center h-full" : undefined
      }
      classes={{
        content: "h-full overflow-auto",
      }}
    >
      <HvTableContainer>
        <HvTable {...getTableProps()}>
          <HvTableHead>
            {headerGroups.map((headerGroup) => (
              <HvTableRow
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.getHeaderGroupProps().key}
              >
                {headerGroup.headers.map((col) => (
                  <HvTableHeader
                    {...col.getHeaderProps()}
                    key={col.getHeaderProps().key}
                  >
                    {col.render("Header")}
                  </HvTableHeader>
                ))}
              </HvTableRow>
            ))}
          </HvTableHead>
          <HvTableBody {...getTableBodyProps()}>
            {page.length > 0 ? (
              page.map((row) => {
                prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();

                return (
                  <HvTableRow key={key} {...rowProps}>
                    {row.cells.map((cell) => (
                      <HvTableCell
                        {...cell.getCellProps()}
                        key={cell.getCellProps().key}
                      >
                        {cell.render("Cell")}
                      </HvTableCell>
                    ))}
                  </HvTableRow>
                );
              })
            ) : (
              <NoDataRow message="Nothing to show" />
            )}
          </HvTableBody>
        </HvTable>
      </HvTableContainer>
      {page?.length ? (
        <HvPagination {...getHvPaginationProps?.()} />
      ) : undefined}
    </HvSection>
  );
};
