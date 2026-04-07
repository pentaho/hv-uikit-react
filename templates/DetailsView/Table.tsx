import { useEffect, useMemo, useState } from "react";
import {
  HvLoadingContainer,
  HvPagination,
  HvTable,
  HvTableBody,
  HvTableCell,
  HvTableContainer,
  HvTableHead,
  HvTableHeader,
  HvTableRow,
  HvTableSection,
  useHvData,
  useHvPagination,
} from "@hitachivantara/uikit-react-core";

import { usePaginationData, type PaginationDataProps } from "./data";
import { getColumns, type DetailsViewEntry } from "./utils";

const PAGE_OPTIONS = [8, 16, 32];

interface TableProps {
  modelId: string;
}

export const Table = ({ modelId }: TableProps) => {
  const [params, setParams] = useState<PaginationDataProps>({
    id: modelId,
    limit: PAGE_OPTIONS[0],
    skip: 0,
  });

  const {
    data: { pages, data },
    loading,
  } = usePaginationData(params);

  const columns = useMemo(() => getColumns(), []);

  const instance = useHvData<DetailsViewEntry, string>(
    {
      data,
      columns,
      manualPagination: true,
      autoResetPage: false,
      pageCount: pages,
      initialState: { pageSize: PAGE_OPTIONS[0] },
    },
    useHvPagination,
  );

  useEffect(() => {
    const { pageSize = PAGE_OPTIONS[0], pageIndex = 0 } = instance.state;

    setParams((prev) => ({
      ...prev,
      limit: pageSize,
      skip: pageSize * pageIndex,
    }));
  }, [instance.state]);

  return (
    <HvTableSection>
      <HvLoadingContainer hidden={!loading}>
        <HvTableContainer>
          <HvTable {...instance.getTableProps()}>
            <HvTableHead>
              <HvTableRow>
                {columns.map((col) => (
                  <HvTableHeader key={col.Header}>{col.Header}</HvTableHeader>
                ))}
              </HvTableRow>
            </HvTableHead>
            <HvTableBody {...instance.getTableBodyProps()}>
              {instance.page.map((row) => {
                instance.prepareRow(row);
                const { key, ...rowProps } = row.getRowProps();
                return (
                  <HvTableRow key={key} {...rowProps}>
                    {row.cells.map((cell) => {
                      const { key: cellKey, ...cellProps } =
                        cell.getCellProps();
                      return (
                        <HvTableCell key={cellKey} {...cellProps}>
                          {cell.render("Cell")}
                        </HvTableCell>
                      );
                    })}
                  </HvTableRow>
                );
              })}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
        {instance.page?.length > 0 && (
          <HvPagination
            {...instance.getHvPaginationProps?.()}
            pageSizeOptions={PAGE_OPTIONS}
          />
        )}
      </HvLoadingContainer>
    </HvTableSection>
  );
};
