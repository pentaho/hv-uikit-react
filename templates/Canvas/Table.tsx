import { useState } from "react";
import useSWR from "swr";
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
  HvTypography,
  useHvData,
  useHvPagination,
  useHvSortBy,
  type HvTableColumnConfig,
} from "@hitachivantara/uikit-react-core";

import { delay } from "./utils";

const EmptyRow = () => (
  <HvTableRow>
    <HvTableCell colSpan={100} />
  </HvTableRow>
);

interface Data {
  column1: string;
  column2: string;
  column3: string;
  column4: string;
  column5: string;
  column6: string;
}

const columns: HvTableColumnConfig<Data, string>[] = [
  { Header: "Column 1", accessor: "column1" },
  { Header: "Column 2", accessor: "column2" },
  { Header: "Column 3", accessor: "column3" },
  { Header: "Column 4", accessor: "column4" },
  { Header: "Column 5", accessor: "column5" },
  { Header: "Column 6", accessor: "column6" },
];

const randomData = [
  "potato",
  "carrot",
  "apple",
  "grape",
  "banana",
  "orange",
  "pineapple",
  "blueberry",
  "tomato",
  "avocado",
  "peach",
  "watermelon",
  "cherry",
  "raspberry",
];

// Simulating data fetching in backend
const fetchData = async (
  limit: number,
): Promise<{ data: Data[]; total: number; pageCount: number }> => {
  await delay(600);
  const total = 30;
  return {
    data: Array.from({ length: limit }).map(() => {
      const random = Math.floor(Math.random() * randomData.length);
      return {
        column1: randomData[random],
        column2: randomData[random],
        column3: randomData[random],
        column4: randomData[random],
        column5: randomData[random],
        column6: randomData[random],
      };
    }),
    total,
    pageCount: Math.ceil(total / limit),
  };
};

const useServerData = (id: string, page = 0, skip = 0, limit = 5) => {
  return useSWR(
    `/data/${id}?page=${page}&skip=${skip}&limit=${limit}`,
    async () => fetchData(limit),
  );
};

interface DataTableProps {
  id: string;
}

export const DataTable = ({ id }: DataTableProps) => {
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useServerData(
    id,
    page,
    page * pageSize,
    pageSize,
  );

  const {
    getTableProps,
    getTableBodyProps,
    getHvPaginationProps,
    prepareRow,
    headerGroups,
    page: pageData,
  } = useHvData<Data, string>(
    {
      columns,
      data: data?.data,
      manualPagination: true,
      initialState: { pageSize, pageIndex: page },
      pageCount: data?.pageCount,
      stateReducer: (newState, action) => {
        switch (action.type) {
          // Triggers a data fetch
          case "init":
          case "gotoPage":
          case "setPageSize":
            setPage(newState.pageIndex ?? 0);
            setPageSize(newState.pageSize ?? 5);
            break;
          default:
            break;
        }
        return newState;
      },
    },
    useHvSortBy,
    useHvPagination,
  );

  const renderTableRow = (i: number) => {
    const row = pageData[i];

    if (!row) return <EmptyRow key={i} />;

    prepareRow(row);

    return (
      <HvTableRow {...row.getRowProps()} key={row.getRowProps().key}>
        {row.cells.map((cell) => (
          <HvTableCell {...cell.getCellProps()} key={cell.getCellProps().key}>
            {cell.render("Cell")}
          </HvTableCell>
        ))}
      </HvTableRow>
    );
  };

  return (
    <HvTableSection
      raisedHeader
      title={<HvTypography variant="label">Preview Data</HvTypography>}
    >
      <HvLoadingContainer hidden={!isLoading}>
        <HvTableContainer tabIndex={0}>
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
              {pageSize && [...Array(pageSize).keys()].map(renderTableRow)}
            </HvTableBody>
          </HvTable>
        </HvTableContainer>
      </HvLoadingContainer>
      {pageData.length > 0 ? (
        <HvPagination
          {...getHvPaginationProps?.()}
          labels={{
            pageSizePrev: "",
            pageSizeEntryName: `of ${data?.total}`,
          }}
        />
      ) : undefined}
    </HvTableSection>
  );
};
